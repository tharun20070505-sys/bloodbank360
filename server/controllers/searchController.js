const BloodBank = require('../models/BloodBank');
const BloodInventory = require('../models/BloodInventory');
const Donor = require('../models/Donor');
const aiMatchingService = require('../services/aiMatchingService');

/**
 * Helper: Find blood banks within radius using GeoJSON coordinates [lng, lat]
 */
const findBloodBanksWithinRadius = async (lng, lat, radiusKm) => {
  // 1 degree latitude is approx 111km; MongoDB $nearSphere with spherical: true
  // radius in radians = radiusKm / 6378.1
  const radiusInRadians = radiusKm / 6378.1;

  try {
    const banks = await BloodBank.find({
      isActive: true,
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radiusInRadians]
        }
      }
    }).lean();

    return banks.map((bank) => {
      const dist = aiMatchingService.calculateHaversineDistance([lng, lat], bank.location.coordinates);
      return { ...bank, distanceKm: dist };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  } catch (err) {
    // Fallback: in case 2dsphere index is still building, query all active and filter
    const allBanks = await BloodBank.find({ isActive: true }).lean();
    return allBanks
      .map((bank) => {
        const dist = aiMatchingService.calculateHaversineDistance([lng, lat], bank.location.coordinates);
        return { ...bank, distanceKm: dist };
      })
      .filter((b) => b.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }
};

/**
 * Helper: Find donors within radius
 */
const findDonorsWithinRadius = async (lng, lat, radiusKm, bloodGroup) => {
  const radiusInRadians = radiusKm / 6378.1;

  // Identify compatible donor groups for this recipient
  const allowedDonorGroups = aiMatchingService.COMPATIBILITY_RULES[bloodGroup] || [bloodGroup];

  let query = {
    available: true,
    bloodGroup: { $in: allowedDonorGroups }
  };

  try {
    const donors = await Donor.find({
      ...query,
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radiusInRadians]
        }
      }
    })
      .populate('userId', 'name')
      .lean();

    return donors.map((donor) => {
      const dist = aiMatchingService.calculateHaversineDistance([lng, lat], donor.location.coordinates);
      return { ...donor, distanceKm: dist };
    }).filter((d) => d.distanceKm <= radiusKm);
  } catch (err) {
    const allDonors = await Donor.find(query).populate('userId', 'name').lean();
    return allDonors
      .map((donor) => {
        const dist = aiMatchingService.calculateHaversineDistance([lng, lat], donor.location.coordinates);
        return { ...donor, distanceKm: dist };
      })
      .filter((d) => d.distanceKm <= radiusKm);
  }
};

// @desc    Execute Two-Stage Blood Availability Search
// @route   GET /api/search/blood
// @access  Public
exports.searchBlood = async (req, res, next) => {
  try {
    const {
      units = 1,
      latitude,
      longitude,
      radius = 15,
      emergency = false
    } = req.query;

    const rawBloodGroup = req.query.bloodGroup;
    if (!rawBloodGroup) {
      return res.status(400).json({ success: false, message: 'Blood group is required' });
    }
    const bloodGroup = rawBloodGroup.replace(/ /g, '+').trim();

    const lat = parseFloat(latitude) || 11.0168; // Default Coimbatore / center
    const lng = parseFloat(longitude) || 76.9558;
    const requiredUnits = parseInt(units, 10) || 1;
    const searchRadius = parseFloat(radius) || 15;
    const isEmergency = emergency === 'true' || emergency === true;

    // ==========================================
    // STAGE 1: SEARCH NEARBY BLOOD BANKS
    // ==========================================
    const nearbyBanks = await findBloodBanksWithinRadius(lng, lat, searchRadius);

    const bloodBankResults = [];
    let totalAvailableUnitsInRadius = 0;

    for (const bank of nearbyBanks) {
      const inventory = await BloodInventory.findOne({
        bloodBankId: bank._id,
        bloodGroup: bloodGroup
      }).lean();

      const availableUnits = inventory ? inventory.unitsAvailable : 0;
      totalAvailableUnitsInRadius += availableUnits;

      if (availableUnits > 0) {
        bloodBankResults.push({
          bloodBank: {
            _id: bank._id,
            name: bank.name,
            registrationNumber: bank.registrationNumber,
            address: bank.address,
            city: bank.city,
            phone: bank.phone,
            email: bank.email,
            helpline: bank.helpline,
            operatingHours: bank.operatingHours,
            verified: bank.verified,
            location: bank.location
          },
          bloodGroup,
          availableUnits,
          sufficientForRequest: availableUnits >= requiredUnits,
          distanceKm: bank.distanceKm,
          status: availableUnits >= requiredUnits ? 'SUFFICIENT_STOCK' : 'PARTIAL_STOCK'
        });
      }
    }

    // Check if at least one blood bank satisfies the required units
    const fullySufficientBanks = bloodBankResults.filter(b => b.sufficientForRequest);

    if (fullySufficientBanks.length > 0) {
      // SUCCESS STAGE 1: Found sufficient inventory in registered blood banks
      return res.json({
        success: true,
        stage: 'STAGE_1_BLOOD_BANKS',
        fallbackTriggered: false,
        message: `Found ${fullySufficientBanks.length} nearby blood bank(s) with sufficient stock for ${requiredUnits} unit(s) of ${bloodGroup}.`,
        query: { bloodGroup, units: requiredUnits, radius: searchRadius, latitude: lat, longitude: lng, emergency: isEmergency },
        bloodBanks: bloodBankResults,
        sufficientCount: fullySufficientBanks.length,
        totalAvailableUnits: totalAvailableUnitsInRadius
      });
    }

    // =======================================================
    // STAGE 2: AUTOMATIC FALLBACK TO NEARBY VOLUNTARY DONORS
    // =======================================================
    // Reason: No bank within radius has sufficient units
    const candidateDonors = await findDonorsWithinRadius(lng, lat, searchRadius, bloodGroup);

    // Rank donors using AI Matching & Biological Compatibility Algorithm
    const rankedDonors = await aiMatchingService.rankAndScoreDonors(candidateDonors, {
      bloodGroup,
      unitsRequired: requiredUnits,
      emergency: isEmergency,
      radius: searchRadius
    });

    // Anonymize/Protect sensitive donor information (no phone/email/exact street address)
    const protectedDonors = rankedDonors.map((donor, idx) => {
      const approxCoords = [
        parseFloat(donor.location.coordinates[0].toFixed(2)),
        parseFloat(donor.location.coordinates[1].toFixed(2))
      ];

      return {
        _id: donor._id,
        pseudoName: `Donor #${donor._id.toString().slice(-4).toUpperCase()} (${donor.userId?.name ? donor.userId.name.split(' ')[0] : 'Voluntary'})`,
        bloodGroup: donor.bloodGroup,
        isExactMatch: donor.isExactMatch,
        distanceKm: donor.distanceKm,
        available: donor.available,
        aiCompatibilityScore: donor.aiCompatibilityScore,
        matchGrade: donor.matchGrade,
        aiRationale: donor.aiRationale,
        readiness: donor.readiness,
        city: donor.city || 'Nearby Community',
        approximateLocation: {
          type: 'Point',
          coordinates: approxCoords
        },
        donationCount: donor.donationCount || 0,
        badges: donor.badges || ['Verified Donor']
      };
    });

    return res.json({
      success: true,
      stage: 'STAGE_2_DONOR_FALLBACK',
      fallbackTriggered: true,
      reason: bloodBankResults.length > 0
        ? `Nearby blood banks have only ${totalAvailableUnitsInRadius} unit(s), which is less than the required ${requiredUnits} unit(s).`
        : `No nearby blood banks currently have ${bloodGroup} blood in stock within ${searchRadius} km.`,
      systemNotice: 'No sufficient blood stock was found in nearby blood banks. Searching registered voluntary donors near you...',
      query: { bloodGroup, units: requiredUnits, radius: searchRadius, latitude: lat, longitude: lng, emergency: isEmergency },
      partialBloodBanks: bloodBankResults,
      donors: protectedDonors,
      totalDonorsFound: protectedDonors.length
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search all blood banks directly
// @route   GET /api/search/blood-banks
// @access  Public
exports.searchBloodBanks = async (req, res, next) => {
  try {
    const rawBloodGroup = req.query.bloodGroup;
    const bloodGroup = rawBloodGroup ? rawBloodGroup.trim().replace(/ /g, '+') : null;
    const lat = parseFloat(latitude) || 11.0168;
    const lng = parseFloat(longitude) || 76.9558;
    const searchRadius = parseFloat(radius) || 25;

    const banks = await findBloodBanksWithinRadius(lng, lat, searchRadius);

    // Fetch stock for each bank
    const banksWithStock = await Promise.all(
      banks.map(async (bank) => {
        let stockQuery = { bloodBankId: bank._id };
        if (bloodGroup) stockQuery.bloodGroup = bloodGroup;

        const inventory = await BloodInventory.find(stockQuery).lean();
        return {
          ...bank,
          inventory
        };
      })
    );

    res.json({
      success: true,
      count: banksWithStock.length,
      bloodBanks: banksWithStock
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search donors directory (public discovery overview)
// @route   GET /api/search/donors
// @access  Public
exports.searchDonors = async (req, res, next) => {
  try {
    const { bloodGroup, city } = req.query;
    let query = { available: true };
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (city) query.city = new RegExp(city, 'i');

    const donors = await Donor.find(query)
      .select('bloodGroup city state available preferredRadius donationCount badges')
      .limit(30)
      .lean();

    res.json({
      success: true,
      count: donors.length,
      donors: donors.map((d) => ({
        _id: d._id,
        bloodGroup: d.bloodGroup,
        city: d.city,
        state: d.state,
        available: d.available,
        donationCount: d.donationCount,
        badges: d.badges
      }))
    });
  } catch (err) {
    next(err);
  }
};
