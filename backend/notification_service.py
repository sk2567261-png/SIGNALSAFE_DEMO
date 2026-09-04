# ========================================
# SIGNALSAFE NOTIFICATION SERVICE
# ========================================

from datetime import datetime


# ========================================
# EMAIL NOTIFICATION
# ========================================

def send_email(
    recipient,
    subject,
    message
):

    print("\n================================")
    print("📧 EMAIL NOTIFICATION")
    print("================================")

    print("To:", recipient)
    print("Subject:", subject)
    print("Message:", message)

    print("================================\n")

    return {
        "type": "EMAIL",
        "recipient": recipient,
        "subject": subject,
        "message": message,
        "status": "SENT",
        "time": datetime.utcnow().isoformat()
    }


# ========================================
# SMS NOTIFICATION
# ========================================

def send_sms(
    phone,
    message
):

    print("\n================================")
    print("📱 SMS NOTIFICATION")
    print("================================")

    print("Phone:", phone)
    print("Message:", message)

    print("================================\n")

    return {
        "type": "SMS",
        "phone": phone,
        "message": message,
        "status": "SENT",
        "time": datetime.utcnow().isoformat()
    }


# ========================================
# PUSH NOTIFICATION
# ========================================

def send_push_notification(
    participant_id,
    title,
    message
):

    print("\n================================")
    print("🔔 PUSH NOTIFICATION")
    print("================================")

    print("Participant:", participant_id)
    print("Title:", title)
    print("Message:", message)

    print("================================\n")

    return {
        "type": "PUSH",
        "participant_id": participant_id,
        "title": title,
        "message": message,
        "status": "SENT",
        "time": datetime.utcnow().isoformat()
    }


# ========================================
# SEND ALL NOTIFICATIONS
# ========================================

def send_all_notifications(
    email,
    phone,
    participant_id,
    title,
    message
):

    email_result = send_email(
        email,
        title,
        message
    )


    sms_result = send_sms(
        phone,
        message
    )


    push_result = send_push_notification(
        participant_id,
        title,
        message
    )


    return {

        "email": email_result,

        "sms": sms_result,

        "push": push_result

    }