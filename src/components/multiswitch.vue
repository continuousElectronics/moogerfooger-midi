<template>
    <div class="switch-wrapper" ref="switchWrapper">
        <div
            v-for="(o, index) in state.options"
            v-html="o.html"
            :data-value="o.value"
            @click="switchClick(index, o.value)"
            class="switch"
            :key="index"
        ></div>
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
            selColor:   "rgb(220, 227, 237)",
            selBkgnd:   "rgb(89, 109, 140)",
            deSelColor: "rgb(70, 74, 76)",
            deSelBkgnd: "rgb(220, 227, 237)",
            sw:         undefined
        };
    },
    mounted() {
        this.sw = this.$refs.switchWrapper;
        this.sw.style.color = this.sw.style.fill = this.deSelColor;
        this.sw.style.background = this.deSelBkgnd;
        this.highlight(this.defaultVal);
    },
    methods: {
        switchClick(index, value) {
            this.$emit("stateChange", value);
            this.highlight(value);
        },
        highlight(desiredValue) {
            if (desiredValue === null || desiredValue === undefined) {
                return;
            }
            if (this.state.options.length === 1) {
                setTimeout(() => this.selected(  this.sw.childNodes[0]),   0);
                setTimeout(() => this.deSelected(this.sw.childNodes[0]), 100);
                return;
            }
            for (let el of this.sw.childNodes.values()) {
                const currentValue = parseInt(el.getAttribute("data-value"));

                if (currentValue === desiredValue) {
                    this.selected(el);
                } else if (el.style.color === this.selColor) {
                    this.deSelected(el);
                }
            }
        },
        selected(el) {
            el.style.background = this.selBkgnd;
            el.style.fill = el.style.color = this.selColor;
        },
        deSelected(el) {
            el.style.background = this.deSelBkgnd;
            el.style.fill = el.style.color = this.deSelColor;
        }
    }
};

</script>

<style scoped>

.switch-wrapper {
    display: inline-flex;
    flex-wrap: wrap;
    max-width: 100%;
}
.switch {
    display: inline-flex;
    cursor: pointer;
    padding: 5px 5px;
    vertical-align: middle;
}
.switch:not(:last-child) {
    border-right: 1px solid rgb(108, 99, 99);
}

</style>
