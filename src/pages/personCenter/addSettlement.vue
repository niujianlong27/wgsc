<template>
  <div class="addSettlement">
    <page-nav :title="title"></page-nav>
    <main>
      <section>
        <van-form @submit="onSubmit1" ref="form1">
          <van-field
            @input="onBlur"
            v-model="statementName"
            required
            name="statementName"
            label="结算中心名称"
            placeholder="请输入"
            :error="false"
            :rules="[{ required: true, message: '请输入结算中心名称'}]"
          />

          <van-field name="invoiceType" required label="发票类型">
            <template #input>
              <van-radio-group v-model="invoiceType" direction="horizontal">
                <van-radio name="01">普通发票</van-radio>
                <van-radio name="02">增值税发票</van-radio>
              </van-radio-group>
            </template>
          </van-field>

        </van-form>
      </section>

      <section>
        <h4><span></span> 编辑抬头</h4>
        <van-form @submit="onSubmit2" ref="form2">
          <template v-for="item in formData">
            <template v-if="item.type == 'select'">
              <van-field
                readonly
                clickable
                :name="item.eName"
                v-model="item.value"
                :label="item.cName"
                placeholder="请选择"
                @click="item.showPicker = true"
                :error="false"
                :rules="item.rule"
                :required="item.required"
              />
              <van-popup v-model="item.showPicker" position="bottom">
                <van-picker
                  show-toolbar
                  :title="item.title"
                  :value-key="item.key"
                  :columns="item.columns"
                  @change="change"
                  @cancel="item.showPicker = false"
                  @confirm="pickConfirm($event,item)"
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
                :required="item.required"
                :error="false"
                :rules="item.rule"

              />
            </template>
          </template>
        </van-form>
      </section>
      <div style="margin: 40px auto 0;width: 90%">
        <van-button color="#171060" block type="info" @click="createFrom" native-type="submit">
          确认创建
        </van-button>
      </div>
    </main>

  </div>

</template>

<script>
  import pageNav from '../../components/pageNav'
  import {Form, Field, RadioGroup, Radio, Toast, Calendar, Picker, Popup, Button} from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';

  export default {
    name: "addSettlement",
    components: {
      pageNav,
      [Form.name]: Form,
      [Field.name]: Field,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Calendar.name]: Calendar,
      [Picker.name]: Picker,
      [Popup.name]: Popup,
      [Button.name]: Button,
      [Toast.name]: Toast,
    },
    data() {
      return {
        id: '',
        invoiceId: '',
        state: '',//新增或修改状态
        formTrue1: false,//表单验证通过
        formData1: {},//表单1
        formData2: {},//表单2
        title: '添加结算中心',
        statementName: "", // 结算中心标题
        invoiceType: '01', // 发票类型单选
        province: "",//所在地区省市区
        city: "",//所在地 区省市区
        area: "",//所在地区省市区
        provinceCode: "",//所在地区省市区
        cityCode: "",//所在地区省市区
        areaCode: "",//所在地区省市区

        areaList: [],// 所在地区集合
        bankNameList: [],// 银行名称集合
        bankAreaList: [],// 银行地区集合

        bankProvince: "",//银行地区省市区
        bankCity: "",//银行地区省市区
        bankArea: "",//银行地区省市区
        bankProvinceCode: "",//银行地区省市区
        bankCityCode: "",//银行地区省市区
        bankAreaCode: "",//银行地区省市区
        formData: [
          {
            required: true,
            cName: '单位名称',
            eName: 'unitName',
            type: 'text',
            value: '',
            rule: [{required: true, message: '请填写单位名称'}, {
              pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
              message: '内容不能包含空格及特殊字符'
            }]
          },
          {
            required: true,
            cName: '纳税人识别号',
            eName: 'taxpayerNum',
            type: 'text',
            value: '',
            rule: [{required: true, message: '请填写纳税人识别号'}, {pattern: /^[0-9a-zA-Z]*$/, message: '内容不能包含空格及特殊字符'}]
          },
          {
            required: true,
            cName: '注册地址',
            eName: 'regAddress',
            type: 'text',
            value: '',
            rule: [{required: true, message: '请填写注册地址'}, {
              pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
              message: '内容不能包含空格及特殊字符'
            }]
          },
          {
            required: true,
            cName: '注册电话',
            eName: 'regTele',
            type: 'text',
            value: '',
            rule: [{required: true, message: '请填写注册电话'}]
          },
          {
            required: true,
            cName: '开户银行',
            eName: 'openBank',
            type: 'text',
            value: '',
            rule: [{required: true, message: '请填写开户银行'}, {
              pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
              message: '内容不能包含空格及特殊字符'
            }]
          },
          {
            required: true,
            cName: '银行账号',
            eName: 'bankAccount',
            type: 'text',
            value: '',
            rule: [{required: true, message: '请填写银行账号'}, {pattern: /^[0-9]+$/, message: '请填写正确的银行账号'}]
          },
          {
            required: true,
            cName: '银行名称',
            eName: 'bankName',
            title: '请选择银行名称',
            type: 'select',
            key: 'colValue',
            columns: [{values: []}],
            showPicker: false,
            value: '',
            rule: [{required: true, message: '请选择银行'}]
          },
          {
            required: true,
            cName: '银行所在地区',
            eName: 'bankAreaName',
            title: '请选择银行所在地区',
            type: 'select',
            key: 'name',
            columns: [{values: []}, {values: []}, {values: []}],
            showPicker: false,
            value: "",
            rule: [{required: true, message: '请选择银行所在地区'}]
          },
          {
            required: true,
            cName: '银行所在地址',
            eName: 'bankAddress',
            type: 'text',
            value: '',
            rule: [{required: true, message: '请填写银行所在地址'}, {
              pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]*$/,
              message: '内容不能包含空格及特殊字符'
            }]
          },
          {
            required: true,
            cName: '收票人',
            eName: 'manufacturer',
            type: 'text',
            value: '',
            rule: [{required: true, message: '请填写收票人'}, {
              pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]*$/,
              message: '内容不能包含空格及特殊字符'
            }]
          },
          {cName: '邮编', eName: 'zipCode', type: 'text', value: ''},
          {
            required: true,
            cName: '手机号码',
            eName: 'mobile',
            type: 'text',
            value: '',
            rule: [{required: true, message: '请填写注册电话'}, {pattern: /^[0-9]{11}$/, message: '请输入正确的注册电话'}]
          },
          {cName: '固定电话', eName: 'phone', type: 'text', value: ''},
          {
            required: true,
            cName: '所在地区',
            eName: 'manuArea',
            title: '请选择所在地区',
            type: 'select', value: '',
            key: 'areaName',
            columns: [{values: []}, {values: []}, {values: []}],
            showPicker: false,
            rule: [{required: true, message: '请选择所在地区'}]
          },
          {required: true,cName: '详细地址', eName: 'detailAddress', type: 'text', value: '',rule: [{required: true, message: '请输入详细地址'}]},

        ],
      }
    },
    methods: {
      getBank() {  // 查询银行名称
        http.post(urls.getBankName, {}).then(res => {
          this.bankNameList[0].values = [
            ...res
          ];
        }).catch(err => {

        })
      },
      getBankArea(level, code) {
        http.post(urls.queryAreaInfo, {code: code}).then(res => {
          switch (level) {
            case 1: //省
              this.bankAreaList[0].values = [
                {name: '请选择省'},
                ...res
              ];
              break;
            case 2: // 市
              this.bankAreaList[1].values = [
                {name: '请选择市'},
                ...res
              ];
              break;
            case 3: // 区
              this.bankAreaList[2].values = [
                {name: '请选择区/县'},
                ...res
              ];
              break;
          }
        }).catch(err => {

        })
      },
      getArea(level, code) { // 查询省市区乡
        http.post(urls.queryArea, {areaLevel: level, areaFid: code}).then(res => {
          switch (level) {
            case 1: //省
              this.areaList[0].values = [
                {areaName: '请选择省'},
                ...res
              ];
              break;
            case 2: // 市
              this.areaList[1].values = [
                {areaName: '请选择市'},
                ...res
              ];
              break;
            case 3: // 区
              this.areaList[2].values = [
                {areaName: '请选择区/县'},
                ...res
              ];
              break;
          }
        }).catch(err => {

        })
      },
      onBlur() {
        this.$refs.form1.submit(); // 触发onSubmit
      },
      change(picker, values, index) { // 选择改变
        if (picker.title == "请选择所在地区") {
          switch (index) {
            case 0://选择省
              this.areaList[1].values = [];//市清空
              this.areaList[2].values = [];//区清空
              break;
            case 1://选择市
              this.areaList[2].values = [];//区清空
              break;
          }
          if (index < 2) { // 3为乡
            this.getArea(index + 2, values[index].areaCode);                        //传参 参数为上层选择的地区的code
          }
        }
        if (picker.title == "请选择银行所在地区") {
          switch (index) {
            case 0://选择省
              this.bankAreaList[1].values = [];//市清空
              this.bankAreaList[2].values = [];//区清空
              break;
            case 1://选择市
              this.bankAreaList[2].values = [];//区清空
              break;
          }
          if (index < 2) { // 3为乡
            this.getBankArea(index + 2, values[index].code);                        //传参 参数为上层选择的地区的code
          }
        }

      },

      onConfirm(value, item) { // 时间选择
        item.showPicker = false;
        if (item.type === 'date') {
          item.value = `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`;
          return
        }
        item.value = value;
      },

      pickConfirm(value, item) { // 选择框确定按钮
        item.showPicker = false;
        if (item.eName == 'manuArea') { // 所在地区选项
          if (!(value[2] && value[2].areaCode)) {
            return
          }
          this.province = "";
          this.city = "";
          this.area = "";
          this.provinceCode = "";
          this.cityCode = "";
          this.areaCode = "";

          let arr = [];
          value.forEach((e, index) => {
            if (e && e.areaCode) {
              arr.push(e.areaName);
            }
            item.value = arr.join('/');
            if (value[0]) {
              this.province = value[0].areaName;
              this.provinceCode = value[0].areaCode
            }
            if (value[1]) {
              this.city = value[1].areaName;
              this.cityCode = value[1].areaCode
            }
            if (value[2]) {
              this.area = value[2].areaName;
              this.areaCode = value[2].areaCode
            }
          });
        }
        if (item.eName == 'bankName') {  // 银行名称
          item.value = value[0].colValue
        }
        if (item.eName == 'bankAreaName') { // 所在银行地区选项
          if (!(value[2] && value[2].code)) {
            return
          }
          this.bankProvince = "";
          this.bankCity = "";
          this.bankArea = "";
          this.bankProvinceCode = "";
          this.bankCityCode = "";
          this.bankAreaCode = "";
          let arr = [];
          value.forEach((e, index) => {
            if (e && e.code) {
              arr.push(e.name);
            }
            item.value = arr.join('/');
            if (value[0]) {
              this.bankProvince = value[0].name;
              this.bankProvinceCode = value[0].code
            }
            if (value[1]) {
              this.bankCity = value[1].name;
              this.bankCityCode = value[1].code
            }
            if (value[2]) {
              this.bankArea = value[2].name;
              this.bankAreaCode = value[2].code
            }
          });
        }
      },
      onSubmit1() { //表单1
        this.formData1 = this.$refs.form1.getValues();
        this.formTrue1 = true;
      },
      createFrom() { // 提交表单
        this.$refs.form1.submit(); // 触发onSubmit
        this.$refs.form2.submit(); // 触发onSubmit
      },
      onSubmit2() { // 表单2 提交
        this.formData2 = this.$refs.form2.getValues();
        if (this.formTrue1) {
          let params = {};
          params = {
            id: this.id,
            invoiceId:this.invoiceId,
            ...this.formData1, ...this.formData2,
            province: this.province,
            city: this.city,
            area: this.area,
            provinceCode: this.provinceCode,
            cityCode: this.cityCode,
            areaCode: this.areaCode,
            bankProvince: this.bankProvince,
            bankCity: this.bankCity,
            bankArea: this.bankArea,
            bankProvinceCode: this.bankProvinceCode,
            bankCityCode: this.bankCityCode,
            bankAreaCode: this.bankAreaCode,
          };
          http.post(urls.copyStatementCenter, params).then(res => {
            if (res.success) {
              this.state == "update" &&  Toast.success('复制成功');
              this.state == "add" &&  Toast.success('新增成功');
              this.$router.go(-1)
            } else {
              Toast.fail("操作失败，请重试")
            }
          }).catch(err => {

          })
        }
      },

    },

    created() {
      this.state = this.$route.query.state;
      if (this.state == "update") {
        this.statementName = this.$route.query.data.center.statementName;
        this.invoiceType = this.$route.query.data.center.invoiceType;
        this.id = this.$route.query.data.center.id;
        this.invoiceId = this.$route.query.data.center.invoiceId;

        let obj = this.$route.query.data.invoice;
        this.provinceCode = obj.provinceCode;
        this.cityCode = obj.cityCode;
        this.areaCode = obj.areaCode;
        this.province = obj.province;
        this.city = obj.city;
        this.area = obj.area;
        this.bankProvince = obj.bankProvince;
        this.bankCity = obj.bankCity;
        this.bankArea = obj.bankArea;
        this.bankProvinceCode = obj.bankProvinceCode;
        this.bankCityCode = obj.bankCityCode;
        this.bankAreaCode = obj.bankAreaCode;

        this.formData.forEach(item => {
          for (var i in obj) {
            if (item.eName == i) {
              item.value = obj[i];
              return
            }
            if (item.eName == 'bankAreaName') {
              item.value = `${obj.bankProvince}/${obj.bankCity}/${obj.bankArea}`
            }
            if (item.eName == 'manuArea') {
              item.value = `${obj.province}/${obj.city}/${obj.area}`

            }
          }
        })

      }
      this.formData.forEach(item => {
        if (item.eName == 'manuArea') {
          this.areaList = item.columns
        }
        if (item.eName == 'bankName') {
          this.bankNameList = item.columns
        }
        if (item.eName == 'bankAreaName') {
          this.bankAreaList = item.columns
        }
      });
      this.getArea(1, "");
      this.getBank();
      this.getBankArea(1, "")
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  main {
    /deep/ .van-popup {
      height: 60%;
    }
    background-color: #F5F5F5;
    padding: 0 20px 50px;
  }

  section {
    box-sizing: border-box;
    padding: 1px 5px 1px 16px;
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
      padding: 10px 0 10px 13px;
    }
  }

</style>
