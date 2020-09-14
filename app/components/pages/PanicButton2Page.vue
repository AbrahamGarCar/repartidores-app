<template>
    <Page actionBarHidden="true" @navigatedTo="onNavigatedTo($event)">
        <GridLayout class="box-1" rows="*" columns="*">
            <FlexboxLayout flexDirection="column" justifyContent="center" alignItems="center" row="0" col="0" id="grid" padding="10">
                <FlexboxLayout v-if="type == 1" :width="width" :height="height" class="bg-color" justifyContent="center" alignItems="center" flexDirection="column">
                    <Label color="white" class="font-awesome" fontSize="55" text="" textWrap="true" />
                    <Label color="white" marginTop="10" textAlignment="center" text="Ayuda solicitada" fontSize="16" textWrap="true" />
                    <Label color="white" textAlignment="center" :text="`en tu ubicacion a las`" fontSize="16" textWrap="true" />
                    <Label color="white" textAlignment="center" :text="date | formatDate" fontSize="16" textWrap="true" />
                    
                    
                    <Label color="white" marginTop="20" textAlignment="center" :text="`Hora aproximada de llegada:`" fontSize="16" textWrap="true" />
                    <Label color="white" textAlignment="center" :text="date | formatDate" fontSize="16" textWrap="true" />
                    
                </FlexboxLayout>

                <FlexboxLayout v-if="type == 2" :width="width" :height="height" class="bg-color" justifyContent="center" alignItems="center" flexDirection="column">
                    <Label color="white" class="font-awesome" fontSize="55" text="" textWrap="true" />
                    <Label color="white" marginTop="10" textAlignment="center" text="Asistencia medica solicitada" fontSize="16" textWrap="true" />
                    <Label color="white" textAlignment="center" :text="`en tu ubicacion a las`" fontSize="16" textWrap="true" />
                    <Label color="white" textAlignment="center" :text="date | formatDate" fontSize="16" textWrap="true" />
                    
                    
                    <Label color="white" marginTop="20" textAlignment="center" :text="`Hora aproximada de llegada:`" fontSize="16" textWrap="true" />
                    <Label color="white" textAlignment="center" :text="date | formatDate" fontSize="16" textWrap="true" />
                    
                </FlexboxLayout>

                <FlexboxLayout v-if="type == 3" :width="width" :height="height" class="bg-color" justifyContent="center" alignItems="center" flexDirection="column">
                    <Label color="white" class="font-awesome" fontSize="55" text="" textWrap="true" />
                    <Label color="white" marginTop="10" textAlignment="center" text="Ayuda solicitada" fontSize="16" textWrap="true" />
                    <Label color="white" textAlignment="center" :text="`en tu ubicacion a las`" fontSize="16" textWrap="true" />
                    <Label color="white" textAlignment="center" :text="date | formatDate" fontSize="16" textWrap="true" />
                    
                    
                    <Label color="white" marginTop="20" textAlignment="center" :text="`Hora aproximada de llegada:`" fontSize="16" textWrap="true" />
                    <Label color="white" textAlignment="center" :text="date | formatDate" fontSize="16" textWrap="true" />
                    
                </FlexboxLayout>

                <FlexboxLayout v-if="type == 4" :width="width" :height="height" class="bg-color" justifyContent="center" alignItems="center" flexDirection="column">
                    <Label color="white" class="font-awesome" fontSize="55" text="" textWrap="true" />
                    <Label color="white" marginTop="10" textAlignment="center" text="Ayuda solicitada" fontSize="16" textWrap="true" />
                    <Label color="white" textAlignment="center" :text="`en tu ubicacion a las`" fontSize="16" textWrap="true" />
                    <Label color="white" textAlignment="center" :text="date | formatDate" fontSize="16" textWrap="true" />
                    
                    
                    <Label color="white" marginTop="20" textAlignment="center" :text="`Hora aproximada de llegada:`" fontSize="16" textWrap="true" />
                    <Label color="white" textAlignment="center" :text="date | formatDate" fontSize="16" textWrap="true" />
                    
                </FlexboxLayout>

                <StackLayout marginTop="20">
                    <Button width="100%" class="bg-color" color="white" text="Regresar a Inicio" @tap="goToHome" />
                </StackLayout>
            </FlexboxLayout>
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
    props: ['type'],

    data(){
        return{
            width: 0,
            height: '',
            date: new Date(),
        }
    },

    filters: {
        formatDate(date){
            moment.locale('es')
            
            return moment(date).format('LT')
        }
    },

    computed: {
        ...mapState([
            'user'
        ])
    },

    methods: {
        async onNavigatedTo(args){
            const page = args.object.page
            const grid = page.getViewById('grid')

            setTimeout(() => {
                console.log('Este es el tamaño: ' + grid.getActualSize().width)
                this.width = grid.getActualSize().width
                this.height = grid.getActualSize().width
            }, 500)   
        },

        goToHome(){
            this.$navigator.navigate('/home')
        }
    }
}
</script>

<style scoped>
    .box-1{
        background-image: url('~/assets/images/bg-1.png');
        background-position: center top;
        background-size: cover;
        background-repeat: no-repeat;
    }

    .bg-color{
        background-color: rgba(128, 145, 107);
    }
</style>