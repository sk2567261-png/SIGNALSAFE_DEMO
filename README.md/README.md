# 🚨 SIGNALSAFE

## AI-Powered Crowd Safety & Emergency Management System

SIGNALSAFE is a web-based crowd safety and emergency management system designed to monitor crowd conditions, detect risks, handle emergencies, and provide safety information to participants and administrators.

---

## 🎯 Project Objective

The main objective of SIGNALSAFE is to improve crowd safety during large events by providing:

- Real-time crowd monitoring
- Crowd density and risk analysis
- GPS-based participant location
- Emergency SOS communication
- Interactive risk map
- CCTV and AI-based people detection
- Safety alerts
- Safe-zone and emergency-exit information
- Admin monitoring and analytics

---

## 👥 Two Separate Dashboards

### 👤 User Dashboard

The User Dashboard provides participants with:

- Participant ID
- Event information
- Current GPS location
- Live zone information
- Interactive risk map
- CCTV and crowd information
- Density and risk status
- Safe route information
- Emergency SOS
- Safety alerts

### 🛡️ Admin Dashboard

The Admin Dashboard provides event administrators with:

- Event management
- Live zone monitoring
- Crowd density monitoring
- Risk score monitoring
- Interactive risk map
- CCTV + AI crowd detection
- Emergency SOS alerts
- Safety alerts
- Analytics

---

## 🚀 Main Features

### 1. Event Management
Admin can create events with:

- Event name
- Location
- Date
- Start time
- End time
- Zones
- Capacity
- Safe zones
- Emergency exits

### 2. Participant Identification

Each participant receives a unique Participant ID.

Example:

`SS-001-0001`

### 3. GPS Location

The User Dashboard can obtain the participant's current GPS location.

Mobile devices provide real-time GPS location for demonstration and live usage.

### 4. Live Zone Monitoring

The system monitors different event zones using:

- Crowd count
- Density
- Spacing
- Risk score
- Safety status

Status levels:

🟢 SAFE  
🟠 WARNING  
🔴 DANGER

### 5. Interactive Risk Map

The system displays event zones on an interactive map.

Each zone is represented according to its current risk condition.

### 6. CCTV + AI Crowd Detection

SIGNALSAFE includes a demo AI crowd detection module that provides:

- People count
- Crowd density
- Risk score
- Safety status

Multiple cameras can be monitored.

### 7. Density + Spacing + Risk

The system calculates crowd conditions using:

- Number of people
- Crowd density
- Average spacing
- Risk score

### 8. Emergency SOS

Participants can send an emergency SOS request.

The SOS can contain:

- Participant ID
- Event ID
- GPS latitude
- GPS longitude
- Emergency message
- SOS status

The Admin Dashboard receives the emergency request.

### 9. Admin Safety Alerts

Administrators can send safety alerts to participants.

Example:

> Please move towards the nearest safe zone.

### 10. Safe Route

SIGNALSAFE provides a recommended safe route based on current zone conditions.

The system identifies safer zones using the available risk information.

### 11. Notifications

The notification service supports:

- 📧 Email
- 📱 SMS
- 🔔 Push notifications

The current implementation provides a demo notification service.

### 12. Analytics

The Admin Dashboard displays crowd and safety analytics including:

- Total crowd
- Density
- Spacing
- SOS count
- Risk score
- Risk level

---

## 🏗️ System Architecture

```text
                    SIGNALSAFE
                         |
          +--------------+--------------+
          |                             |
     USER DASHBOARD               ADMIN DASHBOARD
          |                             |
          |                             |
     GPS Location                 Event Management
     Participant ID               Live Zones
     Risk Map                     Risk Map
     Safe Route                   CCTV + AI
     SOS                          Analytics
     Safety Alerts                SOS Monitoring
          |                             |
          +--------------+--------------+
                         |
                    FASTAPI BACKEND
                         |
          +--------------+--------------+
          |              |              |
       SQLite       Risk Engine     AI Module
          |
     Event Database
     Participant Data
     SOS Data
     Safety Alerts