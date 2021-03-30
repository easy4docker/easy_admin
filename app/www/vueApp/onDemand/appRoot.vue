<template>
    <div class="container-fluid m-0" >
        <div class="row">
            <div class="col-12 p-0 m-0 text-center shadow">
                <request-service ref="requestOndemand" v-bind:module="module"></request-service>
            </div>
        </div>
        <data-engine ref="dataEngine"></data-engine>
        <pop-up-modal ref="popUpModal"></pop-up-modal>
        <alert-comp ref="alertComp"></alert-comp>
        <spinner></spinner>     
    </div>
</template>
 
<script>
module.exports = {
    data: function() {
        return {
            root : this,
            triggerSpinner : false,
            module : ''
        }
    },    
    watch : {
        // -- Router related code
        module :  function (newValue, oldValue) {
            history.pushState('', '', '/app/' + newValue);
        } 
    },
    mounted () {
        var me = this;
        me.module = (!/^\/app\//.test(location.pathname)) ? '' : (location.pathname.replace(/\/app\//, ''));
    },
    methods :{
        dataEngine(caller) {
            if (caller) this.$refs.dataEngine.caller = caller;
            return this.$refs.dataEngine
        }
    },
    components: VUEApp.loadComponents({
        LOAD    : {
            
        }, 
        TPL :{
            'appHeader' : '/vueApp/onDemand/appHeader.vue',
            'dataEngine' : '/vueApp/onDemand/dataEngine.vue',
            'spinner'   : '/vueApp/onDemand/spinner.vue',
            'popUpModal': '/vueApp/onDemand/popUpModals/_frame.vue',
            'appBody'   : '/vueApp/onDemand/appBody.vue',
            'bodyDocuments'   : '/vueApp/onDemand/body/documents.vue',
            'requestService'  : '/vueApp/onDemand/body/requestService.vue'
        }
    })
}
</script>
 
<style>
/*.body-card { min-height : 82em }*/
</style>
