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
                    <button class="m-2 btn btn-warning" v-on:click="setTestModule('testGrid')">testGrid</button>
                    <button class="m-2 btn btn-warning" v-on:click="setTestModule('testApi')">testApi</button>
                </div>
            </div>
            <div class="row">
                <div class="col-12 p-3 m-0 text-left">
                    <hr/>
                </div>
            </div>
            <div class="row">
                <div class="col-12 p-3 text-left">
                    <div class="m-3">{{'** ' + testModule + ' **'}}</div>
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
            root :  this.$parent.root,
            testModule  : '',
            testData    : {}
        }
    },
    mounted() {
        var me = this;
    },
    watch: {
        testModule: function() {
          var me = this;
        }
    },
    methods : {
        setTestModule(v) {
            const me = this;
            me.testModule = v;
            
            if (me[v]) {
                me[v]();
            } else {
                me.testData = {}
            }
        },
        testGridHub() {
            const me = this;             
            let svr = localStorage.getItem('easydockerSVR'),
                token = localStorage.getItem('easydockerTOKEN');
            
            svr = (!svr) ? '' :  svr.replace(/\_/g, '.');
        
            if (!svr || !token) {
                return true;
            }
            
            me.root.dataEngine().gridHub({
                server  : svr,
                cmd     :'getGridMatrix',
                data    : {},
                dataType: 'json',
                gridToken   : token
            },
            function(result) {
                if (result.status === 'success') {
                    me.testData = result.result;
                } else {
                    me.testData = null;
                }
                me.$forceUpdate();
            }, function(err) {
                me.testData = null;
                console.log(err);
            });
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
