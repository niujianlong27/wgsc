<template>
  <header>
    <van-nav-bar
      :title="titleName"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
      <template #right>
        <template v-if="search">
          <van-icon name="search" size="18" />
        </template>
        <template v-else>
          {{rightText}}
        </template>
      </template>
    </van-nav-bar>

  </header>


</template>

<script>
  import {NavBar,Icon} from 'vant';

  export default {
    name: "pageNav",
    components: {
      [NavBar.name]: NavBar,
      [Icon.name]: Icon,

    },
    data() {
      return {
        titleName: this.title,
      }
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      rightText: {
        type: String,
        default: ''
      },
      search:{
        type: Boolean,
        default: false
      },
      setUrl:{
        type: String,
        default: ''
      }
    },
    methods: {
      onClickLeft() {
        if (this.setUrl) {
          this.$router.push(`/${this.setUrl}`);
          return
        }
        this.$router.go(-1)
      },
      onClickRight() {
        if (this.rightText) {
         this.$emit('clickRight',this.rightText);
        }
      }
    },
  }
</script>

<style scoped lang="scss">
  header {
    height: 55px;
    span {
      display: inline-block;
    }
    /deep/ .van-nav-bar {
      height: 55px;
      background:#F5F5F5;
      font-size: 18px;
      font-weight: 500;
      color:  #9A9A9A!important;
    }
    /deep/ .van-nav-bar__title{
      color: #9A9A9A;
    }
    /deep/ .van-icon {
      color: #707070;
    }
  }

</style>
