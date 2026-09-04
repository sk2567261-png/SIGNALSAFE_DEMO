// ========================================
// SIGNALSAFE USER DASHBOARD
// ========================================

const BACKEND_URL = "http://127.0.0.1:8000";

const PARTICIPANT_ID = "SS-001-0001";
const EVENT_ID = 1;


// ========================================
// LIVE ZONES
// ========================================

function showZones() {

    document.getElementById("liveZones")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ========================================
// RISK MAP
// ========================================

function showMap() {

    document.getElementById("riskMap")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ========================================
// CCTV
// ========================================

function showCCTV() {

    document.getElementById("cctvSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ========================================
// CROWD RISK
// ========================================

function showRisk() {

    document.getElementById("riskSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ========================================
// SAFE ROUTE
// ========================================

function showRoute() {

    alert(
        "🚶 SAFE ROUTE\n\n" +

        "Recommended Route:\n\n" +

        "Zone A → Safe Corridor → Emergency Exit\n\n" +

        "🟢 Route Status: SAFE"
    );
}


// ========================================
// AI PEOPLE DETECTION
// ========================================

function runAI() {

    const peopleCount =
        document.getElementById(
            "peopleCount"
        );

    if (!peopleCount) {
        return;
    }

    peopleCount.innerText = "...";


    setTimeout(
        function() {

            const detectedPeople =
                Math.floor(
                    Math.random() * 20
                ) + 5;


            peopleCount.innerText =
                detectedPeople;


            const riskPeople =
                document.getElementById(
                    "riskPeople"
                );


            if (riskPeople) {

                riskPeople.innerText =
                    detectedPeople;

            }


            calculateRisk();

        },
        1000
    );
}


// ========================================
// CROWD RISK CALCULATION
// ========================================

function calculateRisk() {

    const peopleElement =
        document.getElementById(
            "riskPeople"
        );


    if (!peopleElement) {
        return;
    }


    let people =
        parseInt(
            peopleElement.innerText
        );


    if (isNaN(people)) {

        people = 780;

    }


    const density =
        Math.min(
            Math.round(
                (people / 1200) * 100
            ),
            100
        );


    let spacing;


    if (density < 40) {

        spacing = 3.2;

    }

    else if (density < 70) {

        spacing = 1.8;

    }

    else {

        spacing = 0.9;

    }


    let riskScore =
        Math.round(
            (density * 0.6) +
            ((1 / spacing) * 20)
        );


    riskScore =
        Math.min(
            riskScore,
            100
        );


    const densityValue =
        document.getElementById(
            "densityValue"
        );


    const spacingValue =
        document.getElementById(
            "spacingValue"
        );


    const riskScoreElement =
        document.getElementById(
            "riskScore"
        );


    if (densityValue) {

        densityValue.innerText =
            density + "%";

    }


    if (spacingValue) {

        spacingValue.innerText =
            spacing + " m";

    }


    if (riskScoreElement) {

        riskScoreElement.innerText =
            riskScore;

    }


    const riskLevel =
        document.getElementById(
            "riskLevel"
        );


    const riskResult =
        document.getElementById(
            "riskResult"
        );


    const safetyTitle =
        document.getElementById(
            "safetyTitle"
        );


    const safetyMessage =
        document.getElementById(
            "safetyMessage"
        );


    const safetyIcon =
        document.getElementById(
            "safetyIcon"
        );


    if (riskScore < 40) {

        if (riskLevel) {

            riskLevel.innerText =
                "LOW RISK";

        }


        if (riskResult) {

            riskResult.innerHTML =
                "🟢 Current Risk: " +
                "<strong>LOW</strong>";

        }


        if (safetyTitle) {

            safetyTitle.innerText =
                "SAFE";

        }


        if (safetyMessage) {

            safetyMessage.innerText =
                "Crowd density is under control";

        }


        if (safetyIcon) {

            safetyIcon.innerText =
                "✓";

        }

    }

    else if (riskScore < 70) {

        if (riskLevel) {

            riskLevel.innerText =
                "MEDIUM RISK";

        }


        if (riskResult) {

            riskResult.innerHTML =
                "🟡 Current Risk: " +
                "<strong>MEDIUM</strong>";

        }


        if (safetyTitle) {

            safetyTitle.innerText =
                "WARNING";

        }


        if (safetyMessage) {

            safetyMessage.innerText =
                "Crowd density is increasing";

        }


        if (safetyIcon) {

            safetyIcon.innerText =
                "!";

        }

    }

    else {

        if (riskLevel) {

            riskLevel.innerText =
                "HIGH RISK";

        }


        if (riskResult) {

            riskResult.innerHTML =
                "🔴 Current Risk: " +
                "<strong>HIGH</strong>";

        }


        if (safetyTitle) {

            safetyTitle.innerText =
                "DANGER";

        }


        if (safetyMessage) {

            safetyMessage.innerText =
                "High crowd density detected";

        }


        if (safetyIcon) {

            safetyIcon.innerText =
                "!";

        }

    }

}


// ========================================
// GPS
// ========================================

async function getLocation() {

    if (!navigator.geolocation) {

        alert(
            "❌ GPS is not supported by this browser."
        );

        return;
    }


    alert(
        "📍 Getting your live location...\n\n" +
        "Please wait."
    );


    navigator.geolocation.getCurrentPosition(

        async function(position) {

            const latitude =
                position.coords.latitude;


            const longitude =
                position.coords.longitude;


            try {

                const response =
                    await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                    );


                const data =
                    await response.json();


                const address =
                    data.address || {};


                const village =
                    address.village ||
                    address.town ||
                    address.city ||
                    address.municipality ||
                    address.suburb ||
                    "Unknown";


                const district =
                    address.county ||
                    address.district ||
                    "";


                const state =
                    address.state ||
                    "";


                let placeName =
                    village;


                if (
                    district &&
                    district !== village
                ) {

                    placeName +=
                        ", " + district;

                }


                if (state) {

                    placeName +=
                        ", " + state;

                }


                alert(

                    "📍 YOUR LIVE LOCATION\n\n" +

                    "🏠 Place: " +
                    placeName +

                    "\n\n" +

                    "🌍 Latitude: " +
                    latitude.toFixed(6) +

                    "\n" +

                    "🌍 Longitude: " +
                    longitude.toFixed(6)

                );

            }

            catch (error) {

                alert(

                    "📍 GPS Location Found!\n\n" +

                    "Latitude: " +
                    latitude.toFixed(6) +

                    "\n" +

                    "Longitude: " +
                    longitude.toFixed(6)

                );

            }

        },


        function() {

            alert(

                "❌ Unable to get your location.\n\n" +

                "Please allow GPS permission."

            );

        },


        {

            enableHighAccuracy: true,

            timeout: 15000,

            maximumAge: 0

        }

    );

}


// ========================================
// SEND SOS TO BACKEND
// ========================================

async function sendSOS() {

    const confirmSOS =
        confirm(
            "🚨 Are you sure you want to send an SOS?"
        );


    if (!confirmSOS) {

        return;

    }


    try {

        let latitude = "";
        let longitude = "";


        // Try to get current GPS

        if (navigator.geolocation) {

            await new Promise(
                function(resolve) {

                    navigator.geolocation.getCurrentPosition(

                        function(position) {

                            latitude =
                                position.coords.latitude
                                    .toString();


                            longitude =
                                position.coords.longitude
                                    .toString();


                            resolve();

                        },

                        function() {

                            resolve();

                        },

                        {

                            enableHighAccuracy: true,

                            timeout: 5000,

                            maximumAge: 0

                        }

                    );

                }
            );

        }


        const response =
            await fetch(
                `${BACKEND_URL}/sos`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        participant_id:
                            PARTICIPANT_ID,

                        event_id:
                            EVENT_ID,

                        latitude:
                            latitude,

                        longitude:
                            longitude,

                        message:
                            "Emergency SOS from participant"

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                "SOS request failed"
            );

        }


        const data =
            await response.json();


        alert(

            "🚨 SOS SENT SUCCESSFULLY!\n\n" +

            "SIGNALSAFE Control Center " +
            "has been notified.\n\n" +

            "Participant ID: " +
            data.participant_id

        );

    }


    catch (error) {

        console.error(
            "SOS Error:",
            error
        );


        alert(

            "❌ Unable to connect to " +
            "SIGNALSAFE Control Center.\n\n" +

            "Please make sure the backend " +
            "server is running."

        );

    }

}


// ========================================
// LOAD ADMIN ALERTS
// ========================================

async function loadUserAlerts() {

    const container =
        document.getElementById(
            "userAlertsContainer"
        );


    if (!container) {

        return;

    }


    try {

        const response =
            await fetch(
                `${BACKEND_URL}/alerts?event_id=${EVENT_ID}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load alerts"
            );

        }


        const alerts =
            await response.json();


        if (!alerts || alerts.length === 0) {

            container.innerHTML = `

                <div class="no-user-alert">

                    🟢 No new safety alerts

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
                    "user-alert";


                // Alert type class

                const type =
                    (
                        alert.alert_type ||
                        "SAFETY"
                    ).toLowerCase();


                alertBox.classList.add(
                    "alert-" + type
                );


                // Time

                let alertTime =
                    "Just now";


                if (alert.created_at) {

                    alertTime =
                        new Date(
                            alert.created_at
                        ).toLocaleString();

                }


                alertBox.innerHTML = `

                    <div class="alert-header">

                        <strong>

                            🚨
                            ${alert.title}

                        </strong>

                        <span class="alert-type">

                            ${alert.alert_type}

                        </span>

                    </div>


                    <p>

                        ${alert.message}

                    </p>


                    <div class="user-alert-time">

                        🕒 ${alertTime}

                    </div>

                `;


                container.appendChild(
                    alertBox
                );

            }
        );

    }


    catch (error) {

        console.error(
            "User Alert Error:",
            error
        );


        container.innerHTML = `

            <div class="no-user-alert">

                ⚠️ Safety alerts are
                temporarily unavailable.

            </div>

        `;

    }

}


// ========================================
// AUTO REFRESH ADMIN ALERTS
// ========================================

setInterval(
    loadUserAlerts,
    5000
);


// ========================================
// PAGE LOAD
// ========================================

window.addEventListener(
    "load",
    function() {

        calculateRisk();

        loadUserAlerts();

    }
);