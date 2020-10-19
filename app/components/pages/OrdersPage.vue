<style>
    .gradient{
        background: linear-gradient(45deg, #BF3952, #F24464);
    }
</style>

<template>
    <Page actionBarHidden="true">
        <GridLayout rows="*" columns="*">
            <ScrollView row="0" col="0" backgroundColor="white">
                <WrapLayout orientation="vertical" width="100%" paddingBottom="20">
                    <GridLayout rows="120, *" columns="*">
                        <FlexboxLayout class="gradient" row="0" col="0" justifyContent="space-between" alignItems="flex-start" padding="10" borderRadius="0 0 20 20">
                            <Label padding="10" class="font-awesome" fontSize="20" color="white" text="" textWrap="true" @tap="goToHome" />
                            <Label fontSize="22" color="white" marginTop="2" text="Pedidos pendientes" textWrap="true" />
                            <Label text="" textWrap="true" />
                        </FlexboxLayout>

                        <StackLayout row="1" col="0" padding="10" marginTop="-55">
                            <StackLayout v-for="(item, index) in orders" :key="index" marginTop="10" v-shadow="20" backgroundColor="white" padding="10" width="100%" borderRadius="5">
                                <Label fontSize="22" :text="item.name" textWrap="true" />
                                <Label textWrap="true">
                                    <FormattedString>
                                        <Span fontSize="18" fontWeight="bold" text="Desde: " />
                                        <Span :text="item.directionOrigin" />
                                    </FormattedString>
                                </Label>
                                <FlexboxLayout justifyContent="center" alignItems="center">
                                    <Label margin="10 0" color="black" fontSize="20" class="font-awesome" text="" textWrap="true" />
                                    
                                </FlexboxLayout>
                                <Label textWrap="true">
                                    <FormattedString>
                                        <Span fontSize="18" fontWeight="bold" text="Hasta: " />
                                        <Span :text="item.directionDestination" />
                                    </FormattedString>
                                </Label>

                                <FlexboxLayout justifyContent="center" alignItems="center">
                                    
                                    <Button marginTop="10" borderRadius="5" backgroundColor="#BF3952" color="white" text="Aceptar pedido" @tap="updateOrderStatus(item)" />
                                    
                                </FlexboxLayout>
                            </StackLayout>
                        </StackLayout>
                    </GridLayout>
                </WrapLayout>
            </ScrollView>
        </GridLayout>
    </Page>
</template>

<script>
import { query } from 'nativescript-plugin-firebase'

//Firebase
const firebase = require("nativescript-plugin-firebase")

//Vuex
import { mapState } from 'vuex'

//Moment
let moment = require('moment')

export default {
    name: 'Orders',

    data(){
        return{
            orders: [],
        }
    },

    mounted() {
        this.getOrders()
    },

    computed: {
        ...mapState([
                'user'
            ]),
    },

    methods: {
        async getOrders(){
            try {
                console.log('dale')
                let response = await firebase.firestore.collection('orders')
                                                    
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

                                                            this.orders.push(order)

                                                            console.log(this.orders)
                                                        })
                                                    })

                console.log('dalee 2')
            } catch (error) {
                console.log(error)
            }
        },

        async updateOrderStatus(order){
            try {
                console.log(order)

                confirm({
                    title: "Aceptar pedido",
                    message: "¿Queres aceptar este pedido?",
                    okButtonText: "Aceptar",
                    cancelButtonText: "Cancelar"
                }).then(async result => {
                    if (result) {
                        let response = await firebase.firestore.collection('orders')
                                                    .doc(order.id)
                                                    .update({ status: 'ACEPTADA', deliveryMan: this.user.uid })

                        this.goToHome()
                    }
                });                
            
            

            } catch (error) {
                
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
        } 
    },
}
</script>