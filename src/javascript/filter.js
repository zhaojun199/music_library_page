import Vue from 'vue';

Vue.filter('getAge', value => {
    let then = new Date(value).getTime();
    let now = new Date().getTime();
    let age = Math.floor((now - then) / (1000 * 3600 * 24 * 365));
    return age + '岁';
})
