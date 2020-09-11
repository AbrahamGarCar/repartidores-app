<template>
    <Page actionBarHidden="true">
        <GridLayout rows="*" columns="*">
            <ScrollView row="0" col="0" width="100%">
                <WrapLayout orientation="horizontal" marginTop="5" id="grid">
                    <GridLayout rows="*, 2*" columns="*">
                        <FlexboxLayout row="0" col="0" justifyContent="flex-end" alignItems="center" flexDirection="column">
                            <Label text="Logo" textWrap="true" />
                            <Label text="Bienvenido" fontSize="30" textWrap="true" />
                        </FlexboxLayout>

                        <StackLayout row="1" col="0">
                            <FlexboxLayout row="1" col="0" justifyContent="center" alignItems="center" flexDirection="column">
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="user.name" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="Nombre" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="user.lastName" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="Apellido paterno" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="user.secondLastName" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="Apellido materno" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="user.email" color="black" keyboardType="email" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="Correo electronico" text="" />
                                </StackLayout>
                                <StackLayout width="90%" marginTop="10">
                                    <TextField ref="inputPassword" v-model="user.password" color="black" secure="true" borderWidth="1" borderColor="black" padding="5" fontSize="16" hint="Contraseña" text="" />
                                </StackLayout>
                                <StackLayout width="90%" marginTop="10">
                                    <TextField color="black" secure="true" borderWidth="1" borderColor="black" padding="5" fontSize="16" hint="Repetir contraseña" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="user.telephone" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="Numero celular" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="user.direction" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="Direccion" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="user.birthdate" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="Fecha de nacimiento" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="user.INE" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="Numero de INE" text="" />
                                </StackLayout>

                                <StackLayout marginTop="10" width="90%" borderWidth="0 0 1 0" borderColor="black" />

                                <StackLayout marginTop="10" width="90%">
                                    <Label color="black" fontSize="15" text="¿Es la primera ves que nos visita?" textWrap="true" />
                                    <FlexboxLayout justifyContent="flex-start" alignItems="center">
                                        <Switch v-model="user.firstTime" />
                                    </FlexboxLayout>
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <Label color="black" fontSize="15" text="¿De donde nos visita?" textWrap="true" />
                                    <TextField v-model="user.origin" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="Numero de INE" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <Label color="black" fontSize="15" text="¿Motivo de la visita?" textWrap="true" />
                                    <TextField v-model="user.reason" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="Numero de INE" text="" />
                                </StackLayout>
                                

                                <FlexboxLayout width="90%" marginTop="10" marginBottom="10" justifyContent="center" alignItems="center" flexDirection="column">
                                    <Button text="Registrarme" @tap="createUser" />

                                    <Label marginTop="10" color="black" text="¿Ya tienes una cuenta? Inicia sesion." textWrap="true" @tap="goToLogin" />
                                </FlexboxLayout>

                            </FlexboxLayout>
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

//Vuelidate
import { required, email, minLength } from 'vuelidate/lib/validators'

//Toast
import * as Toast from 'nativescript-toast'

//Modal
import ModalLogin from '../modals/ModalLogin'

export default {
    name: 'Register',

    data(){
        return{
            user: {
                name: '',
                lastName: '',
                secondLastName: '',
                email: '',
                password: '',
                telephone: '',
                direction: '',
                birthdate: '',
                INE: '',
                firstTime: true,
                origin: '',
                reason: ''
            }
        }
    },

    methods: {
        async createUser(){
            // if(this.$v.user.$invalid){
            //     if(!this.$v.user.name.required){
            //         Toast.makeText("Nombre obligatorio.", "long").show()
            //     }

            //     if(!this.$v.user.email.required){
            //         Toast.makeText("Email obligatorio.", "long").show()
            //     }

            //     if(!this.$v.user.email.email){
            //         Toast.makeText("Ingresa un email valido.", "long").show()
            //     }

            //     if(!this.$v.user.password.required){
            //         Toast.makeText("Contraseña obligatoria.", "long").show()
            //     }

            //     if(!this.$v.user.password.minLength){
            //         Toast.makeText("Contraseña minimo 6 caracteres.", "long").show()
            //     }
            //     return
            // }

            try {
                let response = await firebase.createUser({
                    email: this.user.email,
                    password: this.user.password
                })

                if(response){

                    let user = this.user
                        user.uid = response.uid
                        user.terms = false

                    if(response.additionalUserInfo.isNewUser){
                        this.$showModal(ModalLogin)
                        await firebase.firestore.collection('users').doc(user.uid).set(user)
                    }
                    
                    //Lanzar Toast
                    // Toast.makeText("Cuenta creada con exito.", "long").show()

                    this.getUser(response.uid)

                }
            } catch(e) {
                console.log(e);
            }
        },

        async getUser(uid){
            try {
                let response = await firebase.firestore.collection('users').doc(uid).get()

                if(response.exists){
                    let user = response.data()

                    if(user.terms){
                        this.$store.commit('updateUser', user)
                        this.$navigator.navigate('/home', { clearHistory: true })
                    }else{
                        this.$store.commit('updateUser', user)
                        this.$navigator.navigate('/home', { clearHistory: true })
                    }

                    
                    
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
                    name: 'slideBottom', 
                    duration: 500, 
                    curve: 'linear'
                }
            })
        }
    }
}
</script>

<style>

</style>