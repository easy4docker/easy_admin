<template>
    <div class="text-left ml-1">
      <component v-bind:is="dockerPlugin()" v-bind:plugin_path="pluginPath" v-bind:item="item"></component>
    </div>
</template>
 
<script>
module.exports = {
    props : ['item'],
    data: function() {
        var me = this;
        return {
            root :  this.$parent.root,
            pluginPath : '/_dockerAdupter/sites/' + me.item.name
        }
    },
    mounted () {
        var me = this;
        var cfg = {};
        if (me.item && me.item.docker && me.item.docker.adupter) {
            cfg['dockerPlugO' + me.item.name] = me.pluginPath + '/ui/main.vue';
            VUEApp.dynamicLoadComponent(cfg, me);
            me.$mount();
        }
    },
    methods :{
        dockerPlugin() {
            return 'docker-plug-o' + this.item.name
        }
    }
}
</script>
 
<style>

</style>