<template>
    <div class="text-left p-2 alert-secondary border rounded grids-list-section">
        <div class="text-center">Grid Servers</div>
        <hr/>
        <span v-for="(v, k) in root.gridMatrix">
            <div class="pr-3"><input type="checkbox"><span class="pl-2">{{ k }}</span></div>
        </span>
        <hr/>
        <button type="button" class="btn btn-danger" v-on:click="removeGrid()" v-if="isShowRemoveGrid()">Remove Grid</button>
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
        return (!me.root.isLocalhoust || !localStorage.getItem('easydockerSVR') || !localStorage.getItem('easydockerTOKEN')) ? false : true
      },
      removeGrid() {
         const me = this;
         localStorage.removeItem('easydockerSVR');
         localStorage.removeItem('easydockerTOKEN');
         window.location.reload();
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
