<template>
<div class="card shadow m-2 mr-1 p-3 mt-0">
    <div class="card-body card-form-section text-left ">
        <form>
            <div class="form-group">
                <label>Repository git URI</label>
                <input type="text" class="form-control" v-model="form.gitHub" @input="changedGit" placeholder="A Git URI">
            </div>
            <div class="form-group">
                <div class="container-fluid border border-2 p-2 alert-secondary rounded">
                    <div class="row">
                        <div class="col-6">
                            <label>Repository username</label>
                            <input type="text" class="form-control" v-model="form.userName"  placeholder="Rep. username">                        
                        </div>
                        <div class="col-6">
                            <label>Repository password</label>
                            <input type="password" class="form-control" v-model="form.password" placeholder="Rep. password">
                        </div>
                    </div>    
                </div>
            </div>

            <div class="form-group">
                <label>Target Host</label>
                <select class="form-control" :required="true" @change="onTargetHostSelect($event)" v-model="form.targetHost">
                    <option value="local" :selected="form.targetHost === 'local'" >Local</option>
                    <option 
                        v-for="(v, k) in root.gridMatrix" 
                        v-bind:value="k"
                        :selected="k ==  form.targetHost"
                        >{{ k }}
                    </option>
                </select>
                <!--button type="button" class="btn btn-primary m-1" v-on:click="switchBranch()">Confirm</button-->
            </div>

            <button type="button"  class="btn btn-info" v-on:click="setupServer(form)">Setup Server</button>
            <button type="button"  class="btn btn-secondary" v-on:click="reset()">Reset</button>
            <button type="button"  class="btn btn-warning" v-on:click="cancel()">Cancel</button>
            <div class="text-danger p-3" v-if="isError()">
                <b>Please correct the following error(s):</b>
                <ul>
                <li v-for="(v, k) in errors">{{v}}</li>
                </ul>
            </div>
        </form>
    </div>
</div>
</template>
 
<script>
module.exports = {
    props : [],
    data: function() {
        var me = this;
        return {
            root :  this.$parent.root,
            errors: {},
            form : {
                gitHub      : '',
                userName    : '',
                password    : '',
                targetHost  : 'local'
            }
        }
    },
    mounted() {
        var me = this;
    },
    methods : {
        onTargetHostSelect(event) {

        },
        cleanForm() {
            var me = this;
            me.form.userName = '';
            me.form.password = '';
            
            me.form.targetHost = 'local';
        },
        changedGit(e) {
            var me = this;
            me.form.gitHub = e.target.value.replace(/^\s+|\s+$/g, '');
            me.cleanForm();
        },
        setupServer(postData) {

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
            //me.$forceUpdate();
        },
        reset() {
            var me = this;
            me.form.gitHub = '';
            me.cleanForm();
        },
        cancel() {
            this.root.module = 'list';
        },

        isLocalhost() {
            return (window.location.hostname === 'localhost') ? true : false;
        },
        isformValid() {
            var me = this;
            return (!Object.keys(me.errors).length) ? true : false;
        },
        gitUrlValidation() {
            var me = this;
            me.errors.gitHub = null;
            var regex = /^(git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
            
            if (!me.form.gitHub) {
                me.errors.gitHub = 'Github URI required.';
            } else if (!regex.test(me.form.gitHub)) {
                me.errors.gitHub = 'Incorrect github URI.';
            } else {
                delete me.errors.gitHub;
            }
            return (!me.errors.gitHub) ? true : false;
        },
        isError() {
            const me = this;
            return (!me.errors || !Object.keys(me.errors).length) ? false : true;
        }
    }
}
</script>
 
<style>
.noFormImage {
    min-width: 100%;
    min-height :512px;
    background-image: url("/imgs/icon1.png");
    background-color: transparent;
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
}
.dropdown-pick-docker {
    height:20em;
    z-index: 3000;
    width: 800px !important; 
    overflow-y: scroll;
    overflow-x: hidden;
}

.bg-odd {  min-height : 6em; border-bottom: 1px dashed; border-color: #aaa;}
.bg-even {  min-height : 6em;  border-bottom: 1px dashed; border-color: #aaa; }
.border-width-1 {  border-width: 6px; border-color: #999}

input.dockerSetting[readonly] {
  background-color:transparent;
}

.text-capitalize {
  text-transform: capitalize;
}

</style>
