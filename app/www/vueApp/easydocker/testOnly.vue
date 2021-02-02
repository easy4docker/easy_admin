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
                <div class="col-2 p-3 text-left">
                    <div class="m-3" v-for="(v, k) in list">
                        <a href="JavaScript: void(0)" v-on:click="linkIPApi(k)">{{k}}</a>
                    </div>
                </div>
                <div class="col-10 p-3 text-left">
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
                me.askGridMatrix();
            }, 50
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
        },
        linkIPApi(ip) {
           const me = this;             
            let hubServer = localStorage.getItem('easydockerSVR'),
                token = localStorage.getItem('easydockerTOKEN');
            
            hubServer = (!hubServer) ? '' :  hubServer.replace(/\_/g, '.');
        
            if (!hubServer || !token) {
                return true;
            }
            me.root.dataEngine().gridHub({
                hubServer  : hubServer,
                cmd     : 'getIP',
                target  : ip,
                data    : {},
                dataType: 'json',
                gridToken   : token
            },
            function(result) {
                console.log(result);
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
        },
        testApi() {
           const me = this;             
            let hubServer = localStorage.getItem('easydockerSVR'),
                token = localStorage.getItem('easydockerTOKEN');
            
            hubServer = (!hubServer) ? '' :  hubServer.replace(/\_/g, '.');
        
            if (!hubServer || !token) {
                return true;
            }
            
            me.root.dataEngine().gridHub({
                hubServer  : hubServer,
                cmd     : 'getIPA',
               // target  : '142.93.73.66',
                data    : {},
                dataType: 'text',
                gridToken   : token
            },
            function(result) {
                console.log(result);
                if (result.status === 'success') {
                    me.testData = result;
                } else {
                    me.testData = result;
                }
                me.$forceUpdate();
            }, function(err) {
                me.testData = null;
                console.log(err);
            });
        },

        testGrid() {
           const me = this;             
            let hubServer = localStorage.getItem('easydockerSVR'),
                token = localStorage.getItem('easydockerTOKEN');
            
            hubServer = (!hubServer) ? '' :  hubServer.replace(/\_/g, '.');
        
            if (!hubServer || !token) {
                return true;
            }
            
            me.root.dataEngine().gridHub({
                hubServer  : hubServer,
                cmd     : 'getToken',
               // target  : '142.93.73.66',
                data    : {},
                dataType: 'json',
                gridToken   : token
            },
            function(result) {
                if (result.status === 'success') {
                    me.testData = result.serverToken;
                } else {
                    me.testData = null;
                }
                me.$forceUpdate();
            }, function(err) {
                me.testData = null;
                console.log(err);
            });
        },
        testGridHub() {
            const me = this;             
            let hubServer = localStorage.getItem('easydockerSVR'),
                token = localStorage.getItem('easydockerTOKEN');
            
            hubServer = (!hubServer) ? '' :  hubServer.replace(/\_/g, '.');
        
            if (!hubServer || !token) {
                return true;
            }
            
            me.root.dataEngine().gridHub({
                hubServer  : hubServer,
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
        },
        testGridPost() {
            const me = this;             
            let hubServer = localStorage.getItem('easydockerSVR'),
                token = localStorage.getItem('easydockerTOKEN');
            
            hubServer = (!hubServer) ? '' :  hubServer.replace(/\_/g, '.');
        
            if (!hubServer || !token) {
                return true;
            }
            
            me.root.dataEngine().gridPost({
                hubServer  : hubServer,
                cmd     :'getIP',
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
        },
        askGridMatrix() {
            const me = this;             
            let hubServer = localStorage.getItem('easydockerSVR'),
                token = localStorage.getItem('easydockerTOKEN');
            
            hubServer = (!hubServer) ? '' :  hubServer.replace(/\_/g, '.');
        
            if (!hubServer || !token) {
                return true;
            }
            
            me.root.dataEngine().gridHub({
                hubServer  : hubServer,
                cmd     :'getGridMatrix',
                data    : {},
                dataType: 'json',
                gridToken   : token
            },
            function(result) {
                if (result.status === 'success') {
                    me.list = result.result;
                } else {
                    me.list = {};
                }
                me.$forceUpdate();
            }, function(err) {
                me.list = {};
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
