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
               <button type="button" class="btn btn-info" v-on:click="accessGrid()">Access the Grid</button>
               =={{error}}==
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
         },
         error : ''
      }
   },
   mounted() {
        var me = this;
   },
   methods : {
      accessGrid() {
         const me = this;
         me.root.dataEngine().runPost('/_grid/', 'gridAccess', me.form,
            function(result0) {
               me.dataEngine().gridPost({
                    server  : me.form.gridServer,
                    cmd     :'getGridMatrix',
                    channel : '_grid',
                    data    : {},
                    type    : 'json',
                    gridToken  : result0.token
                },
                function(result) {
                    console.log('---data--->');
                    console.log(result);
                    if (result.status === 'success') {
                       // me.gridMatrix = result.result;
                    } else {
                       // me.gridServer = null;
                    }
                }, function(err) {
                  //  me.gridServer = false;
                    console.log(err);
                });

            }, function(err) {});
      }
   }
}
</script>
<style>
.local-grid-section {
    min-height: 20rem
}
</style>