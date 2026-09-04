from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Date,
    Time,
    DateTime
)

from sqlalchemy.orm import declarative_base, sessionmaker

from datetime import datetime


# ========================================
# DATABASE
# ========================================

DATABASE_URL = "sqlite:///./signalsafe.db"


engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False
    }
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


Base = declarative_base()


# ========================================
# EVENT TABLE
# ========================================

class Event(Base):

    __tablename__ = "events"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    event_name = Column(
        String,
        nullable=False
    )

    location = Column(
        String,
        nullable=False
    )

    event_date = Column(
        Date,
        nullable=False
    )

    start_time = Column(
        Time,
        nullable=False
    )

    end_time = Column(
        Time,
        nullable=False
    )

    zones = Column(
        String,
        nullable=False
    )

    capacity = Column(
        Integer,
        nullable=False
    )

    safe_zones = Column(
        String,
        nullable=False
    )

    exits = Column(
        String,
        nullable=False
    )


# ========================================
# PARTICIPANT TABLE
# ========================================

class Participant(Base):

    __tablename__ = "participants"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    participant_id = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        nullable=False
    )

    phone = Column(
        String,
        nullable=False
    )

    event_id = Column(
        Integer,
        nullable=False
    )


# ========================================
# SOS / EMERGENCY TABLE
# ========================================

class Emergency(Base):

    __tablename__ = "emergencies"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    participant_id = Column(
        String,
        nullable=False
    )

    event_id = Column(
        Integer,
        nullable=False
    )

    latitude = Column(
        String,
        nullable=True
    )

    longitude = Column(
        String,
        nullable=True
    )

    message = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        nullable=False,
        default="NEW"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# ========================================
# ADMIN ALERT TABLE
# ========================================

class Alert(Base):

    __tablename__ = "alerts"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    event_id = Column(
        Integer,
        nullable=False
    )

    title = Column(
        String,
        nullable=False
    )

    message = Column(
        String,
        nullable=False
    )

    alert_type = Column(
        String,
        nullable=False,
        default="SAFETY"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# ========================================
# CREATE TABLES
# ========================================

Base.metadata.create_all(
    bind=engine
)