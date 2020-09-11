<template>
    <Page actionBarHidden="true" navigatedTo="onNavigatedTo">
        <StackLayout>
            <Button text="Payment" @tap="changeTitle" />
            
            <Label text="asasas" textWrap="true" />
            <WebViewExt ref="webview" src="http://192.168.1.147:3000" @webAlert="changeTitle" />
            
            <Button text="demo" @tap="changeTitle" />
            
        </StackLayout>
    </Page>
</template>

<script>
//Pages
import HomePage from './pages/HomePage'

export default {
    name: 'App',

    components: {
        HomePage
    },

    data(){
        return{
            gotMessageData: '',
        }
    },

    mounted(){
        this.$refs.webview.nativeView.on("gotMessage", (msg) => {
            this.gotMessageData = msg.data;
            console.log(`webview.gotMessage: ${JSON.stringify(msg.data)} (${typeof msg})`);
        });
    },

    methods: {
        async executeJavaScriptTest(js){
            try {
                const res = await this.$refs.webview.nativeView.executeJavaScript(js);
                console.log(`executeJavaScript '${js}' => ${JSON.stringify(res)}`);
                const jsonRes = JSON.stringify(res);

                return res;
            } catch (err) {
                console.log(`executeJavaScript '${js}' => ERROR: ${err}`);
                throw err;
            }
        },

        async changeTitle(){
            await this.executeJavaScriptTest("callFromNativeScript()");
        },
    }
}
</script>

<style>

</style>