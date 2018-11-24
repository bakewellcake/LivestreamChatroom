<template>
    <div>
        <v-snackbar :top="true" :color="snackbar.color" v-model="snackbar.visible">{{ snackbar.text }}</v-snackbar>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        computed: {            
            snackbar: function () {
                return this.$root.snackbar
            }
        }
    }
</script>