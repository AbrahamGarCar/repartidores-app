<template>
    <Page actionBarHidden="false">
        <ActionBar icon="" backgroundColor="#283D23" padding="0" margin="0">
            <!-- <GridLayout rows="20" columns="*, *" padding="0" margin="0">
                <FlexboxLayout padding="0" margin="0" row="0" col="0" justifyContent="flex-start" alignItems="center">
                    <Image src="~/assets/images/logo.png" width="50" height="50" stretch="aspectFit" verticalAlignment="center" horizontalAlignment="center" />
                </FlexboxLayout>
                <FlexboxLayout justifyContent="flex-end" alignItems="center">
                  
                </FlexboxLayout>
            </GridLayout> -->
            <FlexboxLayout width="100%">
                <FlexboxLayout width="50%" justifyContent="flex-start" alignItems="center">
                    <Image src="~/assets/images/logo.png" width="40" stretch="aspectFit" verticalAlignment="center" horizontalAlignment="center" />
                </FlexboxLayout>
                <StackLayout width="50%">
                    <Label :text="`Fecha de compra: ${formatDateComputed}`" fontSize="11" textWrap="true" />
                    <Label :text="`Total: $${'150'}`" fontSize="11" textWrap="true" />
                    
                </StackLayout>
            </FlexboxLayout>
        </ActionBar>
        <GridLayout backgroundColor="white" columns="*" rows="*">
            <ScrollView col="0" row="0">
                <WrapLayout orientation="vertical" width="90%" paddingBottom="20">
                    
                    <GridLayout rows="*, 2*" colums="*">
                        <StackLayout row="0" col="0">
                            <Label :text="user.name" horizontalAlignment="center" marginTop="20" fontSize="25" fontWeight="bold" textWrap="true" />
                        </StackLayout>

                        <StackLayout row="1" col="0">
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
                                    <Button width="100%" class="bg-color" color="white" text="Finalizar" @tap="finishReservation" />
                                </StackLayout>

                                <StackLayout marginTop="30">
                                    <Label fontSize="12" text="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam quam ullam a facere, iure possimus doloremque voluptas cumque vel nam laudantium non, officiis maiores voluptate sunt itaque dolorem sint reprehenderit!" textWrap="true" />
                                    
                                </StackLayout>
                            </StackLayout>
                        </StackLayout>
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

    props: ['id'],

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
        ]),

        formatDateComputed(){
            if (this.reservation != null) {
                return moment(this.reservation.dateOne).format('l');
            }else{
                return ''
            }
            
        }
    },

    methods: {
        async getReservation(){
            console.log('olis')
            try {
                let data = await firebase.firestore.collection('reservations')
                                                    .doc(this.id)
                                                    .get()

                let data2 = await firebase.firestore.collection('ubications')
                                        .doc(data.data().ubication)
                                        .get()

                this.reservation = data.data()
                this.ubication = data2.data()
                console.log(this.reservation)
                this.date = this.reservation.dateOne

                let result = new QrGenerator().generate(this.id);

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
        }
    }
}
</script>

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