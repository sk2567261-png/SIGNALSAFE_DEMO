from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import date, time

from database import (
    SessionLocal,
    Event,
    Participant,
    Emergency,
    Alert
)

from notification_service import (
    send_all_notifications
)

from cctv_ai import get_all_cameras


app = FastAPI(title="SignalSafe API")


# ========================================
# CORS
# ========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ========================================
# DATABASE
# ========================================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ========================================
# MODELS
# ========================================

class EventCreate(BaseModel):

    event_name: str
    location: str
    event_date: date
    start_time: time
    end_time: time
    zones: str
    capacity: int
    safe_zones: str
    exits: str


class ParticipantCreate(BaseModel):

    name: str
    email: str
    phone: str
    event_id: int


class SOSCreate(BaseModel):

    participant_id: str
    event_id: int
    latitude: str = ""
    longitude: str = ""
    message: str = "Emergency SOS"


class AlertCreate(BaseModel):

    event_id: int
    title: str
    message: str
    alert_type: str = "SAFETY"


class NotificationCreate(BaseModel):

    email: str
    phone: str
    participant_id: str
    title: str
    message: str


# ========================================
# HOME
# ========================================

@app.get("/")
def home():

    return {
        "message": "SignalSafe Backend is running"
    }


# ========================================
# CREATE EVENT
# ========================================

@app.post("/events")
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db)
):

    new_event = Event(
        event_name=event.event_name,
        location=event.location,
        event_date=event.event_date,
        start_time=event.start_time,
        end_time=event.end_time,
        zones=event.zones,
        capacity=event.capacity,
        safe_zones=event.safe_zones,
        exits=event.exits
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return {
        "message": "Event created successfully",
        "event_id": new_event.id
    }


# ========================================
# CREATE PARTICIPANT
# ========================================

@app.post("/participants")
def create_participant(
    participant: ParticipantCreate,
    db: Session = Depends(get_db)
):

    new_participant = Participant(
        participant_id="TEMP",
        name=participant.name,
        email=participant.email,
        phone=participant.phone,
        event_id=participant.event_id
    )

    db.add(new_participant)
    db.commit()
    db.refresh(new_participant)

    new_participant.participant_id = (
        f"SS-{participant.event_id:03d}-"
        f"{new_participant.id:04d}"
    )

    db.commit()
    db.refresh(new_participant)

    return {
        "message": "Participant registered successfully",
        "participant_id": new_participant.participant_id,
        "name": new_participant.name,
        "event_id": participant.event_id
    }


# ========================================
# SEND SOS
# ========================================

@app.post("/sos")
def send_sos(
    sos: SOSCreate,
    db: Session = Depends(get_db)
):

    new_emergency = Emergency(
        participant_id=sos.participant_id,
        event_id=sos.event_id,
        latitude=sos.latitude,
        longitude=sos.longitude,
        message=sos.message,
        status="NEW"
    )

    db.add(new_emergency)
    db.commit()
    db.refresh(new_emergency)

    return {
        "message": "SOS sent successfully",
        "emergency_id": new_emergency.id,
        "participant_id": new_emergency.participant_id,
        "status": new_emergency.status
    }


# ========================================
# GET SOS
# ========================================

@app.get("/sos")
def get_sos_alerts(
    db: Session = Depends(get_db)
):

    emergencies = (
        db.query(Emergency)
        .order_by(Emergency.id.desc())
        .all()
    )

    return [
        {
            "id": emergency.id,
            "participant_id": emergency.participant_id,
            "event_id": emergency.event_id,
            "latitude": emergency.latitude,
            "longitude": emergency.longitude,
            "message": emergency.message,
            "status": emergency.status,
            "created_at": emergency.created_at
        }
        for emergency in emergencies
    ]


# ========================================
# ADMIN SEND ALERT
# ========================================

@app.post("/alerts")
def create_alert(
    alert: AlertCreate,
    db: Session = Depends(get_db)
):

    new_alert = Alert(
        event_id=alert.event_id,
        title=alert.title,
        message=alert.message,
        alert_type=alert.alert_type
    )

    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)

    return {
        "message": "Alert sent successfully",
        "alert_id": new_alert.id,
        "title": new_alert.title,
        "alert_type": new_alert.alert_type
    }


# ========================================
# USER GET ALERTS
# ========================================

@app.get("/alerts")
def get_alerts(
    event_id: int = 1,
    db: Session = Depends(get_db)
):

    alerts = (
        db.query(Alert)
        .filter(Alert.event_id == event_id)
        .order_by(Alert.id.desc())
        .all()
    )

    return [
        {
            "id": alert.id,
            "event_id": alert.event_id,
            "title": alert.title,
            "message": alert.message,
            "alert_type": alert.alert_type,
            "created_at": alert.created_at
        }
        for alert in alerts
    ]


# ========================================
# EMAIL + SMS + PUSH
# ========================================

@app.post("/notifications")
def send_notifications(
    notification: NotificationCreate
):

    result = send_all_notifications(
        email=notification.email,
        phone=notification.phone,
        participant_id=notification.participant_id,
        title=notification.title,
        message=notification.message
    )

    return {
        "message": "All notifications processed successfully",
        "email": result["email"],
        "sms": result["sms"],
        "push": result["push"]
    }


# ========================================
# LIVE ZONE DATA
# ========================================

@app.get("/zones")
def get_live_zones():

    return {

        "zones": [

            {
                "name": "Zone A",
                "status": "SAFE",
                "color": "GREEN",
                "crowd": 450,
                "density": 35,
                "spacing": 2.4,
                "risk_score": 20
            },

            {
                "name": "Zone B",
                "status": "WARNING",
                "color": "YELLOW",
                "crowd": 780,
                "density": 68,
                "spacing": 1.6,
                "risk_score": 58
            },

            {
                "name": "Zone C",
                "status": "DANGER",
                "color": "RED",
                "crowd": 690,
                "density": 91,
                "spacing": 0.8,
                "risk_score": 86
            }

        ]

    }


# ========================================
# CCTV + AI PEOPLE DETECTION
# ========================================

@app.get("/cctv")
def get_cctv_data():

    return {
        "message": "CCTV AI detection successful",
        "cameras": get_all_cameras()
    }


# ========================================
# ANALYTICS
# ========================================

@app.get("/analytics")
def get_analytics(
    db: Session = Depends(get_db)
):

    total_events = (
        db.query(Event).count()
    )

    total_participants = (
        db.query(Participant).count()
    )

    total_sos = (
        db.query(Emergency).count()
    )

    new_sos = (
        db.query(Emergency)
        .filter(
            Emergency.status == "NEW"
        )
        .count()
    )

    total_alerts = (
        db.query(Alert).count()
    )

    # ------------------------------------
    # LIVE ZONE SUMMARY
    # ------------------------------------

    safe_zones = 1
    warning_zones = 1
    danger_zones = 1

    # ------------------------------------
    # CROWD DATA
    # ------------------------------------

    total_crowd = 1920
    average_density = 65
    average_spacing = 1.8

    # ------------------------------------
    # RISK
    # ------------------------------------

    risk_score = 45

    if risk_score < 40:

        risk_level = "LOW"

    elif risk_score < 70:

        risk_level = "MEDIUM"

    else:

        risk_level = "HIGH"

    return {

        "total_events": total_events,

        "total_participants":
        total_participants,

        "total_sos":
        total_sos,

        "new_sos":
        new_sos,

        "total_alerts":
        total_alerts,

        "zones": {

            "safe":
            safe_zones,

            "warning":
            warning_zones,

            "danger":
            danger_zones

        },

        "crowd": {

            "total":
            total_crowd,

            "density":
            average_density,

            "spacing":
            average_spacing

        },

        "risk": {

            "score":
            risk_score,

            "level":
            risk_level

        }

    }