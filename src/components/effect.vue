<template>
    <div :class="'effect ' + toClassName(effect.name)">
        <div class="effect-inner">
            <button
                @click="destroy"
                class="destroy"
            >&times;</button>
            <div class="effect-states">
                <div class="channel">
                    <label>MIDI Channel</label>
                    <v-select
                        ref="vs"
                        :value="effect.channel"
                        :options="Array(16).fill().map((_, i) => (i + 1).toString())"
                        :searchable="false"
                        @input="effect.channel = parseInt($event)"
                    >
                    </v-select>
                </div>
                <div class="effect-name text-center">
                    {{ effect.name }}
                </div>
                <div
                    v-for="(state, index) in effect.states"
                    :class="
                        'effect-state form-control ' +
                        toClassName(state.name) + ' ' +
                        toClassName(state.component)
                    "
                    :key="'s' + index"
                    :ref="'s' + index"
                >
                    <label>{{ state.name }}</label>
                    <component
                        :is="state.component"
                        :state="state"
                        :defaultVal="effect.current[state.name]"
                        @stateChange="effect.sendMessage(state.name, $event, $refs['s' + index][0])"
                    ></component>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { toClassName } from "../js/utility.js";
import continuous      from "./continuous.vue";
import multiswitch     from "./multiswitch.vue";
import selectMenu      from "./selectMenu.vue";

export default {
    components: { continuous, multiswitch, selectMenu },
    props: {
        effect: {
            type: Object,
            required: true
        }
    },
    mounted() {
        (this.$refs.vs || {}).deselect = () => {};
    },
    methods: { 
        destroy() {
            const 
                efxArr = this.effect.vm.effects,
                index = efxArr.indexOf(this.effect);
            
            efxArr.splice(index, 1);
            this.$destroy();
            this.$el.remove();
        },
        toClassName
    }
};

</script>
