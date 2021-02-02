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
        /* ------------ confirmed ------------*/
        // servier side hub to target  

        gridHub(setting, success, error) {
            var me = this;
            me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url: 'http://' + setting.hubServer + ':10000/_gridHub/',
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

        /* ------------ confirmed ------------*/
        // UI grid  hub to target  
        gridBridgePost(setting, success, error) {
            var me = this;
            me.$parent.triggerSpinner = true;
            me.gridHub({
                hubServer  : setting.hubServer,
                cmd        : 'getServerToken',
                target  : setting.target,
                dataType: 'json',
                gridToken   : setting.gridToken
            }, function(hubData) {
                if (hubData.status !== 'success') {
                    error({success: 'failure', message: 'gridHub getServerToken error'});
                } else {
                    setting.gridToken = hubData.gridToken;
                    $.ajax({
                        type: 'POST',
                        url: 'http://' + hubData.ip + ':10000/_grid/',
                        data: {
                            gridToken : hubData.gridToken,
                            cmd : setting.cmd,
                            data : setting.data
                        },
                        success: function(result) {
                            me.$parent.triggerSpinner = false;
                            if (typeof  success === 'function') {
                                success(result);
                            }
                        },
                        error: function (jqXHR) { 
                            me.$parent.triggerSpinner = false; 
                            if (typeof error === 'function') {
                                error({status : 'failure', message : 'failure request.', result : jqXHR.responseText});
                            }
                        },
                        dataType: (!setting.dataType) ? 'text' : setting.dataType
                    });
                }
            }, function(err) {
                error(err);
            });
        }
    }
}
</script>
 
<style>
</style>
