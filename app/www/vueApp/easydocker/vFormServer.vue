<template>
<div class="card shadow m-2 mr-1 p-3 mt-0">
    <div class="card-body card-form-section text-left ">
        <form>
            <div class="form-group">
                <label>Repository git URI *</label>
                <input type="text" class="form-control" v-model="form.gitHub" @input="changedGit" placeholder="Repository git URI">
            </div>
            <div class="form-group" v-if="branches===null">
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
            <button type="button" v-if="branches===null" class="btn btn-info" v-on:click="gitRemoteBranchs(form)">Get branchs</button>
            <div v-if="branches!==null" >
                <input type="hidden" v-model="form.userName">
                <input type="hidden"  v-model="form.password" >
            </div>

            <div class="form-group" v-if="branches!==null" >
                <label>Server Name * </label>
                <input type="text" class="form-control" maxlength="64" v-model="form.serverName" placeholder="Server Name">
            </div>

            <div class="form-group" v-if="branches!==null" >
                <label>Branche</label>
                <select class="form-control" :required="true" @change="onBranchSelect($event)" v-model="form.branch">
                    <option 
                    v-for="option in branches" 
                    v-bind:value="option.branch"
                    :selected="option.branch ==  form.branch"
                    >{{ option.branch }}</option>
                </select>
            </div>
            <div v-if="form.docker.type">
            {{form.docker}}
                 <hr/>
                ports: {{ form.docker.ports }} Type: {{form.docker.type}}
                 <hr/>
            </div>
            <hr/>
            <button type="button" v-if="branches!==null" class="btn btn-info" v-on:click="saveVServer()">Save the virtual host</button>
            <!--button type="button" class="btn btn-warning" v-on:click="reset()">Reset fields</button-->
            <!--button type="button" class="btn btn-secondary" v-on:click="cancel()">Cancel</button-->
            
            <hr/>
            <div class="text-danger p-3"  v-if="!isformValid()">
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
            branches : null,
            form : {
                serverName  : '',
                gitHub      : '',
                branch      : '',
                siteDocker  : false,
                serverType  : '',
                docker: {
                    type : '',
                    ports : []
                },
            }
        }
    },
    mounted() {
        var me = this;
        setTimeout(
            function() {
            }, 1000
        );
    },
    methods : {
        initForm() {
            var me = this;
            me.branches = null;
            me.form = {
                serverName  : '',
                gitHub      : '',
                branch      : '',
                siteDocker  : false,
                docker: {
                        type : '',
                        ports : []
                }
            };

        },
        cleanForm() {
            var me = this;
            me.branches = null;
            me.form.serverName = '';
            me.form.branch = '';
            me.form.siteDocker  = false;
            me.form.docker = {
                    type : '',
                    ports : []
                };

        },
        changedGit(e) {
            var me = this;
            me.form.gitHub = e.target.value.replace(/^\s+|\s+$/g, '');
            me.cleanForm();
        },

        gitRemoteBranchs(gitRecord) {
            var me = this;
            me.gitUrlValidation();
            if (me.isformValid()) {
                me.root.dataEngine().appPost({
                    cmd :'gitRemoteBranchs',
                    data : gitRecord
                }, function(result) {
                    if (result.status === 'success') {
                        me.branches = result.list;
                    } else {
                        me.branches = [];
                        me.errors.gitHub = result.message;
                    }
                    me.getInitBranch();
                    me.getSiteDocker();
                    me.$forceUpdate();
                });
            }
        },
        getInitBranch() {
            var me = this;
            for (var i = 0; i < me.branches.length; i++) {
                if (me.form.branch === me.branches[i].branch) {
                    return true;
                }
            }
            me.form.branch = (me.branches.length) ? me.branches[0].branch : '';
        },
        onBranchSelect(event) {
            var me = this;
            me.form.branch = event.target.value;
            me.getSiteDocker();
        },

        getSiteDocker() {
            var me = this;
            if (me.branches) {
                for (var i = 0; i < me.branches.length; i++) {
                    if (me.form.branch === me.branches[i].branch && me.branches[i].dockerSetting.type) {
                        me.form.siteDocker = true;
                        me.form.docker = me.branches[i].dockerSetting;
                        me.form.serverType = me.form.docker.type;
                        me.$forceUpdate();
                    }
                }
            }
        },
        saveVServer() {
            const me = this;
            me.formValidation();
            if (!me.isformValid()) {
                return false;
            }
            const data = {cmd: 'addServer', data: me.form};
            me.root.dataEngine().appPost(
                data, function(result) {
                    if (result.status === 'success') {
                        // me.$parent.cancel();
                        // me.$parent.getVServerList();
                        me.root.module = 'list';
                    }
                }
            );
        },

        reset() {
            var me = this;
            me.form = {};
            me.errors={};
            me.branches = [];
        },
        /*
        cancel() {
            var me = this;
            me.reset();
            me.$parent.module = '';
        },*/
        isformValid() {
            var me = this;
            return (!Object.keys(me.errors).length) ? true : false;
        },
        isServerNameExist(name) {
            var me = this, list = me.root.commonData.list
            for (e in list) {
                console.log(e);
                if (list[e].serverName == name) {
                    return true;
                }
            }
            return false;
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
        formValidation() {
            var me = this;
            me.errors = {};
            me.gitUrlValidation();

            if (!me.form.serverName) {
                me.errors.serverName = 'ServerName required.';
            }

            if (me.isServerNameExist(me.form.serverName)) {
                me.errors.serverName = 'ServerName required.';
            }

            if (!me.form.docker.type) {
                me.errors.dockerSetting = 'Docker Setting Required.';
            }
            
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
