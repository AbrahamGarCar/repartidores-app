<style scoped>
    Label{
        color: black;
    }

    .under-line{
        border-width: 0 0 4px 0;
        border-color: black;
        width: 80%;
        text-align: center;
    }

    .box-1{
        background-position: center;
        background-size: cover;
    }

    .box-2{
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
    }

    .bgColorBlue{
        background-color: #2F4095;
    }

    .bgColorGray{
        background-color: #E65B50;
    }

    .pulse-1, .pulse-2{
        width: 100px;
        height: 100px;
        background-color: white;
        border-radius: 500%;
        margin-left: -10px;
    }

    .pulse-special{
        width: 100px;
        height: 100px;
        background-color: white;
        border-radius: 500%;
        margin-left: -10px;
    }
    
</style>

<template>
    <Page actionBarHidden="true" @loaded="navigatingTo($event)">
        <GridLayout ~mainContent columns="*" rows="*" backgroundColor="#F3F3F3" v-if="user.active">
            <AbsoluteLayout row="0" col="0" id="grid">
                <StackLayout class="box-1" top="0" left="0" width="100%" height="100%">
                    <MapView
                        borderRadius="10"
                        width="100%"
                        height="100%"
                        :zoom="zoom"
                        :latitude="origin.latitude"
                        :longitude="origin.longitude"
                        v-if="allowExecution"
                        @mapReady="mapReady"
                    />
                </StackLayout>

                <!-- Ubication -->
                <FlexboxLayout v-shadow="12" justifyContent="center" alignItems="center" top="15" left="15" width="60" height="60" backgroundColor="white" borderRadius="100" @tap="updateUbication">
                    <Label text="" class="font-awesome" fontSize="20" color="black" textWrap="true" />
                </FlexboxLayout>

                <!-- Notifications -->
                <FlexboxLayout v-shadow="12" justifyContent="center" alignItems="center" top="15" :left="width - 75" width="60" height="60" backgroundColor="white" borderRadius="100" @tap="goToOrders">
                    <Label text="" class="font-awesome" fontSize="20" color="black" textWrap="true" />
                </FlexboxLayout>
                    <!-- Notifications number -->
                    <FlexboxLayout v-shadow="13" justifyContent="center" alignItems="center" top="60" :left="width - 35" width="20" height="20" backgroundColor="red" borderRadius="100">
                        <Label :text="orders.length" class="font-awesome" fontSize="10" color="white" textWrap="true" />
                    </FlexboxLayout>
            </AbsoluteLayout>
            
            <StackLayout v-shadow="20" id="box-2" ref="box2" class="box-2" row="0" col="0" backgroundColor="#F2CBC2">
                <GridLayout rows="50, *" columns="*">
                    <FlexboxLayout id="swiper" justifyContent="center" alignItems="center" row="0" col="0"  @swipe="swipeBox2">
                        <Label class="font-awesome" text="" color="#BF3952" fontSize="25" textWrap="true" />
                    </FlexboxLayout>
                    <ScrollView row="1" col="0" backgroundColor="white">
                        <WrapLayout orientation="vertical" width="90%" paddingBottom="20">
                            <StackLayout>

                                <!-- Perfil, historial, configuracion etc... -->
                                <GridLayout rows="*" columns="*, *, *, *" marginTop="20">
                                    <FlexboxLayout id="binnie" padding="5" row="0" col="0" width="100%" :height="height2" justifyContent="center" alignItems="center">
                                        <FlexboxLayout justifyContent="center" alignItems="center" width="100%" height="100%" backgroundColor="#BF3952" borderRadius="5" @tap="goToProfile">
                                            <Label text="" class="font-awesome" fontSize="25" color="white" textWrap="true" />
                                        </FlexboxLayout>
                                        
                                    </FlexboxLayout>
                                    <FlexboxLayout id="binnie" padding="5" row="0" col="1" width="100%" :height="height2" justifyContent="center" alignItems="center">
                                        <FlexboxLayout justifyContent="center" alignItems="center" width="100%" height="100%" backgroundColor="#BF3952" borderRadius="5" @tap="goToHistory">
                                            <Label color="white" class="font-awesome" fontSize="25" text="" textWrap="true" />
                                        </FlexboxLayout>
                                        
                                    </FlexboxLayout>
                                    <FlexboxLayout id="binnie" padding="5" row="0" col="2" width="100%" :height="height2" justifyContent="center" alignItems="center">
                                        <FlexboxLayout justifyContent="center" alignItems="center" width="100%" height="100%" backgroundColor="#BF3952" borderRadius="5" @tap="goToPhone">
                                            <Label color="white" class="font-awesome" fontSize="22" text="" textWrap="true" />
                                        </FlexboxLayout>
                                        
                                    </FlexboxLayout>
                                    <FlexboxLayout id="binnie" padding="5" row="0" col="3" width="100%" :height="height2" justifyContent="center" alignItems="center">
                                        <FlexboxLayout justifyContent="center" alignItems="center" width="100%" height="100%" backgroundColor="#BF3952" borderRadius="5" @tap="goToConfiguration">
                                            <Label color="white" class="font-awesome" fontSize="22" text="" textWrap="true" />
                                        </FlexboxLayout>
                                        
                                    </FlexboxLayout>
                                </GridLayout>

                                <FlexboxLayout v-if="order != null" justifyContent="center" alignItems="center" marginTop="15">
                                    <Label fontSize="24" fontWeight="bold" :text="`#${order.orderNumber}`" textWrap="true" />
                                    <!-- <Button text="Mostrar en google maps" @tap="goToGoogleMaps" /> -->
                                </FlexboxLayout>

                                <!-- Informacion de longitud y tiempos de llegada -->
                                <StackLayout padding="10" v-if="order != null" marginTop="10">
                                    <Label fontSize="19" textWrap="true">
                                        <FormattedString>
                                            <Span fontSize="19" fontWeight="bold" text="El destino esta a " />
                                            <Span :text="journeyDetails[0]" />
                                        </FormattedString>
                                    </Label>
                                    <Label fontSize="19" textWrap="true">
                                        <FormattedString>
                                            <Span fontSize="19" fontWeight="bold" text="Tiempo aproximado de llegada " />
                                            <Span :text="journeyDetails[1]" />
                                        </FormattedString>
                                    </Label>
                                </StackLayout>
                                <FlexboxLayout v-else justifyContent="center" alignItems="center" flexDirection="column">
                                    <Image src="~/assets/images/no-order.png" width="100%" stretch="aspectFit" verticalAlignment="center" horizontalAlignment="center" />
                                    <Label fontSize="22" text="No hay ningún viaje en curso" textWrap="true" />
                                </FlexboxLayout>

                                <!-- Informacion de la orden, destino, aceptar y cancelar -->
                                <StackLayout v-if="order != null" marginTop="10" backgroundColor="white" padding="10" width="100%" borderRadius="5">
                                    <Label fontSize="22" :text="order.name" textWrap="true" />
                                    <Label textWrap="true">
                                        <FormattedString>
                                            <Span fontSize="19" fontWeight="bold" text="Desde: " />
                                            <Span :text="order.directionOrigin" />
                                        </FormattedString>
                                    </Label>
                                    <FlexboxLayout justifyContent="center" alignItems="center">
                                        <Label margin="10 0" color="black" fontSize="20" class="font-awesome" text="" textWrap="true" />
                                        
                                    </FlexboxLayout>
                                    <Label textWrap="true">
                                        <FormattedString>
                                            <Span fontSize="19" fontWeight="bold" text="Hasta: " />
                                            <Span :text="order.directionDestination" />
                                        </FormattedString>
                                    </Label>

                                    <GridLayout marginTop="15" rows="auto" columns="*, *, *">
                                        <FlexboxLayout row="0" col="0" marginTop="15" justifyContent="center" alignItems="center" flexDirection="column">
                                            <Label fontWeight="bold" text="Envío:" textWrap="true" />
                                            
                                            <Label fontSize="20" :text="`$${order.infoDestination.cost}`" textWrap="true" />
                                            
                                        </FlexboxLayout>
                                        <FlexboxLayout row="0" col="1" marginTop="15" justifyContent="center" alignItems="center" flexDirection="column">
                                            <Label fontWeight="bold" text="Costo:" textWrap="true" />
                                            
                                            <Label fontSize="20" :text="`$${Number(order.cost) - Number(order.infoDestination.costRestaurant)}`" textWrap="true" />
                                            
                                        </FlexboxLayout>
                                        <FlexboxLayout row="0" col="2" marginTop="15" justifyContent="center" alignItems="center" flexDirection="column">
                                            <Label fontWeight="bold" text="Total:" textWrap="true" />
                                            
                                            <Label fontSize="20" :text="`$${getTotal(order.cost, order.infoDestination.costClient)}`" textWrap="true" />
                                            
                                        </FlexboxLayout>
                                    </GridLayout>
                                    <GridLayout marginTop="15" v-if="order.flag == 1" rows="50" columns="*, 10, 50, 10, 50">
                                        <StackLayout row="0" col="0">
                                            <Button width="100%" borderRadius="5" backgroundColor="#BF3952" color="white" text="Comenzar entrega" @tap="startDelivery" />
                                        </StackLayout>
                                        <Label row="0" col="1" textWrap="true" />
                                        <FlexboxLayout justifyContent="center" alignItems="center" row="0" col="2">
                                            <Button width="100%" borderRadius="5" class="font-awesome" backgroundColor="blue" color="white" text="" @tap="goToGoogleMaps" />
                                        </FlexboxLayout>
                                        <Label row="0" col="3" textWrap="true" />
                                        <FlexboxLayout justifyContent="center" alignItems="center" row="0" col="4">
                                            <Button width="100%" borderRadius="5" class="font-awesome" backgroundColor="red" color="white" text="" @tap="cancelOrder" />
                                        </FlexboxLayout>
                                    </GridLayout>
                                    <GridLayout v-else rows="50" columns="*, 10, 50" marginTop="10">
                                        <StackLayout row="0" col="0">
                                            <Button width="100%" borderRadius="5" backgroundColor="#BF3952" color="white" text="Finalizar entrega" @tap="updateOrderStatus" />
                                        </StackLayout>
                                        <Label row="0" col="1" textWrap="true" />
                                        <FlexboxLayout justifyContent="center" alignItems="center" row="0" col="2">
                                            <Button width="100%" borderRadius="5" class="font-awesome" backgroundColor="blue" color="white" text="" @tap="goToGoogleMaps" />
                                        </FlexboxLayout>
                                        
                                    </GridLayout>

                                    
                                </StackLayout>
                                
                                <StackLayout marginTop="15" borderWidth="1" borderColor="black" />

                                <StackLayout v-if="order != null" marginTop="15" backgroundColor="white" padding="10" width="100%" borderRadius="5">
                                    <Label textWrap="true">
                                        <FormattedString>
                                            <Span fontSize="19" fontWeight="bold" text="Numero de contacto: " />
                                            <Span :text="order.details.telephone" />
                                        </FormattedString>
                                    </Label>
                                    <Label marginTop="15" textWrap="true">
                                        <FormattedString>
                                            <Span fontSize="19" fontWeight="bold" text="Detalles: " />
                                            <Span :text="order.details.reference" />
                                        </FormattedString>
                                    </Label>
                                </StackLayout>

                                <Button v-if="order != null" backgroundColor="#be4bdb" color="white" marginTop="15" width="100%" class="font-awesome" text="" fontSize="22" @tap="goToPhoneClient(order.details.telephone)" />
                                
                            </StackLayout>
                        </WrapLayout>
                    </ScrollView>
                </GridLayout>
            </StackLayout>
        </GridLayout>
        <FlexboxLayout width="95%" height="100%" v-else justifyContent="center" alignItems="center" flexDirection="column">
            <Image src="~/assets/images/no-order.png" width="100%" stretch="aspectFit" verticalAlignment="center" horizontalAlignment="center" />
            <Label fontSize="22" textAlignment="center" text="Tu cuenta se encuentra suspendida, ponte en contacto al siguiente numero para mas información: " textWrap="true" />
            <Label fontSize="22" text="6141265003" textWrap="true" @tap="goToPhone" />

            <FlexboxLayout class="container" justifyContent="center" alignItems="center" width="100%" height="70" backgroundColor="#F2CBC2" borderRadius="15 15 15 15" @tap="logOut">
                <Label text="SALIR" color="white" fontSize="18" fontWeight="bold" textWrap="true" />
                
            </FlexboxLayout>
            
        </FlexboxLayout>
    </Page>
</template>

<script>
//Firebase
const firebase = require("nativescript-plugin-firebase")

//Vuex
import { mapState } from 'vuex'

//Utils
const utilsModule = require("tns-core-modules/utils/utils");

//Geolocation
import * as geolocation from 'nativescript-geolocation'
import { Accuracy } from 'tns-core-modules/ui/enums'

//HTTP
const httpModule = require("tns-core-modules/http");

//Moment
let moment = require('moment')

//MAP 
import { Position, Marker, Polyline, Bounds } from "nativescript-google-maps-sdk";
import * as decodePolyline from "decode-google-map-polyline";

//Telephone
import * as TNSPhone from 'nativescript-phone'

import { AnimationCurve } from "tns-core-modules/ui/enums";

//Platform
const platformModule = require("tns-core-modules/platform");
import * as permissions from 'nativescript-permissions'

//Mixins
import MapsHelper from "../../MapsHelper.js"

//Loader
const LoadingIndicator = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const Mode = require('@nstudio/nativescript-loading-indicator').Mode;
const loader = new LoadingIndicator();

const dialogs = require('tns-core-modules/ui/dialogs')

import { Image } from "ui/image";
import { ImageSource } from "image-source";

const options = {
    message: 'Cargando...',
    details: 'Recuperando informacion',
    progress: 0.65,
    margin: 10,
    dimBackground: true,
    color: '#4B9ED6', // color of indicator and labels
    // background box around indicator
    // hideBezel will override this if true
    backgroundColor: 'white',
    userInteractionEnabled: false, // default true. Set false so that the touches will fall through it.
    hideBezel: true, // default false, can hide the surrounding bezel
    mode: Mode.AnnularDeterminate, // see options below
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

import OptionSheet from '../pages/bottom-sheet/OptionSheet'

export default {
    name: 'Home',

    data(){
        return{
            width: 0,
            height: '',
            height2: '',

            orders: [],

            origin: { 
                latitude: 28.7186667, 
                longitude: -106.145014 
            },
            destination: { 
                latitude: 0, 
                longitude: 0
            },
            journeyDetails: [],
            allowExecution: false,
            journeyStarted: false,
            mapView: null,
            zoom: 14,
            marker: null,
            ubication: null,
            APIKEY: 'AIzaSyDndG_C_5iRRkYDO3GHchQFNUchdBZvDas',

            order: null,
            flag: 2,

            breakTime: false,
            watchId: '',
            saveUbicationVar: '',
        }
    },

    mixins: [ 
        MapsHelper.MapsUIHelper, 
        MapsHelper.DirectionsAPIHelper, 
        MapsHelper.DistanceMatrixAPIHelper, 
        MapsHelper.LocationHelper 
    ],

    created(){
        this.getOrder()

         /* dont run the android permissions routine for iOS */
        if (platformModule.isIOS) {
            this.allowExecution = true
            return
        }
        /* list of permissions needed */
        let permissionsNeeded = [
            android.Manifest.permission.ACCESS_FINE_LOCATION,
            android.Manifest.permission.ACCESS_COARSE_LOCATION
        ]
        /* showing up permissions dialog */
        permissions
            .requestPermissions(permissionsNeeded, "Give it to me!")
            .then(() => this.allowExecution = true)
            .catch(() => this.allowExecution = false)
    },

    mounted(){
        this.getLocation()
        this.getOrders()
    },

    filters: {
        formatDate(date){
            moment.locale('es')
            
            return moment(date).format('LL')
        }
    },

    computed: {
        ...mapState([
                'user',
            ]),

    },

    watch: {
        'origin.latitude': function (newVal, oldVal) {
            let number_1 = this.truncarNumbers(oldVal, 3)
            let number_2 = this.truncarNumbers(newVal, 3)
            console.log(number_1)
            console.log(number_2)
            if(number_1 != number_2){
                if(this.breakTime){
                    clearTimeout(this.saveUbicationVar)
                    this.breakTime = false
                }
                this.getNewUbication()
            }
        },

        'origin.longitude': function (newVal, oldVal) {
            let number_1 = this.truncarNumbers(oldVal, 3)
            let number_2 = this.truncarNumbers(newVal, 3)
            console.log(number_1)
            console.log(number_2)
            if(number_1 != number_2){
                if(this.breakTime){
                    clearTimeout(this.saveUbicationVar)
                    this.breakTime = false
                }
                this.getNewUbication()
            }
        },
    },

    methods: {

        goToPhoneClient(number){
            console.log(number)
            const phoneNumber = number

            TNSPhone.requestCallPermission('Debes aceptar los permisos para poder hacer llamadas.')
                .then(() => TNSPhone.dial(phoneNumber, false))
                .catch(() => TNSPhone.dial(phoneNumber, true))
        },

        //Truncar numeros
        truncarNumbers(x, posiciones = 0) {
            var s = x.toString()
            var l = s.length
            var decimalLength = s.indexOf('.') + 1
            if (l - decimalLength <= posiciones){
                return x
            }
            // Parte decimal del número
            var isNeg  = x < 0
            var decimal =  x % 1
            var entera  = isNeg ? Math.ceil(x) : Math.floor(x)
            // Parte decimal como número entero
            // Ejemplo: parte decimal = 0.77
            // decimalFormated = 0.77 * (10^posiciones)
            // si posiciones es 2 ==> 0.77 * 100
            // si posiciones es 3 ==> 0.77 * 1000
            var decimalFormated = Math.floor(
                Math.abs(decimal) * Math.pow(10, posiciones)
            )
            // Sustraemos del número original la parte decimal
            // y le sumamos la parte decimal que hemos formateado
            var finalNum = entera + 
                ((decimalFormated / Math.pow(10, posiciones))*(isNeg ? -1 : 1))
            
            return finalNum
        },

        //Iniciamos un contador de 60 segundos, despues de eso obtenemos la posicion actual
        getNewUbication(){
            console.log('Entra para actualizar');
            this.breakTime = true
            this.saveUbicationVar = setTimeout(() => {
                //Obtenemos la ubicacion
                this.getLocation()
                
            }, 2000)
        },

        async saveUbication(){
            this.breakTime = false
            return

            try {                
                if (this.order != null) {
                    if (this.order.flag != 1) {
                        let response = await firebase.firestore.collection('orders')
                                                    .doc(this.order.id)
                                                    .update({ route: firebase.firestore.FieldValue.arrayUnion(this.origin) })
                
                        this.breakTime = false

                        console.log('Se guardo la ubicacion');
                    }
                }
                
            } catch (error) {
                console.log(error)
            }
        },

        getTotal(cost, delivery){
            return Number(cost) + Number(delivery)
        },

        goToGoogleMaps(){
            utilsModule.openUrl(`https://www.google.com/maps/dir//${this.destination.latitude},${this.destination.longitude}/@${this.destination.latitude},${this.destination.longitude}`)
        },

        navigatingTo(args){

            if (this.user.active) {
                const page = args.object.page
                const box = page.getViewById('box-2')
                const swiper = page.getViewById('swiper')

                const grid = page.getViewById('grid')

                const binnie = page.getViewById('binnie')

                setTimeout(() => {
                    console.log('Este es el tamaño: ' + grid.getActualSize().height)
                    console.log('Este es el tamaño 2: ' + platformModule.screen.mainScreen.heightDIPs)
                    console.log('Este es el tamaño 3: ' + platformModule.screen.mainScreen.heightPixels)
                    console.log('Tamaño swiper: ' + swiper.getActualSize().height)
                    this.width = grid.getActualSize().width
                    this.height = grid.getActualSize().width

                    this.height2 = binnie.getActualSize().width

                    box.animate({
                        translate: {
                            x: 0,
                            y: grid.getActualSize().height - swiper.getActualSize().height
                        },
                        curve: AnimationCurve.easeIn,
                        duration: 100,
                    })
                }, 500) 
            }
              
        },
        
        swipeBox2(args){
            if (this.user.active) {
                const page = args.object.page
                const box = page.getViewById('box-2')
                const grid = page.getViewById('grid')
                const swiper = page.getViewById('swiper')

                if (args.direction == 4) {
                    box.animate({
                        translate: {
                            x: 0,
                            y: 0
                        },
                        curve: AnimationCurve.easeIn,
                        duration: 400,
                    })
                }

                if (args.direction == 8) {
                    box.animate({
                        translate: {
                            x: 0,
                            y: grid.getActualSize().height - swiper.getActualSize().height
                        },
                        curve: AnimationCurve.easeIn,
                        duration: 400,
                    })
                }
            }
        },

        async getOrders(){
            try {
                this.orders = []

                console.log('dale')
                let response = await firebase.firestore.collection('orders')
                                                    .where('listDeliveryMen', 'array-contains', this.user.uid)
                                                    .where('level', '==', 2)
                                                    .where('status', '==', 'PENDIENTE')
                                                    .get()
                                                    .then(query => {
                                                        this.orders = []
                                                        
                                                        query.forEach(doc => {
                                                            
                                                            let order = doc.data()

                                                            Object.defineProperty(order, 'id', {
                                                                enumerable: true,
                                                                configurable: true,
                                                                writable: true,
                                                                value: doc.id
                                                            });

                                                            this.orders.push(order)

                                                            console.log(this.orders)
                                                        })
                                                    })

                console.log('dalee 2')
            } catch (error) {
                console.log(error)
            }
        },
        
        async updateUbication(){
            try {

                let response = await firebase.firestore.collection('users')
                                                        .doc(this.user.uid)
                                                        .update({ _geoloc: { lat: this.origin.latitude, lng: this.origin.longitude } })
                                                        .then(() => {
                                                            alert({
                                                                title: "Aviso",
                                                                message: "Ubicación actualizada",
                                                                okButtonText: "Entendido"
                                                            }).then(() => {
                                                                console.log("Alert dialog closed");
                                                            });
                                                        })
            } catch (error) {
                console.log(error)
            }
        },

        //Geolocalizacion
        getLocation(){
            geolocation.getCurrentLocation({
                desiredAccuracy: Accuracy.high,
                maximumAge: 5000,
                timeout: 10000
            }).then((location) => {
                if (location) {
                    this.origin.latitude = location.latitude
                    this.origin.longitude = location.longitude

                    this.saveUbication()
                    this.watchLocation()
                }
            }, (e) => {
                console.log(e);
            })
        },

        async watchLocation(){
            try {
                this.watchId = await geolocation.watchLocation(
                loc => {
                    if (loc) {
                        this.origin.latitude = loc.latitude
                        this.origin.longitude = loc.longitude
                        this.$store.commit('updateUbication', this.origin)
                    }
                },
                e => {
                    console.log(e)
                    alert(ErrorFormatter(e))
                },
                {
                    desiredAccuracy: Accuracy.HIGH,
                    updateDistance: 1,
                    updateTime: 3000,
                    minimumUpdateTime: 100
                }
                )
            } catch (ex) {
                console.log(ex)
                alert(ErrorFormatter(ex))
            }
        },

        setDestination(){
            console.log(1)
            try {
                if (this.order != null) {
                    if (this.order.flag == 1) {

                        this.destination.latitude = this.order.origin.latitude
                        this.destination.longitude = this.order.origin.longitude

                        this.startJourney();
                    } else {

                        this.destination.latitude = this.order.destination.latitude
                        this.destination.longitude = this.order.destination.longitude
                        // this.clearRoute()
                        this.startJourney();
                    }
                }
                  
            } catch(e) {
                // statements
                console.log(e);
            }
        },

        //Actions MAP
        mapReady(args) {
            console.log(2)
            /* get the mapView instance */
            this.mapView = args.object;
            this.mapView.settings.scrollGesturesEnabled = true
            this.mapView.settings.zoomGesturesEnabled = true

            let imgMarker = "~/assets/images/marker3.png"

            const imageSource = ImageSource.fromFileSync(imgMarker);
            

            const icon2 = new Image();
            icon2.imageSource = imageSource;
            icon2.width = 10;
            icon2.height = 10;
            
            
            /* turn on my location button on map */
            this.enableMyLocationButton(true);
            /* add destination marker to map */
            this.addMarkerToMap(this.destinationMarker, true, icon2);
            /* add my location marker to map (which will point to our location when journey starts) - visibility hidden  */
            this.addMarkerToMap(this.myLocationMarker, false, icon2);
            /* set map origin coordinates to present device location */
            this.fetchMyLocation();
            this.startJourney()
        },

        locationSelected(args) {
            console.log(args)       
        },

        getDirections() {
            /* hit Directions API - as origin and destination coordinates are set */
            this.hitDirectionsAPI().then(response => {
            /* draw route from encoded polyline points */
            this.drawRoute(response.encodedPolylinePoints);
            
            //if jouney started, don't adjust the camera 
            if (this.journeyStarted)
              return;
            /* adjust camera to bring route into view */
                this.getRouteInView(
                    response.northEastBounds,
                    response.southWestBounds
                );
            });            
        },

        clearRoute() {
            /* remove route drawn between locations on map */
            this.mapView.removeAllPolylines();
        },

        startJourney() {
            console.log(3)
            /* hide my location indicator and button */
            this.enableMyLocationButton(false);
            /* un-hide my location marker */
            this.myLocationMarker.visible = true;
            /* update journey details */
            this.journeyStarted = true;
            this.journeyDetails = "Journey started...";
            /* start watching for location changes and update the map and journey details accordingly */
            this.watchLocationAndUpdateJourney();

            let imgMarker = "~/assets/images/marker3.png"

            const imageSource = ImageSource.fromFileSync(imgMarker);
            

            const icon2 = new Image();
            icon2.imageSource = imageSource;
            icon2.width = 10;
            icon2.height = 10;

            const marker = new Marker()
            marker.position = Position.positionFromLatLng(this.destination.latitude, this.destination.longitude)
            marker.title = 'Destino'
            marker.snippet = "Este es el destino"
            marker.userData = {index: 1};

            (this.mapView).addMarker(marker);
        },

        endJourney() {
            /* stop watching for location changes */
            // this.clearWatch();
            this.mapView.removeAllMarkers();
            /* remove the route drawn on map */
            this.clearRoute();
            /* hide my location marker  */
            this.myLocationMarker.visible = true;
            /* bring back my location button on screen */
            this.enableMyLocationButton(true);
            /* update journey details */
            this.journeyStarted = false;
            this.journeyDetails = "Destination Reached.";
        },

        async getOrder(){
            try {
                let response = await firebase.firestore.collection('orders')
                                                    .where('status', '==', 'ACEPTADA')
                                                    .where('deliveryMan', '==', this.user.uid)
                                                    .get()
                                                    .then(query => {
                                                        query.forEach(doc => {
                                                            
                                                            let order = doc.data()

                                                            Object.defineProperty(order, 'id', {
                                                                enumerable: true,
                                                                configurable: true,
                                                                writable: true,
                                                                value: doc.id
                                                            });

                                                            this.order = order

                                                            if (this.order != null) {
                                                                console.log(0)
                                                                this.setDestination()
                                                            }
                                                        })
                                                    })

            } catch (error) {
                console.log(error)
            }
        },

        startDelivery(){
            // const options = {

            // };
            // this.$showBottomSheet(OptionSheet, options)

            // return
            try {
                console.log(this.order)

                confirm({
                    title: "Comenzar entrega",
                    message: "¿Quieres comenzar la entrega?",
                    okButtonText: "Aceptar",
                    cancelButtonText: "Cancelar"
                }).then(async result => {
                    if (result) {
                        let response = await firebase.firestore.collection('orders')
                                                    .doc(this.order.id)
                                                    .update({ flag: 2, process: 3})

                        this.clearRoute()

                        this.order.flag = 2

                        this.setDestination()

                        this.getLocation()
                    }
                });                

            } catch (error) {
                
            }
        },

        async updateOrderStatus(){
            try {
                console.log(this.order)

                confirm({
                    title: "Finalizar entrega",
                    message: "¿Quieres finalizar este entrega?",
                    okButtonText: "Aceptar",
                    cancelButtonText: "Cancelar"
                }).then(async result => {
                    if (result) {
                        let response = await firebase.firestore.collection('orders')
                                                    .doc(this.order.id)
                                                    .update({ status: 'FINALIZADO', process: 4})

                        let delivered = await firebase.firestore.collection('information_user')
                                                    .doc(this.user.uid)
                                                    .collection('delivered')
                                                    .doc(this.order.id)
                                                    .set({ order: this.order.id })
                        this.order = null

                        this.destination.latitude = 0
                        this.destination.longitude = 0

                        this.endJourney()
                        this.clearRoute()
                    }
                });                
            


            } catch (error) {
                
            }
        },

        cancelOrder(){
            prompt({
                title: "Cancelar entrega",
                message: "¿Realmente quieres cancelar esta entrega? Escribe el motivo.",
                okButtonText: "Si",
                cancelButtonText: "No",
                defaultText: "Motivo: ",
                inputType: dialogs.inputType.text
            }).then(result => {
                console.log(result.result)
                if (result.result) {
                    
                    this.cancelOrderUpdate(result.text)
                }
            });
        },

        async cancelOrderUpdate(txt = 'Sin motivo'){
            try {
                let newList = this.order.listDeliveryMen.filter(document => document != this.user.uid)

                console.log('Esta es la lista: ', newList);

                let orderID = this.order.id

                let response = await firebase.firestore.collection('orders')
                                                .doc(this.order.id)
                                                .update({ status: 'PENDIENTE', deliveryMan: null, flag: 0, listDeliveryMen: newList })
                                                .then(query => {
                                                    this.order = null

                                                    this.destination.latitude = 0
                                                    this.destination.longitude = 0

                                                    this.endJourney()
                                                    this.clearRoute()
                                                })

                this.makeReportCancelation(txt, orderID)
                this.getUsersNotification(newList)                        
            } catch (error) {
                console.log(error)
            }
        },

        async makeReportCancelation(txt = 'Sin motivo', orderID){
            try {
                let response = await firebase.firestore.collection('information_user')
                                                .doc(this.user.uid)
                                                .collection('orders')
                                                .add({ order: orderID, reason: txt })
                                                .then(query => {

                                                    alert({
                                                        title: "Orden cancelada",
                                                        message: "Se ha cancelado la orden",
                                                        okButtonText: "Entendido"
                                                    }).then(() => {
                                                        console.log("Alert dialog closed");
                                                    });
                                                })
            } catch (error) {
                console.log(error)
            }
        },

        async getUsersNotification(list){
            try {
                let arrayUsers = []
                let response = await firebase.firestore.collection('users')
                                        .where('uid', 'in', list)
                                        .get()
                                        .then(query => {
                                            query.forEach(doc => {
                                                arrayUsers.push(doc.data())
                                            })
                                        })

                console.log(arrayUsers)

                this.createNotifications(arrayUsers)
            } catch (error) {
                console.log(error)
            }
        },

        async createNotifications(users){
            try {
                let notificationCollection = firebase.firestore.collection('notifications')

                // Begin a new batch
                let batch = firebase.firestore.batch()

                // Set each document, as part of the batch
                users.forEach(document => {
                    let ref = notificationCollection.doc(document.token);
                    batch.set(ref, { title: 'Nueva orden', content: 'Hay una nueva orden disponible' })
                })

                // Commit the entire batch
                return batch.commit();
            } catch (error) {
                console.log(error)
            }
        },

        goToProfile(){
            this.$navigator.navigate('/profile', 
            {
            transition: 
                {
                    name: 'slideTop', 
                    duration: 500, 
                    curve: 'linear'
                }
            })
        },

        goToHistory(){
            this.$navigator.navigate('/history', 
            {
            transition: 
                {
                    name: 'slideTop', 
                    duration: 500, 
                    curve: 'linear'
                }
            })
        },

        goToOrders(){
            this.$navigator.navigate('/orders', 
            {
            transition: 
                {
                    name: 'slideRight', 
                    duration: 500, 
                    curve: 'linear'
                }
            })
        },

        goToConfiguration(){
            this.$navigator.navigate('/configuration', 
            {
            transition: 
                {
                    name: 'slideRight', 
                    duration: 500, 
                    curve: 'linear'
                }
            })
        },

        goToPhone(){
            console.log('Hola Mundo')
            const phoneNumber = '614-126-5003'

            TNSPhone.requestCallPermission('Debes aceptar los permisos para poder hacer llamadas.')
                .then(() => TNSPhone.dial(phoneNumber, false))
                .catch(() => TNSPhone.dial(phoneNumber, true))
        },

        logOut(){
            firebase.logout()
            this.$navigator.navigate('/login', { clearHistory: true })
        }
    }
}
</script>