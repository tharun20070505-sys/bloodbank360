const express = require('express');
const router = express.Router();
const {
  getAllBloodBanks,
  getBloodBankById,
  updateBloodBank,
  getInventory,
  updateInventory,
  getIncomingRequests
} = require('../controllers/bloodBankController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllBloodBanks);
router.get('/:id', getBloodBankById);
router.patch('/:id', protect, authorize('BLOOD_BANK', 'ADMIN'), updateBloodBank);
router.get('/inventory/:bloodBankId', getInventory);
router.patch('/inventory/:bloodBankId', protect, authorize('BLOOD_BANK', 'ADMIN'), updateInventory);
router.get('/:id/incoming-requests', protect, authorize('BLOOD_BANK', 'ADMIN'), getIncomingRequests);

module.exports = router;
