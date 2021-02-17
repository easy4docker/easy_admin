<template>
    <div class="card m-1 text-left">
        <div class="container-fluid p-1 pb-0" >
            <div class="row">
                <div class="col-5 p-3 m-0 text-left">
                    <h3 class="ml-4 text-capitalize">
                        test Only
                    </h3>

                </div>
                <div class="col-7 p-3 m-0 text-right">
                    <button class="m-2 btn btn-warning" v-on:click="setTestModule('testGridHub')">testGridHub</button>
                    <button class="m-2 btn btn-warning" v-on:click="setTestModule('testGridPost')">testGridPost</button>
                    <button class="m-2 btn btn-success" v-on:click="setTestModule('testGrid')">testGrid</button>
                    <button class="m-2 btn btn-success" v-on:click="setTestModule('testApi')">testApi</button>
                </div>
            </div>
            <div class="row">
                <div class="col-12 p-3 m-0 text-left">
                    <hr/>
                </div>
            </div>
            <div class="row">
                <div class="col-2 p-3 text-left">
                    Through grid -- {{Object.keys(root.gridMatrix).length}}
                    <hr v-if="(root.gridMatrix) &&  Object.keys(root.gridMatrix).length"/>
                    <span v-for="(v, k) in root.gridMatrix">
                        <div class="pr-3">
                            <input type="checkbox"><span class="pl-2"><a href="javaScript:void(0)" v-on:click="test(k, {s:k})">{{ k }}</a></span>
                            <div class="text-right text-info pl-3">
                                <div class="progress bg-secondary ml-3">
                                    <div class="progress-bar bg-success" v-bind:style="{width: (Math.ceil((v.MemAvailable / v.MemTotal)  * 100) + '%')}" >
                                    {{Math.round(v.MemAvailable  * 0.001)}}M
                                    </div>
                                </div>
                            </div>

                        </div>
                    </span>
                </div>
                <div class="col-2 p-3 text-left">
                    Through gridHub -- {{Object.keys(root.gridMatrix).length}}
                    <hr v-if="(root.gridMatrix) &&  Object.keys(root.gridMatrix).length"/>
                    <span v-for="(v, k) in root.gridMatrix">
                        <div class="pr-3">
                            <a href="javaScript:void(0)" v-on:click="test(k, {s:k})">{{ k }}</a> 
                            <div class="text-info">--
                                <div class="progress bg-secondary ml-0">
                                    <div class="progress-bar bg-success" v-bind:style="{width: (Math.ceil((v.MemAvailable / v.MemTotal)  * 100) + '%')}" >
                                    {{Math.round(v.MemAvailable  * 0.001)}}M
                                    </div>
                                </div>
                            </div>

                        </div>
                    </span>
                </div>
                <div class="col-8 p-3 text-left">
                    <!--div class="m-3">{{'** ' + testModule + ' **'}}</div-->
                    <div class="m-3">{{testData}}</div>
                </div>
            </div>
        </div> 
    </div>
</template>
 
<script>
module.exports = {
    props : [],
    data: function() {
        let me = this;
        return {
            list : [],
            root :  this.$parent.root,
            testModule  : '',
            testData    : ''
        }
    },
    mounted() {
        var me = this;
        setTimeout(
            function() {
            }, 100
        );
    },
    watch: {
        testModule: function() {
          var me = this;
        }
    },
    methods : {
        setTestModule(v) {
            const me = this;
            if (me[v]) {
                me[v]();
            } else {
                me.testData = v;
            }
        }
    },
    components: VUEApp.loadComponents({
        LOAD    : {}, 
        TPL :{}
    })
}
</script>
 
<style>
.text-capitalize {
  text-transform: capitalize;
}
.list-group-border { background-color: #efefef }
.grids-list-section { min-height:30rem}
</style>
