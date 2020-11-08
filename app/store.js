import Vue from 'vue';
import Vuex from 'vuex';

//Firebase
const firebase = require("nativescript-plugin-firebase")

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        token: null,

        photos: [],

        orders: [],

        ubication: { 
            latitude: 0, 
            longitude: 0 
        },
    },

    mutations: {
        updateUser(state, payload){
            state.user = payload
        },

        updateUbication(state, payload){
            state.ubication.latitude = payload.latitude
            state.ubication.longitude = payload.longitude
        },

        updateToken(state, payload){
            state.token = payload
        },

        updateOrders(state, payload){
            state.orders = payload
        },

        updatePhotos(state, payload){
            state.photos = payload
        }
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
        },

        async getPhotos({commit, state}, payload){
            try {
                let photos = []
                let response = await firebase.firestore.collection('user_photos')
                                                        .where('user', '==', payload.user)
                                                        .get()
                                                        .then(query => {
                                                            query.forEach(doc => {
                                                                console.log(doc.data())
                                                                photos.push(doc.data().photo)
                                                            })
                                                        })
                                                        
                commit('updatePhotos', photos)
            } catch (error) {
                console.log(error)
            }
        },
    }
});