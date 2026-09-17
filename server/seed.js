const mongoose = require('mongoose');
const User = require('./models/User');
const Donor = require('./models/Donor');
const BloodBank = require('./models/BloodBank');
const BloodInventory = require('./models/BloodInventory');
const BloodRequest = require('./models/BloodRequest');
const DonorResponse = require('./models/DonorResponse');
const Notification = require('./models/Notification');
const DonationHistory = require('./models/DonationHistory');

const seedData = async () => {
  console.log('🌱 Starting BloodConnect 360 Database Seeding...');

  // Check if data already exists
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log(`ℹ️ Database already contains ${userCount} users. Clearing existing records for fresh seed...`);
    await Promise.all([
      User.deleteMany({}),
      Donor.deleteMany({}),
      BloodBank.deleteMany({}),
      BloodInventory.deleteMany({}),
      BloodRequest.deleteMany({}),
      DonorResponse.deleteMany({}),
      Notification.deleteMany({}),
      DonationHistory.deleteMany({})
    ]);
  }

  // 1. Create Core Users for all 4 roles
  const admin = await User.create({
    name: 'Chief Medical Administrator',
    email: 'admin@bloodconnect.org',
    password: 'Password@123',
    phone: '+91 98401 23456',
    role: 'ADMIN',
    isActive: true
  });

  const patient = await User.create({
    name: 'Priya Sundaram',
    email: 'patient@bloodconnect.org',
    password: 'Password@123',
    phone: '+91 94432 10987',
    role: 'PATIENT',
    isActive: true
  });

  const donorUser = await User.create({
    name: 'Karthik Raja (O- Universal Donor)',
    email: 'donor@bloodconnect.org',
    password: 'Password@123',
    phone: '+91 97890 54321',
    role: 'DONOR',
    isActive: true
  });

  const bankUser = await User.create({
    name: 'Director of Blood Services',
    email: 'bloodbank@bloodconnect.org',
    password: 'Password@123',
    phone: '+91 422 222 3344',
    role: 'BLOOD_BANK',
    isActive: true
  });

  console.log('✅ Core Role Accounts Created (Password: Password@123):');
  console.log('   - ADMIN:      admin@bloodconnect.org');
  console.log('   - PATIENT:    patient@bloodconnect.org');
  console.log('   - DONOR:      donor@bloodconnect.org');
  console.log('   - BLOOD_BANK: bloodbank@bloodconnect.org');

  // 2. Create Blood Banks with Realistic Coordinates (Coimbatore Medical Hub)
  const banksData = [
    {
      userId: bankUser._id,
      name: 'Coimbatore Medical College Blood Center',
      registrationNumber: 'BB-TN-CBE-001',
      address: 'Trichy Road, Sungam Bypass',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      location: { type: 'Point', coordinates: [76.9678, 11.0012] },
      phone: '+91 422 230 1393',
      email: 'cmch.bloodbank@tn.gov.in',
      helpline: '1800-425-4422',
      operatingHours: '24/7 Round-the-Clock Emergency Service',
      verified: true
    },
    {
      userId: admin._id,
      name: 'KMCH Hospital & Research Blood Bank',
      registrationNumber: 'BB-TN-CBE-002',
      address: '99 Avanashi Road, Civil Aerodrome Post',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      location: { type: 'Point', coordinates: [77.0423, 11.0321] },
      phone: '+91 422 432 3800',
      email: 'bloodbank@kmchhospitals.com',
      helpline: '0422-4323999',
      operatingHours: '24/7 Full Component Facility',
      verified: true
    },
    {
      userId: admin._id,
      name: 'KG Hospital Blood Bank & Transfusion Medicine',
      registrationNumber: 'BB-TN-CBE-003',
      address: 'Arts College Road, Gopalapuram',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      location: { type: 'Point', coordinates: [76.9712, 11.0084] },
      phone: '+91 422 221 2121',
      email: 'bloodtransfusion@kghospital.com',
      helpline: '108 / 0422-2212121',
      operatingHours: '24/7 Emergency Wing',
      verified: true
    },
    {
      userId: admin._id,
      name: 'PSG Hospitals Voluntary Blood Bank',
      registrationNumber: 'BB-TN-CBE-004',
      address: 'Peelamedu, Avinashi Road',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      location: { type: 'Point', coordinates: [77.0028, 11.0264] },
      phone: '+91 422 257 0170',
      email: 'bloodbank@psghospitals.com',
      helpline: '0422-4345353',
      operatingHours: '24/7 Emergency & Apheresis Service',
      verified: true
    },
    {
      userId: admin._id,
      name: 'Rotary Metro Life Blood Bank',
      registrationNumber: 'BB-TN-CBE-005',
      address: 'Brookefields Road, R.S. Puram',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      location: { type: 'Point', coordinates: [76.9530, 11.0089] },
      phone: '+91 422 254 7799',
      email: 'service@rotarymetroblood.org',
      helpline: '0422-2547790',
      operatingHours: '8:00 AM - 10:00 PM (Emergency on call)',
      verified: true
    }
  ];

  const createdBanks = await BloodBank.insertMany(banksData);
  console.log(`✅ Created ${createdBanks.length} Verified Blood Banks`);

  // 3. Create Blood Inventories
  // Note: We deliberately set low/zero stock for rare groups (O-, AB-) in bank 0
  // to showcase the Two-Stage Fallback immediately in demonstrations!
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const inventoryRecords = [];

  createdBanks.forEach((bank, idx) => {
    bloodGroups.forEach((bg) => {
      let units = 5;
      if (bg === 'B+' || bg === 'O+') units = 12 + (idx * 2);
      if (bg === 'A+') units = 8 + idx;
      if (bg === 'A-') units = 3;
      if (bg === 'B-') units = 2;
      if (bg === 'AB+') units = 6;
      if (bg === 'AB-') units = idx === 0 ? 0 : 1; // 0 in primary bank
      if (bg === 'O-') units = idx === 0 ? 0 : 2;  // 0 in primary bank! Trigger fallback!

      inventoryRecords.push({
        bloodBankId: bank._id,
        bloodGroup: bg,
        unitsAvailable: units,
        componentType: 'Whole Blood',
        lastUpdated: new Date(),
        updatedBy: admin._id
      });
    });
  });

  await BloodInventory.insertMany(inventoryRecords);
  console.log(`✅ Created ${inventoryRecords.length} Blood Inventory Units Matrix`);

  // 4. Create 15+ Voluntary Registered Donors
  const donorProfiles = [
    {
      user: donorUser,
      bloodGroup: 'O-',
      coordinates: [76.9580, 11.0180],
      address: 'Gandhipuram 5th Street',
      city: 'Coimbatore',
      preferredRadius: 20,
      lastDonationDate: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000), // 110 days ago (Fully eligible)
      available: true,
      donationCount: 6,
      badges: ['Golden Lifesaver', 'Universal Hero', 'Rapid Responder']
    }
  ];

  const otherDonorsData = [
    { name: 'Dr. Anand Raman', email: 'anand.donor@example.com', bg: 'O-', coords: [76.9750, 11.0250], city: 'Coimbatore', daysAgo: 140, count: 8, avail: true },
    { name: 'Meera Krishnan', email: 'meera.donor@example.com', bg: 'O+', coords: [76.9620, 11.0090], city: 'Coimbatore', daysAgo: 95, count: 4, avail: true },
    { name: 'Sanjay Varma', email: 'sanjay.donor@example.com', bg: 'B+', coords: [76.9850, 11.0120], city: 'Coimbatore', daysAgo: 65, count: 3, avail: true },
    { name: 'Naveen Kumar', email: 'naveen.donor@example.com', bg: 'A+', coords: [77.0100, 11.0280], city: 'Coimbatore', daysAgo: 180, count: 5, avail: true },
    { name: 'Kavitha Mohan', email: 'kavitha.donor@example.com', bg: 'AB-', coords: [76.9510, 11.0310], city: 'Coimbatore', daysAgo: 100, count: 2, avail: true },
    { name: 'Arun Prakash', email: 'arun.donor@example.com', bg: 'A-', coords: [76.9690, 10.9980], city: 'Coimbatore', daysAgo: 70, count: 3, avail: true },
    { name: 'Divya Balaji', email: 'divya.donor@example.com', bg: 'B-', coords: [77.0300, 11.0350], city: 'Coimbatore', daysAgo: 120, count: 4, avail: true },
    { name: 'Ramesh Sundar', email: 'ramesh.donor@example.com', bg: 'O-', coords: [76.9420, 11.0150], city: 'Coimbatore', daysAgo: 92, count: 7, avail: true },
    { name: 'Sneha Rangarajan', email: 'sneha.donor@example.com', bg: 'AB+', coords: [76.9920, 11.0190], city: 'Coimbatore', daysAgo: 85, count: 2, avail: true },
    { name: 'Vigneshwaran M', email: 'vignesh.donor@example.com', bg: 'B+', coords: [76.9610, 11.0420], city: 'Coimbatore', daysAgo: 200, count: 9, avail: true },
    { name: 'Pooja Sethi', email: 'pooja.donor@example.com', bg: 'O+', coords: [76.9800, 11.0040], city: 'Coimbatore', daysAgo: 110, count: 3, avail: true },
    { name: 'Deepak Chandran', email: 'deepak.donor@example.com', bg: 'A+', coords: [76.9350, 11.0220], city: 'Coimbatore', daysAgo: 75, count: 1, avail: true }
  ];

  for (const d of otherDonorsData) {
    const user = await User.create({
      name: d.name,
      email: d.email,
      password: 'Password@123',
      phone: `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
      role: 'DONOR',
      isActive: true
    });

    donorProfiles.push({
      user,
      bloodGroup: d.bg,
      coordinates: d.coords,
      address: `${d.city} Central District`,
      city: d.city,
      preferredRadius: 15,
      lastDonationDate: new Date(Date.now() - d.daysAgo * 24 * 60 * 60 * 1000),
      available: d.avail,
      donationCount: d.count,
      badges: ['Verified Donor', d.count >= 5 ? 'Veteran Donor' : 'Dedicated Donor']
    });
  }

  const createdDonors = [];
  for (const dp of donorProfiles) {
    const donor = await Donor.create({
      userId: dp.user._id,
      bloodGroup: dp.bloodGroup,
      location: {
        type: 'Point',
        coordinates: dp.coordinates
      },
      address: dp.address,
      city: dp.city,
      preferredRadius: dp.preferredRadius,
      lastDonationDate: dp.lastDonationDate,
      available: dp.available,
      donationCount: dp.donationCount,
      badges: dp.badges,
      verified: true
    });
    createdDonors.push(donor);
  }
  console.log(`✅ Created ${createdDonors.length} Verified Voluntary Donors`);

  // 5. Create Sample Blood Requests (Active Emergency & Completed)
  const req1 = await BloodRequest.create({
    requesterId: patient._id,
    patientName: 'Subramanian R',
    hospitalName: 'KMCH Emergency Trauma Center',
    bloodGroup: 'O-',
    unitsRequired: 2,
    location: { type: 'Point', coordinates: [77.0423, 11.0321] },
    address: 'Avanashi Road, KMCH Ward 4B',
    radius: 15,
    emergency: true,
    urgencyLevel: 'CRITICAL_EMERGENCY',
    status: 'DONOR_SEARCHING',
    fulfillmentStage: 'STAGE_2_DONOR_FALLBACK',
    bloodBankMatches: [
      { bloodBankId: createdBanks[0]._id, name: createdBanks[0].name, distanceKm: 8.5, availableUnits: 0, status: 'NO_STOCK' }
    ],
    donorMatches: [
      {
        donorId: createdDonors[0]._id,
        distanceKm: 9.1,
        aiCompatibilityScore: 96,
        aiRationale: 'Optimal Universal Match: O- exact donor located approx 9.1 km away. Fully rested (110 days).',
        responseStatus: 'ACCEPTED'
      }
    ],
    notes: 'Emergency vascular surgical procedure requiring negative units immediately.'
  });

  // Create Donor Response for req1
  await DonorResponse.create({
    requestId: req1._id,
    donorId: createdDonors[0]._id,
    response: 'ACCEPTED',
    message: 'Confirmed! I am en route to KMCH Blood Bank to donate.',
    estimatedArrivalTimeMins: 25,
    respondedAt: new Date()
  });

  // Create Notifications
  await Notification.create({
    userId: patient._id,
    requestId: req1._id,
    type: 'DONOR_RESPONSE',
    title: '🚨 Voluntary Donor Accepted Your Emergency Request',
    message: `Karthik Raja (O- Universal Donor) has accepted your request for Subramanian R at KMCH.`
  });

  await Notification.create({
    userId: donorUser._id,
    requestId: req1._id,
    type: 'EMERGENCY_REQUEST',
    title: '🚨 Urgent O- Emergency Request Nearby',
    message: `Patient at KMCH Emergency Trauma Center requires 2 units of O- blood within 15 km.`
  });

  // 6. Create Completed Donation History
  await DonationHistory.create({
    donorId: createdDonors[0]._id,
    userId: donorUser._id,
    bloodBankId: createdBanks[0]._id,
    bloodGroup: 'O-',
    unitsDonated: 1,
    donationDate: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
    recipientHospital: 'Coimbatore Medical College Hospital',
    certificateNumber: 'BC360-CERT-883921',
    notes: 'Emergency platelet and whole blood donation for trauma patient'
  });

  console.log('✅ Created Demo Requests, Notifications, and Verified Donation History');
  console.log('🎉 Seed Completed Successfully!');
};

module.exports = seedData;

// If script run directly
if (require.main === module) {
  require('dotenv').config();
  const { connectDB, disconnectDB } = require('./config/db');

  connectDB()
    .then(async () => {
      await seedData();
      await disconnectDB();
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding Error:', err);
      process.exit(1);
    });
}
