<template>
   <div class="card m-1 local-grid-section">
      <div class="card-body text-left ">
         <form>
                <div class="form-group pl-2">
                  <b>Add Grid Monitor</b>
               </div>
               <div class="form-group p-2">
                  <label>Grid Hub Server:</label>
                  <input type="text" class="form-control" v-model="form.gridServer"  placeholder="xxx.xxx.xxx">
               </div>
               <div class="form-group p-2">
                  <label>Password:</label>
                  <input type="password" class="form-control" v-model="form.password"  placeholder="">
               </div>
               <button type="button" class="btn btn-info" :disabled="isDisabled()" v-on:click="accessGrid()" v-if="!isGrid()">Access the Grid</button>
               <button type="button" class="btn btn-secondary" v-on:click="parent.close()" v-if="!isGrid()">Close</button>
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
         parent :  this.$parent,
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
        isDisabled() {
            const me = this;
            return (!me.form.gridServer || !me.form.password) ? true : false;
        },
        isGrid() {
            return (!localStorage.getItem('easydockerSVR') || !localStorage.getItem('easydockerTOKEN')) ? false : true
        },
        accessGrid() {
            const me = this;
            me.root.dataEngine().appPost({
                url  : '/_grid/',
                cmd     :'localGridAccessSetup',
                data    : me.form,
                dataType: 'json'
            },
            function(result) {
               console.log('--result-2->');
               console.log(result);
               localStorage.setItem('easydockerSVR', result.gridServer.replace(/\./g, '_'));
               localStorage.setItem('easydockerTOKEN', result.token);
               me.root.gridAdminServer = result.gridServer;
               me.parent.close();
               me.root.gridMatrix = {};
               // me.root.getGridMatrix();
               // window.location.reload();
            }, function(err) {
                me.gridServer = false;
                console.log(err);
            });
        }
   }
}
</script>
<style>
.local-grid-section {
    min-height: 10rem
}
.local-grid-error {
   color : #ff0000
}
</style>