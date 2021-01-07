<template>
    <div class="card p-1 text-left p-2 alert-dark">
        <span>
            <button class="btn btn-success btn-sm m-1" :disabled="menuDisabled('addTask')" v-on:click="addTask();">Add</button>
            <button class="btn btn-success btn-sm m-1" :disabled="menuDisabled('allTasks')" v-on:click="switchmodule('allTasks');">All Tasks</button>
            <button class="btn btn-success btn-sm m-1" :disabled="menuDisabled('cronTask')" v-on:click="switchmodule('cronTasks');">Cron Task</button>
        </span>
    </div>
</template>
<script>
module.exports = {
    props: [],
    data: function() {
        return {
            root : this.$parent.root
        }
    },
    mounted () {
    },
    methods :{
        menuDisabled(v) {
           return (this.$parent.module === v) ? true : false
        },
        switchmodule(v) {
            this.$parent.module = v;
        },
        addTask() {
            const me= this;
            me.$parent.passCommand('');
            me.$parent.module = 'addTask';
        }
    },
    components: {
    }
}
</script>
 
<style>

</style>
