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

const effectPrototype = {
    sendMessage(state, value, el) {
        const 
            effectMap  = effectsMap.get(this.name),
            stateObj   = effectMap.get(state),
            channel    = this.channel,
            output     = this.vm.output;

        if (!stateObj.options || stateObj.options.length > 1) {
            this.current[state] = value;
            markIfFileChanged(this.vm);
        }

        if (!isIntOrArray(value) || !isInt(channel) || output.connection !== "open") {
            return;
        }

        let controller = stateObj.controller;
        
        // if controller is defined on state Object, it is a CC message, otherwise it is a Program Change
        if (controller) {
            controller = isArray(controller) ? controller : [controller];
            value      = isArray(value)      ? value      : [value];

            for (let i of controller.keys()) {
                console.log("cc: ", controller[i], "val: ", value[i], "channel: ", channel);
                output.sendControlChange(controller[i], value[i], channel);
            }
        } else {
            console.log("progam: ", value, "channel: ", channel);
            output.sendProgramChange(value, channel);
        }

        // Outline state blinks on message send
        if (el) {
            outlineBlink(el);
        }
    },
    sendAllMessages() {
        const nodes = this.vm.$el.querySelector(".effects-wrapper").childNodes;
        
        for (let node of nodes) {
            outlineBlink(node);
        }
        for (let [state, value] of Object.entries(this.current)) {
            this.sendMessage(state, value);
        }
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