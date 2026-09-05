// ========================================
// SIGNALSAFE ADMIN INTERACTIVE RISK MAP
// ========================================

const RISK_MAP_BACKEND = "http://127.0.0.1:8000";

let riskMap = null;
let zoneMarkers = [];

function createRiskMap() {

    if (riskMap !== null) {
        return;
    }

    if (typeof L === "undefined") {
        console.error("Leaflet library not found.");
        return;
    }

    const mapContainer = document.getElementById("riskMap");

    if (!mapContainer) {
        console.error("riskMap container not found.");
        return;
    }

    // Demo event location
    const latitude = 11.0168;
    const longitude = 76.9558;

    riskMap = L.map("riskMap").setView(
        [latitude, longitude],
        15
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(riskMap);

    loadRiskZones();
}


// ========================================
// LOAD LIVE ZONES
// ========================================

async function loadRiskZones() {

    try {

        const response = await fetch(
            RISK_MAP_BACKEND + "/zones"
        );

        const data = await response.json();

        console.log("Risk Map Zones:", data);

        const zones = data.zones;

        // Clear old markers
        zoneMarkers.forEach(function(marker) {
            riskMap.removeLayer(marker);
        });

        zoneMarkers = [];

        if (zones[0]) {
            createZone(
                zones[0],
                11.0168,
                76.9558
            );
        }

        if (zones[1]) {
            createZone(
                zones[1],
                11.0190,
                76.9590
            );
        }

        if (zones[2]) {
            createZone(
                zones[2],
                11.0135,
                76.9620
            );
        }

    } catch (error) {

        console.error(
            "Risk map error:",
            error
        );

    }
}


// ========================================
// CREATE ZONE
// ========================================

function createZone(
    zone,
    latitude,
    longitude
) {

    let zoneColor = "green";

    if (zone.color === "YELLOW") {
        zoneColor = "orange";
    }

    if (zone.color === "RED") {
        zoneColor = "red";
    }


    // ------------------------------------
    // Risk Circle
    // ------------------------------------

    const circle = L.circle(
        [latitude, longitude],
        {
            radius: 300,

            color: zoneColor,

            fillColor: zoneColor,

            fillOpacity: 0.35,

            weight: 3
        }
    ).addTo(riskMap);


    // ------------------------------------
    // Zone Information Popup
    // ------------------------------------

    circle.bindPopup(`

        <div style="
            min-width:220px;
            font-family:Arial;
        ">

            <h3 style="
                margin-top:0;
                margin-bottom:10px;
            ">
                ${getStatusIcon(zone.status)}
                ${zone.name}
            </h3>

            <hr>

            <p>
                <strong>Status:</strong>
                ${zone.status}
            </p>

            <p>
                <strong>👥 Crowd:</strong>
                ${zone.crowd}
            </p>

            <p>
                <strong>📊 Density:</strong>
                ${zone.density}%
            </p>

            <p>
                <strong>↔️ Spacing:</strong>
                ${zone.spacing} m
            </p>

            <p>
                <strong>⚠️ Risk Score:</strong>
                ${zone.risk_score}
            </p>

        </div>

    `);


    // ------------------------------------
    // Zone Name Label
    // ------------------------------------

    const label = L.marker(
        [latitude, longitude],
        {
            icon: L.divIcon({

                className:
                    "signalsafe-zone-label",

                html: `
                    <div style="
                        background:white;
                        padding:7px 12px;
                        border-radius:20px;
                        border:3px solid ${zoneColor};
                        font-weight:bold;
                        font-size:14px;
                        box-shadow:0 2px 8px rgba(0,0,0,0.3);
                        white-space:nowrap;
                    ">
                        ${getStatusIcon(zone.status)}
                        ${zone.name}
                    </div>
                `,

                iconSize: null,

                iconAnchor: [50, 15]

            })
        }
    ).addTo(riskMap);


    // ------------------------------------
    // Click label → popup
    // ------------------------------------

    label.on(
        "click",
        function() {

            circle.openPopup();

        }
    );


    zoneMarkers.push(circle);
    zoneMarkers.push(label);
}


// ========================================
// STATUS ICON
// ========================================

function getStatusIcon(status) {

    if (status === "SAFE") {
        return "🟢";
    }

    if (status === "WARNING") {
        return "🟠";
    }

    if (status === "DANGER") {
        return "🔴";
    }

    return "⚪";
}


// ========================================
// REFRESH MAP
// ========================================

function refreshRiskMap() {

    if (riskMap !== null) {

        riskMap.remove();

        riskMap = null;

        zoneMarkers = [];

    }

    createRiskMap();
}


// ========================================
// AUTO REFRESH EVERY 5 SECONDS
// ========================================

setInterval(
    function() {

        if (riskMap !== null) {

            loadRiskZones();

        }

    },
    5000
);


// ========================================
// START MAP
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        createRiskMap();

    }
);