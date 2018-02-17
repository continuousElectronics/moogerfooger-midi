import Vue     from "vue";
import App     from "./App.vue";
import WebMidi from "webmidi";
import vSelect from "vue-select";
import "./css/bootstrap.min.css";
import "./sass/style.scss";

Vue.component("v-select", vSelect);

WebMidi.enable(err => {

    if (err) {
        const msg = "Web Midi is not loading";
        throw new Error(msg);
    }
    
    const o = {
        props: { WebMidi }
    };

    new Vue({
        el: "#app",
        render: h => h(App, o)
    });
    
});