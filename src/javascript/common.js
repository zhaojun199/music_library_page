import router from './../router';

export default {
    install(Vue) {
        window.HOSTURL = "http://127.0.0.1:3000/";
        window.APIURL = HOSTURL + "api/1.0";
        window.PLACEHOLDERIMG = 'public/image/album/4d57fac0-094e-11e7-9a0c-d74d46979ecd.jpg';

        Vue.prototype.addHost = function(url) {
            return url ? HOSTURL + url : HOSTURL + PLACEHOLDERIMG;
        },
        //时间格式化
        Vue.prototype.timeFormatter = function(value) {
            // var da = new Date(value.replace("/Date(", "").replace(")/" , "").split( "+")[0]);
            var da = new Date(value);
            return da.getFullYear() + "-" + ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "-" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate()) + " " + (da.getHours() < 10 ? "0" + da.getHours() : da.getHours()) + ":" + (da.getMinutes() < 10 ? "0" + da.getMinutes() : da.getMinutes()) + ":" + (da.getSeconds() < 10 ? "0" + da.getSeconds() : da.getSeconds());
        };

        //获取cookies
        function getCookie(key) {
            let arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        };
        Vue.prototype.getCookie = getCookie;
        
        //判断是否登录
        Vue.prototype.isLogin = () => {
        	let lid = getCookie('lid');
        	let username = getCookie('username');
        	let type = getCookie('type');
        	if(lid && username && type){
        		return true;
        	}else{
        		router.push({name : 'Hello'});
        		return false;
        	}
        };

    }
}
