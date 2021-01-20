<template>
    <div class="container-fluid m-0 mt-2 mb-3" >
        <div class="row">
            <div class="col-1 p-0"></div>
            <div class="col-11 p-0 card text-center shadow border rounded">
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
    },
    methods : {
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
