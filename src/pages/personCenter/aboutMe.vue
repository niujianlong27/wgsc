<template>
  <div class="aboutMe">
    <page-nav :title="'关于我们'"></page-nav>
    <img width="100%" src="../../assets/aboutMe.jpg" alt="">
    <van-cell title="《威购商城隐私政策》" is-link @click="Jump()"/>
  </div>
</template>

<script>
  import pageNav from '../../components/pageNav'
  import {Cell} from 'vant';

  export default {
    name: "aboutMe",
    components: {
      pageNav,
      [Cell.name]: Cell,

    },
    data() {
      return {}
    },
    methods:{
      Jump(){
        this.$router.push('/privacyNotice')
      }
    }
  }
</script>

<style scoped>
  .aboutMe {
    background-color: white;
  }

  .aboutMe /deep/ .van-nav-bar {
    background-color: white;
  }

  .van-cell{
    text-align: left;
    border: 1px solid #f5f5f5;
    /*background-color: #f5f5f5;*/
    font-size: 17px;
    font-weight: 500;
  }
</style>
