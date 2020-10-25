<template>
    <Page actionBarHidden="true" navigatedTo="onNavigatedTo">
        <GridLayout rows="*" columns="*">
            <ScrollView row="1" col="0" backgroundColor="white">
                <WrapLayout orientation="vertical" width="90%" paddingBottom="20">
                    <StackLayout>
                        <Label text="Este es el perfil" textWrap="true" />
                        <Button text="Salir" backgroundColor="red" @tap="logOut" />
                        
                    </StackLayout>
                </WrapLayout>
            </ScrollView>
        </GridLayout>
    </Page>
</template>

<script>
    //Firebase
const firebase = require("nativescript-plugin-firebase")

//Vuex
import { mapState } from 'vuex'

export default {
    name: 'Logout',

    data(){
        return{

        }
    },

    methods: {
        logOut(){
            firebase.logout()
            this.$navigator.navigate('/login', { clearHistory: true })
        }
    },
}
</script>

<style>

</style>