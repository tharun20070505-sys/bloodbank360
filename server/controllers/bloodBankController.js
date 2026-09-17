const BloodBank = require('../models/BloodBank');
const BloodInventory = require('../models/BloodInventory');
const BloodRequest = require('../models/BloodRequest');
const Notification = require('../models/Notification');
const socketService = require('../services/socketService');

// @desc    Get all blood banks (with filter & inventory summary)
// @route   GET /api/blood-banks
// @access  Public
exports.getAllBloodBanks = async (req, res, next) => {
  try {
    const { city, verified } = req.query;
    let query = { isActive: true };

    if (city) query.city = new RegExp(city, 'i');
    if (verified !== undefined) query.verified = verified === 'true';

    const bloodBanks = await BloodBank.find(query).sort({ name: 1 }).lean();

    // Attach inventory overview
    const banksWithStock = await Promise.all(
      bloodBanks.map(async (bank) => {
        const inventory = await BloodInventory.find({ bloodBankId: bank._id }).lean();
        const totalUnits = inventory.reduce((acc, curr) => acc + curr.unitsAvailable, 0);
        return {
          ...bank,
          inventory,
          totalUnits
        };
      })
    );

    res.json({
      success: true,
      count: banksWithStock.length,
      bloodBanks: banksWithStock
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single blood bank details
// @route   GET /api/blood-banks/:id
// @access  Public
exports.getBloodBankById = async (req, res, next) => {
  try {
    const bank = await BloodBank.findById(req.params.id);
    if (!bank) {
      return res.status(404).json({ success: false, message: 'Blood Bank not found' });
    }

    const inventory = await BloodInventory.find({ bloodBankId: bank._id });

    res.json({
      success: true,
      bloodBank: bank,
      inventory
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update blood bank profile
// @route   PATCH /api/blood-banks/:id
// @access  Private (BLOOD_BANK or ADMIN)
exports.updateBloodBank = async (req, res, next) => {
  try {
    const bank = await BloodBank.findById(req.params.id);
    if (!bank) {
      return res.status(404).json({ success: false, message: 'Blood Bank not found' });
    }

    if (bank.userId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this blood bank' });
    }

    const fieldsToUpdate = [
      'name', 'address', 'city', 'state', 'phone', 'email', 'helpline', 'operatingHours'
    ];
    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) bank[field] = req.body[field];
    });

    if (req.body.coordinates) {
      bank.location = {
        type: 'Point',
        coordinates: req.body.coordinates
      };
    }

    await bank.save();

    res.json({
      success: true,
      message: 'Blood bank profile updated successfully',
      bloodBank: bank
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get inventory for a blood bank
// @route   GET /api/inventory/:bloodBankId
// @access  Public
exports.getInventory = async (req, res, next) => {
  try {
    const inventory = await BloodInventory.find({ bloodBankId: req.params.bloodBankId });
    res.json({
      success: true,
      count: inventory.length,
      inventory
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update or upsert blood inventory (all groups)
// @route   PATCH /api/inventory/:bloodBankId
// @access  Private (BLOOD_BANK or ADMIN)
exports.updateInventory = async (req, res, next) => {
  try {
    const { bloodGroup, unitsAvailable, componentType, bulkUpdates } = req.body;
    const bank = await BloodBank.findById(req.params.bloodBankId);

    if (!bank) {
      return res.status(404).json({ success: false, message: 'Blood Bank not found' });
    }

    if (bank.userId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this inventory' });
    }

    if (bulkUpdates && Array.isArray(bulkUpdates)) {
      const results = [];
      for (const item of bulkUpdates) {
        const updated = await BloodInventory.findOneAndUpdate(
          { bloodBankId: bank._id, bloodGroup: item.bloodGroup },
          {
            unitsAvailable: item.unitsAvailable,
            componentType: item.componentType || 'Whole Blood',
            lastUpdated: Date.now(),
            updatedBy: req.user._id
          },
          { upsert: true, new: true, runValidators: true }
        );
        results.push(updated);
      }
      return res.json({
        success: true,
        message: 'Bulk inventory updated successfully',
        inventory: results
      });
    }

    if (!bloodGroup || unitsAvailable === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide bloodGroup and unitsAvailable' });
    }

    const updated = await BloodInventory.findOneAndUpdate(
      { bloodBankId: bank._id, bloodGroup },
      {
        unitsAvailable,
        componentType: componentType || 'Whole Blood',
        lastUpdated: Date.now(),
        updatedBy: req.user._id
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: `Inventory for ${bloodGroup} updated to ${unitsAvailable} units`,
      inventoryItem: updated
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get incoming requests matching this blood bank
// @route   GET /api/blood-banks/:id/incoming-requests
// @access  Private
exports.getIncomingRequests = async (req, res, next) => {
  try {
    const bank = await BloodBank.findById(req.params.id);
    if (!bank) {
      return res.status(404).json({ success: false, message: 'Blood Bank not found' });
    }

    // Find requests where this bank is in bloodBankMatches
    const requests = await BloodRequest.find({
      'bloodBankMatches.bloodBankId': bank._id,
      status: { $in: ['PENDING', 'BLOOD_BANK_FOUND', 'SEARCHING'] }
    })
      .populate('requesterId', 'name phone')
      .sort({ emergency: -1, createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (err) {
    next(err);
  }
};
