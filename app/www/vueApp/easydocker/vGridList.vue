<template>
    <div class="text-left p-2 alert-secondary border rounded grids-list-section">
        <div class="text-center">Grids<span v-if="root.gridAdminServer"> on {{root.gridAdminServer}}</span></div>
        <hr v-if="(root.gridMatrix) &&  Object.keys(root.gridMatrix).length"/>
        <span v-for="(v, k) in root.gridMatrix">
            <div class="pr-3">
                <input type="checkbox"><span class="pl-2"><a href="javaScript:void(0)" v-on:click="test(k, {s:k})">{{ k }}</a> 
                <div class="text-right text-info pl-3">
                    <div class="progress bg-secondary ml-3">
                        <div class="progress-bar bg-success" v-bind:style="{width: (Math.ceil((v.MemAvailable / v.MemTotal)  * 100) + '%')}" >
                        {{Math.round(v.MemAvailable  * 0.001)}}M
                        </div>
                    </div>
                </div>

            </div>
        </span>
        <span v-if="root.isLocalhost()">
            <hr/>
            <button type="button" class="btn btn-sm btn-warning" v-on:click="removeGrid()" v-if="showRemoveGrid()">
                Remove Grid Monitor
            </button>
            <button type="button" class="btn btn-sm btn-success" v-if="!showRemoveGrid()"
                v-on:click="addGridMonitor()">
                Add Grid Monitor
            </button>
            <hr/>
        </span>
        
    </div>
</template>
 
<script>
module.exports = {
    props : [],
    data: function() {
        let me = this;
        return {
            root :  this.$parent.root

        }
    },
    mounted() {
        var me = this;
        var SVR = localStorage.getItem('easydockerSVR');
        me.root.gridAdminServer = ((SVR) ? SVR : '').replace(/\_/g, '.');
    },
    watch: {
    },
    methods : {
        showRemoveGrid() {
            return (this.root.gridMatrix !== false) ? true : false;
        },
        removeGrid() {
            const me = this;
            localStorage.removeItem('easydockerSVR');
            me.root.gridAdminServer = '';
            localStorage.removeItem('easydockerTOKEN');
            me.root.gridMatrix = false;
        },
        addGridMonitor() {
            const me = this;
            me.root.popUp(me).show({
                insideModule: 'addGridMonitor',
                insideModuleUrl: '/vueApp/easydocker/popUpModals/addGridMonitor.vue',
                data : {

                },
                noDefaultCancel : true
            });
        },
        test(k, dt) {
            const me = this;
            //me.root.gridMatrix[k];
            alert(me.root.gridMatrix[k].gridToken);
        },
        testBK(k, dt) {
            const me = this;
            let svr = localStorage.getItem('easydockerSVR'),
                token = localStorage.getItem('easydockerTOKEN');
                
            svr = (!svr) ? '' :  svr.replace(/\_/g, '.');
            if (!svr || !token) {
                return true;
            }
            me.root.dataEngine().serverPost({
                server  : svr,
                cmd     :'sampleCode',
                data    : {},
                target  : k,
                dataType: 'json',
                gridToken   : token
            },
            function(result) {
                if (result.status === 'success') {
                    console.log(result);
                } else {
                    console.log(result);
                }
                me.$forceUpdate();
            }, function(err) {
                console.log(err);
            });
        }
    },
    components: VUEApp.loadComponents({
        LOAD    : {}, 
        TPL :{}
    })
}
</script>
 
<style>
.text-capitalize {
  text-transform: capitalize;
}
.list-group-border { background-color: #efefef }
.grids-list-section { min-height:30rem}
</style>
