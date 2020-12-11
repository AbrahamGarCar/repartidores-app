<style scoped>
    
</style>

<template>
    <Page actionBarHidden="true">
        <GridLayout rows="*" columns="*">
            <ScrollView row="0" col="0" backgroundColor="white" scrollBarIndicatorVisible="false">
                <WrapLayout orientation="vertical" width="100%">
                    <GridLayout rows="120, *" columns="*" height="100%">
                        <FlexboxLayout class="gradient" row="0" col="0" justifyContent="space-between" alignItems="flex-start" padding="10" borderRadius="0 0 20 20">
                            <Label v-if="view == 1" padding="10" class="font-awesome" fontSize="20" color="white" text="" textWrap="true" @tap="goToHome" />
                            <Label v-else padding="10" class="font-awesome" fontSize="20" color="white" text="" textWrap="true" @tap="view = 1" />
                            <Label fontSize="22" color="white" marginTop="2" text="Historial" textWrap="true" />
                            <Label padding="10" class="font-awesome" fontSize="20" color="white" text="" textWrap="true" @tap="goToHome" />
                        </FlexboxLayout>

                        <FlexboxLayout v-if="view == 1" marginTop="15" row="1" col="0" justifyContent="center" alignItems="center" flexDirection="column">
                            <Label fontSize="20" text="Fecha de inicio" textWrap="true" />
                            <DatePicker fontSize="13" v-model="dateRange.startDate" />

                            <Label fontSize="20" text="Fecha de fin" textWrap="true" />
                            <DatePicker fontSize="13" v-model="dateRange.endDate" />

                            <StackLayout width="90%" marginTop="15">
                                <Button borderRadius="5" backgroundColor="#BF3952" color="white" width="100%" text="Buscar" @tap="getOrders" />    
                            </StackLayout>
                        </FlexboxLayout>
                        <StackLayout width="90%" v-else marginTop="15" row="1" col="0">
                            <Label fontSize="22" text="Ganancias:" textWrap="true" />
                            <Label fontSize="25" fontWeight="bold" :text="`$${totalAmount}`" textWrap="true" />
                            
                            <Label textWrap="true">
                                <FormattedString>
                                    <Span :text="dateRange.startDate | formatDate2" />
                                    <span text=" - " />
                                    <Span :text="dateRange.endDate | formatDate2" />
                                </FormattedString>
                            </Label>

                            <GridLayout marginTop="10" borderWidth="1" borderColor="black" rows="auto" columns="*, auto" v-for="(item, index) in orders" :key="index">
                                <FlexboxLayout marginTop="5" justifyContent="center" alignItems="flex-start" flexDirection="column" row="0" col="0">
                                    <Label marginLeft="5" fontSize="18" color="black" :text="item.name" textWrap="true" />
                                    
                                    <Label marginLeft="5" fontSize="12" :text="item.orderDate | formatDate" textWrap="true" />
                                    
                                </FlexboxLayout>                               
                                <FlexboxLayout marginTop="17" marginRight="10" justifyContent="center" alignItems="center" row="0" col="1">
                                    <Label :text="`$${item.infoDestination.cost}`" textWrap="true" />
                                    
                                </FlexboxLayout>                               
                                <!-- <FlexboxLayout justifyContent="center" alignItems="center" row="0" col="2">
                                    <Button width="100%" class="font-awesome" backgroundColor="blue" color="white" text="" @tap="viewDetails" />
                                    
                                </FlexboxLayout>                                -->
                            </GridLayout>
                        </StackLayout>
                    </GridLayout>
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

export default {
    name: 'History',

    data(){
        return{
            dateRange: {
                startDate: new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate()),
                endDate: new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate())
            },
            view: 1,
            orders: [],
        }
    },

    mounted(){
        // this.getOrders()
    },

    filters: {
        formatDate(date){
            moment.locale('es')
            
            return moment(date).format('LL')
        },

        formatDate2(date){
            moment.locale('es')
            
            return moment(date).format('L')
        }
    },

    computed: {
        ...mapState([
            'user'
        ]),

        totalAmount(){
            if (this.orders.length != 0) {

                var totalAmount = this.orders.reduce((sum, value) => (typeof value.infoDestination.cost == "number" ? sum + value.infoDestination.cost : sum), 0);
                return totalAmount
            }
            
        }
    },

    methods: {
        async viewDetails(){

        },

        async getOrders(){
            try {
                this.view = 2

                this.orders = []

                let date1 = new Date(this.dateRange.startDate)
                let date2 = new Date(this.dateRange.endDate)

                console.log(date1);
                console.log(date2);

                let response = await firebase.firestore.collection('orders')
                                        .where('status', '==', 'FINALIZADO')
                                        .where('deliveryMan', '==', this.user.uid)
                                        .where('orderDate', '>=', date1)
                                        .where('orderDate', '<=', date2)
                                        .get()
                                        .then(query => {
                                            query.forEach(async doc => {
                                                let data = doc.data()



                                                this.orders.push(data)
                                            });
                                        })
            } catch (error) {
                console.log(error);
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
    }
}
</script>