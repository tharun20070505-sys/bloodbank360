const express = require('express');
const router = express.Router();
const { searchBlood, searchBloodBanks, searchDonors } = require('../controllers/searchController');

// Two-stage fallback search
router.get('/blood', searchBlood);
router.get('/blood-banks', searchBloodBanks);
router.get('/donors', searchDonors);

module.exports = router;
