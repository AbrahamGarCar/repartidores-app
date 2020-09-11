<template>
    <Page actionBarHidden="true">
        <Label text="OLIS" textWrap="true" />
        
    </Page>
</template>

<script>
//Firebase
const firebase = require("nativescript-plugin-firebase")

//Vuex
import { mapState } from 'vuex'

//Vuelidate
import { required, maxLength } from 'vuelidate/lib/validators'

//Toast
import * as Toast from 'nativescript-toast'

export default {
    name: 'QRPage',

    data(){
        return{

        }
    },

    computed: {
        ...mapState([
            'user'
        ])
    },

    methods: {
        
    }
}
</script>

<style>

</style>