import Vue     from "vue";
import App     from "./App.vue";
import vSelect from "vue-select";
import WebMidi from "webmidi";
import "./css/bootstrap.min.css";
import "./sass/style.scss";

Vue.component("v-select", vSelect);

WebMidi.enable(err => {
    if (err) {
        throw err;
    }

    new Vue({
        el: "#app",
        render: h => h(App, {
            props: { WebMidi }
        })
    });
    
});