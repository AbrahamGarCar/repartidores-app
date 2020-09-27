<template>
    <Page actionBarHidden="true">
        <GridLayout columns="*" rows="*" backgroundColor="#F3F3F3">
            <ScrollView col="0" row="0">
                <WrapLayout orientation="vertical" width="90%" paddingBottom="20">
                    
                    <GridLayout rows="*, 2*" colums="*">
                        <StackLayout row="0" col="0">
                            <Label :text="user.name" horizontalAlignment="center" marginTop="20" fontSize="25" fontWeight="bold" textWrap="true" />
                        </StackLayout>

                        <StackLayout row="1" col="0" v-if="reservation != null">
                            <StackLayout marginTop="20">
                                <Image src="" @loaded="generateQR($event)" horizontalAlignment="center" verticalAlignment="center"></Image>

                                <StackLayout v-if="reservation != null">
                                    <Label :text="reservation.dateOne | formatDate" fontWeight="bold" horizontalAlignment="center" marginTop="10" />
                                </StackLayout>
                            </StackLayout>

                            <StackLayout marginTop="20" v-if="reservation != null">
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

                                <GridLayout rows="*" columns="*, *" marginTop="30">
                                    <FlexboxLayout row="0" col="0" justifyContent="center" alignItems="center" flexDirection="column">
                                        <Label text="(614) 555-66-77" textWrap="true" />
                                        
                                    </FlexboxLayout>

                                    <FlexboxLayout row="0" col="1" justifyContent="center" alignItems="center" flexDirection="column">
                                        <Label text="majalca@example.com" textWrap="true" />
                                        
                                    </FlexboxLayout>
                                </GridLayout>

                                <StackLayout marginTop="20">
                                    <Button width="100%" backgroundColor="black" color="white" text="Finalizar" @tap="finishReservation" />
                                </StackLayout>

                                <StackLayout marginTop="30">
                                    <Label fontSize="12" text="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam quam ullam a facere, iure possimus doloremque voluptas cumque vel nam laudantium non, officiis maiores voluptate sunt itaque dolorem sint reprehenderit!" textWrap="true" />
                                    
                                </StackLayout>
                            </StackLayout>
                        </StackLayout>

                        <FlexboxLayout row="1" col="0" v-else justifyContent="center" alignItems="center" flexDirection="column">
                            <Label fontSize="22" text="Parece que no tienen ninguna reservacion en este momento." textWrap="true" />

                            <StackLayout marginTop="40">
                                <Button width="100%" backgroundColor="black" color="white" text="Regresar al inicio" @tap="finishReservation" />
                            </StackLayout>
                        </FlexboxLayout>
                    </GridLayout>
                    
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

//QR
import { ImageSource } from "tns-core-modules/image-source";
import { Image } from "tns-core-modules/ui/image";
import { QrGenerator } from "nativescript-qr-generator";

//Moment
const moment = require('moment')

export default {
    name: 'QRPage',

    data(){
        return{
            date: 'uno',
            reservationID: null,
            ubication: null,
            reservation: null,
            imageQR: null,
        }
    },

    filters: {
        formatDate(date){
            moment.locale('es')
            
            return moment(date).format('LL')
        }
    },

    mounted(){
        this.getReservation()
    },

    computed: {
        ...mapState([
            'user'
        ])
    },

    methods: {
        async getReservation(){
            console.log('olis')
            try {
                let response = await firebase.firestore.collection('reservations')
                                                        .where('user', '==', this.user.uid)
                                                        .where('process', '==', 'PENDIENTE')
                                                        .where('payment', '==', true)
                                                        .orderBy('dateOne')
                                                        .limit(1)
                                                        .get()
                                                        .then(query => {
                                                            query.forEach(async doc => {
                                                                this.reservationID = doc.id

                                                                let data = await firebase.firestore.collection('reservations')
                                                                                        .doc(doc.id)
                                                                                        .get()

                                                                let data2 = await firebase.firestore.collection('ubications')
                                                                                        .doc(data.data().ubication)
                                                                                        .get()

                                                                this.reservation = data.data()
                                                                this.ubication = data2.data()
                                                                console.log(this.reservation)
                                                                this.date = this.reservation.dateOne
                                                                
                                                            })
                                                        })

            let result = new QrGenerator().generate(this.reservationID);

            this.printQR(result)
            } catch (e) {
                console.log(e)
            }
        },

        generateQR(args){
            this.imageQR = args.object;
        },

        printQR(args){
            this.imageQR.imageSource = new ImageSource(args);
        },

        finishReservation(){
            this.$navigator.navigate('/home')
        },

    }
}
</script>

<style>

</style>