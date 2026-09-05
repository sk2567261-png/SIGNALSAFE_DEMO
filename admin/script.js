// ========================================
// SIGNALSAFE ADMIN DASHBOARD
// ========================================

const BACKEND_URL = "http://127.0.0.1:8000";


// ========================================
// LOAD ANALYTICS
// ========================================

async function loadAnalytics() {

    try {

        const response =
            await fetch(
                BACKEND_URL + "/analytics"
            );

        const data =
            await response.json();


        document.getElementById(
            "totalCrowd"
        ).textContent =
            data.crowd.total;


        document.getElementById(
            "density"
        ).textContent =
            data.crowd.density + "%";


        document.getElementById(
            "spacing"
        ).textContent =
            data.crowd.spacing + " m";


        document.getElementById(
            "sosCount"
        ).textContent =
            data.new_sos;


        document.getElementById(
            "riskScore"
        ).textContent =
            data.risk.score;


        document.getElementById(
            "riskLevel"
        ).textContent =
            data.risk.level + " RISK";

    }

    catch (error) {

        console.error(
            "Analytics error:",
            error
        );

    }

}


// ========================================
// LOAD ZONES
// ========================================

async function loadZones() {

    try {

        const response =
            await fetch(
                BACKEND_URL + "/zones"
            );

        const data =
            await response.json();


        const zones =
            data.zones;


        if (zones[0]) {

            document.getElementById(
                "zoneACrowd"
            ).textContent =
                zones[0].crowd;

        }


        if (zones[1]) {

            document.getElementById(
                "zoneBCrowd"
            ).textContent =
                zones[1].crowd;

        }


        if (zones[2]) {

            document.getElementById(
                "zoneCCrowd"
            ).textContent =
                zones[2].crowd;

        }

    }

    catch (error) {

        console.error(
            "Zone error:",
            error
        );

    }

}


// ========================================
// LOAD SOS
// ========================================

async function loadSOS() {

    try {

        const response =
            await fetch(
                BACKEND_URL + "/sos"
            );

        const data =
            await response.json();


        const container =
            document.getElementById(
                "alertContainer"
            );


        container.innerHTML = "";


        if (data.length === 0) {

            container.innerHTML =
                `
                <div class="alert-box">

                    ✅ No emergency SOS alerts.

                </div>
                `;

            return;

        }


        data.forEach(
            function(sos) {

                const alert =
                    document.createElement(
                        "div"
                    );


                alert.className =
                    "alert-box";


                alert.innerHTML = `

                    <strong>
                        🚨 EMERGENCY SOS
                    </strong>

                    <br><br>

                    👤 Participant:
                    <strong>
                        ${sos.participant_id}
                    </strong>

                    <br>

                    🎫 Event:
                    ${sos.event_id}

                    <br>

                    📍 Location:
                    ${sos.latitude || "Not available"},
                    ${sos.longitude || "Not available"}

                    <br>

                    💬 Message:
                    ${sos.message}

                    <br>

                    ⚠️ Status:
                    <strong>
                        ${sos.status}
                    </strong>

                `;


                container.appendChild(
                    alert
                );

            }
        );


    }

    catch (error) {

        console.error(
            "SOS error:",
            error
        );

    }

}


// ========================================
// LOAD ALERTS
// ========================================

async function loadAlerts() {

    try {

        const response =
            await fetch(
                BACKEND_URL + "/alerts?event_id=1"
            );

        const data =
            await response.json();


        console.log(
            "Safety Alerts:",
            data
        );

    }

    catch (error) {

        console.error(
            "Alert error:",
            error
        );

    }

}


// ========================================
// SEND ALERT
// ========================================

async function sendAlert() {

    const alertData = {

        event_id: 1,

        title:
            "⚠️ Safety Alert",

        message:
            "Please move towards the nearest safe zone.",

        alert_type:
            "SAFETY"

    };


    try {

        const response =
            await fetch(
                BACKEND_URL + "/alerts",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            alertData
                        )
                }
            );


        const data =
            await response.json();


        alert(
            "📢 Safety alert sent successfully!"
        );


        loadAlerts();

    }

    catch (error) {

        console.error(
            "Send alert error:",
            error
        );

        alert(
            "Unable to send alert."
        );

    }

}


// ========================================
// REFRESH DASHBOARD
// ========================================

async function refreshDashboard() {

    await loadAnalytics();

    await loadZones();

    await loadSOS();

    await loadAlerts();

}


// ========================================
// INITIAL LOAD
// ========================================

refreshDashboard();


// ========================================
// AUTO REFRESH
// ========================================

setInterval(
    function() {

        loadAnalytics();

        loadZones();

        loadSOS();

        loadAlerts();

    },
    5000
);