<template>
  <div class="my-orders">
    <header-nav @getSearch="getSearch" :placeholder="placeholderText" :jump="false" :licon="'arrow-left'"
                :riconShow="false"></header-nav>
    <main>
      <van-tabs @change="changeTabs()" sticky title-active-color="#1A1E75" color="#1A1E75" background="#F5F5F5"
                v-model="active">

        <van-tab title="全部">
          <template v-if="isLoding">
            <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
          </template>
          <template v-else>
            <template v-if="orderList.length > 0">
              <van-list
                offset="100"
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
              >
                <section @click="orderDatile(item)" v-for="(item,index) in orderList" :key="index">
                  <p>
                    <span class="left">{{item.supplierName}} <van-icon name="arrow"/></span>
                    <span v-if="item.orderStatus == '02'" class="right">待付款</span>
                    <span v-else-if="item.orderStatus == '03'" class="right">待收款</span>
                    <span v-else-if="item.orderStatus == '04'" class="right">待接单</span>
                    <span v-else-if="item.orderStatus == '06'" class="right">已拒单</span>
                    <span v-else-if="item.orderStatus == '07'" class="right">已接单</span>
                    <span v-else-if="item.orderStatus == '08'" class="right">审批驳回</span>
                    <span v-else-if="item.orderStatus == '09'" class="right">待审批</span>
                    <span v-else-if="item.orderStatus == '11'" class="right">已付款待确认</span>
                    <span v-else class="right"></span>
                  </p>
                  <div>
                    <span>
                          <p>订单标题 : <span class="title">{{item.orderType }}</span></p>
             <p>订单编号 : {{item.orderNum}}</p>
             <p>订单金额 : <span>¥{{item.orderPrice}} </span></p>

         </span>
                  </div>
                </section>
              </van-list>
            </template>
            <template v-else>
              <van-empty description="暂无数据"/>
            </template>
          </template>
        </van-tab>

        <van-tab title="待审核">
          <template v-if="isLoding">
            <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
          </template>
          <template v-else>
            <template v-if="orderList.length > 0">
              <van-list
                offset="100"
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
              >
                <section @click="orderDatile(item,'待审核')" v-for="(item,index) in orderList" :key="index">
                  <p>
                    <span class="left">{{item.supplierName}} <van-icon name="arrow"/></span>
                    <span class="right"></span>
                  </p>
                  <div>
                    <span>
             <p>订单标题 : <span class="title">{{item.orderType }}</span></p>
             <p>订单编号 : {{item.orderNum}}</p>
             <p>订单金额 : <span>¥{{item.orderPrice}} </span></p>
                      <!--<p>订单状态 : <span>¥{{item.orderPrice}} </span> 收货状态 : <span>¥{{item.orderPrice}} </span></p>-->

         </span>
                  </div>
                </section>
              </van-list>
            </template>
            <template v-else>
              <van-empty description="暂无数据"/>
            </template>
          </template>
        </van-tab>

        <van-tab title="待接单">
          <template v-if="isLoding">
            <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
          </template>
          <template v-else>
            <template v-if="orderList.length > 0">
              <van-list
                offset="100"
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
              >
                <section @click="orderDatile(item,'待接单')" v-for="(item,index) in orderList" :key="index">
                  <p>
                    <span class="left">{{item.supplierName}} <van-icon name="arrow"/></span>
                    <span class="right"></span>
                  </p>
                  <div>
                    <span>
             <p>订单标题 : <span class="title">{{item.orderType }}</span></p>
             <p>订单编号 : {{item.orderNum}}</p>
             <p>订单金额 : <span>¥{{item.orderPrice}} </span></p>
         </span>
                  </div>
                </section>

              </van-list>
            </template>
            <template v-else>
              <van-empty description="暂无数据"/>
            </template>
          </template>

        </van-tab>

        <van-tab title="待发货">
          <template v-if="isLoding">
            <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
          </template>
          <template v-else>
            <template v-if="orderList.length > 0">
              <van-list
                offset="100"
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
              >
                <section @click="orderDatile(item,'待发货')" v-for="(item,index) in orderList" :key="index">
                  <p>
                    <span class="left">{{item.supplierName}} <van-icon name="arrow"/></span>
                    <span class="right"></span>
                  </p>
                  <div>
                    <span>
             <p>订单标题 : <span class="title">{{item.orderType }}</span></p>
             <p>订单编号 : {{item.orderNum}}</p>
             <p>订单金额 : <span>¥{{item.orderPrice}} </span></p>
         </span>
                  </div>
                </section>
              </van-list>
            </template>
            <template v-else>
              <van-empty description="暂无数据"/>
            </template>
          </template>
        </van-tab>

        <van-tab title="待收货">
          <template v-if="isLoding">
            <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
          </template>
          <template v-else>
            <template v-if="orderList.length > 0">
              <van-list
                offset="100"
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
              >

                <section @click="orderDatile(item,'待收货')" class="shouhuo" v-for="(item,index) in orderList"
                         :key="index">
                  <p>
                    <span class="left">{{item.supplierName}} <van-icon name="arrow"/></span>
                    <span class="right"></span>
                  </p>
                  <div>
                    <span>
             <p>订单标题 : <span class="title">{{item.orderType }}</span></p>
             <p>订单编号 : {{item.orderNum}}</p>
             <p>订单金额 : <span>¥{{item.orderPrice}} </span> <span @click="confirmReceipt(item)"
                                                                class="takeOver">确认收货</span></p>

         </span>
                  </div>
                </section>
                <!--<section class="shouhuo">-->
                <!--<p>-->
                <!--<span class="left">威海威高进出口有限公司 <van-icon name="arrow"/></span>-->
                <!--<span class="right">待收货</span>-->
                <!--</p>-->
                <!--<div>-->
                <!--<span>-->
                <!--<img width="90px" height="92px" src="../../assets/cj.png" alt="">-->
                <!--</span>-->
                <!--<span>-->
                <!--<p>威高定制无线充电记事本（灰）</p>-->
                <!--<p>产品编号 00000123</p>-->
                <!--<p class="shouhuo"><span>¥129.00 </span> <span>x 6</span> <span @click="confirmReceipt" class="takeOver">确认收货</span></p>-->
                <!--</span>-->
                <!--</div>-->
                <!--</section>-->
              </van-list>
            </template>
            <template v-else>
              <van-empty description="暂无数据"/>
            </template>
          </template>

        </van-tab>

        <van-tab title="已完成">
          <template v-if="isLoding">
            <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
          </template>
          <template v-else>
            <template v-if="orderList.length > 0">
              <van-list
                offset="100"
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
              >
                <section @click="orderDatile(item,'已完成')" v-for="(item,index) in orderList" :key="index">
                  <p>
                    <span class="left">{{item.supplierName}} <van-icon name="arrow"/></span>
                    <span class="right"></span>
                  </p>
                  <div>
                    <span>
             <p>订单标题 : <span class="title">{{item.orderType }}</span></p>
             <p>订单编号 : {{item.orderNum}}</p>
             <p>订单金额 : <span>¥{{item.orderPrice}} </span></p>
         </span>
                  </div>
                </section>
              </van-list>
            </template>
            <template v-else>
              <van-empty description="暂无数据"/>
            </template>
          </template>
        </van-tab>
      </van-tabs>

    </main>
  </div>

</template>

<script>
  import pageNav from '../../components/pageNav'
  import headerNav from '../../components/headerNav'
  import {Tab, Tabs, Icon, List, Empty, Loading} from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';

  export default {
    name: "myOrders",
    components: {
      pageNav,
      headerNav,
      [Empty.name]: Empty,
      [Loading.name]: Loading,
      [Tab.name]: Tab,
      [List.name]: List,
      [Tabs.name]: Tabs,
      [Icon.name]: Icon,
    },
    data() {
      return {
        placeholderText: '搜索订单标题',

        isLoding: false,//整个页面加载
        loading: false,//数据滚动加载
        finished: false,//全部加载完成
        active: 0, // tab标记
        page: 1, // 页码
        orderList: [], // 订单集合
        keyWord: '', // 搜索内容
      }
    },
    methods: {
      getSearch(data) { // 获取搜索值
        this.active = 0;
        this.isLoding = true;
        this.orderList = [];
        this.keyWord = data;
        this.getOrder()


      },
      confirmReceipt(data, title) {
        this.$router.push({path: '/confirmReceipt', query: {deliveryId: data.deliveryId, title: title}})
      },

      orderDatile(data, title) {
        this.$router.push({path: '/confirmReceipt', query: {id: data.orderNum, title: title}})
      },

      changeTabs() { // 切换
        this.page = 1;
        this.finished = false;
        this.isLoding = true;
        this.orderList = [];
        this.getOrder();
      },

      onLoad() { // 滚动加载
        this.page += 1;
        this.getOrder();
      },

      getOrder() {
        let params = {
          page: this.page,
          rows: 20,
          title: this.keyWord,
        };
        switch (this.active) {
          case 0: { //0全部
          }
            break;
          case 1: { //1待审核
            params.orderStatus = '09'
          }
            break;
          case 2: {  //2待接单
            params.orderStatus = '04'
          }
            break;
          case 3: {  //3待发货
            params.deliveryOrderStatus = '0'
          }
            break;
          case 4: {  //4待收货
            params.receiptOrderStatus = '0'
          }
            break;
          case 5: { //5 已完成
            params.receiptOrderStatus = '2'
          }
            break;
        }
        // this.finished = false;
        http.post(urls.searchOderByPurchase, params).then(res => {
          this.isLoding = false;
          if (res.success) {
            this.loading = false;
            let list = res.obj && res.obj.rows || [];
            this.orderList = this.orderList.concat(list);
            if (this.orderList.length == res.obj.records) {
              this.finished = true;
            }
          }
        }).catch(err => {

        })

      }
    }
    ,
    mounted() {
      this.isLoding = true;
      this.active = Number(this.$route.query.index);
      this.getOrder();
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .my-orders {
    /deep/ .van-search, nav {
      background: #F5F5F5;
    }
  }

  main {

    padding: 0 20px 30px;
    background-color: #F5F5F5;
    section {
      background-color: #ffffff;
      border-radius: 5px;
      padding: 10px;
      margin-top: 15px;
      > p {
        overflow: hidden;
        margin: 0 0 10px;
      }
      .left {
        @include sc(12px, #535353);
        font-weight: 600;
      }
      .right {
        @include sc(12px, #FF6464)
      }
      .van-icon {
        position: relative;
        top: 2px;
      }
      > div {
        display: flex;
        > span {
          flex: 1;
          flex-shrink: 0;
          &:first-child {
            flex: 1;
          }
          &:last-child {
            flex: 2;
            padding-left: 5px;
            text-align: left;
            box-sizing: border-box;
            p {
              margin: 10px 0;
              @include sc(12px, #5F5F5F);
              .title {
                font-weight: 600;
                @include sc(14px, #515151)
              }
              &:nth-child(2) {
                @include sc(12px, #5F5F5F)
              }
              &:nth-child(3) {
                overflow: hidden;
                span {
                  &:first-child {
                    @include sc(15px, #FF6464)
                  }
                  &:nth-child(2) {
                    @include sc(13px, #D7D7D7);
                    margin-left: 5px;
                  }
                }
              }
            }
            .takeOver {
              @include sc(12px, white);
              background-color: #2c3993;
              float: right;
              padding: 4px 8px;
              border-radius: 5px;
            }
          }
        }
      }
    }
    /deep/ .van-sticky--fixed {
      padding: 0 20px !important;
    }

  }

</style>
