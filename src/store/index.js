import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutation'
import actions from './action'
import getters from './getters'
import cookie from "vue-cookies"

Vue.use(Vuex);

const state = {
  purchaser: false,//登陆身份采购商 false 供应商  true 采购商
  catalog: {},//商品分类列表
  isLogin: false, // 是否登录
  loginForm: {},// 登录信息
  address: '',// 登录信息
  active: 0, // 导航栏标记
  userName: '', // 导航栏标记
  loginType: '',  // 登录方式
  hotImgs: [], // 热门品牌
  selImgs: [], // 行业精选
  homeSwipe: [], // 首页轮播
  sceneSwipe: [], // 场景轮播
};
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
})
