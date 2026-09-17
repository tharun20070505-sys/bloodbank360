const express = require('express');
const router = express.Router();
const {
  getStatistics,
  getAllUsers,
  toggleUserStatus,
  getBloodBanks,
  verifyBloodBank,
  getAllRequests,
  getAuditLogs
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/statistics', getStatistics);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.get('/blood-banks', getBloodBanks);
router.patch('/blood-banks/:id/verify', verifyBloodBank);
router.get('/requests', getAllRequests);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
