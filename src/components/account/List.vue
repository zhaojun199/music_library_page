<template>
    <div>
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>账户</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="search">
            <!-- <input v-model="search" class="search-input" @keyup.enter="subsearch"></input>
            <el-button size="small" type="primary" icon="search" @click="subsearch"></el-button> -->
            <el-button type="success" size="small">
                <router-link :to="{ name: 'AccountCreate' }" style="color:#fff">新建账号<i class="el-icon-plus el-icon--right"></i></router-link>
            </el-button>
        </div>
        <el-table :data="list" border style="width: 100%;" height="460">
            <el-table-column prop="id" label="id" width="80">
            </el-table-column>
            <el-table-column prop="username" label="账号">
            </el-table-column>
            <el-table-column prop="type" label="账号类型" width="130" :filters="type" :filter-method="filterType">
                <template scope="scope">
                    <el-tag :type="scope.row.type === 'administrator' ? 'primary' : 'success'" close-transition>{{scope.row.type}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="true_name" label="真实姓名">
            </el-table-column>
            <el-table-column prop="email" label="邮箱">
            </el-table-column>
            <el-table-column prop="tel" label="电话">
            </el-table-column>
            <el-table-column label="状态">
                <template scope="scope">
                    {{formatDelete(scope.row.admin_delete)}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="130">
                <template scope="scope">
                    <router-link :to="{ name: 'AccountModify', params: { id: scope.row.id }}">
                        <el-button type="info" size="small">编辑</el-button>
                    </router-link>
                    <el-button size="small" type="warning" @click.native.prevent="handleDelete(scope.$index, list, 'recover')" v-if="scope.row.admin_delete">恢复</el-button>
                    <el-button size="small" type="danger" @click.native.prevent="handleDelete(scope.$index, list)" v-else>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block" style="float: right">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current_page" :page-sizes="[10, 20, 30, 40]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total_num">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    name: 'albumShow',
    data() {
        return {
            account_url: APIURL + '/account/list/all',
            delete_url: APIURL + '/account/delete/logic',
            recover_url: APIURL + '/account/recover',
            search_url: APIURL + '/search',
            search: '',
            list: [],
            current_page: 1,
            page_size: 10,
            total_num: 0,
            type: [{
                text: '管理员',
                value: 'administrator'
            }, {
                text: '客户',
                value: 'client'
            }, {
                text: '主播',
                value: 'anchor'
            }],
        }
    },
    created() {
        this.getAccountList();
    },
    methods: {
        getAccountList() {
            let getData = {
                id: '*',
                username: this.getCookie('username'),
                type: this.getCookie('type'),
                role: this.$store.state.role ? this.$store.state.role : this.getCookie('username'),
                page: this.current_page,
                pageSize: this.page_size
            }
            this.axios.get(this.account_url, {
                    params: getData
                })
                .then((response) => {
                    if (response.data.status === 0) {
                        this.list = response.data.data;
                        this.total_num = response.data.data.length;
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        filterType(value, row) {
            return row.type === value;
        },
        formatDelete(value) {
            return value ? '已删除' : '正常';
        },
        handleDelete(index, row, tag) {
            let postData = {
                    id: row[index].id
                },
                curl = tag === 'recover' ? this.recover_url : this.delete_url,
                tag_ch = tag === 'recover' ? '恢复' : '删除';
            this.$confirm('确认' + tag_ch + '账号?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios.get(curl, {
                            params: postData
                        })
                        .then((response) => {
                            if (response.data.status === 0) {
                                this.getAccountList();
                            }
                            this.$message({
                                type: 'success',
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
                        message: '已取消' + tag_ch
                    });
                });
        },
        subsearch() {
            return;
            if (!this.search) return;
            let getData = {
                target: 'song',
                content: this.search,
                username: this.getCookie('username'),
                type: this.getCookie('type'),
                role: this.$store.state.role ? this.$store.state.role : this.getCookie('username'),
                page: this.current_page,
                pageSize: this.page_size
            }
            this.axios.get(this.search_url, {
                    params: getData
                })
                .then(res => {
                    if (res.data.status === 0) {
                        this.list = res.data.data.list
                        this.total_num = res.data.data.total_num
                    }
                })
        },
        handleSizeChange(val) {
            this.page_size = val;
            this.getAlbumlist();
        },
        handleCurrentChange(val) {
            this.current_page = val;
            this.getAlbumlist();
        }
    },
    computed: {
        curRole() {
            return this.$store.state.role;
        }
    },
    watch: {
        curRole() {
            this.getSongList(this.$route.params.id);
        }
    }
}
</script>
