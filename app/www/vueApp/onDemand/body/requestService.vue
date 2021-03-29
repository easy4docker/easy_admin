<template>
    <div class="body-card m-1">
        <div class="card-body m-0 p-1">
            <div class="container-fluid m-0">
                <div class="row">
                    <div class="col-3 p-1 m-0 ">
                        <div class="card ondemand-requestions-section mt-0 mr-1 p-2">
                            <div class="pl-2 m-0 text-left text-info"><h5>Penddings</h5></div>
                            <div class="border border-secondary rounded m-1 p-1 text-left">
                                <b class="mb-1 ml-1">On Demand:</b><i class="fa fa-refresh fa-spin pull-right text-success mr-2" style="font-size:24px"></i>
                                <div v-if="requests.pendding" v-for="o in requests.pendding" class="m-1 p-1 border alert-secondary">
                                    <div>{{lTruncate(o.repo, 4, 20)}}</div><div class="text-right pr-1 text-secondary">{{o.resultId}} - {{o.tm}}</div>
                                </div>
                            </div>
                            <div class="border border-secondary rounded m-1 p-1 text-left">
                                <b class="mb-1 ml-1">Off Road:</b><i class="fa fa-refresh fa-spin pull-right text-success mr-2" style="font-size:24px"></i>
                                <div v-if="requests.offRoad" v-for="o in requests.offRoad" class="m-1 p-1 border alert-secondary">
                                    <div>{{lTruncate(o.repo, 4, 20)}}</div><div class="text-right pr-1 text-secondary">{{o.resultId}} - {{o.tm}}</div>
                                </div>
                            </div>
                            <div class="pl-2 m-0 text-left text-info"><h5>Results</h5></div>
                            <div class="border border-secondary rounded m-1 p-1 text-left">
                                <b class="mb-1 ml-1">Results:</b>
                                <div v-if="!!requests && requests.results.length" v-for="o in requests.results" class="m-1 p-1 border alert-secondary">
                                    <div>{{lTruncate(o.name, 1, 22)}}</div><div class="text-right pr-1 text-secondary">{{o.resultId}} - {{o.tm}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card alert-light col-9 p-3 m-0 text-center" v-if="module === 'success'">
                        <h5 class="m-3">Your request has been sent successfully!</h5>
                        <spam class="m-3"><button class="btn btn-warning" v-on:click="initForm()">Confirm</button></span>
                    </div>
                    <div class="card alert-light col-9 p-2 m-0 text-left" v-if="module !== 'success'">
                        <h3>Request OnDemand Form</h3>
                        <div class="form-group">
                            <label>Repository git URI</label>
                            <input type="text" class="form-control" v-model="form.gitHub" @input="changedGit" placeholder="A Git URI">
                        </div>
                        <div class="form-group">
                            <label>Service Type</label>
                                <select class="form-control" :required="true"  v-model="form.serviceType">
                                    <option 
                                    v-for="option in serviceTypes" 
                                    v-bind:value="option"
                                    :selected="option === form.serviceType"
                                    >{{ option }}</option>
                                </select>                 
                        </div>


                        <div class="form-group">
                            <div class="container-fluid border border-2 p-2 alert-secondary rounded">
                                <div class="row">
                                    <div class="col-12 text-info">
                                        * Only if private git repository need provide username and password                      
                                    </div>
                                </div>    
                                <div class="row">
                                    <div class="col-6">
                                        <label>Repository username</label>
                                        <input type="text" class="form-control" v-model="form.userName"  placeholder="Rep. username">                        
                                    </div>
                                    <div class="col-6">
                                        <label>Repository password</label>
                                        <input type="password" class="form-control" v-model="form.password" placeholder="Rep. password">
                                    </div>
                                </div>    
                            </div>
                        </div>
                       <div class="form-group">
                            <label>Input Data (* option)</label>
                            <textarea class="form-control" v-model="form.inputData" rows="6" placeholder="input data"></textarea>
                        </di> 
                        <div class="form-group">
                            <label>Upload Inuut Data Files</label>
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="customFile"  @change="formOnFileChanged">
                                <label class="custom-file-label" for="customFile">Choose file</label>
                            </div>
                        </div>          
                        <div class="form-group">
                            <button class="btn btn-sm btn-success border border-secondary m-1 mt-2" 
                                :disabled="!isSubmit()"
                                v-on:click="submit()">Submit</button>
                        </div>
                     
                    </div>
                </div>
            </div>
                </div>
            </div>
            <div class="container-fluid mt-1 head-menu-2">
            </div>
        </div>
    </div> 
</template>
 
data() {
 return {
 this.Images.selectedFile : null}},methods: {Images_onFileChanged (event) {this.Images.selectedFile = event.target.files[0];
}}

<script>
module.exports = {
    data: function() {
        return {
            root :  this.$parent.root,
            serviceTypes : ['onDemand', 'offRoad'],
            module : '',
            form : {
                gitHub      : '',
                userName    : '',
                password    : '',
                inputData   : '',
                serviceType : 'onDemand',
                selectedFile: null
            },
            loadingStatus : false,
            Images :{
                selectedFile : null
            },
            requests : {},
            errors: {}
        }
    },
    mounted() {
        const me = this;
        $(".custom-file-input").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
        });
        me.getPenddingRequests();
        setInterval(me.getPenddingRequests, 10000);
    },
    watch : {

    },
    methods :{
		lTruncate(str, start, length) {
            const dt = str.length - length;
            return str.slice(0, start) + '...' + str.slice((dt > 0)? dt : 0, str.length)
		},
        showResult(v) {
            const a = v.match(/\_([0-9]+)$/);
            const t = a[1];
            const dt = new Date().getTime() - t;
            return parseInt(dt * 0.001 / 60) + ' mins';
        },
        formOnFileChanged (e) {
            var me = this;
            me.form.selectedFile = e.target.files[0]; 
            me.loadingStatus = true;
            var reader = new FileReader();
            reader.onload = (e) => {
                me.loadingStatus = false;
            };
            reader.readAsDataURL(this.form.selectedFile);
        },
        initForm() {
            var me = this;
            me.module = '';
            me.form.userName = '';
            me.form.password = '';
        },
        cleanForm() {
            var me = this;
            me.form.userName = '';
            me.form.password = '';
        },
        changedGit(e) {
            var me = this;
            me.form.gitHub = e.target.value.replace(/^\s+|\s+$/g, '');
            me.cleanForm();
        },
        gitUrlValidation() {
            var me = this;
            me.errors.gitHub = null;
            var regex = /^(git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
            
            if (!me.form.gitHub) {
                me.errors.gitHub = 'Github URI required.';
            } else if (!regex.test(me.form.gitHub)) {
                me.errors.gitHub = 'Incorrect github URI.';
            } else {
                delete me.errors.gitHub;
            }
            return (!me.errors.gitHub) ? true : false;
        },
        isSubmit() {
            var me = this;
            return (me.gitUrlValidation() && !me.loadingStatus) ? true : false;
        },
        showError() {
            const me = this;
            JSON.stringify(me.error)
        },
        submit() {
            const me = this;
            me.root.dataEngine().appPost({
                cmd : 'onDemandRequest',
                data : me.form
            }, (result)=> {
                me.module = 'success';
                me.getPenddingRequests();
            }, false);
        },
        getPenddingRequests() {
            const me = this;
            console.log(new Date())
            me.root.dataEngine().appPost({
                cmd : 'getPenddingRequests',
                data : {}
            }, (result)=> {
                me.requests = (!result.requests) ? [] : result.requests;
            }, true);
        }
    }
}
</script>
 
<style>
.ondemand-requestions-section {
    min-height : 40rem;
}
</style>
