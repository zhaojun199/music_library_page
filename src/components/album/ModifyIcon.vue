<template>
    <div>
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>专辑</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
            <el-breadcrumb-item>专辑图片更换</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="12">
                <div>
                    <h3 style="text-align: center">原专辑图片：</h3>
                    <div class="upload-img">
                        <img :src="addHost(old_img)">
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <h3 style="text-align: center">新专辑图片：</h3>
                    <div class="avatar-uploader">
                        <div class="el-upload" @click="upload">
                            <input id="upload" type="file" style="display: none" @change="checkFile"></input>
                            <img v-if="new_img" :src="new_img" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div style="text-align: center">
            <el-button type="primary" @click="submitForm()">修改图片</el-button>
            <el-button @click="toBack()">返回</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ModifyIcon',
    data() {
        return {
            icon_url: APIURL + '/album/show',
            submit_url: APIURL + '/album/modify/icon',
            old_img: PLACEHOLDERIMG,
            new_img: ''
        };
    },
    created() {
        this.getAlbumIcon(this.$route.params.id);
    },
    methods: {
        getAlbumIcon(id) {
            let getData = {
                id: id
            }
            this.axios.get(this.icon_url, {
                    params: getData
                })
                .then((response) => {
                    if (response.data.status === 0) {
                        this.old_img = response.data.data.album.album_icon;
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        upload(e) {
            let input = e.target.querySelector('#upload') || e.target.parentNode.querySelector('#upload');
            input.click();
        },
        checkFile(e) {
            let files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            if (this.isImg(files[0])) {
                this.createImage(files);
            } else {
                e.target.value = null;
                this.new_img = '';
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
                    vm.new_img = e.target.result;
                };
            }
        },
        submitForm() {
            let valid = document.querySelector('#upload').value;
            if (valid) {
                let file = document.querySelector('#upload').files[0];
                let FormData = new window.FormData();
                FormData.append('id', this.$route.params.id);
                FormData.append('icon', file, file.name);
                this.axios({
                    method: 'post',
                    url: this.submit_url,
                    headers: {
                        'content-type': 'multipart/form-data'
                    },
                    data: FormData
                }).then(res => {
                    this.$alert(res.data.message, '修改专辑', {
                        confirmButtonText: '确定',
                        callback: action => {
                            if(res.data.status === 0){
                                document.querySelector('.upload-img').querySelector('img').src = this.new_img;
                                this.new_img = '';
                            }
                        }
                    });
                })
            } else {
                this.$message({
                    type: 'warning',
                    message: '请选择图片'
                });
            }
        },
        toBack() {
            this.$router.back()
        }
    }
}
</script>
<style>
h3{
    margin: 5px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin: 25px;
    width: 300px;
    height: 300px;
    margin-left: 50%;
    transform: translateX(-50%);
}

.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}

.avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    line-height: 300px;
    text-align: center;
}

.avatar {
    width: 300px;
    height: 300px;
    display: block;
}

.upload-img {
    padding: 25px;
    height: 300px;
    width: 300px;
    margin-left: 50%;
    transform: translateX(-50%);
}

.upload-img img {
    height: 100%;
    width: 100%;
}
</style>
