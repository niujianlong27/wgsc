<template>
  <div class="aboutMe">
    <page-nav :title="'关于我们'"></page-nav>
    <img width="100%" src="../../assets/aboutMe.jpg" alt="">
  </div>
</template>

<script>
  import pageNav from '../../components/pageNav'

  export default {
    name: "aboutMe",
    components: {pageNav},
    data() {
      return {}
    },
  }
</script>

<style scoped>
  .aboutMe {
    background-color: white;
  }

  .aboutMe /deep/ .van-nav-bar{
    background-color: white;
  }
</style>
