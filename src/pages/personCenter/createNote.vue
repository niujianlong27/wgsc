<template>
  <div class="createNote">
    <page-nav :title="'创建发货单'"></page-nav>
    <main>
      <section>
        <h4><span></span> 订单查询</h4>
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
            <template v-if="item.type== 'date'">
              <van-field
                readonly
                clickable
                :name="item.eName"
                v-model="item.value"
                :label="item.cName"
                placeholder="点击选择时间"
                @click="item.showPicker = true"
              />
              <van-calendar v-model="item.showPicker" @confirm="onConfirm($event,item)"/>

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
            <van-button class="seach" block type="info" native-type="submit">查询订单</van-button>

          </div>
        </van-form>

      </section>
      <section class="section1">
        <h4><span></span> 选择订单</h4>
        <template v-if="isLoding">
          <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
        </template>
        <template v-else>
          <template v-if="orderList.length == 0">
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

                <van-collapse-item v-for="(data,value) in orderList" :key="data.className"
                                   :name="data.id">
                  <template #title>
                    <div>{{data.ordersNum}}</div>
                    <div>{{data.ouName}}</div>
                    <div>{{data.title}}</div>
                    <div>{{data.createTime | setDate}}</div>
                    <div v-if="data.status == '01'">状态：草稿</div>
                    <div v-else-if="data.status == '02'">状态：待付款</div>
                    <div v-else-if="data.status == '03'">状态：待收款</div>
                    <div v-else-if="data.status == '04'">状态：待接单</div>
                    <div v-else-if="data.status == '05'">状态：已接单</div>
                    <div v-else-if="data.status == '06'">状态：已拒单</div>
                    <div v-else-if="data.status == '07'">状态：已生效</div>
                    <div v-else-if="data.status == '08'">状态：审批驳回</div>
                    <div v-else="data.status == '09'">状态：待审批</div>
                    <div v-if="data.deliverOrderStatus == '1'">发货状态：部分发货</div>
                    <div v-else="data.deliverOrderStatus == '0'">发货状态：未发货</div>

                  </template>

                  <!--<van-checkbox-group class="rudio" :ref="'checkboxGroup' + value" v-model="data.result">-->
                  <van-cell-group :border="false" v-for="(item, index) in goodsList" :key="index">
                    <div class="cardBox">
                      <div>
                        <van-cell class="cardCheck" :border="false">
                          <template #title>
                            <van-checkbox v-model="item.checked"/>
                          </template>
                        </van-cell>
                      </div>
                      <div class="card">
                        <p>
                          <span>货号：{{item.goodsNo}}</span>
                          <span>产品详情:{{item.materialName}}</span>
                          <span>订单单价:{{item.unitPriceTaxed}}  订单数量:{{item.requestAmount}}</span>
                          <span>已发货数:{{item.deliverOrderItemNum}}  已收货数:{{item.receiptOrderItemNum}}</span>
                        </p>
                        <p>
                          <van-stepper v-model="item.difference"
                                       :max="Number(item.requestAmount ) - Number(item.deliverOrderItemNum )"
                                       theme="round"
                                       button-size="22" integer/>
                        </p>
                      </div>
                    </div>
                  </van-cell-group>
                  <!--</van-checkbox-group>-->
                  <van-form @submit="onSubmit2(data,'form' + value)" :ref="'form' + value">
                    <template v-for="item in fromData2">
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
                            @confirm="pickConfirm($event,item)"
                            @cancel="item.showPicker = false"
                          />
                        </van-popup>
                      </template>
                      <template v-if="item.type== 'date'">
                        <van-field
                          readonly
                          clickable
                          :required="item.required"
                          :name="item.eName"
                          v-model="item.value"
                          :label="item.cName"
                          :rules="item.rule"
                          :error="false"
                          placeholder="点击选择时间"
                          @click="item.showPicker = true"
                        />
                        <van-calendar v-model="item.showPicker" @confirm="onConfirm($event,item)"/>

                      </template>
                      <template v-if="item.type == 'text'">
                        <van-field
                          :name="item.eName"
                          :label="item.cName"
                          v-model="item.value"
                          placeholder="请输入"
                        />
                      </template>
                    </template>

                    <div style="margin: 16px;">
                      <van-button class="formButton" block type="info" native-type="submit">
                        提交
                      </van-button>
                    </div>

                  </van-form>

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
  import http from '../../utils/http';
  import urls from '../../utils/urls';
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

  export default {
    name: "createNote",
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
        orderList: [],
        goodsList: [],
        fromData: [ // 订单查询表格
          {cName: '订单号', eName: 'orderNum', type: 'text', value: ''},
          {
            cName: '发货状态',
            eName: 'deliveryOrderStatus',
            type: 'select',
            key: 'text',
            columns: [{
              values: [
                {text: '全部', value: 'allOrder'},
                {text: '未发货', value: '0'},
                {text: '部分发货', value: '1'}]
            }],
            showPicker: false,
            value: ''
          },
          {
            cName: '订单状态',
            eName: 'orderStatusSearch',
            type: 'select',
            key: 'text',
            columns: [{
              values: [
                {text: '请选择', value: ''}, {text: '待付款', value: '02'},
                {text: '待收款', value: '03'}, {text: '待接单', value: '04'},
                {text: '已拒单', value: '06'}, {text: '已接单', value: '07'},
                {text: '审批驳回', value: '08'}, {text: '待审批', value: '08'}]
            }],
            showPicker: false,
            value: ""
          },
        ],
        deliveryOrderStatus: 'allOrder',
        orderStatusSearch: '',
        fromData2: [
          {
            cName: '预计到货日期',
            eName: 'arrivalDate',
            type: 'date',
            showPicker: false,
            value: '',
            required: true,
            rule: [{required: true, message: '请选择预计到货日期'}]
          },
          {cName: '内部发货单号', eName: 'interCode', type: 'text', value: ''},
          {cName: '发货备注', eName: 'memo', type: 'text', value: ''},
        ],
      }
    },
    methods: {
      pickConfirm(value, item) { // 选择框确定按钮
        item.value = value[0].text;
        if (item.eName == 'deliveryOrderStatus') {  // 发货状态
          this.deliveryOrderStatus = value[0].value;

        }
        if (item.eName == 'orderStatusSearch') {  // 订单状态
          this.orderStatusSearch = value[0].value;
        }
        item.showPicker = false;
      },

      onConfirm(value, item) { // 时间选择确认
        item.showPicker = false;
        if (item.type === 'date') {
          item.value = `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`;
          return
        }
        item.value = value;
      },


      onLoad() { // 滚动加载
        this.page += 1;
        this.OrderDelivery()
      },

      onSubmit(value) { // 订单查询表单提交
        this.page = 1;
        this.orderList = [];
        this.isLoding = true;
        this.OrderDelivery()
      },

      OrderDelivery() {  // 创建发货单查询订单信息
        let nowDate = new Date().getTime();
        let formData = this.$refs.form1.getValues();
        let params = {
          mode: 2,// 固定参数
          rows: 10,
          page: this.page,
          _search: false, // 固定参数
          sord: "asc", // 固定参数
          nd: nowDate, // 当前时间时间戳
          ...formData, //表单的参数
        };
        params.orderStatusSearch = this.orderStatusSearch;  //表单的参数赋值
        params.deliveryOrderStatus = this.deliveryOrderStatus; //表单的参数赋值
        http.get(urls.ajaxSelectOrderDelivery, params).then(res => {
          this.isLoding = false;
          if (res.success) {
            this.loading = false;
            let list = res.obj.rows || [];
            list.forEach(item => {
              item['result'] = []
            });
            this.orderList = this.orderList.concat(list);
            if (this.orderList.length == res.obj.records) { //根据总条数控制查询请求
              this.finished = true;
            }

          }
        }).catch(err => {

        })
      },

      onSubmit2(data, form) {
        this.formData = this.$refs[form][0].getValues();
        let arr = []
        this.goodsList.forEach(item => {
          if (item.checked) {
            arr.push(`${item.id}-${item.difference}-${item.unitPriceTaxed}`)
          }
        });
        let nowDate = new Date().getTime();
        let params = {
          ...this.formData,
          orderId: data.id,
          _: nowDate,
          orderItemIds: arr.join()
        };

        http.get(urls.doCreateDelivery, params).then(res => {
          if (res.success) {
            Toast.success('发货单创建成功！');
            this.page = 1;
            this.isLoding = true;
            this.orderList = [];
            this.OrderDelivery()
          }

        }).catch(err => {

        })

      },
      changeColl(activeNames) { // 折叠面板切换
        for (let key in this.fromData2) { // 清空表格数据
          this.fromData2[key].value = ''
        }
        this.ajaxQueryOrderItemById(activeNames)
      },

      ajaxQueryOrderItemById(id) {
        let nowDate = new Date().getTime();
        let params = {
          nd: nowDate,
          orderNum: id,
          _search: false,
          rows: 30,
          page: 1,
          sord: 'asc'
        };
        http.post(urls.ajaxQueryOrderItemById, params).then(res => {
          if (res.success) {
            res.obj.rows.forEach(item => {
              item['checked'] = true;
              item['difference'] = Number(item.requestAmount) - Number(item.deliverOrderItemNum);
            });
            this.goodsList = res.obj.rows;
          }
        }).catch(err => {

        })
      }
    },
    mounted() {
      this.isLoding = true;
      this.OrderDelivery()
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .createNote {
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
        display: flex;
        padding-left: 5px;
        box-sizing: border-box;
        p {
          box-sizing: border-box;
          margin: 0 0 12px;
          flex-shrink: 0;
          padding: 0 5px;
          &:first-child {
            width: 82%;
            span {
              margin-bottom: 6px;
              display: block;
              text-align: left;
              font-size: 14px;
              /*&:nth-child(1) {*/
              @include sw(500, #24272C);
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              /*}*/
              /*&:nth-child(2) {*/
              /*color: #A6A6A6;*/
              /*}*/
              /*&:last-child {*/
              /*color: #FF6464;*/
              /*}*/
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

    /deep/ .van-cell__title {
      text-align: left;
    }

    /deep/ .van-collapse-item__content {
      padding: 12px 0;
    }

    .cardBox {
      display: flex;
      width: 335px;
      background-color: #ffffff;
      > div {
        flex-shrink: 0;
        &:first-child {
          width: 25px;
          position: relative;
          /deep/ .van-cell {
            padding-left: 5px;
          }
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

    .van-loading {
      text-align: center;
    }
  }

</style>
