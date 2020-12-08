<template>
  <div class="home">
    <header>
      <nav>
        <div style="text-align: left">
             <span class="textLeft">
                 <span @click="showArea = true">
                    <van-icon name="location-o"/>
                  <span>{{this.address}}</span>
                 </span>
             </span>
          <span>威购商城 </span>
          <span class="textRight"> <van-icon :badge="messageCount" @click.stop="toPath('/moreMsg')"
                                             name="comment-o"/> </span>
        </div>
        <form class="search" action="">
          <van-search
            v-model="searchValue"
            shape="round"
            background="transparent"
            placeholder="请输入商品品类、名称、供应商、品牌"
            :left-icon="require('../../assets/Microphone.png')"
            :right-icon="require('../../assets/Find.png')"
            @search="clickImg(searchValue)"
            @click-right-icon="clickImg(searchValue)"
          />
        </form>
      </nav>
      <van-swipe :stop-propagation="false" :autoplay="2000" indicator-color="white">
        <van-swipe-item v-for="(image, index) in images"
                        :key="index">
          <template v-if="homeSwipe.length > 0">
            <img style="width: 100%;height: 100%" :src="image.url | imgSet"/>
          </template>
          <template v-else>
            <img style="width: 100%" :src="image"/>
          </template>
        </van-swipe-item>
      </van-swipe>
    </header>
    <p class="swipe">
      <van-notice-bar style="height: 30px;" @click.stop="toPath('/noticeCategory')" left-icon="volume"
                      :scrollable="false" color="#1f1f1f" background="#ffffff">
        <van-swipe
          style="height: 30px;line-height: 30px;"
          vertical
          class="notice-swipe"
          :autoplay="3000"
          :show-indicators="false">
          <van-swipe-item @click.stop="toPath('/noticeItem',{tencet: item.tencet})" v-for=" item in newList"
                          :key="item.id">
            {{item.title}}
          </van-swipe-item>
        </van-swipe>
      </van-notice-bar>
    </p>

    <main>
      <section class="notice">
        <p class="textLeft">
          <span>采购公告</span>
          <span class="right" @click="toPath('/moreNotice')">更多</span>
        </p>
        <section class="noticeList" v-for="item in buyNoticeList" :key="item.id">
          <div class="textLeft" @click="toPath('/noticeDetails',{id: item.id})">
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
      </section>
      <section class="scene">
        <p class="textLeft">
          <span>场景化</span>
        </p>
        <div>
          <span @click="toPath('/sceneModel')">
            <img src="../../assets/cj1.png" alt="">
          </span>
          <span @click="toPath('/sceneModel')">
            <img src="../../assets/cj2.png" alt="">
          </span>
        </div>
      </section>
      <section class="img">
        <van-tabs color="#9A9A9A" background="#F5F5F5" :border="false" swipeable v-model="tabValue">
          <van-tab title="行家精选">
            <van-grid :border="false" :column-num="4">
              <template v-for="item in selectImgs">
                <van-grid-item>
                  <template v-if="selImgs.length > 0">
                    <img @click="clickImg(item.link)" width="100%" :src="item.url | imgSet"/>
                  </template>
                  <template v-else>
                    <img width="100%" :src="item"/>
                  </template>
                </van-grid-item>
              </template>
            </van-grid>
          </van-tab>
          <van-tab title="热门品牌">
            <van-grid :border="false" :column-num="4">
              <template v-for="item in hotImg">
                <van-grid-item>
                  <template v-if="hotImgs.length > 0">
                    <img @click="clickImg(item.link)" width="100%" :src="item.url | imgSet"/>
                  </template>
                  <template v-else>
                    <img width="100%" :src="item"/>
                  </template>
                </van-grid-item>
              </template>
            </van-grid>
          </van-tab>
        </van-tabs>
      </section>
      <span class="top" @touchstart.prevent="handleScrollTop">— 返回顶部 —</span>

      <van-popup v-model="showArea" position="bottom">
        <van-picker
          show-toolbar
          title="请选择地区"
          value-key="areaName"
          :columns="areaList"
          @change="change"
          @cancel="showArea = false"
          @confirm="onConfirm"
        />
      </van-popup>
    </main>
    <foot></foot>
  </div>

</template>

<script>
  import {
    Swipe, Notify, Search, Popup, Picker, Tab, Tabs, NoticeBar, Image, SwipeItem, Icon, Field, Grid, GridItem, CellGroup
  } from 'vant';
  import foot from '../../components/foot';
  import urls from '../../utils/urls';
  import http from '../../utils/http';
  import {mapState, mapMutations} from 'vuex'

  import {setSessionStorage, getSessionStorage} from "../../config/Utils";

  export default {
    components: {
      [Popup.name]: Popup,
      [Picker.name]: Picker,
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
      [Icon.name]: Icon,
      [Field.name]: Field,
      [CellGroup.name]: CellGroup,
      [Search.name]: Search,
      [NoticeBar.name]: NoticeBar,
      [Grid.name]: Grid,
      [GridItem.name]: GridItem,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Image.name]: Image,
      [Notify.name]: Notify,
      foot

    },
    data() {
      return {
        messageCount: '',
        searchValue: '',
        showArea: false,// 选择地区
        searchAreaName: "", // 选择地区缓存
        searchAreaCode: "", // 选择地区缓存
        areaList: [{values: [], defaultIndex: 0},
          {values: [], defaultIndex: 0},
          {values: [], defaultIndex: 0}],        //自定义数据三级结构
        newList: [],//最新公告
        buyNoticeList: [], // 采购公告
        active: 0, // 底部导航索引
        tabValue: 0, // 标签页索引
        icon: require('../../assets/Microphone.png'),
        hasImages: false,
        hasHotImgs: false,
        hasSelectImgs: false,
        images: [], // 首页轮播
        image: [
          require('../../assets/banner1.jpg'),
          require('../../assets/banner2.jpg'),
          require('../../assets/banner3.jpg'),
        ],
        selectImgs: [
          require('../../assets/hangjia.png'),
          require('../../assets/airtac.jpg'),
          require('../../assets/kunlun.jpg'),
          require('../../assets/festo.png'),
          require('../../assets/mobil.jpg'),
          require('../../assets/weili.jpg'),
          require('../../assets/sanling.jpg'),
          require('../../assets/lianxiang.jpg'),
        ],
        hotImg: [
          require('../../assets/hp.jpg'),
          require('../../assets/airtac.jpg'),
          require('../../assets/kunlun.jpg'),
          require('../../assets/jsh.jpg'),
          require('../../assets/mobil.jpg'),
          require('../../assets/weili.jpg'),
          require('../../assets/sanling.jpg'),
          require('../../assets/lianxiang.jpg'),
        ],
        ready: null
      }
    },
    computed: {
      ...mapState(['address', 'hotImgs', 'selImgs', 'homeSwipe'])
    },
    methods: {
      ...mapMutations([
        'Set_ADDRESS',
      ]),

      change(picker, values, index) { // 省市区选择改变
        switch (index) {
          case 0://选择省
            this.areaList[1].values = [];//市清空
            this.areaList[2].values = [];//区清空
            break;
          case 1://选择市
            this.areaList[2].values = [];//区清空
            break;
        }
        if (index < 2) { // 2为区
          this.getArea(index + 2, values[index].areaCode);                        //传参 参数为上层选择的地区的code
        }
      },


      onConfirm(values) { // 选择地址确认
        if (!(values[2] && values[2].areaCode)) {
          return
        }
        this.searchAreaName = "";
        this.searchAreaCode = "";
        let arr = [];
        let arrCode = [];

        values.forEach((item, index) => {
          if (item && item.areaCode) {
            arr.push(item.areaName);
            arrCode.push(item.areaCode)
          }
        });
        this.Set_ADDRESS(arr[1]);

        this.searchAreaName = arr.join('/');
        this.searchAreaCode = arrCode.join('_');

        setSessionStorage('filterAddress', this.searchAreaName);  // 定位地址
        setSessionStorage('filterAddressCode', this.searchAreaCode); // 定位地址code
        this.showArea = false;
      },

      clickImg(data) {
        this.$router.push({path: '/typeDetails', query: {searchValue: data}});
      },

      toPath(url, data) {
        if (data) {
          this.$router.push({path: url, query: data}); //跳转地址设置
          return
        }
        this.$router.push(url)
      },


      getArea(level, code) { // 查询省市区乡
        http.post(urls.queryArea, {areaLevel: level, areaFid: code}).then(res => {
          switch (level) {
            case 1: //省
              this.areaList[0].values = [
                {areaName: '请选择省'},
                ...res
              ];
              break;
            case 2: // 市
              this.areaList[1].values = [
                {areaName: '请选择市'},
                ...res
              ];

              break;
            case 3: // 区
              this.areaList[2].values = [
                {areaName: '请选择区/县'},
                ...res
              ];

              break;
          }
        }).catch(err => {

        })
      },


      getNewList() {
        http.get(urls.queryNoticeList, { // 查询最新公告
          noType: "01",
          pagesNum: 1
        }).then(res => {
          this.newList = res.noticeList;
        }).catch(err => {
        });
      },

      getNoticeType() { // 搜索
        let params = {
          page: '1',
          rows: "3",
          noticeType: "1",
          martSign: '50',
          rfqMethod: '',
          ouName: ''
        };

        http.post(urls.searchNotice, params).then(res => {
          this.buyNoticeList = res.list || [];
        }).catch(err => {

        })
      },

      getMessageCount() {
        http.get(urls.queryUserMessageCount, {domainCode: 'beps'}).then(res => {
          if (res == '系统异常，请联系运营商！') {
            this.messageCount = ''
          } else {
            this.messageCount = res
          }

        }).catch(err => {

        })
      },

      handleScrollTop() { // 回到顶部
        window.scrollTo(0, 0);
      },
    },

    mounted() {
      this.getNewList();// 查询最新共公告
      this.getNoticeType();
      this.getMessageCount();// 查询最新共公告
    },

    beforeUpdate() {
      this.images = this.homeSwipe.length > 0 ? this.homeSwipe : this.image;
      this.hotImg = this.hotImgs.length > 0 ? this.hotImgs : this.hotImg;
      this.selectImgs = this.selImgs.length > 0 ? this.selImgs : this.selectImgs;
    },

    activated() {
      this.getMessageCount();// 查询最新共公告
      this.getNoticeType();

      this.images = this.homeSwipe.length > 0 ? this.homeSwipe : this.image;
      this.hotImg = this.hotImgs.length > 0 ? this.hotImgs : this.hotImg;
      this.selectImgs = this.selImgs.length > 0 ? this.selImgs : this.selectImgs;
      if (getSessionStorage('filterAddress')) {
        let str = getSessionStorage('filterAddress');
        let arr = str.split('/');
        this.Set_ADDRESS(arr[1]);
      }
    },

    created() {
      this.getArea(1, ""); // 查询地区
    }

  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .home {
    .search {
      margin: 0;
      .van-search__content {
        padding: 0;
      }
      /deep/ .van-search {
        padding-top: 5px;
      }
      .van-cell {
        line-height: 30px;
        padding: 5px 8px;
      }
      /deep/ .van-icon {
        font-size: 14px;
      }
    }
    header {
      height: 324px;
      nav {
        position: absolute;
        z-index: 10;
        width: 100%;
        color: #D8D8D8;
        > div {
          display: flex;
          > span {
            flex: 1;
            padding: 10px 15px;
            font-size: .14rem;
            &:nth-child(2) {
              text-align: center;
              font-size: .18rem;
            }
          }
        }
        /deep/ .van-field {
          @include wh(335px, 40px);
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 12px 45px 0 rgba(0, 0, 0, 0.11);
          border-radius: 20px;
          margin: 0 auto;
        }
      }
      .van-swipe {
        height: 100%;
      }
    }
    .swipe {
      margin: 0;
      /deep/ .van-notice-bar {
        height: 30px;
      }
      /deep/ .van-notice-bar__wrap {
        padding-left: 10px;
      }
    }

    main {
      background: #F5F5F5;
      padding: 1px 20px 70px;
      .notice {
        p {
          margin: 12px 0;
          overflow: hidden;
          span {
            &:first-child {
              font-size: 15px;
              @include sw(500, rgba(31, 31, 31, 1));
            }
            &:last-child {
              font-weight: 400;
              @include sc(12px, rgba(175, 175, 175, 1));
            }
          }
        }
        .noticeList {
          display: flex;
          margin-bottom: 10px;
          @include wh(100%, 44px);
          background: rgba(255, 255, 255, 1);
          border-radius: 5px;
          > div {
            flex: 1;
            line-height: 44px;
            &:first-child {
              padding-left: 10px;
              @include sc(14px, rgba(31, 31, 31, 1));
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            &:last-child {
              span {
                display: inline-block;
              }
              @include sc(12px, rgba(122, 122, 122, 1));
              .date {
                margin-right: 20px;
              }
            }
          }
        }
      }
      .scene div {
        span {
          float: left;
          @include wh(46%, 94px);
          margin: 0 2%;
          img {
            width: 100%;
            height: 100%;
          }
        }
        height: 94px;
      }
      /deep/ .van-tabs__content {
        margin-top: 20px;
      }
      .top {
        display: inline-block;
        text-align: center;
        margin-top: 20px;
        @include sc(12px, #100F65)
      }
    }
    .selectImg, .hotImg {
      width: 65px;
      height: 50px;
    }
    .img .van-grid {
      @include wh(335px, 165px)
    }
  }


</style>
