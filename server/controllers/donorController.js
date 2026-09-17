const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const DonorResponse = require('../models/DonorResponse');
const DonationHistory = require('../models/DonationHistory');
const Notification = require('../models/Notification');
const aiMatchingService = require('../services/aiMatchingService');
const socketService = require('../services/socketService');

// @desc    Get donor profile of logged in user
// @route   GET /api/donors/profile
// @access  Private (DONOR or ADMIN)
exports.getDonorProfile = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id }).populate('userId', 'name email phone');
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor profile not found' });
    }

    const readiness = aiMatchingService.evaluateDonationReadiness(donor.lastDonationDate);

    res.json({
      success: true,
      donor,
      readiness
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create or update donor profile
// @route   POST /api/donors/profile
// @access  Private
exports.updateDonorProfile = async (req, res, next) => {
  try {
    const {
      bloodGroup,
      coordinates,
      address,
      city,
      state,
      preferredRadius,
      lastDonationDate,
      weightKg,
      hemoglobin
    } = req.body;

    let donor = await Donor.findOne({ userId: req.user._id });

    if (!donor) {
      donor = new Donor({
        userId: req.user._id,
        bloodGroup: bloodGroup || 'O+'
      });
    }

    if (bloodGroup) donor.bloodGroup = bloodGroup;
    if (coordinates) {
      donor.location = {
        type: 'Point',
        coordinates
      };
    }
    if (address !== undefined) donor.address = address;
    if (city !== undefined) donor.city = city;
    if (state !== undefined) donor.state = state;
    if (preferredRadius !== undefined) donor.preferredRadius = preferredRadius;
    if (lastDonationDate !== undefined) donor.lastDonationDate = lastDonationDate ? new Date(lastDonationDate) : null;
    if (weightKg !== undefined) donor.weightKg = weightKg;
    if (hemoglobin !== undefined) donor.hemoglobin = hemoglobin;

    await donor.save();

    res.json({
      success: true,
      message: 'Donor profile saved successfully',
      donor
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle donor availability status
// @route   PATCH /api/donors/availability
// @access  Private (DONOR)
exports.toggleAvailability = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor profile not found' });
    }

    donor.available = req.body.available !== undefined ? req.body.available : !donor.available;
    await donor.save();

    res.json({
      success: true,
      message: `Availability status set to ${donor.available ? 'Available' : 'Unavailable'}`,
      available: donor.available
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get nearby blood requests matching donor
// @route   GET /api/donors/requests
// @access  Private (DONOR)
exports.getDonorRequests = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor profile not found' });
    }

    // Find requests requiring this blood group or groups this donor can donate to
    const recipientGroups = Object.keys(aiMatchingService.COMPATIBILITY_RULES).filter((recGroup) =>
      aiMatchingService.COMPATIBILITY_RULES[recGroup].includes(donor.bloodGroup)
    );

    const activeRequests = await BloodRequest.find({
      bloodGroup: { $in: recipientGroups },
      status: { $in: ['DONOR_SEARCHING', 'PENDING', 'DONOR_RESPONDED'] }
    })
      .populate('requesterId', 'name phone')
      .lean();

    // Filter by radius & rank
    const matchingRequests = [];
    for (const reqItem of activeRequests) {
      const dist = aiMatchingService.calculateHaversineDistance(
        donor.location.coordinates,
        reqItem.location.coordinates
      );

      const maxRad = Math.max(donor.preferredRadius || 15, reqItem.radius || 15);
      if (dist <= maxRad) {
        // Check existing response if any
        const existingResponse = await DonorResponse.findOne({
          requestId: reqItem._id,
          donorId: donor._id
        }).lean();

        matchingRequests.push({
          ...reqItem,
          distanceKm: dist,
          myResponse: existingResponse ? existingResponse.response : 'NONE'
        });
      }
    }

    matchingRequests.sort((a, b) => {
      // Emergency first, then distance
      if (a.emergency && !b.emergency) return -1;
      if (!a.emergency && b.emergency) return 1;
      return a.distanceKm - b.distanceKm;
    });

    res.json({
      success: true,
      count: matchingRequests.length,
      requests: matchingRequests
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Donor responds to a blood request (ACCEPT / DECLINE)
// @route   POST /api/donors/respond
// @access  Private (DONOR)
exports.respondToRequest = async (req, res, next) => {
  try {
    const { requestId, response, message, estimatedArrivalTimeMins } = req.body;

    if (!['ACCEPTED', 'DECLINED'].includes(response)) {
      return res.status(400).json({ success: false, message: 'Response must be ACCEPTED or DECLINED' });
    }

    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor profile not found' });
    }

    const bloodRequest = await BloodRequest.findById(requestId);
    if (!bloodRequest) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }

    // Save or update response
    const donorResponse = await DonorResponse.findOneAndUpdate(
      { requestId: bloodRequest._id, donorId: donor._id },
      {
        response,
        message: message || '',
        estimatedArrivalTimeMins: estimatedArrivalTimeMins || 30,
        respondedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Update request state
    if (response === 'ACCEPTED') {
      bloodRequest.status = 'DONOR_RESPONDED';
      // Add or update donor in donorMatches
      const existingMatch = bloodRequest.donorMatches.find((m) => m.donorId.toString() === donor._id.toString());
      if (existingMatch) {
        existingMatch.responseStatus = 'ACCEPTED';
      } else {
        bloodRequest.donorMatches.push({
          donorId: donor._id,
          distanceKm: aiMatchingService.calculateHaversineDistance(donor.location.coordinates, bloodRequest.location.coordinates),
          aiCompatibilityScore: 95,
          responseStatus: 'ACCEPTED'
        });
      }
      await bloodRequest.save();

      // Notify the requester
      await Notification.create({
        userId: bloodRequest.requesterId,
        requestId: bloodRequest._id,
        type: 'DONOR_RESPONSE',
        title: `🩸 Donor Accepted Your Request!`,
        message: `A registered voluntary donor (${donor.bloodGroup}) has accepted your request for ${bloodRequest.patientName} at ${bloodRequest.hospitalName}.`
      });

      // Real-time socket alert to requester
      socketService.emitToUser(bloodRequest.requesterId.toString(), 'donor_response_received', {
        requestId: bloodRequest._id,
        donorId: donor._id,
        response: 'ACCEPTED',
        message: message || 'I am ready to donate and heading to the center'
      });
    }

    res.json({
      success: true,
      message: `Your response (${response}) has been recorded. Thank you for supporting life-saving care!`,
      donorResponse
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get donation history and certificates
// @route   GET /api/donors/history
// @access  Private (DONOR)
exports.getDonationHistory = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor profile not found' });
    }

    const history = await DonationHistory.find({ donorId: donor._id })
      .populate('bloodBankId', 'name address')
      .populate('requestId', 'patientName hospitalName')
      .sort({ donationDate: -1 });

    res.json({
      success: true,
      count: history.length,
      history,
      totalDonations: donor.donationCount || history.length
    });
  } catch (err) {
    next(err);
  }
};
