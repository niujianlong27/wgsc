<template>
  <div class="tao">
    <div>
      <header-nav :licon="'arrow-left'" :riconShow="false"></header-nav>
      <section>
        <div>
          <van-dropdown-menu>
            <van-dropdown-item @change="changeValue(value1)" v-model="value1" :options="option1"/>
          </van-dropdown-menu>
        </div>
        <div class="time">中标次数
          <van-icon name="exchange"/>
        </div>
        <div class="time">中标次数
          <van-icon name="exchange"/>
        </div>
        <div><img style="position: relative;top: 2px;" width="14px" height="14px" src="../../assets/shaixuan.png"
                  alt=""></div>
      </section>
    </div>
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
          <section @click.stop="open = false">
            <p>上海宝滤洁贸易有限公司</p>
            <p>
            <span class="leftSpan">
            <span class="title">企业代码：</span> <span class="text">U42387</span>
            </span>
              <span class="rightSpan">
            <span class="title">注册时间：</span> <span class="text">2012-02-19 16:17:41</span>
            </span>
            </p>
            <p>
            <span class="leftSpan">
            <span class="title">注册资本：</span> <span class="text">5000000</span>
            </span>
              <span class="rightSpan">
            <span class="title">企业类型：</span> <span class="text">有限责任公司</span>
            </span>
            </p>
            <p><span class="title">注册地址：</span> <span class="text">上海市宝山区真陈路1000号6楼B座316室</span></p>
            <p style="overflow: hidden">
              <span class="title">经营模式：</span> <span class="text">贸易类</span>
              <span v-if="!open" class="right" style="color: #100F65;font-weight: 700"
                    @click.stop="open = true ">展开</span>
            </p>
            <template v-if="open">
              <p><span class="title">当前分类累计中标次数：</span> <span class="text">1</span></p>
              <p><span class="title">当前分类累计中标金额：</span> <span class="text">1892</span></p>
              <p>
                <span class="title">经营范围：</span>
                <span
                  class="text">金属材料、五金工具、橡胶制品、玻璃、陶瓷制品、塑料制品、普通机械设备及配件、机电产品及配件、电线电缆、化工产品及原料、过滤材料、密封件、磨具、磨料、电器电料批兼零。</span>
              </p>
              <van-button @click.stop="add" color="#100F65" type="primary" block>加为合格供应商</van-button>
            </template>
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
  import headerNav from '../../components/headerNav';
  import {DropdownMenu, DropdownItem,List,Empty, Cell, Icon, Button,Loading} from 'vant';
  export default {
    name: "taoSupplier",
    components: {
      headerNav,
      [DropdownMenu.name]: DropdownMenu,
      [DropdownItem.name]: DropdownItem,
      [Cell.name]: Cell,
      [Icon.name]: Icon,
      [Button.name]: Button,
      [List.name]: List,
      [Empty.name]: Empty,
      [Loading.name]: Loading,
    },
    data() {
      return {
        value1: 0,
        option1: [
          {text: '办公、劳防、清洁', value: 0},
          {text: '新款商品', value: "新款商品"},
          {text: '活动商品', value: 2},
        ],
        dataList: [], // 数据列表
        open: false, // 展开更多控制
        isLoding: false, // 加载状态
      }
    },
    methods: {
      add() {
      },
      changeValue(data) {
        console.log(data)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .tao {
    /deep/ .van-dropdown-menu__bar {
      box-shadow: 0 0 0 #ffffff;
      height: 40px;
    }
    > div {
      background-color: white;

      > section {
        display: flex;
        padding: 0 10px;
        > div {
          /*width: ;*/
          flex: 1;
          overflow: hidden;
          height: 40px;
          @include sc(14px, #0C274F);
          line-height: 40px;
          font-weight: 500;
          .van-icon {
            transform: rotate(90deg);
            padding-left: 5px;
          }
          /deep/ .van-dropdown-menu {
            width: 100% !important;
          }
        }
      }
    }
    main {
      padding: 10px 20px;
      background-color: #F5F5F5;
      section {
        background: #ffffff;
        margin-bottom: 10px;
        padding: 10px;
        text-align: left;
        border-radius: 3px;
        overflow: hidden;
        p {
          margin-top: 0;
          padding: 0;
          font-size: 12px;
          &:first-child {
            @include sc(14px, #464646);
            font-weight: 600;
          }
        }
        .title {
          @include sw(500, rgba(70, 70, 70, 1))
        }
        .text {
          color: #898989;
        }
        .leftSpan, .rightSpan {
          display: inline-block;
        }
        .leftSpan {
          width: 38%;
        }
        .rightSpan {
          width: 60%
        }
        .van-button {
          width: 75%;
          margin: 15px auto 0;
          border-radius: 5px;
        }
      }
    }
    .showOpen {
      height: 350px;
    }
    .fold {
      height: 135px;
    }
    .time {
      color: #323233;
      font-size: 0.15rem;
    }
  }

</style>
