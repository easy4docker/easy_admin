<template>
    <div class="container-fluid m-0 mt-2 mb-3" >
        <div class="row">
            <div class="col-1 p-0"></div>
            <div class="col-10 p-0 card text-center shadow border rounded">
                <app-header></app-header>
                <app-body></app-body>
            </div>
            <div class="col-1 p-0"></div>
        </div>
        <data-engine ref="dataEngine"></data-engine>
        <spinner></spinner>
    </div>
</template>
 
<script>
module.exports = {
    props: ['token'],
    data: function() {
        return {
            root : this,
            triggerSpinner : false
        }
    },
    mounted () {
  
    },
    methods :{
        dataEngine(caller) {
            if (caller) this.$refs.dataEngine.caller = caller;
            return this.$refs.dataEngine
        }   
    },
    components: VUEApp.loadComponents({
        LOAD    : {
            'appHeader'     : '/vueApp/easyCloudAdmin/appHeader.vue',
            'appBody'       : '/vueApp/easyCloudAdmin/appBody.vue',
            'dataEngine'    : '/vueApp/easyCloudAdmin/dataEngine.vue',
            'spinner'       : '/vueApp/easyCloudAdmin/spinner.vue'
        }
    })
}
</script>
 
<style>

</style>
