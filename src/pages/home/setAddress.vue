<template>
  <div class="address">
    <header>
      <span @click="toPath" style="text-align: left;width: 9%;margin-left: 10px">
        <van-icon size="16px" name="arrow-left"/>
       </span>
      <span style="width: 80%">
        <van-search
        v-model="value"
        shape="round"
        placeholder="请输入城市查询"
      /></span>

    </header>
    <form action="">

    </form>
    <main>
      <div>
        <p>你所在的地区</p>
        <van-grid :gutter="15" :column-num="3">
          <van-grid-item text="文字"/>
        </van-grid>
      </div>
      <div>
        <p>热门城市</p>
        <van-grid :gutter="15" :column-num="3">
          <van-grid-item v-for="item in 8" :key="item" text="文字"/>
        </van-grid>
      </div>

      <div class="font">
        <van-index-bar>
          <van-index-anchor index="A"/>
          <van-cell title="文本"/>
          <van-cell title="文本"/>
          <van-cell title="文本"/>

          <van-index-anchor index="B"/>
          <van-cell title="文本"/>
          <van-cell title="文本"/>
          <van-cell title="文本"/>

          <van-index-anchor index="C"/>
          <van-cell title="文本"/>
          <van-cell title="文本"/>
          <van-cell title="文本"/>


        </van-index-bar>
      </div>
    </main>
  </div>
</template>

<script>
  import {NavBar, Field, Icon, Search, Grid, Cell, CellGroup, GridItem, IndexBar, IndexAnchor} from 'vant';
  import headerNav from '../../components/headerNav';

  export default {
    name: "setAddress",
    components: {
      [Search.name]: Search,
      [NavBar.name]: NavBar,
      [Grid.name]: Grid,
      [GridItem.name]: GridItem,
      [IndexBar.name]: IndexBar,
      [IndexAnchor.name]: IndexAnchor,
      [Cell.name]: Cell,
      [Field.name]: Field,
      [CellGroup.name]: CellGroup,
      [Icon.name]: Icon,

      headerNav

    },
    data() {
      return {
        value: '',
        show: false,

      }
    },
    methods: {
      toPath() {
        this.$router.go(-1)
      },
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  header{
    text-align: left;
    span{
      display: inline-block;
    }
    .van-icon{
      position: relative;
      top:2px
    }
  }

  .address {
    background-color: #ffffff;
    padding: 0 10px;
    box-sizing: border-box;
  }

  /deep/ .van-nav-bar__title {
    max-width: 80%
  }

  main {
    > div {
      p {
        text-align: left;
        padding: 0 15px;
        @include sc(.14rem, rgba(161, 161, 161, 1))
      }
      /deep/ .van-grid-item__content {
        padding: 10px 0;
      }
      /deep/ .van-index-bar {
        text-align: left;
        padding-left: 5px;
      }
      /deep/ .van-index-anchor, .van-cell {
        color: #A1A1A1 !important;
      }
      /deep/ .van-index-anchor--sticky {
        color: #07c160 !important;
      }
    }
  }


</style>
