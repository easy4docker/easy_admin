<template>
</template>

<script>
module.exports = {
    props: [],
    data: function() {
        return {
            root :  this.$parent.root,
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
        /* ------------ confirmed ------------*/
        // servier side hub to target  
        gridHubBK(setting, success, error) {
            var me = this;
            me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url: (setting.hubServer) ? 'http://' + setting.hubServer + ':10000/_gridHub/' : '/_gridHub/',
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
                dataType: (!setting.dataType) ? 'json' : setting.dataType
            });
        },
        gridHub(setting, success, error) {
            var me = this;
            me.$parent.triggerSpinner = true;
            
            let svr = localStorage.getItem('easydockerSVR'),
                token = localStorage.getItem('easydockerTOKEN');
            svr = (!svr) ? '' :  svr.replace(/\_/g, '.');
            if (!svr || !token) {
                me.appPost(
                    setting,  
                    function(result) {
                        cbk(result.list);
                    }, false);
            } else {
                $.ajax({
                    type: 'POST',
                    url: 'http://' + svr + ':10000/_gridHub/',
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
                    dataType: (!setting.dataType) ? 'json' : setting.dataType
                });
            }
        },
        /* ------------ confirmed ------------*/
        // UI grid hub Bridge to target 

        appPost(data, callback, isSpinner) {
            const me = this;
            if (isSpinner) me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url: (data.url) ? data.url : '/api',
                data: me.withAuth(data),
                success: function(result) {
                    if (isSpinner) me.$parent.triggerSpinner = false;
                    callback(result);
                    // if (result.status !== 'success') {
                    //    me.root.alertComp().show(result);
                    // }
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    if (isSpinner) me.$parent.triggerSpinner = false;
                    callback({statu : 'failure', message : 'failure request.', result : jqXHR.responseText});
                },
                dataType: 'JSON'
            });
        }
    }
}
</script>
 
<style>
</style>
