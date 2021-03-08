<template>
    <span class="text-left">
        <span v-if="$parent.currentDomain !== record.serverName">
            Domain : {{(!record.domain) ? 'N/A' : record.domain}} &nbsp;
            <a href="JavaScript: void(0)" v-on:click="edit()"><i class="fa fa-pencil ml-3" aria-hidden="true"></i></a>
        </span>
        <span class="input-group"  v-if="$parent.currentDomain === record.serverName">
            <input type="text" class="form-control" placeholder="Input your domain" v-model="form.domain"  aria-describedby="basic-addon2">
            <div class="input-group-append">
                <button class="btn btn-info" v-on:click="save(form)" type="button" :disabled="isDisabledButton()" >Update</button>
            </div>
        </span>
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
            errors: {},
            form : {
                targetHost : me.host,
                serverName :  me.record.serverName,
                domain    : me.record.domain
            }
        }
    },
    mounted() {
        var me = this;
    },
    methods : {
        edit() {
            const me = this;
            me.$parent.currentDomain = me.record.serverName;
            me.$parent.currentServer = "";
        },
        isDisabledButton() {
            return (this.form.domain === this.record.domain) ? true : false;
        },
        save(postData) {
            const me = this;
            if (postData.targetHost === 'local') {
                me.root.dataEngine().appPost({
                    cmd :'updateDomain',
                    data : postData
                }, function(result) {
                    if (result.status === 'success') {
                        me.root.module = 'list';
                        me.$parent.currentDomain = "";
                        me.parent.getServerList();
                    }
 
                }, true);
            } else {
                me.root.dataEngine().gridHub({
                    cmd : 'updateDomain',
                    target : postData.targetHost,
                    data : postData
                },
                function(result) {
                    if (result.status === 'success') {
                        me.root.module = 'list';
                        me.$parent.currentDomain = "";
                        me.parent.getServerList();
                    }
                }, true);
            }
             
        },
        isError() {
            const me = this;
            return (!me.errors || !Object.keys(me.errors).length) ? false : true;
        }
    }
}
</script>
 
<style>

</style>
