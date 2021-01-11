<template>
<div class="card shadow m-2 mr-1 p-3 mt-0">
    <div class="card-body card-form-section text-left ">
        <form>
            <div class="form-group">
                <label>Grid Tag</label>
                <select class="form-control" :required="true" @change="onTagSelect($event)" v-model="form.tag">
                    <option 
                    v-for="tag in tags" 
                    v-bind:value="tag"
                    :selected="tag ==  form.tag"
                    >{{ tag }}</option>
                </select>
            </div>
            <div class="form-group">
                <label>Add Grid Server</label>
                <input type="text" class="form-control" v-model="form.gridServer"  placeholder="Grid server">
                <button type="button" class="btn btn-info" v-on:click="add()" :disabled = "isSaveDisabled()">Add</button>
            </div>
            <hr/>
            <div class="p-3">
                <b>Joined Grids:</b>
                <ul>
                <li v-for="gridItem in grids">{{gridItem}}</li>
                </ul>
            </div>
            <div class="text-danger p-3"  v-if="!isformValid()">
                <b>Please correct the following error(s):</b>
                <ul>
                <li v-for="(v, k) in errors">{{v}}</li>
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
                me.loadGrids()
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
        loadGrids() {
            var me = this;
            return true;
            me.root.dataEngine().loadGrids(true, function(data) {
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

</style>
