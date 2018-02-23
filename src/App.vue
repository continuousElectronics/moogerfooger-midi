<template>
    <div id="app">
        <div class="global-wrapper">
            <avail-effects @effectEvent="createEffect($event)"></avail-effects>
            <midi-dest @destEvent="setOutput($event)" :outputs="outputs"></midi-dest>
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
import { toClassName, markIfFileChanged } from "./js/utility.js";
import effect       from "./components/effect.vue";
import availEffects from "./components/global/available-effects.vue";
import midiDest     from "./components/global/midi-destination.vue";
import midiClock    from "./components/global/midi-clock.vue";
import globalSend   from "./components/global/global-send.vue";

const
    { remote } = require("electron"),
    effectMax = 16;

export default {
    name: "app",
    props: {
        WebMidi: {
            type: Object,
            required: true
        },
        easymidi: {
            type: Object,
            required: true
        }
    },
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
            filepath: undefined,
            fileChanged: false
        };
    },
    beforeMount() {
        const Output = this.easymidi.Output;
        this.outputs = this.WebMidi.outputs;
        this.output = new Output(this.outputs[0].name) || {};
        setupMenuListeners(this);
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
            
            // if there is a file open and it hasn't been changed,
            // creating effect (not from file open process) marks file changed
            markIfFileChanged(this, fileopen);

            // construct new effect object
            const newEffect = effectConstruct(effectName);
            
            // attach channel, current settings object, and vue instance
            newEffect.channel = (channel) ? channel : len + 1;
            newEffect.current = (current) ? current : setCurrent(effectName);
            newEffect.vm      = this;
            
            // push effect object into effects array to keep track of it
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
            for (let effect of this.effects) {
                effect.sendAllMessages();
            }
        },
        setOutput(name) {
            const Output = this.easymidi.Output;
            this.output = new Output(name) || {};
        },
        toClassName
    }
};

</script>