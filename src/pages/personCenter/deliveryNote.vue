<template>
  <div class="deliveryNote">
    <page-nav :title="'发货单查询'"></page-nav>
    <main>
      <section>
        <h4><span></span> 发货单查询</h4>
        <van-form @submit="onSubmit" ref="form1">
          <template v-for="item in fromData">
            <template v-if="item.type == 'select'">
              <van-field
                readonly
                clickable
                :name="item.eName"
                v-model="item.value"
                :label="item.cName"
                placeholder="请选择"
                @click="item.showPicker = true"
              />
              <van-popup v-model="item.showPicker" position="bottom">
                <van-picker
                  show-toolbar
                  :columns="item.columns"
                  :value-key="item.key"
                  @confirm="pickConfirm($event,item)"
                  @cancel="item.showPicker = false"
                />
              </van-popup>
            </template>

            <template v-if="item.type == 'text'">
              <van-field
                v-model="item.value"
                :name="item.eName"
                :label="item.cName"
                placeholder="请输入"
              />
            </template>
          </template>
          <div>
            <van-button class="seach" block type="info" native-type="submit">查询发货单</van-button>

          </div>
        </van-form>

      </section>
      <section class="section1">
        <h4><span></span> 发货单</h4>
        <template v-if="isLoding">
          <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
        </template>
        <template v-else>
          <template v-if="deliveryList.length == 0">
            <van-empty description="暂无数据"/>
          </template>
          <template v-else>
            <van-list
              offset="300"
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-collapse v-model="activeNames" accordion @change="changeColl">

                <van-collapse-item v-for="(data,value) in deliveryList" :key="data.className"
                                   :name="data.id">
                  <template #title>

                    <div style="font-weight: 600" class="title"><span>发货单号：</span>{{data.deliveryCode}}</div>
                    <div class="title"><span>订单标题：</span>{{data.title}}</div>
                    <div class="title"><span>收货人：</span>{{data.consigneeUser}}</div>
                    <div class="title"><span>发货时间：</span> {{data.deliverCreateDate | setDate}}</div>
                    <div class="title" v-if="data.isSettle == '0'"><span>支付状态：</span>在线预付款线上支付(未支付)</div>
                    <div class="title" v-else-if="data.isSettle == '1'"><span>支付状态：</span>在线预付款线上支付(全部支付)</div>
                    <div class="title" v-else-if="data.isSettle == '2'"><span>支付状态：</span>在线预付款线下支付(未支付)</div>
                    <div class="title" v-else-if="data.isSettle == '3'"><span>支付状态：</span>在线预付款线下支付(全部支付)</div>
                    <div class="title" v-else-if="data.isSettle == '4'"><span>支付状态：</span>货到付款(未支付)</div>
                    <div class="title" v-else-if="data.isSettle == '5'"><span>支付状态：</span>货到付款(部分支付)</div>
                    <div class="title" v-else-if="data.isSettle == '6'"><span>支付状态：</span>货到付款(全部支付)</div>
                    <div class="title" v-else-if="data.isSettle == '7'"><span>支付状态：</span>在线预付款（已支付待确认）</div>

                    <div class="title" v-if="data.deliverStatus == '1'"><span>状态：</span>已收货</div>
                    <div class="title" v-else-if="data.deliverStatus == '2'"><span>状态：</span>已拒收</div>
                    <div class="title" v-else-if="data.deliverStatus == '3'"><span>状态：</span>作废</div>
                    <div class="title" v-else><span>状态：</span>待收货</div>

                  </template>

                  <van-cell-group :border="false" v-for="(item, index) in detailsList" :key="index">
                    <div class="cardBox">
                      <div class="card">
                        <div>
                          <p><span>货号: </span> {{item.goodsNo}}</p>
                          <p><span>产品详情: </span>{{item.materialName}}</p>
                          <p><span>品牌: </span> {{item.producer}}</p>
                          <p><span>型规: </span>{{item.specification}}</p>
                          <p><span>订单数量: </span> {{item.requestAmount}} <span>本次发货数量: </span> {{item.deliveryNum}} </p>
                          <p><span>订单单价: </span>{{item.unitPriceTaxed}} <span>发货金额: </span>{{item.totalMoney}}</p>
                        </div>
                      </div>
                    </div>
                  </van-cell-group>

                </van-collapse-item>
              </van-collapse>
            </van-list>
          </template>
        </template>
      </section>
    </main>
  </div>


</template>

<script>
  import pageNav from '../../components/pageNav';
  import {
    CheckboxGroup,
    Field,
    Empty,
    CollapseItem,
    Checkbox,
    Cell,
    List,
    Collapse,
    CellGroup,
    Form,
    Stepper,
    Button,
    Popup,
    Loading,
    Picker,
    DatetimePicker,
    Calendar,
    Toast
  } from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';

  export default {
    name: "deliveryNote",
    components: {
      pageNav,
      [List.name]: List,
      [CollapseItem.name]: CollapseItem,
      [Collapse.name]: Collapse,
      [Stepper.name]: Stepper,
      [CellGroup.name]: CellGroup,
      [Cell.name]: Cell,
      [Field.name]: Field,
      [Checkbox.name]: Checkbox,
      [Popup.name]: Popup,
      [Picker.name]: Picker,
      [DatetimePicker.name]: DatetimePicker,
      [Calendar.name]: Calendar,
      [Form.name]: Form,
      [Button.name]: Button,
      [CheckboxGroup.name]: CheckboxGroup,
      [Empty.name]: Empty,
      [Loading.name]: Loading,
      [Toast.name]: Toast,
    },
    data() {
      return {
        isLoding: false,//整个页面加载
        loading: false,//数据滚动加载
        finished: false,//全部加载完成
        formData: {}, // 存储表单数据
        activeNames: [], // 默认展开
        page: 1,
        deliveryList: [],
        detailsList: [],
        fromData: [ // 订单查询表格
          {cName: '订单编号', eName: 'orderNumber', type: 'text', value: ''},
          {cName: '发货编号', eName: 'deliveryNumber', type: 'text', value: ''},

          {
            cName: '发货状态',
            eName: 'deliveryStateValues',
            type: 'select',
            key: 'text',
            columns: [{
              values: [
                {text: '全部', value: ''},
                {text: '待收货', value: '0'},
                {text: '已收货', value: '1'},
                {text: '已拒收', value: '2'},
                {text: '作废', value: '3'}]
            }],
            showPicker: false,
            value: ''
          },
        ],
        deliveryStateValues: '',
      }
    },
    methods: {
      pickConfirm(value, item) { // 选择框确定按钮
        item.value = value[0].text;
        if (item.eName == 'deliveryStateValues') {  // 发货状态
          this.deliveryStateValues = value[0].value;

        }
        item.showPicker = false;
      },


      onLoad() { // 滚动加载
        this.page += 1;
        this.getDelivery()
      },

      onSubmit(value) { // 订单查询表单提交
        this.page = 1;
        this.deliveryList = [];
        this.isLoding = true;
        this.getDelivery()
      },

      getDelivery() {  // 创建发货单查询订单信息
        let nowDate = new Date().getTime();
        let formData = this.$refs.form1.getValues();
        let params = {
          rows: 10,
          page: this.page,
          _search: false, // 固定参数
          sord: "asc", // 固定参数
          nd: nowDate, // 当前时间时间戳
          ...formData, //表单的参数
        };
        params.deliveryStateValues = this.deliveryStateValues; //表单的参数赋值

        http.post(urls.searchSupplierDelivery, params).then(res => {
          this.isLoding = false;
          if (res.success) {
            this.loading = false;
            let list = res.obj.rows || [];
            list.forEach(item => {
              item['result'] = []
            });
            this.deliveryList = this.deliveryList.concat(list);
            if (this.deliveryList.length == res.obj.records) { //根据总条数控制查询请求
              this.finished = true;
            }
          }
        }).catch(err => {

        })
      },

      changeColl(activeNames) { // 折叠面板切换
        this.ajaxQueryOrderItemById(activeNames)
      },

      ajaxQueryOrderItemById(id) {
        let nowDate = new Date().getTime();
        let params = {
          nd: nowDate,
          receptId: id,
          _search: false,
          rows: 10000000,
          page: 1,
        };
        http.get(urls.AjaxLoadReceptItemList, params).then(res => {
          if (res.success) {
            this.detailsList = res.obj.rows;
          }
        }).catch(err => {

        })
      }
    },
    mounted() {
      this.isLoding = true;
      this.getDelivery()
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .deliveryNote {
    main {
      /deep/ .van-popup {
        height: 60%;
      }
      background-color: #F5F5F5;
      padding: 0 20px 50px;
      section {
        box-sizing: border-box;
        padding: 1px 18px;
        margin-top: 10px;
        border-radius: 7px;
        background-color: #FFFFFF;
        text-align: left;
        h4 {
          font-size: 14px;
          margin: 12px 0;
          span {
            border-left: 2px solid #373737;
            height: 12px;
            display: inline-block;
            position: relative;
            top: 1px;
          }
        }
        p {
          padding-left: 6px;
          margin: 12px 0;
          span {
            &:first-child {
              color: #373737;
              font-weight: 500;
            }
          }
          @include sc(12px, #898989)
        }
        .van-cell {
          padding: 10px 5px;
        }
      }
      .seach {
        margin: 20px 0;

      }
    }

    .section1 {
      /deep/ .van-field {
        padding-left: 18px !important;
      }
      padding: 1px 0;
      h4 {
        padding-left: 18px;
      }
      img {
        @include wh(100%, 188px)
      }
      margin-top: 10px;
      /deep/ .van-cell {
        padding: 7px 10px;
      }
      .card {
        /*display: flex;*/
        padding-left: 5px;
        box-sizing: border-box;
        div {
          box-sizing: border-box;
          margin: 0 0 12px;
          padding: 0 5px;
          p {
            span {
              color: #000;
              margin-left: 5px;
            }
            margin-top: 0;
            margin-bottom: 6px;
            display: block;
            text-align: left;
            font-size: 14px;
            @include sw(500, #24272C);
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }

    }

    /deep/ .van-cell__title {
      text-align: left;
      font-size: 14px;
    }

    /deep/ .van-collapse-item__content {
      padding: 12px 0;
    }

    .cardBox {
      width: 335px;
      background-color: #ffffff;
      > div {
        width: 100%;
      }
    }
    .van-loading {
      text-align: center;
    }
    .title span {
      color: black;
    }
  }
</style>
