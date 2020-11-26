<template>
  <div class="goodsType">
    <header-nav @setAddress="setAddress"></header-nav>
    <main>
      <van-tabs sticky title-active-color="#1A1E75" color="#1A1E75" background="#ffffff"
                v-model="tabActive">
        <van-tab title="分类选型">
        </van-tab>
        <van-tab title="供应商选型">
        </van-tab>
        <!--<van-tab title="品牌选型">-->
        <!--</van-tab>-->
      </van-tabs>
      <template v-if="tabActive == 0">
        <van-tree-select @click-nav="clickNav" height="100%" :items="items"
                         :main-active-index.sync="active1">
          <template #content>
            <section class="type" v-for="item in secondList" :key="item.className">
              <p v-if="item.children.length > 0 " class="textLeft white-space">{{item.className}}</p>
              <div>
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="data in item.children" :key="data.className"
                                 @click="toPath({classId: data.classId})">
                    <span class="white-space">{{data.className}}</span>
                  </van-grid-item>
                </van-grid>
              </div>
            </section>
            <van-divider :style="{width:'40%',textAlign:'center',borderColor:'#888888',margin:'20px auto'}">到底了
            </van-divider>
          </template>
        </van-tree-select>
      </template>
      <template v-if="tabActive == 1">
        <van-tree-select value-key="name" @click-nav="clicksupplier" height="100%" :items="supplierList"
                         :main-active-index.sync="stabActive">
          <template #content>
            <section class="type" v-if="stabActive < 2" v-for="(item,index) in supplierSecondList" :key="item.name">
              <p class="textLeft supplier "><span @click="toPath({typeId: item.supplierNameSel})">{{item.name}}</span>
              </p>
            </section>
            <section class="type" v-else v-for="(data,index) in supplierObj" :key="index">
              <div v-for="(obj,key) in data" :key="key">
                <p class="textLeft">{{key}}</p>
                <p v-for="(list,index) in obj" :key="list" class="textLeft supplier "><span
                  @click="toPath({searchValue:list,searchSupplier:'1'})">{{list}}</span>
                </p>
              </div>
            </section>
            <van-divider :style="{width:'40%',textAlign:'center',borderColor:'#888888',margin:'20px auto'}">到底了
            </van-divider>
          </template>
        </van-tree-select>
      </template>
    </main>
    <foot :active="active"></foot>

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
  </div>
</template>

<script>
  import headerNav from '../../components/headerNav';
  import {
    Popup, Picker,
    DropdownMenu,
    Divider,
    DropdownItem,
    Grid,
    GridItem,
    Image,
    Sidebar,
    SidebarItem,
    TreeSelect,
    Tabs,
    Tab
  } from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';
  import foot from '../../components/foot'
  import {mapState, mapMutations} from 'vuex'

  import {setSessionStorage, getSessionStorage} from "../../config/Utils";

  export default {
    name: "goodsType",
    components: {
      foot,
      [Popup.name]: Popup,
      [Picker.name]: Picker,
      headerNav,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Grid.name]: Grid,
      [Image.name]: Image,
      [Sidebar.name]: Sidebar,
      [Divider.name]: Divider,
      [GridItem.name]: GridItem,
      [TreeSelect.name]: TreeSelect,
      [SidebarItem.name]: SidebarItem,
      [DropdownMenu.name]: DropdownMenu,
      [DropdownItem.name]: DropdownItem,

    },
    data() {
      return {
        showArea: false,// 选择地区
        searchAreaName: "", // 选择地区缓存
        searchAreaCode: "", // 选择地区缓存
        areaList: [{values: [], defaultIndex: 0},
          {values: [], defaultIndex: 0},
          {values: [], defaultIndex: 0}],        //自定义数据三级结构

        supplierObj: [],
        active: 2,
        tabActive: 0,// tab类别
        active1: 0, // 菜单分类
        stabActive: 0,// tab类别
        catalogObj: {},
        items: [], // 分类菜单数据
        secondList: [], // 二级分类
        threeList: [], // 三级分类
        list: [], // 存储数据
        supplierList: [{text: '京东', supplierNameSel: 'jd'}, {text: '震坤行', supplierNameSel: 'zkh'}, {
          text: '自营',
          supplierNameSel: 'zy'
        }],
        supplierSecondList: [{name: '京东', supplierNameSel: 'jd'}]// 供应商二级分类
      }
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

      setAddress(data) { // 设置地址
        this.showArea = data
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
      getSupplierName() { // 获取真实供应商
        http.get(urls.selectAllSupplierName, {}).then(res => {
          if (res.success) {
            this.supplierObj = res.obj || [];
          }

        }).catch(err => {

        })
      },

      toPath(data) {
        this.$router.push({path: '/typeDetails', query: data});
      },

      clickNav(index) {
        let classId = this.items[index].classId;
        this.secondList = this.list[`class2${classId}`];
        this.secondList.forEach(item => {
          item.children = this.list[`class3${item.classId}`];
        })
      },

      clicksupplier(index) { // 点击供应商列表
        if (index == 0) {
          this.supplierSecondList = [{name: '京东', supplierNameSel: 'jd'}]// 供应商二级分类
        } else if (index == 1) {
          this.supplierSecondList = [{name: '震坤行', supplierNameSel: 'zkh'}]// 供应商二级分类
        }

      },

    },
    computed: {
      ...mapState(["catalog"]),
    },
    mounted() {
      this.getArea(1, ""); // 查询地区
      this.catalogObj = this.catalog;
      this.getSupplierName();
      if (getSessionStorage('filterAddress')) {
        let str = getSessionStorage('filterAddress');
        let arr = str.split('/');
        this.Set_ADDRESS(arr[1]);
      }
    },
    watch: {
      'catalogObj'() {   // 监听当前catalogObj 的变化，每进入页面就会监听
        if (this.catalogObj.class1 && this.catalogObj.class1.length > 0) {
          this.items = this.catalogObj.class1;
          this.items.forEach(item => {
            item.text = item.className
          });
          this.list = this.catalogObj;
          this.secondList = this.list[`class2${this.items[0].classId}`];
          this.secondList.forEach(item => {
            item.children = this.list[`class3${item.classId}`];
          })
        }
      },
      "catalog"() {  // 监听store this.catalogObj 值的变化，
        this.items = this.catalog.class1;
        this.items.forEach(item => {
          item.text = item.className
        });
        this.list = this.catalog;
        this.secondList = this.list[`class2${this.items[0].classId}`];
        this.secondList.forEach(item => {
          item.children = this.list[`class3${item.classId}`];
        })
      }
    }

  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .goodsType {
    /deep/ .van-dropdown-menu__bar {
      box-shadow: 0 0 0 #ffffff;
      height: 40px;
    }
    main {
      height: calc(100% - 120px);
      overflow: hidden;
      padding: 0 0 30px;
      box-sizing: border-box;
      .van-tree-select {
        width: 100%;
        margin-top: 5px;
      }
      .van-tree-select__nav {
        background-color: #ffffff;
        width: 100px;
        flex: 0 0 auto;
      }
      .van-sidebar-item {
        padding: 14px 0 14px 8px;
        background-color: #ffffff;
        color: #888888;
        text-align: left;
      }
      .van-tree-select__content {
        background-color: #F5F5F5;
      }
      .van-sidebar-item--select {
        @include sw(700, #100F65)
      }
      .van-sidebar-item--select::before {
        background-color: #100F65;
      }
      .type {
        padding: 0 15px 0 10px;
        /deep/ .van-grid-item {
          width: (100% / 3);
          text-align: left;
        }
        /deep/ .van-grid-item__content {
          padding: 8px 0;
          width: 100%;
        }
        img {
          @include wh(60px, 50px)
        }
        p {
          @include sw(700, #100F65);
          margin: 10px 0;
        }
        > div {
          padding: 5px;
          border-radius: 5px;
          background-color: #ffffff;
          img {
            @include wh(100%, 50px)
          }
        }
      }

    }
    .white-space {
      display: block;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /deep/ .van-sidebar-item__text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      margin-top: 5px;
    }
    .supplier {
      font-size: 16px;
      padding-left: 20px;
      color: #7E7E7E !important;
      font-weight: 400 !important;
    }
  }


</style>
