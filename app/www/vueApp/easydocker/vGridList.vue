<template>
    <div class="text-left p-2 alert-secondary border rounded grids-list-section">
        <div class="text-center">Grid Servers</div>
        <hr/>
        <span v-for="(v, k) in root.gridMatrix">
            <div class="pr-3"><input type="checkbox"><span class="pl-2">{{ k }}</span></div>
        </span>
        <hr v-if="root.isLocalhost()"/>
        <button type="button" class="btn btn-danger" v-on:click="removeGrid()" v-if="root.isLocalhost() && isShowRemoveGrid()">Remove Grid</button>
        <button type="button" class="btn btn-sm btn-info m-1 border-danger shadow-sm" v-if="root.isLocalhost() &&  !isShowRemoveGrid()"
            v-on:click="addGridMonitor()">
            Add Monitor
        </button>
        <hr v-if="root.isLocalhost()"/>
    </div>
</template>
 
<script>
module.exports = {
    props : [],
    data: function() {
        let me = this;
        return {
            root :  this.$parent.root
        }
    },
    mounted() {
        var me = this;
    },
    watch: {
    },
    methods : {
      isShowRemoveGrid() {
        const me = this;
        return (!localStorage.getItem('easydockerSVR') || !localStorage.getItem('easydockerTOKEN')) ? false : true
      },
      removeGrid() {
         const me = this;
         localStorage.removeItem('easydockerSVR');
         localStorage.removeItem('easydockerTOKEN');
         window.location.reload();
      },
      addGridMonitor() {
        const me = this;
        me.root.popUp(me).show({
            insideModule: 'addGridMonitor',
            data : {

            },
            noDefaultCancel : true
        });
      }
    },
    components: VUEApp.loadComponents({
        LOAD    : {
        //    'addGridMonitor' : '/vueApp/easydocker/popUpModals/addGridMonitor.vue'
        }, 
        TPL :{

        }
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
