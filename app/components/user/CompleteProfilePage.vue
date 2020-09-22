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
        <GridLayout class="box-1" rows="*" columns="*">
            <ScrollView row="0" col="0" width="100%">
                <WrapLayout orientation="horizontal" marginTop="5" id="grid">
                    <GridLayout rows="*, 2*" columns="*">
                        <FlexboxLayout row="0" col="0" justifyContent="flex-end" alignItems="center" flexDirection="column">
                            <Image src="~/assets/images/logo.png" width="150" stretch="aspectFit" verticalAlignment="center" horizontalAlignment="center" />
                            <Label text="Bienvenido" fontSize="30" textWrap="true" />
                        </FlexboxLayout>

                        <StackLayout row="1" col="0">
                            <FlexboxLayout row="1" col="0" justifyContent="center" alignItems="center" flexDirection="column">
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="profile.telephone" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="Numero celular" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="profile.direction" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="Direccion" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="profile.birthdate" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="Fecha de nacimiento" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="profile.INE" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="Numero de INE" text="" />
                                </StackLayout>

                                <StackLayout marginTop="10" width="90%" borderWidth="0 0 1 0" borderColor="black" />

                                <StackLayout marginTop="10" width="90%">
                                    <Label color="black" fontSize="15" text="¿Es la primera ves que nos visita?" textWrap="true" />
                                    <FlexboxLayout justifyContent="flex-start" alignItems="center">
                                        <Switch v-model="profile.firstTime" />
                                    </FlexboxLayout>
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <Label color="black" fontSize="15" text="¿De donde nos visita?" textWrap="true" />
                                    <TextField v-model="profile.origin" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <Label color="black" fontSize="15" text="¿Motivo de la visita?" textWrap="true" />
                                    <TextField v-model="profile.reason" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="" text="" />
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

                                <StackLayout>
                                    <Label text="Foto frente:" textWrap="true" />
                                    <Label :text="photoOne" textWrap="true" />
                                    
                                </StackLayout>
                                <StackLayout>
                                    <Label text="Foto reverso:" textWrap="true" />
                                    <Label :text="photoTwo" textWrap="true" />
                                    
                                </StackLayout>
                                

                                <FlexboxLayout width="90%" marginTop="10" marginBottom="10" justifyContent="center" alignItems="center" flexDirection="column">
                                    <Button text="Registrarme" @tap="createUser" />
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

//Vuex
import { mapState } from 'vuex'

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

export default {
    name: 'Register',

    data(){
        return{
            width: 0,
            height: '',

            uid: '',

            profile: {
                telephone: '',
                direction: '',
                birthdate: '',
                INE: '',
                firstTime: true,
                origin: '',
                reason: '',
                role: 'Usuario',
                registerDate: new Date(),
                completeProfile: true,
            },

            controlPhotos: 1,

            pathPhotos: [],

            photoOne: null,
            photoTwo: null,
        }
    },

    mounted() {
        this.askPermissions()
    },

    computed: {
        ...mapState([
            'user'
        ])
    },

    validations: {
        profile: {
            telephone: {
                required,
            },
            direction: {
                required,
            },
            birthdate: {
                required,
            },
            INE: {
                required,
            },
            origin: {
                required,
            },
            reason: {
                required,
            },
        }
    },

    methods: {
        //Permisos
        askPermissions(){
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

            if(this.$v.profile.$invalid){

                if(!this.$v.profile.telephone.required){
                    Toast.makeText("Telefono obligatorio.", "long").show()
                }

                if(!this.$v.profile.direction.required){
                    Toast.makeText("Telefono obligatorio.", "long").show()
                }

                if(!this.$v.profile.birthdate.required){
                    Toast.makeText("Fecha de nacimiento obligatorio.", "long").show()
                }

                if(!this.$v.profile.INE.required){
                    Toast.makeText("INE obligatorio.", "long").show()
                }

                if(!this.$v.profile.origin.required){
                    Toast.makeText("De donde nos visita obligatorio.", "long").show()
                }

                if(!this.$v.profile.reason.required){
                    Toast.makeText("Motivo obligatorio.", "long").show()
                }
                return
            }

            try {
                loader.show(options)

                let response = await firebase.firestore.collection('users')
                                                    .doc(this.user.uid)
                                                    .update(this.profile)

                this.uid = this.user.uid

                this.controlUploadPhotos()
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

                    if(user.terms){
                        this.$store.commit('updateUser', user)
                        this.$navigator.navigate('/home', { clearHistory: true })
                    }else{
                        this.$store.commit('updateUser', user)
                        this.$navigator.navigate('/terms', { clearHistory: true })
                    }  
                    
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