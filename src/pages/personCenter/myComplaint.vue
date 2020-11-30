<template>
  <div class="myComplaint textLeft">
    <page-nav :title="'投诉建议'"></page-nav>
    <main @touchmove.prevent>
      <!--<div><img width="40px" src="../../assets/wgts.png" alt=""></div>-->
      <div>
        <h4>威高集团电子商务平台</h4>
        <h4>投诉书</h4>
      </div>
      <div class="text">
        <h4>尊敬的商务平台用户：</h4>
        <p>您好！</p>
        <p>为维护供应商权益，强化集团电子商务平台监督机制，提高平台的服务质量，保证平台健康发展，特开设供应商及集团内部用户投诉反馈窗口。
          威高集团电子商务平台用户、合作伙伴等均可以通过本窗口对电子商务平台体验、过程合规、服务响应以员工作违规等行为进行投诉。</p>
        <p>投诉信息由采购公司专人负责查看受理，投诉人信息将被严格保密。</p>
        <p>为了能够及时准确处理投诉，请投诉人将投诉事项的时间、地点、涉及的人员或部门、事情缘由、是否需要回复等信息描述清楚完整并上传。</p>
        <p>您还可以通过拨打电子商务平台投诉热线：0631-5717169进行投诉；</p>
        <p>另外，关于公平性及违规行为的检举举报，请登录威高集团监察平台进行投诉举报：http://www.iewego.com/qiye/index.html</p>
      </div>
      <p style="text-indent:0">基本资料填写（实名投诉需填写以下内容）</p>
      <div class="form">
        <van-form @submit="register" ref="complaint">
          <template v-for="item in fromData">
            <template v-if="item.type == 'text'">
              <van-field
                center
                scroll-to-error
                :required="item.required"
                :error="false"
                :name="item.eName"
                :label="item.cName"
                v-model="item.value"
                :placeholder="item.placeholder"
                :rules="item.rule"
                colon
              >
              </van-field>
            </template>

            <template v-if=" (item.type == 'radio1') && isRadio ">
              <van-field
                colon
                scroll-to-error
                :name="item.eName"
                :label="item.cName"
                :rules="item.rule"
                :required="item.required">
                <template #input>
                  <van-radio-group v-model="item.value" direction="horizontal">
                    <van-radio :key="data.name" v-for="data in item.values" :name="data.value">{{data.name}}</van-radio>
                  </van-radio-group>
                </template>
              </van-field>
            </template>

            <template v-if="item.type == 'radio' ">
              <van-field
                colon
                scroll-to-error
                :name="item.eName"
                :label="item.cName"
                :rules="item.rule"
                :required="item.required">
                <template #input>
                  <van-radio-group @change="cRadio(item.eName,item.value)" v-model="item.value" direction="horizontal">
                    <van-radio :key="data.name" v-for="data in item.values" :name="data.value">{{data.name}}</van-radio>
                  </van-radio-group>
                </template>
              </van-field>
            </template>


            <template v-if="item.type == 'textarea'">

              <van-field
                colon
                scroll-to-error
                :required="item.required"
                :error="false"
                :name="item.eName"
                :label="item.cName"
                v-model="item.value"
                :placeholder="item.placeholder"
                :rules="item.rule"
                rows="4"
                type="textarea"

              >
              </van-field>
              <div class="Tips">
                <h5 class="red"> 注意事项：</h5>
                <p>
                  被举报人（单位）信息：姓名、单位、职务信息需要填写完整。尽量做到一封投诉材料只反映一位被举报人问题。 反映的主要问题：分段书写每个涉嫌事实；内容尽量涵盖时间、地点、涉及人员、涉及主要证据等信息。
                </p>
              </div>

            </template>

          </template>


          <div style="margin-top: 36px">
            <van-button color="#171060" block type="info" native-type="submit">
              提交
            </van-button>
          </div>
        </van-form>
      </div>


    </main>
  </div>
</template>

<script>
  import pageNav from '../../components/pageNav'
  import {Form, Button, Toast, RadioGroup, Radio, Field, Uploader} from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';

  export default {
    name: "myComplaint",
    components: {
      pageNav,
      Toast,
      [Form.name]: Form,
      [Button.name]: Button,
      [Field.name]: Field,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Uploader.name]: Uploader,
    },
    data() {
      return {
        fromData: [
          {
            required: true,
            cName: '身份类型',
            eName: 'role',
            type: 'radio',
            values: [{name: '威高集团内部', value: '0'}, {name: '威高集团供应商', value: '1'}],
            rule: [{required: true, message: '请选择身份类型'}]
          },
          {
            required: true,
            cName: '投诉人是否是威高员工',
            eName: 'suggestIsWg',
            type: 'radio1',
            values: [{name: '是（需要填写投诉人工号）', value: '0'}, {name: '否（不需要填写投诉人工号）', value: '1'}],
            rule: [{required: true, message: '请选择投诉人身份类型'}]
          },

          {
            required: true,
            cName: '投诉人姓名',
            eName: 'suggestName',
            type: 'text',
            value: '',
            placeholder: '请输入投诉人姓名',
            rule: [{required: true, message: '请输入投诉人姓名'}]
          },
          {
            required: false,
            cName: '投诉人工号',
            eName: 'suggestJobNo',
            type: 'text',
            value: '',
            placeholder: '请输入投诉人工号',
            rule: [{required: false, message: '请输入投诉人工号'}]
          },

          {
            required: true,
            cName: '投诉人联系方式',
            eName: 'suggestPhone',
            type: 'text',
            value: '',
            placeholder: '请输入投诉人联系方式',
            rule: [{required: true, message: '请输入投诉人联系方式'}]
          },

          {
            required: true,
            cName: '投诉人身份证号',
            eName: 'suggestNumber',
            type: 'text',
            value: '',
            placeholder: '请输入投诉人身份证号',
            rule: [{required: true, message: '请输入投诉人身份证号'}]
          },

          {
            required: true,
            cName: '被投诉人是否是威高员工',
            eName: 'recSuggestIsWg',
            type: 'radio',
            values: [{name: '是（需要填写被投诉人工号）', value: '0'}, {name: '否（不需要填写被投诉人工号）', value: '1'}],
            rule: [{required: true, message: '请选择被投诉人身份类型'}]
          },

          {
            required: true,
            cName: '被投诉人姓名',
            eName: 'recSuggestName',
            type: 'text',
            value: '',
            placeholder: '请输入被投诉人姓名',
            rule: [{required: true, message: '请输入被投诉人姓名'}]
          },
          {
            required: false,
            cName: '被投诉人工号',
            eName: 'recSuggestJobNo',
            type: 'text',
            value: '',
            placeholder: '请输入被投诉人工号',
            rule: [{required: false, message: '请输入被投诉人工号'}]
          },

          {
            required: true,
            cName: '被投诉人联系方式',
            eName: 'recSuggestPhone',
            type: 'text',
            value: '',
            placeholder: '请输入被投诉人联系方式',
            rule: [{required: true, message: '请输入被投诉人联系方式'}]
          },

          {
            required: true,
            cName: '被投诉人所在公司或部门',
            eName: 'recSuggestCompany',
            type: 'text',
            value: '',
            placeholder: '请输入被投诉人所在公司或部门',
            rule: [{required: true, message: '请输入被投诉人所在公司或部门'}]
          },

          {
            required: true,
            cName: '投诉正文',
            eName: 'responseDesc',
            type: 'textarea',
            value: '',
            placeholder: '请输入投诉正文',
            rule: [{required: true, message: '请输入投诉正文'}]
          },
        ],
        isRadio: false,
      }
    },
    methods: {

      cRadio(ev, value) {
        if (ev == 'role' && value == '0') {
          this.isRadio = true;
        } else if (ev == 'role' && value == '1') {
          this.isRadio = false
        }
      },
      register() { // 提交
        let formData = this.$refs.complaint.getValues();
        if (formData.suggestIsWg && formData.suggestIsWg == '0' && !formData.suggestJobNo) {
          Toast.fail('请填写投诉人工号');
          return
        }
        if (formData.recSuggestIsWg && formData.recSuggestIsWg == '0' && !formData.recSuggestJobNo) {
          Toast.fail('请填写被投诉人工号');
          return
        }

        http.post(urls.addWgSuggestLog, formData).then(res => {
          Toast.success(res.msg)

        }).catch(err => {

        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .myComplaint {
    background-color: #f5f5f5;
    main {
      /*-webkit-box-sizing: border-box;*/
      /*-moz-box-sizing: border-box;*/
      box-sizing: border-box;
      background-color: #f5f5f5;
      padding: 0 10px 30px;
      > div {
        &:first-of-type {
          text-align: center;
        }
        color: #353535;
      }
      h4, h5 {
        margin: 5px 0;
      }
      p {
        text-indent: 2em;
        margin: 7px 0;
        line-height: 25px;
      }
      .van-radio {
        margin: 5px 8px 0 0;
      }
      .red {
        color: red;
      }
      .van-cell {
        background-color: #f5f5f5;
      }
      .Tips {
        p {
          font-size: 14px;
        }
      }
    }
  }


</style>
