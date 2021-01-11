<template>
<div class="card shadow m-2 mr-1 p-3 mt-0">
    <div class="card-body card-form-section text-left ">
        <form>
            <div class="form-group  border rounded p-2">
                <div class="container-fluid p-2">
                    <div class="row">
                        <div class="col-12 p-2">
                           <label><h3>Join a grid</h3></label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-2 p-2">
                           <label class="ml-3">Grid Tag</label>
                        </div>
                        <div class="col-8 p-2">
                            <select class="form-control" :required="true" @change="onTagSelect($event)" v-model="form.tag">
                                <option 
                                v-for="tag in tags" 
                                v-bind:value="tag"
                                :selected="tag ==  form.tag"
                                >{{ tag }}</option>
                            </select>
                        </div>
                        <div class="col-2 p-2">
                            
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-2 p-2">
                            <label class="ml-3">Grid Server</label>
                        </div>
                        <div class="col-8 p-2">
                            <input type="text" class="form-control" v-model="form.gridServer"  placeholder="Grid server">
                        </div>
                        <div class="col-2 p-2 pl-3">
                            <button type="button" class="btn btn-info m-0" v-on:click="add()" :disabled = "isSaveDisabled()">
                                <i class="fa fa-floppy-o" aria-hidden="true"></i> Save
                            </button>
                        </div>
                     </div>
                 </div>
            </div>
            <div class="p-2 alert-secondary grid-list border rounded">
                <ul>
                    <li v-for="gridItem in grids">{{gridItem}}</li>
                </ul>
            </div>
        </form>
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
            grids : [],
            tags : ['dev', 'qa', 'prod'],
            form : {
                tag         : '',
                gridServer  : ''
            }
        }
    },
    mounted() {
        var me = this;
        setTimeout(
            function() {
                me.getGrids()
            }, 1000
        );
    },
    methods : {
        add() {
            var me = this;
            return true;
            me.root.dataEngine().loadPublicDockersList(true, function(data) {
                me.publicDockers = data;
            });
        },
        cleanForm() {


        },
        getGrids() {
            var me = this;
            return true;
            me.root.dataEngine().getGrids(true, function(data) {
                me.grids = [];
                console.log(data);
                // data;
            });
        },
        onTagSelect(event) {
            var me = this;
            me.form.tag = event.target.value;
        },
        isformValid() {
            var me = this;
            return (!Object.keys(me.errors).length) ? true : false;
        },
        isSaveDisabled() {
            var me = this;
            return (!me.form.tag || me.form.gridServer.split('.').length !== 3) ? true : false;
        }
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
</style>
