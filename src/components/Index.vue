<template>
    <div>
        <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">处理中心</el-menu-item>
            <el-submenu index="2">
                <template slot="title">我的工作台</template>
                <el-menu-item index="2-1">开发中</el-menu-item>
                <el-menu-item index="2-2">开发中</el-menu-item>
                <el-menu-item index="2-3">开发中</el-menu-item>
            </el-submenu>
            <el-menu-item index="3">酷旗音乐库管理后台</el-menu-item>
            <el-menu-item index="4" style="float: right" @click="logout">退出登录</el-menu-item>
            <template v-if="isAdmin">
                <el-submenu index="5" style="float: right">
                    <template slot="title">{{name}}</template>
                    <template v-for="(item, index) in account_list">
                        <el-menu-item :index="getIndex(5,index)" @click="changeRole(item)">{{item}}</el-menu-item>
                    </template>
                </el-submenu>
            </template>
            <template v-else>
                <el-menu-item index="5" style="float: right">{{name}}</el-menu-item>
            </template>
        </el-menu>
        <el-row class="tac">
            <el-col :span="3">
                <el-menu default-active="2" @open="handleOpen" @close="handleClose">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-picture"></i>专辑</template>
                        <el-menu-item-group>
                            <el-menu-item index="1-1">
                                <router-link :to="{ path: '/index/album' }">列表</router-link>
                            </el-menu-item>
                            <el-menu-item index="1-2">
                                <router-link :to="{ path: '/index/album/create' }">新建</router-link>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-menu"></i>单曲</template>
                        <el-menu-item-group>
                            <el-menu-item index="1-1">
                                <router-link :to="{ path: '/index/song' }">列表</router-link>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <router-link :to="{ path: '/index/account' }" v-if="isAdminCom">
                        <el-menu-item index="3"><i class="el-icon-setting"></i>账户</el-menu-item>
                    </router-link>
                    <router-link :to="{ path: '/index/singer' }">
                        <el-menu-item index="4"><i class="el-icon-date"></i>歌手</el-menu-item>
                    </router-link>
                </el-menu>
            </el-col>
            <el-col :span="21">
                <router-view></router-view>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    name: 'index',
    data() {
        return {
            activeIndex: '1',
            account_url: APIURL + '/account/list/name',
            name: this.getCookie('username'),
            account_list: []
        }
    },
    created: function() {
        this.isLogin();
        this.getAccountList();
    },
    methods: {
        handleSelect(key, keyPath) {
            // console.log(key, keyPath);
        },
        handleOpen(key, keyPath) {
            // console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            // console.log(key, keyPath);
        },
        logout() {
            let _self = this;
            delCookie('username');
            delCookie('type');
            delCookie('lid');
            this.$router.push('/');

            function delCookie(name) {
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var cval = _self.getCookie(name);
                if (cval != null)
                    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
            }
        },
        isAdmin() {
            return this.getCookie('type') === 'administrator';
        },
        getAccountList() {
            if (!this.isAdmin()) return;
            this.axios.get(this.account_url)
                .then(res => {
                    if (res.data.status === 0) {
                        this.account_list = res.data.data;
                    }
                })
        },
        changeRole(role) {
            this.$store.commit('CHANGE_ROLE', role);
            this.name = this.$store.state.role;
        },
        getIndex(pre, index) {
            return pre + "-" + (index + 1);
        }
    },
    computed: {
        isAdminCom() {
            return this.getCookie('type') === 'administrator';
        }
    }
}
</script>
