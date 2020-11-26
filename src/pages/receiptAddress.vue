<template>
  <div class="receiptAddress">
    <page-nav :title="title"></page-nav>
    <main>
      <template v-if="isLoding">
        <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
      </template>
      <template v-else>
        <template v-if="addressData.length > 0">
          <van-list
            offset="150"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <section @click.stop="chooseAddress(item)" v-for="item in addressData" :key="item.id">
              <p>{{item.consignee}} {{item.mobile}}
              </p>
              <p>{{item.province}} {{item.city}} {{item.area}} {{item.street}} {{item.detailAddress}}</p>
              <div>
                <p v-if="item.isDefault == '1'">
                  <van-icon name="passed"/>
                  已设为默认
                </p>
                <p>
                  <span @click.stop="Overlay(item)">修改</span>
                  <span @click.stop="deleteArea(item)">删除</span>
                </p>
              </div>
            </section>
          </van-list>
        </template>
        <template v-else>
          <van-empty description="暂无数据"/>
        </template>
      </template>
      <van-button type="primary" @click.stop="addAddress" block>新增地址</van-button>
    </main>

    <van-overlay :show="show" @click.stop="show = false">
      <div @click.stop class="block">
        <p>{{modelTitle}}</p>
        <van-form @submit="register" ref="address">
          <van-field
            v-model="signInData.consignee"
            name="consignee"
            required
            label="收货人"
            :colon="colon"
            placeholder="请输入收货人姓名"
            :error="false"
            :rules="[{ required: true, message: '请输入收货人姓名' }]"
          />
          <van-field
            v-model="signInData.mobile"
            type="text"
            name="mobile"
            label="手机号码"
            :colon="colon"
            required
            :error="false"
            placeholder="请输入手机号码"
            :rules="[{ required: true, message: '请输入收货人手机号码' }]"
          />

          <van-field
            v-model="signInData.phone"
            type="text"
            name="phone"
            label="固定电话"
            :colon="colon"
            :error="false"
            placeholder="请输入固定电话"
          />

          <van-field
            readonly
            :colon="colon"
            clickable
            name="address"
            :value="signInData.address"
            label="所在地区"
            required
            :error="false"
            placeholder="点击选择省市区乡"
            @click="showArea = true"
            :rules="[{ required: true, message: '请选择省市区乡' }]"
          />
          <van-popup v-model="showArea" position="bottom">
            <van-picker
              show-toolbar
              title="请选择地区"
              value-key="areaName"
              :columns="areaList"
              @change="change"
              @cancel="showArea = false"
              @confirm="onConfirm"
            />
          </van-popup>
          <van-field
            v-model="signInData.detailAddress"
            type="text"
            name="detailAddress"
            label="详细地址"
            :colon="colon"
            required
            :error="false"
            placeholder="请输入收货人详细地址"
            :rules="[{ required: true, message: '请输入收货人详细地址' }]"
          />

          <van-field :colon="colon" name="isDefault" label="是否设为默认">
            <template #input>
              <van-switch v-model="signInData.isDefault" size="20"/>
            </template>
          </van-field>

          <div style="margin: 16px 0">
            <van-button color="#171060" block type="info" native-type="submit">
              {{buttonText}}
            </van-button>
          </div>
        </van-form>
      </div>
    </van-overlay>
  </div>
</template>

<script>
  import pageNav from '../components/pageNav'
  import addressDetails from '../components/addressDetails'
  import {
    Icon,
    List,
    Button,
    Area,
    Overlay,
    Loading,
    Popup,
    Empty,
    Form,
    Toast,
    Field,
    AddressEdit,
    Switch,
    Picker
  } from 'vant';
  import http from '../utils/http';
  import urls from '../utils/urls';
  import {setSessionStorage, deepCopy} from "../config/Utils";

  export default {
    name: "receiptAddress",
    components: {
      pageNav,
      addressDetails,
      [List.name]: List,
      [Icon.name]: Icon,
      [Loading.name]: Loading,
      [Button.name]: Button,
      [Overlay.name]: Overlay,
      [Form.name]: Form,
      [Empty.name]: Empty,
      [Field.name]: Field,
      [AddressEdit.name]: AddressEdit,
      [Popup.name]: Popup,
      [Area.name]: Area,
      [Switch.name]: Switch,
      [Picker.name]: Picker,
      [Toast.name]: Toast,

    },
    data() {
      return {
        formData: {},// 表单数据
        addressData: [], // 收货地址
        title: '收货地址',
        buttonText: "确认添加",
        show: false, // 弹框显示
        colon: true, // 是否显示冒号
        signInData: {
          consignee: '',  // 收货人
          mobile: '', // 固定电话
          phone: '', // 手机号码
          detailAddress: '', //详细地址
          address: '',
          isDefault: false, // 是否默认
        },
        updateId: '',// 修改的id
        province: "",
        city: "",
        area: "",
        street: "",
        provinceCode: "",
        cityCode: "",
        areaCode: "",
        streetCode: "",
        areaList: [{values: [], defaultIndex: 0}, {values: [], defaultIndex: 0}, {
          values: [],
          defaultIndex: 0
        }, {values: [], defaultIndex: 0}],        //自定义数据三级结构
        value: '',
        state: "",
        showArea: false, // 控制是否显示地址选择框
        modelTitle: '', // 弹框标题
        isLoding: false,//整个页面加载
        loading: false,//数据滚动加载
        finished: false,//全部加载完成
        page: 1
      }
    },
    methods: {
      onLoad() { //滚动加载
        this.page += 1;
        this.getAddress();
      },
      change(picker, values, index) { // 省市区选择改变
        switch (index) {
          case 0://选择省
            this.areaList[1].values = [];//市清空
            this.areaList[2].values = [];//区清空
            this.areaList[3].values = [];//乡清空
            break;
          case 1://选择市
            this.areaList[2].values = [];//区清空
            this.areaList[3].values = [];//乡清空
            break;
          case 2://选择区
            this.areaList[3].values = [];//乡清空
            break
        }
        if (index < 3) { // 3为乡
          this.getArea(index + 2, values[index].areaCode);                        //传参 参数为上层选择的地区的code
        }
      },

      onConfirm(values) { // 选择地址确认
        if (!(values[2] && values[2].areaCode)) {
          return
        }
        this.province = "";
        this.city = "";
        this.area = "";
        this.street = "";
        this.provinceCode = "";
        this.cityCode = "";
        this.areaCode = "";
        this.streetCode = "";
        let arr = [];
        values.forEach((item, index) => {
          if (item && item.areaCode) {
            arr.push(item.areaName);
          }
          this.signInData.address = arr.join('/');
          if (values[0]) { // 给省市区乡赋值
            this.province = values[0].areaName;
            this.provinceCode = values[0].areaCode
          }
          if (values[1]) {
            this.city = values[1].areaName;
            this.cityCode = values[1].areaCode
          }
          if (values[2]) {
            this.area = values[2].areaName;
            this.areaCode = values[2].areaCode
          }
          if (values[3]) {

            if (values[3].areaName == "请选择乡") {
              this.street = '';
              this.streetCode = '';
              return
            }
            this.street = values[3].areaName;
            this.streetCode = values[3].areaCode
          }
        });
        this.showArea = false;
      },

      getAddress() { // 查询地址
        this.finished = false;
        http.post(urls.loadConsignee, {page: this.page, rows: 6}).then(res => {
          this.isLoding = false;
          if (res.success) { // 地址滚动加载
            let list = res.obj && res.obj.rows || [];
            this.addressData = this.addressData.concat(list);
            this.loading = false;
            if (res.obj.records == this.addressData.length) {
              this.finished = true;
            }
          } else {
            Toast.fail(res.msg)
          }
        }).catch(err => {

        })
      },
      addAddress() { // 新增收货地址
        this.areaList.forEach(item => {
          item.defaultIndex = 0
        });
        this.show = true;
        this.state = "add";
        this.updateId = "";
        for (let key in this.signInData) {
          this.signInData[key] = ''
        }
        this.modelTitle = '新增收货地址';
        this.buttonText = "确认添加"
      },

      Overlay(data) { // 修改收货地址
        this.signInData = deepCopy(data);
        if (this.signInData.isDefault == 1) {
          this.signInData.isDefault = true;
        } else {
          this.signInData.isDefault = false;
        }
        this.updateId = this.signInData.id;
        this.province = this.signInData.province;
        this.city = this.signInData.city;
        this.area = this.signInData.area;
        this.street = this.signInData.street;
        this.provinceCode = this.signInData.provinceCode;
        this.cityCode = this.signInData.cityCode;
        this.areaCode = this.signInData.areaCode;
        this.streetCode = this.signInData.streetCode;
        this.signInData.address = `${this.signInData.province}/${this.signInData.city}/${this.signInData.area}/${this.signInData.street}`;
        this.areaList[0].values.forEach((item, index) => {
          if (item.areaCode == this.signInData.provinceCode) {
            this.areaList[0].defaultIndex = index;
            this.getArea(2, item.areaCode);     //传参 参数为上层选择的地区的code
          }
        });
        this.state = "update";
        this.show = true;
        this.modelTitle = '修改收货地址';
        this.buttonText = "确认修改"
      },

      register() { // 确认按钮
        this.formData = this.$refs.address.getValues();
        console.log(this.formData);
        if (this.formData.isDefault) {
          this.formData.isDefault = "1"
        } else {
          this.formData.isDefault = "0"
        }
        this.addDetails();
      },
      addDetails() { // 新增地址
        let params = {
          ...this.formData,
          province: this.province,
          city: this.city,
          area: this.area,
          street: this.street,
          provinceCode: this.provinceCode,
          cityCode: this.cityCode,
          areaCode: this.areaCode,
          streetCode: this.streetCode,
        };
        let url = "";
        this.state == "add" && (url = urls.addAddress);
        if (this.state == "update") {
          url = urls.editConsignee;
          params.id = this.updateId
        }
        http.post(url, params).then(res => {
          if (res.success) {
            this.addressData = [];// 重置地址
            this.page = 1;
            this.show = false;
            this.getAddress()
          } else {
            Toast.fail(res.msg)
          }
        }).catch(err => {

        })
      },

      deleteArea(data) { //删除
        http.get(urls.updateConsignee, {strIds: data.id}).then(res => {
          if (res.success) {
            this.page = 1;
            this.addressData = [];// 重置地址
            this.getAddress()
          } else {
            Toast.fail(res.msg)
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
              // if (this.state == "update") {
              // this.areaList[1].values.forEach((item, index) => {
              //   if (item.areaCode == this.signInData.cityCode) {
              //     this.areaList[1].defaultIndex = index;
              //     this.getArea(3, item.areaCode);  //传参 参数为上层选择的地区的code
              //   }
              // });
              // }
              break;
            case 3: // 区
              this.areaList[2].values = [
                {areaName: '请选择区/县'},
                ...res
              ];
              // if (this.state == "update") {
              //   this.areaList[2].values.forEach((item, index) => {
              //     if (item.areaCode == this.signInData.areaCode) {
              //       this.areaList[2].defaultIndex = index;
              //       this.getArea(4, item.areaCode);                        //传参 参数为上层选择的地区的code
              //     }
              //   });
              // }
              break;
            case 4: // 乡
              this.areaList[3].values = [
                {areaName: '请选择乡'},
                ...res
              ];
              // if (this.state == "update") {
              //   this.areaList[3].values.forEach((item, index) => {
              //     if (item.areaCode == this.signInData.streetCode) {
              //       this.areaList[3].defaultIndex = index;
              //     }
              //   });
              // }
              break;
          }
        }).catch(err => {

        })
      },
      chooseAddress(data) {
        console.log(this.$route.query.form);
        if (this.$route.query.form == 'orderConfirm') {
          setSessionStorage('address', data);
          this.$router.go(-1);
        }
      }
    },
    mounted() {
      console.log(this.$route.query.form);
      this.isLoding = true;
      this.getAddress();
      this.getArea(1, "")
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';

  .receiptAddress {
    background: #F5F5F5;
    main {
      background: #F5F5F5;
      padding-bottom: 10px;
      > /deep/ .van-button--block {
        @include wh(335px, 46px);
        margin: 20px auto;
        background: rgba(16, 15, 101, 1);
        border-radius: 5px;
        border: none;
      }
    }
  }

  /deep/ .van-cell__title {
    text-align: left;
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

  section {
    margin-bottom: 10px;
    p {
      margin: 10px 0;
    }
    padding: 1px 20px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 1);
    font-weight: 500;
    @include sc(14px, rgba(83, 83, 83, 1));
    text-align: left;
    div {
      display: flex;
      font-size: 12px;
      p {
        flex: 1;
        color: #E44A4A;
        margin: 10px 0;
        &:last-child {
          text-align: right;
          span {
            margin-right: 10px;
            &:first-child {
              color: #878787;
            }
          }
        }
        .van-icon {
          top: 2px;
        }
      }
    }
  }

</style>
