<template>
    <Page actionBarHidden="true" @navigatedTo="onNavigatedTo($event)">
        <GridLayout rows="*" columns="*">
            <ScrollView row="0" col="0" width="100%">
                <WrapLayout orientation="horizontal" marginTop="5" id="grid">
                    <GridLayout :width="width" :height="height" padding="10">
                        <FlexboxLayout width="100%" height="100%" justifyContent="center" alignItems="center" flexDirection="column" backgroundColor="transparent">
                            <Label color="black" class="font-awesome" fontSize="25" text="LOGO" textWrap="true" />
                        </FlexboxLayout>
                    </GridLayout>
                    <GridLayout :width="width" :height="height" padding="10">
                        <FlexboxLayout width="100%" height="100%" justifyContent="center" alignItems="center" flexDirection="column" backgroundColor="black">
                            <Label color="white" class="font-awesome" fontSize="55" text="" textWrap="true" />
                            <Label color="white" marginTop="10" textAlignment="center" :text="`¡Hola, ${user.name}!`" fontSize="12" textWrap="true" />
                        </FlexboxLayout>
                    </GridLayout>
                    <GridLayout :width="width" :height="height" padding="10">
                        <FlexboxLayout width="100%" height="100%" paddingLeft="15" justifyContent="center" alignItems="flex-start" flexDirection="column" backgroundColor="black">
                            <Label color="white" class="font-awesome" fontSize="45" text="" textWrap="true" />
                            <Label color="white" marginTop="10" textAlignment="center" text="Areas" fontSize="12" textWrap="true" />
                            <Label color="white" marginTop="10" textAlignment="center" text="Acambar - Senderismo - Rapel" fontSize="9" textWrap="true" />
                        </FlexboxLayout>
                    </GridLayout>
                    <GridLayout :width="width" :height="height" padding="10">
                        <FlexboxLayout width="100%" height="100%" paddingLeft="15" justifyContent="center" alignItems="flex-start" flexDirection="column" backgroundColor="black" @tap="goToReservation">
                            <Label color="white" class="font-awesome" fontSize="45" text="" textWrap="true" />
                            <Label color="white" marginTop="10" textAlignment="center" text="Reservar" fontSize="12" textWrap="true" />
                            <Label color="white" marginTop="10" textAlignment="center" text="Realiza tu reservacion" fontSize="9" textWrap="true" />
                        </FlexboxLayout>
                    </GridLayout>
                    <GridLayout :width="width" :height="height" padding="10">
                        <FlexboxLayout width="100%" height="100%" paddingLeft="15" justifyContent="center" alignItems="flex-start" flexDirection="column" backgroundColor="black">
                            <Label color="white" class="font-awesome" fontSize="45" text="" textWrap="true" />
                            <Label color="white" marginTop="10" textAlignment="center" text="Reservacion activa" fontSize="12" textWrap="true" />
                        </FlexboxLayout>
                    </GridLayout>
                    <GridLayout :width="width" :height="height" padding="10">
                        <FlexboxLayout width="100%" height="100%" paddingLeft="15" justifyContent="center" alignItems="flex-start" flexDirection="column" backgroundColor="black">
                            <Label color="white" class="font-awesome" fontSize="45" text="" textWrap="true" />
                            <Label color="white" marginTop="10" textAlignment="center" text="Historial" fontSize="12" textWrap="true" />
                        </FlexboxLayout>
                    </GridLayout>

                    <StackLayout padding="10">
                        <StackLayout backgroundColor="black" width="100%" padding="15">
                            <Label color="white" text="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi, magni voluptatem illo totam dolore quo excepturi nemo debitis a illum vel deleniti dolorum et, quam animi, repudiandae repellendus quisquam omnis." textWrap="true" />
                            <Label color="white" fontSize="11" marginTop="10" text="12 de Julio 2020" textWrap="true" />
                            
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
                        <Button color="white" backgroundColor="black" borderWidth="1" borderColor="black" width="200" height="50" class="font-awesome" text=" Cerrar sesion" @tap="singOut" />
        
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

export default {
    name: 'HomePage',

    data(){
        return{
            width: 0,
            height: '',

            reservation: null,
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

        async goToReservation(){
            try {
                let response = await firebase.firestore.collection('reservations')
                                                        .where('user', '==', this.user.uid)
                                                        .where('status', '==', true)
                                                        .get()
                                                        .then(query => {
                                                            query.forEach(async doc => {
                                                                if (doc.exists) {
                                                                    this.reservation = doc.data()

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
                                                                }else{
                                                                    this.$navigator.navigate('/reservation')
                                                                }
                                                            })
                                                        })

                if (this.reservation == null) {
                    this.$navigator.navigate('/reservation')
                }
            } catch (e) {
                console.log(e)
            }
                
        },

        singOut(){
            firebase.logout()
            this.$navigator.navigate('/login', { clearHistory: true })
        }
    }
}
</script>

<style>

</style>