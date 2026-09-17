const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: [true, 'Please specify blood group']
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
  address: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  available: {
    type: Boolean,
    default: true
  },
  preferredRadius: {
    type: Number,
    default: 15 // in kilometers
  },
  lastDonationDate: {
    type: Date,
    default: null
  },
  verified: {
    type: Boolean,
    default: true
  },
  weightKg: {
    type: Number,
    default: 65
  },
  hemoglobin: {
    type: Number,
    default: 14.5
  },
  donationCount: {
    type: Number,
    default: 0
  },
  badges: [{
    type: String
  }]
}, { timestamps: true });

donorSchema.index({ location: '2dsphere' });
donorSchema.index({ bloodGroup: 1, available: 1 });

module.exports = mongoose.model('Donor', donorSchema);
