<template>
    <Page actionBarHidden="true">
        <GridLayout rows="*" columns="*" backgroundColor="#F2CBC2">
            <ScrollView row="0" col="0" width="100%">
                <WrapLayout orientation="horizontal" marginTop="5" id="grid">
                    <FlexboxLayout width="100%" justifyContent="center" alignItems="center">
                        <Label fontSize="25" color="black" marginTop="15" marginBottom="10" text="Contrato" textWrap="true" />
                        
                    </FlexboxLayout>

                    <StackLayout padding="10">
                        <!-- <PDFView width="100%" height="800" src="https://firebasestorage.googleapis.com/v0/b/repartidores-524ed.appspot.com/o/pdfs%2FCONTRATO%20DE%20PRESTACION%20DE%20SERVICIOS%20FASSST.pdf?alt=media&token=e8938d47-1099-4613-a7cb-602a9047926b"></PDFView> -->
                        <WebView width="100%" height="2400" src="https://drive.google.com/file/d/15vrumCc4XE-G9_QjkF4MBXFblcsb_QxB/view?usp=sharing" />
                    </StackLayout>
                    
                    <DrawingPad
                    backgroundColor="white"
                        borderWidth="0 0 2 0"
                        borderColor="black"
                        ref="DrawingPad"
                        height="300"
                        id="drawingPad"
                        penColor="#000000"
                        penWidth="3"
                        >
                    </DrawingPad>

                    <FlexboxLayout width="100%" marginTop="10" marginBottom="10" justifyContent="center" alignItems="center" flexDirection="column">
                        <Button width="90%" fontSize="16" height="40" backgroundColor="#F24464" borderRadius="10" text="Borrar firma" color="white" @tap="clearMyDrawing" />
                    </FlexboxLayout>

                    <GridLayout rows="*" columns="2*, *">
                        <StackLayout row="0" col="0">
                            <FlexboxLayout width="90%" marginTop="10" marginBottom="10" justifyContent="center" alignItems="center" flexDirection="column">
                                <Button width="90%" fontSize="16" height="40" backgroundColor="#F24464" color="white" borderRadius="10" text="Continuar" @tap="signDraw" />
                            </FlexboxLayout>
                        </StackLayout>
                        <StackLayout row="0" col="1">
                            <FlexboxLayout width="100%" marginTop="10" marginBottom="10" justifyContent="center" alignItems="center" flexDirection="column">
                                <Button width="90%" fontSize="16" height="40" backgroundColor="black" borderRadius="10" text="Salir" color="white" @tap="singOut" />
                            </FlexboxLayout>
                        </StackLayout>
                    </GridLayout>

                    <!-- <FlexboxLayout width="100%" marginTop="10" marginBottom="10" justifyContent="center" alignItems="center" flexDirection="column">
                        <Button width="90%" fontSize="16" height="40" backgroundColor="#F24464" borderRadius="10" text="Continuar" color="white" @tap="signDraw" />
                    </FlexboxLayout> -->
                    
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

//Moment
const moment = require('moment')

import { Image } from "ui/image";
import { ImageSource } from "image-source";

const fileSystemModule = require("tns-core-modules/file-system");

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
    props: ['type'],

    data(){
        return{
            uid: '',
            isChecked: false,

            pathImage: '',
        }
    },

    filters: {
        formatDate(date){
            moment.locale('es')
            
            return moment(date).format('LT')
        }
    },

    computed: {
        ...mapState([
            'user'
        ])
    },

    methods: {
        clearMyDrawing(args){
            let pad = this.$refs.DrawingPad.nativeView
            pad.clearDrawing();
        },

        async signDraw(){
            // get reference to the drawing pad
            const pad = this.$refs.DrawingPad.nativeView

            // then get the drawing (Bitmap on Android) of the drawingpad
            pad.getDrawing().then(
                data => {
                    console.log(data);

                    confirm({
                        title: "¿Has terminado?",
                        message: "Aceptas que has leído el contrato y estas de acuerdo.",
                        okButtonText: "Aceptar",
                        cancelButtonText: "Cancelar"
                    }).then(async result => {
                        if (result) {
                            this.sign = data;

                            var img2 = new ImageSource(data)

                            var folder = fileSystemModule.knownFolders.documents();
                            var path = fileSystemModule.path.join(folder.path, "sing.png");
                            var saved = img2.saveToFile(path, "png");
                            console.log("saved: " + saved);
                            console.log("IMAGEN SRC.....", path);
                            this.pathImage = path
                            // return
                            
                            this.uid = this.user.uid

                            loader.show(options)

                            this.savePhotos(this.pathImage)
                        }
                    }); 
                    
                },
                err => {
                    console.log(err);
                    alert({
                        name: "Falta una firma",
                        message: "Debes firmar el contrato para continuar.",
                        okButtonText: "Entendido"
                    }).then(() => {
                        console.log("Alert dialog closed")
                    });
                }
            );
            
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
            console.log('Save photos');
            if(args == ''){
                alert({
                    name: "Falta una firma",
                    message: "Debes firmar el contrato para continuar.",
                    okButtonText: "Entendido"
                }).then(() => {
                    console.log("Alert dialog closed")
                });

                return
            }

            try{
                let metadata = {
                    contentType: "image/jpeg",
                    contentLanguage: "es",
                }

                let fotoId = this.generateUUID()
                firebase.storage.uploadFile({
                remoteFullPath: 'signs/' + this.user.uid + '/' + fotoId + '.jpg',
                localFullPath: args,
                onProgress: (status) => {
                    console.log("Uploaded fraction: " + status.fractionCompleted);
                    console.log("Percentage complete: " + status.percentageCompleted);
                },
                metadata
              }).then((uploadedFile) => {
                    let arrayPhotos = []

                    firebase.storage.getDownloadUrl({
                        remoteFullPath: 'signs/' + this.user.uid + '/' + fotoId + '.jpg'
                    }).then(async (url) => {

                        let data = {
                            photo: url,
                            user: this.uid
                        }

                        arrayPhotos.push(url)

                        let response = await firebase.firestore.collection('sign_photos').add(data)
                        this.goToHome()
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
                    remoteFullPath: 'signs/' + photoID + '.jpg'
                }).then(async (url) => {

                        let data = {
                            photo: url,
                            user: this.uid
                        }

                        arrayPhotos.push(url)

                        let response = await firebase.firestore.collection('sign_photos').add(data)
                        this.goToHome()
                    },
                    (error) => {
                        loader.hide()
                        console.log("Error 2: " + error);
                    }
                );
   
            }, 8000);
 
        },

        async goToHome(){
            try {
                loader.hide()
                let response = await firebase.firestore.collection('users')
                                            .doc(this.user.uid)
                                            .update({ contract: true })

                this.$navigator.navigate('/home', { clearHistory: true })
            } catch (error) {
                console.log(error)
            }
        },

        singOut(){
            this.$emit('closeModal')
            firebase.logout()
            this.$navigator.navigate('/login', { clearHistory: true })
        }
    }
}
</script>