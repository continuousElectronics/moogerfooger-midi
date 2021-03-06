<template>
    <div id="app">
        <div class="global-wrapper">
            <!-- These components are available globally regardless of effects setup -->
            <avail-effects @effectEvent="createEffect($event)"></avail-effects>
            <midi-dest @destEvent="output = $event" :outputs="outputs"></midi-dest>
            <midi-clock :output="output"></midi-clock>
            <global-send @globalSendEvent="globalSend"></global-send>
        </div>
        <!-- the newly created effects are mounted inside the below effects-wrapper -->
        <div class="effects-wrapper" ref="efxWrap">

        </div>
    </div>
</template>

<script>

import Vue from "vue";
import { setupMenuListeners } from "./fileOperations.js";
import { effectConstruct, setCurrent } from "./js/effect.js";
import { toClassName, markIfFileChanged, outlineBlink } from "./js/utility.js";
import effect       from "./components/effect.vue";
import availEffects from "./components/global/available-effects.vue";
import midiDest     from "./components/global/midi-destination.vue";
import midiClock    from "./components/global/midi-clock.vue";
import globalSend   from "./components/global/global-send.vue";

const
    remote    = require("electron").remote,
    effectMax = 16; // maximum number of effects allowed to be created

export default {
    name: "app",
    components: { 
        effect, 
        availEffects, 
        midiDest, 
        midiClock,
        globalSend
    },
    props: {
        WebMidi: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            outputs: [],
            output:  {},
            effects: [],
            filepath: undefined,
            fileChanged: false
        };
    },
    beforeMount() {
        // using ipcRenderer to setup file and menu operations.
        setupMenuListeners(this);

        // setup outputs on program load
        this.outputs = this.WebMidi.outputs;
    },
    methods: {
        /**
         * constructs new effect object, pushes into "effects" array in data, and mounts effect in DOM
         * @function createEffect
         * @param {String} effectName - Name of the effect
         * @param {Object} current - Holds all of the current state values.
         * @param {Number} channel - Number between 1 - 16 representing MIDI channel
         * @param {String} fileopen - The existance of it indicates if this function is called from file open process
         * @returns {void}
         */
        createEffect(effectName, current, channel, fileopen) {
            const len = this.effects.length;
            
            // do not allow user to create more effects than max
            if (len >= effectMax) {
                remote.dialog.showErrorBox(
                    "error",
                    "you cannot create more than " + effectMax + " effects"
                );
                return;
            }
            
            // mark file changed (if not called from from file open process)
            markIfFileChanged(this, fileopen);

            // construct new effect object, initialize props, push into array to keep track of it.
            const newEffect = effectConstruct(effectName);
            
            newEffect.channel = (channel) ? channel : len + 1;
            newEffect.current = (current) ? current : setCurrent(effectName);
            newEffect.vm      = this;
            
            this.effects.push(newEffect);
            
            // create mount point and attach to effects wrapper. mount new effect instance.
            const 
                wrap = document.createElement("div"),
                ctor = Vue.extend(effect),
                inst = new ctor({ propsData: { effect: newEffect } });
                
            this.$refs.efxWrap.appendChild(wrap);
            inst.$mount(wrap);
            newEffect.component = inst;
        },
        /**
         * Called from "global-send" component: 
         * Sends all of the messages on all effects on the current setup
         * @function globalSend
         * @returns {void}
         */
        globalSend() {
            for (let node of this.$refs.efxWrap.childNodes) {
                outlineBlink(node);
            }
            
            let effects = this.effects;
            let index = 0;

            // after all messages on the "current" object are sent for each existing effect
            // we recurse until all messages for all effects have been sent
            // this is done to avoid glitches from message sends too close together
            const sendAllLoop = (effect) => {
                effect.sendAllMessages().then(val => {
                    index += 1;
                    if (index < effects.length) {
                        sendAllLoop(effects[index]);
                        return;
                    }
                });
            };

            // start recursion
            sendAllLoop(effects[0]);
        },
        toClassName
    }
};

</script>