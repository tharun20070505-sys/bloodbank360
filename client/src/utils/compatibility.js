export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Recipient can receive from:
export const RECIPIENT_RULES = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'] // Can only receive from O-
};

// Donor can donate to:
export const DONOR_RULES = {
  'A+': ['A+', 'AB+'],
  'A-': ['A+', 'A-', 'AB+', 'AB-'],
  'B+': ['B+', 'AB+'],
  'B-': ['B+', 'B-', 'AB+', 'AB-'],
  'AB+': ['AB+'],
  'AB-': ['AB+', 'AB-'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] // Universal Donor
};

export const RARE_GROUPS = ['O-', 'AB-', 'B-', 'A-'];

export const isCompatible = (recipient, donor) => {
  return (RECIPIENT_RULES[recipient] || []).includes(donor);
};

export const getBloodGroupDetails = (group) => {
  return {
    group,
    isUniversalDonor: group === 'O-',
    isUniversalRecipient: group === 'AB+',
    isRare: RARE_GROUPS.includes(group),
    canReceiveFrom: RECIPIENT_RULES[group] || [],
    canDonateTo: DONOR_RULES[group] || []
  };
};
