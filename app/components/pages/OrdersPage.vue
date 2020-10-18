<template>
    <Page actionBarHidden="false">
        <ActionBar title="Ordenes pendientes" icon="">
            <NavigationButton text="Back" icon="" tap="" />
        </ActionBar>
        <GridLayout rows="*" columns="*">
            <ScrollView row="0" col="0" backgroundColor="white">
                <WrapLayout orientation="vertical" width="90%" paddingBottom="20">
                    <StackLayout>
                        <Label text="Ordenes pendientes" horizontalAlignment="center" fontSize="25" textWrap="true" />
                        
                    </StackLayout>
                    <StackLayout width="100%" backgroundColor="red" borderRadius="10" padding="10">
                        <Label fontSize="22" text="La Bongleria" textWrap="true" />
                        <StackLayout>
                            
                        </StackLayout>
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
    name: 'Oders',

    data(){
        return{

        }
    },

    computed: {
        ...mapState([
                'user'
            ]),
    },

    methods: {
        
    },
}
</script>

<style>

</style>