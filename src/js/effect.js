/**
 * Imports effect info, sets up prototype with send methods for each newly created object
 * @module effect
 * @see ../App.vue
 */

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

// Map where effect string names are keys to each corresponding effect map
const effectsMap = new Map([
    ["MF-104M Analog Delay", delayMap],
    ["MF-108M Cluster Flux", clusterMap],
    ["MF-105M Midi Murf", murfMap]
]);

/**
  * Returns the initial "current" object which holds default state values
  * This is called when an effect is created for the first time
  * @function setCurrent
  * @param {String} name - name of the effect
  * @returns {Object}
  */
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

/**
  * Private function which is called in a method of the effect prototype
  * Is responsible for sending the midi message to the hardware
  * @function send
  * @param {Object} output - Port Output object
  * @param {Number} channel - MIDI channel to send on
  * @param {Number_or_Array} value  number or array of value of message to be sent
  * @param {Number_or_Array} controller - name of the effect
  * @returns {void}
  */
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
    /**
     * On the prototype of all effects: this method returns a promise
     * when called, the promise is resolved in approximately 20 ms
     * This delay is important to avoid a glitch in the moogs for 
     * not being able to receive messages that are too close together
     * @method sendMessage
     * @param {String} state - Name of the state on which to send a message
     * @param {Number_or_Array} value - number or array of value of message to be sent
     * @param {Object} el - DOM element object on which to blink an outline around upon message send
     * @returns {Promise}
     */
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
                    send(this.vm.output, this.channel - 1, 127, 88);
                }

                // do not send the message if: 
                // the requested change is LFO Rate and LFO Clock sync is engaged  OR 
                // the requested change is Time and Delay Clock sync is engaged
                // this clears up a bug in the moogs where even if the clock is synced and you send all messages,
                // the time cc message will take precedence over the clock sync tempo 
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
    /**
     * On the prototype of all effects: this method returns a promise
     * to send all messages for one effect.
     * Once all message sends are completed it resolves.
     * @method sendAllMessages
     * @returns {Promise}
     */
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

/**
 * returns the effect object to be created based on the effect prototype,
 * @function effectConstruct
 * @param {String} name - name of the effect
 * @returns {Object}
 */
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