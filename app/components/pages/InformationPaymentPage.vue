<template>
    <Page actionBarHidden="true">
        <GridLayout class="box-1" rows="*" columns="*">
            <ScrollView row="0" col="0" width="100%">
                <WrapLayout orientation="horizontal" marginTop="5" id="grid">
                    <GridLayout rows="60, *" columns="*">
                        <FlexboxLayout col="0" row="0" justifyContent="center" alignItems="center" flexDirection="column">
                            <Label text="Nombre del area" textWrap="true" />
                            <Label fontSize="20" text="Reservacion" textWrap="true" />
                            
                        </FlexboxLayout>

                        <StackLayout row="1" col="0">
                            <Label text="Visitantes" textWrap="true" />
                            <StackLayout marginTop="15">
                                <GridLayout rows="*" columns="3*, *">
                                    <TextField row="0" col="0" class="input-info" text="" v-model="people" />
                                    <FlexboxLayout @tap="addPerson" row="0" col="1" width="100%" height="35" justifyContent="center" alignItems="center" backgroundColor="#2988D2" color="white">
                                        <Label class="font-awesome" text="" textWrap="true" />
                                    </FlexboxLayout>
                                </GridLayout>
                            </StackLayout>

                            <StackLayout marginTop="15">
                                <StackLayout v-if="persons.length != 0">
                                    <GridLayout rows="*" columns="3*, *" v-for="(item, index) in persons" :key="index">
                                        <Label textWrap="true">
                                            <FormattedString>
                                                <span fontSize="12" marginBottom="2" class="font-awesome" text=" "></span>
                                                <span marginTop="2" :text="`${item}`"></span>
                                            </FormattedString>
                                        </Label>
                                        
                                        <FlexboxLayout @tap="deletePerson(index)" row="0" col="1" width="100%" height="35" justifyContent="center" alignItems="center" color="#FF0200">
                                            <Label class="font-awesome" text="" textWrap="true" />
                                        </FlexboxLayout>
                                    </GridLayout>
                                </StackLayout>
                                <FlexboxLayout v-else justifyContent="center" alignItems="center">
                                    <Label fontSize="16" text="No has agregado ningun visitante" textWrap="true" />
                                    
                                </FlexboxLayout>
                            </StackLayout>

                            <!-- separator -->

                            <Label text="Vehiculos" textWrap="true" />
                            <StackLayout marginTop="15">
                                <GridLayout rows="*" columns="3*, *">
                                    <TextField row="0" col="0" class="input-info" text="" v-model="car" />
                                    <FlexboxLayout @tap="addCar" row="0" col="1" width="100%" height="35" justifyContent="center" alignItems="center" backgroundColor="#2988D2" color="white">
                                        <Label class="font-awesome" text="" textWrap="true" />
                                    </FlexboxLayout>
                                </GridLayout>
                            </StackLayout>

                            <StackLayout marginTop="15">
                                <StackLayout v-if="cars.length != 0">
                                    <GridLayout rows="*" columns="3*, *" v-for="(item, index) in cars" :key="index">
                                        <Label textWrap="true">
                                            <FormattedString>
                                                <span fontSize="12" marginBottom="2" class="font-awesome" text=" "></span>
                                                <span marginTop="2" :text="`${item}`"></span>
                                            </FormattedString>
                                        </Label>
                                        
                                        <FlexboxLayout @tap="deleteCar(index)" row="0" col="1" width="100%" height="35" justifyContent="center" alignItems="center" color="#FF0200">
                                            <Label class="font-awesome" text="" textWrap="true" />
                                        </FlexboxLayout>
                                    </GridLayout>
                                </StackLayout>
                                <FlexboxLayout v-else justifyContent="center" alignItems="center">
                                    <Label fontSize="16" text="No has agregado ningun vehiculo" textWrap="true" />
                                    
                                </FlexboxLayout>
                            </StackLayout>

                            <!-- separator -->

                            <StackLayout marginTop="10" width="90%">
                                <TextField v-model="questions.question1" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="¿De donde nos visita?" text="" />
                            </StackLayout>
                            <StackLayout marginTop="10" width="90%">
                                <TextField v-model="questions.question2" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="¿Primera visita?" text="" />
                            </StackLayout>
                            <StackLayout marginTop="10" width="90%">
                                <TextField v-model="questions.question3" color="black" borderWidth="1" borderColor="black" padding="5 5 5 5" fontSize="16" hint="Actividad" text="" />
                            </StackLayout>

                            <Button backgroundColor="black" color="white" text="Hacer pago" @tap="makePayment" />
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

export default {
    data(){
        return{
            people: '',
            persons: [],

            car: '',
            cars: [],

            questions: {
                question1: '',
                question2: '',
                question3: '',
            }
        }
    },

    computed: {
        ...mapState([
            'user'
        ])
    },

    validations: {
        people: {
            required,
        },

        car: {
            required,
        },
    },

    methods: {
        addPerson(){
            if(!this.$v.people.required){
                Toast.makeText("Ingresa un nombre.", "long").show()
                return
            }

            this.persons.push(this.people)
            this.people = ''
        },

        deletePerson(index){
            this.persons.splice(index, 1)
        },

        addCar(){
            if(!this.$v.car.required){
                Toast.makeText("Ingresa una placa.", "long").show()
                return
            }

            this.cars.push(this.car)
            this.car = ''
        },

        deleteCar(index){
            this.cars.splice(index, 1)
        },

        async makePayment(){
            console.log('olis')
            try {
                let response = await firebase.firestore.collection('reservations')
                                                        .where('user', '==', this.user.uid)
                                                        .where('status', '==', true)
                                                        .get()
                                                        .then(query => {
                                                            query.forEach(async doc => {
                                                                console.log(doc)
                                                                await firebase.firestore.collection('reservations')
                                                                                        .doc(doc.id)
                                                                                        .update({ persons: this.persons, cars: this.cars, questions: this.questions, step: 3 })
                                                            })
                                                        })

                this.goToPaypal()
            } catch (e) {
                console.log(e)
            }
        },

        goToPaypal(){
            this.$navigator.navigate('/paypal')
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