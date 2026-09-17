const mongoose = require('mongoose');

const bloodBankSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide blood bank name'],
    trim: true
  },
  registrationNumber: {
    type: String,
    required: [true, 'Please provide official registration number'],
    unique: true,
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Please provide address']
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    default: ''
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    // GeoJSON coordinates are [longitude, latitude]
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0]
    }
  },
  phone: {
    type: String,
    required: [true, 'Please provide primary phone number']
  },
  email: {
    type: String,
    required: [true, 'Please provide official email']
  },
  helpline: {
    type: String,
    default: ''
  },
  operatingHours: {
    type: String,
    default: '24/7 Emergency Service'
  },
  verified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

bloodBankSchema.index({ location: '2dsphere' });
bloodBankSchema.index({ verified: 1, isActive: 1 });

module.exports = mongoose.model('BloodBank', bloodBankSchema);
