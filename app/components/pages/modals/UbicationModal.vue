<template>
    <StackLayout width="300" height="450">
        <GridLayout v-if="ubication != null" columns="*" rows="100, *, 20">
            <FlexboxLayout justifyContent="center" alignItems="center" row="0" col="0">
                <Image :src="ubication.image" stretch="aspectFill" />
            </FlexboxLayout>

            <StackLayout row="1" col="0">
                <Label fontSize="20" fontWeight="bold" color="black" :text="ubication.name" textWrap="true" />
                <Label fontSize="17" color="black" :text="ubication.description" textWrap="true" />
                
                <Label v-if="!ubication.status" fontSize="17" fontWeight="bold" color="black" text="Disponible" textWrap="true" />
                <Label v-else fontSize="17" fontWeight="bold" color="black" text="No disponible" textWrap="true" />
                
            </StackLayout>

            <StackLayout row="2" col="0">
                <Button text="Reservar" @tap="closeModal" />
            </StackLayout>
        </GridLayout>
    </StackLayout>
</template>

<script>
//Firebase
const firebase = require("nativescript-plugin-firebase")
//Vuex
import { mapState } from 'vuex'

export default {
    props: [
		'id'
    ],
    
	data () {
	    return {
	    	ubication: null,

	    }
    },
    
	mounted(){
		this.getUbication()
    },
    
    methods: {
        async getUbication(){
            try{
				let response = await firebase.firestore.collection('ubications')
														.doc(this.id)
														.get()
				if(response.exists){
					this.ubication = response.data()
				}
			}
			catch(e){
				console.log(e)
			}
        },

        closeModal(){
        	this.$modal.close(ubication.id)
        },
    }
}
</script>

<style>

</style>