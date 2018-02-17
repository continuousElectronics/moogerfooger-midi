import { 
    onOff,
    delayTimeMultiplier,
    lfoWaveform,
    semitones,
    clockDivisions
} from "../state-options";

export default new Map([
    [
        "Bypass",
        {
            controller: 80,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "Range",
        {
            controller: 86,
            component: "multiswitch",
            options: [
                { value:  0, html: "Slow" }, 
                { value: 64, html: "Fast" }
            ]
        }
    ],
    [
        "Filter",
        {
            controller: 85,
            component: "multiswitch",
            options: [
                { value:  0, html: "Bright" }, 
                { value: 64, html: "Dark"   }
            ]
        }
    ],
    [
        "Tap Tempo",
        {
            controller: 114,
            component: "multiswitch",
            options: [
                { value: 0, html: "tap"}
            ]
        }
    ],
    [
        "Level",
        {
            controller: [7, 39],
            default: [127, 127],
            component: "continuous"
        }
    ],
    [
        "Time",
        {
            controller: [12, 44],
            default: [64, 0],
            component: "continuous"
        }
    ],
    [
        "Feedback",
        {
            controller: [13, 45],
            default: [64, 0],
            component: "continuous"
        }
    ],
    [
        "Mix",
        {
            controller: [14, 46],
            default: [64, 0],
            component: "continuous"
        }
    ],
    [
        "LFO Waveform",
        {
            controller: 102,
            component: "selectMenu",
            options: lfoWaveform
        }
    ],
    [
        "LFO Rate",
        {
            controller: [15, 47],
            default: [64, 0],
            component: "continuous"
        }
    ],
    [
        "LFO Amount",
        {
            controller: [16, 48],
            default: [64, 0],
            component: "continuous"
        }
    ],
    [
        "LFO Phase Reset",
        {
            controller: 105,
            component: "multiswitch",
            options: [
                { value: 0,  html: "reset" }, 
            ]
        }
    ],
    [
        "Delay Clock Sync",
        {
            controller: 89,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "Delay Clock Division",
        {
            controller: 90,
            component: "selectMenu",
            options: clockDivisions
        }
    ],
    [
        "LFO Clock Sync",
        {
            controller: 108,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "LFO Clock Division",
        {
            controller: 107,
            component: "selectMenu",
            options: clockDivisions
        }
    ],
    [
        "LFO Sync Phase Reset",
        {
            controller: 111,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "LFO Freeze",
        {
            controller: 92,
            component: "multiswitch",
            options: [
                { value: 127, html: "freeze" }, 
                { value: 0,   html: "run" }
            ]
        }
    ],
    [
        "Slew Rate",
        {
            controller: [5, 37],
            default: [0, 0],
            component: "continuous"
        }
    ],
    [
        "Delay Time Multiplier",
        {
            controller: 87,
            component: "selectMenu",
            options: delayTimeMultiplier
        }
    ],
    [
        "Spillover",
        {
            controller: 82,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "Tap Destination",
        {
            controller: 116,
            component: "multiswitch",
            options: [
                { value: 0,   html: "time" }, 
                { value: 127, html: "LFO" }
            ]
        }
    ],
    [
        "LED Select",
        {
            controller: 117,
            component: "multiswitch",
            options: [
                { value: 0,   html: "time" },
                { value: 127, html: "midi" }
            ]
        }
    ],
    [
        "Time LED Divider",
        {
            controller: 118,
            component: "selectMenu",
            options: [
                { value: 0,   html: "x1" },
                { value: 16,  html: "x2" },
                { value: 32,  html: "x3" },
                { value: 48,  html: "x4" },
                { value: 64,  html: "x5" },
                { value: 80,  html: "x6" },
                { value: 96,  html: "x7" },
                { value: 112, html: "x8" }
            ]
        }
    ],
    [
        "Time LED Tracks",
        {
            controller: 95,
            component: "multiswitch",
            options: [
                { value: 0,   html: "time" },
                { value: 127, html: "mod" }
            ]
        }
    ],
    [
        "MIDI Note Mode",
        {
            controller: 113,
            component: "selectMenu",
            options: [
                { value: 0,  html: "off" },
                { value: 42, html: "absolute" },
                { value: 84, html: "relative" }
            ]
        }
    ],
    [
        "Enable MIDI Note Spillover",
        {
            controller: 110,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "Enable LFO Note Reset",
        {
            controller: 109,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "Pitch Bend Semitones",
        {
            controller: 83,
            component: "selectMenu",
            options: semitones
        }
    ],
    [
        "Enable Mod Wheel to LFO Amount",
        {
            controller: 119,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "Mod Wheel to LFO Amount",
        {
            controller: [1, 33],
            component: "continuous",
            default: [0, 0]
        }
    ],
    [
        "Punch in Spillover",
        {
            controller: 81,
            component: "multiswitch",
            options: onOff
        }
    ]
]);