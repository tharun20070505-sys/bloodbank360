const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getRequestById,
  cancelRequest,
  dispatchDonorRequests,
  completeRequest
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.get('/:id', protect, getRequestById);
router.patch('/:id/cancel', protect, cancelRequest);
router.post('/:id/dispatch-donors', protect, dispatchDonorRequests);
router.patch('/:id/complete', protect, completeRequest);

module.exports = router;
