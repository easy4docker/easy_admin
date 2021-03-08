<template>
    <div class="text-left ml-1">
        <span v-if="!branches.length || !isCurrentServer()">
            Branch : <span class="text-info">{{branch}}</span> <i class="fa fa-arrow-left" aria-hidden="true"></i> 
            <a href="JavaScript: void(0)" v-on:click="gitSiteBranchs()">switch branch</a>
        </span>
        <div v-if="branches.length && isCurrentServer()" class="border border-3 p-1">
            Switch Branch 
            <div class="container m-2">
                <div class="row">
                    <div class="col-3 p-0 m-0 text-left" v-for="item in branches">
                        <i class="fa fa-flag-checkered" v-if="item === branch" aria-hidden="true"></i>
                        <span v-if="item === branch">{{item}}</span>
                        <a href="JavaScript: void(0)" v-on:click="switchBranch(item)" v-if="item !== branch">{{item}}</a>
                    </div>
                </div>
            </div>
        <div>
    </div>
</template>

<script>
module.exports = {
    props: ['record', 'branch', 'host'],
    data: function() {
        return {
            branches :  [],
            root     :  this.$parent.root,
            parent   :  this.$parent,
            form     : {
                branch : this.branch
            }
        }
    },
    mounted() {
        let me = this;
    },
    methods :{
        isCurrentServer() {
            let me = this;
            return (me.$parent.currentServer === me.record.serverType + '-' + me.record.name) ? true : false;
        },
        gitSiteBranchs() {
            const me = this;
            me.$parent.currentDomain = '';
            const data = {
                cmd : 'gitSiteBranchs',
                serverName : me.record.name,
                serverType : me.record.serverType,
                target : me.host
            }
            me.$parent.currentServer = me.record.serverType + '-' + me.record.name;
            me.root.dataEngine()[(me.host === 'local') ? 'appPost' : 'gridHub'](data, function(result) {
                if (result.status === 'success') {
                    me.branches = result.list;
                } else {
                    me.branches = [];
                }
            });
        },

        switchBranch(branch) {
            var me = this;
            const data = {
                cmd :'gitSwitchBranch',
                serverName : me.record.name,
                serverType : me.record.serverType,
                branch     : branch,
                target : me.host
            }
            me.root.dataEngine()[(me.host === 'local') ? 'appPost' : 'gridHub'](data, function(result) {
            // me.root.dataEngine().appPost(data, function(result) {
                if (result.status !== 'success') {
                    me.branches = [];
                    result.message += ' The request can not go through!';
                    me.root.alertComp().show(result);
                } else {
                    me.parent.getServerList();
                    me.branches = [];
                }
            }, true);        
        }
    }
}
</script>
 
<style>
</style>