const BloodRequest = require('../models/BloodRequest');
const BloodBank = require('../models/BloodBank');
const BloodInventory = require('../models/BloodInventory');
const Donor = require('../models/Donor');
const DonorResponse = require('../models/DonorResponse');
const Notification = require('../models/Notification');
const DonationHistory = require('../models/DonationHistory');
const aiMatchingService = require('../services/aiMatchingService');
const socketService = require('../services/socketService');

// @desc    Create a new blood request (runs two-stage evaluation)
// @route   POST /api/requests
// @access  Private (PATIENT or ADMIN)
exports.createRequest = async (req, res, next) => {
  try {
    const {
      patientName,
      hospitalName,
      bloodGroup,
      unitsRequired = 1,
      latitude,
      longitude,
      address,
      radius = 15,
      emergency = false,
      notes
    } = req.body;

    const lat = parseFloat(latitude) || 11.0168;
    const lng = parseFloat(longitude) || 76.9558;

    // Stage 1: Evaluate blood banks
    const banks = await BloodBank.find({ isActive: true }).lean();
    const bankMatches = [];
    let sufficientBankFound = false;

    for (const bank of banks) {
      const dist = aiMatchingService.calculateHaversineDistance([lng, lat], bank.location.coordinates);
      if (dist <= radius) {
        const inventory = await BloodInventory.findOne({
          bloodBankId: bank._id,
          bloodGroup
        }).lean();

        const units = inventory ? inventory.unitsAvailable : 0;
        if (units > 0) {
          bankMatches.push({
            bloodBankId: bank._id,
            name: bank.name,
            distanceKm: dist,
            availableUnits: units,
            status: units >= unitsRequired ? 'SUFFICIENT_STOCK' : 'PARTIAL_STOCK'
          });
          if (units >= unitsRequired) {
            sufficientBankFound = true;
          }
        }
      }
    }

    bankMatches.sort((a, b) => a.distanceKm - b.distanceKm);

    // If no sufficient bank, prepare Stage 2 donor matches
    let donorMatches = [];
    let initialStatus = 'PENDING';
    let stage = 'STAGE_1_BLOOD_BANK';

    if (sufficientBankFound) {
      initialStatus = 'BLOOD_BANK_FOUND';
      stage = 'STAGE_1_BLOOD_BANK';
    } else {
      initialStatus = 'DONOR_SEARCHING';
      stage = 'STAGE_2_DONOR_FALLBACK';

      // Find compatible donors in radius
      const allowedGroups = aiMatchingService.COMPATIBILITY_RULES[bloodGroup] || [bloodGroup];
      const donors = await Donor.find({
        available: true,
        bloodGroup: { $in: allowedGroups }
      }).lean();

      const candidateDonors = donors
        .map((d) => {
          const dist = aiMatchingService.calculateHaversineDistance([lng, lat], d.location.coordinates);
          return { ...d, distanceKm: dist };
        })
        .filter((d) => d.distanceKm <= radius);

      const scoredDonors = await aiMatchingService.rankAndScoreDonors(candidateDonors, {
        bloodGroup,
        unitsRequired,
        emergency,
        radius
      });

      donorMatches = scoredDonors.slice(0, 10).map((d) => ({
        donorId: d._id,
        distanceKm: d.distanceKm,
        aiCompatibilityScore: d.aiCompatibilityScore,
        aiRationale: d.aiRationale,
        responseStatus: 'PENDING'
      }));
    }

    const bloodRequest = await BloodRequest.create({
      requesterId: req.user._id,
      patientName,
      hospitalName,
      bloodGroup,
      unitsRequired,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      address,
      radius,
      emergency,
      urgencyLevel: emergency ? 'CRITICAL_EMERGENCY' : 'NORMAL',
      status: initialStatus,
      fulfillmentStage: stage,
      bloodBankMatches: bankMatches,
      donorMatches,
      notes: notes || ''
    });

    // Notify requester
    await Notification.create({
      userId: req.user._id,
      requestId: bloodRequest._id,
      type: emergency ? 'EMERGENCY_REQUEST' : 'BLOOD_REQUEST',
      title: `Blood Request Created: ${bloodGroup} (${unitsRequired} Units)`,
      message: sufficientBankFound
        ? `Sufficient blood stock was located in nearby blood bank(s). Please review matching banks.`
        : `Nearby blood banks had insufficient stock. Automatic donor fallback has activated for ${bloodGroup}.`
    });

    // If emergency, broadcast via Socket.IO
    if (emergency) {
      socketService.broadcastEmergency({
        requestId: bloodRequest._id,
        bloodGroup,
        unitsRequired,
        hospitalName,
        address,
        stage
      });
    }

    res.status(201).json({
      success: true,
      request: bloodRequest
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get requests created by logged in user
// @route   GET /api/requests/my
// @access  Private (PATIENT or ADMIN)
exports.getMyRequests = async (req, res, next) => {
  try {
    const requests = await BloodRequest.find({ requesterId: req.user._id })
      .populate('bloodBankMatches.bloodBankId', 'name phone address email verified')
      .populate('donorMatches.donorId', 'bloodGroup city available')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single request by ID with full details & response feed
// @route   GET /api/requests/:id
// @access  Private
exports.getRequestById = async (req, res, next) => {
  try {
    const bloodRequest = await BloodRequest.findById(req.params.id)
      .populate('requesterId', 'name email phone')
      .populate('bloodBankMatches.bloodBankId', 'name phone address email helpline operatingHours verified location')
      .populate({
        path: 'donorMatches.donorId',
        populate: { path: 'userId', select: 'name' }
      });

    if (!bloodRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Retrieve donor responses
    const responses = await DonorResponse.find({ requestId: bloodRequest._id })
      .populate({
        path: 'donorId',
        populate: { path: 'userId', select: 'name phone email' }
      })
      .sort({ respondedAt: -1 });

    res.json({
      success: true,
      request: bloodRequest,
      donorResponses: responses
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel a blood request
// @route   PATCH /api/requests/:id/cancel
// @access  Private
exports.cancelRequest = async (req, res, next) => {
  try {
    const bloodRequest = await BloodRequest.findById(req.params.id);

    if (!bloodRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Ensure requester or admin
    if (bloodRequest.requesterId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this request' });
    }

    bloodRequest.status = 'CANCELLED';
    await bloodRequest.save();

    await Notification.create({
      userId: bloodRequest.requesterId,
      requestId: bloodRequest._id,
      title: 'Blood Request Cancelled',
      message: `Your request for ${bloodRequest.bloodGroup} has been marked as cancelled.`
    });

    res.json({
      success: true,
      message: 'Request cancelled successfully',
      request: bloodRequest
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Dispatch request to fallback donors
// @route   POST /api/requests/:id/dispatch-donors
// @access  Private
exports.dispatchDonorRequests = async (req, res, next) => {
  try {
    const { donorIds } = req.body;
    const bloodRequest = await BloodRequest.findById(req.params.id);

    if (!bloodRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    bloodRequest.status = 'DONOR_SEARCHING';
    bloodRequest.fulfillmentStage = 'STAGE_2_DONOR_FALLBACK';
    await bloodRequest.save();

    // Create notifications for matched donors
    const targetDonors = await Donor.find({ _id: { $in: donorIds } }).populate('userId');
    for (const donor of targetDonors) {
      if (donor.userId) {
        await Notification.create({
          userId: donor.userId._id,
          requestId: bloodRequest._id,
          type: bloodRequest.emergency ? 'EMERGENCY_REQUEST' : 'BLOOD_REQUEST',
          title: `🩸 Urgent Blood Needed: ${bloodRequest.bloodGroup}`,
          message: `Patient at ${bloodRequest.hospitalName} urgently requires ${bloodRequest.unitsRequired} unit(s) of ${bloodRequest.bloodGroup} within your area.`
        });

        socketService.emitToUser(donor.userId._id.toString(), 'new_blood_request', {
          requestId: bloodRequest._id,
          bloodGroup: bloodRequest.bloodGroup,
          units: bloodRequest.unitsRequired,
          hospital: bloodRequest.hospitalName,
          emergency: bloodRequest.emergency
        });
      }
    }

    res.json({
      success: true,
      message: `Dispatched blood notifications to ${targetDonors.length} registered donors.`,
      request: bloodRequest
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark blood request as completed / fulfilled
// @route   PATCH /api/requests/:id/complete
// @access  Private
exports.completeRequest = async (req, res, next) => {
  try {
    const { fulfillingEntity, entityId, notes } = req.body;
    const bloodRequest = await BloodRequest.findById(req.params.id);

    if (!bloodRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    bloodRequest.status = 'COMPLETED';
    if (fulfillingEntity) {
      bloodRequest.acceptedEntity = {
        entityType: fulfillingEntity.type, // 'BLOOD_BANK' or 'DONOR'
        id: entityId,
        name: fulfillingEntity.name,
        phone: fulfillingEntity.phone,
        acceptedAt: new Date()
      };
    }
    await bloodRequest.save();

    // If fulfilled by donor, generate donation history entry
    if (fulfillingEntity && fulfillingEntity.type === 'DONOR') {
      const donor = await Donor.findById(entityId);
      if (donor) {
        donor.donationCount = (donor.donationCount || 0) + 1;
        donor.lastDonationDate = new Date();
        await donor.save();

        await DonationHistory.create({
          donorId: donor._id,
          userId: donor.userId,
          requestId: bloodRequest._id,
          bloodGroup: bloodRequest.bloodGroup,
          unitsDonated: bloodRequest.unitsRequired,
          recipientHospital: bloodRequest.hospitalName,
          certificateNumber: `BC360-CERT-${Date.now().toString().slice(-6)}`,
          notes: notes || 'Voluntary donor fulfilled emergency request'
        });
      }
    }

    res.json({
      success: true,
      message: 'Blood request marked as successfully completed',
      request: bloodRequest
    });
  } catch (err) {
    next(err);
  }
};
