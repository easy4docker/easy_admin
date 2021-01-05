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
        <button type="button" class="btn btn-primary m-1" v-on:click="switchBranch()">Confirm</button>
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
            var me = this;
            me.root.dataEngine().gitSiteBranchs(record, function(result) {
                if (result.status === 'success') {
                    me.branches = result.list.branches;
                } else {
                    me.branches = [];
                }
            });
        },
        onBranchSelect(event) {
            let me = this;
            me.form.branch = event.target.value;
        },
        switchBranch() {
            let me = this;
            let caller = me.parent.caller;
            let param = {
                serverName : me.$parent.cfg.data.serverName,
                serverType : me.$parent.cfg.data.serverType
            };
            me.root.dataEngine().switchBranch(param, me.form.branch, function(result) { 
                caller.getVServerList(); 
            });
            me.close();
        }
    }
}
</script>
 
<style>
</style>