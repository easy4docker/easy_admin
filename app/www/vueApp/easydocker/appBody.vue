<template>
    <div class="container-fluid m-0 mt-2 mb-3" >
        <div class="row">
            <div class="col-2 p-0">--
                <span v-for="(v, k) in root.gridMatrix">
                    <div class="pr-3"><input type="checkbox" :checked="isFilterChecked(k)" v-on:click="checkFilter(k)"><span class="pl-2">{{ k }}</span></div>
                </span>
            </div>
            <div class="col-10 p-0 card text-center shadow border rounded">
                <span v-if="root.isSignin()">
                    <v-form-server v-if="root.matrix('form')"></v-form-server>
                    <v-server-list v-if="root.matrix('list')"></v-server-list>
                    <v-form-grid v-if="root.matrix('gridSetup')"></v-form-grid>
                    <local-grid v-if="root.matrix('localGrid')"></local-grid>
                </span>
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
        var me = this;
        setTimeout(
            function() {
                me.getVServerList();
            }, 50
        );
    },
    methods : {
        isFilterChecked(k) {
            var me = this;
            return (me.serverTypeFilter.indexOf(k) !== -1);
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
    },
    components: VUEApp.loadComponents({
        LOAD    : {
            'localGrid' : '/vueApp/easydocker/localGrid.vue'
        }, 
        TPL :{
            'vServerList' : '/vueApp/easydocker/vServerList.vue',
            'vFormServer' : '/vueApp/easydocker/vFormServer.vue',
            'vFormGrid' : '/vueApp/easydocker/vFormGrid.vue'
        }
    })
}
</script>
 
<style>

</style>
