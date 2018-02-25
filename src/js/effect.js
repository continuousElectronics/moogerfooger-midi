import delayMap   from "./effects/mf-104-delay.js";
import clusterMap from "./effects/mf-108-cluster.js";
import murfMap    from "./effects/mf-105-murf.js";
import create     from "proto-create";
import {
    outlineBlink,
    isInt,
    isIntOrArray,
    isArray,
    markIfFileChanged
} from "./utility.js";
 
const effectsMap = new Map([
    ["MF-104M Analog Delay", delayMap],
    ["MF-108M Cluster Flux", clusterMap],
    ["MF-105M Midi Murf", murfMap]
]);

const setCurrent = function (name) {
    const
        map = effectsMap.get(name),
        o   = {};

    for (let [key, val] of map.entries()) {
        if (val.default !== undefined) {
            o[key] = val.default;
        }
    }

    return o;
};

const send = function (output, channel, value, controller) {
    if (controller) {
        controller = isArray(controller) ? controller : [controller];
        value      = isArray(value)      ? value      : [value];

        for (let i of controller.keys()) {
            output.send("cc", {
                controller: controller[i],
                value: value[i],
                channel: channel
            });
        }
    } else {
        output.send("program", {
            number: value,
            channel: channel
        });
    }
};

const effectPrototype = {
    sendMessage(state, value, el) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const
                    stateObj = effectsMap.get(this.name).get(state),
                    timeWhileSync = (state === "Time" && this.current["Delay Clock Sync"] === 64),
                    lfoWhileSync  = (state === "LFO Rate" && this.current["LFO Clock Sync"] === 64),
                    dclkSyncOn    = (state === "Delay Clock Sync" && value === 64);

                let controller = stateObj.controller;
                
                if (dclkSyncOn) {
                    // triplets disable whenever using delay clock sync
                    send(this.vm.output, this.channel - 1, 0, 88);
                }

                if (!timeWhileSync && !lfoWhileSync) {
                    // subtract 1 from channel since easymidi channels are zero indexed
                    send(this.vm.output, this.channel - 1, value, controller);
                    outlineBlink(el);
                }

                if (!stateObj.options || stateObj.options.length > 1) {
                    this.current[state] = value;
                    markIfFileChanged(this.vm);
                }

                resolve("done");
            }, 20); // inserting 20 ms between each message send to avoid glitch from moogs
        });
    },
    sendAllMessages() {
        return new Promise((resolve, reject) => {    
            let entries = Object.entries(this.current);
            let index = 0;
            
            // each message send is a promise that when finished sends the next entry on "current"
            // when all are done "sendAllMessages" (this function) resolves, as it is a promise itself
            const sendLoop = (entry) => {
                this.sendMessage(entry[0], entry[1]).then(val => {
                    index += 1;
                    if (index < entries.length) {
                        sendLoop(entries[index]);
                        return;
                    }
                    resolve("done");
                });
            };

            // start recursion
            sendLoop(entries[0]);
        });
    },
    get states() {
        return Array.from(
            effectsMap.get(this.name).entries()
        ).map(a => {
            const name = a[0], state = a[1];
            state.name = name;
            return state;
        });
    }
};

const effectConstruct = function (name) {
    return create({
        proto: effectPrototype,
        target: {
            name,
            channel: 1,
            current: {},
            vm:      {}
        }
    });
};

export { effectConstruct, setCurrent, effectsMap };