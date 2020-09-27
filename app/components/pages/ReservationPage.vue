<template>
    <Page actionBarHidden="true">
        <GridLayout class="box-1" rows="60, *, *, 80" columns="*">
            <FlexboxLayout row="0" col="0" justifyContent="center" alignItems="center">
                <Label color="black" fontSize="22" text="Reservaciones" textWrap="true" />
                
            </FlexboxLayout>
            <StackLayout row="1" col="0">
                <FlexboxLayout justifyContent="center" alignItems="center">
                    <Label text="Fecha numero 1" textWrap="true" />
                </FlexboxLayout>
                <DatePicker v-model="reservation.dateOne" :minDate="minDate" />
            </StackLayout>
            <StackLayout row="2" col="0">
                <FlexboxLayout justifyContent="center" alignItems="center">
                    <Label text="Fecha numero 1" textWrap="true" />
                </FlexboxLayout>
                <DatePicker v-model="reservation.dateTwo" :minDate="minDate" />
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

export default {
    name: 'Reservation',

    data(){
        return{
            reservation: {
                dateOne: new Date(),
                dateTwo: new Date(),
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

    methods: {
        async makeReservation(){
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