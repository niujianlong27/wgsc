<template>
  <div class="myApproval">
    <page-nav :title="'我的审批'"></page-nav>
    <main>
      <van-tabs sticky title-active-color="#1A1E75" color="#1A1E75" background="#F5F5F5" v-model="active">
        <van-tab title="拟选询单">

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
              <section @click.stop="toCreate">
                <div>
                  <img src="../../assets/changjing.png" alt="">
                </div>
                <div>
                  <h5>施耐德 塑壳断路器固定式CVS160N 2123A 3P</h5>
                  <p>产品编号：C3135791</p>
                  <p class="last">
                    <span class="left">2020-06-08 04:00</span>
                    <span class="right">询价比-创建审批</span>
                  </p>

                </div>
              </section>
              <!--</van-list>-->
            </template>
            <template v-else>
              <van-empty description="暂无数据"/>
            </template>
          </template>
        </van-tab>
        <van-tab title="拟签询单">
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
              <section @click.stop="toCreate">
                <div>
                  <img src="../../assets/changjing.png" alt="">
                </div>
                <div>
                  <h5>施耐德 塑壳断路器固定式CVS160N 2123A 3P</h5>
                  <p>产品编号：C3135791</p>
                  <p class="last">
                    <span class="left">2020-06-08 04:00</span>
                    <span class="right">询价比-创建审批</span>
                  </p>

                </div>
              </section>
              <!--</van-list>-->
            </template>
            <template v-else>
              <van-empty description="暂无数据"/>
            </template>
          </template>
        </van-tab>
      </van-tabs>
    </main>
  </div>
</template>

<script>
  import pageNav from '../../components/pageNav'
  import {Tab, Tabs, List, Empty, Icon, Loading} from 'vant';

  export default {
    name: "myApproval",
    components: {
      pageNav,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Icon.name]: Icon,
      [List.name]: List,
      [Empty.name]: Empty,
      [Loading.name]: Loading,
    },
    data() {
      return {
        active: 0, // tab标机状态
        isLoding: false, // 加载状态
        dataList: [], // 数据列表
      }
    },
    methods: {
      toCreate() {
        this.$router.push('/createApproval')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  main {
    padding: 0 20px;
    background-color: #F5F5F5;
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
        .last {
          overflow: hidden;
          .right {
            color: #F56D6D;
          }
        }
      }
    }
  }

</style>
