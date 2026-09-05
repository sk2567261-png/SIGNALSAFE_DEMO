// ========================================
// SIGNALSAFE USER DASHBOARD
// ========================================

const BACKEND_URL = "http://127.0.0.1:8000";

const PARTICIPANT_ID = "SS-001-0001";
const EVENT_ID = 1;

let currentLatitude = null;
let currentLongitude = null;


// ========================================
// GPS LOCATION
// ========================================

function startGPS() {

    if (!navigator.geolocation) {

        console.log("GPS not supported");

        return;
    }

    navigator.geolocation.watchPosition(

        function (position) {

            currentLatitude =
                position.coords.latitude;

            currentLongitude =
                position.coords.longitude;

            console.log(
                "GPS:",
                currentLatitude,
                currentLongitude
            );

        },

        function (error) {

            console.error(
                "GPS Error:",
                error
            );

        },

        {
            enableHighAccuracy: true,
            maximumAge: 5000,
            timeout: 10000
        }
    );
}


// ========================================
// SEND SOS
// ========================================

async function sendSOS() {

    const message =
        "Emergency SOS requested by participant.";

    const sosData = {

        participant_id:
            PARTICIPANT_ID,

        event_id:
            EVENT_ID,

        latitude:
            currentLatitude
                ? String(currentLatitude)
                : null,

        longitude:
            currentLongitude
                ? String(currentLongitude)
                : null,

        message:
            message

    };


    try {

        const response =
            await fetch(
                BACKEND_URL + "/sos",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            sosData
                        )
                }
            );


        const data =
            await response.json();


        console.log(
            "SOS Response:",
            data
        );


        alert(
            "🚨 SOS SENT!\n\n" +
            "SIGNALSAFE Control Center has received your emergency request."
        );


    }

    catch (error) {

        console.error(
            "SOS Error:",
            error
        );


        alert(
            "❌ Unable to send SOS.\nPlease try again."
        );

    }

}


// ========================================
// LOAD SAFETY ALERTS
// ========================================

async function loadUserAlerts() {

    try {

        const response =
            await fetch(
                BACKEND_URL +
                "/alerts?event_id=" +
                EVENT_ID
            );


        const data =
            await response.json();


        const container =
            document.getElementById(
                "userAlertsContainer"
            );


        if (!container) {

            return;

        }


        container.innerHTML = "";


        if (
            !data ||
            data.length === 0
        ) {

            container.innerHTML = `

                <div class="no-user-alert">

                    🟢 No new safety alerts

                </div>

            `;

            return;

        }


        data
            .slice()
            .reverse()
            .forEach(
                function (alertData) {

                    const alertBox =
                        document.createElement(
                            "div"
                        );


                    alertBox.className =
                        "user-alert";


                    alertBox.innerHTML = `

                        <div
                            style="
                                font-size:22px;
                                margin-bottom:8px;
                            "
                        >
                            📢
                        </div>

                        <strong>
                            ${alertData.title}
                        </strong>

                        <p>
                            ${alertData.message}
                        </p>

                        <small>
                            ⚠️ Type:
                            ${alertData.alert_type}
                        </small>

                    `;


                    container.appendChild(
                        alertBox
                    );

                }
            );

    }

    catch (error) {

        console.error(
            "Safety Alert Error:",
            error
        );

    }

}


// ========================================
// MAP
// ========================================

function showMap() {

    if (
        currentLatitude === null ||
        currentLongitude === null
    ) {

        alert(
            "📍 Waiting for your GPS location..."
        );

        return;

    }


    const mapSection =
        document.getElementById(
            "riskMapSection"
        );


    if (mapSection) {

        mapSection.style.display =
            "block";

    }


    createRiskMap();

}


// ========================================
// CREATE USER RISK MAP
// ========================================

function createRiskMap() {

    if (
        currentLatitude === null ||
        currentLongitude === null
    ) {

        return;

    }


    const mapContainer =
        document.getElementById(
            "riskMap"
        );


    if (!mapContainer) {

        return;

    }


    if (
        mapContainer._leaflet_id
    ) {

        return;

    }


    const map =
        L.map(
            "riskMap"
        ).setView(
            [
                currentLatitude,
                currentLongitude
            ],
            16
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);


    L.marker(
        [
            currentLatitude,
            currentLongitude
        ]
    )
    .addTo(map)
    .bindPopup(
        "📍 Your Current Location"
    )
    .openPopup();

}


// ========================================
// INITIAL START
// ========================================

startGPS();

loadUserAlerts();


// ========================================
// AUTO REFRESH ALERTS
// ========================================

setInterval(
    function () {

        loadUserAlerts();

    },
    5000
);