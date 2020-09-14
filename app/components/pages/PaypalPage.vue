<template>
    <Page actionBarHidden="true" navigatedTo="onNavigatedTo">
        <GridLayout class="box-1" rows="*, 60" columns="*">
            <WebViewExt row="0" col="0" ref="webview" src="https://paypal-majalca.herokuapp.com" @webAlert="changeTitle" />
            <StackLayout row="1" col="0">
                <Button width="100%" backgroundColor="black" color="white" text="Continuar" @tap="changeTitle" />
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
    name: 'App',

    components: {
        
    },

    data(){
        return{
            gotMessageData: null,
            reservationID: null,
        }
    },

    computed: {
        ...mapState([
            'user'
        ])
    },

    mounted(){
        this.$refs.webview.nativeView.on("gotMessage", (msg) => {
            this.gotMessageData = msg.data;
            
            if (this.gotMessageData == null) {
                alert('Aun no se ha completado la transaccion')
            }else if(this.gotMessageData == 'cancel'){
                alert('El pago ha sido rechazado')
            }else if(this.gotMessageData == 'success') {
                this.makePayment()
            }
        });
    },

    methods: {
        async executeJavaScriptTest(js){
            try {
                const res = await this.$refs.webview.nativeView.executeJavaScript(js);
                console.log(`executeJavaScript '${js}' => ${JSON.stringify(res)}`);
                const jsonRes = JSON.stringify(res);

                return res;
            } catch (err) {
                console.log(`executeJavaScript '${js}' => ERROR: ${err}`);
                throw err;
            }
        },

        async changeTitle(){
            await this.executeJavaScriptTest("callFromNativeScript()");
        },

        async makePayment(){
            console.log('olis')
            try {
                let response = await firebase.firestore.collection('reservations')
                                                        .where('user', '==', this.user.uid)
                                                        .where('status', '==', true)
                                                        .get()
                                                        .then(query => {
                                                            query.forEach(async doc => {
                                                                console.log(doc)
                                                                this.reservationID = doc.id
                                                                await firebase.firestore.collection('reservations')
                                                                                        .doc(doc.id)
                                                                                        .update({ step: 4, payment: true, status: false, process: 'PENDIENTE' })
                                                            })
                                                        })

                this.goToQR()
            } catch (e) {
                console.log(e)
            }
        },

        goToQR(){
            this.$navigator.navigate('/qr', { props: { id: this.reservationID } })
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