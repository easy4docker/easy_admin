<template>
    <span>
        <h1>Easy NodeJS Backend Cloud</h1>
        <p>How to setup local environment:</p>
        <p>Step 1: create your local work directory</p>
        <pre><code>mkdir workdir
        </code></pre>
        <p>Step 2:</p>
        <pre><code>edit localSetup.sh using code within localSetup.sh.sample
        </code></pre>
        <p>Step 3:</p>
        <pre><code>sh localSetup.sh
        </code></pre>
        <p>backend code folder is mainServer</p>
        <p>Admin or Engine URL is <a href="http://localhost:9080?token=local" rel="nofollow">http://localhost:9080?token=local</a></p>
    </span>
</template>
 
<script>
module.exports = {
    data: function() {
        return {
            root     :  this.$parent.root,
            result : ''
        }
    },
    mounted () {
    },
    methods :{
    },
    components:{

    }
}
</script>
 
<style>
</style>
