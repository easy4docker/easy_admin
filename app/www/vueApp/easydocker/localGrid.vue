<template>
   <span>
      <div v-if="!auth.isAuthExist" class="card m-1">
         <div class="m-3 p-3 card-body card-list-section">
         LocalGrid
         </div>
      </div>
   </span>
</template>
 
<script>
module.exports = {
   props: [],
   data: function() {
      return {
         root :  this.$parent.root
      }
   },
   mounted() {
      var me = this;
      me.checkAuthExist();
      me.checkIsTokenLogin();
   },
   methods : {}
}
</script>
<style>


</style>