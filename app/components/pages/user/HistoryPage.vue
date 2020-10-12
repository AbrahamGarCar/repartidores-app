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
                    <FlexboxLayout marginTop="10" justifyContent="center" alignItems="center">
                        <Label text="Historial de ubicaciones" fontSize="22" color="black" textWrap="true" />
                      
                    </FlexboxLayout>
                    <StackLayout marginTop="20" width="100%" v-if="reservations.length != 0">
                        <FlexboxLayout width="100%" justifyContent="space-between" alignItems="center" v-for="(item, index) in reservations" :key="index">
                            <Label :text="item.dateOne | formatDate" textWrap="true" />
                            <Button class="bg-color" color="white" text="VER" @tap="goToQR(item.id)" />
                        </FlexboxLayout>
                    </StackLayout>
                    

                    <FlexboxLayout marginTop="20" v-else row="1" col="0" justifyContent="center" alignItems="center">
                        <Label textAlignment="center" fontSize="22" text="Tu historial esta limpio hasta este momento." textWrap="true" />
                    </FlexboxLayout>

                    <StackLayout marginTop="20">
                        <Button width="100%" class="bg-color" color="white" text="Regresar a Inicio" @tap="goToHome" />
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

//Vuelidate
import { required, maxLength } from 'vuelidate/lib/validators'

//Toast
import * as Toast from 'nativescript-toast'

//Moment
const moment = require('moment')

export default {
    name: 'History',

    data(){
        return{
            reservations: [],
        }
    },

    mounted(){
        this.getReservations()
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
        async getReservations(){
            let response = await firebase.firestore.collection('reservations')
                                                    .where('user', '==', this.user.uid)
                                                    .where('process', '==', 'PENDIENTE')
                                                    .where('payment', '==', true)
                                                    .orderBy('dateOne')
                                                    .get()
                                                    .then(query => {
                                                        query.forEach(doc => {
                                                            let data = doc.data()

                                                            Object.defineProperty(data, 'id', {
                                                                enumerable: false,
                                                                configurable: false,
                                                                writable: false,
                                                                value: doc.id
                                                            });

                                                            this.reservations.push(data)
                                                        })
                                                    })
        },

        goToQR(args){
            this.$navigator.navigate('/qr', { props: { id: args } })
        },

        goToHome(){
            this.$navigator.navigate('/home')
        }
    }
}
</script>