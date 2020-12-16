<template>
  <div class="person">
    <!--个人中心-->
    <header>
      <div>
        <template v-if="isLogin">
          <p class="left">
            <span>{{leftText}}</span>
            <span @click.stop="change"></span>
            <span class="font">{{rightText}}</span>
          </p>
          <p class="right">
            <img @click.stop="showPopup" src="../../assets/Setup.png" alt="">
          </p>
        </template>
      </div>
      <section>
        <div>
          <img src="../../assets/yonghu.png" alt="">
        </div>
        <div>

          <template v-if="isLogin">
            <p>
              <span></span>
              <span class="font">{{userName ? userName : userInfo.loginName}}</span>
            </p>
            <p>{{userInfo.companyName}}</p>
          </template>
          <template v-else>
            <p style="margin-top: 15px"><span @click="Jump('/signIn')">登录 / 注册</span></p>
          </template>
        </div>
      </section>
    </header>
    <main>
      <div>
        <section>
          <template v-if="purchaser">
            <div>
              <p style="overflow:hidden;margin: 0">
                <span class="left">我的订单</span>
                <span class="right" @click="pathJump('/myOrders',0)">
                查看全部订单
                </span>
              </p>
              <div>
                <van-grid :border="false" :column-num="5">
                  <van-grid-item v-for="(item,index) in myOrders" :key="item.name"
                                 @click="pathJump('/myOrders',index +1)">
                    <van-icon :name="item.src" :badge="item.count"/>
                    <span>{{item.name}}</span>
                  </van-grid-item>
                </van-grid>
              </div>
            </div>
            <div class="inquiry">
              <p style="overflow:hidden;margin: 0">
                <span class="left">我的询价单</span>
              </p>
              <div>
            <span>
           <van-button @click.stop="Jump('/quotedInquiry')" round color="#533BE9" icon="balance-list-o"
                       type="primary">已报价询价单</van-button>
            </span>
                <span>
           <van-button @click.stop="Jump('/waitInquiry')" round color="#F36D57" icon="todo-list-o"
                       type="primary">待报价询价单</van-button>
            </span>
              </div>
            </div>
            <div class="my-apps">
              <p style="overflow:hidden;margin: 0">
                <span class="left">我的应用</span>
              </p>
              <div>
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="item in myApps" :key="item.name" @click="Jump(item.path)">
                    <img :src="item.src" alt="">
                    <span>{{item.name}}</span>
                  </van-grid-item>
                </van-grid>
              </div>
            </div>
          </template>
          <template v-else>
            <div>
              <p style="overflow:hidden;margin: 0">
                <span class="left">我的订单</span>
                <span class="right" @click="pathJump('/sellerOrder',0)">
                查看全部订单
                </span>
              </p>
              <div>

                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(item,index) in sellerOrders" :key="item.name"
                                 @click="pathJump('/sellerOrder',index +1)">
                    <van-icon :name="item.src" :badge="item.count"/>

                    <span>{{item.name}}</span>
                  </van-grid-item>
                </van-grid>
              </div>
            </div>
            <div>
              <p style="overflow:hidden;margin: 0">
                <span class="left">我的应用</span>
              </p>
              <div>
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="item in sellerOrder" :key="item.name" :to="item.path">
                    <img :src="item.src" alt="">
                    <span>{{item.name}}</span>
                  </van-grid-item>
                </van-grid>
              </div>
            </div>


          </template>
        </section>
        <section class="services">
          <p>我的服务</p>
          <template v-for="item in services">
            <van-cell :title="item.name" is-link @click="Jump(item.path)"/>
          </template>
        </section>
      </div>
    </main>
    <foot></foot>
    <van-popup position="right" :style="{ height: '100%',width:'35%' }" v-model="show">
      <p class="signOut"><span @click="signOut">退出登录</span></p>
    </van-popup>

    <van-popup class="popup" v-model="show2">
      <p style="text-align: center;font-size: 18px">确认登出？</p>
      <van-button @click="show2 = false" type="primary">取消</van-button>
      <van-button @click="Jump('/signIn')" type="info">确认</van-button>
    </van-popup>

  </div>

</template>

<script>
  import headerNav from '../../components/headerNav'
  import foot from '../../components/foot'
  import {Grid, GridItem, Image, Button, Cell, Toast, Popup, Icon} from 'vant';
  import {mapState, mapMutations} from 'vuex'
  import {getlocalStorage} from "../../config/Utils";
  import http from '../../utils/http';
  import urls from '../../utils/urls';

  export default {
    name: "personCenter",
    components: {
      [Grid.name]: Grid,
      [GridItem.name]: GridItem,
      [Image.name]: Image,
      [Button.name]: Button,
      [Cell.name]: Cell,
      [Popup.name]: Popup,
      [Toast.name]: Toast,
      [Icon.name]: Icon,
      headerNav,
      foot
    },
    data() {
      return {
        supplierCount: {},// 采购商供应商数量
        purchaseCount: {},// 采购商供应商数量
        show: false, // 退出控制
        show2: false, // 确认退出
        active: 4,
        leftText: '', // 身份信息
        rightText: '', // 身份信息
        isLogin: false, // 判断是否登录
        userInfo: {}, // 用户信息
        changeBol: false, // 点击是否切换
        myOrders: [ // 订单分类
          {
            src: require('../../assets/daishenhe.png'),
            name: '待审核',
            path: '/',
            count: ''
          },
          {
            src: require('../../assets/daijiedan.png'),
            name: '待接单',
            path: '/',
            count: ''
          },
          {
            src: require('../../assets/daifahuo.png'),
            name: '待发货',
            path: '/',
            count: ''
          },
          {
            src: require('../../assets/daishouhuo.png'),
            name: '待收货',
            path: '/',
            count: ''
          },
          {
            src: require('../../assets/yiwnacheng.png'),
            name: '已完成',
            path: '/',
            count: ''
          }
        ],
        sellerOrders: [
          {
            src: require('../../assets/daifahuo.png'),
            name: '待发货',
            path: '/',
            count: ''
          },
          {
            src: require('../../assets/daishouhuo.png'),
            name: '部分发货',
            path: '/',
            count: ''
          },
          {
            src: require('../../assets/yiwnacheng.png'),
            name: '全部发货',
            path: '/',
            count: ''
          }
        ],
        myApps: [
          {
            src: require('../../assets/tao.png'),
            name: '淘供应商',
            path: '/taoSupplier'
          },
          {
            src: require('../../assets/shenpi.png'),
            name: '我的审批',
            path: '/myApproval'
          },
          {
            src: require('../../assets/baoming.png'),
            name: '报名审核',
            path: ''
          },
        ],
        services: [
          {
            name: '我的收藏',
            path: '/myCollection'
          },
          {
            name: '售后中心',
            path: '/afterService'
          },
          {
            name: '收货地址',
            path: '/receiptAddress'
          },
          {
            name: '密码修改',
            path: '/resetPassword'
          },
          {
            name: '发票中心',
            path: '/chooseInvoice'
          },
          {
            name: '在线客服',
            path: '/onlineService'
          },
          {
            name: '投诉建议',
            path: 'myComplaint'
          },
          {
            name: '关于我们',
            path: '/aboutMe'
          },
        ],
        sellerOrder: [
          {
            src: require('../../assets/chaxundingdan.png'),
            name: '发货单查询',
            path: '/deliveryNote'
          },
          {
            src: require('../../assets/wenjian.png'),
            name: '创建发货单',
            path: '/createNote'
          },
          {
            src: require('../../assets/jine.png'),
            name: '我的报价',
            path: ''
          },
        ]
      }
    },
    computed: {
      ...mapState(['purchaser', 'userName', 'loginType'])
    },
    methods: {
      ...mapMutations([
        'SET_IDENTITY',
      ]),
      //
      showPopup() { // 点击设置按钮
        this.show = true;
      },
      signOut() {
        this.show2 = true;
      },
      change() {
        if (this.loginType == 'dandian') {
          Toast('暂未开通供应商权限!');
          return
        }
        this.changeBol = true;
        let loginOrgType = JSON.parse(getlocalStorage("userInfo")).loginOrgType;
        if (loginOrgType != '1') {
          Toast('暂未开通采购商权限!');
          return
        }
        this.SET_IDENTITY(!this.purchaser);
        let leftText = this.leftText;
        let rightText = this.rightText;
        this.leftText = rightText;
        this.rightText = leftText
      },
      pathJump(path, index) { // 订单跳转
        this.$router.push({path: path, query: {index: index}});
      },

      Jump(url) { // 我的应用跳转
        this.$router.push(url);
      },
      getCountByPurchase() {  //获取采购商各状态订单数接口
        http.post(urls.searchOderCountByPurchase, {}).then(res => {
          if (res.success) {
            this.purchaseCount = res.obj || {};
            this.myOrders[0].count = this.purchaseCount.orderStatus && this.purchaseCount.orderStatus['09'] || ""; //1待审核
            this.myOrders[1].count = this.purchaseCount.orderStatus && this.purchaseCount.orderStatus['04'] || "";  //2待接单
            this.myOrders[2].count = this.purchaseCount.deliveryOrderStatus && this.purchaseCount.deliveryOrderStatus['0'] || "";//3待发货
            this.myOrders[3].count = this.purchaseCount.receiptOrderStatus && this.purchaseCount.receiptOrderStatus['0'] || ""; //4待收货

          }
        }).catch(err => {


        })
      },

      getCountBySupplier() {//获取供应商商各状态订单数接口
        http.post(urls.searchOderCountBySupplier, {}).then(res => {
          if (res.success) {
            this.supplierCount = res.obj || {};
            this.sellerOrders[0].count = this.supplierCount && this.supplierCount['0'] || ""; //1待发货
            this.sellerOrders[1].count = this.supplierCount && this.supplierCount['1'] || "";  //2部分发货
            // this.sellerOrders[2].count = this.supplierCount && this.supplierCount['2'] || "";//3全部发货
          }
        }).catch(err => {

        })
      }
    },
    created() {
      this.getCountBySupplier();
      this.getCountByPurchase();
    },
    mounted() {
      // if (this.loginType == 'dandian') {
      //   this.SET_IDENTITY(true);
      // }
      getlocalStorage("token") && (this.isLogin = true);
      this.userInfo = JSON.parse(getlocalStorage('userInfo'));
      this.leftText = this.purchaser ? '我是采购商' : '我是供应商';
      this.rightText = this.purchaser ? '我是供应商' : '我是采购商';
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .person {
    header {
      color: white;
      @include wh(100%, 173px);
      background: url(../../assets/personBg.png) no-repeat;
      background-size: 100% 100%;
      > div {
        overflow: hidden;
        padding: 25px 20px 0;
        p {
          margin: 0;
          span {
            display: inline-block;
            &:nth-child(2) {
              @include wh(14px, 14px);
              background: url(../../assets/Swap.png) no-repeat;
              background-size: 100% 100%;
              margin: 0 5px;
            }
          }
          img {
            @include wh(15px, 15px)
          }
        }
      }
      section {
        padding: 0 20px;
        margin-top: 15px;
        display: flex;
        text-align: left;
        p {
          margin: 4px 2px 0
        }
        div {
          &:first-child {
            flex: 1;
            img {
              @include wh(55px, 55px)
            }
          }
          &:last-child {
            flex: 4;
          }
        }
      }
    }
    main {
      background-color: #F5F5F5;
      padding-bottom: 20px;
      > div {
        padding: 0 20px;
        position: relative;
        top: -35px;
        section {
          background-color: #ffffff;
          border-radius: 5px;
          padding: 8px 20px;
          margin-bottom: 15px;
          > div {
            padding: 5px 0;
          }
          .left {
            @include sc(15px, #5A5A5A);
            font-weight: 500;
          }
          .right {
            @include sc(12px, #8D8D8D)
          }
          .van-grid {
            img {
              @include wh(33px, 30px)
            }
            span {
              margin-top: 10px;
              @include sc(12px, #8D8D8D)
            }
            /deep/ .van-grid-item__content {
              padding: 11px 0;
            }
          }
        }
      }
      .van-button {
        height: 38px;
      }

    }
    .services {
      text-align: left;
      p {
        @include sc(15px, #5A5A5A);
        font-weight: 500;
        margin: 0;
      }
      .van-cell {
        padding: 10px;
        color: #8D8D8D;
      }
    }
    .inquiry {
      > div {
        display: flex;
        margin: 12px 0;
        span {
          flex: 1;
          img {
            @include wh(14px, 15px)
          }
        }
      }
    }
    .signOut {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .popup {
      width: 60%;
      padding: 10px;
      border-radius: 5px;
      p {
        text-align: left;
        padding: 0 5px;
        margin: 8px 0;
        @include sc(13px, #323233)
      }
      .van-button {
        margin-top: 10px;
        padding: 0 8px;
        @include wh(100px, 30px);
      }
    }
    .font{
      font-size: 12px!important;
    }
  }

</style>
