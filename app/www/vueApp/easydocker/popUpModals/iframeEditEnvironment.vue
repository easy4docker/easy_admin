<template>
    <div class="text-left">
       <iframe v-bind:src="$parent.cfg.data.url" style="min-height:36em;width:100%; border: 0"></iframe>
    </div>
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
        const me = this;
        document._iFrameBridge.close = (function(me) {
            return function(v) {
                me.root.popUp(me).close();
            }
        })(me);

    },
    destroyed() {
       document._vueBridge = function(v) {}
    },
    methods :{

    }
}
</script>
 
<style>
    
</style>