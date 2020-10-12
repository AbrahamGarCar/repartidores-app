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
        background-image: url('~/assets/images/waves.png');
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
        <GridLayout ~mainContent columns="*" rows="*" backgroundColor="#F3F3F3">
            <AbsoluteLayout row="0" col="0">
                <StackLayout id="grid" class="box-1" top="0" left="0" width="100%" height="100%">
                    <MapView
                        borderRadius="10"
                        width="100%"
                        height="100%"
                        :zoom="zoom"
                        :latitude="origin.latitude"
                        :longitude="origin.longitude"
                        v-if="allowExecution"
                        @mapReady="mapReady"
                        @markerSelect="locationSelected($event)"
                    />
                </StackLayout>

                <!-- Profile -->
                <FlexboxLayout v-shadow="12" justifyContent="center" alignItems="center" top="5" left="5" width="60" height="60" backgroundColor="white" borderRadius="100" @tap="goToProfile">
                    <Label text="" class="font-awesome" fontSize="20" color="black" textWrap="true" />
                </FlexboxLayout>

                <!-- Notifications -->
                <FlexboxLayout v-shadow="12" justifyContent="center" alignItems="center" top="5" :left="width - 65" width="60" height="60" backgroundColor="white" borderRadius="100">
                    <Label text="" class="font-awesome" fontSize="20" color="black" textWrap="true" />
                </FlexboxLayout>
                    <!-- Notifications number -->
                    <FlexboxLayout v-shadow="13" justifyContent="center" alignItems="center" top="50" :left="width - 25" width="20" height="20" backgroundColor="red" borderRadius="100">
                        <Label text="2" class="font-awesome" fontSize="10" color="white" textWrap="true" />
                    </FlexboxLayout>
            </AbsoluteLayout>
            
            <StackLayout id="box-2" ref="box2" class="box-2" row="0" col="0" backgroundColor="#F2CBC2">
                <GridLayout rows="50, *" columns="*">
                    <FlexboxLayout justifyContent="center" alignItems="center" row="0" col="0"  @swipe="swipeBox2">
                        <Label class="font-awesome" text="" color="#F24464" fontSize="25" textWrap="true" />
                    </FlexboxLayout>
                    <ScrollView row="1" col="0" backgroundColor="white">
                        <WrapLayout orientation="vertical" width="90%" paddingBottom="20">
                            <StackLayout>
                                <TextView class="details" margin="0" editable="false" :text="journeyDetails"/>
                            </StackLayout>
                        </WrapLayout>
                    </ScrollView>
                </GridLayout>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
//Firebase
const firebase = require("nativescript-plugin-firebase")

//Vuex
import { mapState } from 'vuex'

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

export default {
    name: 'Home',

    data(){
        return{
            width: 0,
            height: '',

            origin: { 
                latitude: 28.7186667, 
                longitude: -106.145014 
            },
            destination: { 
                latitude: 28.7281124, 
                longitude: -106.1194358
            },
            journeyDetails: 'Journey: Not started yet!',
            allowExecution: false,
            journeyStarted: false,
            mapView: null,
            zoom: 17,
            marker: null,
            ubication: null,
            APIKEY: 'AIzaSyDndG_C_5iRRkYDO3GHchQFNUchdBZvDas',
        }
    },

    mixins: [ 
        MapsHelper.MapsUIHelper, 
        MapsHelper.DirectionsAPIHelper, 
        MapsHelper.DistanceMatrixAPIHelper, 
        MapsHelper.LocationHelper 
    ],

    created(){
        this.setDestination()

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
            ]),

    },

    methods: {
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
            try {
                this.destination.latitude = '28.6941922'
                this.destination.longitude = '-106.1209962'  
            } catch(e) {
                // statements
                console.log(e);
            }
        },

        //Actions MAP
        mapReady(args) {
            /* get the mapView instance */
            this.mapView = args.object;
            this.mapView.settings.scrollGesturesEnabled = true
            this.mapView.settings.zoomGesturesEnabled = true
            
            /* turn on my location button on map */
            this.enableMyLocationButton(true);
            /* add destination marker to map */
            this.addMarkerToMap(this.destinationMarker, true);
            /* add my location marker to map (which will point to our location when journey starts) - visibility hidden  */
            this.addMarkerToMap(this.myLocationMarker, false);
            /* set map origin coordinates to present device location */
            this.fetchMyLocation();
            this.startJourney();
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
            /* hide my location indicator and button */
            this.enableMyLocationButton(false);
            /* un-hide my location marker */
            this.myLocationMarker.visible = true;
            /* update journey details */
            this.journeyStarted = true;
            this.journeyDetails = "Journey started...";
            /* start watching for location changes and update the map and journey details accordingly */
            this.watchLocationAndUpdateJourney();

            const marker = new Marker()
            marker.position = Position.positionFromLatLng(this.destination.latitude, this.destination.longitude)
            marker.title = 'Destino'
            marker.snippet = "Este es el destino"
            marker.userData = {index: 1};
            (this.mapView).addMarker(marker);
        },

        endJourney() {
            /* stop watching for location changes */
            this.clearWatch();
            /* remove the route drawn on map */
            this.clearRoute();
            /* hide my location marker  */
            this.myLocationMarker.visible = false;
            /* bring back my location button on screen */
            this.enableMyLocationButton(true);
            /* update journey details */
            this.journeyStarted = false;
            this.journeyDetails = "Destination Reached.";
        },

        navigatingTo(args){
            const page = args.object.page
            const box = page.getViewById('box-2')
            const grid = page.getViewById('grid')
            const pulse = page.getViewById('pulse-special')

            setTimeout(() => {
                console.log('Este es el tamaño: ' + grid.getActualSize().width)
                this.width = grid.getActualSize().width
                this.height = grid.getActualSize().width
            }, 500)   

            box.animate({
                translate: {
                    x: 0,
                    y: platformModule.screen.mainScreen.heightDIPs - 74
                },
                curve: AnimationCurve.easeIn,
                duration: 100,
            })

        },
        
        swipeBox2(args){
            const page = args.object.page
            const box = page.getViewById('box-2')
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
                        y: platformModule.screen.mainScreen.heightDIPs - 74
                    },
                    curve: AnimationCurve.easeIn,
                    duration: 400,
                })
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

        goToPhone(){
            console.log('Hola Mundo')
            const phoneNumber = '200-48-10'

            TNSPhone.requestCallPermission('You should accept the permission to be able to make a direct phone call.')
                .then(() => TNSPhone.dial(phoneNumber, false))
                .catch(() => TNSPhone.dial(phoneNumber, true))
        },
    }
}
</script>