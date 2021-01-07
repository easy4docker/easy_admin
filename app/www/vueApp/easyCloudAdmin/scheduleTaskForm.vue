<template>
    <span>
        <div class="card p-1 text-left cheduleFromSection alert-dark">
            <label class="m-2">Add Your Task 
                <input class="ml-3" type="radio" v-model="form.type" value=""> Command
                <input class="ml-3" type="radio" v-model="form.type" value="C"> Cron Task
            </label>

            <div class="p-2" v-if="form.type === 'C'">
                <label class="mt-2 p-1 mb-0">Task Name:</label>
                <input type="text" class="form-control" v-model="form.name" placeholder="Input cron name">
            </div>   
            <div class="p-2">
                <label class="mt-2 p-1 mb-0">Task Command:</label>
                <input type="text" class="form-control" v-model="form.command" placeholder="Input shell command">

                <comm-cron-schedule v-if="form.type === 'C'" v-bind:schedule.sync="form.schedule"></comm-cron-schedule>
            </div>
            <div class="p-3 text-right">
                <button class="btn btn-success btn-sm m-1" :disabled="saveDisable()" v-on:click="saveTask();">Submit</button>
                <button class="btn btn-secondary btn-sm m-1" v-on:click="cancel();">Cancel</button>
            </div>    
        </div>
    </span>
</template>
<script>
module.exports = {
    props: [],
    data: function() {
        const me = this;
        return {
            root : this.$parent.root,
            form : {
                name : '',
                command : '',
                type : '',
                schedule : null
            }
        }
    },
    mounted () {
    },
    methods :{
        getList(n) {
            const a=[];
            for (i=0 ; i < n; i++) a.push(i);
            return a;
        },
        saveDisable () {
            if (!this.form.type) {
                return (!this.form.command) ? true : false;
            }
            if (this.form.type === 'C') {
                return (!this.form.command || !this.form.schedule || !this.form.name) ? true : false;
            }        
        },
        saveTask () {
            var me = this;
            const data = me.form; 
            data.cmd = 'saveTask';
            me.root.dataEngine(me).saveTask(data, function(result) {
                me.cancel()
                setTimeout(
                    function() {
                        me.$parent.askBackendStatus();
                    }, 1000);
            });
        },
        cancel() {
            var me = this;
            me.$parent.command = '';
            me.$parent.module = '';
        }
    },
    components: VUEApp.loadComponents({
        LOAD    : {
            'commCronSchedule'     : '/vueApp/easyCloudAdmin/commCronSchedule.vue'
        }
    })
}
</script>
 
<style>
.scheduleFromSection {
    min-height : 6rem;
}
</style>
