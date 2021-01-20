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
               <button type="button" class="btn btn-info" v-on:click="accessGrid()" v-if="!isGrid()">Access the Grid</button>
               <button type="button" class="btn btn-danger" v-on:click="removeGrid()" v-if="isGrid()">Remove the Grid</button>
               <div class="local-grid-error">{{error}}</div>
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
        me.form.gridServer = (!localStorage.getItem('easydockerSVR')) ? '' : localStorage.getItem('easydockerSVR').replace(/\_/g, '.');
   },
   methods : {
      isGrid() {
         return (!localStorage.getItem('easydockerSVR') || !localStorage.getItem('easydockerTOKEN')) ? false : true
      },
      accessGrid() {
         const me = this;
         me.root.dataEngine().appPost({
            url  : '/_grid/',
            cmd     :'gridAccess',
            data    : me.form,
            dataType: 'json',
            gridToken   : '49ba83ae33879460f8cbcd491ef1d1a5'
         },
         function(result) {
            console.log(result);
            localStorage.setItem('easydockerSVR', result.gridServer.replace(/\./g, '_'));
            localStorage.setItem('easydockerTOKEN', result.token);
            window.location.reload();
         }, function(err) {
            me.gridServer = false;
            console.log(err);
         });
      },
      removeGrid() {
         const me = this;
         localStorage.removeItem('easydockerSVR');
         localStorage.removeItem('easydockerTOKEN');
         window.location.reload();
      }
   }
}
</script>
<style>
.local-grid-section {
    min-height: 20rem
}
.local-grid-error {
   color : #ff0000
}
</style>