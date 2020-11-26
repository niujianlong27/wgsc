<template>
  <div class="reset">
    <div style="padding: 15px" class="textLeft">
      <span><van-icon @click.stop="toPath()" name="arrow-left" size="22" /></span>
    </div>
    <header>
      <img src="../assets/logo.png" alt="">
    </header>
    <main>
      <van-tabs color="#121314" :border="false" @change="tabChange" swipeable v-model="active">
        <van-tab title="公司会员">
          <section>
            <van-form @submit="onSubmit" ref="company">
              <van-field
                v-model="company.companyName"
                name="iphone"
                required
                left-icon="user-o"
                placeholder="公司名称"
                :error="false"
                :rules="[{ required: true, message: '请输公司名称' }]"
              />
              <van-field
                v-model="company.iphone"
                name="iphone"
                required
                left-icon="user-o"
                placeholder="手机号码"
                :error="false"
                :rules="[{ required: true, message: '请输入手机号码' }]"
              />
              <van-field
                v-model="company.code"
                name="code"
                required
                left-icon="user-o"
                placeholder="手机验证码"
                :error="false"
                :rules="[{ required: true, message: '请输入手机验证码' }]"
              />
              <van-field
                v-model="company.password"
                type="password"
                name="password"
                left-icon="coupon-o"
                required
                :error="false"
                :rules="companyRule.password"
                placeholder="密码"
              />
              <van-field
                v-model="company.checkPassword"
                required
                :error="false"
                type="password"
                name="checkPassword"
                left-icon="coupon-o"
                :error-message="errorMessageCom"
                :rules="companyRule.checkPassword"
                placeholder="确认密码"

              />
              <div style="margin: 16px 0">
                <van-button color="#171060" block type="info" native-type="submit">
                  确认修改
                </van-button>
              </div>
            </van-form>
          </section>

        </van-tab>


        <van-tab title="个人会员">
          <van-form @submit="onSubmit2" ref="personal">
            <van-field
              v-model="personal.iphone"
              name="iphone"
              required
              left-icon="user-o"
              placeholder="手机号码"
              :error="false"
              :rules="[{ required: true, message: '请输入手机号码' }]"
            />
            <van-field
              v-model="personal.code"
              name="code"
              required
              left-icon="user-o"
              placeholder="手机验证码"
              :error="false"
              :rules="[{ required: true, message: '请输入手机验证码' }]"
            />
            <van-field
              v-model="personal.password"
              type="password"
              name="password"
              left-icon="coupon-o"
              required
              :error="false"
              :rules="personalRule.password"
              placeholder="密码"
            />
            <van-field
              v-model="personal.checkPassword"
              required
              :error="false"
              type="password"
              name="checkPassword"
              left-icon="coupon-o"
              :error-message="errorMessagePer"
              :rules="personalRule.checkPassword"
              placeholder="确认密码"

            />
            <div style="margin: 16px 0">
              <van-button color="#171060" block type="info" native-type="submit">
                确认修改
              </van-button>
            </div>
          </van-form>

        </van-tab>
      </van-tabs>
    </main>
  </div>
</template>

<script>
  import {Tab, Icon, Tabs, Form, Field, Button} from 'vant';
  import http from '../utils/http';
  import urls from '../utils/urls';

  export default {
    name: "resetPassword",
    components: {
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Form.name]: Form,
      [Field.name]: Field,
      [Button.name]: Button,
      [Icon.name]: Icon,

    },
    data() {

      let validatePassCom = (value, rule) => {
        let formValue = this.$refs.company.getValues();
        if (value !== '') {
          if (formValue.checkPassword !== '') {
            this.$refs.company.validateField('checkPassword');
          }
        }
      };

      let validatePassCom2 = (value, rule) => {
        let formValue = this.$refs.company.getValues();
        if (value === '') {
          this.errorMessageCom = '请确认密码'
        } else if (value !== formValue.password) {
          this.errorMessageCom = '两次密码输入不一致，请重新输入';
        } else {
          this.errorMessageCom = '';
        }
      };


      let validatePassPer = (value, rule) => {
        let formValue = this.$refs.personal.getValues();
        if (value !== '') {
          if (formValue.checkPassword !== '') {
            this.$refs.personal.validateField('checkPassword');
          }
        }
      };

      let validatePassPer2 = (value, rule) => {
        let formValue = this.$refs.personal.getValues();
        if (value === '') {
          this.errorMessagePer = '请确认密码'
        } else if (value !== formValue.password) {
          this.errorMessagePer = '两次密码输入不一致，请重新输入';
        } else {
          this.errorMessagePer = '';
        }
      };
      return {
        active: 0,  // tab栏索引值
        errorMessageCom: '',  //公司会员错误提示信息
        errorMessagePer: '',  //个人会员错误提示信息
        company: { //公司会员表单
          companyName: '',
          iphone: '',
          code: '',
          password: '',
          checkPassword: '',
        },
        personal: { // 个人会员表单
          username: '',
          password: '',
          checkPassword: '',
          email: ''
        },
        companyRule: { //公司会员验证规则
          password: [{required: true, message: "请输入新密码", validator: validatePassCom}],
          checkPassword: [{required: true, message: "请确认新密码", validator: validatePassCom2}],
        },
        personalRule: { //个人会员验证规则
          password: [{required: true, message: "请输入新密码", validator: validatePassPer}],
          checkPassword: [{required: true, message: "请确认新密码", validator: validatePassPer2}],
        }
      }
    },
    methods: {

      toPath(){
        this.$router.push('/personCenter')
      },

      onSubmit(values) {
        console.log(values);
      },
      onSubmit2(values) {
        console.log(values);
      },
      tabChange() {
        for (let key in this.company) {
          this.company[key] = ''
        }
        for (let key in this.personal) {
          this.personal[key] = ''
        }
      },
    },
    mounted() {
      this.$nextTick(() => {
      })
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .reset {
    background-color: #ffffff;

    header {
      margin: 70px auto;
      @include wh(268px, 40px);
      img {
        @include wh(100%, 100%)
      }
    }
    main {
      padding: 0 40px;
      /deep/ .van-tabs__wrap {
        border-bottom: solid 1px rgba(232, 232, 232, 1);
        margin-bottom: 10px;
      }
      /deep/ .van-cell {
        padding: 16px;
      }
      /deep/ .van-tab {
        font-size: 16px;
      }
      .van-button--block {
        border-radius: 8px;
      }
      section {
        p {
          text-align: left;
          @include sw(500, #121314);
        }
      }
    }
  }
</style>
