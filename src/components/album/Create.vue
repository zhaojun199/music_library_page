<template>
    <div>
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>专辑</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
            <el-breadcrumb-item>创建专辑</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="album" :rules="rules" ref="album" label-width="100px" @keyup.enter="submitForm()">
            <el-form-item label="专辑名称" prop="album_name">
                <el-input v-model="album.album_name"></el-input>
            </el-form-item>
            <el-form-item label="专辑图片" prop="album_icon" required>
                <div class="el-upload" @click="upload">
                    <input class="upload" type="file" style="display: none" @change="checkFile"></input>
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
            <el-form-item label="专辑介绍" prop="album_intro">
                <el-input type="textarea" v-model="album.album_intro"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="album_category">
                <el-select v-model="album.album_category" placeholder="请选择分类">
                    <template v-for="item in category">
                        <el-option v-bind:label="item.name" v-bind:value="item.code"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="发行时间">
                <el-col :span="11">
                    <el-form-item prop="issue_date">
                        <el-date-picker type="date" placeholder="选择日期" v-model="album.issue_date" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="1" style="margin-top:10px;text-align: center">-</el-col>
                <el-col :span="11">
                    <el-form-item prop="issue_date">
                        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="album.issue_date" style="width: 100%;"></el-time-picker>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label="年龄段" style="margin-bottom: 50px">
                <el-col :span="3">
                    <el-form-item prop="min_age">
                        <el-input type="age" v-model.number="album.min_age"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="1" style="margin-top:10px;text-align: center">~</el-col>
                <el-col :span="3">
                    <el-form-item prop="max_age">
                        <el-input type="age" v-model.number="album.max_age"></el-input>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()">立即创建</el-button>
                <el-button @click="resetForm('album')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'hello',
    data() {
        let checkMinAge = (rule, value, callback) => {
            if (value > this.album.max_age) {
                callback(new Error('最小年龄不能大于最大年龄'));
            } else if(value < 0){
                callback(new Error('最小年龄不能小于0岁'));
            }else{
                callback();
            }
        };
        let checkMaxAge = (rule, value, callback) => {
            if (value < this.album.min_age) {
                callback(new Error('最大年龄不能小于最小年龄'));
            } else if(value > 200){
                callback(new Error('最大年龄不能大于200岁'));
            } else {
                callback();
            }
        };
        return {
            category_url: APIURL + '/type',
            submit_url: APIURL + '/album/create',
            img_url: '',
            rules: {
                album_name: [{
                    required: true,
                    message: '请输入专辑名称',
                    trigger: 'blur'
                }, {
                    min: 1,
                    max: 50,
                    message: '长度在 1 到 50 个字符',
                    trigger: 'blur'
                }],
                album_intro: [{
                    required: false,
                    message: '',
                    trigger: 'blur'
                }],
                album_category: [{
                    required: true,
                    message: '请至少选择一个分类'
                }],
                issue_date: [{
                    required: false,
                    message: '请选择日期'
                }],
                min_age: [{
                    required: false,
                    type: 'number',
                    message: '请填写数字',
                    trigger: 'blur'
                }, {
                    validator: checkMinAge,
                    trigger: 'blur'
                }],
                max_age: [{
                    required: false,
                    type: 'number',
                    message: '请填写数字',
                    trigger: 'blur'
                }, {
                    validator: checkMaxAge,
                    trigger: 'blur'
                }]
            },
            album: {
                album_name: '',
                album_intro: '',
                album_category: 1,
                issue_date: new Date(),
                min_age: 0,
                max_age: 100
            },
            category: [{
                "code": 1,
                "name": "欢乐儿歌"
            }, {
                "code": 2,
                "name": "国学经典"
            }, {
                "code": 3,
                "name": "童话故事"
            }, {
                "code": 4,
                "name": "英语启蒙"
            }]
        }
    },
    created: function() {
        this.isLogin();
        this.getCategory();
    },
    methods: {
        getCategory() {
            this.axios({
                method: 'get',
                url: this.category_url
            }).then(res => {
                if (res.data.status === 0) {
                    this.category = res.data.data;
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.data.message
                    });
                }
            })
        },
        upload(e) {
            let input = e.target.querySelector('.upload') || e.target.parentNode.querySelector('.upload');
            input.click();
        },
        checkFile(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            if (this.isImg(files[0])) {
                this.createImage(files);
            } else {
                e.target.value = null;
                this.img_url = '';
            }
        },
        isImg(file) {
            let isImg = file.type === 'image/jpeg' || file.type === 'image/png';
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
        submitForm() {
            this.$refs['album'].validate((valid) => {
                if (valid) {
                    if (document.querySelector('.upload').value) {
                        this.postForm();
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '请上传图片文件'
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
            let file = document.querySelector('.upload');
            FormData.append('album_name', this.album.album_name);
            FormData.append('file', file.files[0], file.files[0].name);
            FormData.append('album_intro', this.album.album_intro);
            FormData.append('album_category', this.album.album_category);
            FormData.append('issue_date', this.timeFormatter(this.album.issue_date));
            FormData.append('min_age', this.album.min_age);
            FormData.append('max_age', this.album.max_age);
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
                this.$alert(res.data.message, '创建专辑', {
                    confirmButtonText: '确定',
                    callback: action => {
                        if (res.data.status === 0) {
                            this.resetForm('album');
                        }
                    }
                });
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            document.querySelector('.upload').value = null;
            this.img_url = '';
        }
    }
}
</script>
<style>
.el-upload {
    height: 50px;
    width: 50px;
    border: #d9d9d9 1px dashed;
    border-radius: 3px;
    margin-right: 30px;
}

.el-icon-plus.avatar-uploader-icon {
    line-height: 50px;
}

.el-form-item .el-form-item__content {
    line-height: 1;
}

img {
    max-height: 400px;
    height: 100%;
    width: 100%;
}
</style>
