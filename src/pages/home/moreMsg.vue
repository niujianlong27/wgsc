<template>
  <div class="moreMsg">
    <page-nav :title="'消息通知'"></page-nav>

    <main>
      <van-tabs @change="changeTabs()" sticky title-active-color="#1A1E75" color="#1A1E75" background="#F5F5F5"
                v-model="active">

        <van-tab title="通知公告">
          <template v-if="isLoding">
            <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
          </template>
          <template v-else>
            <template v-if="newList.length > 0">

              <section class="noticeList" v-for="item in newList" :key="item.id">
                <div class="textLeft" @click="clickItem(item.tencet)">
                  {{item.title}}
                </div>
                <div class="textLeft">
                  <span class="date right">
                      {{item.createTime |  setDate}}
                   </span>
                </div>
              </section>

            </template>
            <template v-else>
              <van-empty description="暂无数据"/>
            </template>
          </template>
        </van-tab>

        <van-tab title="公司动态">
          <template v-if="isLoding">
            <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
          </template>
          <template v-else>
            <template v-if="newList.length > 0">
              <section class="noticeList" v-for="item in newList" :key="item.id">
                <div class="textLeft" @click="clickItem(item.tencet)">
                  {{item.title}}
                </div>
                <div class="textLeft">
                  <span class="date right">
                      {{item.createTime |  setDate}}
                   </span>
                </div>
              </section>

            </template>
            <template v-else>
              <van-empty description="暂无数据"/>
            </template>
          </template>

        </van-tab>

        <van-tab title="政策法规">
          <template v-if="isLoding">
            <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
          </template>
          <template v-else>
            <template v-if="newList.length > 0">

              <section class="noticeList" v-for="item in newList" :key="item.id">
                <div class="textLeft" @click="clickItem(item.tencet)">
                  {{item.title}}
                </div>
                <div class="textLeft">
                  <span class="date right">
                      {{item.createTime |  setDate}}
                   </span>
                </div>
              </section>
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
  import {Tab, Tabs, Icon, List, Empty, Loading} from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';

  export default {
    name: "moreMsg",
    components: {
      pageNav,
      [Empty.name]: Empty,
      [Loading.name]: Loading,
      [Tab.name]: Tab,
      [List.name]: List,
      [Tabs.name]: Tabs,
      [Icon.name]: Icon,
    },
    data() {
      return {
        pagesNum: 1,
        noType: '01', // 消息分类
        isLoding: false,//整个页面加载
        loading: false,//数据滚动加载
        finished: false,//全部加载完成
        active: 0, // tab标记
        newList: []
      }
    },
    methods: {
      clickItem(data) { // 点击公告item
        this.$router.push({path: 'noticeItem', query: {tencet: data}})
      },
      getNotices() {
        http.get(urls.queryNoticeList, { // 查询最新公告
          noType: this.noType,
          pagesNum: this.pagesNum
        }).then(res => {
          this.isLoding = false;
          this.newList = res.noticeList;
        }).catch(err => {
        });
      },


      changeTabs() { // 切换
        switch (this.active) {
          case 0:
            this.noType = "01"; //通知公告
            break;
          case 1:
            this.noType = "02"; // 公司动态
            break;
          case 2:
            this.noType = "03"; //政策法规
            break;
        }
        this.pagesNum = 1;
        this.isLoding = true;
        this.newList = [];
        // this.getNotices();
      },
    },
    mounted() {
      // this.isLoding = true;
      // this.getNotices()
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .moreMsg {
    main {
      padding: 0 20px;

      background-color: #F5F5F5;
    }

  }

  .newList {
    background-color: white;
    padding: 10px;
    margin-top: 10px;
    text-align: left;
    border-radius: 5px;
  }

  .noticeList {
    display: flex;
    margin-top: 10px;
    @include wh(100%, 44px);
    background: rgba(255, 255, 255, 1);
    border-radius: 5px;
    > div {
      flex: 1;
      line-height: 44px;
      &:first-child {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 10px;
        @include sc(14px, rgba(31, 31, 31, 1));
      }
      &:last-child {
        @include sc(12px, rgba(122, 122, 122, 1));
        .date {
          margin-right: 20px;
        }
      }
    }
  }

</style>
