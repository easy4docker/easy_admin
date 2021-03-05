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
                <app-body ref="appBody"></app-body>
                <auth ref="auth"></auth>
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
            gridMatrix: false,
            gridSvrs: {},
  
            gridAdminServer : '',
            triggerSpinner : false,
            module : '',
            menu   : '',
            token : '',
            easydockerFP : '',
            localEnv : {}
        }
    },    
    watch : {
        module :  function (newValue, oldValue) {
            history.pushState('', '', '/app/' + newValue);
        } 
    },
    mounted () {
        var me = this;
        me.module = (!/^\/app\//.test(location.pathname)) ? 'list' : (location.pathname.replace(/\/app\//, ''));
        setTimeout(function() {
            me.easydockerFP = localStorage.getItem('easydockerFP');
            me.getGridMatrix();
        },200);
    },
    methods :{
        getLocalEnv() {
            const me = this;
            me.dataEngine().appPost({
                    cmd     :'getLocalEnv',
                    data    : {},
                    dataType: 'json'
                },
                function(result) {
                  me.localEnv = (!result || !result.result) ? {} : result.result;
                }, function(err) {
                    console.log(err);
                });
        },
        getGridMatrix(cbk) {
            const me = this;
            me.dataEngine().gridHub({
                cmd     :'getGridMatrix',
                data    : {},
                dataType: 'json'
            },
            function(result) {
                if (result.status === 'success') {
                    me.gridMatrix = result.result;
                    if (typeof cbk === 'function') {
                        cbk();
                    }
                } else {
                    me.gridMatrix = false;
                }
                me.$forceUpdate();
            }, true);

        },
        isLocalhost() {
            return (window.location.hostname === 'localhost') ? true : false;
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
        alertComp() {
            return this.$refs.alertComp;
        },
        matrix(v) {
            var me = this;
            return (me.module === v) ? true : false;
        }
    },
    components: VUEApp.loadComponents({
        LOAD    : {
            'alertComp': '/vueApp/easydocker/alertComp.vue',
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
.grid-section { min-height : 32rem }
</style>
