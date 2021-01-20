<template>
    <span v-for="(v, k) in root.gridMatrix">===
        <div class="pr-3"><input type="checkbox" :checked="isFilterChecked(k)" v-on:click="checkFilter(k)"><span class="pl-2">{{ k }}</span></div>
    </span>
</template>
 
<script>
module.exports = {
    props : [],
    data: function() {
        let me = this;
        return {
            list : [],
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
