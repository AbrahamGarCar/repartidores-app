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
                                    <TextField v-model="user.email" color="black" keyboardType="email" borderRadius="10" backgroundColor="white" padding="5 5 5 5" fontSize="16" hint="Correo electrónico*" text="" />
                                </StackLayout>
                                <StackLayout width="90%" marginTop="10">
                                    <TextField ref="inputPassword" v-model="user.password" color="black" secure="true" borderRadius="10" backgroundColor="white" padding="5" fontSize="16" hint="Contraseña*" text="" />
                                </StackLayout>
                                <StackLayout width="90%" marginTop="10">
                                    <TextField color="black" secure="true" borderRadius="10" backgroundColor="white" padding="5" fontSize="16" hint="Repetir contraseña*" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <TextField v-model="user.telephone" keyboardType="phone" color="black" borderRadius="10" backgroundColor="white" padding="5 5 5 5" fontSize="16" hint="Numero celular*" text="" />
                                </StackLayout>
                                <StackLayout marginTop="10" width="90%">
                                    <TextField color="black" borderRadius="10" backgroundColor="white" padding="5 5 5 5" fontSize="16" text="" editable="true" hint="Dirección*" v-model="user.direction" />
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
                                <Label textAlignment="center" text="Sube un par de fotos, una de perfil y una completa." textWrap="true" />
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
                                    <Label text="Foto de frente" textWrap="true" />
                                    
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

                                <Label marginTop="10" color="black" text="¿Ya tienes una cuenta? Inicia sesión." textWrap="true" @tap="goToLogin" />
                            </FlexboxLayout>

                            <FlexboxLayout marginTop="15" justifyContent="center" alignItems="center">
                                <Label fontSize="22" :text="`${percent}%`" textWrap="true" />
                                
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

const fileSystemModule = require("tns-core-modules/file-system");
import { Image } from "ui/image";
import { ImageSource } from 'tns-core-modules/image-source'

import { isAndroid, isIOS, device, screen } from "tns-core-modules/platform";

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
                role: 'user',
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

            percent: 0,

            isAndroid: true,
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
        // takePhoto(args){
        //     const options = {
        //         width: 300,
        //         height: 300,
        //         keepAspectRatio: false,
        //         saveToGallery: true
        //     }

        //     camera.takePicture(options).then((response) => {
        //         let image = new imageModule.Image()
        //         image.src = response
        //         let imgTemp = image.src._android
        //         console.log('Resultado...:', imgTemp)

        //         ImageSource.fromAsset(response).then((source) => {
        //             setTimeout(() => {
        //                 let imgSrc = source.resize(250)
        //                 var folder = fileSystemModule.knownFolders.documents();
        //                 var path = fileSystemModule.path.join(folder.path, `${this.generateUUID()}.png`);
        //                 var saved = imgSrc.saveToFile(path, "png");

        //                 console.log("saved: " + saved);
        //                 console.log("IMAGEN SRC.....", path);

        //                 if(args == 1){
        //                     this.photoOne = path
        //                 }else if(args == 2){
        //                     this.photoTwo = path
        //                 }
        //             }, this.isAndroid ? 0 : 1000);             
        //         });
                
                
        //     }).catch((error) => {
        //         console.log('Error: ' + error.message)
        //     })
        // },

        //Abrir galeria
        // openGallery(args){
        //     context
        //         .authorize()
        //         .then(() => {
        //             return context.present();
        //         })
        //         .then((selection) => {
        //             ImageSource.fromAsset(selection[0]).then((source) => {
        //                 setTimeout(() => {
        //                     let imgSrc = source.resize(300)
        //                     var folder = fileSystemModule.knownFolders.documents();
        //                     var path = fileSystemModule.path.join(folder.path, `${this.generateUUID()}.png`);
        //                     var saved = imgSrc.saveToFile(path, "png");
        //                     console.log("saved: " + saved);
        //                     console.log("IMAGEN SRC.....", path);

        //                     if(args== 1){
        //                         this.photoOne = path
        //                     }else if(args == 2){
        //                         this.photoTwo = path
        //                     }
        //                 }, this.isAndroid ? 0 : 1000);             
        //             });
                    
        //         }).catch((e) => {
        //             // process error
        //             console.log(e)
        //         })
        // },

        takePhoto(args) {
            camera
                .takePicture({
                width: 400, //these are in device independent pixels
                keepAspectRatio: true, //    keepAspectRatio is enabled.
                saveToGallery: false //Don't save a copy in local gallery, ignored by some Android devices
                })
                .then(imageAsset => {
                imageAsset.options.autoScaleFactor = false;
                imageAsset.options.keepAspectRatio = true;
                imageAsset.options.width = 400;

                //save to file
                ImageSource.fromAsset(imageAsset).then(
                    imageSource => {
                    var ratio = 400 / imageSource.width;
                    var newheight = imageSource.height * ratio;
                    var newwidth = imageSource.width * ratio;
                    if (imageSource.width > 400) {
                        console.log(
                        "Resizing original image dimentions from : " +
                            imageSource.height +
                            " x " +
                            imageSource.width +
                            " to " +
                            newheight +
                            " x " +
                            newwidth
                        );
                        if (isIOS) {
                            console.log("Ignoring resize for camera images on iOS");
                            let filename =  `${this.generateUUID()}.jpg`;
                            let folder = fileSystemModule.knownFolders.documents();
                            let fullpath = fileSystemModule.path.join(folder.path, filename);
                            let saved = imageSource.saveToFile(fullpath, "jpeg");

                            if (saved) {
                                if(args == 1){
                                    this.photoOne = fullpath
                                }else if(args == 2){
                                    this.photoTwo = fullpath
                                }
                                console.log(
                                "image imensions: " +
                                    imageSource.height +
                                    " x " +
                                    imageSource.width
                                );
                            } else {
                                console.log(
                                "Error! Unable to save photo to local file for upload"
                                );
                            }
                        } else if (isAndroid) {
                            try {
                                var downsampleOptions = new android.graphics.BitmapFactory.Options();
                                downsampleOptions.inSampleSize = this.getSampleSize(
                                imageAsset.android,
                                { maxWidth: newwidth, maxHeight: newheight }
                                );
                                var bitmap = android.graphics.BitmapFactory.decodeFile(
                                imageAsset.android,
                                downsampleOptions
                                );
                                
                                imageSource.setNativeSource(bitmap);

                                let filename =  `${this.generateUUID()}.jpg`;
                                let folder = fileSystemModule.knownFolders.documents();
                                let fullpath = fileSystemModule.path.join(folder.path, filename);
                                let saved = imageSource.saveToFile(fullpath, "jpeg");

                                if (saved) {
                                    if(args == 1){
                                        this.photoOne = fullpath
                                    }else if(args == 2){
                                        this.photoTwo = fullpath
                                    }

                                    console.log(
                                        "Resized image imensions: " +
                                        imageSource.height +
                                        " x " +
                                        imageSource.width
                                    );
                                } else {
                                    console.log(
                                        "Error! Unable to save image to local file for saving"
                                    );
                                }
                                loader.hide();
                            } catch (err) {
                                console.log(err);
                                loader.hide();
                            }
                        }
                    } else {
                        // let filename =  `${this.generateUUID()}.jpg`;
                        // let folder = fileSystemModule.knownFolders.documents();
                        // let fullpath = fileSystemModule.path.join(folder.path, filename);
                        // let saved = imageSource.saveToFile(fullpath, "jpeg");

                        let saved = false;
                        let filePath = "";
                        const folderPath = fileSystemModule.knownFolders.documents();
                        let fileName = `${this.generateUUID()}.jpg`;
                        console.log("saving image " + fileName + " to path " + folderPath );
                        filePath = fileSystemModule.path.join(folder.path, filename);
                        saved = imageSource.saveToFile(filePath, "jpeg");

                        if (saved) {
                            if(args == 1){
                                this.photoOne = filePath
                            }else if(args == 2){
                                this.photoTwo = filePath
                            }
                        } else {
                            console.log(
                                "Error! Unable to save image to local file for saving"
                            );
                        }
                        loader.hide();
                    }
                    },
                    err => {
                    console.log("Failed to load from asset");
                    }
                );
            })
            .catch(err => {
            console.error(err);
            });
        },

        getSampleSize(uri, options) {
            var scale = 1;
            if (isAndroid) {
                var boundsOptions = new android.graphics.BitmapFactory.Options();
                boundsOptions.inJustDecodeBounds = true;
                android.graphics.BitmapFactory.decodeFile(uri, boundsOptions);
                // Find the correct scale value. It should be the power of 2.
                var outWidth = boundsOptions.outWidth;
                var outHeight = boundsOptions.outHeight;
                if (options) {
                    var targetSize =
                    options.maxWidth < options.maxHeight
                    ? options.maxWidth
                    : options.maxHeight;

                    while (
                        !(
                        this.matchesSize(targetSize, outWidth) ||
                        this.matchesSize(targetSize, outHeight)
                        )
                    ) {
                        outWidth /= 2;
                        outHeight /= 2;
                        scale *= 2;
                    }
                }
            }
            return scale;
        },

        matchesSize(targetSize, actualSize) {
            return targetSize && actualSize / 2 < targetSize;
        },

        openGallery(args) {
            try {
                context
                .authorize()
                .then(() => {
                    return context.present();
                })
                .then(selection => {
                    const imageAsset = selection.length > 0 ? selection[0] : null;
                    imageAsset.options = {
                        width: 400,
                        keepAspectRatio: true,
                        autoScaleFactor: false
                    };

                    loader.show();

                    ImageSource.fromAsset(imageAsset).then(imageSource => {
                        var ratio = 400 / imageSource.width;
                        var newheight = imageSource.height * ratio;
                        var newwidth = imageSource.width * ratio;

                        if (imageSource.width > 400) {
                            console.log(
                                "Resizing original image dimentions from : " +
                                imageSource.height +
                                " x " +
                                imageSource.width +
                                " to " +
                                newheight +
                                " x " +
                                newwidth
                            );
                        if (isIOS) {
                            try {
                                let that = this;
                                let manager = PHImageManager.defaultManager();
                                let options = new PHImageRequestOptions();

                                options.resizeMode = PHImageRequestOptionsResizeMode.Exact;
                                options.deliveryMode = PHImageRequestOptionsDeliveryModeHighQualityFormat;
                                manager.requestImageForAssetTargetSizeContentModeOptionsResultHandler(
                                    imageAsset.ios,
                                    { width: newwidth, height: newheight },
                                    PHImageContentModeAspectFill,
                                    options,
                                    function(result, info) {
                                        let saved = false;
                                        let filePath = "";
                                        const folderPath = fileSystemModule.knownFolders.documents().path;
                                        let fileName =
                                            that.$store.state.profile.id +
                                            "-" +
                                            new Date().getTime() +
                                            ".jpg";
                                        console.log(
                                            "saving image " +
                                            fileName +
                                            " to path " +
                                            folderPath
                                        );
                                        console.log(
                                            "Original image dimentions: " +
                                            imageSource.height +
                                            " x " +
                                            imageSource.width
                                        );
                                        filePath = path.join(folderPath, fileName);
                                        let newasset = new imageAssetModule.ImageAsset(result);

                                    ImageSource
                                        .fromAsset(newasset)
                                        .then(newimageSource => {
                                        saved = newimageSource.saveToFile(
                                            filePath,
                                            "jpeg"
                                        );
                                        if (saved) {
                                            if(args== 1){
                                                that.photoOne = filePath
                                            }else if(args == 2){
                                                that.photoTwo = filePath
                                            }
                                            console.log(
                                            "Resized image imensions: " +
                                                newimageSource.height +
                                                " x " +
                                                newimageSource.width
                                            );
                                        } else {
                                            console.log(
                                            "Error! Unable to save image to local file for saving"
                                            );
                                        }
                                        loader.hide();
                                        });
                                    }
                                );
                            } catch (e) {
                                console.log("err: " + e);
                                console.log("stack: " + e.stack);
                            }
                        } else if (isAndroid) {
                            try {
                            var downsampleOptions = new android.graphics.BitmapFactory.Options();
                            downsampleOptions.inSampleSize = this.getSampleSize(
                                imageAsset.android,
                                { maxWidth: newwidth, maxHeight: newheight }
                            );
                            var bitmap = android.graphics.BitmapFactory.decodeFile(
                                imageAsset.android,
                                downsampleOptions
                            );
                            imageSource.setNativeSource(bitmap);

                            let filename =  `${this.generateUUID()}.jpg`;
                            let folder = fileSystemModule.knownFolders.documents();
                            let fullpath = fileSystemModule.path.join(folder.path, filename);
                            let saved = imageSource.saveToFile(fullpath, "jpeg");

                            if (saved) {

                                if(args == 1){
                                    this.photoOne = fullpath
                                }else if(args == 2){
                                    this.photoTwo = fullpath
                                }
                                console.log(
                                "Resized image imensions: " +
                                    imageSource.height +
                                    " x " +
                                    imageSource.width
                                );
                            } else {
                                console.log(
                                "Error! Unable to save image to local file for saving"
                                );
                            }
                            loader.hide();
                            } catch (err) {
                            console.log(err);
                            loader.hide();
                            }
                        }
                        } else {
                        let saved = false;
                        let filePath = "";
                        const folderPath = knownFolders.documents().path;
                        let fileName =
                            this.$store.state.profile.id +
                            "-" +
                            new Date().getTime() +
                            ".jpg";
                        console.log(
                            "saving image " + fileName + " to path " + folderPath
                        );
                        filePath = path.join(folderPath, fileName);
                        saved = imageSource.saveToFile(filePath, "jpeg");

                        if (saved) {
                            if(args == 1){
                                this.photoOne = filePath
                            }else if(args == 2){
                                this.photoTwo = filePath
                            }
                        } else {
                            console.log(
                            "Error! Unable to save image to local file for saving"
                            );
                        }
                        loader.hide();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        loader.hide();
                    });
                })
                .catch(err => {
                    console.log(err);
                    loader.hide();
                });
            } catch (err) {
                alert("Please select a valid image.");
                console.log(err);
                loader.hide();
            }
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
                remoteFullPath: 'users/' + this.uid + '/' + fotoId + '.jpg',
                localFullPath: args,
                onProgress: (status) => {
                    console.log("Uploaded fraction: " + status.fractionCompleted);
                    console.log("Percentage complete: " + status.percentageCompleted);

                    this.percent = status.percentageCompleted
                },
                metadata
              }).then((uploadedFile) => {
                    let arrayPhotos = []

                    firebase.storage.getDownloadUrl({
                        remoteFullPath: 'users/' + this.uid + '/' + fotoId + '.jpg'
                    }).then(async (url) => {

                        let data = {
                            photo: url,
                            user: this.uid,
                            control: this.controlPhotos
                        }

                        arrayPhotos.push(url)

                        let response = await firebase.firestore.collection('user_photos').add(data)
                        this.controlUploadPhotos()
                    }).catch(error => {
                        console.log(error);
                        loader.hide()
                    })
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

                    this.$store.commit('updateUser', user)

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