<template>
    <div class="card m-1 text-left">
        <div class="p-3 m-0 text-left alert-secondary border rounded grids-list-section">
            <span v-for="(v, k) in root.gridMatrix">
                <div class="pr-3"><input type="checkbox" :checked="isFilterChecked(k)" v-on:click="checkFilter(k)"><span class="pl-2">{{ k }}</span></div>
            </span>
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
            currentServer : '',
            gridMatrix: {}
        }
    },
    mounted() {
        var me = this;
        me.serverTypeFilter = Object.keys(me.serverTypes);
        setTimeout(
            function() {
                me.getVServerList();
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
                window.open('/cloudTools/cloudAdmin.ect?host=' + item.name + ((!Object.keys(tokenlist).length) ? '' : ('&token=' + Object.keys(tokenlist)[0])));
            });
        },
        popupCloudTool(item) {
            var me = this;
            var port = me.arrayPorts(item);
            me.root.popUp(me).show({
                insideModule: 'iframeObj',
                data : {
                    url : '/html/tools/cloudTokenAdmin.ect?port=' + port + '&serverName=' + item.name + '&serverType=' + item.serverType
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
                    url : '/html/tools/aceEditor.ect?mode=json',
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
</style>
