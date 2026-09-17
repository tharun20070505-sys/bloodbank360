const mongoose = require('mongoose');

const donationHistorySchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodRequest'
  },
  bloodBankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodBank'
  },
  bloodGroup: {
    type: String,
    required: true
  },
  unitsDonated: {
    type: Number,
    default: 1
  },
  donationDate: {
    type: Date,
    default: Date.now
  },
  recipientHospital: {
    type: String,
    default: ''
  },
  certificateNumber: {
    type: String,
    unique: true
  },
  notes: {
    type: String,
    default: 'Voluntary Blood Donation'
  }
}, { timestamps: true });

donationHistorySchema.index({ donorId: 1, donationDate: -1 });

module.exports = mongoose.model('DonationHistory', donationHistorySchema);
