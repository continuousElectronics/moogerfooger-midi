import Vue     from "vue";
import App     from "./App.vue";
import vSelect from "vue-select";
import "./css/bootstrap.min.css";
import "./sass/style.scss";

Vue.component("v-select", vSelect);

new Vue({
    el: "#app",
    render: h => h(App)
});