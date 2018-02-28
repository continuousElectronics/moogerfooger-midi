/**
 * Imports svg strings for dropdown menu options that need them
 * and produces arrays of options to be exported used by multiple effects
 * @module state-options
 * @see ./effects/mf-104-delay.js, ./effects/mf-105-murf.js, ./effects/mf-108-cluster.js
 */

import { renderSymbols } from "./utility.js";
import sine     from "../assets/svg/sine.svg";
import triangle from "../assets/svg/triangle.svg";
import square   from "../assets/svg/square.svg";
import rampup   from "../assets/svg/rampup.svg";
import rampdown from "../assets/svg/rampdown.svg";
import random   from "../assets/svg/random.svg";
import smthrand from "../assets/svg/smthrand.svg";

const onOff = [
    { value:  0, html: "off" },
    { value: 64, html: "on"  }
];

const delayTimeMultiplier = [
    { value: 0,  html: "x1" }, 
    { value: 32, html: "x2" },
    { value: 64, html: "x4" }, 
    { value: 96, html: "x8" }
];

const lfoWaveform = [
    { value:  0, html: sine     },
    { value: 16, html: triangle },
    { value: 32, html: square   },
    { value: 48, html: rampup   },
    { value: 64, html: rampdown },
    { value: 80, html: random   },
    { value: 96, html: smthrand }
];

const semitones = [
    { value:  0, html: "off" },
    { value: 16, html: "2"   },
    { value: 32, html: "3"   },
    { value: 48, html: "4"   },
    { value: 64, html: "5"   },
    { value: 80, html: "7"   },
    { value: 96, html: "12"  },
    { value: 96, html: "24"  }
];

const clockDivisions = [
    { value:   0, html: renderSymbols("whole", "whole", "whole", "whole") },
    { value:   6, html: renderSymbols("whole", "whole", "whole") },
    { value:  12, html: renderSymbols("whole", "whole") },
    { value:  18, html: renderSymbols("whole", "half", "dot") },
    { value:  24, html: renderSymbols("whole", "half") },
    { value:  30, html: renderSymbols("whole", "quarter") },
    { value:  35, html: renderSymbols("whole") },
    { value:  41, html: renderSymbols("half", "dot") },
    { value:  47, html: renderSymbols("whole") + " triplet" },
    { value:  53, html: renderSymbols("half") },
    { value:  59, html: renderSymbols("quarter", "dot") },
    { value:  64, html: renderSymbols("half") + " triplet" },
    { value:  70, html: renderSymbols("quarter") },
    { value:  76, html: renderSymbols("eighth", "dot") },
    { value:  82, html: renderSymbols("quarter") + " triplet" },
    { value:  88, html: renderSymbols("eighth") },
    { value:  94, html: renderSymbols("sixteenth", "dot") },
    { value:  99, html: renderSymbols("eighth") + " triplet" },
    { value: 105, html: renderSymbols("sixteenth") },
    { value: 111, html: renderSymbols("sixteenth") + " triplet" },
    { value: 117, html: renderSymbols("thirtysecond") },
    { value: 123, html: renderSymbols("thirtysecond") + " triplet" },
];

export {
    /**
     * All exports are 
     * @Object
     * @param {string} color - A color, in hexadecimal format.
     * @returns {Array.<number>} An array of the red, green, and blue values,
     * each ranging from 0 to 255.
     */
    onOff,
    delayTimeMultiplier,
    lfoWaveform,
    semitones,
    clockDivisions
};

