<template>
    <div class="head-card card m-1">
        <div class="card-body m-0 p-1 header-bg">
            <div class="container-fluid m-0 head-menu-1">

                <div class="row">
                    <div class="col-2 p-0 m-0 text-left">
                    </div>
                    <div class="col-8 p-3 text-center">
                        <h1 class="header-title m-3">EasyDocker Admin 
                            <span class="version">(Version &alpha;)</span></h1>
                    </div>
                    <div class="col-2 p-0 m-0 text-right text-warning">
                            <a class="btn btn-danger border border-warning pull-right" 
                                href="JavaScript:void(0)" v-on:click="rebootServer()">
                            <i class="fa fa-power-off" aria-hidden="true"></i> Restart Server
                        </a>
                    </div>
                </div>
            </div>
            <div class="container-fluid mt-1 head-menu-2">
                <div class="row" v-if="root.isSignin()">
                    <div class="col-12 p-0 m-0 text-center">
                        <div class="pull-left border border-light rounded menu-frame shadow-sm">
                            <button class="btn btn-outline-light m-1" 
                                :disabled = "isDisabled('gridSetup')"
                                v-if="!root.isLocalhost()"
                                v-on:click="clickMenu('gridSetup')">
                                <i class="fa fa-cogs" aria-hidden="true"></i> Grid Setup
                            </button>
                            <button class="btn btn-outline-light m-1" 
                                :disabled = "isDisabled('form')"
                                v-on:click="clickMenu('form')">
                                <i class="fa fa-plus-square" aria-hidden="true"></i> Add a server
                            </button>
                            <button class="btn btn-outline-light m-1" 
                                :disabled = "isDisabled('list')"
                                v-on:click="clickMenu('list')">
                                <i class="fa fa-tasks" aria-hidden="true"></i> List Servers
                            </button>
                        </div>

                        <div class="m-0 text-center border border-light rounded menu-frame shadow-sm pull-right">
                            <a class="btn btn-outline-light m-1" 
                                href="JavaScript:void(0)" v-on:click="syncAppCode()">
                                <i class="fa fa-github" aria-hidden="true"></i> Sync code
                            </a>
                            <a class="btn btn-outline-light m-1" 
                                href="JavaScript:void(0)" v-on:click="root.signOff()">
                                <i class="fa fa-sign-out" aria-hidden="true"></i> Sign Off
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div> 
</template>
 
<script>
module.exports = {
    data: function() {
        return {
            root :  this.$parent.root,
            module : ''
        }
    },
    mounted() {
        this.gridSvrs = this.root.gridSvrs;
    },
    watch : {

    },
    methods :{
        isDisabled(v) {
            return (this.$parent.module === v);
        },
        clickMenu(v) {
            var me = this;
            me.$parent.module = v;
        },
        syncAppCode() {
            var me = this;
            me.root.dataEngine().appPost({
                cmd : 'syncAppCode'
            }, function(result) {
                console.log(result);
                window.location.reload();
            }, true);
        },
        rebootServer() {
            var me = this;
            me.root.dataEngine().appPost({
                cmd : 'rebootServer'
            }, function(result) {
                console.log(result);
            }, true);
        }
    }
}
</script>
 
<style>
.head-card {
    min-height: 10.8rem;
}
.head-menu-1 {
    height: 7rem;
}
.head-menu-2 {
    height: 1.5rem;
}

.head-menu-2 .menu-frame {
    background: rgba(0,0,0,0.33);
}

.header-bg { 
    background: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0.5)),  url("/images/header-bg.png"); 
    background-repeat: no-repeat, repeat;
    background-size: cover;
    background-position: center;
}

.header-title {
    font-family: "RocknRoll One", Arial, Verdana, Serif;
   -webkit-text-stroke: 1px black;
   color: white;
   text-shadow:
       3px 3px 0 #000,
     -1px -1px 0 #000,  
      1px -1px 0 #000,
      -1px 1px 0 #000,
       1px 1px 0 #000;
}
.header-title .version {
    font-family: Arial, Verdana, Serif;
    font-size: 1.5rem
}
</style>
