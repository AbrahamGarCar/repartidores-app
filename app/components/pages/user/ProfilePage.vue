<template>
    <Page actionBarHidden="true" navigatedTo="onNavigatedTo">
        <GridLayout rows="*" columns="*">
            <ScrollView row="1" col="0" backgroundColor="red">
                <WrapLayout orientation="vertical" width="90%" paddingBottom="20">
                    <StackLayout>
                        <Label text="Este es el perfil" textWrap="true" />
                        
                    </StackLayout>
                </WrapLayout>
            </ScrollView>
        </GridLayout>
    </Page>
</template>

<script>
export default {

}
</script>

<style>

</style>