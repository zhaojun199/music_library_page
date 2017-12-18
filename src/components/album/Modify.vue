<template>
    <div>
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>专辑</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
            <el-breadcrumb-item>修改专辑</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="album" :rules="rules" ref="album" label-width="100px" @keyup.enter="submitForm('album')">
            <el-form-item label="专辑名称" prop="album_name">
                <el-input v-model="album.album_name"></el-input>
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
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-form-item prop="issue_date">
                        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="album.issue_date" style="width: 100%;"></el-time-picker>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label="序号" prop="album_order">
                <el-input type="number" v-model.number="album.album_order" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('album')">立即修改</el-button>
                <el-button @click="resetForm('album')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'AlbumModify',
    data() {
        return {
            data_url: APIURL + '/album/show',
            submit_url: APIURL + '/album/modify',
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
                album_order: [{
                    required: true,
                    message: '请填写序号'
                }, {
                    type: 'number',
                    message: '排序必须为数字值'
                }]
            },
            album: {
                id: 0,
                album_name: '',
                album_intro: '',
                album_category: 1,
                album_order: 0,
                issue_date: 0
            },
            category: []
        }
    },
    created() {
        this.getAlbumInfo(this.$route.params.id)
    },
    methods: {
        getAlbumInfo(id) {
            let getData = {
                id: id
            }
            this.axios.get(this.data_url, {
                    params: getData
                })
                .then((response) => {
                    if (response.data.status === 0) {
                        this.album.id = response.data.data.album.id;
                        this.album.album_name = response.data.data.album.album_name;
                        this.album.album_intro = response.data.data.album.album_intro;
                        this.album.album_category = response.data.data.album.album_category;
                        this.album.album_order = response.data.data.album.album_order;
                        this.album.issue_date = response.data.data.album.issue_date;
                        this.category = response.data.data.type;
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let postData = this.$refs[formName].model;
                    postData.issue_date = this.timeFormatter(postData.issue_date);
                    this.$confirm('确认更新专辑?', '提示', {
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
