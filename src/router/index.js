import Vue from 'vue'
import Router from 'vue-router'
import Axios from 'axios'
import VueAxios from 'vue-axios'
import Hello from '@/components/Hello'
import Index from '@/components/Index'
import Album from '@/components/album/Album'
import AlbumCreate from '@/components/album/Create'
import AlbumShow from '@/components/album/Show'
import AlbumIcon from '@/components/album/ModifyIcon'
import AlbumModify from '@/components/album/Modify'
import SongList from '@/components/song/List'
import SongCreate from '@/components/song/Create'
import SongShow from '@/components/song/Show'
import SongModify from '@/components/song/Modify'
import SongAudio from '@/components/song/ModifyAudio'
import SongIcon from '@/components/song/ModifyIcon'
import AccountList from '@/components/account/List'
import AccountCreate from '@/components/account/Create'
import AccountModify from '@/components/account/Modify'
import SingerList from '@/components/singer/List'
import SingerCreate from '@/components/singer/Create'
import SingerShow from '@/components/singer/Show'
import SingerModify from '@/components/singer/Modify'
import SingerIcon from '@/components/singer/ModifyIcon'
import ChooseSinger from '@/components/choosesinger/ChooseSinger'
import LazyPage from '@/components/choosesinger/Lazy'

/* 注册插件 */
Vue.use(Router)
Vue.use(VueAxios, Axios)
    // Axios.defaults.withCredentials = true//跨域传递cookie

export default new Router({
    // mode: 'history',
    routes: [{
        path: '/',
        name: 'Hello',
        component: Hello
    }, {
        path: '/index',
        name: 'Index',
        component: Index,
        children: [{
            path: 'album',
            name: 'Album',
            component: Album,
            alias: '/index'
        }, {
            path: 'album/show/:id',
            name: 'AlbumShow',
            component: AlbumShow
        }, {
            path: 'album/create',
            name: 'AlbumCreate',
            component: AlbumCreate
        }, {
            path: 'album/modify/:id',
            name: 'AlbumModify',
            component: AlbumModify
        }, {
            path: 'album/modify/icon/:id',
            name: 'AlbumIcon',
            component: AlbumIcon,
        }, {
            path: 'song',
            name: 'SongList',
            component: SongList
        }, {
            path: 'song/create/:id/:name',
            name: 'SongCreate',
            component: SongCreate
        }, {
            path: 'song/show/:id',
            name: 'SongShow',
            component: SongShow
        }, {
            path: 'song/modify/:id',
            name: 'SongModify',
            component: SongModify
        }, {
            path: 'song/modify/audio/:id',
            name: 'SongAudio',
            component: SongAudio
        }, {
            path: 'song/modify/icon/:id',
            name: 'SongIcon',
            component: SongIcon
        },  {
            path: 'account',
            name: 'AccountList',
            component: AccountList
        },  {
            path: 'account/create',
            name: 'AccountCreate',
            component: AccountCreate
        },  {
            path: 'account/modify/:id',
            name: 'AccountModify',
            component: AccountModify
        }, {
            path: 'singer',
            name: 'SingerList',
            component: SingerList
        },  {
            path: 'singer/create',
            name: 'SingerCreate',
            component: SingerCreate
        },  {
            path: 'singer/show/:id',
            name: 'SingerShow',
            component: SingerShow
        },  {
            path: 'singer/modify/:id',
            name: 'SingerModify',
            component: SingerModify
        },  {
            path: 'singer/modify/icon/:id',
            name: 'SingerIcon',
            component: SingerIcon
        }, {
            path: 'choosesinger',
            name: 'ChooseSinger',
            component: ChooseSinger
        }, {
            path: 'lazy',
            name: 'LazyPage',
            component: LazyPage
        }, ]
    }, ]
})
