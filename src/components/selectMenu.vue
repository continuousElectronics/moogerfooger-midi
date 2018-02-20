<template>
    <div class="v-select">
        <v-select
            ref="vs"
            v-model="selection"
            :options="state.options"
            label="html"
            :searchable="false"
        >
            <template slot-scope="option" slot="option">
                <span v-html="option.html"></span>
            </template>
            <template slot-scope="option" slot="selected-option" >
                <span v-html="option.html" @click="iconClick(option.value)"></span>
            </template>
        </v-select>
    </div>
</template>

<script>

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
            selection: this.initValue()
        };
    },
    watch: {
        selection(o) {
            const val = o ? o.value : null;
            this.sendMsg(val);
        }
    },
    mounted() {
        (this.$refs.vs || {}).deselect = () => {};
    },
    methods: {
        sendMsg(val) {
            this.$emit("stateChange", val);
        },
        iconClick(val) {
            this.sendMsg(val);
        },
        initValue() {
            if (!Number.isInteger(this.defaultVal)) {
                return null;
            }
            
            for (let o of this.state.options) {
                if (o.value === this.defaultVal) {
                    return o;
                }
            }
        }
    }
};

</script>
