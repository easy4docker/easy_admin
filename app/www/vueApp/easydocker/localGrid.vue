<template>
   <span>
      <div class="card m-1">
         <div class="m-1 p-3 card-body">
             <input type="text" class="form-control" v-model="form.gridServer"  placeholder="xxx.xxx.xxx">
         </div>
         <div class="m-1 p-3 card-body">
             <input type="text" class="form-control" v-model="form.password"  placeholder="xxx.xxx.xxx">
         </div>
      </div>
   </span>
</template>
 
<script>
module.exports = {
   props: [],
   data: function() {
      return {
         root :  this.$parent.root,
         form : {
            gridServer : '',
            password : ''
         }
      }
   },
   mounted() {
      const me = this;
   },
   methods : {}
}
</script>
<style>
</style>