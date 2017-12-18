<template>
    <div>
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>歌手</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-col :span="24">
            <div style="text-align: center;background:#FBFDFF">
                <el-row>
                    <el-col :span="24">
                        <h3>{{singer.singer_name}}</h3>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" style="line-height: 104px;">
                        <div class="left-label">图标：</div>
                    </el-col>
                    <el-col :span="12">
                        <div>
                            <img :src="addHost(singer.singer_icon)" style="width:100px;height:100px;">
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="left-label">性别：</div>
                    </el-col>
                    <el-col :span="12">
                        <div>{{singer.singer_sex}}</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="left-label">年龄：</div>
                    </el-col>
                    <el-col :span="12">
                        <div>{{singer.singer_birthday | getAge}}</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="left-label">创建人：</div>
                    </el-col>
                    <el-col :span="12">
                        <div>{{singer.singer_uploader_name}}</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="left-label">歌手简介：</div>
                    </el-col>
                    <el-col :span="12">
                        <div>{{singer.singer_intro}}</div>
                    </el-col>
                </el-row>
            </div>
        </el-col>
    </div>
</template>
<script>
export default {
    name: 'singerShow',
    data() {
        return {
            singer_url: APIURL + '/singer/show',
            singer: {
                singer_icon: PLACEHOLDERIMG
            }
        }
    },
    created() {
        this.getSingerInfo(this.$route.params.id);
    },
    methods: {
        getSingerInfo(id) {
            let getData = {
                id: id
            }
            this.axios.get(this.singer_url, {
                    params: getData
                })
                .then((response) => {
                    if (response.data.status === 0) {
                        this.singer = response.data.data;
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        }
    }
}
</script>
<style scoped>
.el-col {
    padding: 6px 2px;
    font-family: "Microsoft YaHei", "微软雅黑";
}

.left-label {
    color: #99A9BF;
}

.more {
    text-align: center;
    background: #EEF1F6;
    border-radius: 20px;
    color: #324157;
    padding: 3px 15px;
}
</style>
