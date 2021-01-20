<template>
    <div class="text-left p-2 alert-secondary border rounded grids-list-section">
        <div class="p-2 text-center">Grid Servers</div>
        <span v-for="(v, k) in root.gridMatrix">
            <div class="pr-3"><input type="checkbox"><span class="pl-2">{{ k }}</span></div>
        </span>
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
