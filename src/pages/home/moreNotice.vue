<template>
  <div class="moreNotice">
    <page-nav :title="'更多采购公告'"></page-nav>
    <div>
      <section class="imgs">
        <div>
          <van-dropdown-menu>
            <van-dropdown-item v-model="rfqMethod" :options="option1"/>
          </van-dropdown-menu>
        </div>
        <div class="inputBox">

          <form action="/">

            <van-search
              v-model="ouName "
              show-action
              placeholder="请输入搜索关键词"
              @search="onSearch"
            >
              <template #action>
                <div @click="onSearch">搜索</div>
              </template>
            </van-search>
          </form>

        </div>
      </section>
    </div>
    <main>

      <template v-if="isLoding">
        <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
      </template>
      <template v-else>

        <template v-if="noticeList.length == 0">
          <van-empty description="暂无数据"/>
        </template>
        <template v-else>
          <van-list
            offset="100"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >

            <section class="noticeList" v-for="item in noticeList" :key="item.id">
              <div class="textLeft" @click="toPath('/noticeDetails',item.id)">
                {{item.title}}
              </div>
              <div class="textLeft">
           <span>
             <span style="position: relative;top: 2px;"><van-icon name="eye"/></span>
             <span>{{item.count == 'null' ? 0 : item.count}}次</span>
           </span>
                <span class="date right">
             {{item.issueDate |  YYYY-HH-DD}}
           </span>
              </div>
            </section>

          </van-list>
        </template>

      </template>
    </main>
  </div>
</template>

<script>
  import pageNav from '../../components/pageNav'
  import {
    Icon,
    Empty,
    Search,
    DropdownItem,
    DropdownMenu,
    Picker,
    Popup,
    Field,
    Button,
    Form,
    List,
    Loading
  } from 'vant';
  import urls from '../../utils/urls';
  import http from '../../utils/http';

  export default {
    name: "moreNotice",
    components: {
      pageNav,

      [Search.name]: Search,
      [DropdownItem.name]: DropdownItem,
      [DropdownMenu.name]: DropdownMenu,
      [Button.name]: Button,
      [Form.name]: Form,
      [Field.name]: Field,
      [Popup.name]: Popup,
      [Picker.name]: Picker,
      [List.name]: List,
      [Icon.name]: Icon,
      [Empty.name]: Empty,
      [Loading.name]: Loading,
    },
    data() {
      return {
        page: 1,
        ouName: "", // 查询条件
        option1: [
          {text: '全部', value: ''},
          {text: '询比价', value: 'RAQ'},
          {text: '反向竞价', value: 'TBQ'},
          {text: '综合组合', value: 'DAC'},
        ],

        statementName: '',
        noticeList: [],
        value: '',
        columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
        showPicker: false,
        isLoding: true,
        loading: false,//数据滚动加载
        finished: false,//全部加载完成
        rfqMethod: '',
      }
    },
    methods: {
      toPath(url, data) {
        this.$router.push({path: url, query: {id: data}}) //跳转地址设置
      },

      onConfirm(value) { // 确定
        this.value = value;
        this.showPicker = false;
      },

      onSubmit1() { //表单1
        this.formData1 = this.$refs.form1.getValues();
      },

      onSearch(value) { // 查询
        this.isLoding = true;
        this.page = 1;
        this.noticeList = [];
        this.searchData();
      },

      onLoad() { // 滚动加载
        this.page += 1;
        this.searchData();
      },


      searchData() { // 搜索
        let params = {
          page: this.page,
          rows: "20",
          noticeType: "1",
          martSign: '50',
          rfqMethod: this.rfqMethod,
          ouName: this.ouName
        };

        http.post(urls.searchNotice, params).then(res => {
          this.isLoding = false;
          this.loading = false;
          let list = res.list || [];
          this.noticeList = this.noticeList.concat(list);
          if (this.noticeList.length == res.total) {
            this.finished = true;
          }

        }).catch(err => {

        })
      }

    },
    mounted() {
      // this.getNotice();

      this.searchData();
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .moreNotice {
    /deep/ .van-nav-bar {
      background-color: #ffffff;
    }
    > div {
      margin-bottom: 20px;
      background-color: white;
      padding: 0 10px;
      /deep/ .van-dropdown-menu__bar {
        box-shadow: 0 0 0 #ffffff;
        height: 40px;
      }
      > section {
        display: flex;
        > div {
          flex: 1;
          height: 40px;
          @include sc(14px, #0C274F);
          line-height: 40px;
          font-weight: 500;
          .van-icon {
            transform: rotate(90deg);
            padding-left: 5px;
          }
        }
        .inputBox {
          flex: 3;
          /deep/ .van-search {
            padding: 0;
            height: 100%;
          }
        }
      }
    }
    background-color: #F5F5F5;
    box-sizing: border-box;
    main {
      background-color: #F5F5F5;
      padding: 0 20px;
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
    }
  }


</style>
