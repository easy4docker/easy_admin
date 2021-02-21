<template>
    <span class="text-left">
        Switch Branch
        <select class="form-control" :required="true" @change="onBranchSelect($event)" v-model="form.branch">
            <option 
            v-for="option in branches" 
            v-bind:value="option"
            :selected="option.branch ==  form.branch"
            >{{ option }}</option>
        </select>
        <!--button type="button" class="btn btn-primary m-1" v-on:click="switchBranch()">Confirm</button-->
    </span>
</template>

<script>
module.exports = {
    props: [],
    data: function() {
        return {
            branches : [],
            root     :  this.$parent.root,
            parent : this.$parent,
            form     : {
                branch : this.$parent.cfg.data.branch
            }
        }
    },
    mounted() {
        let me = this;
        me.close = me.$parent.close;
        me.gitSiteBranchs(me.$parent.cfg.data);
    },
    methods :{
        gitSiteBranchs(record) {
            const me = this;
            const host = me.parent.cfg.target;
            record.cmd = 'gitSiteBranchs';
            record.target = host;
            me.root.dataEngine()[(host === 'local') ? 'appPost' : 'gridHub'](record, function(result) {
                if (result.status === 'success') {
                    me.branches = result.list;
                } else {
                    me.branches = [];
                }
            });
        },
        onBranchSelect(event) {
            let me = this;
            me.form.branch = event.target.value;
            me.switchBranch()
        },

        switchBranch() {
            const me = this;
            const caller = me.parent.caller;
            const host = me.parent.cfg.target;

            const data = {
                cmd :'gitSwitchBranch',
                
                serverName : me.$parent.cfg.data.serverName,
                serverType : me.$parent.cfg.data.serverType,
                branch     : me.form.branch,
                target  : host,
            };
            me.root.dataEngine()[(host === 'local') ? 'appPost' : 'gridHub'](data, function(result) {
                caller.getServerList();
                me.close();
                if (result.status !== 'success') {
                    result.message += ' The request can not go through!';
                    me.root.alertComp().show(result);
                }
            }, true);
        }
    }
}
</script>
 
<style>
</style>