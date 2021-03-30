<template>
    <div class="body-card overflow-auto  m-1">
        <div class="card-body m-0 p-1">
            <div class="container-fluid m-0">
                <div class="row">
                    <div class="card alert-light col-12 p-2 m-0 text-left">
                        <h3 class="text-dark p-2">{{cresult}}<button class="btn btn-danger pull-right" v-on:click="removeResult(currentResult)">Delete this result</button></h3>
                        <div class="p-1 text-dark"><b>Input Data</b></div>
                         
                        <div class="input-data-section alert-warning rounded border border-warning p-1 overflow-auto">
                           
                            <div v-for="o in resultFiles.input" class="ml-2 mt-1">
                                [<a href="JavaScript:void(0)" v-on:click="getFileContent(cresult, 'i', o)"
                                    class="text-left text-dark" >
                                    {{o}}</a>]
                                <div class="bg-dark  p-2 rounded border border-success ml-3" v-if="!!contents[cresult + '-i-' + o]">
                                    <pre class="text-light">{{contents[cresult + '-i-' + o]}}</pre>
                                </div>
                            </div>
                        </div>
                        <div class="p-1 text-dark"><b>Output contents</b></div>
                        <div class="output-data-section alert-success rounded border border-success p-1 mt-1 overflow-auto">
                            
                            <div v-for="o in resultFiles.output" class="ml-2 mt-1">
                                [<a href="JavaScript:void(0)" v-on:click="getFileContent(cresult, 'o', o)"
                                    class="text-left text-dark" >
                                    {{o}}</a>]
                                <div class="bg-dark  p-2 rounded border border-success m-2 ml-3" v-if="!!contents[cresult + '-o-' + o]">
                                    <pre class="text-light">{{contents[cresult + '-o-' + o]}}</pre>
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    </div> 
</template>
 
<script>
module.exports = {
    props : ['cresult'],
    data: function() {
        return {
            root            : this.$parent.root,
            module          : '',
            results         : [],
            resultFiles     : [],
            contents : {}
        }
    },
    mounted() {
        const me = this;
        // me.getOndemandResults();
        me.getResultFiles(me.cresult);
    },
    watch : {
        cresult : function(v) {
            const me = this;
            me.getResultFiles(v);
        }
    },
    methods :{
        getOndemandResults() {
            const me = this;
            me.root.dataEngine().appPost({
                cmd : 'getOnDemandResults',
                data : {}
            }, (result)=> {
                me.results = result.result;
                console.log(result);
            }, true);
        },
        removeResult (o) {
            alert(o);
            const me = this;
            me.root.dataEngine().appPost({
                cmd : 'removeResult',
                data : { result : o }
            }, (result)=> {
                me.getOndemandResults();
                me.cresult = '';
            }, true);
        },
        getResultFiles (o) {
            const me = this;
            me.root.dataEngine().appPost({
                cmd : 'getResultFiles',
                data : { result : o }
            }, (result)=> {
                me.resultFiles = result.files;
                console.log(result);
            }, true);
        },
        selectResult(o) {
            const me = this;
            me.cresult = o;
            me.getResultFiles(o);
        },
        getFileContent(ondemand, ftype, file) {
            const me = this;
            me.root.dataEngine().appPost({
                cmd : 'getFileContent',
                data : { ondemand : ondemand ,ftype: ((ftype === 'i') ? 'input' : 'output'), file:file}
            }, (result)=> {
                me.contents[ondemand + '-' + ftype + '-' + file] = result.content;
                me.$forceUpdate();
                console.log(result);
                console.log(me.contents);
            }, true);
        }

    }
}
</script>
 
<style>
.ondemand-requestions-section {
    min-height : 40rem;
}
.current-ondemand-section {
    max-height: 26rem;
}
.input-data-section {
    height: 10rem;
}
.output-data-section {
    height: 26rem;
}
.float-tag {
    z-index :8000;
}
</style>
