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
        const record = me.parent.cfg.data.record;
        document._iFrameBridge.close = (function(me) {
            return function(v) {
                me.root.popUp(me).close();
            }
        })(me);
        document._iFrameBridge.save = (function(me, item) {
            return function(v) {
                me.saveEditorContent(item, v, function(result) {
                    me.root.popUp(me).close();
                })
            }
        })(me, record);

        document._iFrameBridge.loadContents = (function(me, item) {
            return function(callback) {
                me.getEditorContent(item, function(result) {
                    callback(result.data);
                })
            }
        })(me, record);
    },
    destroyed() {
       document._vueBridge = function(v) {}
    },
    methods :{
        saveEditorContent(record, v, callback) {
            var me = this;
            var rec = {
                serverName : record.name,
                serverType : record.serverType,
                contents   : v
            };
            console.log(v);
            console.log('read write env');
            /*
            me.root.dataEngine().saveVserverValiables(rec, 
                function(result) {
                    callback(result);
            });
            */
        },
        getEditorContent(record, callback) {
            var me = this;
            var rec = {
                serverName : record.name,
                serverType : record.serverType
            };
            console.log('read env');
            /*
            me.root.dataEngine().getVserverValiables(rec, 
                function(result) {
                    callback(result);
            });*/
        }
    }
}
</script>
 
<style>
    
</style>