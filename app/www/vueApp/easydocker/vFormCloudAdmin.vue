<template>
    <span class="text-left">
        <a href="JavaScript:void(0)" onClick="$('#admin_form').submit()"><i class="fa fa-cogs fa ml-3" aria-hidden="true"></i> Open Cloud UI</a>
        <form id="admin_form" :action="vServerLink(record)" method="post" target="_blank" style="display:none">
            <input name="cmd" type="hidden" value="postPageAuth"/>
            <input name="token" type="hidden" :value="token"/>
        </form>
    </span>
</template>
 
<script>
module.exports = {
    props : ['record', 'host'],
    data: function() {
        var me = this;
        return {
            root :  this.$parent.root,
            parent   :  this.$parent,
            token : '123456'
        }
    },
    mounted() {
        var me = this;
        setTimeout(function() {
            me.getVToken();
        }, 50);
    },
    methods : {
        getVToken() {
            var me = this;
            me.root.dataEngine()[(me.host === 'local') ? 'appPost' : 'gridHub']({
                    cmd :'getSiteToken',
                    serverName : me.record.name,
                    target : me.host,
                    dataType: 'JSON'
                },function(result) {
                    me.token = result.token;
                    me.$parent.triggerSpinner = false;
                }, false);
        },
        arrayPorts(item) {
            var me = this;
            var arr = [];
            var cloudP = (!item || !item.docker || !item.docker.cloudPort) ? null : item.docker.cloudPort;
            var p = (!item || !item.docker || !item.docker.ports) ? [] : item.docker.ports;
            if (cloudP) {
                for (var i = 0; i < cloudP.length; i++) {
                    arr.push(30000 + (item.unidx * 1000 + parseInt(cloudP[i])))
                }
            } else {
                for (var i = 0; i < p.length; i++) {
                    arr.push(10000 + (item.unidx * 1000 + parseInt(p[i])))
                }
            }
            return arr;
        },
        vServerLink(rec) {
            const me = this;
            const port = me.arrayPorts(rec)[0];
            return '//' + ((rec.domain) ? rec.domain : (location.hostname + ':' + port));
        }
    }
}
</script>
 
<style>

</style>
