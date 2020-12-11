<template>
  <div class="sellerOrder">
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

        <van-tab title="部分发货">
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
                <section @click="orderDatile(item,'部分发货')" class="shouhuo" v-for="(item,index) in orderList"
                         :key="index">
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

        <van-tab title="全部发货">
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
                <section @click="orderDatile(item,'全部发货')" v-for="(item,index) in orderList" :key="index">
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
  import {Tab, Tabs, Icon, List, Empty, Loading} from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';
  import headerNav from '../../components/headerNav'


  export default {
    name: "sellerOrder",
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
        this.keyWord = data;
        this.isLoding = true;
        this.page = 1;
        this.orderList = [];
        this.getOrder()

      },

      orderDatile(data, title) {
        this.$router.push({path: '/confirmReceipt', query: {id: data.orderNum, title: title}})
      },

      changeTabs() { // 切换
        this.finished = false;
        this.page = 1;
        this.isLoding = true;
        this.orderList = [];
        this.getOrder();
      },

      onLoad() { // 滚动加载
        this.page += 1;
        this.getOrder();
      },

      getOrder() {
        let nowDate = new Date().getTime();
        let params = {
          page: this.page,
          rows: 20,
          _search: false,
          nd: nowDate,
          sord: 'asc',
          title: this.keyWord
        };
        switch (this.active) {
          case 0: { //0全部
          }
            break;
          case 1: { //1待发货
            params.deliveryOrderStatus = '0'
          }
            break;
          case 2: {  //2部分发货
            params.deliveryOrderStatus = '1'
          }
            break;
          case 3: {  //3全部发货
            params.deliveryOrderStatus = '2'
          }
            break;
        }
        http.post(urls.searchOderBySupplier, params).then(res => {
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

  .sellerOrder {

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
