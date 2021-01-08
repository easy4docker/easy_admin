<template>
        <div class="container-fluid m-0 text-left">
            <div class="row">
                <div class="col-3 p-1">

                <div class="card p-1 mb-1 alert-secondary" >
                        <div class="form-control card p-2 text-center alert-dark">
                            <div class="container-fluid m-0 text-center">
                                <div class="row">
                                    <div class="col-11 p-0">
                                        API Documents
                                    </div>
                                    <div class="col-1 p-0">
                                        <a href="JavaScript:void(0)" v-on:click="toggle('appDocs')">
                                            <i v-if="expand.appDocs" class="fa fa-minus"></i>
                                            <i v-if="!expand.appDocs" class="fa fa-plus"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="expand.appDocs" class="text-left p-1 pl-2 list_file_section">
                            <div v-for="item in appDocs">
                                <a href="JavaScript:void(0)" v-on:click="selectDoc(item)">{{item.caption}}</a>
                            </div>
                        </div>
                    </div>

                    <div class="card p-1 mb-1 alert-secondary" >
                        <div class="form-control card p-2 text-center alert-dark">
                            <div class="container-fluid m-0 text-center">
                                <div class="row">
                                    <div class="col-1 p-0">
                                        <a href="JavaScript:void(0)" v-on:click="pullGitCode()">
                                            <i class="fa fa-github"></i>
                                        </a>
                                    </div>
                                    <div class="col-10 p-0">
                                        Local Scripts ({{localScripts.length}})
                                    </div>
                                    <div class="col-1 p-0">
                                        <a href="JavaScript:void(0)" v-on:click="toggle('localScripts')">
                                            <i v-if="expand.localScripts" class="fa fa-minus"></i>
                                            <i v-if="!expand.localScripts" class="fa fa-plus"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="expand.localScripts" class="text-left p-1 pl-2 list_file_section">
                            <div v-for="item in localScripts">
                                <a href="JavaScript:void(0)" v-on:click="passCommand(item.name)">{{item.name}}</a>
                            </div>
                        </div>
                    </div>

                    <div class="card p-1 mt-1 alert-secondary">

                        <div class="form-control card  p-2 text-center alert-dark">
                            <div class="container-fluid m-0 text-center">
                                <div class="row">
                                    <div class="col-11 p-0">
                                        Logs ({{logs.length}})
                                    </div>
                                    <div class="col-1 p-0">
                                        <a href="JavaScript:void(0)" v-on:click="toggle('logs')">
                                            <i v-if="expand.logs" class="fa fa-minus"></i>
                                            <i v-if="!expand.logs" class="fa fa-plus"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div v-if="expand.logs" class="text-left p-1 pl-2 list_file_section">
                            <div v-for="item in logs">
                                <a href="JavaScript: void(0)" v-on:click="deleteFile('log', item.name)" class="mr-1">
                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                </a>
                                <a href="JavaScript:void(0)" v-on:click="showFileContent('log', item.name)">{{item.name}}</a>
                            </div>
                        </div>
                    </div>

                    <div class="card p-1 mt-1 alert-secondary">

                        <div class="form-control card  p-2 text-center alert-dark">
                            <div class="container-fluid m-0 text-center">
                                <div class="row">
                                    <div class="col-11 p-0">
                                        Cron Tasks ({{Object.keys(cronTasks).length}})
                                    </div>
                                    <div class="col-1 p-0">
                                        <a href="JavaScript:void(0)" v-on:click="toggle('cronTasks')">
                                            <i v-if="expand.cronTasks" class="fa fa-minus"></i>
                                            <i v-if="!expand.cronTasks" class="fa fa-plus"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="expand.cronTasks" class="text-left p-1 pl-2 list_file_section">
                            <div v-for="(item, key) in cronTasks">
                                <a href="JavaScript: void(0)" v-on:click="removeCron(key)" class="mr-1">
                                    Remove
                                </a>
                                <a href="JavaScript:void(0)" v-on:click="showFileContent('cronTask', key)">
                                    {{item.name}}, {{item.schedule}}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="card p-1 mt-1 alert-secondary">
                        <div class="form-control card  p-2 text-center alert-dark">
                            <div class="container-fluid m-0 text-center">
                                <div class="row">
                                    <div class="col-11 p-0">
                                        Output Data ({{outputs.length}})
                                    </div>
                                    <div class="col-1 p-0">
                                        <a href="JavaScript:void(0)" v-on:click="toggle('outputs')">
                                            <i v-if="expand.outputs" class="fa fa-minus"></i>
                                            <i v-if="!expand.outputs" class="fa fa-plus"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div v-if="expand.outputs" class="text-left p-1 pl-2 list_file_section">
                            <div v-for="item in outputs">
                                <a href="JavaScript:void(0)" v-on:click="showOutput(item.name)">{{item.name}}</a>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="col-9 p-1">
                    <app-menu></app-menu>
                    <div v-if="!appDoc" class="card main_list_file_section p-1 alert-secondary" >
                        
                        <span v-if="module=='addTask'">
                            <schedule-task-form ref="scheduleTaskForm"></schedule-task-form>
                        </span>
                        <div v-if="module=='allTasks'" class="text-left p-1 pl-2" v-for="item in scheduledTasks">
                            <a href="JavaScript:void(0)" v-on:click="showLog(item.name)">{{item.name}}</a>
                        </div>
                        <div v-if="module=='cronTasks'" class="text-left p-1 pl-2" v-for="item in cronTasks">
                            <a href="JavaScript:void(0)" v-on:click="showLog(item.name)">{{item.name}}</a>
                        </div>
                        <div v-if="module=='showFileContent'" class="card p-1 text-center alert-success">
                            <show-file-content ref="showFileContent"></show-file-content>
                        </div>
                        <div v-if="module=='showOutput'"  class="card p-1 text-center alert-success">
                            <show-output ref="showOutput"></show-output>
                        </div>
                    </div>
                    <app-doc-frame v-if="appDoc" v-bind:appdoc="appDoc"></app-doc-frame>
                </div>
            </div>
        </div> 
</template>
 
<script>
module.exports = {
    data: function() {
        return {
            root            :  this.$parent.root,
            localScripts    : [],
            scheduledTasks  : [],
            logs            : [],
            cronTasks       : [],
            outputs         : [],
            module          : '',
            expand          : {
                appDocs         : true,
                localScripts    : false,
                logs            : false,
                cronTasks       : false,
                outputs         : false
            },
            appDocs : [
                {code: 'howToSetup', caption: 'How To Setup'}, 
                {code: 'howToAPI', caption: 'How To Make API request'}
            ],
            appDoc  : false
        }
    },
    mounted () {
        var me = this;
        setTimeout(
            function() {
                me.askBackendStatus()
            }, 50
        )
    },
    methods :{
        selectDoc(doc) {
            this.appDoc = doc;
        },
        triggerFrom(v) {
            const me = this;
            me.module = 'addTask'; 
            setTimeout(function() {
                me.$refs.scheduleTaskForm.form.command = (!v) ? '' : ('node ' + v);
                me.$refs.scheduleTaskForm.form.type = (!v) ? '' : 'C'; 
            }, 100);
        },
        deleteFile(type, fn) {
            var me = this;
            const data = {cmd: 'deleteFile', type: type, fileName: fn };
            me.root.dataEngine(me).doPost(data, function(result) {
                me.module = '';
                me.askBackendStatus();
            });
        },
        showFileContent(type, fileName) {
            var me = this;
            me.module = 'showFileContent';
            setTimeout(
                function() {
                    me.$refs.showFileContent.fileName = fileName;
                    me.$refs.showFileContent.fileType = type;
                    me.$refs.showFileContent.refresh = new Date().getTime();
                }, 100
            );
        },
        removeCron(fn) {
            var me = this;
            const data = {cmd: 'removeCron', fileName: fn };
            me.root.dataEngine(me).doPost(data, function(result) {
                me.module = '';
                me.askBackendStatus();
            });
        },

        pullGitCode() {
            var me = this;
            const data = {cmd : 'pullGitCode'};
            me.root.dataEngine(me).doPost(data, function(result) {
                me.askBackendStatus();
            });
        },
        showOutput(v) {
            var me = this;
            me.module = 'showOutput';
            setTimeout(
                function() {
                    me.$refs.showOutput.fileName = v;
                }, 100
            );
        },
        askBackendStatus() {
            var me = this;
            const data = {};
            data.cmd = "askBackendStatus";
            
            me.root.dataEngine(me).doPost(data, function(result) {
                me.localScripts =  result.localScripts.filter(function(item) {
                   return  (/\.js$/.test(item.name)) ? true : false
                });
                me.scheduledTasks =  result.scheduledTasks;
                me.cronTasks =  result.scheduledTasks;
                me.logs =  result.logs;
                me.outputs =  result.outputs;
            });
        },
        passCommand(v) {
            const me = this;
            me.module = 'allTasks';
            me.triggerFrom(v);
        },
        toggle(v) {
            this.expand[v] = (!this.expand[v]) ? true : false;
        }
    },
    components: VUEApp.loadComponents({
        TPL :{
            'scheduleTaskForm' : '/vueApp/easyCloudAdmin/scheduleTaskForm.vue',
            'appMenu' : '/vueApp/easyCloudAdmin/appMenu.vue',
            'showFileContent' : '/vueApp/easyCloudAdmin/showFileContent.vue',
            'showOutput' : '/vueApp/easyCloudAdmin/showOutput.vue',
            'appDocFrame' : '/vueApp/easyCloudAdmin/appDocs/appDocFrame.vue'
        },
        LOAD    : {}
    })
}
</script>
 
<style>
.list_file_section { height : 10rem; overflow-y: auto;}
.main_list_file_section { min-height : 40.2rem; overflow-y: auto;}
</style>
