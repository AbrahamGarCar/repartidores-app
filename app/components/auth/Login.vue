<style scoped>
    .box-1{
        background-image: url('~/assets/images/bg-2.png');
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
    }

    .bg-color{
        background-color: rgba(128, 145, 107, 0.7);
    }
</style>

<template>
    <Page actionBarHidden="true">
        <GridLayout rows="*, 2*" columns="*" backgroundColor="#F2CBC2">
            <FlexboxLayout row="0" col="0" justifyContent="center" alignItems="center" flexDirection="column">
                <Image src="~/assets/images/logo.png" width="200" stretch="aspectFit" verticalAlignment="center" horizontalAlignment="center" />
                
                <Label color="black" text="Bienvenido" fontSize="30" textWrap="true" />
            </FlexboxLayout>

            <StackLayout row="1" col="0">
                <FlexboxLayout row="1" col="0" justifyContent="center" alignItems="center" flexDirection="column">
                    <StackLayout width="90%">
                        <TextField v-model="user.email" color="black" keyboardType="email" borderRadius="10" backgroundColor="white" padding="5 5 5 5" fontSize="16" hint="Correo electronico" text="" />
                    </StackLayout>
                    <StackLayout width="90%" marginTop="10">
                        <TextField ref="inputPassword" v-model="user.password" color="black" secure="true" borderRadius="10" backgroundColor="white" padding="5" fontSize="16" hint="Contraseña" text="" />
                    </StackLayout>
                    <FlexboxLayout width="90%" marginTop="10" justifyContent="space-between" alignItems="center">
                        <Label @tap="forgotPassword" text="¿Olvidaste tu contraseña? " color="black" fontSize="13" textWrap="true" />
                        
                        <Label v-if="showPw" @tap="showPassword" marginRight="5" text="" color="black" class="font-awesome" fontSize="13" textWrap="true" />
                        <Label v-else @tap="showPassword" marginRight="5" text="" color="black" class="font-awesome" fontSize="13" textWrap="true" />
                    </FlexboxLayout>
                    <StackLayout width="90%" marginTop="10" paddingBottom="10">
                        <Button fontSize="16" height="40" backgroundColor="#F24464" text="Iniciar sesion" borderRadius="10" color="white" @tap="loginEmail" />
                    </StackLayout>

                    <StackLayout width="90%" borderWidth="0 0 1 0" borderColor="white" />

                    <Label color="black" marginTop="10" text="O inicia sesion con" textWrap="true" />

                    <FlexboxLayout width="90%" marginTop="10" paddingBottom="10" justifyContent="center" alignItems="center">
                        <FlexboxLayout marginRight="10" width="40" height="40" justifyContent="center" alignItems="center" borderRadius="100" backgroundColor="#1877F2">
                            <Label fontSize="20" class="font-awesome-brands" color="white" text="" textWrap="true" />
                        </FlexboxLayout>
                        <FlexboxLayout marginLeft="10" width="40" height="40" justifyContent="center" alignItems="center" borderRadius="100" backgroundColor="#FF4131" @tap="loginGoogle">
                            <Label fontSize="20" class="font-awesome-brands" color="white" text="" textWrap="true" />
                        </FlexboxLayout>
                    </FlexboxLayout>

                    <Label color="black" marginTop="10" text="¿No tienes una cuenta? Registrate aqui." textWrap="true" @tap="goToRegister" />
                </FlexboxLayout>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
//Firebase
const firebase = require("nativescript-plugin-firebase")

//Modal
import ModalLogin from '../modals/ModalLogin'

//Vuelidate
import { required, email, minLength } from 'vuelidate/lib/validators'

//Toast
import * as Toast from 'nativescript-toast'

export default {
    name: 'Login',

    data(){
        return{
            user: {
                email: '',
                password: '',
            },

            showPw: false,
        }
    },

    validations: {
        user: {
            email: {
                required,
                email,
            },
            password: {
                required,
            },
        }
    },

    methods: {
        showPassword(){
            this.showPw = !this.showPw
            this.$refs.inputPassword.nativeView.secure = !this.$refs.inputPassword.nativeView.secure
        },

        forgotPassword(){
            this.$navigator.navigate('/forgot-password', 
            {
            transition: 
                {
                    name: 'slideLeft', 
                    duration: 500, 
                    curve: 'linear'
                }
            })    
        },

        goToRegister(){
            this.$navigator.navigate('/register', 
            {
            transition: 
                {
                    name: 'slideTop', 
                    duration: 500, 
                    curve: 'linear'
                }
            })
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
                            photo: response.additionalUserInfo.profile.picture,
                            completeProfile: false,
                        }

                        await firebase.firestore.collection('users').doc(user.uid).set(user)
                        // this.getUserWelcome()
                        
                    }
                    this.$showModal(ModalLogin)
                    this.getUser(response.uid)
                }
            }
            catch(e){
                console.log(e)
            }
        },

        async loginEmail(){
            if(this.$v.user.$invalid){
                if(!this.$v.user.email.email){
                    Toast.makeText("Ingresa un email valido.", "long").show()
                }
                if(!this.$v.user.password.required){
                    Toast.makeText("Ingresa tu contraseña.", "long").show()
                }
                return
            }
            try {
                // statements
                let response = await firebase.login({
                    type: firebase.LoginType.PASSWORD,
                    passwordOptions: {
                        email: this.user.email,
                        password: this.user.password
                    }
                })
                if(response){
                    this.$showModal(ModalLogin)
                    
                    this.getUser(response.uid)
                }
            } catch(e) {
                console.log(e)
                // statements
                if(e == 'Logging in the user failed. com.google.firebase.auth.FirebaseAuthInvalidUserException: There is no user record corresponding to this identifier. The user may have been deleted.'){
                    console.log('USUARIO NO EXISTE')
                    Toast.makeText("El usuario no existe.", "long").show()
                }else if(e == 'Logging in the user failed. com.google.firebase.FirebaseTooManyRequestsException: We have blocked all requests from this device due to unusual activity. Try again later. [ Too many unsuccessful login attempts. Please try again later. ]'){
                    console.log('INTENTA MAS TARDE')
                    Toast.makeText("Intenta mas tarde.", "long").show()
                }else{
                    console.log('CONTRASEÑA INCORRECTA')
                    Toast.makeText("Contraseña incorrecta.", "long").show()
                }
            }
        },

        //We get the user data from firebase
        async getUser(uid){
            try {
                let response = await firebase.firestore.collection('users').doc(uid).get()

                if(response.exists){
                    let user = response.data()

                    this.$store.dispatch('updateUserToken', {
                        user: uid,
                    })

                    this.$store.dispatch('getPhotos', {
                        user: uid,
                    })

                    if (user.role == 'Guardia') {
                        this.$store.commit('updateUser', user)
                        this.$navigator.navigate('/scaner', { clearHistory: true })
                    }else{
                        if (!user.completeProfile) {
                            this.$store.commit('updateUser', user)
                            this.$navigator.navigate('/complete-profile', { clearHistory: true })
                        } else {
                            if(user.terms){
                                this.$store.commit('updateUser', user)
                                this.$navigator.navigate('/home', { clearHistory: true })
                            }else{
                                this.$store.commit('updateUser', user)
                                this.$navigator.navigate('/terms', { clearHistory: true })
                            }
                        }
                        
                    }
                    
                }
            } catch (error) {
                console.log(error)
            }
        },
    }
}
</script>