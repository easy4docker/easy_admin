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
            menu   : '',
            gridServer : null,
            svr : '',
            token : ''
        }
    },
    mounted () {
        var me = this;

        setTimeout(function() {
            me.getGridMatrix();
            me.gridServer = {
        //        server : localStorage.getItem('easygockerGridServer'),
        //        token: localStorage.getItem('easygockerGridToken')
            };
        },50);
    },
    methods :{
        getGridMatrix() {
            const me = this;
            const svr = localStorage.getItem('easydockerSVR');
            const token = localStorage.getItem('easydockerTOKEN');
            
            console.log({
                    server  : svr.replace(/\_/g, '.'),
                    cmd     :'getGridMatrix',
                    data    : {},
                    dataType: 'json',
                    gridToken   : token
                });
          //  return true;

            // '49ba83ae33879460f8cbcd491ef1d1a5'
            // 'grid.shusiou.win'
            me.dataEngine().gridPost({
                    server  : svr.replace(/\_/g, '.'),
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
                  //  me.gridServer = localStorage.getItem('easydockerFP');
                }, function(err) {
                    me.gridServer = null;
                    console.log(err);
                });
        },
        test() {
            const me = this;
            me.dataEngine().appPost({
                url  : 'http://grid.shusiou.win:10000/_grid/',
                cmd     :'getGridMatrix',
                data    : {},
                dataType: 'json',
                gridToken   : '49ba83ae33879460f8cbcd491ef1d1a5'
            },
            function(result) {
                if (result.status === 'success') {
                    me.gridMatrix = result.result;
                } else {
                    me.gridServer = null;
                }
                //  me.gridServer = localStorage.getItem('easydockerFP');
            }, function(err) {
                me.gridServer = false;
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
