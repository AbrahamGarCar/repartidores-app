import Vue from 'nativescript-vue'
import App from './components/auth/Login'

import ModalLogin from './components/modals/ModalLogin'
import VueDevtools from 'nativescript-vue-devtools'

import { TextJustify } from "nativescript-text-justify";

import NSVueShadow from 'nativescript-vue-shadow'
Vue.use(NSVueShadow)

import DateTimePicker from "nativescript-datetimepicker/vue";
Vue.use(DateTimePicker);

//iOS or Android
import { isAndroid, isIOS } from "tns-core-modules/ui/page";

//Vuelidate
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

//Navigator
import Navigator from 'nativescript-vue-navigator'
import {routes} from './routes'
Vue.use(Navigator, { routes })

//Components
import Navbar from './components/pages/shared/NavbarComponent'
import Menu from './components/pages/shared/MenuComponent'

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
import store from './store'

if (isIOS) {
  GMSServices.provideAPIKey("AIzaSyDndG_C_5iRRkYDO3GHchQFNUchdBZvDas");
}

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

var firebase = require("nativescript-plugin-firebase")

firebase.init({

  //Push notifications
  showNotifications: true,
  showNotificationsWhenInForeground: true,

  onPushTokenReceivedCallback: (token) => {
      console.log('[Firebase] onPushTokenReceivedCallback:', { token })
      store.commit('updateToken', token)

      firebase.getCurrentUser()
              .then((user) => {
                store.dispatch('updateUserToken', {
                    user: user.uid,
                  })
              })
          .catch(error => console.log("Trouble in paradise: " + error));
  },

  onMessageReceivedCallback: (message) => {
      console.log('[Firebase] onMessageReceivedCallback:', { message })

  }
}).then(
  function() {
      console.log("firebase.init done")
  },
  function(error) {
      console.log("firebase.init error: " + error)
  }
)

Vue.registerElement(
  'RadSideDrawer',
  () => require('nativescript-ui-sidedrawer').RadSideDrawer
)
Vue.registerElement('MapView', ()=> require('nativescript-google-maps-sdk').MapView)
Vue.registerElement('MLKitBarcodeScanner', () => require('nativescript-plugin-firebase/mlkit/barcodescanning').MLKitBarcodeScanner)
Vue.registerElement('DropDown', () => require('nativescript-drop-down/drop-down').DropDown)
Vue.registerElement('TextJustify', () => require('nativescript-text-justify').TextJustify)
Vue.registerElement(
  'CheckBox',
  () => require('@nstudio/nativescript-checkbox').CheckBox,
  {
    model: {
      prop: 'checked',
      event: 'checkedChange'
    }
  }
);

Vue.component('Navbar', Navbar)
Vue.component('Menu', Menu)

new Vue({
  store,
  mounted(){
    firebase.getCurrentUser()
            .then(async (user) => {
                this.$showModal(ModalLogin)

                let response = await firebase.firestore.collection('users')
                                                    .doc(user.uid)
                                                    .get()

                if(response.exists){
                    let user = response.data()

                    if (user.role == 'Admin') {
                        this.$store.commit('updateUser', user)
                        this.$navigator.navigate('/scaner', { clearHistory: true })
                    }else{
                      if (!user.completeProfile) {
                          this.$store.commit('updateUser', user)
                          this.$navigator.navigate('/complete-profile', { clearHistory: true })
                      } else {
                          if(user.terms){
                              this.$store.commit('updateUser', user)
                              this.$navigator.navigate('/home', { clearHistory: true })
                          }else{
                              this.$store.commit('updateUser', user)
                              this.$navigator.navigate('/terms', { clearHistory: true })
                          }
                      }
                    }
                    
                }
            })
        .catch(error => console.log("Trouble in paradise: " + error));
},
render: h => h('Navigator', { attrs: { defaultRoute: '/login' } })
}).$start()