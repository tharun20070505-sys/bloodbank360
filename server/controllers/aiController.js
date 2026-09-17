const Donor = require('../models/Donor');
const BloodBank = require('../models/BloodBank');
const BloodInventory = require('../models/BloodInventory');
const BloodRequest = require('../models/BloodRequest');
const aiMatchingService = require('../services/aiMatchingService');

// @desc    Perform comprehensive AI Match Analysis between a request & donor candidates
// @route   POST /api/ai/match-analysis
// @access  Public
exports.getDonorMatchAnalysis = async (req, res, next) => {
  try {
    const { bloodGroup, unitsRequired = 1, latitude, longitude, radius = 20, emergency = false } = req.body;

    const lat = parseFloat(latitude) || 11.0168;
    const lng = parseFloat(longitude) || 76.9558;

    const allowedGroups = aiMatchingService.COMPATIBILITY_RULES[bloodGroup] || [bloodGroup];
    const donors = await Donor.find({
      bloodGroup: { $in: allowedGroups }
    }).populate('userId', 'name').lean();

    const donorsWithDist = donors.map((d) => {
      const dist = aiMatchingService.calculateHaversineDistance([lng, lat], d.location.coordinates);
      return { ...d, distanceKm: dist };
    }).filter(d => d.distanceKm <= radius);

    const scored = await aiMatchingService.rankAndScoreDonors(donorsWithDist, {
      bloodGroup,
      unitsRequired,
      emergency,
      radius
    });

    const triageSummary = aiMatchingService.generateAITriageSummary(
      { bloodGroup, unitsRequired, emergency },
      scored
    );

    res.json({
      success: true,
      analysis: {
        recipientBloodGroup: bloodGroup,
        compatibleDonorGroups: allowedGroups,
        totalEligibleFound: scored.length,
        triageSummary,
        rankedMatches: scored.slice(0, 10).map((d) => ({
          donorId: d._id,
          pseudoName: `Donor #${d._id.toString().slice(-4).toUpperCase()} (${d.userId?.name ? d.userId.name.split(' ')[0] : 'Voluntary'})`,
          bloodGroup: d.bloodGroup,
          distanceKm: d.distanceKm,
          aiScore: d.aiCompatibilityScore,
          matchGrade: d.matchGrade,
          rationale: d.aiRationale,
          readiness: d.readiness,
          city: d.city,
          approximateCoordinates: [
            parseFloat(d.location.coordinates[0].toFixed(2)),
            parseFloat(d.location.coordinates[1].toFixed(2))
          ]
        }))
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get AI Shortage Forecast for inventory across region
// @route   GET /api/ai/shortage-forecast
// @access  Public
exports.getShortageForecast = async (req, res, next) => {
  try {
    const allBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const inventories = await BloodInventory.aggregate([
      {
        $group: {
          _id: '$bloodGroup',
          totalUnits: { $sum: '$unitsAvailable' },
          bankCount: { $sum: 1 }
        }
      }
    ]);

    const stockMap = {};
    inventories.forEach((inv) => {
      stockMap[inv._id] = inv.totalUnits;
    });

    const forecast = allBloodGroups.map((group) => {
      const units = stockMap[group] || 0;
      let riskLevel = 'OPTIMAL';
      let recommendations = 'Maintain standard buffer stocks';

      if (units === 0) {
        riskLevel = 'CRITICAL_DEPLETION';
        recommendations = `Zero stock! Immediate emergency blood drive & targeted donor notifications required for ${group}.`;
      } else if (units < 6) {
        riskLevel = 'HIGH_DEFICIT_RISK';
        recommendations = `Critically low units (${units}). Restrict non-emergency surgical dispatches and alert regional voluntary donors.`;
      } else if (units < 15) {
        riskLevel = 'MODERATE_SUPPLY';
        recommendations = `Adequate short-term supply (${units} units). Schedule weekend collection camps to replenish reserves.`;
      }

      return {
        bloodGroup: group,
        availableUnits: units,
        riskLevel,
        recommendations,
        isUniversalDonor: group === 'O-',
        isUniversalRecipient: group === 'AB+'
      };
    });

    res.json({
      success: true,
      regionalStatus: 'Active Monitoring Enabled',
      forecast
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Informational Donor Self-Screening Assessment
// @route   POST /api/ai/screening-guide
// @access  Public
exports.getInformationalScreeningGuide = async (req, res, next) => {
  try {
    const {
      age,
      weightKg,
      lastDonatedMonthsAgo,
      hasRecentTattooOrPiercing,
      currentMedications,
      hadFeverOrInfectionPastWeek
    } = req.body;

    const screeningNotes = [];
    let isInformationalEligible = true;

    if (age < 18 || age > 65) {
      isInformationalEligible = false;
      screeningNotes.push('Standard voluntary donation age requirement is typically between 18 and 65 years.');
    }

    if (weightKg < 50) {
      isInformationalEligible = false;
      screeningNotes.push('Minimum weight for whole blood donation is 50 kg to ensure donor comfort and safety.');
    }

    if (lastDonatedMonthsAgo !== undefined && lastDonatedMonthsAgo < 3) {
      isInformationalEligible = false;
      screeningNotes.push('Standard donation interval is 90 days (3 months) for whole blood to allow full hemoglobin regeneration.');
    }

    if (hasRecentTattooOrPiercing) {
      isInformationalEligible = false;
      screeningNotes.push('Tattoo or piercing within the past 6-12 months usually involves a temporary deferral period.');
    }

    if (hadFeverOrInfectionPastWeek) {
      isInformationalEligible = false;
      screeningNotes.push('Active fever, antibiotic treatment, or acute infection requires complete recovery before donation.');
    }

    if (screeningNotes.length === 0) {
      screeningNotes.push('You appear to meet standard initial lifestyle and physical screening guidelines!');
    }

    res.json({
      success: true,
      eligible: isInformationalEligible,
      screeningNotes,
      disclaimer: 'This informational screening is not a clinical diagnosis. Final medical qualification is certified by on-site healthcare professionals and authorized blood centers.'
    });
  } catch (err) {
    next(err);
  }
};
