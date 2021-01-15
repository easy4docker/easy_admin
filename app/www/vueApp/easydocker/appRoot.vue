<template>
    <div class="container-fluid m-0 mt-2 mb-3" >
        <div class="row">
            <div class="col-1 p-0"></div>
            <div class="col-10 p-0 card text-center shadow border rounded">
                <app-header></app-header>
                <app-body ref="appBody"></app-body>
                <auth ref="auth"></auth>
            </div>
            <div class="col-1 p-0"></div>
        </div>
        <data-engine ref="dataEngine"></data-engine>
        <pop-up-modal ref="popUpModal"></pop-up-modal>
        <spinner></spinner>     
    </div>
</template>
 
<script>
module.exports = {
    data: function() {
        return {
            root : this,
            auth : {},
            commonData :{
                list : [],
                dockers : [],
                popUp : {
                    serverName  : '',
                    insideModule: ''
                },
                formStarted : false
            },
            gridMatrix: {},
            triggerSpinner : false,
            module : 'list',
            menu   : ''
        }
    },
    mounted () {
        var me = this;
        document._iFrameBridge = (!document._iFrameBridge) ? {} : document._iFrameBridge;
        setTimeout(function() {
            // me.getGridMatrix();
            me.getGridHub();
        },50);
    },
    methods :{
        gridServer(ip, port) {
            return window.location.protocol + '//' + ((ip) ?  (ip + ':' + port) : window.location.host)
        },
        callGridHub() {
            var me = this;
            me.dataEngine().gridPost({
                    server : me.gridServer(),
                    cmd:'getGridMatrix',
                    data : {},
                    type : 'json'
                },
                function(data) {
                    me.gridMatrix = data.result;
                }, function(err) {
                    console.log(err);
                });
        },
        isSignin() {
            return (!this.root.auth || !this.root.auth.isSignIn || !this.root.auth.isAuthExist) ? false : true
        },
        signOff() {
            this.getAuth().signOff();
        },
        dataEngine(caller) {
            if (caller) this.$refs.dataEngine.caller = caller;
            return this.$refs.dataEngine
        },
        getAuth() {
            return this.$refs.auth
        },
        appBody() {
            return this.$refs.appBody
        },
        popUp(caller) {
            if (caller) this.$refs.popUpModal.caller = caller;
            return this.$refs.popUpModal
        },
        matrix(v) {
            var me = this;
            return (me.module === v) ? true : false;
        }
    },
    components: VUEApp.loadComponents({
        LOAD    : {
        }, 
        TPL :{
            'auth'      : '/vueApp/easydocker/auth.vue',
            'appBody'   : '/vueApp/easydocker/appBody.vue',
            'popUpModal': '/vueApp/easydocker/popUpModals/_frame.vue',
            'dataEngine': '/vueApp/easydocker/dataEngine.vue',
            'spinner'   : '/vueApp/easydocker/spinner.vue',
            'appHeader' : '/vueApp/easydocker/appHeader.vue'
        }
    })
}
</script>
 
<style>

</style>
