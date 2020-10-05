<style>
    .bg-color{
        background-color: rgba(128, 145, 107, 0.7);
    }
</style>

<template>
    <Page actionBarHidden="true">
        <GridLayout rows="*, *" columns="*">
            <StackLayout row="0" col="0">
                <StackLayout>
                    <MapView
                    borderRadius="10"
                    width="100%"
                    height="590"
                    :zoom="zoom"
                    :latitude="origin.latitude"
                    :longitude="origin.longitude"
                    v-if="allowExecution"
                    @mapReady="mapReady"
                    @markerSelect="getUbication($event)"
                    />
                </StackLayout>
            </StackLayout>
            <StackLayout row="1" col="0">
                <ScrollView col="0" row="0">
                    <WrapLayout orientation="vertical" width="100%" paddingBottom="20">
                        <StackLayout v-if="ubication != null" padding="10">
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
                                <FlexboxLayout marginTop="5" justifyContent="center" alignItems="center">
                                    <Label color="black" text="Paso 2 de 4" textWrap="true" />
                                </FlexboxLayout>
                                <Button class="bg-color" color="white" text="Regresar al inicio" @tap="goToHome" />
                                <Button class="bg-color" color="white" v-if="!ubication.status" text="Reservar" @tap="reservation" />
                            </StackLayout>
                        </StackLayout>

                        <FlexboxLayout justifyContent="center" alignItems="center" v-else>
                        <Label text="Para comenzar selecciona una área" textAlignment="center" fontSize="22" fontWeight="bold" textWrap="true" />
                        
                        </FlexboxLayout>
                    </WrapLayout>
                </ScrollView>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
//Firebase
const firebase = require("nativescript-plugin-firebase")

//Vuex
import { mapState } from 'vuex'

//MAP 
import { MapView, Marker, Position } from "nativescript-google-maps-sdk";
import UbicationModalVue from './modals/UbicationModal.vue';

export default {
    name: 'Ubications',

	data(){
		return{
            origin: { 
                latitude: 28.7186667, 
                longitude: -106.145014 
            },
            destination: { 
                latitude: 28.7281124, 
                longitude: -106.1194358
            },
            allowExecution: true,
            mapView: null,
            zoom: 17,
            ubications: [],
            marker: null,
            ubication: null,
		}
    },

    computed: {
        ...mapState([
            'user'
        ])
    },
    
    methods: {
        mapReady(args) {
            /* get the mapView instance */
            this.mapView = args.object;
            this.mapView.settings.scrollGesturesEnabled = true
            this.mapView.settings.zoomGesturesEnabled = true
            
            this.getUbications();
        },

        async getUbications(){
            try {
                let response = await firebase.firestore.collection('ubications')
                                        .onSnapshot(query => {       
                                            query.forEach(doc => {
                                                this.ubications.push(doc.data())
                                            })
                                        this.putUbications()
                                        })
            } catch (e) {
                console.log(e)
            }
                
        },

        putUbications(){            
            this.ubications.forEach((result) => {
                let status = 'No disponible'
                
                if(result.status){
                    status = 'No disponible'
                }else{
                    status = 'Disponible'
                }

                let marker = new Marker()
                marker.position = Position.positionFromLatLng(result.ubication.latitude, result.ubication.longitude)
                marker.title = result.name
                marker.snippet = status
                marker.id = result.id
                marker.userData = {index: 1}
                this.mapView.addMarker(marker)
            })
        },

        getUbication(args){
            console.log(args.marker.id)
            
            if (!args.marker.status) {
                this.ubication = this.ubications.find(element => element.id == args.marker.id)
            }
            
            
            // this.$showModal(UbicationModalVue, {
            //     props:{
            //         id: args.marker.id,
            //     }
            // })
        },

        async reservation(){
            try {
                let response = await firebase.firestore.collection('reservations')
                                                        .where('user', '==', this.user.uid)
                                                        .where('status', '==', true)
                                                        .get()
                                                        .then(query => {
                                                            query.forEach(async doc => {
                                                                await firebase.firestore.collection('reservations')
                                                                                        .doc(doc.id)
                                                                                        .update({ ubication: this.ubication.id, step: 2 })
                                                            })
                                                        })

                this.goToInformation()
            } catch (e) {
                console.log(e)
            }
        },

        goToInformation(){
            this.$navigator.navigate('/information-payment')
        },

        goToHome(){
            this.$navigator.navigate('/home', { clearHistory: true })
        }
    }
}
</script>
