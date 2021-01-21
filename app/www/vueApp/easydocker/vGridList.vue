<template>
    <div class="text-left p-2 alert-secondary border rounded grids-list-section">
        <div class="text-center">Grid Servers</div>
        <hr/>
        <span v-for="(v, k) in root.gridMatrix">
            <div class="pr-3">
                <input type="checkbox"><span class="pl-2"><a href="javaScript:void(0)" v-on:click="test(k)">{{ k }}</a> 
                <div class="text-right text-info">
                    ({{Math.ceil((v.MemAvailable / v.MemTotal)  * 100)}}% Available)</span> 
                </div>
            </div>
        </span>
        <hr v-if="root.isLocalhost() && Object.keys(root.gridMatrix).length"/>
        <button type="button" class="btn btn-sm btn-warning" v-on:click="removeGrid()" v-if="root.isLocalhost() && isShowRemoveGrid()">
            Remove Grid Monitor
        </button>
        <button type="button" class="btn btn-sm btn-success" v-if="root.isLocalhost() &&  !isShowRemoveGrid()"
            v-on:click="addGridMonitor()">
            Add Grid Monitor
        </button>
        <hr v-if="root.isLocalhost()"/>
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
    },
    watch: {
    },
    methods : {
        isShowRemoveGrid() {
            const me = this;
            return (!localStorage.getItem('easydockerSVR') || !localStorage.getItem('easydockerTOKEN')) ? false : true
        },
        removeGrid() {
            const me = this;
            localStorage.removeItem('easydockerSVR');
            localStorage.removeItem('easydockerTOKEN');
            window.location.reload();
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
        test(k) {
            const me = this;
            let svr = localStorage.getItem('easydockerSVR'),
                token = localStorage.getItem('easydockerTOKEN');
                
            svr = (!svr) ? '' :  svr.replace(/\_/g, '.');
            if (!svr || !token) {
                return true;
            }

            me.root.dataEngine().gridPost({
                server  : svr
                channel    : '_grid',
                cmd     :'testNiuBi',
                data    : {target : k},
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
