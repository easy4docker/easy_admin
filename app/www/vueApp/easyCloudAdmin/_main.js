$(document).ready(function(){
    var app = new Vue({
        el: '#vCloudApp',
        data: {
        },
        mounted () {
        },
        methods :{
        },
        components: VUEApp.loadComponents({
            LOAD    : {
                'appRoot' : '/vueApp/easyCloudAdmin/appRoot.vue'
            }
        })
    });
});