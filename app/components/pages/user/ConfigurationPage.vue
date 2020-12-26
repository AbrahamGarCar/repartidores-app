<template>
    <Page actionBarHidden="true">
        <GridLayout rows="*" columns="*">
            <ScrollView row="1" col="0" backgroundColor="white">
                <WrapLayout orientation="vertical" paddingBottom="20">
                    <GridLayout rows="120, *" columns="*" height="100%">
                        <FlexboxLayout class="gradient" row="0" col="0" justifyContent="space-between" alignItems="flex-start" padding="10" borderRadius="0 0 20 20">
                            <Label padding="10" class="font-awesome" fontSize="20" color="white" text="" textWrap="true" @tap="goToHome" />
                            <Label fontSize="22" color="white" marginTop="2" text="Configuración" textWrap="true" />
                            <Label padding="10" class="font-awesome" fontSize="20" color="white" text="" textWrap="true" @tap="goToHome" />
                        </FlexboxLayout>

                        <StackLayout row="1" col="0" marginTop="-60">
                            <FlexboxLayout width="100%" justifyContent="center" alignItems="center">
                                <!-- <StackLayout width="150" height="150" borderRadius="100" @tap="selectOptionPhoto(1)" v-shadow="20">
                                    <Image borderRadius="100" :src="photos[0]" stretch="aspectFill" />
                                </StackLayout> -->
                                <StackLayout width="150" height="150" borderRadius="100" v-shadow="20">
                                    <Image borderRadius="100" :src="photos[0].photo" stretch="aspectFill" />
                                </StackLayout>
                            </FlexboxLayout>
                            
                            <StackLayout>
                                <FlexboxLayout row="1" col="0" justifyContent="center" alignItems="center" flexDirection="column">
                                    <!-- <StackLayout marginTop="10" width="90%">
                                        <TextField v-model="userEdit.name" color="black" borderRadius="10" backgroundColor="white" borderColor="black" borderWidth="1" padding="5 5 5 5" fontSize="16" hint="Nombre*" text="" />
                                    </StackLayout>
                                    <StackLayout marginTop="10" width="90%">
                                        <TextField v-model="userEdit.lastName" color="black" borderRadius="10" backgroundColor="white" borderColor="black" borderWidth="1" padding="5 5 5 5" fontSize="16" hint="Apellido paterno*" text="" />
                                    </StackLayout>
                                    <StackLayout marginTop="10" width="90%">
                                        <TextField v-model="userEdit.secondLastName" color="black" borderRadius="10" backgroundColor="white" borderColor="black" borderWidth="1" padding="5 5 5 5" fontSize="16" hint="Apellido materno*" text="" />
                                    </StackLayout> -->
                                    
                                    <StackLayout marginTop="15">
                                        <Label text="Teléfono" textWrap="true" />
                                    </StackLayout>
                                    <StackLayout marginTop="10" width="90%">
                                        <TextField v-model="userEdit.telephone" color="black" borderRadius="10" backgroundColor="white" borderColor="black" borderWidth="1" padding="5 5 5 5" fontSize="16" hint="Numero celular*" text="" />
                                    </StackLayout>
                                    <!-- <StackLayout marginTop="10" width="90%">
                                        <TextField color="black" borderRadius="10" backgroundColor="white" borderColor="black" borderWidth="1" padding="5 5 5 5" fontSize="16" text="" editable="true" hint="Direccion*" v-model="userEdit.direction" />
                                    </StackLayout>
                                    <StackLayout marginTop="10" width="90%">
                                        <ListView height="100" for="item in places">
                                            <v-template>
                                                <Label :text="item.description" @tap="getPlace(item.placeId)" />
                                            </v-template>
                                        </ListView>
                                    </StackLayout> -->

                                    <!-- <StackLayout marginTop="10" width="90%">
                                        <FlexboxLayout justifyContent="center" alignItems="center">
                                            <Label text="Fecha de nacimiento*" color="black" fontSize="18" textWrap="true" />
                                        </FlexboxLayout>
                                        <DatePicker v-model="userEdit.birthdate" :maxDate="maxDate" minDate="01-01-1950" />
                                    </StackLayout> -->

                                    <StackLayout marginTop="10" width="90%" borderWidth="0 0 1 0" borderColor="white" />

                                    <FlexboxLayout width="90%" marginTop="10" marginBottom="10" justifyContent="center" alignItems="center" flexDirection="column">
                                        <Button width="100%" fontSize="16" height="40" backgroundColor="#F24464" borderRadius="10" text="Guardar" color="white" @tap="saveInfo" />
                                    </FlexboxLayout>

                                </FlexboxLayout>
                            </StackLayout>
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

//Vuex
import { mapState } from 'vuex'

//Vuelidate
import { required, email, minLength } from 'vuelidate/lib/validators'

//Toast
import * as Toast from 'nativescript-toast'

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
    name: 'Configuration',

    data(){
        return{
            direction: '',
            places: [],
            place: null,
            showResult: false,

            city: '',
            state: '',
            country: '',

            pathPhotos: [],

            photoOne: null,
            photoTwo: null,

            userEdit: {},
        }
    },

    computed: {
        ...mapState([
            'user',
            'photos'
        ]),

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

    created() {
        this.userEdit = this.user
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
                this.userEdit.direction = this.place.formattedAddress
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

        goToHome(){
            this.$navigator.navigate('/home', 
                {
                transition: 
                    {
                        name: 'slideLeft', 
                        duration: 500, 
                        curve: 'linear'
                    }
                })
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
                    this.savePhotos(this.photoOne)
                }else if(args == 2){
                    this.photoTwo = image.src._android
                    this.savePhotos(this.photoTwo)
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
                        this.savePhotos(this.photoOne)
                    }else if(args == 2){
                        this.photoTwo = image.src[0]._android
                        this.savePhotos(this.photoTwo)
                    }
                    
                }).catch((e) => {
                    // process error
                    console.log(e)
                })
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

        //Guardar las fotos
        async savePhotos(args){
            loader.show(options)
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

                        arrayPhotos.push(url)

                        let response = await firebase.firestore.collection('user_photos')
                                                                .where('photo', '==', this.photos[0])
                                                                .get()
                                                                .then(query => {
                                                                    query.forEach(async doc => {
                                                                        await firebase.firestore.collection('user_photos').doc(doc.id).update({ photo: url })

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
                                                                    })
                                                                })
                                                                
                        
                    },
                    (error) => {
                        loader.hide()
                        console.log("Error 2: " + error);
                    }
                );
   
            }, 8000);
 
        },

        controlUploadPhotos(){
            console.log('daleee')
            loader.hide()

            this.$store.dispatch('getPhotos', {
                user: this.user.uid,
            })
        },

        async saveInfo(){
            if(this.$v.user.$invalid){
                if(!this.$v.user.name.required){
                    Toast.makeText("Nombre obligatorio.", "long").show()
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

                await firebase.firestore.collection('users').doc(this.user.uid).update(this.userEdit)

                this.getUser(this.user.uid)
            } catch(e) {
                loader.hide()
                console.log(e);
            }
        },

        async getUser(uid){
            try {
                let response = await firebase.firestore.collection('users').doc(uid).get()

                if(response.exists){
                    let user = response.data()

                    this.$store.commit('updateUser', user)

                    loader.hide()
                    
                }
            } catch (error) {
                console.log(error)
            }
        },
    },
}
</script>

<style>

</style>