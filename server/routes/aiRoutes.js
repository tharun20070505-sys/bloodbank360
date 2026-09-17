const express = require('express');
const router = express.Router();
const {
  getDonorMatchAnalysis,
  getShortageForecast,
  getInformationalScreeningGuide
} = require('../controllers/aiController');

router.post('/match-analysis', getDonorMatchAnalysis);
router.get('/shortage-forecast', getShortageForecast);
router.post('/screening-guide', getInformationalScreeningGuide);

module.exports = router;
