<template>
    <div>
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>专辑</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-col :span="24">
            <div class="search">
                <input v-model="search" class="search-input" @keyup.enter="subsearch"></input>
                <el-button size="small" type="primary" icon="search" @click="subsearch"></el-button>
                <el-dropdown>
                    <el-button type="info" size="small">
                        更多信息<i class="el-icon-caret-bottom el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown" style="width:1000px;margin-right:10px;">
                        <div style="text-align: center;background:#FBFDFF">
                            <el-row>
                                <el-col :span="24">
                                    <h3>{{album.album_name}}</h3>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12" style="line-height: 54px;">
                                    <div class="left-label">专辑图标：</div>
                                </el-col>
                                <el-col :span="12">
                                    <div>
                                        <img :src="formatImg(album.album_icon)" style="width:50px;height:50px;">
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <div class="left-label">专辑介绍：</div>
                                </el-col>
                                <el-col :span="12">
                                    <div>{{album.album_intro}}</div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <div class="left-label">专辑类别：</div>
                                </el-col>
                                <el-col :span="6">
                                    <div>{{album.category_name}}</div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="left-label">歌手名：</div>
                                </el-col>
                                <el-col :span="6">
                                    <div>{{album.singer_name}}</div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <div class="left-label">歌曲数目：</div>
                                </el-col>
                                <el-col :span="6">
                                    <div>{{album.songs_count}}</div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="left-label">点击量：</div>
                                </el-col>
                                <el-col :span="6">
                                    <div>{{album.album_hits}}</div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <div class="left-label">上传者：</div>
                                </el-col>
                                <el-col :span="6">
                                    <div>{{album.upload_user_name}}</div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="left-label">点赞数：</div>
                                </el-col>
                                <el-col :span="6">
                                    <div>{{album.album_like}}</div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <div class="left-label">适配年龄：</div>
                                </el-col>
                                <el-col :span="6">
                                    <div>{{album.album_min_age}}~{{album.album_max_age}}岁</div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="left-label">序号：</div>
                                </el-col>
                                <el-col :span="6">
                                    <div>{{album.album_order}}</div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <div class="left-label">发行时间：</div>
                                </el-col>
                                <el-col :span="6">
                                    <div>{{timeFormatter(album.issue_date)}}</div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="left-label">更新时间：</div>
                                </el-col>
                                <el-col :span="6">
                                    <div>{{timeFormatter(album.update_time)}}</div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button type="success" size="small" v-if="isMine(this.album.upload_user_name)">
                    <router-link :to="{ name: 'SongCreate', params: { id: $route.params.id , name: this.album.album_name }}" style="color:#fff">新建单曲<i class="el-icon-plus el-icon--right"></i></router-link>
                </el-button>
            </div>
        </el-col>
        <el-table :data="list" border style="width: 100%;" height="460">
            <el-table-column prop="id" label="id" width="80">
            </el-table-column>
            <el-table-column label="图标" width="66">
                <template scope="scope">
                    <div @click.prevent="changeIcon(scope.row)">
                        <img class="list-img" :src="formatImg(scope.row.song_icon)">
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="song_name" label="歌曲名">
            </el-table-column>
            <el-table-column label="试听/更换" width="120">
                <template scope="scope">
                    <div @click.prevent="play(scope.row.song_path_middle)" style="display:inline-block">
                        <img :src="play_img" class="list-img">
                    </div>
                    <router-link :to="{ name: 'SongAudio', params: { id: scope.row.id }}" style="color:#fff;margin: 7px 12px;position: absolute;" v-if="isMine(scope.row.upload_user_name)">
                        <el-button size="small" type="info">更换</el-button>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column prop="song_order" label="排序" width="130">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <router-link :to="{ name: 'SongShow', params: { id: scope.row.id }}" style="color:#fff">
                        <el-button size="small" type="info">详情</el-button>
                    </router-link>
                    <template v-if="isMine(scope.row.upload_user_name)">
                        <router-link :to="{ name: 'SongModify', params: { id: scope.row.id }}">
                            <el-button size="small">编辑</el-button>
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
    name: 'albumShow',
    data() {
        return {
            album_url: APIURL + '/album/show',
            song_url: APIURL + '/song/list',
            delete_url: APIURL + '/song/delete/logic',
            search_url: APIURL + '/search',
            search : '',
            audio: new Audio(),
            play_img: 'static/image/play.jpg',
            stop_img: 'static/image/stop.png',
            album: {
                album_icon: PLACEHOLDERIMG
            },
            list: [],
            current_page: 1,
            page_size: 10,
            total_num: 0
        }
    },
    created() {
        this.getAlbumInfo(this.$route.params.id);
        this.getSongList(this.$route.params.id);
        //监听音频ended事件
        this.audio.addEventListener('ended', () => {
            let list = document.querySelectorAll("img");
            for (let i = 0, l = list.length; i < l; i++) {
                if (list[i].src.indexOf(this.stop_img) > 0) {
                    list[i].src = this.play_img;
                }
            }
        })
    },
    methods: {
        getAlbumInfo(id) {
            let getData = {
                id: id
            }
            this.axios.get(this.album_url, {
                    params: getData
                })
                .then((response) => {
                    if (response.data.status === 0) {
                        this.album = response.data.data.album;
                    }
                })
                .catch(function(response) {
                    console.log(response)
                })
        },
        formatImg: function(url) {
            return HOSTURL + url;
        },
        getSongList(id) {
            let getData = {
                id: id,
                username: this.getCookie('username'),
                type: this.getCookie('type'),
                role: this.$store.state.role ? this.$store.state.role : this.getCookie('username'),
                page: this.current_page,
                pageSize: this.page_size
            }
            this.axios.get(this.song_url, {
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
        isMine(name) {
            if (this.getCookie('type') === 'administrator') return true;
            return this.getCookie('username') === name;
        },
        //播放音频
        play(url) {
            let e = event.target || event.srcElement;
            let list = document.querySelectorAll("img");
            for (let i = 0, l = list.length; i < l; i++) {
                if (list[i] == e) continue;
                if (list[i].src.indexOf(this.stop_img) > 0) {
                    list[i].src = this.play_img;
                }
            }
            this.audio.src = this.addHost(url);
            if (e.src.indexOf(this.play_img) > 0) {
                e.src = this.stop_img;
                this.audio.play();
            } else {
                e.src = this.play_img;
                this.audio.pause();
            }
        },
        changeIcon(row) {
            if (!this.isMine(row.upload_user_name)) {
                this.$message({
                    type: 'warning',
                    message: '只能编辑自己的歌曲图标'
                });
                return;
            }
            let to_router = {
                name: 'SongIcon',
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
            this.$confirm('确认删除专辑，同时会删除该专辑下所有歌曲哦?', '提示', {
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
        subsearch() {
            if(!this.search) return;
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
                    params : getData
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
<style scoped>
.el-col {
    padding: 2px;
    font-family: "Microsoft YaHei", "微软雅黑";
}

.left-label {
    color: #99A9BF;
}

.more {
    text-align: center;
    background: #EEF1F6;
    border-radius: 20px;
    color: #324157;
    padding: 3px 15px;
}
</style>
