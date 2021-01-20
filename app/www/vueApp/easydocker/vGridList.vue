<template>
    <span v-for="(v, k) in root.gridMatrix">===
        <div class="pr-3"><input type="checkbox" :checked="isFilterChecked(k)"><span class="pl-2">{{ k }}</span></div>
    </span>
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
        isFilterChecked(k) {
            var me = this;
            return (me.serverTypeFilter.indexOf(k) !== -1);
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
