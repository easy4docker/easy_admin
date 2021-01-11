<template>
<div class="card shadow m-2 mr-1 p-3 mt-0">
    <div class="card-body card-form-section text-left ">
        <form>
            <div class="form-group">
                <label>Grid Tag</label>
                <select class="form-control" :required="true" @change="onTagSelect($event)" v-model="form.tag">
                    <option 
                    v-for="tag in tags" 
                    v-bind:value="tag"
                    :selected="tag ==  form.tag"
                    >{{ tag }}</option>
                </select>
            </div>
            <div class="form-group" v-if="branches===null">
                <label>Add Grid Server</label>
                <input type="text" class="form-control" v-model="form.gridServer"  placeholder="Add grid server">
            </div>
            <button type="button" class="btn btn-info" v-on:click="add(form)">Add</button>
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
            publicDockers     : [],
            branches : null,
            tags : ['dev', 'qa', 'prod'],
            form : {
                tag         : '',
                gridServer  : '',
                branch      : '',
                siteDocker  : false,
                publicDocker: '',
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
                me.loadPublicDockersList()
            }, 1000
        );
    },
    methods : {
        add(form) {
            alert(8)
        },
        cleanForm() {
            var me = this;
            me.branches = null;
            me.form.serverName = '';
            me.form.branch = '';
            me.form.siteDocker  = false;
            me.form.publicDocker = '';
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
        loadPublicDockersList() {
            var me = this;
            me.root.dataEngine().loadPublicDockersList(true, function(data) {
                me.publicDockers = data;
            });
        },
        gitRemoteBranchs(gitRecord) {
            var me = this;
            me.gitValidation();
            me.$forceUpdate();
            if (me.isformValid()) {
                me.root.dataEngine().gitRemoteBranchs(gitRecord, function(result) {
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
        onTagSelect(event) {
            var me = this;
            me.form.tag = event.target.value;
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

        selectPublicDocker(v) {
            var me = this;
            me.form.publicDocker = v.code;
            me.form.siteDocker = false;
            me.form.docker = v.setting;
            me.$forceUpdate();
        },
        saveVServer() {
            var me = this;
            me.formValidation();
            if (!me.isformValid()) {
                return false;
            }
            console.log(me.form);
            
            me.root.dataEngine().saveVServerForm(
                me.form, function(result) {
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
        gitValidation() {
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
            me.gitValidation();

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
