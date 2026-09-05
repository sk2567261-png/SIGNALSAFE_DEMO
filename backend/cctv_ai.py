# ========================================
# SIGNALSAFE
# CCTV + AI CROWD ANALYSIS
# ========================================

import random
from datetime import datetime


def calculate_density(people_count):

    if people_count < 400:
        return "LOW"

    elif people_count < 700:
        return "MEDIUM"

    else:
        return "HIGH"


def calculate_risk(people_count):

    if people_count < 400:
        return 20

    elif people_count < 700:
        return 55

    elif people_count < 850:
        return 75

    else:
        return 90


def calculate_status(risk_score):

    if risk_score < 40:
        return "SAFE"

    elif risk_score < 70:
        return "WARNING"

    else:
        return "DANGER"


def detect_people(camera_name="Camera 1"):

    # Demo AI people detection
    people_count = random.randint(100, 950)

    density = calculate_density(
        people_count
    )

    risk_score = calculate_risk(
        people_count
    )

    status = calculate_status(
        risk_score
    )

    return {

        "camera": camera_name,

        "people_count":
        people_count,

        "density":
        density,

        "risk_score":
        risk_score,

        "status":
        status,

        "timestamp":
        datetime.now().isoformat()

    }


def get_all_cameras():

    return [

        detect_people("Camera 1"),

        detect_people("Camera 2"),

        detect_people("Camera 3")

    ]


if __name__ == "__main__":

    cameras = get_all_cameras()

    for camera in cameras:

        print(
            camera["camera"],
            "| People:",
            camera["people_count"],
            "| Density:",
            camera["density"],
            "| Risk:",
            camera["risk_score"],
            "| Status:",
            camera["status"]
        )