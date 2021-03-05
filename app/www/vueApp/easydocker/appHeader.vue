<template>
    <div class="head-card card m-1">
        <div class="card-body header-bg">
            <div class="container-fluid m-0 head-menu-1">
                <div class="row">
                    <div class="col-2 p-0 m-0 text-left">
                    </div>
                    <div class="col-8 p-2 m-0 text-center">
                    </div>
                    <div class="col-2 p-0 m-0 text-right text-warning"></div>
                </div>
            </div>
            <div class="container-fluid mt-1 head-menu-2">
                <div class="row" v-if="root.isSignin()">
                    <div class="col-6 p-0 m-0 text-left border border-warning">
                        <button class="btn btn-sm btn-success m-1 border-warning shadow-sm" 
                            :disabled = "isDisabled('gridSetup')"
                            v-if="!root.isLocalhost()"
                            v-on:click="clickMenu('gridSetup')">
                            <i class="fa fa-cogs" aria-hidden="true"></i> Grid Setup
                        </button>
                        <button class="btn btn-sm btn-success m-1 border-warning shadow-sm" 
                            :disabled = "isDisabled('form')"
                            v-on:click="clickMenu('form')">
                            <i class="fa fa-plus-square" aria-hidden="true"></i> Add a server
                        </button>
                        <button class="btn btn-sm btn-success m-1 border-warning shadow-sm" 
                            :disabled = "isDisabled('list')"
                            v-on:click="clickMenu('list')">
                            <i class="fa fa-tasks" aria-hidden="true"></i> List Servers
                        </button>
                    </div>

                    <div class="col-6 p-30 m-0 text-right">
                        <button class="btn btn-sm btn-success m-1 border-warning shadow-sm" 
                            v-on:click="clickMenu('testOnly')">
                            <i class="fa fa-cogs" aria-hidden="true"></i> test only
                        </button>
                        <a class="btn btn-sm btn-warning m-1 border-danger shadow-sm" 
                            href="JavaScript:void(0)" v-on:click="syncAppCode()">
                            <i class="fa fa-github" aria-hidden="true"></i> Sync code
                        </a>
                        <a class="btn btn-sm btn-success m-1 border-warning shadow-sm" 
                            href="JavaScript:void(0)" v-on:click="root.signOff()">
                            <i class="fa fa-sign-out" aria-hidden="true"></i> Sign Off
                        </a>
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
        }
    }
}
</script>
 
<style>
.head-card {
    min-height: 8rem;
}
.head-menu-1 {
    height: 6rem;
}
.head-menu-2 {
    height: 1.5rem;
}
.header-bg { 
    background: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0.5)),  url("/images/header-bg.png"); 
    background-repeat: no-repeat, repeat;
    background-size: cover;
    background-position: center;
}

.header-title {
   -webkit-text-stroke: 1px black;
   color: white;
   text-shadow:
       3px 3px 0 #000,
     -1px -1px 0 #000,  
      1px -1px 0 #000,
      -1px 1px 0 #000,
       1px 1px 0 #000;
}
</style>
