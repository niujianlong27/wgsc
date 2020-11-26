import {
  SET_IDENTITY, Set_Catalog, Is_Login, Set_LoginForm, Set_ADDRESS,Set_ACTIVE,Set_USERNAME,Set_loginType,Set_homeSwipe,Set_selImgs,Set_hotImgs,Set_sceneSwipe
} from './mutation-type'

export default {
  [SET_IDENTITY](state, active) {
    state.purchaser = active;
  },
  [Set_Catalog](state, active) {
    state.catalog = active;
  },
  [Is_Login](state, active) {
    state.isLogin = active;
  },
  [Set_LoginForm](state, active) {
    state.loginForm = active;
  },
  [Set_ADDRESS](state, active) {
    state.address = active;
  },
  [Set_ACTIVE](state, active) {
    state.active = active;
  },
  [Set_USERNAME](state, active) { //
    state.userName = active;
  },
  [Set_loginType](state, active) { // 登录类型
    state.loginType = active;
  },
  [Set_homeSwipe](state, active) { // 首页轮播
    state.homeSwipe = active;
  },
  [Set_selImgs](state, active) { // 行业精选
    state.selImgs = active;
  },
  [Set_hotImgs](state, active) { // 热门品牌
    state.hotImgs = active;
  },
 [Set_sceneSwipe](state, active) { // 热门品牌
  state.sceneSwipe = active;
}


}
