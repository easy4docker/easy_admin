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
                <div class="container p-2">
                    <div class="row" v-for="(v, k) in grids">
                        <div class="col-1 p-2">
                           <a href="JavaScript:void(0)" v-on:click="removeGrid(k);"><i class="fa fa-trash-o"></i></a>
                        </div>
                        <div class="col-1 p-2">
                           {{v}}
                        </div>
                        <div class="col-10 p-2">
                            {{k}}
                        </div>
                    </div>
                </div>
                <div class="local-grid-error">{{root.gridMatrix}}</div>
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
            root :  this.$parent.root,
            errors: {},
            grids : {},
            form : {
                tag         : '',
                gridServer  : ''
            },
            gridMatrix : {}
        }
    },
    mounted() {
        var me = this;
    },
    methods : {

    }
}
</script>
 
<style>
.noFormImage {
    min-width: 100%;
    min-height :512px;
    background-image: url("/imgs/icon1.png");
    background-color: transparent;
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
}
.dropdown-pick-docker {
    height:20em;
    z-index: 3000;
    width: 800px !important; 
    overflow-y: scroll;
    overflow-x: hidden;
}

.bg-odd {  min-height : 6em; border-bottom: 1px dashed; border-color: #aaa;}
.bg-even {  min-height : 6em;  border-bottom: 1px dashed; border-color: #aaa; }
.border-width-1 {  border-width: 6px; border-color: #999}

input.dockerSetting[readonly] {
  background-color:transparent;
}

.text-capitalize {
  text-transform: capitalize;
}
.grid-list {
    min-height: 20rem
}
.local-grid-error {
   color : #ff0000
}
</style>
