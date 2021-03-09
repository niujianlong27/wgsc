<template>
  <div class="goodsCart">
    <template v-if="goodsData.length > 0">
      <div class="Goods">
        <div>
          <p>
            <span class="left">购物车</span>
            <span @click="manage = !manage" class="right">{{manage ? "完成": "管理"}}</span>
          </p>
        </div>
        <section>
          <section class="checkBox" v-for="(data,value) in goodsData" :key="data.id">
            <van-checkbox class="checkDiv" @click="checkBox(`checkboxGroup${value}`,data)" v-model="data.check">
              <span> {{data.supplierName}} </span> <span class="red"> 最小起订金额:{{data.currency}} {{data.minBuyPric}} / 单</span>

            </van-checkbox>

            <van-checkbox-group class="rudio" :ref="'checkboxGroup' + value" v-model="data.result"
                                @change="checked(data)">
              <van-cell-group :border="false" v-for="(item, index) in data.cartItemList" :key="item.shoppId">
                <div class="cardBox">
                  <div>
                    <van-cell class="cardCheck" :border="false"
                              @click="toggle(data.supplierId,item,`checkboxes${value}`,index)">
                      <template #title>
                        <van-checkbox :name="item" :ref="'checkboxes' + value"/>
                      </template>
                    </van-cell>
                  </div>
                  <div class="card">

                    <p @click.stop="clickSim(item.commodityNo)"><img :src="item.imgUrl[0] | setImg" alt=""></p>
                    <p @click.stop="clickSim(item.commodityNo)">
                      <span>{{item.lcMaterialName}} </span>
                      <span>货号：{{item.goodsNo}}</span>
                      <span>¥{{item.unitPriceTaxed | fixNum}}</span>
                    </p>
                    <p>
                      <van-stepper @change="stpChange(data,item)" v-model="item.requestAmount" theme="round"
                                   button-size="22"
                                   integer/>
                    </p>
                  </div>
                </div>

              </van-cell-group>
            </van-checkbox-group>
          </section>
        </section>
      </div>
    </template>
    <template v-else>
      <div class="noGoods">
        <div>
          <img style="width: 100%" src="../assets/cart.png" alt="">
          <p>你的购物车是空的</p>
        </div>
        <button @click="toPath('/home')">去逛逛</button>
      </div>
    </template>
    <main v-if="recomGoods.length > 0" :class="{move:goodsData.length > 0}">
      <p>推荐产品</p>
      <section>

        <van-grid class="grid" :border="false" :gutter="15" :column-num="2">
          <van-grid-item @click="clickSim(item.commodityNo)" v-for="item in recomGoods" :key="item.id">
            <img :src="item.attachFile | setImg" alt="">
            <div class="text">
              <span>{{item.commodityName}}</span>
              <span>货号：{{item.commodityArticleNo}}</span>
              <span>¥{{item.price | fixNum}}</span>
            </div>
          </van-grid-item>
        </van-grid>
      </section>

    </main>
    <!--购物车-->
    <template v-if="manage">
      <van-submit-bar class="manage" button-text="删除" @submit="Delete">
        <template #default>
          <van-checkbox @click="allChecked" v-model="isChecked">全选</van-checkbox>
          <template>
            <van-button @click="addFavorite()" class="firstButton" plain round type="info">移入收藏</van-button>
          </template>
        </template>
      </van-submit-bar>
    </template>
    <template v-else>
      <van-submit-bar :label="label" :decimal-length="3" :price="totalPrice" button-text="提交订单" @submit="settlement">
        <van-checkbox @click="allChecked" v-model="isChecked">全选</van-checkbox>
      </van-submit-bar>
    </template>

    <foot></foot>
  </div>
</template>

<script>
  import foot from '../components/foot'
  import {Checkbox, Cell, Stepper, Toast, CellGroup, CheckboxGroup, SubmitBar, Button, GridItem, Grid} from 'vant';
  import http from '../utils/http';
  import urls from '../utils/urls';
  import {getlocalStorage, mul, add} from "../config/Utils";

  export default {
    name: "ShopCart",
    components: {
      [Checkbox.name]: Checkbox,
      [CheckboxGroup.name]: CheckboxGroup,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Stepper.name]: Stepper,
      [Button.name]: Button,
      [Toast.name]: Toast,
      [SubmitBar.name]: SubmitBar,
      [GridItem.name]: GridItem,
      [Grid.name]: Grid,
      foot
    },
    data() {
      return {
        toast:null,
        active: 3, // 导航栏状态设置
        goodsData: [], //列表数据
        chooseGoods: [], // 选中商品数据
        groupChecked: false,//每组供应商之间的全选
        isChecked: false, // 底部结算导航设置全选
        manage: false, //  判断结算 和管理 底部栏显示
        totalPrice: 0, // 总金额
        label: '合计', //底部导航栏左侧提示信息设置
        code: '',
        recomGoods: [], // 推荐商品

      }
    },
    methods: {
      getGoodsList() {  // 查询购物车
        let token = getlocalStorage("token");
        this.toast = Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: false,
          message: '数据加载中',
        });
        http.get(urls.queryShoppingList, {
          flag: "wg",
          appCode: "WG",
          access_token: token,
          headType: 1
        }).then(res => {
          if (res.success) {
            this.goodsData = [];
            this.toast.clear();
            this.code = res.obj.model.code;
            res.obj.model.supplierCartVos.forEach(item => {
              item.status === "check" && this.updateRedisStatus(item.supplierId, false);
              item.result = [];
              item.check = false;
            });
            this.goodsData = res.obj.model.supplierCartVos || [];
            res.obj.model.supplierCartVos[0] && this.gethotData(res.obj.model.supplierCartVos[0].cartItemList[0].commodityNo);
          } else {
            Toast.fail(res.msg)
          }
        }).catch(err => {

        })
      },
      gethotData(id) { // 查询推荐商品
        http.get(urls.querySimilarCommodity, {commodityId: id}).then(res => {
          if (res.success) {
            this.recomGoods = res.obj;
          }
        }).catch(err => {

        })
      },

      toggle(id, item, ref, index) { // 单个商品选中触发
        this.$refs[ref][index].toggle();
        let bol = !this.$refs[ref][index].checked;
        this.updateRedisStatus(id, bol, item.lcMaterialNo)
      },

      checkBox(ref, data) { // 供应商全选
        this.$refs[ref][0].toggleAll(data.check);
      },

      checked: function (data) { //每组供应商之间商品改变选中触发
        if (data.result.length === data.cartItemList.length) { //
          data.check = true;
          this.updateRedisStatus(data.supplierId, true)
        } else {
          data.check = false;
          if (data.result.length === 0) {
            this.updateRedisStatus(data.supplierId, false)
          }
        }
        this.getTotalPrice()
      },

      updateRedisStatus(supplierId, status, lcMaterialNo) {
        http.post(urls.updateRedisStatus, {
          supplierId: supplierId || '',
          status: status || '',
          lcMaterialNo: lcMaterialNo || '',
        }).then(res => {

        }).catch(err => {

        })
      },

      getTotalPrice() { // 价格、商品数量汇总
        let totalPrice = 0; // 总价格
        let total = 0;// 总条数
        let num = 0; // 用做计数
        this.chooseGoods = []; //
        this.goodsData.forEach((item) => {
          item.check && num++; // 当前供应商选中，计数加一
          item.result.forEach(resultItem => { // 循环选中的数据 获取总条数、总价格
            this.chooseGoods = this.chooseGoods.concat(resultItem);// 获取选中的数据
            total += resultItem.requestAmount; // 总数量
            totalPrice += Number(resultItem.requestAmount) * Number(resultItem.unitPriceTaxed) //总价格
          })
        });
        if (num === this.goodsData.length) { // 判断全选是否选中
          this.isChecked = true
        } else {
          this.isChecked = false
        }
        this.totalPrice = totalPrice * 100; // 展示到分
        this.label = `共 ${total} 件 合计 : `
      },

      allChecked() { // 底部导航栏 全选功能
        this.goodsData.forEach((item, index) => {
          this.$refs[`checkboxGroup${index}`][0].toggleAll(this.isChecked);
        });
      },

      stpChange(data, item) { //步进器改变
        let params = {
          supplierId: data.supplierId,
          lcMaterialNo: item.lcMaterialNo,
          num: item.requestAmount
        };
        http.post(urls.updateRedisNum, params).then(res => {
          if (res.success) {
            this.getTotalPrice()
          } else {
            Toast.fail(res.msg)
          }
        }).catch(err => {

        });
      },

      settlement() { // 提交订单
        let isJD = false; // 判断是否有京东商品
        let arr = [];
        let jdAdd = 0;

        this.chooseGoods.forEach(item => {
          arr.push(item.commodityNo);
          if (item.showPos === '0520') { // 判断为京东商品
            isJD = true;
            jdAdd = add(jdAdd, mul(item.unitPriceTaxed, item.requestAmount)); // 计算京东商品总价
          }
        });
        if (isJD && jdAdd < 99) { // 京东商品总价格需不小于99
          Toast.fail('结算金额不得小于最小起订金额');
          return
        }

        if (this.chooseGoods.length > 0) {
          this.$router.push({path: "/orderConfirm", query: {code: this.code, commodStr: arr.join()}});
        } else {
          Toast.fail("请先选择商品");
        }
      },

      addFavorite() { // 添加收藏
        let num = 0;
        let arr = this.chooseGoods.forEach(item => {
          http.get(urls.addFavorite, {commodityNo: item.commodityNo}).then(res => {
            if (res.success) {
              num++;
              if (num === this.chooseGoods.length) {
                Toast.success(res.obj.info)
              }
            } else {
              Toast.success('添加收藏失败，请重试')
            }
          }).catch(err => {

          })
        });
      },

      Delete() { //删除
        let num = 0;
        this.goodsData.forEach(item => {
          item.result.forEach(resultItem => { // 循环选中的数据 获取总条数、总价格
            let params = {supplierId: item.supplierId, lcMaterialNo: resultItem.lcMaterialNo};
            // setTimeout(function () {
            http.post(urls.deleteCommodityFromShopCar, params).then(res => {
              if (res.success) {
                num += 1;
                if (num === this.chooseGoods.length) {
                  this.getGoodsList()
                }
              } else {
                Toast.fail(res.msg)
              }
            }).catch(err => {

            })
            // })
          })
        });
      },

      clickSim(data) { // 推荐商品退转商品详情
        this.$router.push({path: '/goodsDetails', query: {id: data}})
      },

      toPath(url) { // 路由跳转
        this.$router.push(url)
      }
    },
    mounted() {
    },
    destroyed() {
      this.toast.clear();
      // this.goodsData.forEach(item => {
      //   this.updateRedisStatus(item.supplierId, false)
      // })
    },
    created() {
      let token = getlocalStorage("token");
      token && this.getGoodsList();
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .goodsCart {
    .noGoods {
      > div {
        position: relative;
        p {
          @include sc(18px, rgba(255, 255, 255, 1));
          font-weight: 400;
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      button {
        background-color: #ffffff;
        border: 1px solid #ffffff;
        @include wh(130px, 40px);
        margin: 15px;
      }
    }
    .Goods {
      background-color: #F5F5F5;
      > div {
        height: 128px;
        padding: 0 15px;
        background-image: linear-gradient(#100F65, #2C3993);
        > p {
          overflow: hidden;
          padding: 40px 0 0;
          margin: 0;
          color: #ffffff;
          span {
            display: inline-block;
            &:last-child {
              font-size: 12px;
            }
          }
        }
      }
      > section {
        position: relative;
        top: -60px;
        padding: 0 15px;
        .van-cell {
          border-radius: 3px !important;
        }
        .checkBox {
          background-color: white;
          margin: 20px 0 0;
          border-radius: 5px;
          .checkDiv {
            padding: 8px 5px;
            .rudio {
              .van-cell-group {
                &:last-child {
                  border-bottom: none
                }
              }
              /deep/ .van-cell-group {
                border-bottom: 1px solid #e8e8e8;
              }
            }
          }
          .van-checkbox__icon {
            font-size: 18px;
          }
          /deep/ .van-checkbox__icon .van-icon {
            @include wh(18px, 18px);
            line-height: 18px;
          }
        }

        /deep/ .van-cell {
          padding: 0 5px;
        }
        .card {
          display: flex;
          padding-left: 5px;
          box-sizing: border-box;
          p {
            box-sizing: border-box;
            margin: 0 0 12px;
            flex-shrink: 0;
            padding: 0 5px;
            &:first-child {
              padding: 0;
              width: 32%;
              img {
                @include wh(100%, 100%)
              }
            }
            &:nth-child(2) {
              width: 52%;
              span {
                margin-bottom: 6px;
                display: block;
                text-align: left;
                font-size: 14px;
                &:nth-child(1) {
                  @include sw(500, #24272C);
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
                &:nth-child(2) {
                  color: #A6A6A6;
                }
                &:last-child {
                  color: #FF6464;
                }
              }
            }
            &:last-child {
              @include wh(35px, 100%);
              margin: 0;
            }
            /deep/ .van-stepper button {
              @include wh(21px, 21px);
              margin: 7px 0;
            }
            .van-stepper {
              transform: rotate(180deg);
            }
            /deep/ .van-stepper__input {
              transform: rotate(180deg);
              @include wh(22px, 22px);
            }
          }
        }
      }
    }
    /deep/ .van-checkbox__label{
      width: 100%;
      overflow: hidden;
      /*padding-right: 10px;*/
      span{
        &:first-child{
          float: left;
        };
      }
      .red {
        color: #FF6464;
        float: right;
      }
    }

    main {

      background-color: #F5F5F5;
      padding: 0 15px 70px;
      > p {
        text-align: left;
        @include sc(15px, #24272C);
        font-weight: 700;
        margin: 0 0 10px;
      }
      section {
        /deep/ .van-grid {
          padding-left: 0 !important;
        }
        /deep/ .van-grid-item {
          padding: 0 5px !important;
        }
        overflow: hidden;
        margin-bottom: 15px;
        /deep/ .van-grid-item__content {
          padding: 0 0 8px;
          border-radius: 5px;
          .text {
            padding: 0 8px;
            span {
              margin: 4px 0 0;
              font-size: 10px;
              text-align: left;
              display: block;
              width: 100%;
              &:nth-child(1) {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
              &:nth-child(2) {
                @include sw(500, #24272C)
              }
              &:last-child {
                @include sc(15px, #FF6464)
              }
            }
          }
          img {
            @include wh(100%, 130px);
            border-radius: 5px 5px 0 0;
          }

        }
      }
    }
    /deep/ .van-submit-bar {
      bottom: 50px;
    }
    .manage {
      /deep/ .van-checkbox {
        width: 100px !important;
      }
      .van-button {
        @include wh(100px, 40px);
        color: #FF6464;
        border: 1px solid #FF6464;
      }
      .firstButton {
        margin: 0 13px 0 30px;
      }
      /deep/ .van-submit-bar__button--danger {
        background: #ffffff;
      }
    }
    .move {
      position: relative;
      top: -35px;
      padding-bottom: 110px !important;
    }
    /deep/ .van-checkbox__label {
      font-size: 14px;
    }
  }

  .cardBox {
    display: flex;
    @include wh(335px, 115px);
    background-color: #ffffff;
    > div {
      flex-shrink: 0;
      &:first-child {
        width: 25px;
        position: relative;
      }
      &:last-child {
        width: calc(100% - 25px);
      }
    }
  }

  .cardCheck {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%)
  }


</style>
