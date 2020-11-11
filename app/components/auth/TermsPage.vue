<template>
    <Page actionBarHidden="true">
        <GridLayout rows="*" columns="*" backgroundColor="#F2CBC2">
            <ScrollView row="0" col="0" width="100%">
                <WrapLayout orientation="horizontal" marginTop="5" id="grid">
                    <FlexboxLayout width="100%" justifyContent="center" alignItems="center">
                        <Label fontSize="25" color="black" marginTop="15" marginBottom="10" text="Términos y Condiciones" textWrap="true" />
                        
                    </FlexboxLayout>

                    <StackLayout padding="10">
                        <TextJustify 
                            textColor="black"
                            textSize="15"
                            textAlignment="true"
                            :text="terms">
                        </TextJustify>
                    </StackLayout>
                    
                    <FlexboxLayout marginBottom="10" width="90%" justifyContent="center" alignItems="flex-start">
                        <check-box :checked="isChecked" @checkedChange="isChecked = $event.value"  text="He leido y acepto los terminos y condiciones" />
                        <!-- <Label marginTop="3" text="He leido y acepto los terminos y condiciones" textWrap="true" /> -->
                        
                    </FlexboxLayout>

                    <FlexboxLayout v-if="isChecked" width="100%" marginTop="10" marginBottom="10" justifyContent="center" alignItems="center" flexDirection="column">
                        <Button width="90%" fontSize="16" height="40" backgroundColor="#F24464" borderRadius="10" text="Continuar" color="white" @tap="goToHome" />
                    </FlexboxLayout>
                    <FlexboxLayout v-else width="100%" marginTop="10" marginBottom="10" justifyContent="center" alignItems="center" flexDirection="column">
                        <Button width="90%" fontSize="16" height="40" backgroundColor="#EFEFEF" borderRadius="10" text="Continuar" color="white" />
                    </FlexboxLayout>
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
    props: ['type'],

    data(){
        return{
            active: false,
            isChecked: false,
            flag: 0,
            terms: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas suscipit ipsum nec enim mollis scelerisque. Praesent gravida augue ut tristique tincidunt. Nam augue diam, tincidunt non eros eget, ultricies eleifend nunc. Vivamus molestie lectus sed quam tempor, at sagittis odio venenatis. Nunc aliquet ipsum at porta fringilla. Proin justo purus, venenatis sed odio quis, elementum faucibus nunc. Nam auctor orci vitae leo dapibus consectetur. Cras ligula purus, convallis vitae mauris eu, lacinia convallis quam. Maecenas nec ipsum sagittis, hendrerit velit sit amet, tempor diam. Pellentesque hendrerit eget sem sit amet convallis. Sed luctus nulla nisl, in viverra ex rutrum id. Donec vel libero nulla. In lorem nulla, sagittis ut urna a, tincidunt placerat dolor. Maecenas porttitor et massa id rhoncus. Vestibulum aliquam, odio in ullamcorper venenatis, lacus lectus dignissim dolor, id maximus mauris nulla at enim. Mauris dui augue, porta et scelerisque ac, iaculis sit amet risus.

Donec ac ex quis augue sollicitudin cursus. Curabitur quis nisi vel odio porttitor elementum. Nullam laoreet at erat non venenatis. Curabitur a purus pretium, tincidunt urna id, accumsan dui. Phasellus lectus felis, pharetra eu elementum id, sagittis ac turpis. Proin molestie est dui, consequat aliquet odio iaculis non. Sed in bibendum ipsum. Nam a sodales leo. Praesent vel euismod nulla, sed consequat mi. Integer ac vestibulum odio. Pellentesque tristique urna id urna ornare, ac ultrices ligula porttitor. Cras eu diam ut ipsum facilisis aliquam. Maecenas turpis elit, viverra in suscipit at, mollis id arcu. Quisque in elit mi.

Vestibulum sed justo dictum, scelerisque quam id, vestibulum lorem. In elementum magna eget mi auctor laoreet. Morbi quam nibh, euismod et tempor eget, maximus eu elit. Fusce commodo faucibus elit, at sodales nunc tincidunt eu. Proin fermentum dapibus orci, ut feugiat ipsum. Aenean tempor libero mauris, eget sodales ante sagittis eu. Nullam ultrices rutrum lacus vel faucibus. Cras ut maximus leo. Quisque a felis condimentum, convallis ex vitae, luctus metus. Fusce quis dignissim velit. Aliquam consequat neque a quam dictum, et mollis massa rutrum.

Nam a felis urna. Vestibulum aliquet dolor egestas, accumsan tellus ut, convallis ex. Aliquam a semper justo, venenatis ornare est. Integer in libero et enim suscipit luctus quis id est. Proin non erat consequat, viverra lectus consectetur, tincidunt dui. Praesent facilisis egestas arcu nec eleifend. Praesent et nibh aliquam, viverra lacus vel, mattis odio. Cras ultricies, orci vitae scelerisque dapibus, eros lectus laoreet lacus, ac aliquet lectus quam ac ex. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam finibus sollicitudin ultrices. Etiam viverra nunc blandit augue iaculis, ut commodo erat sodales. Maecenas leo nisl, egestas a purus vel, imperdiet auctor odio. Vivamus vel consectetur ex. Nulla cursus porta arcu, vitae sodales tellus.

Suspendisse potenti. Fusce sed maximus libero, at cursus ex. Morbi vitae dolor eleifend, viverra mauris vitae, blandit leo. Mauris egestas purus vitae consectetur sagittis. Nulla lacinia augue at nibh tristique facilisis sed at dolor. Nulla molestie felis vitae mauris fermentum, a aliquam urna eleifend. Aliquam id risus dolor. Maecenas posuere tellus ut urna feugiat dapibus. Suspendisse sollicitudin nulla quis justo tempus tempor. Nunc ac mi et arcu suscipit elementum id viverra metus.


            `
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

        async goToHome(){
            try {
                await firebase.firestore.collection('information_user').doc(this.user.uid).set({ name: this.user.name, cancellationsCount: 0, deliveredCount: 0 })
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