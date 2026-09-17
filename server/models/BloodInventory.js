const mongoose = require('mongoose');

const bloodInventorySchema = new mongoose.Schema({
  bloodBankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodBank',
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  unitsAvailable: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Units available cannot be negative']
  },
  componentType: {
    type: String,
    enum: ['Whole Blood', 'Packed Red Cells', 'Platelets', 'Fresh Frozen Plasma'],
    default: 'Whole Blood'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Prevent duplicate inventory entries for same blood bank + blood group
bloodInventorySchema.index({ bloodBankId: 1, bloodGroup: 1 }, { unique: true });

module.exports = mongoose.model('BloodInventory', bloodInventorySchema);
