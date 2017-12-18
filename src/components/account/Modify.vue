<template>
    <div>
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>账号</el-breadcrumb-item>
            <el-breadcrumb-item>修改</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="account" :rules="rules" ref="account" label-width="100px" @keyup.enter="submitForm()">
            <el-row>
                <el-col :offset="7" :span="8">
                    <el-form-item label="账号名">
                        <div class="no-input">{{account.username}}</div>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="account.password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="r_password" required>
                        <el-input type="password" v-model="account.r_password"></el-input>
                    </el-form-item>
                    <el-form-item label="账号类型">
                        <div class="no-input">{{account.type}}</div>
                    </el-form-item>
                    <el-form-item label="真实姓名" prop="true_name">
                        <el-input v-model="account.true_name"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="account.email"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="tel">
                        <el-input v-model="account.tel"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm()">立即修改</el-button>
                        <el-button @click="resetForm('account')">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
    </div>
</template>
<script>
export default {
    name: 'AccountCreate',
    data() {
        let validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.account.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            data_url: APIURL + '/account/show',
            submit_url: APIURL + '/account/modify',
            account: {
                id: 0,
                username: '',
                password: '',
                r_password: '',
                true_name: '',
                type: 'client',
                email: '',
                tel: '',
            },
            rules: {
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }, {
                    min: 1,
                    max: 30,
                    message: '长度在 1 到 30 个字符',
                    trigger: 'blur'
                }],
                r_password: [{
                    validator: validatePass,
                    trigger: 'blur'
                }],
                true_name: [{
                    required: true,
                    message: '请输入真实姓名',
                    trigger: 'blur'
                }],
                email: [{
                    pattern: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
                    message: '请输入正确的邮箱格式',
                    trigger: 'blur'
                }],
                tel: [{
                    pattern: /(^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$)|(^1(3|4|5|7|8)\d{9}$)/,
                    message: '请输入正确的电话号码',
                    trigger: 'blur'
                }]
            }
        }
    },
    created() {
        this.getAccountInfo(this.$route.params.id);
    },
    methods: {
        getAccountInfo(id) {
            let getData = {
                id: id
            }
            this.axios.get(this.data_url, {
                    params: getData
                })
                .then((response) => {
                    if (response.data.status === 0) {
                        this.account.id = this.$route.params.id;
                        this.account.username = response.data.data.username;
                        this.account.true_name = response.data.data.true_name;
                        this.account.email = response.data.data.email;
                        this.account.tel = response.data.data.tel;
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        submitForm() {
            this.$refs['account'].validate((valid) => {
                if (valid) {
                    let postData = this.$refs['account'].model;
                    this.$confirm('确认修改账号?', '提示', {
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
                                        this.$refs['account'].resetFields();
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
                                message: '已取消'
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
