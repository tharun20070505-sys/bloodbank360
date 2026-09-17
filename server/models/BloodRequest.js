const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: [true, 'Please provide patient name'],
    trim: true
  },
  hospitalName: {
    type: String,
    required: [true, 'Please provide hospital name/location'],
    trim: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: [true, 'Please specify blood group']
  },
  unitsRequired: {
    type: Number,
    required: [true, 'Please specify units required'],
    min: [1, 'Minimum 1 unit required'],
    default: 1
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
    required: [true, 'Please provide address or landmark']
  },
  radius: {
    type: Number,
    default: 10 // search radius in km
  },
  emergency: {
    type: Boolean,
    default: false
  },
  urgencyLevel: {
    type: String,
    enum: ['NORMAL', 'URGENT', 'CRITICAL_EMERGENCY'],
    default: 'NORMAL'
  },
  status: {
    type: String,
    enum: [
      'PENDING',
      'SEARCHING',
      'BLOOD_BANK_FOUND',
      'DONOR_SEARCHING',
      'DONOR_RESPONDED',
      'ACCEPTED',
      'CONTACTED',
      'COMPLETED',
      'CANCELLED',
      'EXPIRED'
    ],
    default: 'PENDING'
  },
  fulfillmentStage: {
    type: String,
    enum: ['STAGE_1_BLOOD_BANK', 'STAGE_2_DONOR_FALLBACK', 'MANUAL_COORDINATION'],
    default: 'STAGE_1_BLOOD_BANK'
  },
  bloodBankMatches: [{
    bloodBankId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodBank' },
    name: String,
    distanceKm: Number,
    availableUnits: Number,
    status: { type: String, default: 'AVAILABLE' }
  }],
  donorMatches: [{
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
    distanceKm: Number,
    aiCompatibilityScore: Number,
    aiRationale: String,
    responseStatus: { type: String, enum: ['PENDING', 'ACCEPTED', 'DECLINED'], default: 'PENDING' }
  }],
  acceptedEntity: {
    entityType: { type: String, enum: ['BLOOD_BANK', 'DONOR'] },
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    phone: String,
    acceptedAt: Date
  },
  notes: {
    type: String,
    default: ''
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours default
  }
}, { timestamps: true });

bloodRequestSchema.index({ location: '2dsphere' });
bloodRequestSchema.index({ requesterId: 1, status: 1 });
bloodRequestSchema.index({ bloodGroup: 1, emergency: 1, status: 1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
