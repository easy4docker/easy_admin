<template>
   <div class="card m-1 local-grid-section">
      <div class="card-body card-form-section text-left ">
         <form>
               <div class="form-group p-2">
                  <label>Grid Admin Server:</label>
                  <input type="text" class="form-control" v-model="form.gridServer"  placeholder="xxx.xxx.xxx">
               </div>
               <div class="form-group p-2">
                  <label>Password:</label>
                  <input type="password" class="form-control" v-model="form.password"  placeholder="">
               </div>
               <button type="button" class="btn btn-info" v-on:click="saveGrid()">Save the virtual host</button>
         </form>
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
        var me = this;
        setTimeout(
            function() {
                me.root.getGridMatrix (); 
            }, 50
        );
   },
   methods : {
      saveGrid() {
         alert('saveGrid');
      }
   }
}
</script>
<style>
.local-grid-section {
    min-height: 20rem
}
</style>