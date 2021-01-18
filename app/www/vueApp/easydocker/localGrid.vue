<template>
   <div>
      <div class="card m-1 local-grid-section">
         <div class="m-1 p-0 card-body">
            <label>Grid Admin Server:</label>
            <input type="text" class="form-control" v-model="form.gridServer"  placeholder="xxx.xxx.xxx">
         </div>
         <div class="m-1 p-0 card-body">
            <label>Password:</label>
            <input type="text" class="form-control" v-model="form.password"  placeholder="xxx.xxx.xxx">
         </div>
      </div>
   </div>
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
.local-grid-section {
    min-height: 20rem
}
</style>