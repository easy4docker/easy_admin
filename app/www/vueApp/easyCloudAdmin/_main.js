$(document).ready(function(){
    var app = new Vue({
        el: '#vCloudApp',
        router : new VueRouter({
            mode: 'history',
            routes: []
        }),
        data: {
        },
        mounted () {
        },
        methods :{
        },
        components: VUEApp.loadComponents({
            TPL :{
                'appRoot' : '/vueApp/easyCloudAdmin/appRoot.vue'
            },
            LOAD    : {
               
            }
        })
    });
});