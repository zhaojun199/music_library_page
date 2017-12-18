<template>
    <div>
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>账号</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
            <el-breadcrumb-item>编辑</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="singer" :rules="rules" ref="singer" label-width="100px" @keyup.enter="submitForm('singer')">
            <el-form-item label="歌手名称" prop="singer_name">
                <el-input v-model="singer.singer_name"></el-input>
            </el-form-item>
            <el-form-item label="歌手简介" prop="singer_intro">
                <el-input type="textarea" v-model="singer.singer_intro"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="singer_sex">
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
                <el-button type="primary" @click="submitForm('singer')">立即修改</el-button>
                <el-button @click="resetForm('singer')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'singerModify',
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
            data_url: APIURL + '/singer/show',
            submit_url: APIURL + '/singer/modify',
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
                id: 0,
                singer_name: '',
                singer_sex: '',
                singer_intro: '',
                singer_birthday: '',
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
    created() {
        this.getSingerInfo(this.$route.params.id)
    },
    methods: {
        getSingerInfo(id) {
            let getData = {
                id: id
            }
            this.axios.get(this.data_url, {
                    params: getData
                })
                .then((res) => {
                    if (res.data.status === 0) {
                        this.singer.id = res.data.data.id;
                        this.singer.singer_name = res.data.data.singer_name;
                        this.singer.singer_intro = res.data.data.singer_intro;
                        this.singer.singer_sex = res.data.data.singer_sex;
                        this.singer.singer_birthday = res.data.data.singer_birthday;
                    }
                })
                .catch(function(res) {
                    console.log(res)
                })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let postData = this.$refs[formName].model;
                    this.$confirm('确认更新歌手?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.axios.get(this.submit_url, {
                                    params: postData
                                })
                                .then((response) => {
                                    if (response.data.status === 0) {
                                        this.$message({
                                            type: 'success',
                                            message: response.data.message
                                        });
                                    }
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
