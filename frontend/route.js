// ========================================
// SIGNALSAFE - SAFE ROUTE
// ========================================

const ROUTE_BACKEND_URL = "http://10.200.188.53:8000";


// ========================================
// FIND SAFEST ROUTE
// ========================================

async function getSafeRouteWithGPS() {

    const result =
        document.getElementById("safeRouteContainer");

    if (!result) {
        return;
    }

    // Use GPS already obtained by script.js
    if (
        typeof currentLatitude === "undefined" ||
        typeof currentLongitude === "undefined" ||
        currentLatitude === null ||
        currentLongitude === null
    ) {

        result.innerHTML = `
            <div class="route-status">
                📍 Waiting for your GPS location...
                <br><br>
                Please wait a few seconds and try again.
            </div>
        `;

        return;
    }


    result.innerHTML = `
        <div class="route-status">
            🔄 Finding safest route...
        </div>
    `;


    try {

        const response =
            await fetch(
                ROUTE_BACKEND_URL + "/zones"
            );


        const data =
            await response.json();


        const zones =
            data.zones || [];


        if (zones.length === 0) {

            result.innerHTML = `
                <div class="route-status">
                    ❌ No zone information available.
                </div>
            `;

            return;
        }


        // Find SAFE zones
        const safeZones =
            zones.filter(
                function(zone) {

                    return zone.status === "SAFE";

                }
            );


        let destination;


        if (safeZones.length > 0) {

            destination = safeZones[0];

        } else {

            // Select zone with lowest risk
            destination =
                zones.reduce(
                    function(previous, current) {

                        return
                            current.risk_score <
                            previous.risk_score
                            ? current
                            : previous;

                    }
                );

        }


        const risk =
            destination.risk_score || 0;


        let status = "SAFE";


        if (risk >= 70) {

            status = "DANGER";

        } else if (risk >= 40) {

            status = "WARNING";

        }


        result.innerHTML = `

            <div class="route-status">

                ${
                    status === "SAFE"
                    ? "🟢"
                    : status === "WARNING"
                    ? "🟡"
                    : "🔴"
                }

                SAFEST ROUTE FOUND

            </div>


            <div class="route-path">

                <div class="route-point">

                    📍

                    <strong>
                        Your Current Location
                    </strong>

                    <br>

                    <small>
                        ${currentLatitude.toFixed(6)},
                        ${currentLongitude.toFixed(6)}
                    </small>

                </div>


                <div class="route-line">
                    ↓
                </div>


                <div class="route-point">

                    ${
                        status === "SAFE"
                        ? "🟢"
                        : status === "WARNING"
                        ? "🟡"
                        : "🔴"
                    }

                    <strong>
                        ${destination.name}
                    </strong>

                    <br>

                    <small>
                        Crowd:
                        ${destination.crowd}
                    </small>

                </div>


                <div class="route-line">
                    ↓
                </div>


                <div class="route-point">

                    🛡️

                    <strong>
                        Safe Corridor
                    </strong>

                </div>


                <div class="route-line">
                    ↓
                </div>


                <div class="route-point">

                    🚪

                    <strong>
                        Emergency Exit
                    </strong>

                </div>

            </div>


            <div class="route-details">

                <div>

                    <span>
                        📍 Destination
                    </span>

                    <strong>
                        ${destination.name}
                    </strong>

                </div>


                <div>

                    <span>
                        👥 Crowd
                    </span>

                    <strong>
                        ${destination.crowd}
                    </strong>

                </div>


                <div>

                    <span>
                        ⚠️ Risk Score
                    </span>

                    <strong>
                        ${risk}
                    </strong>

                </div>


                <div>

                    <span>
                        🛡️ Route Safety
                    </span>

                    <strong>
                        ${status}
                    </strong>

                </div>

            </div>

        `;

    }

    catch (error) {

        console.error(
            "Safe Route Error:",
            error
        );


        result.innerHTML = `

            <div class="route-status">

                ❌ Unable to connect to
                SIGNALSAFE server.

            </div>

        `;

    }

}


// ========================================
// CHECK ROUTE SAFETY
// ========================================

async function checkRouteSafety() {

    try {

        const response =
            await fetch(
                ROUTE_BACKEND_URL + "/zones"
            );


        const data =
            await response.json();


        const zones =
            data.zones || [];


        if (zones.length === 0) {

            alert(
                "❌ No zone data available."
            );

            return;

        }


        const dangerZones =
            zones.filter(
                function(zone) {

                    return zone.status === "DANGER";

                }
            );


        if (dangerZones.length === 0) {

            alert(
                "🟢 Current route conditions are SAFE!"
            );

        } else {

            alert(
                "⚠️ WARNING!\n\n" +
                dangerZones.length +
                " danger zone(s) detected.\n\n" +
                "Please follow the safest route."
            );

        }

    }

    catch (error) {

        console.error(
            "Route safety error:",
            error
        );


        alert(
            "❌ Unable to check route safety."
        );

    }

}


// ========================================
// SHOW SAFE ROUTE
// ========================================

function showSafeRoute() {

    const section =
        document.getElementById(
            "safeRouteSection"
        );


    if (section) {

        section.style.display = "block";

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}