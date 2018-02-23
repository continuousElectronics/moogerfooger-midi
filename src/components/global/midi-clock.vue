<template>
    <div class="device-global midi-clock">
        <div class="label-wrapper">
            <label>Midi Clock Tempo</label>
        </div>
        <input 
            ref="tempoInput" 
            type="number" 
            :min="minTempo" 
            :max="maxTempo" 
            step=".1" 
            v-model="tempo"
            @change="changeTempo"
        >
        <button @click="toggleClock" class="btn btn-reg" ref="clockButton">
            <span v-if="!clockState">start</span>
            <span v-else>stop</span>
            clock
        </button>
    </div>
</template>

<script>

import midiclock        from "midi-clock";
import { outlineBlink } from "../../js/utility.js";

const clock = midiclock();

export default {
    props: {
        output: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            tempo: 120,
            clockState: false,
            minTempo: 40,
            maxTempo: 350
        };
    },
    methods: {
        toggleClock() {
            if (!this.clockState) {
                clock.start();
                this.clockState = true;
            } else {
                clock.stop();
                this.clockState = false;
            }
        },
        changeTempo(e) {
            let val = parseFloat(e.target.value);
            if (val > this.maxTempo) {
                val = this.tempo = this.maxTempo;
            }
            if (val < this.minTempo) {
                val = this.tempo = this.minTempo;
            }
            clock.setTempo(val);
        }
    },
    mounted() {
        const 
            input   = this.$refs.tempoInput,
            button  = this.$refs.clockButton;

        clock.on("position", (position) => {
            if (this.output.send) {
                this.output.send("clock");
            }
            if (position % 24 === 0) {
                outlineBlink(input);
            }
        });

        button.style.width = button.offsetWidth;
    }
};

</script>
