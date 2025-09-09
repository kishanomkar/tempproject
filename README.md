
# Tourist Safety Application – Developer Guide

This guide provides a clear, step-by-step roadmap for setting up, developing, and contributing to the Tourist Safety Application. The project includes a mobile app for tourists, a web dashboard for authorities, and a Node.js backend.

---

## 1. Project Overview

**Tourist Safety Application** is an ecosystem to enhance traveler security. It consists of:
- **Tourist Mobile App**: For planning, awareness, and emergency features.
- **Authorities Dashboard**: For real-time monitoring and incident management.
- **Backend API**: For data, authentication, and real-time communication.

---

## 2. Key Features

### Tourist Mobile App
- **Planning & Awareness**
	- Geo-fenced safe zones (map overlays)
	- Neighborhood safety scores
	- Official advisories (real-time alerts)
	- In-app emergency guides
	- (Advanced) Blockchain digital ID
- **Core Safety Triggers**
	- One-touch panic button (SOS)
	- Voice-activated SOS
	- Magic alarm (loud deterrent + silent alert)
	- Smart battery sentinel (last known location on low battery)
- **Hardware Shortcuts**
	- Power button SOS
	- Volume button AI help
- **Community & Sharing**
	- Follow Me (live journey sharing)
	- Traveler community board

### Authorities Dashboard
- **Real-time Monitoring**
	- Live map & heatmaps
	- Triage alert system
- **Incident Management**
	- Full tourist profile on alert
	- Automated e-FIR generation

---

## 3. Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB or PostgreSQL
- **Real-time**: Socket.IO
- **Mobile App**: React Native (recommended) or Flutter
- **Dashboard**: React.js (recommended) or Angular
- **Maps**: Mapbox or Google Maps API

---

## 4. Quick Start – Local Setup

### Prerequisites
- Node.js & npm/yarn
- Git
- Code editor (VS Code recommended)
- MongoDB or PostgreSQL running locally

### Backend Setup
```sh
git clone <your-repo-url>
cd <repo-name>/backend
npm install
cp .env.example .env   # Add your config: DATABASE_URL, JWT_SECRET, PORT
npm run dev
```

### Frontend Setup (Dashboard or Mobile)
```sh
cd ../frontend   # or ../mobile for React Native
npm install
npm start        # For React dashboard
# npx react-native run-ios|run-android  # For mobile app
```

---

## 5. Development Roadmap

### Phase 1: Backend Foundation
1. **Initialize Project & DB**: Set up Node.js/Express and connect to DB.
2. **Models/Schemas**: User, Alert, SafeZone, Advisory.
3. **Authentication**: JWT-secured endpoints.
	 - `POST /api/auth/register`, `POST /api/auth/login`
4. **Core APIs**:
	 - `POST /api/alerts` (SOS)
	 - `GET /api/users/me` (profile)
	 - `GET /api/advisories` (alerts)
5. **WebSocket Server**: Integrate Socket.IO
	 - Events: `new-alert`, `location-update`

### Phase 2: Authorities Dashboard
1. **UI Layout**: Map + sidebar for alerts
2. **WebSocket Connection**: Listen for `new-alert`
3. **Map Integration**: Markers for alerts, click for profile
4. **Live Tracking**: Update marker on `location-update`

### Phase 3: Tourist Mobile App
1. **Screens**: Registration, login, dashboard
2. **Auth Flow**: Connect to backend, store JWT
3. **One-Touch Panic**: Button triggers geolocation + POST `/api/alerts`
4. **Other Features**: Voice SOS, Magic Alarm, Battery Sentinel

### Phase 4: Testing
1. **Unit Tests**: Functions (input validation, alert formatting)
2. **Integration Tests**: Trigger alert, verify dashboard update
3. **E2E Test**: Full flow from app to dashboard

---

## 6. Running the System

Start each part in a separate terminal:
- Backend: `npm run dev` (in `/backend`)
- Dashboard: `npm start` (in `/frontend`)
- Mobile: `npx react-native run-android` or `run-ios` (in `/mobile`)

**Typical Flow:**
1. Tourist registers on the app
2. Triggers SOS (panic button, voice, etc.)
3. Authority sees alert on dashboard, clicks for details, dispatches help

---

## 7. Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes & commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

**Please update/add tests for new features.**