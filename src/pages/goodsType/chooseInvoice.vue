<template>
  <div class="chooseInvoice">
    <page-nav :title="'发票选择'"></page-nav>

    <main>
      <template v-if="isLoding">
        <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
      </template>
      <template v-else>
        <template v-if="invoiceData.length > 0">
          <van-list
            offset="100"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <section v-for="item in invoiceData" :key="item.center.id"
                     @click.stop="chooseInvoice(item)">
              <p>{{item.center.statementName}} {{item.invoice.mobile}}
                <span style="color:#E44A4A" class="stateSpan" v-if="item.center.isDelete == 1">已作废</span>
                <span class="stateSpan" v-if="item.center.isDelete == 0">已生效</span>
              </p>
              <p>{{item.invoice.province}} {{item.invoice.city}} {{item.invoice.area}}
                {{item.invoice.detailAddress}}</p>
              <div>
                <p v-if="item.isDefault == '1'">
                  <van-icon name="passed"/>
                  已设为默认
                </p>
                <p>
                  <span @click.stop="updateInvoice(item)">复制</span>
                  <span v-if="item.center.isDelete == 0" @click.stop=deleteInvoice(item)>作废</span>
                </p>
              </div>
            </section>

          </van-list>
        </template>
        <template v-else>
          <van-empty description="暂无数据"/>
        </template>
      </template>
      <van-button type="primary" @click.stop="addTo" block>添加结算中心</van-button>
    </main>
  </div>

</template>

<script>
  import pageNav from '../../components/pageNav'
  import {Button, Icon, List, Loading, Empty, Toast,} from 'vant';
  import http from "../../utils/http";
  import urls from '../../utils/urls';
  import {getSessionStorage, setSessionStorage} from "../../config/Utils";

  export default {
    name: "chooseInvoice",
    components: {
      pageNav,
      [Icon.name]: Icon,
      [Button.name]: Button,
      [Loading.name]: Loading,
      [List.name]: List,
      [Empty.name]: Empty,
      [Toast.name]: Toast
    },
    data() {
      return {
        data: {},
        isLoding: false,//整个页面加载
        loading: false,//数据滚动加载
        finished: false,//全部加载完成
        invoiceData: [],// 发票数据
        page: 1,// 页码
      }
    },
    methods: {
      getInvoice() {
        this.finished = false;
        http.post(urls.searchStatementCenter, {page: this.page, rows: 6}).then(res => {
          this.isLoding = false;
          if (res.success) {
            this.loading = false;
            let list = res.obj && res.obj.rows || [];
            this.invoiceData = this.invoiceData.concat(list);
            if (res.obj.records == this.invoiceData.length) {
              this.finished = true;
            }
          } else {
            Toast.fail(res.msg)
          }

        }).catch(err => {

        })
      },
      updateInvoice(data) { // 复制发票
        this.$router.push({path: "/addSettlement", query: {state: "update", data: data}})
      },
      deleteInvoice(data) { // 删除发票

        http.get(urls.deleteStatement, {sid: data.center.id}).then(res => {
          if (res.success) {
            this.invoiceData = [];
            this.page = 1;
            Toast.success(res.obj);
            this.getInvoice()

          } else {
            Toast.fail(res.msg)
          }
        }).catch(err => {

        })
      },

      addTo() { // 新增
        this.$router.push({path: "/addSettlement", query: {state: "add"}})
      },

      onLoad() { //滚动加载
        this.page += 1;
        this.getInvoice();
      },

      chooseInvoice(data) {// 选择发票
        setSessionStorage('invoice', data.center);
        this.$router.go(-1)
      }
    },
    created() {
      this.isLoding = true;
      this.getInvoice()
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';

  .chooseInvoice {
    main{
      background-color: #F5F5F5;
    }
    section {
      margin-bottom: 10px;
      p {
        margin: 10px 0;
      }
      padding: 1px 20px;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 1);
      font-weight: 500;
      @include sc(14px, rgba(83, 83, 83, 1));
      text-align: left;
      div {
        display: flex;
        font-size: 12px;
        p {
          flex: 1;
          color: #E44A4A;
          margin: 10px 0;
          &:last-child {
            text-align: right;
            span {
              margin-right: 10px;
              &:first-child {
                color: #878787;
              }
            }
          }
          .van-icon {
            top: 2px;
          }
        }
      }
    }
    /deep/ .van-button--block {
      @include wh(335px, 46px);
      margin: 20px auto;
      background: rgba(16, 15, 101, 1);
      border-radius: 5px;
      border: none;
    }
    .stateSpan{
      float: right;
      font-size: 12px;
      margin-right: 10px;
    }
  }

</style>
