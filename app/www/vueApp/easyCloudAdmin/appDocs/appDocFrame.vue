<template>
    <div class="card main_list_file_section p-3 alert-secondary document-section" >
        <h3>{{appdoc.caption}}</h3>
        <how-to-setup v-if="appdoc.code == 'howToSetup'"></how-to-setup>
        <contact v-if="appdoc.code == 'contact'"></contact>
    </div>
</template>
 
<script>
module.exports = {
    props : ['appdoc'],
    data: function() {
        return {
            root   :  this.$parent.root,
            result : ''
        }
    },
    mounted () {
        var me = this;
    },
    methods :{
    },
    components:VUEApp.loadComponents({
        LOAD    : {
            howToSetup     : '/js/vueApp/appDocs/howToSetup.vue',
            contact        : '/js/vueApp/appDocs/contact.vue'
        }
    })
}
</script>
 
<style>
.document-section {
    min-height: 40rem
}
</style>
