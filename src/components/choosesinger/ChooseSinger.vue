<template>
    <div class="wrapper" @click.stop>
        <div class="filter-initial">
            <span class="filter-name">筛选:</span>
            <ul class="filter-initial-ul">
                <template v-for="item in list">
                    <li @click="changeIndex" :class="{'active': index === item[0]['c_index']}" class="filter-initial-li"><span class="filter-initial-item">{{item[0]['c_index']}}</span></li>
                </template>
                <li class="filter-initial-li" @click="resetIndex"><span class="filter-initial-item">重置</span></li>
            </ul>
        </div>
        <div class="singer-list">
            <ul class="singer-ul">
                <template v-for="item in cur_list">
                    <li class="singer-li" @click="chooseSinger(item.id, item.singer_name)">
                        <div class="singer-it-top">
                            <img :src="addHost(item.singer_icon)">
                        </div>
                        <div class="singer-it-bottom">{{item.singer_name}}</div>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            singer_url: APIURL + '/singer/name/list',
            index: '',
            list: [],/*[ [ {
                      id: 13,
                      singer_name: '娴嬭瘯姝屾墜',
                      singer_icon: 'public/image/singer/3d8458c0-1a7c-11e7-b843-d9f319f0f8ff.png',
                      c_index: 'C' } ],
                  [ {
                      id: 10,
                      singer_name: 'dsggdfg',
                      singer_icon: 'public/image/singer/67bff870-19c7-11e7-bfa2-696100d9d355.png',
                      c_index: 'D' } ],
                  [ {
                      id: 12,
                      singer_name: 'jyjyjyj',
                      singer_icon: 'public/image/singer/12fd0b90-19e8-11e7-b1c4-93e22485204f.png',
                      c_index: 'J' } ],
                  [ {
                      id: 11,
                      singer_name: 'mvbmvbm',
                      singer_icon: 'public/image/singer/383c3240-19df-11e7-8abf-6123c0c796b8.jpg',
                      c_index: 'M' } ],
                  [ {
                      id: 7,
                      singer_name: 'testanchorname',
                      singer_icon: '',
                      c_index: 'T' },
                    {
                      id: 8,
                      singer_name: 'testanchor2',
                      singer_icon: '',
                      c_index: 'T' },
                    {
                      id: 9,
                      singer_name: 'testanchor',
                      singer_icon: '',
                      c_index: 'T' } ] ],*/
            cur_list: [],
        }
    },
    created() {
        this.getSingerlist();
    },
    methods: {
        getSingerlist() {
            this.axios.get(this.singer_url).then(res => {
                if(res.data.status === 0){
                    this.list = res.data.data;
                    this.index = res.data.data[0][0]['c_index'];
                    this.cur_list = res.data.data[0];

                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.message
                    });
                }
            })
        },
        changeIndex(e) {
            let cur = e.srcElement || e.target;
            if(this.index === cur.innerText) return;
            this.index = cur.innerText;
            this.list.forEach((val) => {
                if(val[0]['c_index'] === cur.innerText){
                    this.cur_list = val;
                    return false;
                }
            })
        },
        chooseSinger(id, name) {
            this.$emit('singer', id, name);
        },
        resetIndex() {
            this.$emit('singer', null);
        }
    }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/css">
base-color = #8F9096
.wrapper
    position: absolute
    width: 95%
    background: rgb(250, 250, 250)
    border-radius: 4px
    border: 1px solid rgb(230, 230, 230)
    z-index: 20

.filter-initial
    margin-left: 15px
    .filter-name
        color: base-color
        font-weight: 700
    .filter-initial-ul
        display: inline-block
        .filter-initial-li
            display: inline-block
            padding: 6px
            .filter-initial-item
                position: relative
                padding: 2px 6px
                color: base-color
                cursor: pointer
                &:hover
                    color: #000
                &:after
                    position: relative
                    right: -12px
                    top: 1px
                    display: inline-block
                    content: ' '
                    height: 14px
                    width: 1px
                    border-right: 1px solid #8f9096
            &:last-child
                .filter-initial-item
                    border-right: 0px
                    &:after
                        display: none
            &.active
                .filter-initial-item
                    background:base-color
                    color: #fff
                    border-radius: 4px
.singer-list
    .singer-ul
        .singer-li
            display:inline-block
            margin: 5px 0 5px 15px
            cursor: pointer
            .singer-it-top
                width: 100px
                height: @width
                border-radius: 4px
                overflow: hidden
            .singer-it-bottom
                margin-top: 10px
                text-align: center
                font-size: 12px
</style>
