<template>
    <div class="progress" v-show="isShow">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="percent"></el-progress>
    </div>
</template>
<script>
export default {
    name: 'progress',
    props: {
        percent: {
            type: Number,
            required: true
        }
    },
    computed: {
        isShow() {
            return this.percent > 0 && this.percent < 100;
        }
    }
}
</script>
<style lang='stylus' scoped>
.progress
    position: absolute
    z-index: 100
    width: 300px
    top: 50%
    left: 50%
    transform: translate(-50%,-50%)
</style>
