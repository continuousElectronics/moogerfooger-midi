<template>
    <div id="app">
        <div class="global-wrapper">
            <avail-effects @effectEvent="createEffect($event)"></avail-effects>
            <midi-dest @destEvent="setOutput($event)" :outputs="outputs" :init="initOut"></midi-dest>
            <midi-clock :output="output"></midi-clock>
            <global-send @globalSendEvent="globalSend"></global-send>
        </div>
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
    easymidi  = remote.getGlobal("easymidi"),
    Output    = easymidi.Output,
    effectMax = 16;

export default {
    name: "app",
    components: { 
        effect, 
        availEffects, 
        midiDest, 
        midiClock,
        globalSend
    },
    data() {
        return {
            outputs: [],
            output:  {},
            effects: [],
            initOut: "",
            filepath: undefined,
            fileChanged: false
        };
    },
    beforeMount() {
        // using ipcRenderer to setup file and menu operations.
        setupMenuListeners(this);

        // using chromium API to make "outputs" array of port names reactive 
        navigator.requestMIDIAccess()
            .then(access => {
                const initPort = 0;
                const getPortNames = () => Array.from(
                    access.outputs.values()
                ).map(o => o.name);
                
                this.outputs = getPortNames();
                this.output  = new Output(this.outputs[initPort]);
                this.initOut = this.outputs[initPort];

                access.onstatechange = e => {
                    this.outputs = getPortNames();
                };
            });
    },
    methods: {
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
            
            // mark file changed (if not caleed from from file open process)
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
        setOutput(name) {
            this.output = new Output(name);
        },
        toClassName
    }
};

</script>