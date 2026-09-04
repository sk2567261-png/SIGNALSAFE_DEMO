// ========================================
// SIGNALSAFE ADMIN DASHBOARD
// ========================================

const BACKEND_URL = "http://127.0.0.1:8000";


// ========================================
// SEND ALERT TO USERS
// ========================================

async function sendAlert() {

    const title =
        document.getElementById("alertTitle")
            .value.trim();

    const message =
        document.getElementById("alertMessage")
            .value.trim();

    const alertType =
        document.getElementById("alertType")
            .value;

    const statusBox =
        document.getElementById("alertStatus");


    if (!title || !message) {

        statusBox.innerHTML =
            "⚠️ Please enter alert title and message.";

        return;
    }


    statusBox.innerHTML =
        "📡 Sending alert...";


    try {

        const response =
            await fetch(
                `${BACKEND_URL}/alerts`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        event_id: 1,

                        title: title,

                        message: message,

                        alert_type: alertType

                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Alert sending failed"
            );

        }


        const data =
            await response.json();


        statusBox.innerHTML =
            "✅ Alert sent successfully to users!";


        document.getElementById(
            "alertTitle"
        ).value = "";


        document.getElementById(
            "alertMessage"
        ).value = "";


        document.getElementById(
            "alertType"
        ).value = "SAFETY";


        console.log(
            "Alert:",
            data
        );

    }


    catch (error) {

        console.error(
            "Alert Error:",
            error
        );


        statusBox.innerHTML =
            "❌ Unable to connect to backend.";

    }

}


// ========================================
// LOAD SOS ALERTS
// ========================================

async function loadSOS() {

    const container =
        document.getElementById(
            "sosContainer"
        );

    const emergencyCount =
        document.getElementById(
            "emergencyCount"
        );


    try {

        const response =
            await fetch(
                `${BACKEND_URL}/sos`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load SOS alerts"
            );

        }


        const alerts =
            await response.json();


        const newAlerts =
            alerts.filter(
                alert =>
                    alert.status === "NEW"
            );


        emergencyCount.innerText =
            newAlerts.length;


        if (alerts.length === 0) {

            container.innerHTML = `

                <div class="no-alert">

                    🟢 No emergency alerts

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        alerts.forEach(
            function(alert) {

                const alertBox =
                    document.createElement(
                        "div"
                    );


                alertBox.className =
                    "sos-alert";


                const time =
                    alert.created_at
                    ? new Date(
                        alert.created_at
                    ).toLocaleString()
                    : "Unknown";


                const location =
                    alert.latitude &&
                    alert.longitude

                    ? `${alert.latitude}, ${alert.longitude}`

                    : "Location unavailable";


                alertBox.innerHTML = `

                    <h3>
                        🚨 SOS EMERGENCY
                    </h3>

                    <p>
                        <strong>
                            Participant ID:
                        </strong>
                        ${alert.participant_id}
                    </p>

                    <p>
                        <strong>
                            Event ID:
                        </strong>
                        ${alert.event_id}
                    </p>

                    <p>
                        <strong>
                            📍 Location:
                        </strong>
                        ${location}
                    </p>

                    <p>
                        <strong>
                            🕒 Time:
                        </strong>
                        ${time}
                    </p>

                    <p>
                        <strong>
                            Message:
                        </strong>
                        ${alert.message}
                    </p>

                    <span class="sos-status">
                        🚨 ${alert.status}
                    </span>

                `;


                container.appendChild(
                    alertBox
                );

            }
        );

    }


    catch (error) {

        console.error(
            "SOS Error:",
            error
        );


        container.innerHTML = `

            <div class="no-alert">

                ❌ Unable to connect to
                SIGNALSAFE Backend.

                <br><br>

                Please make sure the
                backend server is running.

            </div>

        `;

    }

}


// ========================================
// LOAD ANALYTICS
// ========================================

async function loadAnalytics() {

    const status =
        document.getElementById(
            "analyticsStatus"
        );


    if (status) {

        status.innerText =
            "Loading...";

    }


    try {

        const response =
            await fetch(
                `${BACKEND_URL}/analytics`
            );


        if (!response.ok) {

            throw new Error(
                "Analytics request failed"
            );

        }


        const data =
            await response.json();


        // ====================================
        // MAIN STATISTICS
        // ====================================

        document.getElementById(
            "analyticsParticipants"
        ).innerText =
            data.total_participants;


        document.getElementById(
            "analyticsSOS"
        ).innerText =
            data.total_sos;


        document.getElementById(
            "analyticsAlerts"
        ).innerText =
            data.total_alerts;


        document.getElementById(
            "analyticsRisk"
        ).innerText =
            data.risk.score;


        // ====================================
        // CROWD ANALYTICS
        // ====================================

        document.getElementById(
            "analyticsCrowd"
        ).innerText =
            data.crowd.total;


        document.getElementById(
            "analyticsDensity"
        ).innerText =
            data.crowd.density + "%";


        document.getElementById(
            "analyticsSpacing"
        ).innerText =
            data.crowd.spacing + " m";


        // ====================================
        // DENSITY BAR
        // ====================================

        const densityBar =
            document.getElementById(
                "densityBar"
            );


        if (densityBar) {

            densityBar.style.width =
                data.crowd.density + "%";

        }


        // ====================================
        // ZONE ANALYTICS
        // ====================================

        document.getElementById(
            "safeZones"
        ).innerText =
            data.zones.safe;


        document.getElementById(
            "warningZones"
        ).innerText =
            data.zones.warning;


        document.getElementById(
            "dangerZones"
        ).innerText =
            data.zones.danger;


        // ====================================
        // RISK ANALYTICS
        // ====================================

        document.getElementById(
            "riskScoreLarge"
        ).innerText =
            data.risk.score;


        document.getElementById(
            "riskLevelLarge"
        ).innerText =
            data.risk.level + " RISK";


        // ====================================
        // EVENT STATISTICS
        // ====================================

        document.getElementById(
            "totalEvents"
        ).innerText =
            data.total_events;


        document.getElementById(
            "newSOS"
        ).innerText =
            data.new_sos;


        document.getElementById(
            "totalAlerts"
        ).innerText =
            data.total_alerts;


        // ====================================
        // STATUS
        // ====================================

        if (status) {

            status.innerText =
                "🟢 LIVE DATA";

        }

    }


    catch (error) {

        console.error(
            "Analytics Error:",
            error
        );


        if (status) {

            status.innerText =
                "🔴 Backend Offline";

        }

    }

}


// ========================================
// AUTO REFRESH
// ========================================

setInterval(
    loadSOS,
    5000
);


setInterval(
    loadAnalytics,
    5000
);


// ========================================
// PAGE LOAD
// ========================================

window.addEventListener(
    "load",
    function() {

        loadSOS();

        loadAnalytics();

    }
);