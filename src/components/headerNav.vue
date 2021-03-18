<template>
  <nav>
    <div style="text-align: left">
             <span class="textLeft" @click="goReturn">
               <template v-if="leftIcon">
                <van-icon :name="leftIcon"/>
               </template>
               <template v-else>
                 <span  @click="clickAddress" ><van-icon  name="location-o"/><span>{{this.address}}</span></span>

               </template>
             </span>
      <span>
        <form action="">
           <van-search
             v-model="value"
             shape="round"
             :placeholder="placeholderText"

             @click-right-icon="clickRight"
             @search="clickRight"

           />
            <!--:left-icon="require('../assets/Microphone.png')"-->
             <!--:right-icon="require('../assets/Find.png')"-->
        </form>
      </span>
      <span v-show="rightIconShow !== false" class="textRight"> <van-icon :badge="messageCount" @click.stop="toPath('/moreMsg')"  name="comment-o"/> </span>
    </div>
  </nav>
</template>

<script>
  import {Search, Field, Icon} from 'vant';
  import {mapState} from 'vuex'
  import http from '../utils/http';
  import urls from '../utils/urls';
  export default {
    components: {
      [Field.name]: Field,
      [Icon.name]: Icon,
      [Search.name]: Search,
    },
    data() {
      return {
        value: this.searchValue,
        leftIcon: this.licon,
        rightIconShow: this.riconShow,
        placeholderText: this.placeholder,
        isJump:this.jump,
        messageCount:''
      }
    },
    props: {
      licon: {
        type: String,
        default: ''
      },
      riconShow: {
        type: Boolean,
        default: true
      },
      placeholder: {
        type: String,
        default: "请输入名称、供应商、品牌"
      },
      searchValue: {
        type: String,
        default: ""
      },
      jump: {
        type: Boolean,
        default: true
      },
    },
    computed: {
      ...mapState(["address"])
    },
    mounted(){
      this.getMessageCount()
    }
    ,
    methods: {

      toPath(url, data) {
        if (data) {
          this.$router.push({path: url, query: data}); //跳转地址设置
          return
        }
        this.$router.push(url)
      },

      getMessageCount() {
        http.get(urls.queryUserMessageCount, {domainCode: 'wg'}).then(res => {
          if (res == '系统异常，请联系运营商！') {
            this.messageCount = ''
          } else {
            this.messageCount = res
          }
        }).catch(err => {

        })
      },

      goReturn() {
        if (this.leftIcon) {
          this.$router.go(-1);
          return
        }
        // this.$router.push('/setAddress')
      },

      clickAddress(){
        this.$emit('setAddress',true)

      },

      clickRight() {
        if (this.isJump) {
          this.$router.push({path: "/typeDetails", query: {searchValue: this.value}});
          return
        }
        this.$emit('getSearch',this.value)
      }
    },
    watch: {
      "searchValue"() {
        this.value = this.searchValue
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  nav {
    background-color: #ffffff;
    color: #D8D8D8;
    line-height: 50px;
    padding: 0 10px;
    box-sizing: border-box;
    @include wh(100%, 60px);
    > div {
      overflow: hidden;
      > span {
        color: #0C274F;
        box-sizing: border-box;
        float: left;
        font-size: 16px;
        &:first-child {
          width: 19%;
          span {
            @include sc(14px, #0C274F);
          }
          /deep/ .van-icon {
            position: relative;
            top: 3px;
          }
        }
        &:nth-child(2) {
          width: 71%;
        }
        &:last-child {
          width: 10%;
          /deep/ .van-icon {
            position: relative;
            top: 3px;
            right: 10px;
          }
        }
      }
      /deep/ .van-icon__image {
        @include wh(14px, 14px)
      }
      /deep/ .van-field__control {
        @include sc(12px, #3E537D);
      }
    }
  }

</style>
