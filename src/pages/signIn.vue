<template>
  <div class="signIn">
    <div style="padding: 15px" class="textLeft">
      <span><van-icon @click.stop="toPath('/home')" name="arrow-left" size="22"/></span>
    </div>
    <header>
      <img src="../assets/logo.png" alt="">
    </header>
    <main>
      <!--<van-tabs color="#121314" :border="false" @change="tabChange" swipeable v-model="active">-->
      <!--<van-tab title="登录">-->
      <section>
        <van-form @submit="onSubmit">
          <van-field
            v-model="loginData.userLoginNo"
            name="userLoginNo"
            required
            left-icon="user-o"
            placeholder="用户名"
            :error="false"
            :rules="[{ required: true, message: '请输入用户名' }]"
          />
          <van-field
            v-model="loginData.userLoginPsd"
            type="password"
            name="userLoginPsd"
            left-icon="coupon-o"
            required
            :error="false"
            placeholder="密码"
            :rules="[{ required: true, message: '请输入密码' }]"
          />
          <div style="margin: 16px 0">
            <van-button color="#171060" block type="info" native-type="submit">
              确认登录
            </van-button>
          </div>
        </van-form>
        <!--<p><span @click.stop="resetPassword">忘记密码?</span></p>-->
      </section>

      <p class="tiText">提示：未注册威购商城的用户请先在电脑打开www.iewego.com 完成注册</p>

      <!--</van-tab>-->


      <!--<van-tab title="注册">-->
      <!--<van-form @submit="register" v-model="signInData" ref="signIn">-->
      <!--<van-field-->
      <!--v-model="signInData.username"-->
      <!--name="userLoginNo"-->
      <!--required-->
      <!--left-icon="user-o"-->
      <!--placeholder="注册账号"-->
      <!--:error="false"-->
      <!--:rules="[{ required: true, message: '请输入注册账号' }]"-->
      <!--/>-->
      <!--<van-field-->
      <!--v-model="signInData.password"-->
      <!--type="password"-->
      <!--name="userLoginPsd"-->
      <!--left-icon="coupon-o"-->
      <!--required-->
      <!--:error="false"-->
      <!--:rules="signInRule.password"-->
      <!--placeholder="密码"-->
      <!--/>-->
      <!--<van-field-->
      <!--v-model="signInData.checkPassword"-->
      <!--required-->
      <!--:error="false"-->
      <!--type="password"-->
      <!--name="checkPassword"-->
      <!--left-icon="coupon-o"-->
      <!--:error-message="errorMessage"-->
      <!--:rules="signInRule.checkPassword"-->
      <!--placeholder="确认密码"-->

      <!--/>-->
      <!--<van-field-->
      <!--v-model="signInData.email"-->
      <!--type="email"-->
      <!--name="email"-->
      <!--left-icon="envelop-o"-->
      <!--required-->
      <!--:error="false"-->
      <!--placeholder="邮箱地址"-->
      <!--:rules="[{ required: true, message: '请输入邮箱地址' }]"-->
      <!--/>-->
      <!--<div style="margin: 16px 0">-->
      <!--<van-button color="#171060" block type="info" native-type="submit">-->
      <!--确认注册-->
      <!--</van-button>-->
      <!--</div>-->
      <!--</van-form>-->

      <!--</van-tab>-->
      <!--</van-tabs>-->
    </main>
    <footer v-show="hideshow">

      <!--<footer v-show="hideshow">-->
      <van-checkbox label-disabled v-model="radio"><span style="font-size: 14px">我已阅读并同意<span class="privacy" @click="toPath('/privacyNotice')">《 隐私政策 》</span></span></van-checkbox>
      <!--</footer>-->
      <!--<template v-if="active == 0">-->
      <!--&lt;!&ndash;<span>用户登录手册</span>&ndash;&gt;-->
      <!--</template>-->
      <!--<template v-else>-->
      <!--<span @touchstart.stop="active = 0">去登录</span>-->
      <!--</template>-->
    </footer>

  </div>
</template>

<script>
  import {Tab, Icon, Tabs, Dialog,Form, Field, Button, Toast, Checkbox, Popup} from 'vant';
  import {setlocalStorage, getlocalStorage, removelocalStorage} from '../config/Utils'
  import http from '../utils/http';
  import urls from '../utils/urls';
  import {mapState, mapMutations, mapActions} from 'vuex'

  export default {
    name: "signIn",
    components: {
      [Dialog.name]: Dialog,
      [Checkbox.name]: Checkbox,
      [Icon.name]: Icon,
      [Popup.name]: Popup,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Form.name]: Form,
      [Field.name]: Field,
      [Toast.name]: Toast,
      [Button.name]: Button,
    },
    data() {
      let validatePass = (value, rule) => {
        let formValue = this.$refs.signIn.getValues();
        if (value !== '') {
          if (formValue.checkPassword !== '') {
            this.$refs.signIn.validateField('checkPassword');
          }
        }
      };

      let validatePass2 = (value, rule) => {
        let formValue = this.$refs.signIn.getValues();
        if (value === '') {
          this.errorMessage = '请确认密码'
        } else if (value !== formValue.password) {
          this.errorMessage = '两次密码输入不一致，请重新输入';
        } else {
          this.errorMessage = '';
        }
      };
      return {
        radio: false,
        show: false,
        docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
        showHeight: document.documentElement.clientHeight,   //实时屏幕高度
        hideshow: true, //显示或者隐藏footer
        active: 0, // 登录，注册tab切换
        errorMessage: '',
        loginData: { // 登录参数
          userLoginNo: '',
          userLoginPsd: '',
        },
        signInData: { //注册传参
          username: '',
          password: '',
          checkPassword: '',
          email: ''
        },
        signInRule: {
          password: [{required: true, message: "请输入密码", validator: validatePass}],
          checkPassword: [{required: true, message: "请确认密码", validator: validatePass2}],
        },
      }
    },
    computed: {
      ...mapState(["isLogin"])
    },
    methods: {
      ...mapActions([
        'getUserInfo'
      ]),

      ...mapMutations([
        'Set_loginType',
        'Is_Login',
        'Set_LoginForm',
      ]),

      onSubmit(values) { // 登录
        if (!this.radio) {
          Dialog.alert({
            message: '登录前请先阅读并同意相关协议',
          }).then(() => {
          });
          return
        }
        this.Set_LoginForm(values);
        this.getUserInfo();
      },

      register(values) {  //注册
      },

      resetPassword() { // 忘记密码
        this.$router.push('/resetPassword')
      },

      toPath(url) {
        this.$router.push(url)
      },

      tabChange: function () {
        for (let key in this.loginData) {
          this.loginData[key] = ''
        }
        for (let key in this.signInData) {
          this.signInData[key] = ''
        }
      },
    },
    watch: {
      showHeight() { // 监听屏幕高度
        if (this.docmHeight > this.showHeight + 130) {
          this.hideshow = false
        } else {
          this.hideshow = true
        }
      }
    },
    mounted() {

      this.Is_Login(false);
      window.onresize = () => { //获取屏幕高度
        return (() => {
          this.showHeight = document.documentElement.clientHeight;
        })();
      }
    },
    created() {
      removelocalStorage("token");
      removelocalStorage("userInfo");
      this.$cookies.remove('autologin');
      this.Set_loginType("");

    }

  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .tiText{
    font-size: 12px;
    margin-top: 40px;
  }
  .signIn {
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
        padding: 13px;
      }
      /deep/ .van-tab {
        font-size: 14px;
      }
      .van-button--block {
        border-radius: 8px;
      }
      section {
        p {
          text-align: left;
          font-size: 15px;
          @include sw(500, #121314);
        }
      }
    }

    footer {
      @include cl;
      text-align: center;
      width: 252px;
      bottom: 40px;
      /deep/ .van-checkbox__label {
        @include sw(500, #B9B9B9);
      }
      span {
        @include sw(500, #000);
      }

    }
    .van-popup{
      width: 75%;
      padding:20px;
      line-height: 24px;
      text-align: left;
      text-indent: 2em;
      border-radius: 5px;
      letter-spacing: 1.2px;

    }
    .privacy{
      color: blue;
    }

  }

</style>
