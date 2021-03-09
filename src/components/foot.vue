<template>
  <footer v-if="hideshow">
    <van-tabbar v-model="value">
      <van-tabbar-item v-for="(item, index) in tabbars"
                       :key="item.name" :to="item.path">
        <template #icon="props">
          <img :src="props.active ? item.active : item.normal">
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </footer>
</template>

<script>
  import {Tabbar, TabbarItem} from 'vant';
  import {mapState} from 'vuex'

  export default {
    name: "foot",
    components: {
      [Tabbar.name]: Tabbar,
      [TabbarItem.name]: TabbarItem,
    },
    data() {
      return {
        docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
        showHeight: document.documentElement.clientHeight,   //实时屏幕高度
        hideshow: true, //显示或者隐藏footer
        value: this.active,//当前选择的底部导航的索引
        tabbars: [
          {
            path: "/home",
            title: "首页",
            active: require("../assets/syc.png"),
            normal: require("../assets/sync.png")
          },
          {
            path: "/sceneModel",
            title: "场景",
            active: require("../assets/cjc.png"),
            normal: require("../assets/cjn.png")
          },
          {
            path: "/goodsType",
            title: "分类",
            active: require("../assets/flc.png"),
            normal: require("../assets/flnc.png")
          },
          {
            path: "/shopCart",
            title: "购物车",
            active: require("../assets/gwc.png"),
            normal: require("../assets/gwnc.png")
          },
          {
            path: "/personCenter",
            title: "个人中心",
            active: require("../assets/xzc.png"),
            normal: require("../assets/xznc.png")
          }
        ]
      };
    },
    // props: ['active'],
    methods: {},
    computed: {
      ...mapState(['active']),
    },
    mounted() {
      this.value = this.active;
      window.onresize = () => {
        return (() => {
          this.showHeight = document.documentElement.clientHeight;

        })();
      };
    },
    activated() {
      this.value = this.active;
    },
    watch: {
      showHeight() {
        if (this.docmHeight > this.showHeight + 130) {
          this.hideshow = false
        } else {
          this.hideshow = true
        }
      }
    }
  }
</script>

<style scoped lang="scss">

  /deep/ .van-tabbar-item__icon img {
    height: 23px;
    width: 26px
  }
</style>
