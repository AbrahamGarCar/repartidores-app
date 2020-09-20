<style scoped>
    .box-1{
        background-image: url('~/assets/images/bg-1.png');
        background-position: center top;
        background-size: cover;
        background-repeat: no-repeat;
    }

    .bg-color{
        background-color: rgba(128, 145, 107, 0.7);
    }
</style>

<template>
    <Page actionBarHidden="true">
        <GridLayout class="box-1" columns="*" rows="*" backgroundColor="#F3F3F3">
            <ScrollView col="0" row="0">
                <WrapLayout orientation="vertical" width="90%" paddingBottom="20">
                    <FlexboxLayout justifyContent="center" alignItems="center" flexDirection="column">
                        <Label text="Escaner" textWrap="true" />
                        <Button text="" class="font-awesome" backgroundColor="#3883FB" marginTop="10" color="white" @tap="camera = !camera" width="100%" />
                    </FlexboxLayout>

                    <FlexboxLayout justifyContent="center" alignItems="center" flexDirection="column">
                        <MLKitBarcodeScanner
                                v-if="camera"
                                width="260"
                                height="380"
                                beepOnScan="true"
                                formats="QR_CODE, EAN_8, EAN_13"
                                preferFrontCamera="false"
                                supportInverseBarcodes="false"
                                @scanResult="getQRResult($event)">
                            </MLKitBarcodeScanner>

                            <Label :text="uid" textWrap="true" fontSize="25" horizontalAlignment="center" />
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

//Camera firebase
import { BarcodeFormat, MLKitScanBarcodesOnDeviceResult } from "nativescript-plugin-firebase/mlkit/barcodescanning";

//iOS or Android
import { isAndroid, isIOS } from "tns-core-modules/ui/page";

export default {
    name: 'Scaner',

    data(){
        return{
            camera: false,
            uid: '',
        }
    },

    mounted(){
        
    },

    filters: {
        formatDate(date){
            moment.locale('es')
            
            return moment(date).format('LL')
        }
    },

    computed: {
        ...mapState([
            'user'
        ])
    },

    methods: {
        //Lector QR
        getQRResult(args){
            if(args.value.barcodes[0] != undefined){
                console.log(args.value.barcodes[0].value)
                this.uid = args.value.barcodes[0].value
                this.camera = false
            }

        },
    }
}
</script>