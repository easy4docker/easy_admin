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
        isLocalhost() {
            return (window.location.hostname === 'localhost') ? true : false;
        },
        gridHub(setting, callback, triggerSpinner) {
            var me = this;
            let svr = localStorage.getItem('easydockerSVR'),
                token = localStorage.getItem('easydockerTOKEN');
            svr = (!svr) ? '' :  svr.replace(/\_/g, '.');
            
            if (!svr || !token || !me.isLocalhost()) {
                me.appPost({
                        cmd     : 'gridHub',
                        data    : setting,
                    },
                    function(result) {
                        me.$parent.triggerSpinner = false;
                         callback(result);
                        
                    }, triggerSpinner);
            } else {
                me.$parent.triggerSpinner = (!triggerSpinner) ? false : true;
                $.ajax({
                    type        : 'POST',
                    url         : 'http://' + svr + ':10000/_gridHub/',
                    data        : {
                        data :setting,
                        gridToken   : token
                    },
                    success: function(result) {
                        me.$parent.triggerSpinner = false;
                        if (typeof  callback === 'function') {
                             callback(result);
                        }
                    },
                    error: function (jqXHR) { 
                        me.$parent.triggerSpinner = false;
                        if (typeof  callback === 'function') {
                             callback({statu : 'failure', message : 'failure request.', result : jqXHR.responseText});
                        }
                    },
                    dataType: (!setting.dataType) ? 'json' : setting.dataType
                });
            }
        },
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
