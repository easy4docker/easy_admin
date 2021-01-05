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
    },
   methods :{
        show(param) {
            var me = this;
            me.cfg = param;
            $('#confirm_modal').modal({backdrop: false, show: true});
        },
        loadModule() {
           let me = this;
           let list = ['switchBranch', 'confirmDelete', 'iframeObj'];
           return (list.indexOf(me.cfg.insideModule)  === -1) ? '' : me.cfg.insideModule;
        },
        close() {
            var me = this;
            me.cfg = {};
            me.caller = null;
            $('#confirm_modal').modal('hide');
       }
   },
   components: VUEApp.loadComponents({
        LOAD    : {
            'switchBranch' : '/vueApp/easydocker/popUpModals/switchBranch.vue',
            'confirmDelete' : '/vueApp/easydocker/popUpModals/confirmDelete.vue',
            'iframeObj' : '/vueApp/easydocker/popUpModals/iframeObj.vue'
        }, 
        TPL :{
            
        }
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