<template>
    <span>
        <form>
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Domain" v-model="form.domain"  aria-describedby="basic-addon2">
                <div class="input-group-append">
                    <button class="btn btn-info" v-on:click="save(form)" type="button">Update</button>
                </div>
            </div>
            <div class="text-danger p-3" v-if="isError()">
                <b>Please correct the following error(s):</b>
                <ul>
                <li v-for="(v, k) in errors">{{v}}</li>
                </ul>
            </div>
        </form>
    </span>
</template>
 
<script>
module.exports = {
    props : ['record'],
    data: function() {
        var me = this;
        return {
            root :  this.$parent.root,
            errors: {},
            form : {
                domain    : me.record.domainName
            }
        }
    },
    mounted() {
        var me = this;
    },
    methods : {
        save(postData) {
            /*
            const me = this;
            me.gitUrlValidation();

            if (me.isformValid()) {
                if (postData.targetHost === 'local') {
                    me.root.dataEngine().appPost({
                        cmd :'setupServer',
                        data : postData
                    }, function(result) {
                        if (result.status === 'success') {
                            me.root.module = 'list';
                        }
                        me.$forceUpdate();
                    }, true);
                } else {
                    me.root.dataEngine().gridHub({
                        cmd : 'setupServer',
                        target : postData.targetHost,
                        data : postData
                    },
                    function(result) {
                        if (result.status === 'success') {
                            me.root.module = 'list';
                        }
                        me.$forceUpdate();
                    }, true)
                }

            } 
            */
            //me.$forceUpdate();
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
