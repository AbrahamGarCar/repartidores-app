<template>
    <Page actionBarHidden="true" @navigatedTo="onNavigatedTo($event)">
        <GridLayout class="box-1" rows="*" columns="*">
            <ScrollView row="0" col="0" width="100%">
                <WrapLayout orientation="horizontal" marginTop="5" id="grid">
                    <FlexboxLayout justifyContent="center" alignItems="center" width="100%" marginTop="20">
                        <Label fontSize="19" text="Selecciona la Emergencia" textWrap="true" />
                        
                    </FlexboxLayout>
                    <GridLayout :width="width" :height="height" padding="10" marginTop="20">
                        <FlexboxLayout width="100%" height="100%" justifyContent="center" alignItems="center" flexDirection="column" backgroundColor="black" @tap="goToPanicButton2(1)">
                            <Label color="white" class="font-awesome" fontSize="55" text="" textWrap="true" />
                            <Label color="white" marginTop="10" textAlignment="center" text="Incendio" fontSize="12" textWrap="true" />
                        </FlexboxLayout>
                    </GridLayout>
                    <GridLayout :width="width" :height="height" padding="10" marginTop="20">
                        <FlexboxLayout width="100%" height="100%" justifyContent="center" alignItems="center" flexDirection="column" backgroundColor="black" @tap="goToPanicButton2(2)">
                            <Label color="white" class="font-awesome" fontSize="55" text="" textWrap="true" />
                            <Label color="white" marginTop="10" textAlignment="center" text="Asistencia Medica" fontSize="12" textWrap="true" />
                        </FlexboxLayout>
                    </GridLayout>
                    <GridLayout :width="width" :height="height" padding="10">
                        <FlexboxLayout width="100%" height="100%" justifyContent="center" alignItems="center" flexDirection="column" backgroundColor="black" @tap="goToPanicButton2(3)">
                            <Label color="white" class="font-awesome" fontSize="55" text="" textWrap="true" />
                            <Label color="white" marginTop="10" textAlignment="center" text="Riña" fontSize="12" textWrap="true" />
                        </FlexboxLayout>
                    </GridLayout>
                    <GridLayout :width="width" :height="height" padding="10">
                        <FlexboxLayout width="100%" height="100%" justifyContent="center" alignItems="center" flexDirection="column" backgroundColor="black" @tap="goToPanicButton2(4)">
                            <Label color="white" class="font-awesome" fontSize="55" text="" textWrap="true" />
                            <Label color="white" marginTop="10" textAlignment="center" text="Llamar a Seguridad" fontSize="12" textWrap="true" />
                        </FlexboxLayout>
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

export default {
    name: 'HomePage',

    data(){
        return{
            width: 0,
            height: '',
        }
    },

    computed: {
        ...mapState([
                'user',
            ]),
        
    },

    methods: {
        async onNavigatedTo(args){
            const page = args.object.page
            const grid = page.getViewById('grid')

            setTimeout(() => {
                console.log('Este es el tamaño: ' + grid.getActualSize().width)
                this.width = grid.getActualSize().width / 2
                this.height = grid.getActualSize().width / 2
            }, 500)   
        },

        goToPanicButton2(args){
            this.$navigator.navigate('/panic-button-2', { props: { type: args } })
        },

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
        background-color: rgba(128, 145, 107, 0.7);
    }
</style>