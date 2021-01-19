<template>
</template>

<script>
module.exports = {
    props: [],
    data: function() {
        return {
            caller : null
        }
    },
    created() {
        var me = this;
    },
    methods :{
        withAuth(data) {
            let v = localStorage.getItem('easydockerFP');
            if (v) {
                data.authToken = v;
            }
            return data;
        },
        ajaxPost(data, callback, isSpinner) {
            var me = this;
            if (isSpinner) me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url:'/api',
                data: me.withAuth(data),
                success: function(result) {
                    if (isSpinner) me.$parent.triggerSpinner = false;
                    callback(result)
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    if (isSpinner) me.$parent.triggerSpinner = false;
                    callback('error result');
                },
                dataType: 'JSON'
            });
        },
 
        gridPost(setting, success, error) {
            var me = this;
            me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url: '/_gridHub/',
                data: setting,
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    if (typeof  success === 'function') {
                        success(result);
                    }
                },
                error: function (jqXHR) { 
                    me.$parent.triggerSpinner = false;
                    if (typeof error === 'function') {
                        error({statu : 'failure', message : 'failure request.', result : jqXHR.responseText});
                    }
                },
                dataType: (!setting.dataType) ? 'text' : setting.dataType
            });
        },
        appPost(setting, success, error) {
            var me = this;
            me.$parent.triggerSpinner = true;
            let data = {cmd: 'gridHub', setting : setting};
 
            $.ajax({
                type: 'POST',
                url: '/_grid/',
                data: setting,
                success: function(result) {
                    console.log('===sss==1=');
                    me.$parent.triggerSpinner = false;
                    if (typeof  success === 'function') {
                        success(result);
                    }
                },
                error: function (jqXHR) { 
                    me.$parent.triggerSpinner = false; 
                    if (typeof error === 'function') {
                        error({statu : 'failure', message : 'failure request.', result : jqXHR.responseText});
                    }
                },
                dataType: (!setting.dataType) ? 'text' : setting.dataType
            });
        },
        runPost(url, cmd, params, success, error) {
            var me = this;
            me.$parent.triggerSpinner = true;
            let data = params;
            data.cmd = cmd;
            $.ajax({
                type: 'POST',
                url: url,
                data: me.withAuth(data),
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    if (typeof  success === 'function') {
                        success(result);
                    }
                },
                error: function (jqXHR) { 
                    me.$parent.triggerSpinner = false;
                    if (typeof error === 'function') {
                        error({statu : 'failure', message : 'failure request.', result : jqXHR.responseText});
                    }
                },
                dataType: 'JSON'
            });
        },
        startVServer(record) {
            var me = this;

            me.$parent.triggerSpinner = true;

            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'startVServer',
                    serverName : record.name,
                    serverType : record.serverType
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    console.log(result);
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                },
                dataType: 'JSON'
            });
        },
        switchBranch(record, branch, callback) {
            var me = this;

            me.$parent.triggerSpinner = true;
            console.log(record);
            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'gitSwitchBranch',
                    serverName : record.serverName,
                    serverType : record.serverType,
                    branch     : branch
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    if (callback) callback(result);
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                    if (callback) callback(result);
                },
                dataType: 'JSON'
            });
        },
        stopVServer(record) {
            var me = this;

            me.$parent.triggerSpinner = true;

            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'stopVServer',
                    serverName : record.name,
                    serverType : record.serverType
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    console.log(result);
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                },
                dataType: 'JSON'
            });
        },
        saveVserverValiables(record, callback) {
            var me = this;
            var rec = record;
            rec.cmd = 'saveVserverValiables';
            me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url:'/api',
                data: rec,
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    callback(result);
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                    callback({status : 'failure', message : 'engine error'});
                },
                dataType: 'JSON'
            });
        },
        getVserverValiables(record, callback) {
            var me = this;
            var rec = record;
            rec.cmd = 'getVserverValiables';
            me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url:'/api',
                data: rec,
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    callback(result);
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                    callback({status : 'failure', message : 'engine error'});
                },
                dataType: 'JSON'
            });
        },
        pullCode(record) {
            var me = this;
            me.$parent.triggerSpinner = true;

            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'pullCode',
                    serverName : record.name,
                    serverType : record.serverType
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    console.log(result);
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                },
                dataType: 'JSON'
            });
        },
        viewLogs(record) {
            var me = this;
            me.$parent.triggerSpinner = true;

            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'viewLogs',
                    serverName : record.name,
                    serverType : record.serverType
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    console.log(result);
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                },
                dataType: 'JSON'
            });
        },
        removeVirtualServer(data, callback) {
            var me = this;
            me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'deleteVServer',
                    data : data
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    if (result.status === 'success') {
                        callback(result);
                    }
                },
                dataType: 'JSON'
            });
        },
        getDbMysqlList(noSpinner, callback) {
            var me = this;
            me.ajaxPost({
                    cmd :'getDbMysqlList'
                }, callback, !noSpinner);
        },
        getVServerList(noSpinner, callback) {
            this.ajaxPost({
                cmd :'loadList'
            }, callback, !noSpinner);
        },
        askToken(item, callback) {
            this.ajaxPost({
                cmd :'askToken',
                serverType : item.serverType,
                serverName : item.name
            }, callback, false);
        },
        loadPublicDockersList(noSpinner, callback) {
            var me = this;
            if (!noSpinner) {
                me.$parent.triggerSpinner = true;
            }
            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'loadPublicDockersList'
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    if (callback) callback(result.list);
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                },
                dataType: 'JSON'
            });
        },
        gitSiteBranchs(record, callback) {
            var me = this;
            me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'gitSiteBranchs',
                    serverName : record.serverName,
                    serverType : record.serverType
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    callback(result);
                },
                dataType: 'JSON'
            });
        },
        gitRemoteBranchs (gitRecord, callback) {
            var me = this;
            me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'gitRemoteBranchs',
                    data : gitRecord
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    callback(result);
                },
                dataType: 'JSON'
            });
        },
        saveVServerForm(data, callback) {
            var me = this;
            me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'addServer',
                    data: data
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    if (result.status === 'success') {
                        // me.getVServerList();
                    }
                    callback(result); 
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                },
                dataType: 'JSON'
            });
        }
    }
}
</script>
 
<style>
</style>
