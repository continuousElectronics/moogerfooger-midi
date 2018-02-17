import delayMap   from "./effects/mf-104-delay.js";
import clusterMap from "./effects/mf-108-cluster.js";
import murfMap    from "./effects/mf-105-murf.js";
import create     from "proto-create";
import { sendCC, sendProgram, outlineBlink } from "./utility.js";
 
const effectsMap = new Map([
    ["MF-104M Analog Delay", delayMap],
    ["MF-108M Cluster Flux", clusterMap],
    ["MF-105M Midi Murf", murfMap]
]);

const setCurrent = function (map) {
    let o = {};

    for (let [key, val] of map.entries()) {
        if (val.default !== undefined) {
            o[key] = val.default;
        }
    }

    return o;
};

const effectPrototype = {
    sendMessage(state, value, output, el) {
        const 
            effectMap = effectsMap.get(this.name),
            controller = effectMap.get(state).controller,
            channel = this.channel;

        this.current[state] = value;
        // console.log(this);
        // console.log(channel);
        // console.log(this.current);
        if ( 
            ( !Number.isInteger(value) && !Array.isArray(value) ) || 
              !Number.isInteger(channel)
        ) {
            return;
        }
        if (controller) {
            sendCC({   controller, value, channel, output });
        } else {
            sendProgram({ program: value, channel, output });
        }
        if (el) {
            outlineBlink(el);
        }
    },
    sendAllMessages(output) {
        const currentEntries = Object.entries(this.current);
        
        for (let [state, value] of currentEntries) {
            this.sendMessage(state, value, output);
        }
    },
};

const effectConstruct = function (name, id) {
    const stateMap = effectsMap.get(name);
    
    return create({
        proto: effectPrototype,
        target: {
            name,
            id,
            stateMap,
            channel: 1,
            current: setCurrent(stateMap)
        }
    });
};

export { effectConstruct, effectsMap };