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
        ajaxPost(data, callback, isSpinner) {
            var me = this;
            if (isSpinner) me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url:'/_cloud/?token=' + me.$parent.token,
                data: data,
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
        ajaxPostText(data, callback, isSpinner) {
            var me = this;
            if (isSpinner) me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url:'/_cloud/?token=' + me.$parent.token,
                data: data,
                success: function(result) {
                    if (isSpinner) me.$parent.triggerSpinner = false;
                    callback(result)
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    if (isSpinner) me.$parent.triggerSpinner = false;
                    callback('error result');
                },
                dataType: 'TEXT'
            });
        },
        doPost(data, callback) {
            var me = this;
            me.ajaxPost(data, callback, true);
        },
        saveTask(data, callback) {
            var me = this;
            me.ajaxPost(data, callback, true);
        },
        askLogContent(data, callback) {
            var me = this;
            me.ajaxPostText(data, callback, true);
        },
        askOutput(data, callback) {
            var me = this;
            me.ajaxPostText(data, callback, true);
        }
    }
}
</script>
 
<style>
</style>
