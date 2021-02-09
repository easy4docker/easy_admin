<template>
    <div id="alert_modal" class="modal fade" tabindex="-1" role="dialog"  v-on:click="close()">
        <div class="modal-dialog border  m-0 rounded mx-auto shadow" 
            v-bind:class="(config.status === 'success') ? 'border-success alert-success' : 'border-danger alert-danger'">
             {{config.message}}
             <a href="JavaScript:void(0)" class="close" aria-label="close" title="close">×</a>
        </div>
    </div>
</template>

<script>
module.exports = {
    props: [],
    data: function() {
        return {
            root   :  this.$parent.root,
            config : {
                status  : '',
                message : ''
            }
        }
    },
    mounted() {
        var me = this;   
    },
    methods :{
        show(config) {
            var me = this;
            me.config = config;
            $('#alert_modal').modal({backdrop: false, show: true});
        },
        close() {
            var me = this;
            me.config = {
                status  : '',
                message : ''
            };
            $('#alert_modal').modal('hide');
        }
   },
   components: VUEApp.loadComponents({
        LOAD    : {}, 
        TPL :{}
    })
}
</script>
 
<style>
#alert_modal .modal-dialog {
    top: 0.8rem;
    padding: 0.8rem;
    max-width: 92% !important;
}
#alert_modal {
    background-color: transparent;
}
</style>