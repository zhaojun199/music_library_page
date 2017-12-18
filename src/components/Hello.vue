<template>
    <div @keyup.enter="submitForm('ruleForm')">
        <el-col :span="12" :offset="6" style="margin-top:100px">
            <h1>酷旗音乐库管理后台</h1>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="账号" prop="username" style="margin-bottom: 30px;">
                    <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item label="保留一个月" prop="save">
                    <el-switch on-text="" off-text="" v-model="ruleForm.save"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </div>
</template>
<script>
export default {
    name: 'hello',
    data() {
        return {
            login_url: APIURL + '/login',
            ruleForm: {
                username: '',
                password: '',
                save: false
            },
            rules: {
                username: [{
                    required: true,
                    message: '请输入账户',
                    trigger: 'blur'
                }, {
                    pattern: /^[A-Za-z][A-Za-z1-9_-]+$/,
                    message: '字母开头 + 数字/字母/下划线',
                    trigger: 'blur'
                }, {
                    min: 6,
                    max: 30,
                    message: '长度在 6 到 30 个字符',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }, {
                    min: 6,
                    max: 30,
                    message: '长度在 6 到 30 个字符',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let post_data = this.ruleForm;
                    this.axios({
                            method: 'post',
                            url: this.login_url,
                            data: post_data
                        }).then((response) => {
                            if (response.data.status === 0) {
                                this.$message({
                                    type: 'success',
                                    message: response.data.message
                                });
                                this.saveLoginStatus(response.data.data, post_data.save);
                                this.$router.push({
                                  name: 'Index'
                                });
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: response.data.message
                                });
                            }
                        })
                        .catch(function(response) {
                            console.log(response)
                        });
                } else {
                    this.$message({
                        type: 'error',
                        message: '请按规则填写'
                    });
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        saveLoginStatus(info, status) {
            let days = status ? 30 : 1;
            this.setCookie('lid', info.id ,days);
            this.setCookie('username', info.username ,days);
            this.setCookie('type', info.type ,days);
        },
        setCookie(key, value, days) {
            let exp = new Date();
            exp.setTime(exp.getTime() + parseInt(days) * 24 * 3600 * 1000);
            document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString();
        }
    }
}
</script>
<style scoped>
h1,
h2 {
    font-weight: normal;
    text-align: center;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
