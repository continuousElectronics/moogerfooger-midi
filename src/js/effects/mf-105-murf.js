import { onOff } from "../state-options";

export default new Map([
    [
        "Set midi channel",
        {
            controller: 102,
            component: "multiswitch",
            options: [
                { value: 0, html: "Set to current" },
            ]
        }   
    ],
    [
        "Bypass",
        {
            controller: 87,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "Staccato",
        {
            controller: 68,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "Drive",
        {
            controller: 2,
            default: 0,
            component: "continuous"
        }
    ],
    [
        "Mix",
        {
            controller: 8,
            default: 0,
            component: "continuous"
        }
    ],
    [
        "Output",
        {
            controller: 7,
            default: 127,
            component: "continuous"
        }
    ],
    [
        "LFO",
        {
            controller: 85,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "Freq Bass / Mids",
        {
            controller: 86,
            component: "multiswitch",
            options: [
                { value:   0, html: "Bass"},
                { value: 127, html: "Mids"}
            ]
        }
    ],
    [
        "Envelope",
        {
            controller: 1,
            default: 0,
            component: "continuous"
        }
    ],
    [
        "Pattern",
        {
            component: "selectMenu",
            options: Array(24).fill().map((x, i) => { 
                return { 
                    value: i,
                    html: (i + 1).toString()
                };
            })
        }
    ],
    [
        "Rate (clock div)",
        {
            controller: 9,
            default: 0,
            component: "continuous"
        }
    ],
    [
        "Filter 110 / 200",
        {   
            controller: 20,
            default: 0,
            component: "continuous"
        }
    ],
    [
        "Filter 160 / 300",
        {   
            controller: 21,
            default: 0,
            component: "continuous"
        }
    ],
    [
        "Filter 240 / 450",
        {   
            controller: 22,
            default: 0,
            component: "continuous"
        }
    ],
    [
        "Filter 350 / 675",
        {   
            controller: 23,
            default: 0,
            component: "continuous"
        }
    ],
    [
        "Filter 525 / 1k",
        {   
            controller: 24,
            default: 0,
            component: "continuous"
        }
    ],
    [
        "Filter 775 / 1.5k",
        {   
            controller: 25,
            default: 0,
            component: "continuous"
        }
    ],
    [
        "Filter 1.2k / 2.2k",
        {   
            controller: 26,
            default: 0,
            component: "continuous"
        }
    ],
    [
        "Filter 1.8k / 3.4k",
        {   
            controller: 27,
            default: 0,
            component: "continuous"
        }
    ],
    [
        "LFO Sweep",
        {
            controller: 3,
            default: 0,
            component: "continuous"
        }
    ],
    [
        "Envelope Scale",
        {
            controller: 70,
            default: 0,
            component: "continuous"
        }
    ],
    [
        "Pattern Clock Sync",
        {
            controller: 89,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "Pattern Reset",
        {
            controller: 90,
            component: "multiswitch",
            options: [
                { value: 0, html: "reset"}
            ]
        }
    ],
    [
        "Triplets Disable",
        {
            controller: 66,
            component: "multiswitch",
            options: onOff
        }
    ],
    [
        "Tap Tempo",
        {
            controller: 93,
            component: "multiswitch",
            options: [
                { value: 0, html: "tap"}
            ]
        }
    ],
    [
        "MIDI Stop Mode",
        {
            controller: 95,
            component: "multiswitch",
            options: [
                { value: 0, html: "mode 0"},
                { value: 1, html: "mode 1"}
            ]
        }
    ],
]);