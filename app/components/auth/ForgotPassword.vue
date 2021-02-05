<style>
    /* .banner-login{
        background-image: url('https://www.bestours.es/viajes-de-empresa/wp-content/uploads/2016/08/Personal-shopper-nh-collection.jpg');
        background-position: center top;
        background-size: cover;
        background-repeat: no-repeat;
    } */
</style>

<template>
    <Page actionBarHidden="true">
        <GridLayout rows="*" columns="*">
            <StackLayout row="0" col="0">
                <FlexboxLayout height="65%" borderRadius="0 0 0 0" justifyContent="center" alignItems="center" backgroundColor="#F2CBC2">
                    <GridLayout height="100%" rows="*, 2*" columns="*">
                        <FlexboxLayout row="0" col="0" justifyContent="flex-end" alignItems="flex-start" flexDirection="column">
                            <Label marginLeft="5%" borderWidth="0 0 0 4" padding="17 0 15 10" borderColor="black" color="black" fontWeight="bold" fontSize="25" text="RECUPERAR CONTRASEÑA" textWrap="true" />
                        </FlexboxLayout>
                        <FlexboxLayout row="1" col="0" justifyContent="center" alignItems="center" flexDirection="column">
                            <StackLayout width="90%">
                                <!-- <Label color="black" fontWeight="bold" text="Email" textWrap="true" /> -->
                               <TextField v-model="email" color="black" keyboardType="email" borderRadius="10" backgroundColor="white" padding="5 5 5 5" fontSize="16" hint="Correo electrónico" text="" />
                            </StackLayout>
                        </FlexboxLayout>
                    </GridLayout>
                </FlexboxLayout>
                <FlexboxLayout backgroundColor="#F2CBC2" justifyContent="center" alignItems="center" marginTop="-20">
                    <FlexboxLayout marginRight="10" padding="5 10" borderRadius="10" justifyContent="center" alignItems="center" width="90%" height="40" backgroundColor="#F24464" color="white" @tap="forgotPassword"> 
                        <Label fontSize="16" text="ENVIAR EMAIL" textWrap="true" />
                    </FlexboxLayout>
                </FlexboxLayout>

                <StackLayout backgroundColor="#F2CBC2">                    
                    <FlexboxLayout width="100%" height="100%" justifyContent="space-around" alignItems="center" flexDirection="column">
                        <Label color="black" text="O inicia sesion con:" textWrap="true" />
                        <FlexboxLayout width="90%" marginTop="10" paddingBottom="10" justifyContent="center" alignItems="center">
                            <FlexboxLayout marginRight="10" width="40" height="40" justifyContent="center" alignItems="center" borderRadius="100" backgroundColor="#1877F2" @tap="loginFacebook">
                                <Label fontSize="20" class="font-awesome-brands" color="white" text="" textWrap="true" />
                            </FlexboxLayout>
                            <FlexboxLayout marginLeft="10" width="40" height="40" justifyContent="center" alignItems="center" borderRadius="100" backgroundColor="#FF4131" @tap="loginGoogle">
                                <Label fontSize="20" class="font-awesome-brands" color="white" text="" textWrap="true" />
                            </FlexboxLayout>
                        </FlexboxLayout>

                        <Label color="black" text="¿Ya tienes una cuenta? Inicia sesion." textWrap="true" @tap="goToLogin" />
                    </FlexboxLayout>
                </StackLayout>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
//Firebase
const firebase = require("nativescript-plugin-firebase")

//Vuelidate
import { required, email, minLength } from 'vuelidate/lib/validators'

//Toast
import * as Toast from 'nativescript-toast'

export default {
    name: 'Login',

    data(){
        return{
            email: ''
        }
    },

    validations: {
        email: {
            required  
        }
    },

    methods: {

        async forgotPassword(){
            if(!this.$v.email.required){
                Toast.makeText("Ingresa un email", "long").show()
                return
            }

            try {
                let response = await firebase.sendPasswordResetEmail(this.email)
                                    .then(() => {
                                        Toast.makeText("Email enviado.", "long").show()
                                    })
                                    .catch(error => {
                                        Toast.makeText("Ocurrio un error, intenta mas tarde.", "long").show()
                                    });
            } catch (error) {
                console.log(error)
            }
        },

        async loginFacebook(){
            try{
                let response = await firebase.login({
                    type: firebase.LoginType.FACEBOOK,
                })

                if(response){
                    console.log(JSON.stringify(response.additionalUserInfo.isNewUser))

                    if(response.additionalUserInfo.isNewUser){

                        let user = {
                            uid: response.uid,
                            name: response.displayName,
                            email: response.additionalUserInfo.profile.email,
                            terms: false,
                            role: 'user',
                            photo: response.additionalUserInfo.profile.picture,
                            completeProfile: false,
                            registerDate: new Date(),
                            active: false,
                            INE: false,
                            contract: false,
                            planActivate: new Date(),
                            planDeactivate: new Date(),
                            plan: null,
                            _geoloc: {
                                lat: 0,
                                lng: 0,
                            }
                        }

                        await firebase.firestore.collection('users').doc(user.uid).set(user)
                        // this.getUserWelcome()
                        
                    }
                    this.getUser(response.uid)
                }
            }
            catch(e){
                console.log(e)
            }
        },

        async loginGoogle(){
            try{
                let response = await firebase.login({
                    type: firebase.LoginType.GOOGLE,
                })

                if(response){
                    console.log(JSON.stringify(response.additionalUserInfo.isNewUser))

                    if(response.additionalUserInfo.isNewUser){

                        let user = {
                            uid: response.uid,
                            name: response.displayName,
                            email: response.additionalUserInfo.profile.email,
                            terms: false,
                            role: 'user',
                            photo: response.additionalUserInfo.profile.picture,
                            completeProfile: false,
                            registerDate: new Date(),
                            active: false,
                            INE: false,
                            contract: false,
                            planActivate: new Date(),
                            planDeactivate: new Date(),
                            plan: null,
                            _geoloc: {
                                lat: 0,
                                lng: 0,
                            }
                        }

                        await firebase.firestore.collection('users').doc(user.uid).set(user)
                        // this.getUserWelcome()
                        
                    }
                    this.getUser(response.uid)
                }
            }
            catch(e){
                console.log(e)
            }
        },

        //We get the user data from firebase
        async getUser(uid){
            try {
                this.$showModal(ModalLogin)

                let response = await firebase.firestore.collection('users').doc(uid).get()

                if(response.exists){
                    let user = response.data()

                    console.log(user);

                    this.$store.dispatch('updateUserToken', {
                        user: uid,
                    })

                    this.$store.dispatch('getPhotos', {
                        user: uid,
                    })

                    if (!user.completeProfile) {
                        this.$store.commit('updateUser', user)
                        this.$navigator.navigate('/complete-profile', { clearHistory: true })

                        return
                    } 
                    
                    if (!user.INE) {
                        this.$store.commit('updateUser', user)
                        this.$navigator.navigate('/ine', { clearHistory: true })

                        return
                    }
                    
                    if (!user.terms) {
                        this.$store.commit('updateUser', user)
                        this.$navigator.navigate('/terms', { clearHistory: true })

                        return
                    }
                    
                    if (!user.contract) {
                        this.$store.commit('updateUser', user)
                        this.$navigator.navigate('/contract', { clearHistory: true })

                        return
                    } 

                    this.$store.commit('updateUser', user)
                    this.$navigator.navigate('/home', { clearHistory: true })
                    
                }
            } catch (error) {
                console.log(error)
            }
        },

        goToLogin(){
            this.$navigator.navigate('/login', 
            {
            transition: 
                {
                    name: 'slideRight', 
                    duration: 500, 
                    curve: 'linear'
                }
            })
        }
    }
}
</script>
