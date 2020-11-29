<template>
    <Page actionBarHidden="true">
        <GridLayout rows="*" columns="*" backgroundColor="#F2CBC2">
            <ScrollView row="0" col="0" width="100%">
                <WrapLayout orientation="horizontal" marginTop="5" id="grid">
                    <FlexboxLayout width="100%" justifyContent="center" alignItems="center">
                        <Label fontSize="25" color="black" marginTop="15" marginBottom="10" text="Contrato" textWrap="true" />
                        
                    </FlexboxLayout>

                    <StackLayout padding="10">
                        <TextJustify 
                            textColor="black"
                            textSize="15"
                            textAlignment="true"
                            :text="terms">
                        </TextJustify>
                    </StackLayout>
                    
                    <DrawingPad
                        ref="DrawingPad"
                        height="400"
                        id="drawingPad"
                        penColor="#000000"
                        penWidth="3"
                        >
                    </DrawingPad>

                    <FlexboxLayout width="100%" marginTop="10" marginBottom="10" justifyContent="center" alignItems="center" flexDirection="column">
                        <Button width="90%" fontSize="16" height="40" backgroundColor="#F24464" borderRadius="10" text="Borrar firma" color="white" @tap="clearMyDrawing" />
                    </FlexboxLayout>

                    <FlexboxLayout width="100%" marginTop="10" marginBottom="10" justifyContent="center" alignItems="center" flexDirection="column">
                        <Button width="90%" fontSize="16" height="40" backgroundColor="#F24464" borderRadius="10" text="Continuar" color="white" @tap="signDraw" />
                    </FlexboxLayout>
                    
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
import { required, maxLength } from 'vuelidate/lib/validators'

//Toast
import * as Toast from 'nativescript-toast'

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
            terms: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas suscipit ipsum nec enim mollis scelerisque. Praesent gravida augue ut tristique tincidunt. Nam augue diam, tincidunt non eros eget, ultricies eleifend nunc. Vivamus molestie lectus sed quam tempor, at sagittis odio venenatis. Nunc aliquet ipsum at porta fringilla. Proin justo purus, venenatis sed odio quis, elementum faucibus nunc. Nam auctor orci vitae leo dapibus consectetur. Cras ligula purus, convallis vitae mauris eu, lacinia convallis quam. Maecenas nec ipsum sagittis, hendrerit velit sit amet, tempor diam. Pellentesque hendrerit eget sem sit amet convallis. Sed luctus nulla nisl, in viverra ex rutrum id. Donec vel libero nulla. In lorem nulla, sagittis ut urna a, tincidunt placerat dolor. Maecenas porttitor et massa id rhoncus. Vestibulum aliquam, odio in ullamcorper venenatis, lacus lectus dignissim dolor, id maximus mauris nulla at enim. Mauris dui augue, porta et scelerisque ac, iaculis sit amet risus.

Donec ac ex quis augue sollicitudin cursus. Curabitur quis nisi vel odio porttitor elementum. Nullam laoreet at erat non venenatis. Curabitur a purus pretium, tincidunt urna id, accumsan dui. Phasellus lectus felis, pharetra eu elementum id, sagittis ac turpis. Proin molestie est dui, consequat aliquet odio iaculis non. Sed in bibendum ipsum. Nam a sodales leo. Praesent vel euismod nulla, sed consequat mi. Integer ac vestibulum odio. Pellentesque tristique urna id urna ornare, ac ultrices ligula porttitor. Cras eu diam ut ipsum facilisis aliquam. Maecenas turpis elit, viverra in suscipit at, mollis id arcu. Quisque in elit mi.

Vestibulum sed justo dictum, scelerisque quam id, vestibulum lorem. In elementum magna eget mi auctor laoreet. Morbi quam nibh, euismod et tempor eget, maximus eu elit. Fusce commodo faucibus elit, at sodales nunc tincidunt eu. Proin fermentum dapibus orci, ut feugiat ipsum. Aenean tempor libero mauris, eget sodales ante sagittis eu. Nullam ultrices rutrum lacus vel faucibus. Cras ut maximus leo. Quisque a felis condimentum, convallis ex vitae, luctus metus. Fusce quis dignissim velit. Aliquam consequat neque a quam dictum, et mollis massa rutrum.

Nam a felis urna. Vestibulum aliquet dolor egestas, accumsan tellus ut, convallis ex. Aliquam a semper justo, venenatis ornare est. Integer in libero et enim suscipit luctus quis id est. Proin non erat consequat, viverra lectus consectetur, tincidunt dui. Praesent facilisis egestas arcu nec eleifend. Praesent et nibh aliquam, viverra lacus vel, mattis odio. Cras ultricies, orci vitae scelerisque dapibus, eros lectus laoreet lacus, ac aliquet lectus quam ac ex. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam finibus sollicitudin ultrices. Etiam viverra nunc blandit augue iaculis, ut commodo erat sodales. Maecenas leo nisl, egestas a purus vel, imperdiet auctor odio. Vivamus vel consectetur ex. Nulla cursus porta arcu, vitae sodales tellus.

Suspendisse potenti. Fusce sed maximus libero, at cursus ex. Morbi vitae dolor eleifend, viverra mauris vitae, blandit leo. Mauris egestas purus vitae consectetur sagittis. Nulla lacinia augue at nibh tristique facilisis sed at dolor. Nulla molestie felis vitae mauris fermentum, a aliquam urna eleifend. Aliquam id risus dolor. Maecenas posuere tellus ut urna feugiat dapibus. Suspendisse sollicitudin nulla quis justo tempus tempor. Nunc ac mi et arcu suscipit elementum id viverra metus.


            `,

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
                        message: "Aceptas que has leido el contrato y estas de acuerdo.",
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
                remoteFullPath: 'signs/' + fotoId + '.jpg',
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
        }
    }
}
</script>