<template>
    <div class="device-global global-send-all">
        <div class="label-wrapper">
            <label>Global Send</label>
        </div>
        <button @click="$emit('globalSendEvent')" class="btn btn-reg">
            send all settings
        </button>
    </div>
</template>