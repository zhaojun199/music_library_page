<template>
    <div>
        <vue-editor :use-save-button="false" @editor-updated="updatedContent" :editor-content="value">
        </vue-editor>
    </div>
</template>
<script>
import { VueEditor } from 'vue2-editor';
export default {
    props: {
        value : null
    },
    components: {
        VueEditor
    },
    methods: {
        updatedContent(value) {
            this.$emit('input', value);
        }
    }
}
</script>
<style lang="stylus">
#quillWrapper
  .ql-toolbar.ql-snow
    border-radius: 4px 4px 0 0
  #quill-container
    height: 200px
    border-radius: 0 0 4px 4px
</style>
