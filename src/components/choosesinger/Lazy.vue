<template>
    <div class="wrapper" @click.stop>
        <div class="singer-list">
            <ul class="singer-ul">
                <template v-for="item in cur_list">
                    <li class="singer-li" style="width:100%">
                        <div class="singer-it-top" style="width:100%">
                            <img v-lazy="item.icon">
                        </div>
                        <div class="singer-it-bottom">{{item.title}}</div>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import lazy from '@/javascript/lazy'
Vue.use(lazy)

export default {
    data() {
            return {
                singer_url: './static/lazy.json',
                cur_list: [],
            }
        },
        created() {
          this.getSingerlist();
        },
        methods: {
            getSingerlist() {
                this.axios.get(this.singer_url).then(res => {
                    if (res.data.data) {
                        this.cur_list = this.cur_list.concat(res.data.data);
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.message
                        });
                    }
                })
            }
        }
}
</script>
