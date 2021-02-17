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
            gridAdminServer : '',
            triggerSpinner : false,
            module : 'list',
            menu   : '',
            gridServer : null,
            svr : '',
            token : '',
            easydockerFP : '',
            ajaxResult : '',
            localEnv : {}
        }
    },
    mounted () {
        var me = this;
        setTimeout(function() {
            me.getGridHub();
            me.easydockerFP = localStorage.getItem('easydockerFP');
            me.getGridMatrix();
        },50);
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
        getGridMatrix() {
            const me = this;
            if (!me.isLocalhost()) {
                me.dataEngine().appPost({
                    cmd     :'getGridMatrix',
                    data    : {},
                    dataType: 'json'
                },
                function(result) {
                    if (result.status === 'success') {
                        me.gridMatrix = result.result;
                    } else {
                        me.gridMatrix  = false;
                    }
                }, function(err) {
                    me.gridMatrix  = false;
                });
            }

        },
        getGridHub() {
            const me = this;
            if (!me.isLocalhost()) {
                return true;
            }
            let svr = localStorage.getItem('easydockerSVR'),
                token = localStorage.getItem('easydockerTOKEN');
            svr = (!svr) ? '' :  svr.replace(/\_/g, '.');
            if (!svr || !token) {
                return true;
            }
            console.log(svr);
            me.dataEngine().gridHub({
                    hubServer  : svr,
                    cmd     :'getGridMatrix',
                    data    : {},
                    dataType: 'json',
                    gridToken   : token
                },
                function(result) {
                    if (result.status === 'success') {
                        me.gridMatrix = result.result;
                    } else {
                        me.gridServer = null;
                    }
                    me.$forceUpdate();
                }, function(err) {
                    me.gridServer = null;
                    console.log(err);
                });
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
