/**
 * Traffic Signs Database (GTSRB 43 Classes)
 * Complete metadata for German Traffic Sign Recognition Benchmark dataset
 */

const TRAFFIC_SIGNS_DB = {
    0: {
        id: 0,
        name: "Speed limit (20km/h)",
        category: "Speed Limit",
        type: "prohibitory",
        shape: "Circle",
        advisory: "Maintain maximum vehicle speed of 20 km/h. Suitable for pedestrian-heavy or residential zones.",
        symbol: "20"
    },
    1: {
        id: 1,
        name: "Speed limit (30km/h)",
        category: "Speed Limit",
        type: "prohibitory",
        shape: "Circle",
        advisory: "Maximum allowed speed is 30 km/h. School zone or dense urban area ahead.",
        symbol: "30"
    },
    2: {
        id: 2,
        name: "Speed limit (50km/h)",
        category: "Speed Limit",
        type: "prohibitory",
        shape: "Circle",
        advisory: "Standard urban speed limit 50 km/h. Monitor traffic signals and cross-streets.",
        symbol: "50"
    },
    3: {
        id: 3,
        name: "Speed limit (60km/h)",
        category: "Speed Limit",
        type: "prohibitory",
        shape: "Circle",
        advisory: "Adjust cruise speed to maximum 60 km/h on urban arterials.",
        symbol: "60"
    },
    4: {
        id: 4,
        name: "Speed limit (70km/h)",
        category: "Speed Limit",
        type: "prohibitory",
        shape: "Circle",
        advisory: "Maximum allowable speed is 70 km/h. Prepare for occasional intersections.",
        symbol: "70"
    },
    5: {
        id: 5,
        name: "Speed limit (80km/h)",
        category: "Speed Limit",
        type: "prohibitory",
        shape: "Circle",
        advisory: "Speed restriction of 80 km/h applies. Common on ring roads and expressway approaches.",
        symbol: "80"
    },
    6: {
        id: 6,
        name: "End of speed limit (80km/h)",
        category: "Derestriction",
        type: "derestriction",
        shape: "Circle",
        advisory: "80 km/h speed restriction ends. Resume default regional or motorway speed.",
        symbol: "80 \u29F8"
    },
    7: {
        id: 7,
        name: "Speed limit (100km/h)",
        category: "Speed Limit",
        type: "prohibitory",
        shape: "Circle",
        advisory: "Rural highway speed limit: maximum 100 km/h. Keep safe following distance.",
        symbol: "100"
    },
    8: {
        id: 8,
        name: "Speed limit (120km/h)",
        category: "Speed Limit",
        type: "prohibitory",
        shape: "Circle",
        advisory: "Motorway speed limit: maximum 120 km/h. Maintain lane discipline.",
        symbol: "120"
    },
    9: {
        id: 9,
        name: "No passing / overtaking",
        category: "Prohibitory",
        type: "prohibitory",
        shape: "Circle",
        advisory: "Do not overtake any multi-tracked motor vehicles. Wait for passing zone.",
        symbol: "\u2298"
    },
    10: {
        id: 10,
        name: "No passing for vehicles > 3.5t",
        category: "Prohibitory",
        type: "prohibitory",
        shape: "Circle",
        advisory: "Heavy trucks and vehicles over 3.5 metric tons cannot overtake.",
        symbol: "\uD83D\uDE9A"
    },
    11: {
        id: 11,
        name: "Right-of-way at intersection",
        category: "Warning / Danger",
        type: "warning",
        shape: "Triangle",
        advisory: "You have priority at the upcoming crossroads. Watch for entering cross-traffic.",
        symbol: "\u2573"
    },
    12: {
        id: 12,
        name: "Priority road",
        category: "Priority",
        type: "priority",
        shape: "Diamond",
        advisory: "You have right-of-way along this road until a cancellation sign appears.",
        symbol: "\u25C7"
    },
    13: {
        id: 13,
        name: "Yield / Give Way",
        category: "Priority",
        type: "priority",
        shape: "Inverted Triangle",
        advisory: "Yield right of way to traffic on the main road. Stop if necessary.",
        symbol: "\u25BD"
    },
    14: {
        id: 14,
        name: "Stop",
        category: "Mandatory / Priority",
        type: "mandatory",
        shape: "Octagon",
        advisory: "Mandatory complete stop at stop line. Yield to all oncoming and cross traffic.",
        symbol: "STOP"
    },
    15: {
        id: 15,
        name: "No vehicles allowed",
        category: "Prohibitory",
        type: "prohibitory",
        shape: "Circle",
        advisory: "All vehicular traffic is prohibited in both directions. Pedestrian area.",
        symbol: "\u2296"
    },
    16: {
        id: 16,
        name: "Vehicles > 3.5t prohibited",
        category: "Prohibitory",
        type: "prohibitory",
        shape: "Circle",
        advisory: "No commercial vehicles or heavy freight carriers over 3.5 tonnes allowed.",
        symbol: "\uD83D\uDE9B"
    },
    17: {
        id: 17,
        name: "No Entry",
        category: "Prohibitory",
        type: "prohibitory",
        shape: "Circle",
        advisory: "Do not enter. One-way traffic oncoming. Danger of head-on collision.",
        symbol: "\u229D"
    },
    18: {
        id: 18,
        name: "General caution / Hazard",
        category: "Warning / Danger",
        type: "warning",
        shape: "Triangle",
        advisory: "Unspecified danger ahead. Reduce speed, scan the roadway attentively.",
        symbol: "!"
    },
    19: {
        id: 19,
        name: "Dangerous curve to the left",
        category: "Warning / Danger",
        type: "warning",
        shape: "Triangle",
        advisory: "Sharp left bend approaching. Decelerate before initiating turn.",
        symbol: "\u21B6"
    },
    20: {
        id: 20,
        name: "Dangerous curve to the right",
        category: "Warning / Danger",
        type: "warning",
        shape: "Triangle",
        advisory: "Sharp right bend approaching. Decelerate before initiating turn.",
        symbol: "\u21B7"
    },
    21: {
        id: 21,
        name: "Double curve (left first)",
        category: "Warning / Danger",
        type: "warning",
        shape: "Triangle",
        advisory: "Series of winding curves ahead, starting with left turn. Drive with care.",
        symbol: "\u223F"
    },
    22: {
        id: 22,
        name: "Bumpy / Rough road",
        category: "Warning / Danger",
        type: "warning",
        shape: "Triangle",
        advisory: "Uneven road surface or speed bumps ahead. Reduce speed to prevent suspension damage.",
        symbol: "\u2358"
    },
    23: {
        id: 23,
        name: "Slippery road",
        category: "Warning / Danger",
        type: "warning",
        shape: "Triangle",
        advisory: "Road surface may be wet, oily or slick. Avoid abrupt braking or steering.",
        symbol: "\u223F"
    },
    24: {
        id: 24,
        name: "Road narrows on the right",
        category: "Warning / Danger",
        type: "warning",
        shape: "Triangle",
        advisory: "Right lane terminates or pavement width reduces. Merge smoothly.",
        symbol: "\u258F"
    },
    25: {
        id: 25,
        name: "Road work / Construction",
        category: "Warning / Danger",
        type: "warning",
        shape: "Triangle",
        advisory: "Road construction zone ahead. Expect workers, equipment, and lowered speeds.",
        symbol: "\uD83D\uDEA7"
    },
    26: {
        id: 26,
        name: "Traffic signals ahead",
        category: "Warning / Danger",
        type: "warning",
        shape: "Triangle",
        advisory: "Upcoming traffic light junction. Prepare to stop if lights cycle to amber.",
        symbol: "\uD83D\uDEA6"
    },
    27: {
        id: 27,
        name: "Pedestrians crossing",
        category: "Warning / Danger",
        type: "warning",
        shape: "Triangle",
        advisory: "Pedestrian activity likely. Yield to persons crossing or stepping onto roadway.",
        symbol: "\uD83D\uDEB6"
    },
    28: {
        id: 28,
        name: "Children crossing / School",
        category: "Warning / Danger",
        type: "warning",
        shape: "Triangle",
        advisory: "School or playground nearby. Anticipate sudden movement of children.",
        symbol: "\uD83D\uDEB8"
    },
    29: {
        id: 29,
        name: "Bicycles crossing",
        category: "Warning / Danger",
        type: "warning",
        shape: "Triangle",
        advisory: "Cyclists entering or crossing roadway. Check side mirrors and blind spots.",
        symbol: "\uD83D\uDEB2"
    },
    30: {
        id: 30,
        name: "Beware of ice / snow",
        category: "Warning / Danger",
        type: "warning",
        shape: "Triangle",
        advisory: "Sub-zero conditions or freezing frost. High risk of black ice patches.",
        symbol: "\u2744"
    },
    31: {
        id: 31,
        name: "Wild animals crossing",
        category: "Warning / Danger",
        type: "warning",
        shape: "Triangle",
        advisory: "Forest or wildlife corridor. Deer or animals may bolt across carriageway.",
        symbol: "\uD83E\uDD8C"
    },
    32: {
        id: 32,
        name: "End of all speed & passing limits",
        category: "Derestriction",
        type: "derestriction",
        shape: "Circle",
        advisory: "All previous temporary restrictions end. Return to standard statutory limits.",
        symbol: "\u2298"
    },
    33: {
        id: 33,
        name: "Turn right ahead",
        category: "Mandatory",
        type: "mandatory",
        shape: "Circle",
        advisory: "Vehicles must execute a right turn at the forthcoming junction.",
        symbol: "\u279C"
    },
    34: {
        id: 34,
        name: "Turn left ahead",
        category: "Mandatory",
        type: "mandatory",
        shape: "Circle",
        advisory: "Vehicles must execute a left turn at the forthcoming junction.",
        symbol: "\u2794"
    },
    35: {
        id: 35,
        name: "Ahead only / Go straight",
        category: "Mandatory",
        type: "mandatory",
        shape: "Circle",
        advisory: "Proceed directly forward. Turning left or right is forbidden.",
        symbol: "\u2B06"
    },
    36: {
        id: 36,
        name: "Go straight or right",
        category: "Mandatory",
        type: "mandatory",
        shape: "Circle",
        advisory: "Only straight and right-turn lanes permitted at this intersection.",
        symbol: "\u2197"
    },
    37: {
        id: 37,
        name: "Go straight or left",
        category: "Mandatory",
        type: "mandatory",
        shape: "Circle",
        advisory: "Only straight and left-turn lanes permitted at this intersection.",
        symbol: "\u2196"
    },
    38: {
        id: 38,
        name: "Keep right",
        category: "Mandatory",
        type: "mandatory",
        shape: "Circle",
        advisory: "Pass obstacle or traffic island on the right side.",
        symbol: "\u2198"
    },
    39: {
        id: 39,
        name: "Keep left",
        category: "Mandatory",
        type: "mandatory",
        shape: "Circle",
        advisory: "Pass obstacle or traffic island on the left side.",
        symbol: "\u2199"
    },
    40: {
        id: 40,
        name: "Roundabout mandatory",
        category: "Mandatory",
        type: "mandatory",
        shape: "Circle",
        advisory: "Mandatory counter-clockwise roundabout circulation. Yield to traffic already inside.",
        symbol: "\u21BB"
    },
    41: {
        id: 41,
        name: "End of no passing",
        category: "Derestriction",
        type: "derestriction",
        shape: "Circle",
        advisory: "Overtaking restriction ends. Vehicles may overtake when safe to do so.",
        symbol: "\u29F8"
    },
    42: {
        id: 42,
        name: "End of no passing for vehicles > 3.5t",
        category: "Derestriction",
        type: "derestriction",
        shape: "Circle",
        advisory: "Truck overtaking restriction ends. Commercial vehicles may resume passing.",
        symbol: "\uD83D\uDE9A \u29F8"
    }
};

/**
 * Returns an inline SVG string for any sign class ID
 */
function getSignSvg(classId, size = 64) {
    const sign = TRAFFIC_SIGNS_DB[classId];
    if (!sign) return '';

    const id = sign.id;
    const cat = sign.type;

    // Red Circle (Speed limit & general prohibitory)
    if (cat === 'prohibitory' || (cat === 'mandatory' && sign.shape === 'Circle' && id !== 14)) {
        if (id <= 8) {
            // Speed limits
            return `
            <svg width="${size}" height="${size}" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#e11d48" stroke-width="10"/>
                <text x="50" y="59" font-family="'Inter', sans-serif" font-weight="900" font-size="${sign.symbol.length > 2 ? '30' : '36'}" text-anchor="middle" fill="#111827">${sign.symbol}</text>
            </svg>`;
        } else if (id === 17) {
            // No Entry
            return `
            <svg width="${size}" height="${size}" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="#e11d48" stroke="#be123c" stroke-width="2"/>
                <rect x="18" y="42" width="64" height="16" rx="3" fill="#ffffff"/>
            </svg>`;
        } else if (id === 15) {
            // No vehicles
            return `
            <svg width="${size}" height="${size}" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#e11d48" stroke-width="10"/>
            </svg>`;
        }
    }

    // Stop Sign (Octagon)
    if (id === 14) {
        return `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100">
            <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="#dc2626" stroke="#ffffff" stroke-width="3"/>
            <text x="50" y="58" font-family="'Inter', sans-serif" font-weight="900" font-size="24" text-anchor="middle" fill="#ffffff" letter-spacing="1">STOP</text>
        </svg>`;
    }

    // Yield (Inverted triangle)
    if (id === 13) {
        return `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100">
            <polygon points="50,92 8,14 92,14" fill="#ffffff" stroke="#dc2626" stroke-width="10" stroke-linejoin="round"/>
        </svg>`;
    }

    // Priority Road (Yellow diamond)
    if (id === 12) {
        return `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100">
            <polygon points="50,6 94,50 50,94 6,50" fill="#ffffff" stroke="#1f2937" stroke-width="3"/>
            <polygon points="50,18 82,50 50,82 18,50" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
        </svg>`;
    }

    // Warning Signs (Red triangle with white background)
    if (cat === 'warning') {
        let innerGraphic = `<text x="50" y="70" font-family="'Inter', sans-serif" font-weight="900" font-size="32" text-anchor="middle" fill="#111827">${sign.symbol}</text>`;
        return `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100">
            <polygon points="50,8 92,86 8,86" fill="#ffffff" stroke="#dc2626" stroke-width="8" stroke-linejoin="round"/>
            ${innerGraphic}
        </svg>`;
    }

    // Mandatory Direction Signs (Blue circle with white arrows)
    if (id >= 33 && id <= 40) {
        return `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="#0284c7" stroke="#ffffff" stroke-width="3"/>
            <text x="50" y="60" font-family="'Inter', sans-serif" font-weight="900" font-size="32" text-anchor="middle" fill="#ffffff">${sign.symbol}</text>
        </svg>`;
    }

    // Derestriction (White circle with diagonal black slash)
    if (cat === 'derestriction') {
        return `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#6b7280" stroke-width="4"/>
            <line x1="20" y1="80" x2="80" y2="20" stroke="#374151" stroke-width="8"/>
            <line x1="26" y1="86" x2="86" y2="26" stroke="#374151" stroke-width="4"/>
        </svg>`;
    }

    // Default Fallback
    return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="#f3f4f6" stroke="#e11d48" stroke-width="6"/>
        <text x="50" y="58" font-family="'Inter', sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#111827">#${id}</text>
    </svg>`;
}

// Export for module or browser window
if (typeof window !== 'undefined') {
    window.TRAFFIC_SIGNS_DB = TRAFFIC_SIGNS_DB;
    window.getSignSvg = getSignSvg;
}

