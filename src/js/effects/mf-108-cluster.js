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
            controller: 91,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "Range",
        {
            controller: 74,
            component: "multiswitch",
            options: [
                { value: 0,   html: "Flange" }, 
                { value: 127, html: "Chorus" }
            ]
        }
    ],
    [
        "Tap Tempo",
        {
            controller: 92,
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
            controller: 70,
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
            controller: 72,
            component: "multiswitch",
            options: [
                { value: 0,  html: "reset" }, 
            ]
        }
    ],
    [
        "LFO Clock Sync",
        {
            controller: 76,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "LFO Clock Divisions",
        {
            controller: 71,
            component: "selectMenu",
            options: clockDivisions
        }
    ],
    [
        "Enable LFO Note Reset",
        {
            controller: 73,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "Delay Time Portamento",
        {
            controller: [5, 37],
            default: [0, 0],
            component: "continuous"
        }
    ],
    [
        "Delay Time Multiplier",
        {
            controller: 75,
            component: "selectMenu",
            options: delayTimeMultiplier
        }
    ],
    [
        "MIDI Note Mode",
        {
            controller: 77,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "Enable MIDI Note Spillover",
        {
            controller: 78,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "Enable Mod Wheel to LFO Amount",
        {
            controller: 79,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "Pitch Bend Semitones",
        {
            controller: 80,
            component: "selectMenu",
            options: semitones
        }
    ]
]);