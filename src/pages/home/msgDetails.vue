<template>
  <div class="msgDetails">
    <page-nav :title="'通知消息详情'"></page-nav>
    <main>
      <div v-html="tencet"></div>
    </main>

  </div>
</template>

<script>
  import pageNav from '../../components/pageNav';
  import urls from '../../utils/urls';
  import http from '../../utils/http';

  export default {
    name: "msgDetails",
    components: {
      pageNav
    },
    data() {
      return {
        tencet: ''
      }
    },
    mounted() {
      http.get(urls.queryUserMessageDetail, {domainCode: 'BEPS', msgId: this.$route.query.id}).then(res => {
        this.tencet = res.datas.msgContent
      }).catch(err => {

      })
    }
  }
</script>

<style scoped lang="scss">
  .msgDetails {
    text-align: left;
    main{
      background-color: #f5f5f5;
      padding: 0 20px;
    }
  }

</style>
