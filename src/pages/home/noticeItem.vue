<template>
  <div class="noticeItem">
    <page-nav :title="'最新公告详情'"></page-nav>
    <main>
      <div v-html="tencet"></div>
    </main>
  </div>
</template>

<script>
  import pageNav from '../../components/pageNav';

  export default {
    name: "noticeItem",
    components: {
      pageNav
    },
    data() {
      return {
        tencet: "",
      }
    },
    mounted() {
      this.tencet = this.$route.query.tencet;
    }
  }
</script>

<style scoped lang="scss">

  .noticeItem {
    main {
      text-align: left;
      padding: 10px 20px;
      background-color: #F5F5F5;
      > div > > > img {
        width: 100%
      }

    }
  }
</style>
