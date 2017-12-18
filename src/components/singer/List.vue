<template>
    <div>
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>歌手</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="search">
            <input v-model="search" class="search-input" @keyup.enter="subsearch"></input>
            <el-button size="small" type="primary" icon="search" @click="subsearch"></el-button>
            <el-button type="success" size="small">
                <router-link :to="{ name: 'SingerCreate' }" style="color:#fff">新建歌手<i class="el-icon-plus el-icon--right"></i></router-link>
            </el-button>
        </div>
        <el-table :data="list" border style="width: 100%;" height="460">
            <el-table-column prop="id" label="id" width="80">
            </el-table-column>
            <el-table-column label="图标" width="66" :formatter="formatImg">
                <template scope="scope">
                    <div @click.prevent="changeIcon(scope.row)">
                        <img class="list-img" :src="formatImg(scope.row.singer_icon)">
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="singer_name" label="歌手名">
            </el-table-column>
            <el-table-column prop="singer_sex" label="性别" width="80">
            </el-table-column>
            <el-table-column label="年龄" width="130">
                <template scope="scope">
                    {{scope.row.singer_birthday | getAge}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="175">
                <template scope="scope">
                    <router-link :to="{ name: 'SingerShow', params: { id: scope.row.id }}" style="color:#fff">
                        <el-button size="small" type="info">详情
                        </el-button>
                    </router-link>
                    <template v-if="isMine(scope.row.upload_user_name)">
                        <router-link :to="{ name: 'SingerModify', params: { id: scope.row.id }}">
                            <el-button size="small">编辑
                            </el-button>
                        </router-link>
                        <el-button size="small" type="danger" @click.native.prevent="handleDelete(scope.$index, list)">删除</el-button>
                    </template>
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
    name: 'singer',
    data() {
        return {
            api_url: APIURL + '/singer/list',
            delete_url: APIURL + '/singer/delete/logic',
            search_url: APIURL + '/search',
            search : '',
            current_page: 1,
            page_size: 10,
            total_num: 0,
            list: [],
        }
    },
    created: function() {
        this.getSingerlist();
    },
    methods: {
        getSingerlist: function() {
            let getData = {
                username: this.getCookie('username'),
                type: this.getCookie('type'),
                role: this.$store.state.role ? this.$store.state.role : this.getCookie('username'),
                page: this.current_page,
                pageSize: this.page_size
            }
            this.axios.get(this.api_url, {
                    params: getData
                })
                .then((response) => {
                    if (response.data.status === 0) {
                        this.list = response.data.data.list
                        this.total_num = response.data.data.total_num
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        formatImg: function(url) {
            return url ? HOSTURL + url : HOSTURL + PLACEHOLDERIMG;
        },
        isMine(name) {
            if(this.getCookie('type') === 'administrator') return true;
            return this.getCookie('username') === name;
        },
        subsearch() {
            if(!this.search) return;
            let getData = {
                target: 'singer',
                content: this.search,
                username: this.getCookie('username'),
                type: this.getCookie('type'),
                role: this.$store.state.role ? this.$store.state.role : this.getCookie('username'),
                page: this.current_page,
                pageSize: this.page_size
            }
            this.axios.get(this.search_url, {
                    params : getData
                })
                .then(res => {
                    if (res.data.status === 0) {
                        this.list = res.data.data.list
                        this.total_num = res.data.data.total_num
                    }
                })
        },
        changeIcon(row) {
            if (!this.isMine(row.singer_uploader_name)) {
                this.$message({
                    type: 'warning',
                    message: '只能编辑自己的专辑图标'
                });
                return;
            }
            let to_router = {
                name: 'SingerIcon',
                params: {
                    id: row.id
                }
            };
            this.$router.push(to_router);
        },
        handleDelete(index, row) {
            let postData = {
                id: row[index].id
            }
            this.$confirm('确认删除歌手，同时会删除该歌手下所有歌曲哦?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios.get(this.delete_url, {
                            params: postData
                        })
                        .then((response) => {
                            if (response.data.status === 0) {
                                row.splice(index, 1);
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
                        message: '已取消删除'
                    });
                });
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
    filters: {
        getAge: (value) => {
            let then = new Date(value).getTime();
            let now = new Date().getTime();
            let age = Math.floor((now - then) / (1000 * 3600 * 24 * 365));
            return age + '岁';
        },
    },
    computed: {
        curRole() {
            return this.$store.state.role;
        }
    },
    watch: {
        curRole() {
            this.getSingerlist();
        }
    }
}
</script>
