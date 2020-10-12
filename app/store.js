import Vue from 'vue';
import Vuex from 'vuex';

//Firebase
const firebase = require("nativescript-plugin-firebase")

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        token: null,
        ubication: { 
            latitude: 0, 
            longitude: 0 
        },
    },

    mutations: {
        updateUser(state, payload){
            state.user = payload
        },
        updateEditUser(state, payload){
            state.user.range = (payload.range * 1000)
            state.user.name = payload.name
            state.user.email = payload.email
        },

        updateUserPhoto(state, payload){
            state.user.photo = payload
        },

        updateServiceProvider(state, payload){
            state.user.serviceProvider = payload
        },

        updateUbication(state, payload){
            state.ubication.latitude = payload.latitude
            state.ubication.longitude = payload.longitude
        },

        updateToken(state, payload){
            state.token = payload
        },
    },
    
    actions: {
        async updateUserToken({context, state}, payload){
            try {
                console.log('Updateeeeeeeeed')
                let response = await firebase.firestore.collection('users')
                                                        .doc(payload.user)
                                                        .update({ token: state.token })
            } catch (error) {
                console.log(error)
            }
        }
    }
});