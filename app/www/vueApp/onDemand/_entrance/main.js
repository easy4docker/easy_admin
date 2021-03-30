$(document).ready(
    function() {
        $(document).ready(
            function() {
                new Vue({
                    el: '#EasyOndemandDemo',
                    data: function() {},
                    mounted () {
                    },
                    methods :{
                    },
                    components: VUEApp.loadComponents({
                        LOAD    : {}, 
                        TPL :{
                            'appRoot' : '/vueApp/onDemand/appRoot.vue'
                        }
                    })
                });
            }
        )
    }
) 
