<style scoped>
    .box-1{
        background-image: url('~/assets/images/bg-1.png');
        background-position: center top;
        background-size: cover;
        background-repeat: no-repeat;
    }

    .bg-color{
        background-color: rgba(128, 145, 107, 0.7);
    }
</style>

<template>
    <Page actionBarHidden="true">
        <GridLayout class="box-1" columns="*" rows="*" backgroundColor="#F3F3F3">
            <ScrollView col="0" row="0">
                <WrapLayout orientation="vertical" width="90%" paddingBottom="20">
                    <FlexboxLayout justifyContent="center" alignItems="center" flexDirection="column">
                        <Label fontSize="22" :text="`Bienvenido ${user.name}`" textWrap="true" />
                        <Button text="" class="font-awesome" backgroundColor="#3883FB" marginTop="20" color="white" @tap="camera = !camera" width="100%" />
                    </FlexboxLayout>

                    <FlexboxLayout justifyContent="center" alignItems="center" flexDirection="column">
                        <MLKitBarcodeScanner
                                v-if="camera"
                                width="100%"
                                height="380"
                                beepOnScan="true"
                                formats="QR_CODE, EAN_8, EAN_13"
                                preferFrontCamera="false"
                                supportInverseBarcodes="false"
                                @scanResult="getQRResult($event)">
                            </MLKitBarcodeScanner>
                    </FlexboxLayout>

                    <StackLayout marginTop="20" v-if="reservation != null">
                        <FlexboxLayout justifyContent="center" alignItems="center" flexDirection="column">
                            <Label fontSize="22" text="Informacion de la reservacion" textWrap="true" />
                            <Label marginTop="20" :text="`Usuario: ${userReservation.name}`" textWrap="true" />
                        </FlexboxLayout>

                        <GridLayout rows="*" columns="*, *, *, *">
                            <FlexboxLayout v-if="ubication != null" row="0" col="0" justifyContent="center" alignItems="center" flexDirection="column">
                                <Label text="AREA" textWrap="true" />
                                <Label :text="ubication.name" textWrap="true" />
                                
                            </FlexboxLayout>

                            <FlexboxLayout row="0" col="1" justifyContent="center" alignItems="center" flexDirection="column">
                                <Label text="PERSONAS" textWrap="true" />
                                <Label :text="reservation.persons.length" textWrap="true" />
                                
                            </FlexboxLayout>

                            <FlexboxLayout row="0" col="2" justifyContent="center" alignItems="center" flexDirection="column">
                                <Label text="VEHICULO" textWrap="true" />
                                <Label :text="reservation.cars.length" textWrap="true" />
                                
                            </FlexboxLayout>

                            <FlexboxLayout row="0" col="3" justifyContent="center" alignItems="center" flexDirection="column">
                                <Label text="ACTIVIDAD" textWrap="true" />
                                <Label :text="`Acampar`" textWrap="true" />
                                
                            </FlexboxLayout>
                        </GridLayout>
                    </StackLayout>

                    <FlexboxLayout marginTop="20" padding="10" justifyContent="flex-end" alignItems="center" width="100%">
                        <Button color="white" borderWidth="1" borderColor="black" width="200" height="50" class="font-awesome bg-color" text=" Cerrar sesion" @tap="singOut" />
        
                    </FlexboxLayout>
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

//Vuelidate
import { required, maxLength } from 'vuelidate/lib/validators'

//Toast
import * as Toast from 'nativescript-toast'

//Moment
const moment = require('moment')

//Camera firebase
import { BarcodeFormat, MLKitScanBarcodesOnDeviceResult } from "nativescript-plugin-firebase/mlkit/barcodescanning";

//iOS or Android
import { isAndroid, isIOS } from "tns-core-modules/ui/page";

//Access permissions
import * as permissions from 'nativescript-permissions'
import * as platform from 'platform'

export default {
    name: 'Scaner',

    data(){
        return{
            camera: false,
            id: '',
            reservation: null,
            ubication: null,
            userReservation: null
        }
    },

    mounted(){
        if (isAndroid) {
            /* list of permissions needed */
            let permissionsNeeded = [
                android.Manifest.permission.CAMERA,
            ]
        }
    },

    filters: {
        formatDate(date){
            moment.locale('es')
            
            return moment(date).format('LL')
        }
    },

    computed: {
        ...mapState([
            'user'
        ])
    },

    methods: {
        //Lector QR
        getQRResult(args){
            if(args.value.barcodes[0] != undefined){
                console.log(args.value.barcodes[0].value)
                this.id = args.value.barcodes[0].value
                this.camera = false

                this.getReservation()
            }

        },

        async getReservation(){
            try {
                let data = await firebase.firestore.collection('reservations')
                                                    .doc(this.id)
                                                    .get()

                let data2 = await firebase.firestore.collection('ubications')
                                        .doc(data.data().ubication)
                                        .get()
                
                let data3 = await firebase.firestore.collection('users')
                                        .doc(data.data().user)
                                        .get()

                this.reservation = data.data()
                this.ubication = data2.data()
                this.userReservation = data3.data()
                console.log(this.reservation)


                this.updateReservation()
            } catch (e) {
                console.log(e)
            }
        },

        async updateReservation(){
            try {
                let response = await firebase.firestore.collection('reservations')
                                                        .doc(this.id)
                                                        .update({ process: 'EN CURSO' })
            } catch (error) {
                console.log(error)
            }
        },

        singOut(){
            firebase.logout()
            this.$navigator.navigate('/login', { clearHistory: true })
        }
    }
}
</script>