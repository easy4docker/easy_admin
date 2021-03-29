<template>
    <div class="head-card card m-1">
        <div class="card-body m-0 p-1 alert-info header-bg ">
            
            <div class="container-fluid m-0 head-menu-1">
                <div class="row">
                    <div class="col-1 p-0 m-0 text-left">
                    </div>
                    <div class="col-10 p-2 text-left">
                        <h1 class="header-title m-3 text-light">Easy OnDemand Demo 
                            <span class="version">(Version &alpha;)</span></h1>
                    </div>
                    <div class="col-1 pr-1 m-0 text-right text-warning">
                    
                    </div>
                </div>
            </div>
            <div class="pull-right pl-1 text-dark developer-mark">Developer : John Xu</div>
            <div class="container-fluid mt-1 head-menu-2 text-left text-light">
                <a href="JavaScript:void(0)" v-if="root.module !== 'onDemand'"  v-on:click="module('onDemand')" class="m-3">On Demand Service</a>
                <b class="m-3" v-if="root.module === 'onDemand'">On Demand Service</b> |
                <a href="JavaScript:void(0)" v-on:click="module('ondemandResults')" v-if="root.module !== 'ondemandResults'" class="m-3 ml-1">ondemand Results</a>
                <b class="m-3" v-if="root.module === 'ondemandResults'">ondemand Results</b> |
                <a href="JavaScript:void(0)" v-if="root.module !== 'documents'"  v-on:click="module('documents')" class="m-3">Documents</a>
                <b class="m-3" v-if="root.module === 'documents'">Documents</b>
            </div>
            
        </div>
    </div> 
</template>
 
<script>
module.exports = {
    data: function() {
        return {
            root :  this.$parent.root
        }
    },
    mounted() {
    },
    watch : {

    },
    methods :{
        module (v) {
            this.root.module = v;
        }
    }
}
</script>
 
<style>
.header-bg { 
    background: url("/images/onDemandBannerBg.png"); 
    background-repeat: no-repeat, repeat;
    background-size: cover;
    background-position: left;
}

.head-card {
    min-height: 8rem;
}
.head-menu-1 {
    height: 6rem;
}
.head-menu-2 {
    height: 1.5rem;
}

.head-menu-2 a { color: #ccc}

.head-menu-2 .menu-frame {
    background: rgba(0,0,0,0.33);
}

.header-title {
    font-family: "RocknRoll One", Arial, Verdana, Serif;
}
.header-title .version {
    font-family: Arial, Verdana, Serif;
    font-size: 1.5rem
}
.developer-mark { 
    font-family: Arial, Verdana, Serif;
   -webkit-text-stroke: 1px #333;
   color: white;
   text-shadow:
       1px 1px 0 #eee,
     -1px -1px 0 #eee,  
      1px -1px 0 #eee,
      -1px 1px 0 #eee,
       1px 1px 0 #eee;
}
</style>
