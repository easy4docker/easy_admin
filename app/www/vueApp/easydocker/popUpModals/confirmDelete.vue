<template>
    <span>
        <p>Please confirm if you need remove the virtual host "{{this.$parent.cfg.data.serverName}}"</p>
        <button type="button" class="btn btn-primary m-1" v-on:click="execDeletVirtualServer()">Confirm</button>
    </span>
</template>

<script>
module.exports = {
    props: [],
    data: function() {
        return {
            root :  this.$parent.root,
            parent : this.$parent
        }
    },
    mounted() {
        let me = this;
        me.close = me.parent.close;
    },
    methods :{
        execDeletVirtualServer() {
            let me = this;
            let cfg = {
                    serverName : me.$parent.cfg.data.serverName,
                    serverType : me.$parent.cfg.data.serverType
                }
                caller = me.parent.caller;
            me.root.dataEngine().removeVirtualServer(cfg, function() {
                me.close();
                caller.getVServerList();
               
            });
        }
    }
}
</script>
 
<style>
</style>