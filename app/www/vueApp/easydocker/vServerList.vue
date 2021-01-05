<template>
    <div class="card m-1 text-left">
        <div class="p-1 pb-0" >
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
            <div class="list-group" v-if="!filteredResult().length"> 
                <div class="list-group-item list-group-item-action flex-column align-items-start m-1">
                    <div class="container-fluid m-0">
                        No result
                    </div>
                </div>
            </div>
            <div class="list-group" v-for="item in filteredResult()">
                <div class="list-group-item list-group-item-action flex-column align-items-start m-1 list-group-border">
                    <div class="container-fluid m-0">
                        <div class="row">
                            <div class="col-2 p-0 m-0 text-center">
                                <div class="p-3 m-1 mr-3 border rounded text-center alert-info text-info">
                                    {{item.serverType}}<br/>
                                    <h3>{{item.name}}</h3>
                                </div>
                                
                            </div>
                            <div class="col-7 p-0 m-0 text-left">
                                <span class="ml-1">
                                    Type: <span class="text-info">{{item.docker.type}}</span>
                                    Port : <span class="text-info"> {{outerPorts(item)}}</span>
                                    <a href="JavaScript:void(0)" v-on:click="linkCloudTo(item)">
                                        <i class="fa fa-globe fa ml-3" aria-hidden="true"></i> Web Link
                                    </a>
                                </span><br/>
                                <span class="ml-1">
                                    gitHub : <span class="text-info"> {{item.gitHub}}</span>
                                </span>
                                <span class="ml-1">
                                    <select-branch v-bind:record="item" v-bind:branch="item.branch"></select-branch>
                                </span><br/>
                                <docker-adupter v-bind:item="item"></docker-adupter>
                            </div>
                            <div class="col-2 p-0 m-0 text-left">
                                <a class="m-1" href="JavaScript:void(0)" v-on:click="pullCode(item)">
                                    <i class="fa fa-github" aria-hidden="true"></i> Pull code
                                </a><br/>
                                <a class="m-1" href="JavaScript:void(0)" v-on:click="switchBranch(item)">
                                    <i class="fa fa-github" aria-hidden="true"></i> Switch branch
                                </a><br/>
                                <!--a class="m-1" href="JavaScript:void(0)" v-on:click="viewLogs(item)">
                                    <i class="fa fa-file" aria-hidden="true"></i> Read Logs
                                </a><br/-->
                                <a class="m-1" href="JavaScript:void(0)" v-on:click="popupEditor(item)">
                                    <i class="fa fa-file-code-o mr-2" aria-hidden="true"></i>Edit Site Variabls
                                </a><br/>
                                <a class="m-1" v-if="isCloudTool(item)" href="JavaScript:void(0)" v-on:click="popupCloudTool(item)">
                                    <i class="fa fa-cloud mr-2" aria-hidden="true"></i>Cloud Token Admin
                                </a>
                            </div>
                            <div class="col-1 p-0 m-0 text-left">
                                <a href="JavaScript:void(0)" v-on:click="deleteVirtualServer(item)">
                                    <i class="fa fa-trash m-1 " aria-hidden="true"></i> Remove
                                </a><br/>
                                <a href="JavaScript:void(0)" v-on:click="startVServer(item)"  title="Reboot Server">
                                    <i class="fa fa-refresh m-1" aria-hidden="true"></i> Reboot
                                </a><br/>
                                <a href="JavaScript:void(0)" v-on:click="stopVServer(item)">
                                    <i class="fa fa-stop-circle m-1" aria-hidden="true"></i> Stop
                                </a>
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
                'webServer' : 'Web Server'
            },
            serverTypeFilter : [],
            root :  this.$parent.root,
            currentServer : ''
        }
    },
    mounted() {
        var me = this;
        me.serverTypeFilter = Object.keys(me.serverTypes);
        setTimeout(
            function() {
                me.getVServerList();
                $('a').tooltip('show')
            }, 50
        );
    },
    watch: {
        serverTypeFilter: function(val) {
          var me = this;
        }
    },
    methods : {
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
            console.log(k);
            console.log(me.serverTypeFilter);
        },
        filteredResult() {
            var me = this;
            return me.list.filter(function(item) {
                return (me.serverTypeFilter.indexOf(item.serverType) !== -1)
            });
        },
        getVServerList() {
            var me = this;
            me.root.dataEngine().getVServerList(
                false,
                function(result) {
                    me.list = result.list;
                }
            );
        },
        deleteVirtualServer(record) {
            var me = this;
            me.root.popUp(me).show({
                insideModule: 'confirmDelete',
                data : {
                    serverName : record.name,
                    serverType : record.serverType
                }
            });
        },
        switchBranch(record) {
            let me = this,
                data = {
                    serverType  : record.serverType,
                    serverName  : record.name,
                    branch      : record.branch
                };

            me.root.popUp(me).show({
                insideModule: 'switchBranch',
                data : data
            });            
        },
        stopVServer(record) {
            var me = this;
            me.root.dataEngine().stopVServer(record);
        },
        pullCode(record) {
            var me = this;
            me.root.dataEngine().pullCode(record);
        },    
        viewLogs(record) {
            var me = this;
            me.root.dataEngine().viewLogs(record);
        },       
        startVServer(record) {
            var me = this;
            me.root.dataEngine().startVServer(record);
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
            return me.arrayPorts(item).join(',');
        },
        saveEditorContent(record, v, callback) {
            var me = this;
            var rec = {
                serverName : record.name,
                serverType : record.serverType,
                contents   : v
            };
            me.root.dataEngine().saveVserverValiables(rec, 
                function(result) {
                    callback(result);
            });
        },
        getEditorContent(record, callback) {
            var me = this;
            var rec = {
                serverName : record.name,
                serverType : record.serverType
            };
            me.root.dataEngine().getVserverValiables(rec, 
                function(result) {
                    callback(result);
            });
        },
        askToken(item, callback) {
            var me = this;
            me.root.dataEngine().askToken(
                item,
                function(result) {
                    callback(result);
                }
            );
        },
        isCloudTool(item) {
            var me = this;
            return  (['databaseCloud', 'backendCloud'].indexOf(item.serverType) === -1) ?  false : true;
        },
        linkCloudTo(item) {
            var me = this;
            var port = me.arrayPorts(item)
            me.askToken(item, function(data) {
                var tokenlist = (!data || !data.tokens || !data.tokens.list) ? {} : data.tokens.list;
                window.open('//localhost:' + port + ((!Object.keys(tokenlist).length) ? '' : ('?token=' + Object.keys(tokenlist)[0])));
            });
        },
        popupCloudTool(item) {
            var me = this;
            var port = me.arrayPorts(item);
            me.root.popUp(me).show({
                insideModule: 'iframeObj',
                data : {
                    url : '/cloudTokenAdmin.ect?port=' + port + '&serverName=' + item.name + '&serverType=' + item.serverType
                },
                noDefaultCancel : true
            }); 

            document._iFrameBridge.close = (function(me) {
                return function(v) {
                    me.root.popUp(me).close();
                }
            })(me);
        },
        popupEditor(record) {
            var me = this;
            me.root.popUp(me).show({
                insideModule: 'iframeObj',
                data : {
                    url : '/aceEditor.ect?mode=json',
                    item : record
                },
                noDefaultCancel : true
            }); 

            document._iFrameBridge.close = (function(me) {
                return function(v) {
                    me.root.popUp(me).close();
                }
            })(me);

            document._iFrameBridge.save = (function(me, item) {
                return function(v) {
                   me.saveEditorContent(item, v, function(result) {
                       me.root.popUp(me).close();
                   })
                }
            })(me, record);

            document._iFrameBridge.loadContents = (function(me, item) {
                return function(callback) {
                   me.getEditorContent(item, function(result) {
                       callback(result.data);
                   })
                }
            })(me, record);
        }
    },
    components: VUEApp.loadComponents({
        LOAD    : {
            'selectBranch'   : '/vueApp/easydocker/selectBranch.vue',
            'dockerAdupter'  : '/vueApp/easydocker/dockerAdupter.vue',
            'iframeObj'      : '/vueApp/easydocker/_iframe.vue'
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
</style>