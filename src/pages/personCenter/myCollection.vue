<template>
  <div class="myCollection">
    <page-nav @clickRight="clickRight" :title="'我的收藏'" :rightText="rightTextName"></page-nav>
    <main>
      <template v-if="isLoding">
        <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
      </template>
      <template v-else>
        <template v-if="listData.length == 0">
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
            <section>
              <van-checkbox-group ref="checkboxGroup" v-model="result" @change="checked()">
                <van-cell-group class="rudio" :border="false" v-for="(item, index) in listData" :key="item.commodityNo">
                  <div class="cardBox">
                    <div>
                      <van-cell :border="false">
                        <template v-if="showFooter" #title>
                          <van-checkbox :name="item" ref="checkboxes"/>
                        </template>
                      </van-cell>
                    </div>
                    <div @click="toPath(item.commodityNo)" class="card">
                      <p><img :src="item.attachList[0].filePath | setImg" alt=""></p>
                      <p>
                        <span class="span1">{{item.commodityName}}</span>
                        <span>产品编号：{{item.commodityArticleNo}}</span>
                        <span>¥{{item.price | fixNum}}</span>
                      </p>
                    </div>
                  </div>
                </van-cell-group>
              </van-checkbox-group>
            </section>

          </van-list>

        </template>
      </template>
    </main>
    <template v-if="showFooter">
      <van-submit-bar class="manage" button-text="取消收藏" @submit="Delete">
        <template #default>
          <van-checkbox @click="allChecked" v-model="isChecked">全选</van-checkbox>
          <template>
            <van-button @click.stop="addCart" class="firstButton" plain round type="info">加入购物车</van-button>
          </template>
        </template>
      </van-submit-bar>
    </template>
  </div>

</template>

<script>
  import {
    Checkbox,
    Cell,
    Empty,
    Stepper,
    CellGroup,
    Button,
    List,
    Loading,
    CheckboxGroup,
    SubmitBar,
    Toast
  } from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';
  import pageNav from '../../components/pageNav'
  import {getlocalStorage} from "../../config/Utils";

  export default {
    name: "myCollection",
    components: {
      pageNav,
      [Checkbox.name]: Checkbox,
      [Loading.name]: Loading,
      [CheckboxGroup.name]: CheckboxGroup,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Stepper.name]: Stepper,
      [SubmitBar.name]: SubmitBar,
      [Button.name]: Button,
      [Empty.name]: Empty,
      [List.name]: List,
      [Toast.name]: Toast,
    },
    data() {
      return {
        page: 1,
        isLoding: false,//整个页面加载
        loading: false,//数据滚动加载
        finished: false,//全部加载完成
        listData: [], //收藏数据列表
        result: [], // 选中的数据
        isChecked: false, // 全选判断
        showFooter: false, // 展示底部导航
        rightTextName: '管理' // 向子组件传值
      }
    },
    methods: {
      clickRight(text) {
        if (text == '管理') {
          this.showFooter = true;
          this.rightTextName = '完成';
        } else {
          this.rightTextName = '管理';
          this.showFooter = false;
        }
      },
      onLoad() { // 滚动加载
        this.page += 1;
        this.getFavorite()
      },

      getFavorite() { // 查询收藏
        this.result = [];
        http.post(urls.favoriteList, {page: this.page, rows: 10}).then(res => {
          this.isLoding = false;
          if (res.success) {
            this.loading = false;
            let list = res.obj && res.obj.favoriteList || [];
            this.listData = this.listData.concat(list);
            if (this.listData.length == res.obj.page.records) {
              this.finished = true;
            }
          } else {
            Toast.fail(res.msg)
          }
        }).catch(err => {

        })
      },

      checked: function () { //选择框改变触发
        if (this.result.length === this.listData.length) {
          this.isChecked = true
        } else {
          this.isChecked = false
        }
      },

      allChecked() { //全选
        this.listData.length > 0 && this.$refs.checkboxGroup.toggleAll(this.isChecked);
      },

      addCart() { // 添加购物车
        let num = 0;
        let token = getlocalStorage("token");
        this.result.forEach(item => {
          http.get(`${urls.addCommodityToShopCar}?flag=wg&appCode=WG&access_token=${token}`, {
            requestAmount: 1,
            commodityNo: item.commodityNo,
          }).then(res => {
            if (res.success) {
              num += 1;
              if (num == this.result.length) {
                Toast.success(res.msg)
              }
            } else {
              Toast.fail(res.msg)
            }
          }).catch(err => {

          })
        })
      },

      Delete() { // 取消收藏
        let num = 0;
        this.result.forEach(item => {
          http.post(urls.cancelFavorite, {commodityNo: item.commodityNo}).then(res => {
            if (res.success) {
              num += 1;
              if (num == this.result.length) {
                Toast.success(res.msg)
                this.isLoding = true;
                this.page = 1;
                this.listData = [];
                this.finished = false;
                this.getFavorite()
              }
            } else {
              Toast.fail(res.msg)
            }
          }).catch(err => {

          })
        })
      },
      toPath(id) {
        this.$router.push({path: '/goodsDetails', query: {id: id}})
      }
    }
    ,
    created() {
      this.isLoding = true;
      this.getFavorite()
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .myCollection {
    main {
      background-color: #F5F5F5;
      padding: 0 20px 50px;
      section {
        background-color: #F5F5F5;
        .van-cell {
          border-radius: 3px !important;
        }
        .rudio {
          background-color: white;
          border-radius: 5px;
          margin-top: 10px;
          .van-cell-group {
            &:last-child {
              border-bottom: none
            }
          }
          /deep/ .van-cell-group {
            border-bottom: 1px solid #e8e8e8;
          }
        }
        .van-checkbox__icon {
          font-size: 18px;
        }
        /deep/ .van-checkbox__icon .van-icon {
          @include wh(18px, 18px);
          line-height: 18px;
        }
        /deep/ .van-cell {
          padding: 7px 5px 7px 2px;
        }
        .card {
          display: flex;
          padding-left: 5px;
          box-sizing: border-box;
          p {
            box-sizing: border-box;
            margin: 0 0 12px;
            flex-shrink: 0;
            padding: 0 5px;
            &:first-child {
              padding: 0;
              width: 32%;
              img {
                @include wh(100%, 100%)
              }
            }
            &:nth-child(2) {
              width: 58%;
              span {
                margin-bottom: 6px;
                display: block;
                text-align: left;
                font-size: 14px;
                &:nth-child(1) {
                  @include sw(500, #24272C);
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
                &:nth-child(2) {
                  color: #A6A6A6;
                }
                &:last-child {
                  color: #FF6464;
                }
              }
            }
          }
        }
      }
      .cardBox {
        display: flex;
        @include wh(335px, 115px);
        background-color: #ffffff;
        padding-top: 10px;
        > div {
          flex-shrink: 0;
          &:first-child {
            width: 25px;
            position: relative;
            .van-cell {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
          &:last-child {
            width: calc(100% - 25px);
          }
        }
      }

      /*}*/
    }
    .manage {
      /deep/ .van-checkbox {
        width: 100px !important;
      }
      .van-button {
        @include wh(110px, 40px);
        color: #FF6464;
        border: 1px solid #FF6464;
      }
      .firstButton {
        margin: 0 13px 0 30px;
      }
      /deep/ .van-submit-bar__button--danger {
        background: #ffffff;
      }
    }
  }

</style>
