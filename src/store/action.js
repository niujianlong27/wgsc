import {getCatalog, getUserinfo, getImgs, getAddressInfo} from '../utils/service';
import {
  Set_Catalog,
  Is_Login,
  Set_ADDRESS,
  Set_homeSwipe,
  Set_selImgs,
  Set_hotImgs,
  SET_IDENTITY,
  Set_sceneSwipe
} from './mutation-type.js'
import cookie from "vue-cookies"
import {Toast} from 'vant';
import {setlocalStorage, removelocalStorage} from "../config/Utils";
import router from '../router';

export default {
  async getCatalogList({commit, state}) { // 设置菜单分类
    let data = await  getCatalog();
    commit(Set_Catalog, JSON.parse(JSON.stringify(data)))
  },

  async setImgs({commit, state}, name) { // 设置菜单分类
    let params = {
      pagename: 'app',
      pagelocal: name
    };
    let data = await getImgs(params);


    if (name == '首页轮播图') {
      commit(Set_homeSwipe, data)
    } else if (name == '热门品牌') {
      commit(Set_hotImgs, data)
    } else if (name == '行家精选') {
      commit(Set_selImgs, data)
    }else{
      commit(Set_sceneSwipe, data)
    }
  },


  async getAddress({commit, state}) { // 获取地址
    let Ip = returnCitySN['cip'];
    localStorage.setItem('Ip', Ip);
    let data = await getAddressInfo(Ip);
    commit(Set_ADDRESS, data)
  },

  async getUserInfo({commit, state}) {
    const toast = Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: '正在登录',
    });
    let res = await getUserinfo(state.loginForm);
    if (res.success) {
      toast.clear();
      Toast.success("登录成功");
      commit(Is_Login, true);
      setlocalStorage("token", res.obj.successResult.token); // token
      setlocalStorage("userInfo", res.obj.uupUserSummary); // 用户信息
      if (res.obj.uupUserSummary.loginOrgType == '1') { // 1 采购商 2 供应商
        commit(SET_IDENTITY, true);
      }
      router.push({path: "/home"});
    } else {
      Toast.fail(res.msg);
    }
  }
}
