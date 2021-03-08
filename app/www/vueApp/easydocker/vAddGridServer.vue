<template>
<div class="card shadow m-2 mr-1 p-3 mt-0">
    <div class="card-body card-form-section text-left ">
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
            <div class="m-3">
                <h3>Step 1</h3>
                Recommended cloud services:<br/>
                1 - DigitalOcean <a href="https://www.digitalocean.com" target="_blank">https://www.digitalocean.com</a><br/>
                2 - Aws <a href="https://aws.amazon.com" target="_blank">https://aws.amazon.com</a><br/>
                3 - Azure <a href="https://azure.microsoft.com" target="_blank">https://azure.microsoft.com</a>
                <hr/>
                <h3>Step 2</h3>
                # mkdir  /var/easydocker<br/>
                # cd /var/easydocker<br/>
                # curl {{setupUrl()}}/_setupGridServer -o setup.sh<br/>
                # sh setup.sh<br/>
                {{/*root.gridMatrix*/}}
                <hr/>
                <h3>Step 3</h3>
                1 - check setup http://{ip}:10000<br/>
                2 - check grid host ip list
            </div>
        </div>
    </div>
</div>
</template>
 
<script>
module.exports = {
    props : [],
    data: function() {
        var me = this;
        return {
            root :  this.$parent.root
        }
    },
    mounted() {
        var me = this;
    },
    methods : {
        setupUrl() {
            return location.protocol + '//' + location.hostname + ((location.port === '80') ? '' : (':' + location.port))
        }
    }
}
</script>
 
<style>
</style>
