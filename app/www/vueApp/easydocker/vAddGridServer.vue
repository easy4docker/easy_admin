<template>
<div class="card shadow m-2 mr-1 p-3 mt-0">
    <div class="card-body card-form-section text-left ">
        <form>
            <div class="form-group  border rounded p-2">
                <div class="container-fluid p-2">
                    <div class="row">
                        <div class="col-12 p-2">
                           <label><h3>Add a grid member server</h3></label>
                        </div>
                    </div>
                 </div>
            </div>
            <div class="p-2 alert-secondary grid-list border rounded">
                <div class="local-grid-error">
                # mkdir  /var/easydocker<br/>
                # cd /var/easydocker<br/>
                # culr {{setupUrl()}}/_setupGridServer -o setup.sh<br/>
                # sh setup.sh<hr/>
                {{root.gridMatrix}}
                </div>
            </div>
        </form>
        <hr/>
    </div>
</div>
</template>
 
<script>
module.exports = {
    props : [],
    data: function() {
        var me = this;
        return {
            root :  this.$parent.root + ':' + location.port
        }
    },
    mounted() {
        var me = this;
    },
    methods : {
        setupUrl() {
            return location.hostname
        }
    }
}
</script>
 
<style>
</style>
