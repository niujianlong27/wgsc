import axios from 'axios';
import router from '../router';
import {Toast, Notify} from 'vant';
import {getlocalStorage, removelocalStorage, setlocalStorage} from '../config/Utils'
import Qs from 'qs'
import Vue from 'vue'
import cookie from "vue-cookies"
import {Is_Login} from "../store/mutation-type";

Vue.use(Toast);
//请求超时120s
axios.defaults.timeout = 120000;
//请求base url
axios.defaults.baseURL = null;
axios.defaults.withCredentials = true;//让axios携带cookie

//设置post请求是的header信息
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//
// axios.defaults.transformRequest = [function (data) {
//   console.log(data);
//
//   let ret = '';
//   for (let it in data) {
//     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
//   }
//   console.log(ret);
//   return ret
// }];

// //http request 拦截器
axios.interceptors.request.use( // 请求数据设置
  config => {
    let token = getlocalStorage('token');
    if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers = {
        'token': token
      }
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
);

axios.interceptors.response.use( // 响应数据设置
  response => {

    if (response.data && ((typeof(data) == 'string') && (response.data.indexOf("系统异常") > -1))) {
      Toast(response.data);
    }

    if ((response.data instanceof Object) && !response.data.success && response.data.msg && (response.data.msg.indexOf("登录") != -1 || response.data.msg.indexOf("登陆") != -1)) {
      router.push('/signIn');
    }

    return response
  },
  err => {
    if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
      Notify('请求超时');
    }
    return Promise.reject(err)
  }
);


export default {
  get: function (url, params = {}) {
    let param = {...params, accessToken: getlocalStorage('token') || ''};
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: param,
      })
        .then(response => {
          resolve(response.data);
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  post: function (url, data) {
    let param = {...data, appFlag: 1, accessToken: getlocalStorage('token') || ''};
    let formData = new FormData();
    for (let it in param) {
      formData.append(it, param[it]);
    }
    return new Promise((resolve, reject) => {
      axios.post(url, formData)
        .then(response => {
          resolve(response.data);
        }, err => {
          reject(err)
        })
    })
  },
}
