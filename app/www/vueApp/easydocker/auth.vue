<template>
   <span>
      <div v-if="!auth.isAuthExist" class="card m-1">
         <div class="m-3 p-3 card-body card-list-section">
            <div class="form-group">
                  <label><h3>Initial Authentication Setup </h3> (Setup Admin Password)</label>
            </div>
            <div class="form-group">
                  <div class="row p-1">
                     <div class="col-2"></div>
                     <div class="col-8 text-left">
                           <label class="pl-2"><b>Admin Password</b></label>
                           <input type="password" class="form-control" v-model="formInit.password" placeholder="Admin password">                        
                     </div>
                     <div class="col-2"></div>
                  </div>    
                  <div class="row p-1">
                     <div class="col-2"></div>
                     <div class="col-8 text-left">
                           <label class="pl-2"><b>Verify Password</b></label>
                           <input type="password" class="form-control" v-model="formInit.vpass" placeholder="verify password">
                     </div>
                     <div class="col-2"></div>
                  </div>  
                  <div class="row p-1">
                     <div class="col-2"></div>
                     <div class="col-8 text-left">
                           <button type="button" v-bind:disabled="!isInitValid()" class="btn btn-info m-3" v-on:click="initAdminPassword()">Setup</button>
                     </div>
                     <div class="col-2"></div>
                  </div>  
            </div> 
         </div>
      </div>
      <div v-if="auth.isAuthExist === true && !auth.isSignIn" class="card m-1">
         <div class="m-3 p-3 card-body card-list-section">
            <div class="form-group">
                  <h4>Admin Signin</h4>
            </div>
            <div class="form-group">
                  <div class="row p-1">
                     <div class="col-2"></div>
                     <div class="col-8 text-left">
                           <label class="pl-2"><b>Admin Password</b></label>
                           <input type="password" v-model="formSignin.password" class="form-control" 
                              v-on:keyup.enter="submit"
                              placeholder="Admin password">                        
                     </div>
                     <div class="col-2"></div>
                  </div>
                  <div class="row p-1">
                     <div class="col-2"></div>
                     <div class="col-8 text-left">
                           <button type="button" class="btn btn-success btn-sm m-3" v-on:click="signIn()">Sign in</button>
                     </div>
                     <div class="col-2"></div>
                  </div>
                  <div class="row p-1">
                     <div class="col-2"></div>
                     <div class="col-8">
                           <div class="text-danger text-left m-3">{{errorMessage}}</div>
                     </div>
                     <div class="col-2"></div>
                  </div>  
            </div>
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
         auth : {
            token : null,
            isAuthExist : false,
            isSignIn : null
         },
         formInit : {
            password: '',
            vpass:''
         },
         formSignin : {
            password: ''
         },
         errorMessage :''
      }
   },
   mounted() {
      var me = this;
      me.checkAuthExist();
      me.checkIsTokenLogin();
   },
   methods : {
      checkIsTokenLogin() {
         var me = this;
         let v = localStorage.getItem('easydockerFP');
         if (v) {
            me.root.dataEngine().appPost({cmd: 'auth', data : {code : 'isTokenLogin'}}, function(result) {
               if ((result) && result.status === 'success') {
                  me.auth.isSignIn = true;
                  me.auth.token = result.token;
               } else {
                  me.auth.isSignIn  = false;
                  delete me.auth.token;
               }
               me.root.auth = me.auth;
            });
         } else {
            me.auth.isSignIn  = false;
            delete me.auth.token;
            me.root.auth = me.auth;
         }
      },

      isInitValid() {
         var me = this;
         return (!me.formInit.password || me.formInit.password !== me.formInit.vpass) ? false : true;
      },

      checkAuthExist() {
         var me = this;

         me.root.dataEngine().appPost({cmd: 'auth', data : {code : 'isAuthReady' }}, function(result) {
               if (result.status === 'success') {
                  me.auth.isAuthExist = result.isAuthReady;
                  me.root.auth = me.auth;
               }
         });   
      },
      initAdminPassword() {
         const me = this;
         me.root.dataEngine().appPost({cmd: 'auth', data : {code : 'initPassword', password: me.formInit.password }}, function(result) {
               me.checkAuthExist();
         });
      },
      submit() {
         this.signIn();
      },
      signIn() {
         var me = this;
         me.root.dataEngine().appPost({cmd: 'auth', data : {code : 'signin', password: me.formSignin.password }}, function(result) {
               if (result.status === 'success') {
                  localStorage.setItem('easydockerFP', result.token);
                  me.checkIsTokenLogin();
                  if (typeof me.$parent.close === 'function') {
                     me.$parent.close();
                  }
               } else {
                  me.errorMessage = 'Authentication failure.';
               }
         });
      },
      signOff() {
         const me = this;
         me.root.dataEngine().appPost({cmd: 'auth', data : {code : 'signOff'}}, function(result) {
               if (result.status === 'success') { 
                  localStorage.removeItem('easydockerFP');
                  window.location.reload();
               }
         });
      }
   }
}
</script>
<style>
</style>