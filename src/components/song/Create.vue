<template>
    <div @click="showSingers=false">
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>专辑</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
            <el-breadcrumb-item>创建歌曲</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="song" :rules="rules" ref="song" label-width="100px" @keyup.enter="submitForm()">
            <el-form-item label="歌曲名称" prop="song_name">
                <el-input v-model="song.song_name"></el-input>
            </el-form-item>
            <el-form-item label="歌曲图片" prop="song_icon" required>
                <div class="el-upload" @click="upload">
                    <input class="upload" type="file" name="icon" style="display: none" @change="checkFile"></input>
                    <img v-if="img_url" :src="img_url">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </div>
                <div style="display:inline-block;position: absolute;top:8px;">
                    <el-popover ref="popover" placement="right" width="400" trigger="click">
                        <div style="max-height:400px;">
                            <img :src="img_url">
                        </div>
                    </el-popover>
                    <el-button type="info" v-popover:popover>大图</el-button>
                </div>
            </el-form-item>
            <el-form-item label="歌曲文件" prop="song_audio" required>
                <div class="el-upload" @click="upload" style="border-radius: 50%;overflow:hidden">
                    <input class="upload" type="file" name="audio" style="display: none" @change="checkFile"></input>
                    <img v-if="audio_success_url" :src="audio_success_url">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </div>
                <div style="display:inline-block;position: absolute;top:8px;">
                    <el-popover ref="popover" placement="right" width="400" trigger="click">
                        <audio id="audio" controls="" :src="audio_url"></audio>
                    </el-popover>
                    <el-button type="info" v-popover:popover>试听</el-button>
                </div>
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
            <el-form-item label="歌曲介绍" prop="song_intro">
                <el-input type="textarea" v-model="song.song_intro"></el-input>
            </el-form-item>
            <el-form-item label="歌词" prop="song_lyric">
                <RichText v-model="song.song_lyric"></RichText>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()">立即创建</el-button>
                <el-button @click="resetForm('song')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    </div>
</template>
<script>
import RichText from "../richtext/RichText"
import ChooseSinger from "../choosesinger/ChooseSinger"

export default {
    name: 'SongCreate',
    components: {
        RichText,
        ChooseSinger
    },
    data() {
        return {
            submit_url: APIURL + '/song/create',
            img_url: '',
            audio_url: '',
            audio_success_url: '',
            song: {
                song_name: '',
                song_intro: "",
                song_lyric: '',
                singer_name: '',
                singer_id: null
            },
            album_name: this.$route.params.name,
            showSingers: false,
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
                song_intro: [{
                    required: false,
                    message: '',
                    trigger: 'blur'
                }]
            }
        }
    },
    created() {
        this.isLogin();
    },
    methods: {
        chooseSinger() {
            this.showSingers = !this.showSingers
        },
        getSinger(id, name) {
            this.song.singer_id = id;
            this.song.singer_name = name;
            this.showSingers = false;
        },
        upload(e) {
            let input = e.target.querySelector('.upload') || e.target.parentNode.querySelector('.upload');
            input.click();
        },
        checkFile(e) {
            let files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            if (e.target.name == 'icon') {
                if (this.isImg(files[0])) {
                    this.createImage(files);
                } else {
                    e.target.value = null;
                    this.img_url = '';
                }
            } else if (e.target.name == 'audio') {
                if (this.isAudio(files[0])) {
                    this.audio_success_url = '../static/image/uploaded_audio.jpg';
                    this.audio_url = this.getObjectURL(files[0]);
                } else {
                    e.target.value = null;
                    this.audio_success_url = '';
                }
            }
        },
        isImg(file) {
            let isImg = file.type.toLowerCase() === 'image/jpeg' || file.type.toLowerCase() === 'image/png';
            let isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            if (!isImg) {
                this.$message.error('上传图片格式非jpg/png!');
            }
            return isImg && isLt2M;
        },
        createImage(file) {
            if (typeof FileReader === 'undefined') {
                alert('您的浏览器不支持图片上传，请升级您的浏览器');
                return false;
            }
            var vm = this;
            var leng = file.length;
            for (var i = 0; i < leng; i++) {
                var reader = new FileReader();
                reader.readAsDataURL(file[i]);
                reader.onload = function(e) {
                    vm.img_url = e.target.result;
                };
            }
        },
        isAudio(file) {
            let isAudio = file.type.toLowerCase() === 'audio/mp3' || file.type.toLowerCase() === 'audio/wav' || file.type.toLowerCase() === 'audio/mpeg';
            let isLt20M = file.size / 1024 / 1024 < 20;
            if (!isLt20M) {
                this.$message.error('上传音频大小不能超过 20MB!');
            }
            if (!isAudio) {
                this.$message.error('上传文件格式仅限MP3/WAV!');
            }
            return isAudio && isLt20M;
        },
        getObjectURL(file) {
            let url = null;
            if (window.createObjectURL != undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.URL != undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            }
            return url;
        },
        submitForm() {
            this.$refs['song'].validate((valid) => {
                if (valid) {
                    if (document.querySelectorAll('.upload')[0].value && this.audio_url && document.querySelector('#audio').duration !== NaN) {
                        this.postForm();
                    } else if (document.querySelector('#audio').duration === NaN) {
                        this.$message({
                            type: 'warning',
                            message: '音频还未加载完毕'
                        });
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '请上传图片和音频文件'
                        });
                    }
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请填写完整'
                    });
                }
            })
        },
        postForm() {
            let FormData = new window.FormData();
            let file = document.querySelectorAll('.upload');
            FormData.append('song_name', this.song.song_name);
            FormData.append('icon', file[0].files[0], file[0].files[0].name);
            FormData.append('audio', file[1].files[0], file[1].files[0].name);
            FormData.append('singer_name', this.song.singer_name);
            FormData.append('singer_id', this.song.singer_id);
            FormData.append('song_intro', this.song.song_intro);
            FormData.append('song_lyric', this.song.song_lyric);
            FormData.append('song_duration', parseInt(document.querySelector('#audio').duration));
            FormData.append('album_id', this.$route.params.id);
            FormData.append('album_name', this.$route.params.name);
            FormData.append('upload_user_id', this.getCookie('lid'));
            FormData.append('upload_user_name', this.getCookie('username'));
            FormData.append('upload_type', this.getCookie('type'));
            this.axios({
                method: 'post',
                url: this.submit_url,
                headers: {
                    'content-type': 'multipart/form-data'
                },
                data: FormData
            }).then(res => {
                this.$alert(res.data.message, '创建单曲', {
                    confirmButtonText: '确定',
                    callback: action => {
                        if (res.data.status === 0) {
                            this.resetForm('song');
                        }
                    }
                });
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.song.singer_id = null;
            document.querySelectorAll('.upload')[0].value = null;
            document.querySelectorAll('.upload')[1].value = null;
            this.img_url = '';
            this.audio_url = '';
            this.audio_success_url = '';
        }
    }
}
</script>
