<template>
    <div class="body-card overflow-auto  m-1">
        <div class="card-body m-0 p-1">
            <div class="container-fluid m-0">
                <div class="row">
                    <div class="col-2 p-1 m-0 ">
                        <div class="card ondemand-requestions-section mt-0 mr-1 p-2">
                            <div class="pl-2 m-0 text-left"><h5>Results:</h5></div>
                            <span v-if="results.length" v-for="o in results">
                                <div v-on:click="selectResult(o)" v-if="o !== currentResult"
                                    class="border border-secondary rounded m-1 p-1 text-left">
                                    {{o}}
                                    <a href="JavaScript:void(0)" v-on:Click="selectResult(o)"  >
                                        <i class="fa fa-angle-double-down pull-right"></i>
                                    </a>
                                </div>
                                <div v-if="currentResult === o " class="border border-secondary alert-secondary rounded m-1 p-1 text-left">
                                    <div class="p-1">
                                        {{currentResult}}
                                        <a href="JavaScript:void(0)" v-on:Click="selectResult('')"  >
                                            <i class="fa fa-angle-double-right pull-right"></i>
                                        </a>
                                    </div>
                                    <div class="current-ondemand-section overflow-auto bg-light p-2">
                                        Input :  {{(!resultFiles.input) ? '' : resultFiles.input.length}}<br/>
                                        Output : {{(!resultFiles.input) ? '' : resultFiles.output.length}}<br/>
                                    </div>  
                                </div>
                            <span>
                            <div v-if="!results.length"
                                class="m-1 p-1 text-left text-secondary">
                                No results.
                            </div> 
                        </div>
                    
                    </div>
                    <div class="card alert-light col-10 p-2 m-0 text-left" v-if="!!currentResult">
                        <h3 class="text-dark p-2">{{currentResult}}<button class="btn btn-danger pull-right" v-on:click="removeResult(currentResult)">Delete this result</button></h3>
                        <div class="p-1 text-dark"><b>Input Data</b></div>
                         
                        <div class="input-data-section alert-warning rounded border border-warning p-1 overflow-auto">
                           
                            <div v-for="o in resultFiles.input" class="ml-2 mt-1">
                                [<a href="JavaScript:void(0)" v-on:click="getFileContent(currentResult, 'i', o)"
                                    class="text-left text-dark" >
                                    {{o}}</a>]
                                <div class="bg-dark  p-2 rounded border border-success ml-3" v-if="!!contents[currentResult + '-i-' + o]">
                                    <pre class="text-light">{{contents[currentResult + '-i-' + o]}}</pre>
                                </div>
                            </div>
                        </div>
                        <div class="p-1 text-dark"><b>Output contents</b></div>
                        <div class="output-data-section alert-success rounded border border-success p-1 mt-1 overflow-auto">
                            
                            <div v-for="o in resultFiles.output" class="ml-2 mt-1">
                                [<a href="JavaScript:void(0)" v-on:click="getFileContent(currentResult, 'o', o)"
                                    class="text-left text-dark" >
                                    {{o}}</a>]
                                <div class="bg-dark  p-2 rounded border border-success m-2 ml-3" v-if="!!contents[currentResult + '-o-' + o]">
                                    <pre class="text-light">{{contents[currentResult + '-o-' + o]}}</pre>
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
    data: function() {
        return {
            root            : this.$parent.root,
            module          : '',
            results         : [],
            resultFiles     : [],
            currentResult   : '',
            contents : {}
        }
    },
    mounted() {
        const me = this;
        me.getOndemandResults();
    },
    watch : {

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
            const me = this;
            me.root.dataEngine().appPost({
                cmd : 'removeResult',
                data : { result : o }
            }, (result)=> {
                me.getOndemandResults();
                me.currentResult = '';
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
            me.currentResult = o;
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
