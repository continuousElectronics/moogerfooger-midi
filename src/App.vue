<template>
    <div id="app">

        <div class="global-wrapper">
            <avail-effects @effectEvent="createEffect($event)"></avail-effects>
            <midi-dest :outputs="outputs" @destEvent="output = outputs[$event]"></midi-dest>
            <midi-clock :output="output"></midi-clock>
            <global-send @globalSendEvent="globalSend"></global-send>
        </div>
        <div class="effects-wrapper">
            <div
                v-for="effect in effects"
                :key="effect.id"
                :ref="'ef' + effect.id"
                :class="'effect ' + toClassName(effect.name)"
            >
                <div class="effect-inner">
                    <button
                        @click="destroyEffect(effect)" 
                        class="destroy"
                    >&times;</button>
                    <effect
                        :effect="effect"
                        :output="output"
                    ></effect>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { effectConstruct }         from "./js/effect.js";
import { indexRange, toClassName, outlineBlink } from "./js/utility.js";
import effect       from "./components/effect.vue";
import availEffects from "./components/global/available-effects.vue";
import midiDest     from "./components/global/midi-destination.vue";
import midiClock    from "./components/global/midi-clock.vue";
import globalSend   from "./components/global/global-send.vue";

const
    indexSet = new Set(),
    effectMax = 16;

export default {
    name: "app",
    props: {
        WebMidi: {
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
            output: {},
            effects: [],
            testVal: 1
        };
    },
    beforeMount() {
        this.outputs = this.WebMidi.outputs;
        this.output  = this.outputs[0] || {};
    },
    mounted() {
        // to open saved files loop through array here and call this.createEffect on each
        // inputting name, current and channel

        // this.createEffect("MF-104M Analog Delay", undefined, 1);
        this.createEffect("MF-108M Cluster Flux", { "Bypass": 0, "Range": 0 }, 3);
        this.createEffect("MF-108M Cluster Flux", { "Bypass": 0, "Range": 0 }, 4);
        this.createEffect("MF-108M Cluster Flux", { "Bypass": 0, "Range": 0 }, 5);
        this.createEffect("MF-108M Cluster Flux", { "Bypass": 64, "Range": 127 }, 12);
        // this.createEffect("MF-105M Midi Murf",    undefined, 4);
    },
    methods: {
        createEffect(key, current, channel) {
            if (this.effects.length >= effectMax) {
                alert("you cannot create more than " + effectMax + " effects");
                return;
            }

            let effect, id = this.getAvailableId();

            effect = effectConstruct(key, id);
            if (current) {
                effect.current = current;
            }
            if (channel) {
                effect.channel = channel;
            } else {
                effect.channel = id + 1;
            }
            this.effects.push(effect);
        },
        destroyEffect(effect) {
            indexSet.delete(effect.id);
            this.effects.splice(
                this.effects.indexOf(effect), 1
            );
        },
        getAvailableId() {
            let id = 0;

            for (let setVal of indexRange(effectMax)) {
                if (!indexSet.has(setVal)) {
                    indexSet.add(id);
                    return id;
                }
                id += 1;
            }
        },
        globalSend() {
            for (let effect of this.effects) {
                effect.sendAllMessages(this.output);
                outlineBlink(this.$refs["ef" + effect.id][0]);
            }
        },
        toClassName
    }
};

</script>