<template>
    <div class="effect-states">
        <div class="channel">
            <label>MIDI Channel</label>
            <v-select
                ref="vSelect"
                v-model="channel"
                :options="
                    Array(16).fill().map((x, i) => {
                        return { 
                            label: (i + 1).toString(),
                            value:  i + 1
                        };
                    })
                "
                :searchable="false"
            >
            </v-select>
        </div>
        <div class="effect-name text-center">
            {{ effect.name }}
        </div>
        <div 
            v-for="(state, key) in states" 
            :class="
                'effect-state form-control ' + 
                toClassName(stateNames[key]) + ' ' +
                toClassName(state.component)
            "
            :key="key"
            :ref="'s' + key"
        >
            <label v-if="!state.noNameRender">
                {{ stateNames[key] }}
            </label>
            <component
                :is="state.component"
                :state="state"
                :defaultVal="effect.current[stateNames[key]]"
                @stateChange="effect.sendMessage(stateNames[key], $event, output, $refs['s' + key][0])"
            ></component>
        </div>
    </div>
</template>

<script>

import { rangeValidate, toClassName } from "../js/utility.js";
import continuous     from "./continuous.vue";
import multiswitch    from "./multiswitch.vue";
import selectMenu     from "./selectMenu.vue";

export default {
    components: { continuous, multiswitch, selectMenu },
    props: {
        effect: {
            type: Object,
            required: true
        },
        output: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            stateNames: Array.from(
                this.effect.stateMap.keys()
            ),
            states: Array.from(
                this.effect.stateMap.values()
            ),
            channel: this.effect.channel
        };
    },
    mounted() {
        if (this.$refs.vSelect) {
            this.$refs.vSelect.deselect = () => {};
        }
    },
    watch: {
        channel(o) {
            const val = o ? o.value : null;
            this.effect.channel = val;
        }
    },
    methods: {
        toClassName
    }
};

</script>
