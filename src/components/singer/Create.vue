<template>
    <div>
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>歌手</el-breadcrumb-item>
            <el-breadcrumb-item>创建</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="singer" :rules="rules" ref="singer" label-width="100px" @keyup.enter="submitForm()">
            <el-form-item label="歌手名称" prop="singer_name">
                <el-input v-model="singer.singer_name"></el-input>
            </el-form-item>
            <el-form-item label="歌手图片" prop="singer_icon" required>
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
            <el-form-item label="歌手介绍" prop="singer_intro">
                <el-input type="textarea" v-model="singer.singer_intro"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="singer.singer_sex" placeholder="请选择性别">
                    <template v-for="item in sex">
                        <el-option v-bind:label="item.name" v-bind:value="item.code"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="出生日期">
                <el-col :span="8">
                    <el-form-item prop="singer_birthday">
                        <el-date-picker type="date" placeholder="选择日期" v-model="singer.singer_birthday" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()">立即创建</el-button>
                <el-button @click="resetForm('singer')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'hello',
    data() {
        let checkAge = (rule, value, callback) => {
            value = new Date(value);
            if (value > new Date()) {
                callback(new Error('出生日期不符合格式要求'));
            } else {
                callback();
            }
        };
        return {
            submit_url: APIURL + '/singer/create',
            img_url: '',
            rules: {
                singer_name: [{
                    required: true,
                    message: '请输入歌手名称',
                    trigger: 'blur'
                }, {
                    min: 1,
                    max: 50,
                    message: '长度在 1 到 50 个字符',
                    trigger: 'blur'
                }],
                singer_intro: [{
                    required: false,
                    message: '',
                    trigger: 'blur'
                }],
                singer_birthday: [{
                    validator: checkAge,
                    trigger: 'change'
                }]
            },
            singer: {
                singer_name: '',
                singer_intro: '',
                singer_sex: "男",
                singer_birthday: new Date()
            },
            sex: [{
                "code": "男",
                "name": "男"
            }, {
                "code": "女",
                "name": "女"
            }, {
                "code": "保密",
                "name": "保密"
            }]
        }
    },
    methods: {
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
            this.$refs['singer'].validate((valid) => {
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
            FormData.append('singer_name', this.singer.singer_name);
            FormData.append('file', file.files[0], file.files[0].name);
            FormData.append('singer_intro', this.singer.singer_intro);
            FormData.append('singer_sex', this.singer.singer_sex);
            FormData.append('singer_birthday', this.timeFormatter(this.singer.singer_birthday));
            FormData.append('singer_uploader_name', this.getCookie('username'));
            this.axios({
                method: 'post',
                url: this.submit_url,
                headers: {
                    'content-type': 'multipart/form-data'
                },
                data: FormData
            }).then(res => {
                this.$alert(res.data.message, '创建歌手', {
                    confirmButtonText: '确定',
                    callback: action => {
                        if (res.data.status === 0) {
                            this.resetForm('singer');
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
