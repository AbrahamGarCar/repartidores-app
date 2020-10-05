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
    <Page actionBarHidden="true" @navigatedTo="onNavigatedTo($event)">
        <GridLayout class="box-1" rows="*" columns="*">
            <ScrollView row="0" col="0" width="100%">
                <WrapLayout orientation="horizontal" marginTop="5" id="grid">
                    <FlexboxLayout width="100%" class="bg-color" v-if="reservation != null" justifyContent="center" alignItems="center" flexDirection="column" padding="10">
                        <Label text="Parece que tienes una reservacion en proceso" color="white" textWrap="true" />
                        <Button class="bg-color" color="white" text="Eliminar" @tap="deleteReservation" />
                        
                    </FlexboxLayout>
                    <GridLayout :width="width" :height="height" padding="10">
                        <FlexboxLayout width="100%" height="100%" justifyContent="center" alignItems="center" flexDirection="column" backgroundColor="transparent">
                            <Image src="~/assets/images/logo.png" width="150" stretch="aspectFit" verticalAlignment="center" horizontalAlignment="center" />
                        </FlexboxLayout>
                    </GridLayout>
                    <GridLayout :width="width" :height="height" padding="10">
                        <FlexboxLayout width="100%" height="100%" justifyContent="center" alignItems="center" flexDirection="column" class="bg-color">
                            <Label color="white" class="font-awesome" fontSize="55" text="" textWrap="true" />
                            <Label color="white" marginTop="10" textAlignment="center" :text="`¡Hola, ${user.name}!`" fontSize="12" textWrap="true" />
                        </FlexboxLayout>
                    </GridLayout>
                    <GridLayout :width="width" :height="height" padding="10">
                        <FlexboxLayout width="100%" height="100%" paddingLeft="15" justifyContent="center" alignItems="flex-start" flexDirection="column" class="bg-color" @tap="goToPanicButton">
                            <Label color="white" class="font-awesome" fontSize="45" text="" textWrap="true" />
                            <Label color="white" marginTop="10" textAlignment="center" text="Boton de Panico" fontSize="12" textWrap="true" />
                            <!-- <Label color="white" marginTop="10" textAlignment="center" text="Acambar - Senderismo - Rapel" fontSize="9" textWrap="true" /> -->
                        </FlexboxLayout>
                    </GridLayout>

                    <!-- Rservation -->
                    <AbsoluteLayout :width="width" :height="height" padding="10">
                        <FlexboxLayout width="100%" height="100%" paddingLeft="15" justifyContent="center" alignItems="flex-start" flexDirection="column" class="bg-color" @tap="goToReservation">
                            <Label color="white" class="font-awesome" fontSize="45" text="" textWrap="true" />
                            <Label color="white" marginTop="10" textAlignment="center" text="Reservar" fontSize="12" textWrap="true" />
                            <Label color="white" marginTop="10" textAlignment="center" text="Realiza tu reservacion" fontSize="9" textWrap="true" />
                        </FlexboxLayout>
                        <FlexboxLayout v-if="reservation != null" top="5" left="5" width="20" height="20" borderRadius="50" backgroundColor="red" justifyContent="center" alignItems="center">
                            <Label text="i" color="white" textWrap="true" />
                        </FlexboxLayout>
                    </AbsoluteLayout>
                    <!-- Reservation -->

                    <GridLayout :width="width" :height="height" padding="10">
                        <FlexboxLayout width="100%" height="100%" paddingLeft="15" justifyContent="center" alignItems="flex-start" flexDirection="column" class="bg-color" @tap="goToActiveReservation">
                            <Label color="white" class="font-awesome" fontSize="45" text="" textWrap="true" />
                            <Label color="white" marginTop="10" textAlignment="center" text="Reservacion activa" fontSize="12" textWrap="true" />
                        </FlexboxLayout>
                    </GridLayout>
                    <GridLayout :width="width" :height="height" padding="10">
                        <FlexboxLayout width="100%" height="100%" paddingLeft="15" justifyContent="center" alignItems="flex-start" flexDirection="column" class="bg-color" @tap="goToHistory">
                            <Label color="white" class="font-awesome" fontSize="45" text="" textWrap="true" />
                            <Label color="white" marginTop="10" textAlignment="center" text="Historial" fontSize="12" textWrap="true" />
                        </FlexboxLayout>
                    </GridLayout>

                    <StackLayout padding="10" v-if="news != null">
                        <StackLayout class="bg-color" width="100%" padding="15">
                            <Label color="white" :text="news.body" textWrap="true" />
                            <Label color="white" fontSize="11" marginTop="10" :text="news.date | formatDate" textWrap="true" />
                            
                            <GridLayout rows="*" columns="*, *" marginTop="15">
                                <FlexboxLayout row="0" col="0" justifyContent="flex-start" alignItems="center">
                                    <Label fontSize="19" color="white"  text="Noticias" textWrap="true" />
                                </FlexboxLayout>
                                <FlexboxLayout row="0" col="1" justifyContent="flex-end" alignItems="center">
                                    <Label fontSize="19" color="white"  text="" class="font-awesome" textWrap="true" />
                                </FlexboxLayout>
                            </GridLayout>
                        </StackLayout>
                    </StackLayout>

                    <FlexboxLayout padding="10" justifyContent="flex-end" alignItems="center" width="100%">
                        <Button color="white" width="200" height="50" class="font-awesome bg-color" text=" Cerrar sesion" @tap="singOut" />
        
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

//Moment
const moment = require('moment')

export default {
    name: 'HomePage',

    data(){
        return{
            width: 0,
            height: '',

            reservation: null,
            reservationId: null,
            news: null
        }
    },

    created(){
        this.getNews()
        this.getReservation()
    },

    filters: {
        formatDate(date){
            moment.locale('es')
            
            return moment(date).format('LL')
        }
    },

    computed: {
        ...mapState([
                'user',
            ]),
        
    },

    methods: {
        async onNavigatedTo(args){
            const page = args.object.page
            const grid = page.getViewById('grid')

            setTimeout(() => {
                console.log('Este es el tamaño: ' + grid.getActualSize().width)
                this.width = grid.getActualSize().width / 2
                this.height = grid.getActualSize().width / 2
            }, 500)   
        },

        async getNews(){
            try {
                let response = await firebase.firestore.collection('news')
                                                        .orderBy('date', 'desc')
                                                        .limit(1)
                                                        .get()
                                                        .then(query => {
                                                            query.forEach(async doc => {

                                                                let data = await firebase.firestore.collection('news')
                                                                                        .doc(doc.id)
                                                                                        .get()

                                                                this.news = data.data()
                                                                
                                                            })
                                                        })
            } catch (e) {
                console.log(e)
            }
        },

        async getReservation(){
            this.reservation = null
            try {
                let response = await firebase.firestore.collection('reservations')
                                                        .where('user', '==', this.user.uid)
                                                        .where('status', '==', true)
                                                        .get()
                                                        .then(query => {
                                                            query.forEach(async doc => {
                                                                if (doc.exists) {
                                                                    this.reservation = doc.data()
                                                                    this.reservationId = doc.id
                                                                }
                                                            })
                                                        })
            } catch (error) {
                console.log(error)
            }
        },

        async deleteReservation(){
            try {
                let response = await firebase.firestore.collection('reservations')
                                                        .doc(this.reservationId)
                                                        .delete()

                this.reservation = null
            } catch (error) {
                console.log(error)
            }
        },

        goToReservation(){
            try {
                if (this.reservation == null) {
                    this.$navigator.navigate('/reservation')
                }else{
                    switch (this.reservation.step) {
                        case 1:
                            this.$navigator.navigate('/ubications')
                            break;
                        case 2:
                            this.$navigator.navigate('/information-payment')
                            break;
                        case 3:
                            this.$navigator.navigate('/paypal')
                            break;
                        case 4:
                            this.$navigator.navigate('/qr')
                            break;
                    
                        default:
                            this.$navigator.navigate('/reservation')
                            break;
                    }
                }
            } catch (e) {
                console.log(e)
            }
                
        },

        goToActiveReservation(){
            this.$navigator.navigate('/active-reservation')
        },

        goToHistory(){
            this.$navigator.navigate('/history')
        },

        goToPanicButton(){
            this.$navigator.navigate('/panic-button')
        },

        singOut(){
            firebase.logout()
            this.$navigator.navigate('/login', { clearHistory: true })
        }
    }
}
</script>