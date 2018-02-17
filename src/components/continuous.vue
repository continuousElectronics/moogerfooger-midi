<template>
    <div class="continuous-wrapper">
        <input
            type="range"
            v-model.number="value"
            :min="min"
            :max="max"
            :step="step"
            @input="continuousInput"
        >
        <div @click="clickFunction"><span title="resend" class="sanitized">{{ sanitized }}%</span></div>
    </div>
</template>

<script>

import { chg14bitToTwo7bit, chgTwo7bitTo14bit } from "../js/utility";

export default {
    props: {
        state: {
            type: Object,
            required: true
        },
        defaultVal: {}
    },
    data() {
        return {
            value:     0,
            min:       0,
            max:       undefined,
            step:      1,
        };
    },
    beforeMount() {
        if (Array.isArray(this.state.controller)) {
            this.max   = 16383;
            this.value = chgTwo7bitTo14bit(this.defaultVal || [0, 0]);
        } else {
            this.max   = 127;
            this.value = this.defaultVal || 0;
        }
    },
    methods: {
        continuousInput() {
            let value = this.value;

            if (this.max === 16383) {
                value = chg14bitToTwo7bit(value);
            }

            this.$emit("stateChange", value);
        },
        clickFunction() {
            this.continuousInput();
        }
    },
    computed: {
        sanitized() {
            return (this.value * 100 / this.max).toFixed(5).substr(0, 6);
        },
    }
};

</script>

<style scoped>

.continuous-wrapper > * {
    display: block;
    margin: 3px 0;
}
.continuous-wrapper input {
    width: 100%;
}
.sanitized {
    cursor: pointer;
}

</style>
