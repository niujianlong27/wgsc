<template>
  <div class="senceDetails">
    <page-nav :title="'场景详情'"></page-nav>
    <main>
      <div>
        <img :src="bgImg  | setImg" alt="">
      </div>
      <section>

        <van-collapse v-model="activeNames">
          <van-collapse-item v-for="(data,value) in goodsList" :key="data[0].className" :title="data[0].className"
                             :name="value">

            <!--<van-checkbox-group class="rudio" :ref="'checkboxGroup' + value" v-model="data.result">-->
            <van-cell-group :border="false" v-for="(item, index) in data" :key="index">
              <div class="cardBox">
                <div>
                  <van-cell class="cardCheck" :border="false">
                    <template #title>
                      <van-checkbox @click="changeCheck" v-model="item.checked" :ref="'checkboxes' + value"/>
                    </template>
                  </van-cell>
                </div>
                <div class="card">

                  <p @click.stop="clickSim(item.commodityVo.commodityNo)"><img
                    :src="item.commodityVo.attachList[0].filePath | setImg" alt=""></p>
                  <p @click.stop="clickSim(item.commodityVo.commodityNo)">
                    <span>{{item.commodityVo.commodityName}} </span>
                    <span>货号：{{item.commodityVo.goodsNo}}</span>
                    <span>¥{{item.commodityVo.commodityPrice | fixNum}}</span>
                  </p>
                  <p>
                    <van-stepper v-model="item.mOQ" theme="round"
                                 button-size="22"
                                 disable-input/>
                  </p>
                </div>
              </div>
            </van-cell-group>

          </van-collapse-item>
        </van-collapse>
      </section>
    </main>
    <footer>

      <van-submit-bar :decimal-length="3" button-text="加入购物车" @submit="onSubmit">
        <van-checkbox @click="allChecked" v-model="isChecked">全选</van-checkbox>
      </van-submit-bar>
    </footer>
  </div>
</template>

<script>
  import pageNav from '../../components/pageNav';
  import {Checkbox, Collapse, CollapseItem, Cell, Stepper, Toast, CellGroup, CheckboxGroup, SubmitBar,} from 'vant';
  import urls from "../../utils/urls";
  import http from "../../utils/http";
  import {getSessionStorage} from "../../config/Utils";

  export default {
    name: "senceDetails",
    components: {
      [Checkbox.name]: Checkbox,
      [CheckboxGroup.name]: CheckboxGroup,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Stepper.name]: Stepper,
      [SubmitBar.name]: SubmitBar,
      [Collapse.name]: Collapse,
      [CollapseItem.name]: CollapseItem,
      [Toast.name]: Toast,
      pageNav,
    },
    data() {
      return {
        isChecked: true,
        bgImg: '',
        activeNames: [0], // 默认展开
        goodsList: [],
      }
    },

    methods: {

      toPath(data) {
        this.$router.push({path: '/goodsDetails', query: {id: data}})
      },

      clickSim(data) { // 同类商品推荐
        this.$router.push({path: '/goodsDetails', query: {id: data}})
      },

      onSubmit() {
        let arr = [];
        this.goodsList.forEach(item => {
          item.forEach(cItem => {
            if (cItem.checked) {
              let obj = {};
              obj.requestAmount = cItem.mOQ;
              obj.commodityNo = cItem.commodityVo.commodityNo;
              arr.push(obj)
            }
          });
        });
        if (arr.length == 0){
          Toast('请选择商品！');
          return
        }
        http.post(urls.addCommoditysToShopCar, {Commoditys: JSON.stringify({goodsList: arr})}).then(res => {
          if (res.success) {
            Toast.success('添加成功')
          } else {
            Toast.fail(res.msg)
          }
        }).catch(err => {

        });

      },

      changeCheck() {
        for (let key in this.goodsList) {
          this.goodsList[key].forEach(item => {
            !item.checked && (this.isChecked = false);
          });
        }
      },
      allChecked() { // 全选
        for (let key in this.goodsList) {
          this.goodsList[key].forEach(item => {
            item.checked = this.isChecked;
          });
        }
      }
    },
    created() {
      this.bgImg = this.$route.query.img;
      let obj = JSON.parse(getSessionStorage('senceDetails'));
      for (let key in obj) {
        obj[key].forEach(item => {
          item.checked = true;
        });
        this.goodsList.push(obj[key])
      }
    }

  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  main {
    padding: 10px 20px 70px;
    background-color: #F5F5F5;
    div {
      img {
        @include wh(100%, 188px)
      }
    }
    section {
      margin-top: 10px;
      /deep/ .van-cell {
        padding: 7px 10px;
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
            width: 52%;
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
          &:last-child {
            @include wh(35px, 100%);
            margin: 0;
          }
          /deep/ .van-stepper button {
            @include wh(21px, 21px);
            margin: 7px 0;
          }
          .van-stepper {
            transform: rotate(180deg);
          }
          /deep/ .van-stepper__input {
            transform: rotate(180deg);
            @include wh(22px, 22px);
          }
        }
      }

    }
    /deep/ .van-cell__title {
      text-align: left;
    }
    /deep/ .van-collapse-item__content {
      padding: 12px 0;
    }
  }

  footer {
    .t {
      @include sc(12px, A6A6A6);
      display: inline-block;
      float: right;
    }

    .van-checkbox {
      position: absolute;
      left: 20px;
    }
  }

  .cardBox {
    display: flex;
    @include wh(335px, 115px);
    background-color: #ffffff;
    > div {
      flex-shrink: 0;
      &:first-child {
        width: 25px;
        position: relative;
        /deep/ .van-cell {
          padding-left: 5px;
        }
      }
      &:last-child {
        width: calc(100% - 25px);
      }
    }
  }

  .cardCheck {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%)
  }

</style>
