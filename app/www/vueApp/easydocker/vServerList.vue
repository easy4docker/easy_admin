<template>
    <div class="card m-1 text-left">
        <div class="container-fluid p-1 pb-0" >
            <div class="row">
                <div class="col-5 p-3 m-0 text-left">
                    <h3 class="ml-4 text-capitalize">
                        Server List
                    </h3>
                </div>
                <div class="col-7 p-3 m-0 text-right">
                     <span v-for="(v, k) in serverTypes">
                        <span class="pr-3"><input type="checkbox" :checked="isFilterChecked(k)" v-on:click="checkFilter(k)"><span class="pl-2">{{ v }}</span></span>
                    </span>
                </div>
            </div>
        </div>
        <div class="card-body card-list-section border-0 pt-0">
            <div class="container-fluid p-1 pb-0" >
                <div class="row">
                    <div class="col-2">
                        <grid-list></grid-list>
                    </div>
                    <div class="col-10 p-0 m-0 text-left">

                        <div class="list-group" v-for="(v, k) in list">
                            <div class="list-group-item list-group-item-action flex-column align-items-start m-1 list-group-border">
                                <div>
                                    {{k}} ({{v.length}}) 
                                    <a href="JavaScript: void(0)" v-if="k !== 'local'">
                                        <i class="fa fa-refresh ml-3" aria-hidden="true"  v-on:click = "rebootHost(k)"></i>
                                    </a>

                                    <a href="JavaScript: void(0)" class="pull-right host-detail-icon"  v-on:click = "switchGridHost(k)">
                                        <i class="fa fa-arrow-circle-right fa-2x " v-if = "k !== currentGridHost"></i>
                                        <i class="fa fa-arrow-circle-up fa-2x pull-right" v-if = "k === currentGridHost"></i>
                                    </a>
                                </div>
 
                                <span v-if="k === currentGridHost">
                                    <span v-if="!filteredResult(k).length">
                                        <hr/>
                                        <div class="container-fluid m-0">
                                            No result on {{k}}
                                        </div>
                                    </span>
                                    <span v-for="item in filteredResult(k)">
                                        <hr/>
                                        <div class="container-fluid m-0" >
                                            <div class="row">
                                                <div class="col-8 p-0 m-0 text-left">
                                                    <div class="p-1 m-1 mr-2 border rounded alert-info text-info">
                                                        <h5>{{k}} - {{item.name}}</h5>
                                                    </div>
                                                    <span class="ml-1">
                                                        Type: <span class="text-info">{{(!item.docker) ? '' : item.docker.type}}</span>
                                                        Port : <span class="text-info"> {{outerPorts(item)}}</span>
                                                        Unidx : <span class="text-info"> {{item.unidx}}</span>
                                                        <a :href="vServerLink(item, outerPorts(item))" target="_blank">
                                                            <i class="fa fa-globe fa ml-3" aria-hidden="true"></i> Web Link
                                                        </a>
                                                    </span><br/>
                                                    <span class="ml-1">
                                                        gitHub : <span class="text-info"> {{item.gitHub}}</span>
                                                    </span><br/>
                                                    <span class="ml-1">
                                                        <v-form-domain v-bind:record="item" v-bind:host="k"></v-form-domain>
                                                    </span>
                                                    <span class="ml-1">
                                                        <select-branch v-bind:record="item" v-bind:branch="item.branch" v-bind:host="k"></select-branch>
                                                    </span>
                                                    <!--docker-adupter v-bind:item="item"></docker-adupter-->
                                                </div>
                                                <div class="col-2 p-0 m-0 text-left">
                                                    <a class="m-1" href="JavaScript:void(0)" v-on:click="pullCode(k, item)">
                                                        <i class="fa fa-github" aria-hidden="true"></i> Pull code
                                                    </a><br/>
                                                    <a class="m-1" href="JavaScript:void(0)" v-on:click="switchBranch(k, item)">
                                                        <i class="fa fa-github" aria-hidden="true"></i> Switch branch
                                                    </a><br/>                                                    
                                                    <a class="m-1" href="JavaScript:void(0)" v-on:click="popupEditor(k, item)">
                                                        <i class="fa fa-file-code-o mr-2" aria-hidden="true"></i>Edit Site Variabls
                                                    </a>
                                                </div>
                                                <div class="col-2 p-0 m-0 text-left">
                                                    <a href="JavaScript:void(0)" v-on:click="deleteVirtualServer(k, item)">
                                                        <i class="fa fa-trash m-1 " aria-hidden="true"></i> Remove
                                                    </a><br/>
                                                    <a href="JavaScript:void(0)" v-on:click="startVServer(k, item)"  title="Reboot Server">
                                                        <i class="fa fa-refresh m-1" aria-hidden="true"></i> Reboot
                                                    </a><br/>
                                                    <a href="JavaScript:void(0)" v-on:click="stopVServer(k, item)">
                                                        <i class="fa fa-stop-circle m-1" aria-hidden="true"></i> Stop
                                                    </a>
                                                </div>
                                            </div>

                                        </div>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
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
            serverTypes : {
                'database'  : 'Mysql Database',
                'databaseCloud'  : 'Mysql Cloud',
                'backendCloud'   : 'Backend Cloud',
                'webServer' : 'Web Server',
                'ondemand'  : 'On Demand'
            },
            serverTypeFilter : [],
            root :  this.$parent.root,
            currentServer : '',
            currentDomain : '',
            gridMatrix: {},
            currentGridHost: ''
        }
    },
    mounted() {
        var me = this;
        me.serverTypeFilter = Object.keys(me.serverTypes);
        setTimeout(
            function() {
                for (let k in me.root.gridMatrix) {
                    me.root.gridSvrs[k] = true;
                }
                me.getServerList();
            }, 300
        );
    },
    watch: {
        serverTypeFilter: function(val) {
          var me = this;
        }
    },
    methods : {
        vServerLink(rec, port) {
            return '//' + ((rec.domain) ? rec.domain : (location.hostname + ':' + port));
        },
        switchGridHost(v) {
            const me = this;
            me.currentGridHost = (me.currentGridHost === v) ? '' : v;
            me.$forceUpdate();
        },
        afterGridSvrChange() {
            this.getServerList();
        },
        isFilterChecked(k) {
            var me = this;
            return (me.serverTypeFilter.indexOf(k) !== -1);
        },
        checkFilter(k) {
            var me = this;
            var list = [];
            if (me.serverTypeFilter.indexOf(k) == -1) {
                me.serverTypeFilter.push(k);
            } else {
                for (var i = 0; i < me.serverTypeFilter.length; i++) {
                    if (me.serverTypeFilter[i] != k) {
                        list.push(me.serverTypeFilter[i]);
                    }
                }
                me.serverTypeFilter = list;
            }
        },
        rebootHost(host) {
            const me = this;
            me.root.dataEngine().gridHub({
                    cmd     :'rebootHost',
                    data    : {},
                    target  : host,
                    dataType: 'json'
                },
                function(result) {
                    console.log(result);
                    
                }, function(err) {
                   
                });
        },
        filteredResult(k) {
            var me = this;
            return me.list[k].filter(function(item) {
                return (me.serverTypeFilter.indexOf(item.docker.type) !== -1)
            });
        },
      
        getServerList() {
            const me = this;
            const cp = new crowdProcess();

            const _f = {}
            _f['local'] = function(cbk) {
                me.root.dataEngine().appPost(
                    {cmd :'loadList'},  function(result) {
                        cbk(result.list);
                    }, false);
            }

            for (k in me.root.gridSvrs) {
                _f[k] = (function(k) {
                    return function(cbk) {
                        me.getGridHub(k, cbk);
                    }})(k)
            }
            
            cp.parallel(_f, function(result){
                me.list = {local : cp.data.local};
                for (k in me.root.gridSvrs) {
                    me.list[k] = cp.data[k];
                }
            }, 6000);
            
            
        },

        getGridHub(target, cbk) {
            const me = this;
            me.root.dataEngine().gridHub({
                    cmd     :'loadList',
                    data    : {},
                    target  : target,
                    dataType: 'json'
                },
                function(result) {
                    cbk(result.list);
                }, function(err) {
                    cbk(false);
                });
           
        },
         
        deleteVirtualServer(host, record) {
            var me = this;
            me.root.popUp(me).show({
                insideModule: 'confirmDelete',
                insideModuleUrl: '/vueApp/easydocker/popUpModals/confirmDelete.vue',
                target     : host,
                data : {
                    serverName : record.name,
                    serverType : record.serverType
                }
            });
        },
        switchBranch(host, record) {
            let me = this,
                data = {
                    serverType  : record.serverType,
                    serverName  : record.name,
                    branch      : record.branch
                };

            me.root.popUp(me).show({
                insideModule    : 'switchBranch',
                insideModuleUrl : '/vueApp/easydocker/popUpModals/switchBranch.vue',
                target          : host,
                data            : data
            });            
        },

        stopVServer(host, record) {
            var me = this;
            me.root.dataEngine()[(host === 'local') ? 'appPost' : 'gridHub']({
                    cmd :'stopVServer',
                    serverName : record.name,
                    serverType : record.serverType,
                    target : host,
                    dataType: 'JSON'
                },function(result) {
                    me.$parent.triggerSpinner = false;
                }, true);
        },

        pullCode(host, record) {
            var me = this;
            me.root.dataEngine()[(host === 'local') ? 'appPost' : 'gridHub']({
                    cmd :'pullCode',
                    serverName : record.name,
                    serverType : record.serverType,
                    target : host,
                    dataType: 'JSON'
                },function(result) {
                    me.$parent.triggerSpinner = false;
                }, true);
        },

        startVServer(host, record) {
            var me = this;
            me.root.dataEngine()[(host === 'local') ? 'appPost' : 'gridHub']({
                    cmd :'startVServer',
                    serverName : record.name,
                    serverType : record.serverType,
                    target : host,
                    dataType: 'JSON'
                },function(result) {
                    me.$parent.triggerSpinner = false;
                }, true);
        },   

        arrayPorts(item) {
            var me = this;
            var arr = [];
            var cloudP = (!item || !item.docker || !item.docker.cloudPort) ? null : item.docker.cloudPort;
            var p = (!item || !item.docker || !item.docker.ports) ? [] : item.docker.ports;
            if (cloudP) {
                for (var i = 0; i < cloudP.length; i++) {
                    arr.push(30000 + (item.unidx * 1000 + parseInt(cloudP[i])))
                }
            } else {
                for (var i = 0; i < p.length; i++) {
                    arr.push(10000 + (item.unidx * 1000 + parseInt(p[i])))
                }
            }
            return arr;
        },
        outerPorts(item) {
            var me = this;
            return me.arrayPorts(item)[0];
            // .join(',');
        },
        popupEditor(host, record) {
            var me = this;
            me.root.popUp(me).show({
                insideModule: 'iframeObj',
                insideModuleUrl: '/vueApp/easydocker/popUpModals/iframeEditEnvironment.vue',
                data : {
                    url : '/html/tools/aceEditor.ect',
                    record : record,
                    target : host
                },
                noDefaultCancel : true
            }); 
        }
    },
    components: VUEApp.loadComponents({
        LOAD    : {
            'selectBranch'   : '/vueApp/easydocker/selectBranch.vue',
           /* 'dockerAdupter'  : '/vueApp/easydocker/dockerAdupter.vue',*/
            'gridList'      : '/vueApp/easydocker/vGridList.vue',
            'vFormDomain'   : '/vueApp/easydocker/vFormDomain.vue'
        }, 
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
.host-detail-ico { cursor: pointer}
</style>
