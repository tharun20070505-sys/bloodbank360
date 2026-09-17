# BloodConnect 360 — Location-Based Blood Availability & Nearby Donor Coordination System

> **Enterprise-grade MERN Stack Healthcare Platform featuring a Two-Stage Search & Fallback Engine, AI Compatibility Triage, Interactive Maps, and 48+ Dedicated Pages.**

---

## 🌟 Core Architectural Workflow: The Two-Stage Fallback Engine

BloodConnect 360 strictly enforces clinical priority: **Never bypass certified blood bank reserves.**

```
               [ User Searches for Blood: Group + Units + Radius + GPS ]
                                           │
                                           ▼
                       STAGE 1: NEARBY BLOOD BANK INVENTORY
                               (MongoDB 2dsphere)
                                           │
                        ┌──────────────────┴──────────────────┐
                        │                                     │
           [ Sufficient Stock Found ]              [ Insufficient / 0 Stock ]
                        │                                     │
                        ▼                                     ▼
         Display Matching Blood Banks          ACTIVATE STAGE 2: DONOR FALLBACK
         • Available Units & Distance          • Immuno-Biological Compatibility
         • Address, Hours & Contact            • Proximity Decay Calculation
         • Direct Request Dispatch             • Donation Interval Screening
                                               • AI Neural Match Score (0-100%)
                                               • Shielded Donor Privacy Contact
```

### Stage 1: Nearby Blood Banks First
1. Patient enters blood group, units, location, and radius.
2. System queries registered blood banks within radius using GeoJSON `[longitude, latitude]` geospatial queries.
3. If at least one bank satisfies required units, results are sorted by road distance with available units, address, operating hours, and direct contact.

### Stage 2: Automatic Donor Fallback
1. If all nearby blood banks have 0 units or less than the required quantity, the system **automatically triggers the voluntary donor fallback**.
2. Displays the system notice:
   > *"No sufficient blood stock was found in nearby blood banks. Searching registered voluntary donors near you..."*
3. Matches voluntary donors biologically (e.g. O- universal donor, Rh rules).
4. Evaluates proximity decay and informational screening interval (minimum 56/90 days recovery).
5. Ranks donors with the AI Compatibility Engine and allows sending requests without exposing private contact info until the donor accepts.

---

## 🤖 Integrated AI Matching & Triage Engine

- **Biological Compatibility Engine**: Rules matrix for all 8 blood groups ($A^+, A^-, B^+, B^-, AB^+, AB^-, O^+, O^-$).
- **Multi-Factor Algorithmic Score**:
  $$Score = w_1 \cdot \text{BiologicalMatch} + w_2 \cdot \text{ProximityDecay} + w_3 \cdot \text{IntervalReadiness} + w_4 \cdot \text{Reliability}$$
- **AI Triage & Natural Language Rationale**: Explains candidate viability, estimated road transit time, and blood rarity profile.
- **Shortage Forecaster**: AI predictive model forecasting stockout vulnerability across regional blood banks.
- **Informational Self-Screening Assistant**: Non-diagnostic advisory guiding prospective donors on lifestyle and recovery readiness.

---

## 📱 48 Integrated Pages and Views Across All Roles

### Public & Patient Discovery
1. **Home** (`/`) — Hero, real-time statistics, two-stage protocol flowchart, quick search
2. **Find Blood** (`/find-blood`) — The primary two-stage search engine with live GPS
3. **Blood Banks Found** (`/search-results/banks`) — Stage 1 results view
4. **Fallback Donors** (`/search-results/donors`) — Stage 2 fallback results view
5. **Live Map Explorer** (`/map-explorer`) — Geospatial Leaflet map with blood banks and donors
6. **How It Works** (`/how-it-works`) — Step-by-step technical architecture guide
7. **About Us** (`/about`) — Mission, zero wastage, and ethical non-commercial policy
8. **Compatibility Guide** (`/compatibility-guide`) — Interactive Red Blood Cell matrix
9. **Eligibility Checker** (`/eligibility-checker`) — 60-second donor self-screening wizard
10. **Blood Banks Directory** (`/blood-banks`) — Verified hospital centers registry
11. **Blood Bank Detail** (`/blood-banks/:id`) — Center profile, live 8-group inventory, location map
12. **Emergency SOS** (`/emergency-sos`) — High-priority broadcast beacon
13. **Become a Donor** (`/become-donor`) — Donor enrollment and community commitment
14. **Contact & Grievances** (`/contact`) — 24/7 hotline and hospital support desk
15. **Privacy Policy** (`/privacy`) — Controlled contact sharing and zero-leakage pledge
16. **Terms of Service & Disclaimer** (`/terms`) — Official statutory medical safety boundaries
17. **404 Page** (`/*`) — Not found handler

### Authentication
18. **Sign In** (`/login`) — Includes 1-Click Demo Role shortcuts
19. **Register** (`/register`) — Dynamic multi-role registration (Patient, Donor, Blood Bank)
20. **Forgot Password** (`/forgot-password`) — Recovery link request
21. **Reset Password** (`/reset-password`) — Token reset verification

### Patient Portal
22. **Patient Dashboard** (`/patient/dashboard`) — Active requests, summary metrics, quick actions
23. **Create Blood Request** (`/patient/create-request`) — Two-stage evaluation submission form
24. **My Requests** (`/patient/requests`) — Active and historical requests list
25. **Request Details** (`/patient/requests/:id`) — Live tracking, stage progress bar, donor responses
26. **Donor Fallback Dispatcher** (`/patient/requests/:id/donor-fallback`) — AI ranked candidates & bulk dispatch
27. **Patient Request History** (`/patient/history`) — Closed and fulfilled transfusion archives

### Voluntary Donor Portal
28. **Donor Dashboard** (`/donor/dashboard`) — 1-Click Availability toggle, recovery countdown, incoming alerts
29. **Incoming Requests** (`/donor/requests`) — Emergency and routine nearby requests feed
30. **Request Action** (`/donor/requests/:id`) — Acceptance coordination, arrival time, confetti confirmation
31. **Donation History** (`/donor/history`) — Lifetime donations and verified certificate numbers
32. **Digital Donor Card** (`/donor/card`) — Encrypted digital wallet pass with QR code and blood badge
33. **Donor Settings** (`/donor/settings`) — Travel radius slider, weight, hemoglobin, territory

### Blood Bank Portal
34. **Blood Bank Dashboard** (`/bank/dashboard`) — Total units, low stock alerts, incoming dispatches
35. **Manage Inventory** (`/bank/inventory`) — Live 8-blood group matrix editor with $+/-$ controls
36. **Incoming Dispatches** (`/bank/requests`) — Hospital allocation queue and dispatch approval
37. **Dispatch Detail** (`/bank/requests/:id`) — Attendant verification and clinical release confirmation
38. **Donation Camps** (`/bank/camps`) — Mobile collection drives scheduler
39. **AI Stock Forecaster** (`/bank/forecaster`) — Regional shortage risk analysis & collection recommendations

### Administrator Control Center
40. **Admin Dashboard** (`/admin/dashboard`) — System statistics, verified centers, emergency overview
41. **Verify Blood Banks** (`/admin/blood-banks`) — Facility license approval and verification queue
42. **Manage Users** (`/admin/users`) — User account management with suspend/reactivate toggles
43. **Manage Requests** (`/admin/requests`) — System-wide blood request monitor and audit
44. **Security Audit Logs** (`/admin/audit-logs`) — Chronological security and dispatch audit trail
45. **AI System Settings** (`/admin/settings`) — Hyperparameter weights tuning for neural triage

### Shared & Interactive Utilities
46. **Notifications Center** (`/notifications`) — Real-time in-app alerts with mark-read controls
47. **User Profile** (`/profile`) — Account credentials and personal data
48. **AI Triage Simulator** (`/ai-insights`) — Interactive recipient vs donor matching lab
49. **Live Tracker** (`/live-tracker`) — Standalone request ID tracking lookup
50. **Compatibility Encyclopedia** (`/compatibility-matrix`) — Deep educational reference
51. **Quick Donor Registration** (`/quick-donor-signup`) — Fast 2-step enrollment flow

---

## 🔑 Demo Role Credentials

All accounts are pre-seeded with password: `Password@123`

| Role | Email | Password | Primary Feature |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@bloodconnect.org` | `Password@123` | Verify banks, system analytics, AI weights |
| **Patient / User** | `patient@bloodconnect.org` | `Password@123` | Two-Stage search, live tracking, requests |
| **Voluntary Donor** | `donor@bloodconnect.org` | `Password@123` | Availability toggle, accept dispatches, digital pass |
| **Blood Bank** | `bloodbank@bloodconnect.org` | `Password@123` | Real-time 8-group stock matrix, dispatches |

*(On the Login screen, click any of the 4 quick buttons to autofill credentials instantly!)*

---

## 🚀 Quick Start Guide

### 1. Installation
```bash
# In project root
npm run install-all
```

### 2. Run Application (Zero-Setup Mode)
```bash
# Launches both server (port 5050) and client (port 5173)
npm run dev
```
Open **`http://localhost:5173`** in your browser.

> **Zero-Setup Database**: If no MongoDB is running on your machine, the application will automatically launch an embedded in-memory MongoDB instance pre-seeded with 5 blood banks, 40 inventory groups, and 13 voluntary donors!

---

## 🛡️ Statutory Medical Safety Disclaimer

> **BloodConnect 360 is a coordination platform that helps users locate blood availability and connect with registered donors. Final blood compatibility, donor eligibility, testing, collection, and transfusion decisions must be handled by qualified healthcare professionals and authorized blood banks.**
