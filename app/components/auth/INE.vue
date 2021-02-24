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

                        <StackLayout row="1" col="0">
                            <StackLayout width="90%">
                                <Label textAlignment="center" text="Ya casi estamos, solo requerimos una foto de tu INE por ambos lados." textWrap="true" />
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
                                    <Label text="INE Frente" textWrap="true" />
                                    
                                </FlexboxLayout>
                                <FlexboxLayout row="0" col="1" justifyContent="center" alignItems="center" flexDirection="column">
                                    <Label text="INE Reverso" textWrap="true" />
                                    
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

                            <GridLayout rows="*" columns="2*, *">
                                <StackLayout row="0" col="0">
                                    <FlexboxLayout width="90%" marginTop="10" marginBottom="10" justifyContent="center" alignItems="center" flexDirection="column">
                                        <Button width="100%" fontSize="16" height="40" backgroundColor="#F24464" color="white" borderRadius="10" text="Cargar fotos" @tap="createUser" />
                                    </FlexboxLayout>
                                </StackLayout>
                                <StackLayout row="0" col="1">
                                    <FlexboxLayout width="100%" marginTop="10" marginBottom="10" justifyContent="center" alignItems="center" flexDirection="column">
                                        <Button width="95%" fontSize="16" height="40" backgroundColor="black" borderRadius="10" text="Salir" color="white" @tap="singOut" />
                                    </FlexboxLayout>
                                </StackLayout>
                            </GridLayout>

                            <!-- <FlexboxLayout width="90%" marginTop="10" marginBottom="10" justifyContent="center" alignItems="center" flexDirection="column">
                                <Button width="100%" fontSize="16" height="40" backgroundColor="#F24464" color="white" marginTop="10" borderRadius="10" text="Cargar fotos" @tap="createUser" />
                            </FlexboxLayout> -->

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

const fileSystemModule = require("tns-core-modules/file-system");
import { Image } from "ui/image";
import { ImageSource } from 'tns-core-modules/image-source'

import { isAndroid, isIOS, device, screen } from "tns-core-modules/platform";

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
            width: 0,
            height: '',

            uid: '',

            controlPhotos: 1,

            pathPhotos: [],

            photoOne: null,
            photoTwo: null,

            percent: 0,

            isAndroid: true,
        }
    },

    computed: {
        ...mapState([
            'user'
        ]),
    },

    methods: {

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

        async onNavigatedTo(args){
            const page = args.object.page
            const grid = page.getViewById('grid')

            setTimeout(() => {
                console.log('Este es el tamaño: ' + grid.getActualSize().width)
                this.width = grid.getActualSize().width / 2
                this.height = grid.getActualSize().width / 2
            }, 500)   
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

            try {
                loader.show(options)

                this.uid = this.user.uid
                this.controlUploadPhotos()
            } catch(e) {
                loader.hide()
                console.log(e);
            }
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
                remoteFullPath: 'ine/' + this.uid + '/' + fotoId + '.jpg',
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
                        remoteFullPath: 'ine/' + this.uid + '/' + fotoId + '.jpg'
                    }).then(async (url) => {

                        let data = {
                            photo: url,
                            user: this.uid
                        }

                        arrayPhotos.push(url)

                        let response = await firebase.firestore.collection('ine_photos').add(data)
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
                    remoteFullPath: 'ine/' + photoID + '.jpg'
                }).then(async (url) => {

                        let data = {
                            photo: url,
                            user: this.uid
                        }

                        arrayPhotos.push(url)

                        let response = await firebase.firestore.collection('ine_photos').add(data)
                        if(response){

                            photoID = `${args}_400x400`

                            firebase.storage.getDownloadUrl({
                                remoteFullPath: 'ine/' + photoID + '.jpg'
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
                
                let response = await firebase.firestore.collection('users').doc(this.uid).update({ INE: true })

                this.$navigator.navigate('/terms', { clearHistory: true })

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
        },

        singOut(){
            this.$emit('closeModal')
            firebase.logout()
            this.$navigator.navigate('/login', { clearHistory: true })
        }
    }
}
</script>