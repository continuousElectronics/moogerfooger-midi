<template>
    <div class="device-global midi-destination">
        <div class="label-wrapper">
            <label>Midi Device</label>
        </div>
        <select
            v-model="value"
            :size="outputs.length > menuSize ? 0 : menuSize"
            @change="$emit('destEvent', value)">
            <option 
                v-for="(output, index) in outputs" 
                :value="output"
                :key="index">
                {{ output.name }}
            </option>
        </select>
    </div>
</template>

<script>

export default {
    props: {
        outputs: {
            type: Array,
            required: true
        },
        init: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            menuSize: 5,
            value: this.init
        };
    }
};

</script>
