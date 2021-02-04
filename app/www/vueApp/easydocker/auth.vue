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
         console.log(v);
         if (v) {
            me.root.dataEngine().appPost({cmd: 'auth', data : {code : 'isTokenLogin'}}, function(result) {
               console.log(result);
               if (result.status === 'success') {
                  me.auth.isSignIn = true;
                  me.auth.token = result.token;
               } else {
                  me.auth.isSignIn  = false;
                  delete me.auth.token;
               }
               me.root.auth = me.auth;
            });
         } else {
            console.log(result);
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
      accessGrid(code) {
         const me = this;
         let hostname = window.location.hostname,
             token = code;
         if  (hostname === 'localhost') {
            return true;
         }
         if (code) {
            me.root.dataEngine().appPost({
               url  : '/_grid/',
               cmd     :'gridAccess',
               data    : {
                  gridServer  : hostname,
                  password    : code
               },
               dataType: 'json'
            },
            function(result) {
               localStorage.setItem('easydockerSVR', result.gridServer.replace(/\./g, '_'));
               localStorage.setItem('easydockerTOKEN', result.token);
               window.location.reload();
            }, function(err) {}); 
         } else {
               localStorage.removeItem('easydockerSVR');
               localStorage.removeItem('easydockerTOKEN');
            }  

      },
      signIn() {
         var me = this;
         me.root.dataEngine().appPost({cmd: 'auth', data : {code : 'signin', password: me.formSignin.password }}, function(result) {
               if (result.status === 'success') {
                  localStorage.setItem('easydockerFP', result.token);
                  me.accessGrid(me.formSignin.password);
                  me.checkIsTokenLogin();
               } else {
                  alert('Authentication failure.');
               }
         });
      },
      signOff() {
         const me = this;
         localStorage.removeItem('easydockerFP');
         me.accessGrid(null) 
         me.checkAuthExist();
         me.checkIsTokenLogin();
      }
   }
}
</script>
<style>
/*---- overlay and spinner ---*/
.overlay_auth_frame {
   position:fixed;
   width   : 100%;
   height  : 100%;
   top:0; left:0;
   min-height : 36em;
}
.overlay_auth_cover {
    position:fixed;
    top:0; left:0;
    background:rgba(255,255,255,1);
    z-index:8001;
    width:100%;
    height:100%;
    /* display:none; */
}
.overlay_auth_body {
   position:relative;
   width    : 80%;
   z-index:8009;
   left:10%;
   right:10%;
   top : 10%;
   min-height : 36em;
}

</style>