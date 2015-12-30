var SETUP = {
    CAM: {
        ORTH_NEAR_PLANE: -1000,
        ORTH_FAR_PLANE: 1000,
        PERP_NEAR_PLANE: 1,
        PERP_FAR_PLANE: 10000,
        FOV: 70,
        ORTHO: false,
        VIEWSIZE: 1000
    },
    SCENE: {
        AXIS_LENGTH: 50,
        GRID: false,
        GROUND: false
    },
    LIGHTS: {
        DIRECTIONAL: true,
        SPOT: true,
        AMBIENT: true
    },
    DEBUG_MODE: true,
    'LOAD_DELAY': 1500
};

// Export the SETUP object for **Node.js**, with
// backwards-compatibility for the old `require()` API. If we're in
// the browser, add `_` as a global object via a string identifier,
// for Closure Compiler "advanced" mode.
if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = SETUP;
    }
    exports.SETUP = SETUP;
} else {
    this['SETUP'] = SETUP;
}
