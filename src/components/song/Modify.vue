<template>
    <div @click="showSingers=false">
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>单曲</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
            <el-breadcrumb-item>单曲修改</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="song" :rules="rules" ref="song" label-width="100px" @keyup.enter="submitForm('song')">
            <el-form-item label="歌曲名称" prop="song_name">
                <el-input v-model="song.song_name"></el-input>
            </el-form-item>
            <el-form-item label="歌曲介绍" prop="song_intro">
                <el-input type="textarea" v-model="song.song_intro"></el-input>
            </el-form-item>
            <el-form-item label="歌手" prop="singer_name">
                <el-row>
                    <el-col :span="8">
                        <el-input v-model="song.singer_name" disabled></el-input>
                    </el-col>
                    <el-col :offset="1" :span="2">
                        <el-button @click.prevent.stop="chooseSinger()">更换</el-button>
                    </el-col> 
                </el-row>
                <choose-singer v-on:singer="getSinger" v-show="showSingers" style="margin-top: 10px;"></choose-singer>
            </el-form-item>
            <el-form-item label="歌词" prop="song_lyric">
                <rich-text v-model="song.song_lyric"></rich-text>
            </el-form-item>
            <el-form-item label="序号" prop="song_order">
                <el-input type="number" v-model.number="song.song_order" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('song')">立即修改</el-button>
                <el-button @click="resetForm('song')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import RichText from "../richtext/RichText"
import ChooseSinger from "../choosesinger/ChooseSinger"

export default {
    name: 'songModify',
    components: {
        RichText,
        ChooseSinger
    },
    data() {
        return {
            data_url: APIURL + '/song/show',
            submit_url: APIURL + '/song/modify',
            rules: {
                song_name: [{
                    required: true,
                    message: '请输入歌曲名称',
                    trigger: 'blur'
                }, {
                    min: 1,
                    max: 50,
                    message: '长度在 1 到 50 个字符',
                    trigger: 'blur'
                }],
                song_order: [{
                    required: true,
                    message: '请填写序号'
                }, {
                    type: 'number',
                    message: '排序必须为数字值'
                }]
            },
            song: {
                song_name: '',
                song_intro: '',
                song_lyric: '',
                singer_name: '',
                song_order: 0,
                singer_id: null,
            },
            showSingers: false
        }
    },
    created() {
        this.getSongInfo(this.$route.params.id)
    },
    methods: {
        getSongInfo(id) {
            let getData = {
                id: id
            }
            this.axios.get(this.data_url, {
                    params: getData
                })
                .then((response) => {
                    if (response.data.status === 0) {
                        this.song.id = this.$route.params.id;
                        this.song.song_name = response.data.data.song_name;
                        this.song.song_intro = response.data.data.song_intro;
                        this.song.song_lyric = response.data.data.song_lyric;
                        this.song.song_order = response.data.data.song_order;
                        this.song.singer_name = response.data.data.song_singer_name;
                        this.song.singer_id = response.data.data.song_singer_id;
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        chooseSinger() {
            this.showSingers = !this.showSingers
        },
        getSinger(id, name) {
            this.song.singer_id = id;
            this.song.singer_name = name;
            this.showSingers = false;
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let postData = this.$refs[formName].model;
                    this.$confirm('确认更新歌曲?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.axios.get(this.submit_url, {
                                    params: postData
                                })
                                .then((response) => {
                                    let type = "warning";
                                    if (response.data.status === 0) {
                                        type = "success";
                                    }
                                    this.$message({
                                        type: type,
                                        message: response.data.message
                                    });
                                })
                                .catch(function(response) {
                                    console.log(response)
                                })
                        })
                        .catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消更新'
                            });
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>
