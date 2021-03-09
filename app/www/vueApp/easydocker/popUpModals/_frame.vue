<template>
    <div id="confirm_modal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog-centered modal-dialog" role="document">
            <div class="modal-content shadow">
                <div class="modal-body">
                    <span v-bind:is="loadModule()"></span>
                    <button type="button" class="btn btn-secondary m-1" data-dismiss="modal" v-if="!cfg.noDefaultCancel" v-on:click="close()">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
module.exports = {
    props: [],
    data: function() {
        return {
            caller : null,
            cfg : {},
            root :  this.$parent.root
        }
    },
    mounted() {
        var me = this;
        document._iFrameBridge = (document._iFrameBridge) ? document._iFrameBridge : {};
    },
   methods :{
        show(param) {
            var me = this;
            me.cfg = param;
            if (me.cfg.insideModuleUrl) {
                const v = {};
                v[me.cfg.insideModule] = me.cfg.insideModuleUrl;
                VUEApp.dynamicLoadComponent(v);
            }
            $('#confirm_modal').modal({backdrop: false, show: true});
        },
        loadModule() {
            let me = this;
            return me.cfg.insideModule;
        },
        close() {
            var me = this
            me.cfg = {};
            me.caller = null;
            $('#confirm_modal').modal('hide');
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
.modal-dialog {
    min-width: 68%;
}
#confirm_modal {
    background-color: rgba(50, 50, 50, 0.6);
}
</style>