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
    <Page actionBarHidden="true" @navigatedTo="onNavigatedTo($event)">
        <GridLayout rows="*" columns="*" backgroundColor="#F2CBC2">
            <ScrollView row="0" col="0" width="100%">
                <WrapLayout orientation="horizontal" marginTop="5" id="grid">
                    <GridLayout rows="*, 2*" columns="*">
                        <FlexboxLayout row="0" col="0" justifyContent="flex-end" alignItems="center" flexDirection="column">
                            <Image src="~/assets/images/logo.png" width="150" stretch="aspectFit" verticalAlignment="center" horizontalAlignment="center" />
                            <Label text="Bienvenido" color="black" fontSize="30" textWrap="true" />
                        </FlexboxLayout>

                        <StackLayout row="1" col="0" v-if="window == 1">
                            <FlexboxLayout row="1" col="0" justifyContent="center" alignItems="center" flexDirection="column">
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="user.name" color="black" borderRadius="10" backgroundColor="white" padding="5 5 5 5" fontSize="16" hint="Nombre*" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="user.lastName" color="black" borderRadius="10" backgroundColor="white" padding="5 5 5 5" fontSize="16" hint="Apellido paterno*" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="user.secondLastName" color="black" borderRadius="10" backgroundColor="white" padding="5 5 5 5" fontSize="16" hint="Apellido materno*" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="user.email" color="black" keyboardType="email" borderRadius="10" backgroundColor="white" padding="5 5 5 5" fontSize="16" hint="Correo electronico*" text="" />
                                </StackLayout>
                                <StackLayout width="90%" marginTop="10">
                                    <TextField ref="inputPassword" v-model="user.password" color="black" secure="true" borderRadius="10" backgroundColor="white" padding="5" fontSize="16" hint="Contraseña*" text="" />
                                </StackLayout>
                                <StackLayout width="90%" marginTop="10">
                                    <TextField color="black" secure="true" borderRadius="10" backgroundColor="white" padding="5" fontSize="16" hint="Repetir contraseña*" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="user.telephone" color="black" borderRadius="10" backgroundColor="white" padding="5 5 5 5" fontSize="16" hint="Numero celular*" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <TextField color="black" borderRadius="10" backgroundColor="white" padding="5 5 5 5" fontSize="16" text="" editable="true" hint="Direccion*" v-model="user.direction" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <ListView height="100" for="item in places">
                                        <v-template>
                                            <Label :text="item.description" @tap="getPlace(item.placeId)" />
                                        </v-template>
                                    </ListView>
                                </StackLayout>

                                <StackLayout marginTop="10" width="90%">
                                    <FlexboxLayout justifyContent="center" alignItems="center">
                                        <Label text="Fecha de nacimiento*" color="black" fontSize="18" textWrap="true" />
                                    </FlexboxLayout>
                                    <DatePicker v-model="user.birthdate" :maxDate="maxDate" minDate="01-01-1950" />
                                </StackLayout>

                                <StackLayout marginTop="10" width="90%" borderWidth="0 0 1 0" borderColor="white" />

                                <FlexboxLayout width="90%" marginTop="10" marginBottom="10" justifyContent="center" alignItems="center" flexDirection="column">
                                    <Button width="100%" fontSize="16" height="40" backgroundColor="#F24464" borderRadius="10" text="Continuar" color="white" @tap="askPermissions" />
                                </FlexboxLayout>

                            </FlexboxLayout>
                        </StackLayout>

                        <StackLayout row="1" col="0" v-if="window == 2">
                            <StackLayout width="90%">
                                <Label textAlignment="center" text="Ya por ultimo sube un par de fotos, una de perfil y una completa." textWrap="true" />
                                <Label textAlignment="center" fontSize="12" text="Permite a la aplicación acceder a tu cámara" textWrap="true" />
                                
                            </StackLayout>

                            <StackLayout marginTop="10">
                                <WrapLayout orientation="horizontal" marginTop="5" marginBottom="10">
                                    <GridLayout id="grid" :width="width" :height="height" padding="5">
                                        <FlexboxLayout v-if="photoOne == null" @tap="selectOptionPhoto(1)" class="input-photo" width="100%" height="100%" justifyContent="center" alignItems="center" flexDirection="column" backgroundColor="#F3F3F3">
                                            <Label class="font-awesome" fontSize="19" text="" textWrap="true" />
                                        </FlexboxLayout>
                                        <FlexboxLayout v-else @tap="selectOptionPhoto(1)" class="input-photo" width="100%" height="100%" justifyContent="center" alignItems="center" flexDirection="column" backgroundColor="#F3F3F3">
                                            <Image :src="photoOne" stretch="aspectFill" />
                                        </FlexboxLayout>
                                    </GridLayout>
                                    <GridLayout :width="width" :height="height" padding="5">
                                        <FlexboxLayout v-if="photoTwo == null" @tap="selectOptionPhoto(2)" class="input-photo" width="100%" height="100%" justifyContent="center" alignItems="center" flexDirection="column" backgroundColor="#F3F3F3">
                                            <Label class="font-awesome" fontSize="19" text="" textWrap="true" />
                                        </FlexboxLayout>
                                        <FlexboxLayout v-else @tap="selectOptionPhoto(2)" class="input-photo" width="100%" height="100%" justifyContent="center" alignItems="center" flexDirection="column" backgroundColor="#F3F3F3">
                                            <Image :src="photoTwo" stretch="aspectFill" />
                                        </FlexboxLayout>
                                    </GridLayout>
                                </WrapLayout>
                            </StackLayout>

                            <GridLayout rows="*" columns="*, *" marginTop="-10">
                                <FlexboxLayout row="0" col="0" justifyContent="center" alignItems="center" flexDirection="column">
                                    <Label text="Foto de perfil" textWrap="true" />
                                    
                                </FlexboxLayout>
                                <FlexboxLayout row="0" col="1" justifyContent="center" alignItems="center" flexDirection="column">
                                    <Label text="Foto completa" textWrap="true" />
                                    
                                </FlexboxLayout>
                            </GridLayout>

                            <!-- <StackLayout>
                                <Label text="Foto frente:" textWrap="true" />
                                <Label :text="photoOne" textWrap="true" />
                                
                            </StackLayout>
                            <StackLayout>
                                <Label text="Foto reverso:" textWrap="true" />
                                <Label :text="photoTwo" textWrap="true" />
                                
                            </StackLayout> -->

                            <FlexboxLayout width="90%" marginTop="10" marginBottom="10" justifyContent="center" alignItems="center" flexDirection="column">
                                <Button width="100%" fontSize="16" height="40" backgroundColor="#022873" color="white" borderRadius="10" text="Regresar" @tap="window = 1" />
                                <Button width="100%" fontSize="16" height="40" backgroundColor="#F24464" color="white" marginTop="10" borderRadius="10" text="Registrarme" @tap="createUser" />

                                <Label marginTop="10" color="black" text="¿Ya tienes una cuenta? Inicia sesion." textWrap="true" @tap="goToLogin" />
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

//Camera
const camera = require("nativescript-camera")
const imageModule = require("tns-core-modules/ui/image")

//Gallery
//GALLERY
const imagePicker = require("nativescript-imagepicker")
const context = imagePicker.create({ mode: "single" })

//LOADER
const LoadingIndicator = require('@nstudio/nativescript-loading-indicator').LoadingIndicator
const Mode = require('@nstudio/nativescript-loading-indicator').Mode
const loader = new LoadingIndicator()

let message1 = 'Cargando...'
let message2 = 'Creando registro'

const options = {
    message: message1,
    details: message2,
    progress: 0.65,
    margin: 10,
    dimBackground: true,
    color: '#2988D2', // color of indicator and labels
    // background box around indicator
    // hideBezel will override this if true
    backgroundColor: 'white',
    userInteractionEnabled: false, // default true. Set false so that the touches will fall through it.
    hideBezel: true, // default false, can hide the surrounding bezel
    mode: Mode.Indeterminate, // see options below
    // android: {
    //     view: android.view.View, // Target view to show on top of (Defaults to entire window)
    //     cancelable: true,
    //     cancelListener: function(dialog) {
    //         console.log('Loading cancelled');
    //     }
    // },
    // ios: {
    //     view: UIView // Target view to show on top of (Defaults to entire window)
    // }
};

import { GooglePlacesAutocomplete } from 'nativescript-google-places-autocomplete'
    
const API_KEY = "AIzaSyC2Xvq1EqHlyPOw0WVb30DfpccC9duRHmM"
const googlePlacesAutocomplete = new GooglePlacesAutocomplete(API_KEY)

export default {
    name: 'Register',

    data(){
        return{
            direction: '',
            places: [],
            place: null,
            showResult: false,

            city: '',
            state: '',
            country: '',

            width: 0,
            height: '',

            uid: '',

            user: {
                name: '',
                lastName: '',
                secondLastName: '',
                email: '',
                password: '',
                telephone: '',
                direction: '',
                birthdate: '',
                role: 'Usuario',
                registerDate: new Date(),
                completeProfile: true,
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
            },

            reasonsItems: [
                'Primer motivo',
                'Segundo motivo',
                'Tercer motivo',
            ],

            pleacesItems: [
                'Opcion 1',
                'Opcion 2',
                'Opcion 3',
            ],

            controlPhotos: 1,

            pathPhotos: [],

            photoOne: null,
            photoTwo: null,

            window: 1,
        }
    },

    mounted() {
        // this.askPermissions()
    },

    computed: {
        changeText(){
            if (this.user.firstTime) {
                return 'Si'
            } else {
                return 'No'
            }
        },

        maxDate(){
            return new Date();
        }
    },

    validations: {
        user: {
            name: {
                required,
            },
            lastName: {
                required,
            },
            secondLastName: {
                required,
            },
            email: {
                required,
                email,
            },
            password: {
                required,
                minLength: minLength(6)
            },
            telephone: {
                required,
            },
            direction: {
                required,
            },
            birthdate: {
                required,
            },
        }
    },

    watch: {
        'user.direction': function (newVal, oldVal){
            this.showResult = true
            this.getPlaces()
        },
    },

    methods: {
        getPlaces(){
            console.log('Entra places')
            googlePlacesAutocomplete.search(this.user.direction)
            .then((places) => {
                console.log(places)
                this.places = places
            }, (error => {
                console.log(error)
            }));
        },

        getPlace(args){
            this.showResult = false
            googlePlacesAutocomplete.getPlaceById(args).then((place) => {
                console.log(place)
                this.place = place
                this.places = []
                this.user.direction = this.place.formattedAddress
                place.data.result.address_components.forEach(element => {
                    if (element.types.includes('locality')){
                        this.city = element.long_name
                    }
                    if (element.types.includes('administrative_area_level_1')){
                       this.state = element.long_name
                    }
                    if (element.types.includes('country')){
                       this.country = element.long_name
                    }
                });

            }, error => {
                console.log(error)
            })      
        },

        //Permisos
        askPermissions(){
            this.window = 2

            camera.requestPermissions().then(
                function success() {
                    console.log('Permisos aceptados')
                    this.permissions = true
                }, 
                function failure() {
                    console.log('Permisos no aceptados')
                    this.permissions = false
                }
            );
        },

        selectReason(args){
            console.log(`index seleccionado: ${args.newIndex}`)
            console.log(this.reasonsItems[args.newIndex])
            this.user.reason = this.reasonsItems[args.newIndex]
        },

        selectPleace(args){
            console.log(`index seleccionado: ${args.newIndex}`)
            console.log(this.pleacesItems[args.newIndex])
            this.user.origin = this.pleacesItems[args.newIndex]
        },

        async onNavigatedTo(args){
            const page = args.object.page
            const grid = page.getViewById('grid')

            setTimeout(() => {
                console.log('Este es el tamaño: ' + grid.getActualSize().width)
                this.width = grid.getActualSize().width / 2
                this.height = grid.getActualSize().width / 2
            }, 500)   
        },

        selectOptionPhoto(args){
            action("Elige como cargar tu foto", "Cancelar", ["Camara", "Galeria"])
            .then(result => {
                if(result == 'Camara'){
                    this.takePhoto(args)
                }else if(result == 'Galeria'){

                    this.openGallery(args)
                }
            });
        },

        //Fotos
        takePhoto(args){
            const options = {
                width: 300,
                height: 300,
                keepAspectRatio: false,
                saveToGallery: true
            }

            camera.takePicture(options).then((response) => {
                console.log('Resultado...')

                let image = new imageModule.Image()
                image.src = response
                if(args == 1){
                    this.photoOne = image.src._android
                }else if(args == 2){
                    this.photoTwo = image.src._android
                }
                
            }).catch((error) => {
                console.log('Error: ' + error.message)
            })
        },

        //Abrir galeria
        openGallery(args){
            context
                .authorize()
                .then(() => {
                    return context.present();
                })
                .then((selection) => {
                    let image = new imageModule.Image()
                    image.src = selection
                    if(args== 1){
                        this.photoOne = image.src[0]._android
                    }else if(args == 2){
                        this.photoTwo = image.src[0]._android
                    }
                    
                }).catch((e) => {
                    // process error
                    console.log(e)
                })
        },

        async createUser(){
            if(this.photoOne == null & this.photoTwo == null){
                alert({
                    name: "Faltan fotos",
                    message: "Debes cargar las dos foto para continuar",
                    okButtonText: "Entendido"
                }).then(() => {
                    console.log("Alert dialog closed")
                });

                return
            }

            if(this.$v.user.$invalid){
                if(!this.$v.user.name.required){
                    Toast.makeText("Nombre obligatorio.", "long").show()
                }

                if(!this.$v.user.email.required){
                    Toast.makeText("Email obligatorio.", "long").show()
                }

                if(!this.$v.user.email.email){
                    Toast.makeText("Ingresa un email valido.", "long").show()
                }

                if(!this.$v.user.password.required){
                    Toast.makeText("Contraseña obligatoria.", "long").show()
                }

                if(!this.$v.user.password.minLength){
                    Toast.makeText("Contraseña minimo 6 caracteres.", "long").show()
                }

                if(!this.$v.user.lastName.required){
                    Toast.makeText("Apellido obligatorio.", "long").show()
                }

                if(!this.$v.user.secondLastName.required){
                    Toast.makeText("Apellido obligatorio.", "long").show()
                }

                if(!this.$v.user.telephone.required){
                    Toast.makeText("Telefono obligatorio.", "long").show()
                }

                if(!this.$v.user.direction.required){
                    Toast.makeText("Telefono obligatorio.", "long").show()
                }

                if(!this.$v.user.birthdate.required){
                    Toast.makeText("Fecha de nacimiento obligatorio.", "long").show()
                }

                return
            }

            try {
                loader.show(options)

                let response = await firebase.createUser({
                    email: this.user.email,
                    password: this.user.password
                })

                if(response){

                    let user = this.user
                        user.uid = response.uid
                        user.terms = false

                    if(response.additionalUserInfo.isNewUser){
                        await firebase.firestore.collection('users').doc(user.uid).set(user)
                        await firebase.firestore.collection('information_user').doc(user.uid).set({ name: this.user.name, cancellationsCount: 0, deliveredCount: 0 })
                    }
                    
                    this.uid = response.uid

                    this.controlUploadPhotos()

                }
            } catch(e) {
                loader.hide()
                console.log(e);
            }
        },

        //Generar UUID
        generateUUID(){
            var h = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
            var k = ['x','x','x','x','x','x','x','x','-','x','x','x','x','-','4','x','x','x','-','y','x','x','x','-','x','x','x','x','x','x','x','x','x','x','x','x'];
            var u = '',i=0,rb=Math.random()*0xffffffff|0;
            while(i++<36) {
                var c=k[i-1],r=rb&0xf,v=c=='x'?r:(r&0x3|0x8);
                u+=(c=='-'||c=='4')?c:h[v];rb=i%8==0?Math.random()*0xffffffff|0:rb>>4
            }
            return u
        },

        controlUploadPhotos(){
            if(this.controlPhotos == 1){
                if(this.photoOne !== null){
                    this.controlPhotos++
                    this.savePhotos(this.photoOne)
                }else{
                    this.controlPhotos++
                    this.savePhotos(null)
                }
            }else if(this.controlPhotos == 2){
                if(this.photoTwo !== ''){
                    this.controlPhotos++
                    this.savePhotos(this.photoTwo)
                }else{
                    this.controlPhotos++
                    this.savePhotos(null)
                }
            }else if(this.controlPhotos == 3){
                message2 = 'Generando vista previa'
                this.getUser()
                // this.closeProduct()
                return
            }
        },

        //Guardar las fotos
        async savePhotos(args){
            if(args == null){
                this.controlUploadPhotos()
                return
            }

            try{
                let metadata = {
                    contentType: "image/jpeg",
                    contentLanguage: "es",
                }

                let fotoId = this.generateUUID()
                firebase.storage.uploadFile({
                remoteFullPath: 'users/' + fotoId + '.jpg',
                localFullPath: args,
                onProgress: (status) => {
                    console.log("Uploaded fraction: " + status.fractionCompleted);
                    console.log("Percentage complete: " + status.percentageCompleted);
                },
                metadata
              }).then((uploadedFile) => {
                    this.getResizePath(fotoId)
                },
                    (error) => {
                        loader.hide()
                        console.log("File upload error: " + error);
                    }
                );
            }
            catch(e){
                loader.hide()
                console.log(e)
            }
        },

        getResizePath(args){
            console.log('Entra a getResizePath')
            setTimeout(() => {
                console.log('Termina el setTimeOut')
                let arrayPhotos = []
                let photoID = `${args}_600x600`

                firebase.storage.getDownloadUrl({
                    remoteFullPath: 'users/' + photoID + '.jpg'
                }).then(async (url) => {

                        let data = {
                            photo: url,
                            user: this.uid
                        }

                        arrayPhotos.push(url)

                        let response = await firebase.firestore.collection('user_photos').add(data)
                        if(response){

                            photoID = `${args}_400x400`

                            firebase.storage.getDownloadUrl({
                                remoteFullPath: 'users/' + photoID + '.jpg'
                            }).then((url) => {

                                    arrayPhotos.push(url)
                                    this.pathPhotos.push(arrayPhotos)
                                    this.controlUploadPhotos()
                                },
                                (error) => {
                                    loader.hide()
                                    console.log("Error 1: " + error);
                                }
                            );
                        }
                    },
                    (error) => {
                        loader.hide()
                        console.log("Error 2: " + error);
                    }
                );
   
            }, 8000);
 
        },

        async getUser(){
            loader.hide()
            try {

                this.$showModal(ModalLogin)
                let response = await firebase.firestore.collection('users').doc(this.uid).get()

                if(response.exists){
                    let user = response.data()

                    this.$store.dispatch('updateUserToken', {
                        user: user.uid,
                    })

                    this.$store.dispatch('getPhotos', {
                        user: user.uid,
                    })

                    this.$navigator.navigate('/ine', { clearHistory: true })

                }
            } catch (error) {
                loader.hide()
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