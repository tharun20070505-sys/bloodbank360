const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodRequest'
  },
  type: {
    type: String,
    enum: [
      'BLOOD_REQUEST',
      'DONOR_RESPONSE',
      'BLOOD_BANK_RESPONSE',
      'REQUEST_COMPLETED',
      'EMERGENCY_REQUEST',
      'SYSTEM'
    ],
    default: 'SYSTEM'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
