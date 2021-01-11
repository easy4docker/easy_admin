<template>
    <div>
        <span v-if="root.isSignin()">
          <v-form-server v-if="root.matrix('form')"></v-form-server>
          <v-server-list v-if="root.matrix('list')"></v-server-list>
          <v-form-grid v-if="root.matrix('formGrid')"></v-form-grid>
        </span>
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
