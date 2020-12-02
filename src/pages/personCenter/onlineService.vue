<template>
  <div class="onlineService">
    <page-nav @clickRight="clickRight" :title="'在线客服'" :rightText="'清空消息'"></page-nav>
    <main ref="border">
      <template v-for="item in massageList">
        <div v-if="item.includes('user:')">
          <p class="user">{{item | slice}}</p>
        </div>
        <div v-else>
          <p class="business">{{item}}</p>
        </div>
      </template>

    </main>

    <van-field
      v-model="massage"
      center
      @keyup.enter="send()"
    >
      <template #button>
        <van-button @click="send()" size="small" type="info">发送</van-button>
      </template>
    </van-field>


  </div>

</template>

<script>
  import pageNav from '../../components/pageNav'
  import {Search, Field, Toast, Button} from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';

  export default {
    name: "onlineService",
    components: {
      pageNav,
      Toast,
      [Field.name]: Field,
      [Button.name]: Button,
      [Search.name]: Search,
    },
    data() {
      return {
        massage: '', // 消息列表
        value: "",
        timer: null,
        massageList: [] // 消息列表
      }
    },
    methods: {
      send() {
        if (!this.massage) {
          Toast('不能发送空白消息！');
          return
        }
        window.clearInterval(this.timer);
        http.get(urls.sendMessage, {msg: this.massage}).then(res => {
          this.massage = '';
          this.queryMessage();
          this.timer = window.setInterval(() => {
            this.queryMessage();
          }, 5000);
        }).catch(err => {

        });


      },
      onSearch() {

      },

      clickRight(text) {
        http.get(urls.cleanMessage, {}).then(res => {
          this.massageList = [];
        }).catch(err => {

        })
      },

      queryMessage() {
        http.get(urls.queryMessage, {}).then(res => {
          if (res.success) {
            if (res.obj) {
              this.massageList = res.obj;
            }

          }

        }).catch(err => {

        })

      }
    },
    mounted() {
      this.queryMessage();
      this.timer = window.setInterval(() => {
        this.queryMessage();
      }, 60000);

    },

    destroyed() { // 销毁钩子函数
      window.clearInterval(this.timer);  // 清除循环
    },

  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .onlineService {
    main {
      padding: 0 20px 60px;
      background-color: #f5f5f5;
      div {
        overflow: hidden;
        position: relative;
      }

    }
    p {
      min-height: 20px;
      font-size: 14px;
      background-color: white;
      padding: 8px 15px;
      border-radius: 8px;
      max-width: 230px;
      margin: 8px 0;
      position: relative;
      word-wrap : break-word;
    }

    .business {
      margin-left: 10px;
      float: left;
      text-align: left;
    }

    .business::after {
      position: absolute;
      left: -11px;
      top: 50%;
      transform: translate(0, -50%); /* x、y轴方向 y轴为负向上平移*/
      content: '';
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-right: 13px solid white;
      border-bottom: 6px solid transparent;
    }

    .user {
      margin-right: 10px;
      float: right;
      text-align: left;
    }
    .user::after {
      position: absolute;
      right: -11px;
      top: 50%;
      transform: translate(0, -50%); /* x、y轴方向 y轴为负向上平移*/
      content: '';
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-left: 13px solid white;
      border-bottom: 6px solid transparent;
    }

    /deep/ .van-cell {
      padding: 10px;
      position: fixed;
      bottom: 0;
    }
    /deep/ .van-cell__value {
      background-color: #f5f5f5;
    }
  }

</style>
