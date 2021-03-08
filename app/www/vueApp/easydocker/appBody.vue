<template>
    <div class="container-fluid m-0" >
        <div class="row">
            <div class="col-12 p-0 text-center shadow border rounded">
                <span v-if="root.isSignin()">
                    <v-form-server v-if="root.matrix('form')"></v-form-server>
                    <v-server-list v-if="root.matrix('list')"></v-server-list>
                    <v-add-grid-server v-if="root.matrix('gridSetup')"></v-add-grid-server>
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
        me.root.getLocalEnv();
    },
    methods : {
    },
    components: VUEApp.loadComponents({
        LOAD    : {

        }, 
        TPL :{
            'vServerList' : '/vueApp/easydocker/vServerList.vue',
            'vFormServer' : '/vueApp/easydocker/vFormServer.vue',
            'vAddGridServer' : '/vueApp/easydocker/vAddGridServer.vue'
        }
    })
}
</script>
 
<style>

</style>
