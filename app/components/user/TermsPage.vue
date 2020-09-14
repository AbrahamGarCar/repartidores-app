<template>
    <Page actionBarHidden="true">
        <GridLayout rows="*" columns="*">
            <FlexboxLayout @swipe="changeCount" flexDirection="column" justifyContent="center" alignItems="center" row="0" col="0" id="grid" padding="10">
                <FlexboxLayout class="bg-color" justifyContent="center" alignItems="center" flexDirection="column">
                    <Label color="black" fontSize="25" textAlignment="center" text="Reglamento de Áreas de Acampar" textWrap="true" />
                    <Label color="black" marginTop="10" textAlignment="center" text="Basado en reglamentos Federales, Estatales y Municipales que protegen al Parque." fontSize="20" textWrap="true" />
                    
                    <FlexboxLayout justifyContent="center" alignItems="center" flexDirection="column">
                        <Image :src="terms[flag].image" width="200" stretch="aspectFit" verticalAlignment="center" horizontalAlignment="center" />
                        
                        <Label marginTop="10" :text="terms[flag].title" fontSize="14" color="black" textWrap="true" />
                        <Label marginTop="10" :text="terms[flag].body" fontSize="14" color="black" textWrap="true" />
                        
                    </FlexboxLayout>
                    
                </FlexboxLayout>

                <StackLayout marginTop="20" v-if="active">
                    <Button width="100%" backgroundColor="black" color="white" text="Aceptar" @tap="goToHome" />
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
            active: false,
            flag: 0,
            terms: [
                {
                    title: 'Solo acampar en áreas establecidas.',
                    image: '~/assets/images/info-1.png',
                    body: 'Prohibido realizar días de campo/campamentos en el área habitacional del parque (pueden tomarse fotos en áreas como El Peñol y el parque de baseball, pero no permanecer durante el día/noche).',

                },
                {
                    title: 'Recoger la basura y regresarla a la ciudad.',
                    image: '~/assets/images/info-2.png',
                    body: '',

                },
                {
                    title: '',
                    image: '~/assets/images/info-3.png',
                    body: 'Vigilar y extinguir fogatas (las fogatas solo se pueden realizar en áreas desprovistas de vegetación o en áreas destinadas, nunca dejarlas desatendidas).',

                },
                {
                    title: '',
                    image: '~/assets/images/info-4.png',
                    body: 'Solo transitar por veredas y senderos establecidos (personas).',

                },
                {
                    title: 'Prohibido dañar o molestar a los animales.',
                    image: '~/assets/images/info-5.png',
                    body: 'Prohibido dañar la vegetación (cortar, romper, extraer, quemar, etc. Está penado como delito federal).',

                },
                {
                    title: 'Prohibidas las armas de cualquier tipo (fuego, aire comprimido, pintura, etc.) y fuegos pirotécnicos.',
                    image: '~/assets/images/info-6.png',
                    body: 'Prohibido la cacería (está penado como delito federal).',

                },
                {
                    title: 'Prohibidas las mascotas sin correa.',
                    image: '~/assets/images/info-7.png',
                    body: '',

                },
                {
                    title: 'Los vehículos solo pueden transitar por caminos. Prohibidos todo tipo de vehículos en senderos y veredas.',
                    image: '~/assets/images/info-8.png',
                    body: 'Las motocicletas solo pueden transitar de 9:00 a.m. a 9:00 p.m. Velocidad máxima de vehículos: 25 km/h.',

                },
                {
                    title: 'En temporada de lluvias, prohibido transitar por arroyos ríos o cuerpos de agua.',
                    image: '~/assets/images/info-9.png',
                    body: '',

                },
            ]
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
        changeCount(args){
            if(this.flag == 7){
                this.active = true
            }

            if(args.direction == 2 && this.flag < 8){
                
                this.flag++ 

            }else if(args.direction == 1 && this.flag > 0){
                this.flag--
            }
            console.log(args.direction)
        },

        async goToHome(){
            try {
                let response = await firebase.firestore.collection('users')
                                            .doc(this.user.uid)
                                            .update({ terms: true })

                this.$navigator.navigate('/home')
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>