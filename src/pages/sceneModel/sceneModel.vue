<template>
  <div>
    <header-nav @setAddress="setAddress"></header-nav>
    <div>
      <van-swipe :autoplay="2000" indicator-color="white">
        <van-swipe-item v-for="(image, index) in images" :key="index">

          <template v-if="sceneSwipe.length > 0">
            <img style="width: 100%;height: 100%" :src="image.url | imgSet"/>
          </template>
          <template v-else>
            <img style="width: 100%" :src="image"/>
          </template>
        </van-swipe-item>
      </van-swipe>
    </div>
    <main>
      <section v-for="item in sceneList">
        <p class="textLeft">{{item.sceneName}}</p>
        <img @click="details(item.sceneDetailMap,item.imgUrl)" :src="item.imgUrl | setImg" alt="">
      </section>

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
  import {NoticeBar, Swipe, Popup, Picker, SwipeItem} from 'vant';
  import {setSessionStorage, getSessionStorage, removeSessionStorage} from "../../config/Utils";
  import headerNav from '../../components/headerNav'
  import foot from '../../components/foot'
  import urls from "../../utils/urls";
  import http from "../../utils/http";
  import {mapMutations, mapState} from 'vuex'

  export default {
    name: "sceneModel",
    components: {
      [Popup.name]: Popup,
      [Picker.name]: Picker,
      [NoticeBar.name]: NoticeBar,
      [SwipeItem.name]: SwipeItem,
      [Swipe.name]: Swipe,
      headerNav,
      foot
    },
    data() {
      return {
        showArea: false,// 选择地区
        searchAreaName: "", // 选择地区缓存
        searchAreaCode: "", // 选择地区缓存
        areaList: [{values: [], defaultIndex: 0},
          {values: [], defaultIndex: 0},
          {values: [], defaultIndex: 0}],        //自定义数据三级结构
        sceneList: [],// 场景集合
        active: 1,
        images: [],
        image: [
          require('../../assets/cjbanner1.jpg'),
          require('../../assets/cjbanner2.jpg'),
        ]
      }
    },
    computed: {
      ...mapState(['sceneSwipe'])
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

        setSessionStorage('filterAddress', this.searchAreaName);
        setSessionStorage('filterAddressCode', this.searchAreaCode);
        this.showArea = false;
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


      details(data, img) {
        setSessionStorage("senceDetails", data);
        this.$router.push({path: '/senceDetails', query: {img: img}})
      },
      getsences() {
        http.get(urls.querySceneCommodity, {}).then(res => {
          this.sceneList = res.scene
        }).catch(err => {

        })
      },
      setAddress(data) {
        this.showArea = data
      }
    },
    mounted() {
      this.getArea(1, ""); // 查询地区
      this.getsences();
    },
    beforeUpdate() {
      this.images = this.sceneSwipe.length > 0 ? this.sceneSwipe : this.image;
    },
    activated() {
      if (getSessionStorage('filterAddress')) {
        let str = getSessionStorage('filterAddress');
        let arr = str.split('/');
        this.Set_ADDRESS(arr[1]);
      }
      removeSessionStorage("senceDetails")
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  main {
    background: #F5F5F5;
    padding: 1px 20px 70px;
    section {
      p {
        @include sc(14px, #5D5D5D);
        font-weight: 500;
      }
      img {
        height: 188px;
        width: 100%;
      }
    }
  }

</style>
