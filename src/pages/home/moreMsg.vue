<template>
  <div class="moreMsg">
    <page-nav :title="'消息通知'"></page-nav>

    <main>

      <template v-if="isLoding">
        <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
      </template>
      <template v-else>
        <template v-if="newList.length > 0">
          <van-list
            offset="100"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <section class="noticeList" v-for="item in newList" :key="item.id">
              <div class="textLeft" @click="clickItem(item.msgId)">
                {{item.msgTitle}}
              </div>
              <div class="textLeft">
                  <span class="date right">
                      {{item.sendTime |  setDate}}
                   </span>
              </div>
            </section>
          </van-list>

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
        pageSize: 30,
        page: 1,
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
        this.$router.push({path: 'msgDetails', query: {id: data}})
      },
      onLoad() {
        this.page += 1;
        this.getNotices();
      },

      getNotices() {
        http.get(urls.queryUserMessage, { // 查询最新公告
          domainCode: 'wg',
          page: this.page,
          rows: this.pageSize
        }).then(res => {
          this.isLoding = false;
          this.loading = false;
          let list = res.datas.rows || [];
          this.newList = this.newList.concat(list);
          if (this.newList.length == res.count) {
            this.finished = true;
          }
        }).catch(err => {
        });
      },

    },
    mounted() {
      this.isLoding = true;
      this.getNotices()
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
