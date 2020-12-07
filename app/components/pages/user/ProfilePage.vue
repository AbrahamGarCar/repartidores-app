<style>
    .image-profile{
        background-position: center;
        background-size: cover;
    }

    .filter{
        background-color: black;
        opacity: 0.5;
    }
</style>

<template>
    <Page actionBarHidden="true" @loaded="navigatingTo($event)">
        <GridLayout rows="*" columns="*">
            <AbsoluteLayout class="image-profile" ref="page" id="page" row="0" col="0" :backgrounImage="photos[1].photo">
                
                <Image top="0" left="0" width="100%" height="100%" :src="photos[1].photo" stretch="aspectFill" />
                <StackLayout top="0" left="0" width="100%" height="100%" class="filter" />

                <!-- Ubication -->
                <FlexboxLayout v-shadow="12" justifyContent="center" alignItems="center" top="15" left="15" width="60" height="60" backgroundColor="white" borderRadius="100" @tap="goToHome">
                    <Label text="" class="font-awesome" fontSize="20" color="black" textWrap="true" />
                </FlexboxLayout>

                <GridLayout top="0" left="0" rows="*, *" columns="*" width="100%" height="100%">
                    <StackLayout row="1" col="0" padding="15">
                        <FlexboxLayout justifyContent="space-between" alignItems="center" flexDirection="column" width="100%" height="100%" row="0" col="0" backgroundColor="white" borderRadius="15">
                            <FlexboxLayout width="100%" justifyContent="center" alignItems="center" flexDirection="column">
                                <Image marginTop="15" borderRadius="100" width="80" height="80" :src="photos[0].photo" stretch="aspectFill" />
                                <Label fontSize="18" color="black" fontWeight="bold" textWrap="true">
                                    <FormattedString>
                                        <Span :text="user.name + ' '" />
                                        <Span v-if="user.lastName" :text="user.lastName + ' '" />
                                        <Span v-if="user.secondLastName" :text="user.secondLastName + ' '" />
                                    </FormattedString>
                                </Label>
                                <!-- <Label :text="user.name + ' ' + user.lastName" fontSize="18" color="black" fontWeight="bold" textWrap="true" /> -->
                            </FlexboxLayout>

                            <GridLayout rows="100" columns="*, *">
                                <FlexboxLayout justifyContent="center" alignItems="center" flexDirection="column" row="0" col="0">
                                    <Label v-if="infoUser != null" color="black" fontWeight="bold" fontSize="20" :text="infoUser.deliveredCount" textWrap="true" />
                                    <Label color="black" text="Entregadas" textWrap="true" />
                                    
                                </FlexboxLayout>
                                <FlexboxLayout justifyContent="center" alignItems="center" flexDirection="column" row="0" col="1">
                                    <Label v-if="infoUser != null" color="black" fontWeight="bold" fontSize="20" :text="infoUser.cancellationsCount" textWrap="true" />
                                    <Label color="black" text="Canceladas" textWrap="true" />
                                    
                                </FlexboxLayout>
                            </GridLayout>

                            <FlexboxLayout class="container" justifyContent="center" alignItems="center" width="100%" height="70" backgroundColor="#F2CBC2" borderRadius="0 0 15 15" @tap="logOut">
                                <Label text="SALIR" color="white" fontSize="18" fontWeight="bold" textWrap="true" />
                                
                            </FlexboxLayout>
                        </FlexboxLayout>
                    </StackLayout>
                </GridLayout>
            </AbsoluteLayout>
        </GridLayout>
    </Page>
</template>

<script>
import { query } from 'nativescript-plugin-firebase'
//Firebase
const firebase = require("nativescript-plugin-firebase")

//Vuex
import { mapState } from 'vuex'

export default {
    name: 'Logout',

    data(){
        return{
            infoUser: null,
        }
    },

    created() {
        this.getCancellations()

        this.orderPhotos()
    },

    computed: {
        ...mapState([
                'user',
                'photos'
            ]),
    },

    methods: {
        navigatingTo(args){
            const page = args.object.page
            
        },

        orderPhotos(){
            console.log('Daleee: ', this.photos);
        },

        async getCancellations(){
            try {
                let response = await firebase.firestore.collection('information_user')
                                                        .doc(this.user.uid)
                                                        .get()

                if (response) {
                    this.infoUser = response.data()
                }
                                                        
            } catch (error) {
                console.log(error)
            }
        },

        async getPhotos(){
            try {
                console.log('entraaa')
                let response = await firebase.firestore.collection('user_photos')
                                                        .where('user', '==', this.user.uid)
                                                        .get()
                                                        .then(query => {
                                                            this.photos = []
                                                            query.forEach(doc => {
                                                                console.log(doc.data())
                                                                this.photos.push(doc.data().photo)
                                                            })
                                                        })

                if (this.photos.length != 0) {
                    console.log('tiene algo');
                }
                
            } catch (error) {
                console.log(error)
            }
        },

        goToHome(){
            this.$navigator.navigate('/home', 
                {
                transition: 
                    {
                        name: 'slideLeft', 
                        duration: 500, 
                        curve: 'linear'
                    }
                })
        },

        logOut(){
            firebase.logout()
            this.$navigator.navigate('/login', { clearHistory: true })
        }
    },
}
</script>

