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
        const target = me.parent.cfg.data.target;
        document._iFrameBridge.close = (function(me) {
            return function(v) {
                me.root.popUp(me).close();
            }
        })(me);
        document._iFrameBridge.save = (function(me, item) {
            return function(fileName, v) {
                me.saveEditorContent(target, item, v, fileName, function(result) {
                  //  me.root.popUp(me).close();
                })
            }
        })(me, record);

        document._iFrameBridge.loadContents = (function(me, item) {
            return function(fileName, callback) {
                me.getEditorContent(target, item, fileName, function(result) {
                    callback(result.content);
                })
            }
        })(me, record);

        document._iFrameBridge.loadList = (function(me, item) {
            return function(callback) {
                me.getEditorFiles(target, item, function(result) {
                    callback(result);
                })
            }
        })(me, record);
  
    },
    destroyed() {
       document._vueBridge = function(v) {}
    },
    methods :{
        saveEditorContent(target, record, v, fileName, callback) {
            var me = this;
            if (target === 'local') {
                me.root.dataEngine().appPost({
                    cmd :'saveEditorContent',
                    data : {
                        serverName : record.serverName,
                        content : v,
                        fileName : fileName
                    }
                }, function(result) {
                    callback(result);
                }, true);
            }  else {
                me.root.dataEngine().gridHub({
                    cmd : 'saveEditorContent',
                    target : target,
                    data : {
                        serverName : record.serverName,
                        content : v,
                        fileName : fileName
                    }
                },
                function(result) {
                    callback(result);
                }, true);
            }

        },
        getEditorContent(target, record, fileName, callback) {
            var me = this;
            if (target === 'local') {
                me.root.dataEngine().appPost({
                    cmd :'getEditorContent',
                    data : {
                        serverName : record.serverName,
                        fileName : fileName
                    }
                }, function(result) {
                    callback(result);
                }, true);
            } else {
                me.root.dataEngine().gridHub({
                    cmd : 'getEditorContent',
                    target : target,
                    data : {
                        serverName : record.serverName,
                        fileName : fileName
                    }
                },
                function(result) {
                    callback(result);
                }, true);
            }
        },
        getEditorFiles(target, record, callback) {
            var me = this;
            if (target === 'local') {
                me.root.dataEngine().appPost({
                    cmd :'getEditorFiles',
                    data : {
                        serverName : record.serverName
                    }
                }, function(result) {
                    callback(result);
                }, true);
            } else {
                me.root.dataEngine().gridHub({
                    cmd : 'getEditorFiles',
                    target : target,
                    data : {
                        serverName : record.serverName
                    }
                },
                function(result) {
                    callback(result);
                }, true);
            }
        }
    }
}
</script>
 
<style>
    
</style>