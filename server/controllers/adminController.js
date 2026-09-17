const User = require('../models/User');
const Donor = require('../models/Donor');
const BloodBank = require('../models/BloodBank');
const BloodInventory = require('../models/BloodInventory');
const BloodRequest = require('../models/BloodRequest');
const Notification = require('../models/Notification');
const DonationHistory = require('../models/DonationHistory');

// @desc    Get comprehensive system dashboard statistics
// @route   GET /api/admin/statistics
// @access  Private (ADMIN)
exports.getStatistics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await Donor.countDocuments();
    const availableDonors = await Donor.countDocuments({ available: true });
    const totalBloodBanks = await BloodBank.countDocuments();
    const verifiedBloodBanks = await BloodBank.countDocuments({ verified: true });
    const totalRequests = await BloodRequest.countDocuments();
    const activeRequests = await BloodRequest.countDocuments({
      status: { $in: ['PENDING', 'SEARCHING', 'BLOOD_BANK_FOUND', 'DONOR_SEARCHING', 'DONOR_RESPONDED'] }
    });
    const emergencyRequests = await BloodRequest.countDocuments({ emergency: true });
    const completedRequests = await BloodRequest.countDocuments({ status: 'COMPLETED' });
    const totalDonations = await DonationHistory.countDocuments();

    // Inventory aggregation by blood group
    const inventoryStats = await BloodInventory.aggregate([
      {
        $group: {
          _id: '$bloodGroup',
          totalUnits: { $sum: '$unitsAvailable' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Stage breakdown
    const stageStats = await BloodRequest.aggregate([
      {
        $group: {
          _id: '$fulfillmentStage',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalDonors,
        availableDonors,
        totalBloodBanks,
        verifiedBloodBanks,
        totalRequests,
        activeRequests,
        emergencyRequests,
        completedRequests,
        totalDonations,
        inventoryByGroup: inventoryStats,
        stageBreakdown: stageStats
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (ADMIN)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle user active / suspended status
// @route   PATCH /api/admin/users/:id/toggle-status
// @access  Private (ADMIN)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User account is now ${user.isActive ? 'Active' : 'Suspended'}`,
      user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all blood banks for admin review
// @route   GET /api/admin/blood-banks
// @access  Private (ADMIN)
exports.getBloodBanks = async (req, res, next) => {
  try {
    const { verified } = req.query;
    let query = {};
    if (verified !== undefined) query.verified = verified === 'true';

    const bloodBanks = await BloodBank.find(query).populate('userId', 'name email').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bloodBanks.length,
      bloodBanks
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify or unverify a blood bank
// @route   PATCH /api/admin/blood-banks/:id/verify
// @access  Private (ADMIN)
exports.verifyBloodBank = async (req, res, next) => {
  try {
    const bank = await BloodBank.findById(req.params.id);
    if (!bank) {
      return res.status(404).json({ success: false, message: 'Blood bank not found' });
    }

    bank.verified = req.body.verified !== undefined ? req.body.verified : true;
    await bank.save();

    // Notify blood bank admin user
    await Notification.create({
      userId: bank.userId,
      type: 'SYSTEM',
      title: bank.verified ? 'Official Blood Bank Verification Approved' : 'Verification Revoked',
      message: bank.verified
        ? `Congratulations! ${bank.name} is now verified as an authorized blood provider on BloodConnect 360.`
        : `Your blood bank verification status has been updated by administration.`
    });

    res.json({
      success: true,
      message: `Blood bank verified status set to ${bank.verified}`,
      bloodBank: bank
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all requests across the system
// @route   GET /api/admin/requests
// @access  Private (ADMIN)
exports.getAllRequests = async (req, res, next) => {
  try {
    const { status, emergency, stage } = req.query;
    let query = {};
    if (status) query.status = status;
    if (emergency !== undefined) query.emergency = emergency === 'true';
    if (stage) query.fulfillmentStage = stage;

    const requests = await BloodRequest.find(query)
      .populate('requesterId', 'name email phone')
      .populate('bloodBankMatches.bloodBankId', 'name city')
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

// @desc    Get audit logs / activity history
// @route   GET /api/admin/audit-logs
// @access  Private (ADMIN)
exports.getAuditLogs = async (req, res, next) => {
  try {
    const notifications = await Notification.find()
      .populate('userId', 'name email role')
      .populate('requestId', 'bloodGroup unitsRequired hospitalName')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      logs: notifications
    });
  } catch (err) {
    next(err);
  }
};
