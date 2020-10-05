<template>
    <Page actionBarHidden="true">
        <GridLayout class="box-1" rows="60, *, *, 80" columns="*">
            <FlexboxLayout row="0" col="0" justifyContent="center" alignItems="center">
                <Label color="black" fontSize="22" text="Reservaciones" textWrap="true" />
                
            </FlexboxLayout>
            <StackLayout row="1" col="0">
                <FlexboxLayout justifyContent="center" alignItems="center">
                    <Label text="Fecha y hora de ingreso" textWrap="true" />
                </FlexboxLayout>
                <!-- <DatePicker v-model="reservation.dateOne" :minDate="minDate" /> -->
                <DateTimePickerFields @dateChange="onDateTimeChange1" :minDate="minDate"
                        hintDate="Fecha" hintTime="Hora"></DateTimePickerFields>
            </StackLayout>
            <StackLayout row="2" col="0">
                <FlexboxLayout justifyContent="center" alignItems="center">
                    <Label text="Fecha y hora de salida" textWrap="true" />
                </FlexboxLayout>
                <!-- <DatePicker v-model="reservation.dateTwo" :minDate="minDate" /> -->
                <DateTimePickerFields @dateChange="onDateTimeChange2" :minDate="minDate"
                        hintDate="Fecha" hintTime="Hora"></DateTimePickerFields>
            </StackLayout>
            
            <StackLayout row="3" col="0">
                <FlexboxLayout justifyContent="center" alignItems="center">
                    <Label color="white" text="Paso 1 de 4" textWrap="true" />
                </FlexboxLayout>
                <Button color="black" text="Hacer reservacion" @tap="makeReservation" />
            </StackLayout>
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

export default {
    name: 'Reservation',

    data(){
        return{
            reservation: {
                dateOne: '',
                dateTwo: '',
                step: 1,
                status: true,
            }
        }
    },

    computed: {
        ...mapState([
            'user'
        ]),

        minDate(){
            return new Date();
        }
    },

    validations: {
        reservation: {
            dateOne: {
                required,
            },

            dateTwo: {
                required
            }
        }
    },

    methods: {
        async makeReservation(){
            if(!this.$v.reservation.dateOne.required){
                Toast.makeText("Selecciona una fecha de entrada.", "long").show()
                return
            }

            if(!this.$v.reservation.dateTwo.required){
                Toast.makeText("Selecciona una fecha de salida.", "long").show()
                return
            }

            try {
                let reservation         = this.reservation
                    reservation.date    = new Date()
                    reservation.user    = this.user.uid

                let response = await firebase.firestore.collection('reservations').add(reservation)

                this.goToUbications()
            } catch (error) {
                console.log(error)
            }
        },

        onDateTimeChange1(args){
            console.log(args.value)
            this.reservation.dateOne = args.value
        },

        onDateTimeChange2(args){
            console.log(args.value)
            this.reservation.dateTwo = args.value
        },

        goToUbications(){
            this.$navigator.navigate('/ubications', { clearHistory: true }) 
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