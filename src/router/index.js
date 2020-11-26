import Vue from 'vue'
import Router from 'vue-router'
import {Toast} from 'vant';

import signIn from '../pages/signIn'
import home from '../pages/home/home';
import moreNotice from '../pages/home/moreNotice';
import shopCart from '../pages/shopCart'
import setAddress from '../pages/home/setAddress'
import resetPassword from '../pages/resetPassword'
import receiptAddress from '../pages/receiptAddress'
import noticeDetails from '../pages/home/noticeDetails'
import noticeCategory from '../pages/home/noticeCategory'
import moreMsg from '../pages/home/moreMsg'
import sceneModel from '../pages/sceneModel/sceneModel'
import senceDetails from '../pages/sceneModel/senceDetails'
import chooseInvoice from '../pages/goodsType/chooseInvoice'
import typeDetails from '../pages/goodsType/typeDetails'
import addSettlement from '../pages/personCenter/addSettlement'
import goodsDetails from '../pages/goodsType/goodsDetails'
import goodsType from '../pages/goodsType/goodsType'
import myOrders from '../pages/personCenter/myOrders'
import sellerOrder from '../pages/personCenter/sellerOrder'
import myApproval from '../pages/personCenter/myApproval'
import taoSupplier from '../pages/personCenter/taoSupplier'
import waitInquiry from '../pages/personCenter/waitInquiry'
import deliveryNote from '../pages/personCenter/deliveryNote'
import personCenter from '../pages/personCenter/personCenter'
import myCollection from '../pages/personCenter/myCollection'
import inquiryTrack from '../pages/personCenter/inquiryTrack'
import quotedInquiry from '../pages/personCenter/quotedInquiry'
import createApproval from '../pages/personCenter/createApproval'
import createNote from '../pages/personCenter/createNote'
import orderConfirm from '../pages/goodsType/orderConfirm'
import onlineService from '../pages/personCenter/onlineService'
import noticeItem from '../pages/home/noticeItem';
import aboutMe from '../pages/personCenter/aboutMe'
import confirmReceipt from '../pages/personCenter/confirmReceipt'
import afterService from '../pages/personCenter/afterService'


import {getlocalStorage, setSessionStorage, removeSessionStorage} from "../config/Utils";


const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) { //解决连续点击同一路由控制台报错
  this.isleft = false;
  this.isright = false;
  return originalPush.call(this, location).catch(err => err)
};

// 需要左方向动画的路由用this.$router.togo('****')
Router.prototype.togo = function (path) {
  this.isleft = true;
  this.isright = false;
  this.push(path)
};

// 需要右方向动画的路由用this.$router.goRight('****')
Router.prototype.goRight = function (path) {
  this.isright = true;
  this.isleft = false;
  this.push(path)
};
// 需要返回按钮动画的路由用this.$router.goBack()，返回上一个路由
Router.prototype.goBack = function () {
  this.isright = true;
  this.isleft = false;
  this.go(-1)
};
// 点击浏览器返回按钮执行，此时不需要路由回退
Router.prototype.togoback = function () {
  this.isright = true;
  this.isleft = false
};
Vue.use(Router);

const router = new Router({
  mode: 'hash',
  routes: [
    //地址为空时跳转home页面
    {
      path: '',
      redirect: '/home',
    },
    //首页商城列表页
    {
      path: '/home', // 首页
      name: "home",
      component: home,
      meta: {
        title: '首页',
        keepAlive: true
      }
    },
    {
      path: '/moreNotice', // 更多采购公告
      name: "moreNotice",
      component: moreNotice,
      meta: {
        title: '更多采购公告'
      }
    },
    {
      path: '/sceneModel', //场景
      name: "sceneModel",
      component: sceneModel,
      meta: {
        title: '场景',
        keepAlive: true
      }
    },
    {
      path: '/moreMsg', //更多通知消息
      name: "moreMsg",
      component: moreMsg,
      meta: {
        title: '更多消息',
      }
    },


    {
      path: '/noticeCategory', //消息分类
      name: "noticeCategory",
      component: noticeCategory,
      meta: {
        title: '消息分类',
        keepAlive: true
      }
    },
    {
      path: '/goodsType', //商品分类
      name: "goodsType",
      component: goodsType,
      meta: {
        title: '商品分类'
      }
    },
    {
      path: '/shopCart',  // 购物车
      name: "shopCart",
      component: shopCart,
      meta: {
        title: '购物车',
      }
    },
    {
      path: '/personCenter', // 个人中心
      name: "personCenter",
      component: personCenter,
      meta: {
        title: '个人中心'
      }
    },
    {
      path: '/setAddress', // 定位地址
      name: "setAddress",
      component: setAddress,
      meta: {
        title: '定位地址'
      }
    },
    {
      path: '/signIn', // 登录注册
      name: "signIn",
      component: signIn,
      meta: {
        title: '登录注册'
      }
    },
    {
      path: '/resetPassword', //重置密码
      name: "resetPassword",
      component: resetPassword,
      meta: {
        title: '重置密码',
      }
    },
    {
      path: '/receiptAddress', //收货地址
      name: "receiptAddress",
      component: receiptAddress,
      meta: {
        title: '收货地址',
        requireAuth: true
      }
    },
    {
      path: '/noticeDetails', //采购公告详情
      name: "noticeDetails",
      component: noticeDetails,
      meta: {
        title: '采购公告详情'
      }
    },
    {
      path: '/senceDetails', //场景详情
      name: senceDetails,
      component: senceDetails,
      meta: {
        title: '场景详情'
      }
    },
    {
      path: '/typeDetails', //商品类别
      name: "typeDetails",
      component: typeDetails,
      meta: {
        title: '商品类别',
      }
    },
    {
      path: '/goodsDetails', //商品详情
      name: "goodsDetails",
      component: goodsDetails,
      meta: {
        title: '商品详情',
        requireAuth: true,
      }
    },
    {
      path: '/orderConfirm', //订单确认
      name: "orderConfirm",
      component: orderConfirm,
      meta: {
        title: '订单确认',
        requireAuth: true
      }
    },
    {
      path: '/taoSupplier', //淘供应商
      name: "taoSupplier",
      component: taoSupplier,
      meta: {
        title: '淘供应商',
        requireAuth: true
      }
    },
    {
      path: '/myCollection', //我的收藏
      name: "myCollection",
      component: myCollection,
      meta: {
        title: '我的收藏',
        requireAuth: true
      }
    },
    {
      path: '/myOrders', //采购商我的订单
      name: "myOrders",
      component: myOrders,
      meta: {
        title: '我的订单',
        requireAuth: true
      }
    },
    {
      path: '/sellerOrder', //供应商我的订单
      name: "sellerOrder",
      component: sellerOrder,
      meta: {
        title: '我的订单',
        requireAuth: true
      }
    },
    {
      path: '/quotedInquiry', //已报价询价单
      name: "quotedInquiry",
      component: quotedInquiry,
      meta: {
        title: '已报价询价单',
        requireAuth: true
      }
    },
    {
      path: '/waitInquiry', //待报价询价单
      name: "waitInquiry",
      component: waitInquiry,
      meta: {
        title: '待报价询价单',
        requireAuth: true
      }
    },
    {
      path: '/inquiryTrack', //询价单跟踪
      name: "inquiryTrack",
      component: inquiryTrack,
      meta: {
        title: '询价单跟踪',
        requireAuth: true
      }
    },
    {
      path: '/myApproval', //我的审批
      name: "myApproval",
      component: myApproval,
      meta: {
        title: '我的审批',
        requireAuth: true

      }
    },
    {
      path: '/createApproval', //创建审批
      name: "createApproval",
      component: createApproval,
      meta: {
        title: '创建审批',
        requireAuth: true
      }
    },
    {
      path: '/deliveryNote', //送货单查询
      name: "deliveryNote",
      component: deliveryNote,
      meta: {
        title: '送货单查询',
        requireAuth: true
      }
    },
    {
      path: '/createNote', //创建送货单
      name: "createNote",
      component: createNote,
      meta: {
        title: '创建送货单',
        requireAuth: true

      }
    },
    {
      path: '/onlineService', //在线客服
      name: "onlineService",
      component: onlineService,
      meta: {
        title: '在线客服',
        requireAuth: true
      }
    },
    {
      path: '/noticeItem', //最新公告详情
      name: "noticeItem",
      component: noticeItem,
      meta: {
        title: '最新公告详情',
      }
    },
    {
      path: '/chooseInvoice', //选择发票
      name: "chooseInvoice",
      component: chooseInvoice,
      meta: {
        title: '选择发票',
        requireAuth: true
      }
    },

    {
      path: '/confirmReceipt', //确认收货
      name: "confirmReceipt",
      component: confirmReceipt,
      meta: {
        title: '确认收货',
        requireAuth: true
      }
    },
    {
      path: '/addSettlement', //添加结算中心
      name: "addSettlement",
      component: addSettlement,
      meta: {
        title: '添加结算中心',
        requireAuth: true
      }
    },
    {
      path: '/aboutMe', //关于我们
      name: "aboutMe",
      component: aboutMe,
      meta: {
        title: '关于我们',
      }
    },
    {
      path: '/afterService', //售后中心
      name: "afterService",
      component: afterService,
      meta: {
        title: '关于我们',
      }
    },



  ],
});

router.beforeEach((to, from, next) => {

  if (from.path == '/orderConfirm') {
    if (!(to.path == '/receiptAddress' || to.path == '/chooseInvoice')) {
      removeSessionStorage('address');
      removeSessionStorage('invoice')
    }
  }
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  window.scrollTo(0, 0);
  // 判断该路由是否需要登录权限
  if (to.meta.requireAuth) {
    if (getlocalStorage("token")) {
      next();
    } else {
      Toast("请先登录");
      next({
        path: '/signIn',
      })
    }
  } else {
    next()
  }
});
export default router;


