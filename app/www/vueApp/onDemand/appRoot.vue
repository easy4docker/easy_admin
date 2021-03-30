<template>
    <div class="container-fluid m-0 mt-2 mb-3" >
        <div class="row">
            <div class="col-1 p-0"></div>
            <div class="col-10 p-0 card text-center shadow border rounded">
                <app-header></app-header>
            </div>
            <div class="col-1 p-0"></div>
        </div>
        <div class="row">
            <div class="col-1 p-0"></div>
            <div class="col-10 p-0 card text-center shadow border rounded">
                <request-service ref="requestOndemand" :serviceType="module"></request-service>
            </div>
            <div class="col-1 p-0"></div>
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
        setTimeout(function() {
        },200);
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
