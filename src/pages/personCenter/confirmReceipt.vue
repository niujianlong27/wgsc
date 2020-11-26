<template>
  <div class="confirmReceipt">
    <page-nav :title="title"></page-nav>
    <main>

      <section>
        <p>订单编号 ：{{this.$route.query.id}}</p>
      </section>

      <section>
        <p>收货地址 ：{{defaultConsignee.consignee}} {{defaultConsignee.mobile}}</p>
        <p>
          {{defaultConsignee.province}} {{defaultConsignee.city}} {{defaultConsignee.area}} {{defaultConsignee.street}}
          {{defaultConsignee.detailAddress}}
        </p>

      </section>

      <section>
        <p>
          收货规则 ：
          <template v-if="orderVo.onlineReceiptRules == '01'">
            创建人账号在线收货确认
          </template>
          <template v-else-if="orderVo.onlineReceiptRules == '02'">
            仓库管理员在线收货确认
          </template>
        </p>
        <p>
          结算中心 ：{{orderVo.statementName}}
        </p>
      </section>

      <section>
        <p>订单标题 ：{{orderVo.title}}</p>
        <p>部门名称 ：{{orderVo.departmentName}}</p>
        <p>要求交货期 ：{{orderVo.deliveryDate | setDate}}</p>
      </section>

      <section class="orderItem">
        <div>
          <p>{{orderVo.supplierName}}
            <van-icon name="arrow"/>
          </p>
          <div class="card" v-for="item in orderItemList" :key="item.goodsNo">
            <div>
              <div>
                <img :src="imgs[item.materialNo] | setImg" alt="">
              </div>
              <div>
                <p>品牌：{{item.producer}}</p>
                <div class="textColor">
                  <!--<span>颜色：灰色    重量：100g</span>-->
                  <!--<span>本子尺寸：142*210mm A5</span>-->
                  型规:{{item.specification}}
                </div>
                <p style="position: relative">
                  <span>¥{{item.unitPriceTaxed | fixNum}}</span>
                  <span style="position: absolute;right: 0;top: -2px;">
               <van-stepper button-size="24" disabled v-model="item.requestAmount"/>
              </span>
                </p>
              </div>
            </div>
            <p>
              <span>货号： {{item.goodsNo}}</span>
            </p>
          </div>
        </div>
      </section>
    </main>
    <footer v-if="showFooter">
      <van-submit-bar button-text="确认收货" @submit="onSubmit">
      </van-submit-bar>
    </footer>
  </div>
</template>

<script>
  import pageNav from '../../components/pageNav'
  import {Icon, Cell, Stepper, SubmitBar} from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';

  export default {
    name: "confirmReceipt",
    components: {
      pageNav,
      [Icon.name]: Icon,
      [Cell.name]: Cell,
      [Stepper.name]: Stepper,
      [SubmitBar.name]: SubmitBar,

    },
    data() {
      return {
        defaultConsignee: {}, // 收货地址信息
        orderVo: {},// 订单信息
        value: 1,
        title: this.$route.query.title, // 标题title
        showFooter: true,// 底部显示控制
        orderItemList: [],//商品信息
        imgs: {},// 图片存储
      }
    },
    methods: {
      onSubmit() {// 确认收货
      },
      getDetail() {
        let params = {
          flag: 'purOrder',
          id: this.$route.query.id,
          operationType: 'XJ'
        };
        http.get(urls.toOrderDetailView, params).then(res => {
          if (res.success) {
            this.defaultConsignee = res.obj.model.consignee;
            this.orderVo = res.obj.model.orderVo;
            this.orderItemList = res.obj.model.orderItemList || [];
            this.imgs = res.obj.model.imgUrlMap;
          }
        }).catch(err => {

        })
      }
    },
    created() {
      if (this.$route.query.title != '待收货') {
        this.showFooter = false
      }
    },
    mounted() {
      this.getDetail();
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  main {
    padding: 10px 20px 50px;
    background-color: #F5F5F5;
    section {
      border-radius: 5px;
      padding: 1px 12px;
      margin-bottom: 15px;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 1);
      font-weight: 500;
      @include sc(14px, rgba(83, 83, 83, 1));
      text-align: left;
      &:nth-child(1) {
        .van-cell {
          padding: 0;
        }
        p {
          margin: 12px 0 !important;
        }
      }
      &:nth-child(2) {
        p {
          margin: 12px 0 !important;
          span {
            &:first-child {
              width: 20px;
            }
            height: 100%;
            display: inline-block;
          }
        }
      }
      .van-icon {
        top: 2px;
      }
      .van-cell {
        background: rgba(255, 255, 255, 1);
      }
    }
    .orderItem {
      > div {
        padding: 5px 0;
        border-bottom: 1px solid #e8e8e8;
        &:last-child {
          border-bottom: none;
        }
        img {
          @include wh(90px, 90px)
        }
        > p {
          &:first-of-type {
            color: #535353;
            font-weight: 600;
            margin: 12px 0;
          }
          &:nth-of-type(2) {
            overflow: hidden;
          }
        }
        .romove {
          color: red;
          float: right;
        }
        .card > div {
          display: flex;
          margin-bottom: 10px;
          > div {
            flex-shrink: 0;
            &:first-child {
              width: 30%;
            }
            &:last-child {
              width: 69%;
              p {
                margin: 0 0 10px 5px;
                &:nth-of-type(2) {
                  margin-top: 10px;
                  span {
                    &:first-child {
                      @include sc(15px, #FF6464)
                    }

                  }
                }
              }
              .textColor {
                background-color: #FBFBFB;
                padding-left: 5px;
                box-sizing: border-box;
                margin-bottom: 7px;
                span {
                  display: block;
                  @include sc(12px, #8B8B8B)
                }
              }
            }
          }
        }
      }
    }
  }

  .color {
    color: #9D9D9D
  }
</style>
