<template>
  <div class="orderConfirm">
    <page-nav :title="'订单确认'"></page-nav>
    <main>
      <section  style="padding-bottom: 16px" v-if="defaultConsignee.consignee">
        <p>{{defaultConsignee.consignee}} {{defaultConsignee.mobile}} </p>
        <van-cell v-if="defaultConsignee.province" :border="false"
                  :title="defaultConsignee.province + defaultConsignee.city + defaultConsignee.area +  defaultConsignee.street + defaultConsignee.detailAddress "
                  is-link @click="toPath('/receiptAddress',{form:'orderConfirm'})"/>
        <p v-if="defaultConsignee.isDefault == '1'" class="red">
          <van-icon name="passed"/>
          已设为默认
        </p>
      </section>
      <section v-else>
        <van-cell :title="'收货地址'"
                  is-link @click="toPath('/receiptAddress',{form:'orderConfirm'})"/>
      </section>

      <section>
        <van-radio-group v-model="OnlineReceiptRules">
          <van-radio name="01">创建人账号在线收货确认</van-radio>
          <van-radio name="02">仓库管理员在线收货确认</van-radio>
        </van-radio-group>
      </section>

      <section>
        <van-cell :border="false" :title=" statement.statementName ? '结算中心:' + statement.statementName : '结算中心:'"
                  is-link
                  @click="toPath('/chooseInvoice')"/>
      </section>

      <section>
        <van-form @submit="onSubmitForm" ref="form">
          <template v-for="item in fromData">
            <template v-if="item.type== 'date'">
              <van-field
                readonly
                clickable
                required
                :name="item.eName"
                v-model="item.value"
                :label="item.cName"
                placeholder="点击选择时间"
                @click="item.showPicker = true"
                :error="false"
                :rules="item.rule"
              />
              <van-calendar v-model="item.showPicker" @confirm="onConfirm($event,item)"/>

            </template>
            <template v-if="item.type == 'text'">
              <van-field
                required
                :name="item.eName"
                :label="item.cName"
                v-model="item.value"
                placeholder="请输入"
                :error="false"
                :rules="item.rule"
              />
            </template>
          </template>
        </van-form>
      </section>

      <section class="orderItem">
        <template v-if="goodsData.length > 0">
          <div v-for="data in goodsData" v-if="data.cartItemList.length > 0" :key="data.id">
            <p>{{data.supplierName}}
              <van-icon name="arrow"/>
            </p>
            <div class="card" v-for="item in data.cartItemList" :key="item.shoppId">
              <div>
                <div>
                  <img :src="item.imgUrl[0] | setImg" alt="">
                </div>
                <div>
                  <p>品牌：{{item.producer}}</p>
                  <div class="textColor">
                    型规:{{item.specification}}
                  </div>
                  <p style="position: relative">
                    <span>¥{{item.unitPriceTaxed | fixNum}} <span>x {{item.requestAmount}}</span></span>
                    <span style="position: absolute;right: 0;top: -2px;">
               <van-stepper button-size="24" @change="onChange(data,item)" v-model="item.requestAmount"/>
              </span>
                  </p>
                </div>
              </div>
              <p style="margin: 8px 0">
                <span>货号：{{item.goodsNo}}</span>
                <span @click="deleteItem(data,item)" class="romove">移除商品</span>
              </p>
            </div>

          </div>
        </template>
        <template v-else>
          <van-empty description="暂无商品"/>

        </template>
      </section>
      <van-popup class="popup" v-model="popupShow">
        <p style="text-align: center;margin:0 0 15px">
          <img src="../../assets/u217.png" alt=""> 订单提交成功
        </p>
        <p>订单编号：{{successMsg.orderNum}}</p>
        <p>订单金额： <span style="color:#fb5630"> {{successMsg.orderTotPrice}} </span> 元</p>
        <p v-if="isJD" style="color:#fb5630">*
          尊敬的用户，你好！京东商品库存、价格将为您保留7天（过期时间：{{newDate}}），请在保留周期内完成领导审批，超期未审批订单将自动作废。</p>
        <p></p>
        <van-button @click="toPath('/shopCart')" type="primary">返回购物车</van-button>
        <van-button @click="toPath2" type="info">查看订单</van-button>
      </van-popup>

    </main>
    <footer>
      <van-submit-bar :disabled="disabled" :decimal-length="3" :label="titleNume" :price="totalPrice" button-text="提交订单" @submit="onSubmit">
      </van-submit-bar>
    </footer>
  </div>
</template>

<script>
  import pageNav from '../../components/pageNav';
  import {
    Icon,
    Form,
    Cell,
    Popup,
    Empty,
    Field,
    Stepper,
    Button,
    Calendar,
    Toast,
    SubmitBar,
    RadioGroup,
    Radio
  } from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';
  import {getlocalStorage, getSessionStorage, removeSessionStorage, mul} from "../../config/Utils";

  export default {
    name: "orderConfirm",
    components: {
      pageNav,
      [Form.name]: Form,
      [Field.name]: Field,
      [Calendar.name]: Calendar,
      [Icon.name]: Icon,
      [Cell.name]: Cell,
      [Stepper.name]: Stepper,
      [SubmitBar.name]: SubmitBar,
      [Radio.name]: Radio,
      [Toast.name]: Toast,
      [Popup.name]: Popup,
      [RadioGroup.name]: RadioGroup,
      [Button.name]: Button,
      [Empty.name]: Empty,

    },
    data() {
      return {
        disabled:false,
        code: '',//查询code
        defaultConsignee: {}, // 收货地址信息
        invoice: {},
        popupShow: false, // 弹出层控制
        data: {},// 请求数据缓存
        value: 1,//购买数量绑定
        titleNume: '共 1 件 合计：',
        OnlineReceiptRules: "01", //选择创建人
        successMsg: {},//订单信息
        totalPrice: 0,

        fromData: [
          {
            cName: '订单标题', eName: 'orderTitle', type: 'text', value: '', rule: [{required: true, message: '请填写订单标题'},
              // {
              //   pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]*$/,
              //   message: '内容不能包含空格及特殊字符'
              // }
            ]
          },
          {
            cName: '部门名称',
            eName: 'departmentName',
            type: 'text',
            value: '',
            rule: [{required: true, message: '请填写部门名称'}]
          },
          {
            cName: '要求交货期',
            eName: 'deliveryDate',
            type: 'date',
            showPicker: false,
            value: '',
            rule: [{required: true, message: '请选择要求交货期'}]
          },
        ],
        goodsData: [], //商品列表数据
        statement: {},
        newDate: '', // 向后取一周时间
        isJD: false // 京东商品
      }
    },
    methods: {

      toPath(url,data) { // 路由跳转
        if (data){
          this.$router.push({path: url,query:data});
          return
        }
        this.$router.push({path: url});
      },

      toPath2(url) { // 路由跳转
        this.$router.push({path: '/myOrders', query: {index: 0}});
      },

      getOrder() {  // 查询订单信息
        const toast = Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: false,
          message: '数据加载中',
        });
        http.get(urls.toOrderDetermine, {
          headType: 1,
          supplierId: "",
          code: this.$route.query.code,
          commodityNos: this.$route.query.commodStr
        }).then(res => {
          if (res.success) {
            toast.clear();
            this.data = res.obj;
            !getSessionStorage('address') && (this.defaultConsignee = res.obj.model.DefaultConsignee || {}); //重新选择地址
            !getSessionStorage('invoice') && (this.statement = res.obj.model.statement[0] || {}); //重新选择发票
            this.goodsData = res.obj.model.supplierCartVos || [];
            this.addTotal()
          } else {
            Toast.fail(res.msg)
          }
        }).catch(err => {

        })
      },

      onChange(data, item) { // 商品数量变化
        let params = {
          supplierId: data.supplierId,
          lcMaterialNo: item.lcMaterialNo,
          num: item.requestAmount
        };
        http.post(urls.updateRedisNum, params).then(res => {
          if (res.success) {
            this.addTotal()
          } else {
            Toast.fail(res.msg)
          }
        }).catch(err => {

        });
      },

      deleteItem(data, item) { // 移除商品
        let params = {supplierId: data.supplierId, lcMaterialNo: item.lcMaterialNo};
        http.post(urls.deleteCommodityFromShopCar, params).then(res => {
          if (res.success) {
            if (this.$route.query.code) { //从购物车页面进来
              this.goodsData = res.obj.model.supplierCartVos || [];
            } else {
              this.goodsData = [];
            }
            this.addTotal()
          } else {
            Toast.fail(res.msg)
          }
        }).catch(err => {

        })
      },

      onSubmit() { // 提交订单
        this.$refs.form.submit(); //onSubmitForm
      },

      onSubmitForm() {  // 提交订单
        this.isJD = false;
        let jdArr = [];

        if (this.goodsData.length == 0) {
          Toast.fail('当前商品为空，不能提交订单');
          return
        }
        let obj = this.$refs.form.getValues();
        let arr = this.goodsData.map(item => { // 处理商品集合供应商id
          return {supplierId: item.supplierId}
        });
        let obj2 = {selectSupplier: arr};

        this.goodsData.forEach(data => {
          data.cartItemList.forEach(item => {
            if (item.showPos === '0520') { // 判断为京东商品
              this.isJD = true;
              jdArr.push(`${item.goodsNo}-${item.requestAmount}`)
            }
          })
        });


        if (!this.statement.invoiceId) {
          Toast('请选择结算中心');
          return
        }
        if (!this.defaultConsignee.id) {
          Toast('请选择收货地址');
          return
        }

        let params = {
          deliveryId: this.defaultConsignee.id, //收货人id
          departmentName: obj.departmentName, ///部门名称
          invoiceId: this.statement.invoiceId, // 发票id
          orderType: obj.orderTitle, // 订单名称
          deliveryDate: obj.deliveryDate, // 发票id
          OnlineReceiptRules: this.OnlineReceiptRules, //发票id
          selectSupplier: JSON.stringify(obj2), // 商品集合
          orderPrice: this.totalPrice / 100, // this.totalPrice是以分的形式
          isTempShopCart: '',
          statementId: this.statement.id, // 发票id
          statementIdText: this.statement.statementName || '', // 结算中心名称
          token: getlocalStorage('token'),
          code: this.data.model.code || this.code, // code
          openInvoiceType: '0',
          wfNumber: "",
          shopNo: 'wg'
        };

        // if (this.isJD) {
        //   http.post(urls.checkJdCommodity, {
        //     flag: "checkJdExistence",
        //     commodityNos: jdArr.join(),
        //     consigneeId: this.defaultConsignee.id
        //   }).then(res => {
        //     if (res.result == "audit") {
        //       Toast.fail(`您购买的商品（货号：${res.commodityNos}）已下架，请从购物车中删除。`);
        //     } else {
        //       this.Insertorder(params)
        //     }
        //   }).catch(err => {
        //
        //   })
        // } else {
          this.Insertorder(params)
        // }


      },
      Insertorder(params) {
        http.post(urls.Insertorder, params).then(res => {
          this.disabled = true;
          if (res.msg == 'success') {
            this.successMsg = res;
            this.popupShow = true
          } else {
            Toast(res.msgInfo)
          }
        }).catch(err => {

        })
      },

      onConfirm(value, item) { // 时间控件选择触发
        let date = new Date(value.getTime() + 7 * 24 * 3600 * 1000);
        this.newDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        item.showPicker = false;
        if (item.type === 'date') {
          item.value = `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`;
          return
        }

        item.value = value;
      },

      addTotal() { //计算价格
        let total = 0;
        let totalPrice = 0;
        this.goodsData.forEach(item => {
          item.cartItemList.forEach(data => {
            total += data.requestAmount;
            totalPrice += mul(data.requestAmount, data.unitPriceTaxed)
          })
        });
        this.titleNume = `共 ${total} 件 合计: `;
        this.totalPrice = totalPrice * 100 // 展示到分
      },

      getGoodsList() {  // 查询购物车
        let token = getlocalStorage("token");
        http.get(urls.queryShoppingList, {
          flag: "wg",
          appCode: "WG",
          access_token: token,
          headType: 1
        }).then(res => {
          if (res.success) {
            this.code = res.obj.model.code;
          }
        }).catch(err => {

        })
      },
    },
    created() {
      !this.$route.query.code && this.getGoodsList(); // code 为空是直接购买 ，需要先查询购物车， 否则是从购物车进入
      this.getOrder(); // 查询订单信息
      getSessionStorage('address') && (this.defaultConsignee = JSON.parse(getSessionStorage('address'))); //获取缓存的地址和结算中心
      getSessionStorage('invoice') && (this.statement = JSON.parse(getSessionStorage('invoice')))
    },

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
          margin: 12px 0 0!important;
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
      p.red {
        font-size: 12px;
        color: #E44A4A;
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

  .van-radio-group, .van-radio {
    padding: 8px 0;
  }

  .popup {
    width: 60%;
    padding: 10px;
    border-radius: 5px;
    img {
      @include wh(30px, 30px);
      position: relative;
      top: 8px;
    }
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

  .color {
    color: #9D9D9D
  }

</style>
