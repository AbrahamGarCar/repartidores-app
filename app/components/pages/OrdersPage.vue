<style>
    .gradient{
        background: linear-gradient(45deg, #BF3952, #F24464);
    }
</style>

<template>
    <Page actionBarHidden="true">
        <GridLayout rows="*" columns="*">
            <ScrollView row="0" col="0" backgroundColor="white">
                <WrapLayout orientation="vertical" width="100%">
                    <GridLayout rows="120, *" columns="*" height="100%">
                        <FlexboxLayout class="gradient" row="0" col="0" justifyContent="space-between" alignItems="flex-start" padding="10" borderRadius="0 0 20 20">
                            <Label padding="10" class="font-awesome" fontSize="20" color="white" text="" textWrap="true" @tap="goToHome" />
                            <Label fontSize="22" color="white" marginTop="2" text="Pedidos pendientes" textWrap="true" />
                            <Label text="" textWrap="true" />
                        </FlexboxLayout>

                        <StackLayout row="1" col="0" marginTop="-55">
                            <StackLayout width="95%" marginBottom="35" v-for="(item, index) in orders" :key="index" marginTop="10" v-shadow="20" backgroundColor="white" padding="10" borderRadius="5">
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

                                <GridLayout rows="auto" columns="*, *, *">
                                    <FlexboxLayout row="0" col="0" marginTop="15" justifyContent="center" alignItems="center" flexDirection="column">
                                        <Label fontWeight="bold" text="Costo:" textWrap="true" />
                                        
                                        <Label fontSize="20" :text="`$${item.cost}`" textWrap="true" />
                                        
                                    </FlexboxLayout>
                                    <FlexboxLayout row="0" col="1" marginTop="15" justifyContent="center" alignItems="center" flexDirection="column">
                                        <Label fontWeight="bold" text="Envío:" textWrap="true" />
                                        
                                        <Label fontSize="20" :text="`$${item.infoDestination.cost}`" textWrap="true" />
                                        
                                    </FlexboxLayout>
                                    <FlexboxLayout row="0" col="2" marginTop="15" justifyContent="center" alignItems="center" flexDirection="column">
                                        <Label fontWeight="bold" text="Total:" textWrap="true" />
                                        
                                        <Label fontSize="20" :text="`$${getTotal(item.cost, item.infoDestination.cost)}`" textWrap="true" />
                                        
                                    </FlexboxLayout>
                                </GridLayout>

                                

                                <FlexboxLayout justifyContent="center" alignItems="center">
                                    
                                    <Button v-if="order == null" marginTop="10" backgroundColor="#F24464" color="white" text="Aceptar pedido" @tap="updateOrderStatus(item)" />
                                    <Button v-else marginTop="10" backgroundColor="#F2CBC2" color="white" text="Orden en progreso" disabled />
                                    
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

            order: null,
        }
    },

    mounted() {
        this.getOrder()
        this.getOrders()
    },

    computed: {
        ...mapState([
                'user'
            ]),
    },

    methods: {
        getTotal(cost, delivery){
            return Number(cost) + Number(delivery)
        },
        
        async getOrders(){
            try {
                console.log('dale')
                let response = await firebase.firestore.collection('orders')
                                                    .where('listDeliveryMen', 'array-contains', this.user.uid)
                                                    .where('level', '==', 2)
                                                    .where('status', '==', 'PENDIENTE')
                                                    .onSnapshot(query => {
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
                // this.$store.commit('updateOrders', this.orders)

                console.log('dalee 2')
            } catch (error) {
                console.log(error)
            }
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
                                                        })
                                                    })

            } catch (error) {
                console.log(error)
            }
        },

        async updateOrderStatus(order){
            try {
                console.log(order)

                confirm({
                    title: "Aceptar pedido",
                    message: "¿Quieres aceptar este pedido?",
                    okButtonText: "Aceptar",
                    cancelButtonText: "Cancelar"
                }).then(async result => {
                    if (result) {
                        let response = await firebase.firestore.collection('orders')
                                                    .doc(order.id)
                                                    .update({ status: 'ACEPTADA', deliveryMan: this.user.uid, flag: 1 })

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