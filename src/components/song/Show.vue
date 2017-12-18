<template>
    <div>
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>单曲</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-col :span="24">
            <div style="text-align: center;background:#FBFDFF">
                <el-row>
                    <el-col :span="24">
                        <h3>{{song.song_name}}</h3>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" style="line-height: 54px;">
                        <div class="left-label">歌曲图标：</div>
                    </el-col>
                    <el-col :span="12">
                        <div>
                            <img :src="addHost(song.song_icon)" style="width:50px;height:50px;">
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="left-label">歌曲介绍：</div>
                    </el-col>
                    <el-col :span="12">
                        <div>{{song.song_intro}}</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="left-label">歌曲试听：</div>
                    </el-col>
                    <el-col :span="12">
                        <audio :src="addHost(song.song_path_middle)" controls></audio>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <div class="left-label">所属专辑：</div>
                    </el-col>
                    <el-col :span="6">
                        <div>{{song.album_name}}</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="left-label">所属类别：</div>
                    </el-col>
                    <el-col :span="6">
                        <div>{{song.type_name}}</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <div class="left-label">歌曲大小：</div>
                    </el-col>
                    <el-col :span="6">
                        <div>{{song.song_size_middle}}B</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="left-label">歌曲时长：</div>
                    </el-col>
                    <el-col :span="6">
                        <div>{{song.song_duration}}s</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <div class="left-label">点赞数：</div>
                    </el-col>
                    <el-col :span="6">
                        <div>{{song.song_like}}</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="left-label">点击量：</div>
                    </el-col>
                    <el-col :span="6">
                        <div>{{song.song_hits}}</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <div class="left-label">上传者：</div>
                    </el-col>
                    <el-col :span="6">
                        <div>{{song.upload_user_name}}</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="left-label">歌手名：</div>
                    </el-col>
                    <el-col :span="6">
                        <div>{{song.song_singer_name}}</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <div class="left-label">适配年龄：</div>
                    </el-col>
                    <el-col :span="6">
                        <div>{{song.album_min_age}}~{{song.album_max_age}}岁</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="left-label">序号：</div>
                    </el-col>
                    <el-col :span="6">
                        <div>{{song.song_order}}</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <div class="left-label">发行时间：</div>
                    </el-col>
                    <el-col :span="6">
                        <div>{{timeFormatter(song.issue_date)}}</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="left-label">更新时间：</div>
                    </el-col>
                    <el-col :span="6">
                        <div>{{timeFormatter(song.update_time)}}</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="left-label">歌曲歌词：</div>
                    </el-col>
                    <el-col :span="12">
                        <div>{{song.song_lyirc}}</div>
                    </el-col>
                </el-row>
            </div>
        </el-col>
    </div>
</template>
<script>
export default {
    name: 'songShow',
    data() {
        return {
            song_url: APIURL + '/song/show',
            delete_url: APIURL + '/song/delete/logic',
            song: {
                song_icon: PLACEHOLDERIMG
            }
        }
    },
    created() {
        this.getSongInfo(this.$route.params.id);
    },
    methods: {
        getSongInfo(id) {
            let getData = {
                id: id
            }
            this.axios.get(this.song_url, {
                    params: getData
                })
                .then((response) => {
                    if (response.data.status === 0) {
                        this.song = response.data.data;
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
        changeIcon(row) {
            if (!this.isMine(row.upload_user_name)) {
                this.$message({
                    type: 'warning',
                    message: '只能编辑自己的歌曲图标'
                });
                return;
            }
            let to_router = {
                name: 'AlbumIcon',
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
        handleSizeChange(val) {
            this.page_size = val;
            this.getAlbumlist();
        },
        handleCurrentChange(val) {
            this.current_page = val;
            this.getAlbumlist();
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
