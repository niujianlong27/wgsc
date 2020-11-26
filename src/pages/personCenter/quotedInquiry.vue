<template>
  <div class="quotedInquiry">
    <page-nav :title="title"></page-nav>
    <main>

      <template v-if="isLoding">
        <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
      </template>
      <template v-else>
        <template v-if="dataList.length > 0">
          <!--<van-list-->
          <!--offset="100"-->
          <!--v-model="loading"-->
          <!--:finished="finished"-->
          <!--finished-text="没有更多了"-->
          <!--@load="onLoad"-->
          <!--&gt;-->
          <section @click.stop="toWaitInquiry">
            <div>
              <img src="../../assets/changjing.png" alt="">
            </div>
            <div>
              <h5>施耐德 塑壳断路器固定式CVS160N 2123A 3P</h5>
              <p>产品编号：C3135791</p>
              <p>2020-06-08 04:00</p>
              <span>￥ 160</span>
            </div>
          </section>
          <!--</van-list>-->
        </template>
        <template v-else>
          <van-empty description="暂无数据"/>
        </template>
      </template>


    </main>
  </div>
</template>

<script>
  import pageNav from '../../components/pageNav'
  import http from '../../utils/http';
  import urls from '../../utils/urls';
  import {List, Empty, Cell, Icon, Button, Loading} from 'vant';

  export default {
    name: "quotedInquiry",
    components: {
      pageNav,
      [Cell.name]: Cell,
      [Icon.name]: Icon,
      [Button.name]: Button,
      [List.name]: List,
      [Empty.name]: Empty,
      [Loading.name]: Loading,
    },
    data() {
      return {
        title: '已报价询价单',
        dataList: [], // 数据列表
        isLoding: false, // 加载状态
      }
    },
    methods: {
      toWaitInquiry() {
        this.$router.push('/inquiryTrack')
      }
    },
    mounted() {
      http.post('/baiduApi/init/rfqRequestList', {"pageIndex": "1", "pageSize": "10"}).then(res => {

      }).catch(err => {

      })
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  main {
    background-color: #F5F5F5;
    padding: 0 20px 10px;
    section {
      background-color: #ffffff;
      margin: 10px auto;
      display: flex;
      padding: 15px 10px;
      border-radius: 7px;

      div {
        position: relative;
        text-align: left;
        &:first-child {
          flex: 1;
          flex-shrink: 0;
          position: relative;
        }
        img {
          @include wh(100%, 90px);
          @include ct;
        }
        &:last-child {
          flex: 3;
          padding-left: 8px;
        }
        h5, p {
          margin: 9px 0;
          color: #24272C;
        }
        p {
          @include sc(12px, #5F5F5F)
        }
        span {
          display: inline-block;
          @include wh(50px, 20px);
          background-color: #100F65;
          @include sc(12px, #FFFFFF);
          line-height: 20px;
          text-align: center;
          position: absolute;
          border-radius: 3px;
          bottom: 3px;
          right: 3px;
        }
      }
    }

  }

</style>
