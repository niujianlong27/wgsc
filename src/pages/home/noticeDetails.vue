<template>
  <div class="noticeDetails">

    <page-nav :title="'采购公告详情'"></page-nav>
    <main>

      <template v-if="isLoding && matLoding">
        <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
      </template>
      <template v-else>
        <section>
          <h4><span></span> 询单摘要</h4>
          <p><span>询价单号：</span><span>{{requestVo.unifiedRfqNum}}</span></p>
          <p><span>询单标题：</span><span>{{requestVo.title}}</span></p>
          <p><span>模式：</span>
            <span v-if="requestVo.rfqMethod == 'RAQ'">询比价</span>
            <span v-if="requestVo.rfqMethod == 'DAC'">反向竞价</span>
            <span v-if="requestVo.rfqMethod == 'MRQ'">原料模式</span>
            <span v-if="requestVo.rfqMethod == 'BUK'">大宗模式</span>
            <span v-if="requestVo.rfqMethod == 'TBQ'">综合模式</span>
          </p>
          <p><span>报名截止时间：</span><span>{{rfqRulesVo.registrationEndDate}}</span></p>
          <p><span>报价截止时间：</span><span>{{requestVo.quotationEndDate}}</span></p>
        </section>

        <section>
          <h4><span></span> 询价要求</h4>
          <p><span>交货地址：</span><span>{{contactsVo.deliveryProvince}}-{{contactsVo.deliveryCity}}-{{contactsVo.deliveryArea}}-{{contactsVo.deliveryAddress}}</span>
          </p>
          <p><span>保证金：</span><span>{{rfqRulesVo.assureMoney}}</span></p>
          <p class="rule"><span>商务条款 : <span v-html="ruleHTML"></span></span></p>
          <p><span>注册资金大于：</span><span>{{preauditVo.regcapital}} 万元</span></p>
          <p><span>报名要求：</span><span>{{preauditVo.requirementDesc}}</span></p>
          <p><span>资质要求：</span><span>{{preauditVo.qualifications}}</span></p>
        </section>

        <section>
          <h4><span></span> 采购方信息及附件</h4>
          <p><span>采购组织：</span><span>{{requestVo.ouName}}</span></p>
          <p><span>联系人：</span><span>{{contactsVo.linkmanName}} </span></p>
          <p><span>联系电话：</span><span>{{contactsVo.linkmanTelphone}}</span></p>
          <p><span>交货地址：</span><span>{{contactsVo.deliveryProvince}}{{contactsVo.deliveryCity}}{{contactsVo.deliveryArea}}{{contactsVo.deliveryAddress}}</span>
          </p>
          <p><span>附件名称：</span><span>{{contactsVo.linkmanTelphone}}</span></p>
          <p v-for="item in rfqAttachments">
            <span>附件名称</span>
            <span>{{item.originalFilename}}</span>
          </p>

        </section>
        <section>
          <h4><span></span> 物料明细</h4>
          <van-list
            offset="100"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >

            <template v-for="(item,index) in matDetailed">
              <p class="typeP"><span>适合您的分类：</span><span>{{item.materialClassification}}</span>
              </p>
              <p><span>物料名称：</span><span>{{item.materialName}}</span></p>
              <p><span>型号规格：</span><span>{{item.character}}</span></p>
              <p><span>采购数量：</span><span>{{item.requestAmount}}</span></p>
              <p><span>交货日期：</span><span>{{item.requestDeliveryDate}}</span></p>
              <p><span>备注：</span><span>{{item.memo}}</span></p>
              <p><span>计量单位：</span><span>{{item.unit}}</span></p>
            </template>
          </van-list>

        </section>
        <div class="bButton">
          <van-button :disabled="disable" color="#171060" block type="info" @click="submit" native-type="submit">
            我要报名
          </van-button>
        </div>


      </template>


      <van-overlay :show="show" @click="show = false">
        <div class="block" @click.stop>
          <van-form @submit="register" ref="address">
            <template v-for="item in fromData">
              <template v-if="item.type == 'text'">
                <van-field
                  center
                  :required="item.required"
                  :error="false"
                  :name="item.eName"
                  :label="item.cName"
                  v-model="item.value"
                  :placeholder="item.placeholder"
                  :rules="item.rule"
                >
                  <!--<template v-if="item.isButton" #button>-->
                  <!--<van-button :loading="buttonClick" loading-type="spinner" :loading-text="buttonCode"-->
                  <!--@click="sendCode"-->
                  <!--size="small" native-type="button" type="default">-->
                  <!--发送验证码-->
                  <!--</van-button>-->
                  <!--</template>-->
                </van-field>
              </template>


              <template v-if="item.type == 'textarea'">
                <van-field
                  center
                  :required="item.required"
                  :error="false"
                  :name="item.eName"
                  :label="item.cName"
                  v-model="item.value"
                  :placeholder="item.placeholder"
                  :rules="item.rule"
                  rows="4"
                  type="textarea"
                  maxlength="50"
                >
                </van-field>
              </template>


              <template v-if="item.type == 'uploader'">
                <van-field :name="item.eName" :rules="item.rule" :label="item.cName">
                  <template #input>
                    <van-uploader accept="*" :max-count="1" :after-read="afterRead(item)">
                      <van-button icon="plus" size="small" type="primary">上传附件</van-button>
                    </van-uploader>
                  </template>
                </van-field>
              </template>

            </template>


            <div style="margin: 16px 0">
              <van-button color="#171060" block type="info" native-type="submit">
                确认报名
              </van-button>
            </div>
          </van-form>

        </div>
      </van-overlay>

    </main>
  </div>

</template>

<script>

  import pageNav from '../../components/pageNav';
  import {Button, Uploader, Field, Form, Overlay, Loading, Toast, List} from 'vant';
  import urls from '../../utils/urls';
  import http from '../../utils/http';
  import {mapState} from 'vuex'
  import {getlocalStorage} from "../../config/Utils";

  export default {
    name: "noticeDetails",
    components: {
      pageNav,
      [List.name]: List,
      [Uploader.name]: Uploader,
      [Form.name]: Form,
      [Field.name]: Field,
      [Button.name]: Button,
      [Loading.name]: Loading,
      [Toast.name]: Toast,
      [Overlay.name]: Overlay,

    },
    data() {
      return {
        show: false, // 遮罩层
        noticeStatus: '', // 标记当前询单消息状态
        fromData: [
          {
            required: true,
            cName: '联系人',
            eName: 'linkmanName',
            type: 'text',
            value: '',
            placeholder: '请输入客户名称',
            rule: [{required: true, message: '请输入客户名称'}]
          },

          {
            required: true,
            cName: '手机号',
            eName: 'linkmanTelphone',
            type: 'text',
            value: '',
            placeholder: '请输入手机号',
            rule: [{required: true, message: '请输入手机号'}, {pattern: /^[0-9]{11}$/, message: '请输入正确的手机号'}]
          },
          {
            required: false,
            cName: '固定电话',
            eName: 'linkmanTel',
            type: 'text',
            value: '',
            placeholder: '请输入固定电话',
            rule: [{required: false, message: '请输入固定电话'}]
          },
          // {
          //   required: false,
          //   cName: '附件',
          //   eName: 'refUrl',
          //   type: 'uploader',
          //   value: [],
          //   placeholder: '请上传附件',
          //   rule: [{required: false, message: '请上传附件'}]
          // },
          {
            required: true,
            cName: '报名阐述',
            eName: 'responseDesc',
            type: 'textarea',
            value: '',
            placeholder: '请输入报名阐述',
            rule: [{required: true, message: '请输入报名阐述'}]
          },
        ],
        disable:true, // 按钮可点击
        formData: {}, // 表单参数
        loading: false,//数据滚动加载
        finished: false,//全部加载完成

        details: {},
        contactsVo: {},
        rfqRulesVo: {},
        requestVo: {},
        preauditVo: {},
        rfqAttachments: {},
        isLoding: false, //初始数据加载
        matLoding: false,//物料详情加载中
        pageIndex: 1, // 页码
        matDetailed: [], // 物料明细
        total: 0,
        pageSize: 5,
        ruleHTML: ''
      }
    },
    computed: {
      ...mapState(['purchaser']) // true采购商，false 供应商
    },
    methods: {

      submit() {
        if (this.purchaser) {
          Toast.fail('采购商身份，不支持报名！');
          return
        }
        if (this.noticeStatus == '0') {
          Toast.fail(' 报名待审核，不能报名！');
          return
        }

        if (this.noticeStatus == 4) {
          Toast.fail('审核已通过，不能报名！');
          return
        }
        this.show = true;
      },

      register() { // 确认按钮
        this.formData = this.$refs.address.getValues();
        let params = {
          id: this.requestVo.id,
          unifiedRfqNum: this.requestVo.unifiedRfqNum,
          status: this.noticeStatus,
          loginOrgType:'2',
          ...this.formData
        };
        http.post(urls.preauditSupplierAdd, params).then(res => {
          let obj =JSON.parse(res.obj);
          if (obj.status == '20') {
            Toast.success(obj.message);
            this.show = false;
          }else{
            Toast.fail(obj.message);
          }

        }).catch(err => {

        })

      },

      afterRead(item) { // 图片上传
      },

      onLoad() { // 滚动加载
        this.pageIndex += 1;
        this.getMat();
      },

      getDetails() {
        this.isLoding = true;
        http.get(urls.interfaceDetail, { // 查询采购公告详情
          id: this.$route.query.id
        }).then(res => {
          this.isLoding = false;
          if (res.success) {
            this.details = res.obj.rows.summaryInfo || {};
            this.contactsVo = res.obj.rows.summaryInfo.contactsVo || {};
            this.rfqRulesVo = res.obj.rows.summaryInfo.rfqRulesVo || {};
            this.requestVo = res.obj.rows.summaryInfo.requestVo || {};
            this.preauditVo = res.obj.rows.summaryInfo.preauditVo || {};
            this.querySupplierStatus(this.requestVo.unifiedRfqNum);
            if (this.details.rfqAttachments != undefined) {
              this.rfqAttachments = this.purchase.rfqAttachments;
            }
            this.ruleHTML = res.obj.rows.summaryInfo.requestVo.requestBusiTerms;

          } else {
            Toast.fail(res.msg);
          }
        }).catch(err => {
          this.isLoding = false;
        });
      },

      getMat() { //查询物料明细
        this.matLoding = true;
        http.get(urls.material, {
          id: this.$route.query.id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        }).then(res => {
          this.matLoding = false;
          if (res.success) {
            this.loading = false;
            let list = res.obj && res.obj.rows || [];
            this.matDetailed = this.matDetailed.concat(list);
            if (!res.obj.rows) {
              this.finished = true;
            }
          } else {
            Toast.fail(res.msg);
          }
        }).catch(err => {
          this.matLoding = false;

        });
      },
      querySupplierStatus(id) {
        http.get(urls.querySupplierStatus, {
          unifiedRfqNum: id
        }).then(res => {
          if (res.success) {
            this.disable = false;
            if (res.obj.length > 0) {
              this.noticeStatus = res.obj[0].status;
              res.obj[0].status == 1 && (this.noticeStatus = 4);
            } else {
              this.noticeStatus = '01';
            }
          }

        }).catch(err => {

        })
      }
    },
    mounted() {
      this.getDetails();
      this.getMat();
      // window.addEventListener('scroll', this.onLoad);


    },
    destroyed() {
      // window.removeEventListener('scroll', this.onLoad)
    },
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';

  main {
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .block {
      width: 325px;
      background-color: #fff;
      padding: 0 10px;
      border-radius: 5px;
      @include center;
      top: 40%;
      /deep/ .van-button--block {
        margin: 0 auto;
        @include wh(260px, 45px);
      }
    }

    background-color: #F5F5F5;
    padding: 0 20px 70px;
    section {
      box-sizing: border-box;
      padding: 1px 5px 1px 18px;
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
    }
    /deep/ .van-button--block {
      border-radius: 4px;
    }
    p.typeP {
      padding-top: 5px;
      border-top: 1px solid #898989;
      &:first-of-type {
        border: none;
      }
    }
  }

  .bButton {
    width: 335px;
    position: fixed;
    bottom: 0;
  }


</style>
