<template>
    <div class="text-left p-2 alert-secondary border rounded grids-list-section">
        <div class="text-center">Grids<span v-if="root.gridAdminServer"> on {{root.gridAdminServer}}</span></div>
        <hr v-if="(root.gridMatrix) &&  Object.keys(root.gridMatrix).length"/>
        <span v-for="(v, k) in root.gridMatrix">
            <div class="pr-3">
                <input type="checkbox" v-model="checked(k)" v-on:click="root.setGridSvr(k)"><span class="pl-2">{{ k }}</span> 
                <div class="text-right text-info pl-1">
                    <div class="progress bg-secondary ml-3 m-1">
                        <div class="progress-bar bg-success" v-bind:style="{width: (Math.ceil((v.MemAvailable / v.MemTotal)  * 100) + '%')}" >
                        {{Math.round(v.MemAvailable  * 0.001)}}M
                        </div>
                    </div>
                </div>

            </div>
        </span>
        <div class="text-center" v-if="root.isLocalhost()">
            <hr/>
            <button type="button" class="btn btn-sm btn-warning" v-on:click="removeGrid()" v-if="showRemoveGrid()">
                Remove Grid Monitor
            </button>
            <button type="button" class="btn btn-sm btn-success" v-if="!showRemoveGrid()"
                v-on:click="addGridMonitor()">
                Add Grid Monitor
            </button>
            <hr/>
        </div>
        <span style="display:none">{{root.TM}}</span>
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
        checked(v) {
            var me = this;
            return (me.root.gridSvrs[v]) ? true : false;
        },
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
