/**
 * AI Matching & Compatibility Engine for BloodConnect 360
 * Combines biological compatibility matrix, geospatial proximity decay,
 * donation interval screening, and natural language triage reasoning.
 */

// Biological Red Blood Cell Compatibility Matrix (Recipient <- Compatible Donors)
const COMPATIBILITY_RULES = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'] // Universal Donor
};

// Check if donor blood is biologically compatible with recipient
const isBiologicallyCompatible = (recipientGroup, donorGroup) => {
  const allowed = COMPATIBILITY_RULES[recipientGroup] || [];
  return allowed.includes(donorGroup);
};

// Calculate Haversine distance in kilometers between two [lon, lat] coordinates
const calculateHaversineDistance = (coord1, coord2) => {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};

// Evaluate donor readiness based on last donation date (Informational Screening)
const evaluateDonationReadiness = (lastDonationDate) => {
  if (!lastDonationDate) {
    return {
      daysSinceLastDonation: null,
      isEligibleInterval: true,
      intervalScore: 100,
      statusMessage: 'Ready to donate (No recent donation recorded)'
    };
  }

  const now = new Date();
  const lastDate = new Date(lastDonationDate);
  const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

  if (diffDays >= 90) {
    return {
      daysSinceLastDonation: diffDays,
      isEligibleInterval: true,
      intervalScore: 100,
      statusMessage: `Fully rested (${diffDays} days since last donation - Safe standard interval)`
    };
  } else if (diffDays >= 56) {
    return {
      daysSinceLastDonation: diffDays,
      isEligibleInterval: true,
      intervalScore: 85,
      statusMessage: `Standard recovery interval met (${diffDays} days ago - Clinical screening recommended)`
    };
  } else {
    return {
      daysSinceLastDonation: diffDays,
      isEligibleInterval: false,
      intervalScore: 40,
      statusMessage: `Recent donation detected (${diffDays} days ago - Mandatory medical deferral review needed)`
    };
  }
};

/**
 * Multi-factor algorithmic ranking for fallback donors
 */
const rankAndScoreDonors = async (donors, requestCriteria) => {
  const { bloodGroup: recipientGroup, unitsRequired = 1, emergency = false, radius = 15 } = requestCriteria;

  const scoredDonors = donors.map((donor) => {
    const isExact = donor.bloodGroup === recipientGroup;
    const isCompatible = isBiologicallyCompatible(recipientGroup, donor.bloodGroup);

    // 1. Biological Compatibility Score (0 - 35 pts)
    let bioScore = 0;
    if (isExact) {
      bioScore = 35;
    } else if (isCompatible) {
      bioScore = 28; // Compatible alternate
    } else {
      bioScore = 0;
    }

    // 2. Proximity Score (0 - 35 pts)
    const distance = donor.distanceKm !== undefined ? donor.distanceKm : 5.0;
    const maxRadius = Math.max(radius, 1);
    const proximityRatio = Math.max(0, 1 - distance / maxRadius);
    const proximityScore = Math.round(proximityRatio * 35);

    // 3. Donation Interval & Health Readiness Score (0 - 20 pts)
    const readiness = evaluateDonationReadiness(donor.lastDonationDate);
    const intervalScore = Math.round((readiness.intervalScore / 100) * 20);

    // 4. Availability & Track Record (0 - 10 pts)
    let trackScore = donor.available ? 8 : 2;
    if (donor.donationCount && donor.donationCount > 2) {
      trackScore = Math.min(10, trackScore + 2);
    }

    // Total Base Score (0 - 100)
    let totalScore = bioScore + proximityScore + intervalScore + trackScore;

    if (emergency) {
      // Emergency multiplier prioritized by proximity
      if (distance < 5) totalScore = Math.min(100, totalScore + 5);
    }

    // Generate AI Smart Rationale
    let matchGrade = 'High Compatibility';
    if (totalScore >= 85) matchGrade = 'Optimal Match (Top Tier)';
    else if (totalScore >= 70) matchGrade = 'Strong Candidate';
    else if (totalScore >= 50) matchGrade = 'Secondary Match';
    else matchGrade = 'Low Compatibility';

    const rationale = `${matchGrade}: ${donor.bloodGroup} ${isExact ? 'exact match' : 'biologically compatible'} located approx. ${distance} km away. ${readiness.statusMessage}. Estimated transit time: ~${Math.max(10, Math.round(distance * 3))} mins.`;

    return {
      ...donor,
      aiCompatibilityScore: totalScore,
      matchGrade,
      distanceKm: distance,
      readiness,
      isExactMatch: isExact,
      aiRationale: rationale
    };
  });

  // Sort descending by AI score, then ascending by distance
  return scoredDonors.sort((a, b) => b.aiCompatibilityScore - a.aiCompatibilityScore || a.distanceKm - b.distanceKm);
};

/**
 * Generates an AI triage summary for a blood request
 */
const generateAITriageSummary = (request, topDonors = []) => {
  const { bloodGroup, unitsRequired, emergency, hospitalName, address } = request;
  const isRareGroup = ['O-', 'AB-', 'B-', 'A-'].includes(bloodGroup);

  let urgencyVerdict = emergency ? 'CRITICAL - IMMEDIATE DISPATCH ADVISED' : 'STANDARD URGENCY - MONITOR RESPONSES';
  let rarityAlert = isRareGroup
    ? `⚠️ Note: Blood group ${bloodGroup} is clinically scarce. Proactive outreach to multiple compatible donors is strongly recommended.`
    : `Standard group availability profile for ${bloodGroup}.`;

  let responseEstimate = topDonors.length > 0
    ? `Identified ${topDonors.length} prospective donors within coordinate boundary. Top candidate distance: ${topDonors[0].distanceKm} km with compatibility index of ${topDonors[0].aiCompatibilityScore}%.`
    : `No registered voluntary donors found within direct search radius. Please expand radius to 25km or activate regional blood bank emergency transfer.`;

  return {
    urgencyVerdict,
    rarityAlert,
    responseEstimate,
    safetyDisclaimer: 'BloodConnect 360 AI provides informational coordination matching only. Final transfusion cross-matching and clinical fitness must be certified by certified blood bank and medical officers.'
  };
};

module.exports = {
  COMPATIBILITY_RULES,
  isBiologicallyCompatible,
  calculateHaversineDistance,
  evaluateDonationReadiness,
  rankAndScoreDonors,
  generateAITriageSummary
};
