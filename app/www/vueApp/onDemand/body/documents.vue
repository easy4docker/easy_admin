<template>
    <div class="card m-0 p-1">
        <div class="container-fluid m-0">
            <div class="row">
                <div class="col-12 p-3 m-3 text-left">
                    <h3>This is a demo site for onDemand Service of EasyDocker project</h3>
                    <div class="card p-3 mt-3 mr-2 text-left">
                        <b>How to integrate ondemain on an EasyDocker webServer?</b>
                        <div class="p-2">
                            Write a data file into your docker application folder /var/_localAppData/commCron
                        </div>
                        <div class="pl-3 pt-1 pb-0 alert-secondary">
                            <div class="pl-3 ml-3 mb-0">
                                <pre class="text-success pb-0 mb-0">
                                    {
                                        code : 'addOndemand',
                                        param : {
                                            gitHub : 'your gitHub url',
                                            userName: 'your gitHub user name',
                                            password: 'your gitHub passoerd'
                                        }
                                    }
                                </pre>
                                
                            </div>
                            * For private github repository, userName and password are necessary. Public repository, put null value to both of userName and password.
                        </div>
                    </div>
                    <div class="card p-3 mt-3 mr-2 text-left">
                        <b>How to check onDemand results?</b>
                        <div class="p-2">
                            Files within /var/_sharedFolder/input are input of onDemand backend application.<br/>
                            Files within /var/_sharedFolder/out are output of onDemand backend application.<br/>
                        </div>
                    </div>

                    <div class="card p-3 mt-3 mr-2 text-left">
                        <b>Where is the sample code of onDemand backend application?</b>
                        <div class="p-2">
                            https://github.com/easy4docker/easy_ondemand.git
                        </div>
                    </div>

                    <div class="card p-3 mt-3 mr-2 text-left">
                        <b>What language could be used for implementing onDemand appliication?</b>
                        <div class="p-2">
                            Abbove sample code is written by NodeJs. However, you can use any language as you are familiar. 
                            only need keep dockerSetting folder. Customize dockerSetting/shellScript/_entrypoint.sh and dockerSetting/dockerFile
                        </div>
                    </div>


                    <div class="card p-3 mt-3 mr-2 text-left">
                        <b>How to integrate onDemand admin into your website?</b>
                        <div class="p-2">
                            include next codes into your HTML header<br/>
                            <div v-html="'<br>'"> </div>
                             p { color: red; } >>> {{escapeHtml('<br/')}} ==
                            <link rel="stylesheet" href="//{your domain or server}:10000/spa-package/easyOndemand/easyOndemand.css">
                            <script src="//{your domain or server}:10000/spa-package/easyOndemand.vue"></script>
                            {{<br/>}}
                        </div>
                    </div>

                </div>

            </div>
        </div>
        <div class="container-fluid mt-1 head-menu-2">
        </div>
    </div>
</template>
 
<script>
module.exports = {
    data: function() {
        return {
            root :  this.$parent.root,
            module : ''
        }
    },
    mounted() {
        var me = this;
        var pre= document.querySelector('pre');
        pre.innerHTML= pre.textContent.replace(/(\w)/, '<span>$1');
        var left= pre.querySelector('span').getClientRects()[0].left;
        pre.style.marginLeft= (-left + pre.getClientRects()[0].left)+'px';
        setTimeout(function() {
            me.$forceUpdate();
        }, 100)
        
    },
    watch : {

    },
    methods :{
        escapeHtml(str) {
            return '&lt;link rel="stylesheet" href="//{your domain or server}:10000/spa-package/easyOndemand/easyOndemand.css">';
        },
        htmlEncode(value){
	        return $('<div/>').text(value).html();
        }
    }
}
</script>
 
<style>
</style>
