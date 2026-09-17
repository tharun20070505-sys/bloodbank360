const express = require('express');
const router = express.Router();
const {
  getDonorProfile,
  updateDonorProfile,
  toggleAvailability,
  getDonorRequests,
  respondToRequest,
  getDonationHistory
} = require('../controllers/donorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/profile', protect, getDonorProfile);
router.post('/profile', protect, updateDonorProfile);
router.patch('/availability', protect, toggleAvailability);
router.get('/requests', protect, getDonorRequests);
router.post('/respond', protect, respondToRequest);
router.get('/history', protect, getDonationHistory);

module.exports = router;
