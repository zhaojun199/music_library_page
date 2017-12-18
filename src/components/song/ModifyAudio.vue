<template>
    <div>
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>单曲</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
            <el-breadcrumb-item>歌曲音频更换</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row class="row">
            <el-col :span="12" class="col-left old">
                原歌曲音频:
            </el-col>
            <el-col :span="12" class="old">
                <audio :src="addHost(old_audio)" controls></audio>
            </el-col>
        </el-row>
        <el-row class="row">
            <el-col :span="12" class="col-left new">
                新歌曲音频:
            </el-col>
            <el-col :span="12" v-if="!new_audio" class="new">
                <div class="el-upload" @click="upload" style="border-radius: 50%;overflow:hidden">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                </div>
            </el-col>
            <el-col :span="12" v-else class="col-right new">
                <audio id="audio" controls :src="new_audio"></audio>
            </el-col>
            <input id="upload" type="file" name="audio" style="display: none" @change="checkFile"></input>
        </el-row>
        <div style="text-align: center">
            <el-button type="primary" @click="submitForm()">修改音频</el-button>
            <el-button @click="resetForm()">重置</el-button>
        </div>
        <LoadProgress :percent="u_percent"></LoadProgress>
    </div>
</template>
<script>
import LoadProgress from '@/components/progress/Progress'

export default {
    name: 'ModifyIcon',
    components: {
        LoadProgress
    },
    data() {
        return {
            icon_url: APIURL + '/song/show',
            submit_url: APIURL + '/song/modify/audio',
            old_audio: '',
            new_audio: '',
            u_percent: 0
        };
    },
    created() {
        this.getSongAudio(this.$route.params.id);
    },
    methods: {
        getSongAudio(id) {
            let getData = {
                id: id
            }
            this.axios.get(this.icon_url, {
                    params: getData
                })
                .then((response) => {
                    if (response.data.status === 0) {
                        this.old_audio = response.data.data.song_path_middle;
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        upload(e) {
            let input = document.querySelector('#upload');
            input.click();
        },
        checkFile(e) {
            let files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            if (this.isAudio(files[0])) {
                this.new_audio = this.getObjectURL(files[0]);
            } else {
                e.target.value = null;
                this.new_audio = '';
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
            let valid = document.querySelector('#upload').value;
            if (valid) {
                let file = document.querySelector('#upload').files[0];
                let FormData = new window.FormData();
                FormData.append('id', this.$route.params.id);
                FormData.append('audio', file, file.name);
                this.axios({
                    method: 'post',
                    url: this.submit_url,
                    headers: {
                        'content-type': 'multipart/form-data'
                    },
                    data: FormData,
                    onUploadProgress: (progressEvent) => {
                        this.u_percent = progressEvent.loaded / progressEvent.total * 100;
                    }
                }).then(res => {
                    this.$alert(res.data.message, '修改歌曲', {
                        confirmButtonText: '确定',
                        callback: action => {
                            if (res.data.status === 0) {
                                document.querySelector('audio').src = this.new_audio;
                                document.querySelector('#upload').value = null;
                                this.new_audio = '';
                            }
                        }
                    });
                })
            } else {
                this.$message({
                    type: 'warning',
                    message: '请选择文件'
                });
            }
        },
        resetForm() {
            this.new_audio = '';
        }
    }
}
</script>
<style scoped>
.row {
    margin: 5rem;
}

.col-left {
    text-align: right;
    padding-right: 3rem;
    font-family: "Microsoft YaHei", "微软雅黑";
}

.old {
    line-height: 32px;
}

.new {
    height: 56px;
    line-height: 56px;
}

.col-right.new {
    padding-top: 12px;
}
</style>
