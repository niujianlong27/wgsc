<template>
  <div id="app">

    <!--<transition :name="transitionName">-->
    <!--<router-view class="Router"></router-view>-->
    <!--</transition>-->

    <!-- 这里是需要keepalive的 -->
    <keep-alive>
      <router-view class="Router" v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>

    <!-- 这里不会被keepalive -->
    <router-view class="Router" v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
  import urls from './utils/urls';
  import http from './utils/http';
  import {mapActions, mapMutations} from 'vuex'
  import {setlocalStorage, removelocalStorage, getlocalStorage, removeSessionStorage} from "./config/Utils";
  import {Toast} from 'vant';

  export default {
    name: 'App',
    data: function () {
      return {
        transitionName: 'switch',
      }
    },
    methods: {
      ...mapMutations([
        'Set_ACTIVE',
        'SET_IDENTITY',
        'Set_USERNAME',
        'Set_loginType'
      ]),
      ...mapActions([
        'getCatalogList', 'getAddress', 'setImgs'
      ]),


      setActive(url) {
        if (url == '/home') {
          this.Set_ACTIVE(0)
        } else if (url == '/sceneModel') {
          this.Set_ACTIVE(1)
        } else if (url == '/goodsType') {
          this.Set_ACTIVE(2)
        } else if (url == '/shopCart') {
          this.Set_ACTIVE(3)
        } else if (url == '/personCenter') {
          this.Set_ACTIVE(4)
        }
      },

      startUp() {

        // let url ='http://www.iewego.com/wg-dist/?userName=null%20%E4%B8%9B%E4%BD%B3%E4%BD%B3&access_token=a44573bd-a4f8-4cb7-8f76-f24cd3221d1f&appCode=WG&flag=wg&signMix=a68525846763432bd580908d802'
        let url = window.location.href;  // 获取页面url
        let arr = url.split('/');
        let str = `/${arr[arr.length - 1]}`; // 获取登录的页面路由
        this.setActive(str); // 设置底部组件的显示
        if (url.includes("access_token")) { // 判断url中存在access_token
          let istrue = true; // 设置true值  根据是否有userName 改变
          let urlArr = url.split("&");

          urlArr.forEach(item => {

            if (item.includes('userName')) { // 有userName 字段进入判断
              let arr = item.split("="); // 以等号转换成数组
              let str2 = decodeURIComponent(arr[1]); //反编译转换成汉字
              let nameArr = str2.split("+");   // 以 + 转换成数组

              if (nameArr[0].includes('null')) {  // null 字段进入判断
                // Toast('工号获取失败，请重新登录！')
                removelocalStorage("token"); // 移除token 会跳转首页提示登录
                istrue = false;  //  userName 为 null； istrue 设置为false 不进入下面判断
                // this.$route.push('/signIn')
              }
              this.Set_USERNAME(str2.replace(/\+/ig, " "))  // 设置用户名
            }

            if (item.includes("access_token") && istrue) { //当前item 中存在access_token
              removelocalStorage("userInfo");  // 先移除localstorage
              removelocalStorage("token");  // 先移除localstorage

              let arr = item.split("=");
              setlocalStorage("token", arr[1]); // 设置token
              this.SET_IDENTITY(true);  // 单点登录身份为采购商
              this.Set_loginType('dandian'); // 设置单点

              http.get(urls.toSign, {accessToken: arr[1]}).then(res => { // 接口获取用户身份信息
                if (res.success) {
                  setlocalStorage("userInfo", res.obj);
                }
              }).catch(err => {

              });
            }

          })
        }
      }

    },
    created() {
      this.setImgs('首页轮播图'); // 查询图片
      this.setImgs('热门品牌');
      this.setImgs('行家精选');
      this.setImgs('场景轮播图');

      removeSessionStorage('filterAddress'); // 移除定位地址的设置
      removeSessionStorage('filterAddressCode'); // 移除定位地址code的设置
      removelocalStorage('userName'); // 移除userName缓存

      this.startUp();
      this.getCatalogList();
    },
    mounted() {
      if (getlocalStorage("userInfo")) {
        let obj = JSON.parse(getlocalStorage("userInfo"));
        if (obj.loginOrgType == '1') { // 1 采购商 2 供应商
          this.SET_IDENTITY(true);
        }
      }
    },
    watch: {
      $route(to, from) {   // 监听路由变化重新赋值
        this.setActive(to.path)
      }
    }
  }
</script>

<style>
  * {
    touch-action: auto;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif, PingFangSC-Medium, PingFang SC;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 0;
    font-size: 16px;
  }

  .Router {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    transition: all .3s ease;
    -webkit-transition: all .3s ease;
    -moz-transition: all .3s ease;
    background-color: #F5F5F5;

  }

  .slideleft-enter,
  .slideright-leave-active {
    opacity: 0;
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
  }

  .slideleft-leave-active,
  .slideright-enter {
    opacity: 0;
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100%, 0);
  }

  .switchenter,
  .switch-leave-active {
    transition: 0s;
    opacity: 0;
  }


</style>
