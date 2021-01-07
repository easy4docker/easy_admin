<template>
    <div class="card p-1 text-left p-2 scheduleFromSection alert-dark">
       <div class="m-2">Log {{fileName}}: </div>
       <textarea class="form-control" rows="20" readonly>{{contents}}</textarea>
    </div>
</template>
<script>
module.exports = {
    props: [],
    data: function() {
        const me = this;
        return {
            root : this.$parent.root,
            fileName : '',
            contents : ''
        }
    },
    watch: {
        fileName: function (v) {
            const me = this;
            me.askOutput(v);
        }
    },
    mounted () {
    },
    methods :{
        askOutput (v) {
            const me = this;
            const data = {cmd : 'askOutput', fileName : v}; 
            me.root.dataEngine(me).askLogContent(data, function(result) {
               me.contents = result;
            });
        }
    },
    components: {
    }
}
</script>
 
<style>
</style>
