<template>
    <StackLayout width="300" height="300">
        <Label horizontalAlignment="center" text="Iniciando sesión" fontSize="24" textWrap="true" />
        <ActivityIndicator horizontalAlignment="center" marginTop="20" busy="true" />
    </StackLayout>
</template>

<script>
//Firebase
const firebase = require("nativescript-plugin-firebase")

//Vuex
import { mapState } from "vuex";

export default {
    name: 'ModalLogin',

    data(){
        return{
            
        }
    },

    computed: {
        ...mapState([
            'user',
        ])
    },

    watch: {
        user(){
            this.$modal.close()
        }
    },

    methods: {

    }
}
</script>

<style>

</style>