$(document).ready(
    function() {
        $(document).ready(
            function() {
                new Vue({
                    el: '#vHostApp',
                    data: function() {},
                    mounted () {
                    },
                    methods :{
                    },
                    components: VUEApp.loadComponents({
                        LOAD    : {}, 
                        TPL :{
                            'appRoot' : '/vueApp/easydocker/appRoot.vue',
                            'addGridMonitor' : '/vueApp/easydocker/popUpModals/addGridMonitor.vue'
                        }
                    })
                });
            }
        )
    }
) 
