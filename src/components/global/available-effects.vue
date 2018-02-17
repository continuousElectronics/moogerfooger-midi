<template>
    <div class="device-global available-effects">
        <div class="label-wrapper">
            <label>Available Effects</label>
        </div>
        <select :size=names.length v-model="value">
            <option
                v-for="(name, index) in names" 
                :value="name"
                :key="index"
            >
                {{ name }}
            </option>
        </select>
        <button 
            class="btn btn-reg ef-btn"
            @click="$emit('effectEvent', value)"
        >
            create effect
        </button>
    </div>
</template>

<script>

import { effectsMap } from "../../js/effect.js";

const effectNames = Array.from(effectsMap.keys());

export default {
    data() {
        return {
            names: effectNames,
            value: effectNames[0]
        };
    }
};

</script>
