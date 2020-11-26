<template>
  <div class="typeDetails">
    <header-nav @getSearch="query" :searchValue="keyword" :jump="false" :licon="'arrow-left'"
                :riconShow="false"></header-nav>
    <div>
      <section class="imgs">
        <div>
          <van-dropdown-menu>
            <van-dropdown-item @change="changeItem()" v-model="interSysCode" :options="option1"/>
          </van-dropdown-menu>
        </div>
        <div>
          <span @click="salesVolume()">销量
            <img v-if="salesBol" src="../../assets/up1.png" alt="">
            <img v-else src="../../assets/down.png" alt="">
          </span>
        </div>
        <div class="pirce">
          <span @click="sortPrice()">价格
            <img v-if="priceBol" src="../../assets/up1.png" alt="">
            <img v-else src="../../assets/down.png"
                 alt="">
</span>
        </div>
        <div class="shaixuan" @click="openPopup()">
          <span style="display: inline-block;height: 13px;border-left: 1px solid #979797;margin-right: 5px"></span>
          筛选
          <img width="14px" height="14px" src="../../assets/shaixuan.png" alt="">
        </div>
      </section>

      <van-popup v-model="popupShow" position="right" :style="{ height:'100%',width: '75%' }">
        <p class="screen">
          <span>筛选</span>
          <span><van-icon @click="popupShow = false" size="20px" name="cross"/></span>
        </p>
        <div class="type">
          <section>
            <h5>供应商</h5>
            <div>
              <van-grid :gutter="8" :border="false" :column-num="3">
                <van-grid-item class="chooseItem" :class="{bg:item.value == supplierNameSel}"
                               @click="clickItem('supplierNameSel',$event,item.value)"
                               v-for="(item,index) in supplier" :key="item.value">
                  {{item.text}}
                </van-grid-item>
              </van-grid>
            </div>
          </section>
          <section>
            <h5>分类</h5>
            <div>
              <van-grid :gutter="8" :border="false" :column-num="2">
                <van-grid-item class="chooseItem" @click="clickItem('className',$event,item.className) "
                               v-for="item in listNameFL"
                               :key="item.className">
                  {{item.className}}
                </van-grid-item>
              </van-grid>
            </div>
          </section>
          <section>
            <div class="perOPen">
              <h5>品牌</h5>
              <span @click="openArrow = !openArrow" class="open">展开 <van-icon v-if="!openArrow" name="arrow-down"/>  <van-icon
                v-if="openArrow" name="arrow-up"/></span>
            </div>
            <div>
              <van-grid :gutter="8" :border="false" :column-num="2">
                <template v-if="!openArrow">
                  <van-grid-item @click="clickItem('commodityBrand',$event,item.commodityBrand)" class="chooseItem"
                                 v-for="(item,index) in listNamePPDeep"
                                 :key="item.commodityBrand">
                    {{item.commodityBrand}}
                  </van-grid-item>
                </template>
                <template v-else>
                  <van-grid-item class="chooseItem" @click="clickItem('commodityBrand',$event,item.commodityBrand)"
                                 v-for="(item) in listNamePP" :key="item.commodityBrand">
                    {{item.commodityBrand}}
                  </van-grid-item>
                </template>

              </van-grid>
            </div>
          </section>
          <section v-if="isLogin">
            <div class="perOPen">
              <h5>价格区间</h5>
            </div>
            <div class="inputBox">
              <span>
              <van-field placeholder="最低价" v-model="minPrice" type="number"/></span>
              <span>——</span>
              <span><van-field placeholder="最高价" v-model="maxPrice" type="number"/></span>
            </div>
          </section>

          <section v-if="supplierNameSel == 'jd'">
            <div class="perOPen">
              <h5>地区选择</h5>
            </div>
            <van-field
              readonly
              clickable
              :value="searchAreaName"
              label="地区"
              :error="false"
              placeholder="选择省市区"
              @click="showArea = true"
              :rules="[{ required: true, message: '请选择省市区' }]"
            />

          </section>
        </div>
        <div class="button">
          <span @click.stop="reset()">重置</span>
          <span @click.stop="confirm()">确定</span>
        </div>

      </van-popup>
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

    <main>
      <div>
        <template v-if="isLoding">
          <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
        </template>
        <template v-else>
          <template v-if="goodsList.length > 0">
            <div class="company">
              <span v-if="companyName">{{companyName}}</span>
              <span v-if="companyNews">{{companyNews}}</span>
            </div>
            <van-list
              offset="150"
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <section v-if="item.price" v-for="item in goodsList" @click="toPath(item.commodityNo)">
                <p>
                  <img :src="item.attachList[0].filePath | setImg" alt="">
                </p>
                <p>
                  <span>{{item.commodityName}}</span>
                  <span>{{item.supplierName}}</span>
                  <span>货号：{{item.commodityArticleNo}}</span>
                  <span>内部系统编码：{{item.interSysCode}}</span>


                  <template v-if="!isLogin">
                    <template v-if="item.price!=0 && item.price!=null && item.price!='0.00'">
                      <template v-if="item.companyId == 'UK4711' || item.companyId == 'U48102'">
                        <span>市场价： ¥{{ Number(item.price) * 1.05 | fixNum}} {{item.commodityUnit}}</span>
                      </template>
                      <template v-else-if="item.companyId == 'U17686'">
                        <span>市场价： ¥{{item.price | fixNum}} {{item.commodityUnit}}</span>
                      </template>
                      <template v-else>
                        <span>市场价： {{item.moneyType}} {{item.price | fixNum}} {{item.commodityUnit}}</span>
                      </template>

                    </template>
                    <template v-else>
                      <span>查看价格请登录</span>
                    </template>
                  </template>
                  <template v-else-if="item.commodityPrice =='未配置买卖关系' || item.commodityPrice =='购买权限未开通'">
                    <template v-if="item.companyId=='UK4711'||item.companyId == 'U48102'">
                      <span>市场价： ¥{{ Number(item.price) * 1.05 | fixNum}} {{item.commodityUnit}}</span>
                    </template>
                    <template v-else-if="item.companyId=='U17686'">
                      <span>市场价： ¥{{ item.price | fixNum}} {{item.commodityUnit}}</span>
                    </template>
                    <template v-else>
                      <span>市场价： {{item.moneyType}} {{item.price | fixNum}} {{item.commodityUnit}}</span>
                    </template>
                  </template>
                  <template v-else>
                    <template v-if="item.companyId=='UK4711'||item.companyId == 'U48102'">
                      <span>市场价： ¥{{ Number(item.price) * 1.05 | fixNum}} {{item.commodityUnit}}</span>
                      <span>会员价： ¥{{Number(item.commodityPrice)| fixNum}}</span>
                    </template>
                    <template v-else-if="item.companyId=='U17686'">
                      <span>市场价： ¥{{item.price | fixNum}} {{item.commodityUnit}}</span>
                      <span>会员价： ¥{{item.commodityPrice | fixNum}}</span>
                    </template>
                    <template v-else>
                      <span>市场价： {{item.moneyType}} {{item.price | fixNum}} {{item.commodityUnit}}</span>

                      <span>会员价： ¥{{item.commodityPrice | fixNum}} {{item.commodityUnit}}</span>
                      <!--<span>会员价： ¥{{item.commodityPrice | fixNum}}</span>-->
                    </template>
                  </template>


                </p>
                <p>
                  <van-icon color="#707070" name="arrow" size="20"/>
                </p>
              </section>
            </van-list>
          </template>
          <template v-else-if="goodsList.length == 0 ">
            <van-empty description="暂无数据"/>
          </template>
        </template>
      </div>
    </main>

  </div>

</template>

<script>
  import headerNav from '../../components/headerNav';
  import {
    DropdownMenu,
    Toast,
    Sticky,
    CellGroup,
    Field,
    DropdownItem,
    GridItem,
    Cell,
    Icon,
    Empty,
    List,
    PullRefresh,
    Popup,
    Loading,
    Grid,
    Picker
  } from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';
  import {getlocalStorage, getSessionStorage, removeSessionStorage, setSessionStorage} from "../../config/Utils";

  export default {
    name: "typeDetails",
    components: {
      headerNav,
      [Picker.name]: Picker,
      [DropdownMenu.name]: DropdownMenu,
      [DropdownItem.name]: DropdownItem,
      [Cell.name]: Cell,
      [List.name]: List,
      [Toast.name]: Toast,
      [CellGroup.name]: CellGroup,
      [Field.name]: Field,
      [Grid.name]: Grid,
      [Icon.name]: Icon,
      [Empty.name]: Empty,
      [Popup.name]: Popup,
      [Sticky.name]: Sticky,
      [GridItem.name]: GridItem,
      [Loading.name]: Loading,
      [PullRefresh.name]: PullRefresh,
    },
    data() {
      return {
        areaList: [{values: [], defaultIndex: 0},
          {values: [], defaultIndex: 0},
          {values: [], defaultIndex: 0}],        //自定义数据三级结构
        searchAreaCode: '',// 地区选择code
        searchAreaName: "", // 地区选择
        showArea: false,// 选择地区
        isLogin: false,//是否登录
        number: 0,
        openArrow: false, // 筛选品牌展开控制
        maxPrice: '',//筛选最高价格
        minPrice: '',//筛选最低价格
        page: 1, // 默认页码
        keyword: "", //查询条件
        refreshing: false,// 下拉加载
        isLoding: true,// 页面加载
        loading: false,//数据滚动加载
        finished: false,//全部加载完成
        goodsList: [],//商品集合
        popupShow: false, //筛选框出现
        orderBySeq: '', //排序标记
        priceBol: true,// true 价格从大到小，false 价格从小到大
        salesBol: true, // 销量 true 从大到小 false从小到大
        interSysCode: 0,// 有无编码 0 全部 1 有编码 2 无编码
        orderByName: '', // 销量 、价格排序类别
        listNameFL: [],// 筛选分类集合；
        listNamePP: [],// 筛选品牌集合
        listNamePPDeep: [],// 筛选品牌集合
        supplierNameSel: '', // 供应商字段
        className: '',//类别字段
        commodityBrand: '',// 品牌字段
        companyNews:'1', // 供应商简介
        companyName:'1',// 供应商名称
        option1: [
          {text: '全部', value: 0},
          {text: '有编码商品', value: 1},
          {text: '无编码商品', value: 2},
        ],
        supplier: [
          {text: '京东', value: 'jd'},
          {text: '震坤行', value: 'zkh'},
          {text: '自营', value: 'zy'},
        ],
      }
    },
    methods: {

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
        this.searchAreaName = arr.join('/');
        this.searchAreaCode = arrCode.join('_');
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


      toPath(data) {
        this.$router.push({path: '/goodsDetails', query: {id: data}})
      },

      openPopup() {
        this.popupShow = true;
        this.openArrow = false;
      },

      onLoad() { //滚动加载
        this.page += 1;
        this.getGoodsList()
      },

      changeItem() { // 选择框变更
        this.goodsList = [];
        this.isLoding = true;
        this.getGoodsList()
      },

      sortPrice() {//价格排序
        this.page = 1;
        this.priceBol = !this.priceBol;
        this.orderByName = 'PRICE';
        //  降序
        if (this.priceBol) {
          this.orderBySeq = 'asc' // 升序
        } else {
          this.orderBySeq = 'desc'  //  降序
        }
        this.goodsList = [];
        this.isLoding = true;
        this.getGoodsList()
      },
      salesVolume() { // 销量排序
        this.salesBol = !this.salesBol;
        this.orderByName = 'CUMULATIVE_PURCHASE_QUANTITY';
        this.page = 1;
        if (this.salesBol) {
          this.orderBySeq = 'asc' // 升序
        } else {
          this.orderBySeq = 'desc' // 降序
        }
        this.goodsList = [];
        this.isLoding = true;
        this.getGoodsList()
      },
      searchGoodsList() { // 搜索商品
        const classId = this.$route.query.classId || ""; // 根据菜单跳转查询
        const searchValue = this.$route.query.searchValue || ""; //根据搜索条件查询
        const searchSupplier = this.$route.query.searchSupplier || ""; //根据供应商查询
        let params = {
          headType: 1,
          keyword: searchValue,
          classId: classId,
          // searchSupplier: searchSupplier
        };
        http.get(urls.toCommodityView, params).then(res => {
          let list = res.commodityVos || [];
          this.listNameFL = res.listNameFL || [];
          this.listNamePP = res.listNamePP || [];
          if (this.listNamePP.length > 5) {
            this.listNamePPDeep = this.listNamePP.slice(0, 4)
          } else {
            this.listNamePPDeep = this.listNamePP
          }
          this.companyName =  res.companyName;
          this.companyNews =  res.companyNews;
          this.goodsList = this.goodsList.concat(list);
          this.isLoding = false;
        }).catch(err => {
        });
      },

      getGoodsList() { // 查询商品
        const classId = this.$route.query.classId || ""; // 根据菜单跳转查询
        const searchValue = this.$route.query.searchValue || ""; //根据搜索条件查询
        const searchSupplier = this.$route.query.searchSupplier || ""; //根据供应商条件查询

        let params = {
          page: this.page,
          rows: 50,
          classId: classId,
          keyword: searchValue,
          // searchSupplier: searchSupplier,
          interSysCode: this.interSysCode,
          className: this.className,// 类别字段
          supplierNameSel: this.supplierNameSel,// 供应商类型
          commodityBrand: this.commodityBrand,// 品牌字段
          orderByName: this.orderByName,//排序字段
          orderBySeq: this.orderBySeq,//排序字段升序 asc 降序 desc
          HigherPrice: this.maxPrice, // 最高价
          LowerPrice: this.minPrice, // 最低价
          searchAreaCode: this.searchAreaCode // 选择省市区乡code
        };
        http.post(`${urls.queryCommodity}?ajaxCmd=classTable`, params).then(res => {
          if (res.success) {
            console.log(this.goodsList.length);
            console.log(res.obj.model.records);
            let list = res.obj.model.commodityVos || [];
            this.goodsList = this.goodsList.concat(list);
            this.loading = false;
            this.isLoding = false;
            if (res.obj.model.commodityVos.length == 0) {
              this.finished = true
            }
          } else {
            Toast.fail(res.msg)
          }
        }).catch(err => {
        });
      },

      clickItem(name, ev, data) {
        switch (name) {
          case 'supplierNameSel': {
            this.supplierNameSel = data
          }
            break;
          case 'className': {
            this.className = data
          }
            break;
          case 'commodityBrand': {
            this.commodityBrand = data
          }
            break;
        }
        // ev 当前点击元素
        let node = ev.target.parentNode.parentNode.childNodes;// 当前点击元素父元素的同类集合
        node.forEach(item => {
          item.childNodes[0].style.backgroundColor = '#F5F5F5';
          item.childNodes[0].style.color = '#2c3e50';
        });
        ev.target.style.backgroundColor = '#fb5630';
        ev.target.style.color = '#fff'
      },

      reset() { // 重置筛选
        this.searchAreaName = "";
        this.searchAreaCode = "";
        this.commodityBrand = '';
        this.className = '';
        this.supplierNameSel = '';
        this.minPrice = '';
        this.maxPrice = '';
        let doc = document.querySelectorAll('.chooseItem');
        doc.forEach(item => {
          item.childNodes[0].style.backgroundColor = '#F5F5F5';
          item.childNodes[0].style.color = '#2c3e50';
        })
      },
      confirm() { // 确认筛选

        if ((this.minPrice && !this.maxPrice) || (this.maxPrice && !this.minPrice)) { // 最高最低价都输或都不输
          Toast('请输入最低价和最高价！');
          return
        }
        if (this.minPrice && this.maxPrice && (Number(this.maxPrice) <= Number(this.minPrice))) { // 价格不为空且最高价小于最低价
          Toast('最高价需大于最低价!');
          return
        }
        setSessionStorage('filterAddress', this.searchAreaName);
        setSessionStorage('filterAddressCode', this.searchAreaCode);

        this.page = 1;
        this.goodsList = [];
        this.isLoding = true;
        this.getGoodsList();
        this.popupShow = false;
      },
      query(data) {
        this.goodsList = [];
        this.keyWord = data;
        this.searchGoodsList()
      }
    },
    watch: {
      $route() {   // 监听路由参数变化重新加载 当前路由跳转自身改变路由后挂在的参数时使用
        this.goodsList = [];
        this.isLoding = true;
        this.searchGoodsList()
      }
    },

    mounted() {
      getSessionStorage('filterAddress') && (this.searchAreaName = getSessionStorage('filterAddress'));

      this.getArea(1, "")  // 查询地区
      this.isLogin = getlocalStorage("token") ? true : false;
      this.keyword = this.$route.query.searchValue || "";
      this.goodsList = [];
      this.isLoding = true;
      console.log(this.$route.query.typeId);
      if (this.$route.query.typeId) { // 从供应商菜单京东 震坤行
        this.supplierNameSel = this.$route.query.typeId;
        this.getGoodsList(); // 分页查询接口
      } else {
        this.searchGoodsList() // 搜索查询接口
      }
    },

  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .typeDetails {
    .company{
      text-align: left;
      padding: 0 5px;
      span{
        letter-spacing: 0.6px;
        display: block;
        line-height: 25px;
        @include sc(15px, #5f5f5f);
        &:first-child{
          color:#0b0b84;
          font-weight: 600
        }

      }
    }
    > div {
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
      }
    }
    .bg /deep/ .van-grid-item__content {
      background-color: #fb5630;
      color: #fff;
    }
    main {
      height: calc(100% - 100px);
      padding-top: 10px;
      box-sizing: border-box;
      > div {
        box-sizing: border-box;
        @include wh(100%, 100%);
        background-color: #ffffff;
        border-top-left-radius: 14px;
        border-top-right-radius: 14px;
        padding: 10px;
        section {
          display: flex;
          overflow: hidden;
          margin: 10px 0;
          p {
            flex-shrink: 0;
            margin: 0;
            &:first-child {
              box-sizing: border-box;
              width: 30%;
              padding: 0 5px;
              img {
                @include wh(85px, 90px);
                position: relative;
                top: 50%;
                transform: translateY(-50%);
              }
            }
            &:nth-child(2) {
              text-align: left;
              width: 60%;
              padding-left: 5px;
              span {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-top: 4px;
                display: block;
                @include sc(12px, rgba(95, 95, 95, 1));
                &:first-child {
                  @include sc(14px, #515151);
                  font-weight: 600;
                }
                &:last-child {
                  @include sc(15px, #FF6464);

                }
              }

            }
            &:last-child {
              width: 10%;
              .van-icon {
                top: 50%;
                transform: translateY(-50%);
              }
            }
          }
        }
      }
    }
    .shaixuan img, .shaixuan span {
      position: relative;
      top: 2px;
    }
  }

  .screen {
    font-size: 17px;
    padding: 0 10px;
    margin: 15px 0;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
    span {
      &:first-child {
        float: left;
      }
      &:nth-of-type(2) {
        float: right;
      }
    }
  }

  .type {
    margin: 20px 0 60px;
    section {
      h5 {
        text-align: left;
      }
      padding: 0 10px;
      > div {
        font-size: 14px;
        overflow: hidden;
        text-align: center;
      }
      span {
        display: inline-block;
        background-color: #F5F5F5;
        padding: 5px 12px;
      }
      .perOPen {
        position: relative;
      }
      .open {
        background-color: white;
        position: absolute;
        top: 20px;
        right: 0;
      }
      /deep/ .van-grid-item__content {
        background-color: #F5F5F5;
        padding: 8px;
      }
    }
  }

  .inputBox {
    display: flex;
    /deep/ .van-cell {
      padding: 0 !important;
    }
    /deep/ .van-field__control {
      border: 1px solid #2c3e50;
    }
    span {
      width: 45%;
      box-sizing: border-box;
      flex-shrink: 0;
      background-color: #fff !important;
      padding: 5px 10px !important;
      &:first-child, &:last-child {
        width: 45%;
      }
      &:nth-child(2) {
        padding: 0 !important;
        width: 10%;
        line-height: 35px;
        color: #969799;
      }
      input {
        width: 100%;
        height: 25px;
      }
    }
  }

  .imgs {
    img {
      @include wh(10px, 14px);
      position: relative;
      top: 2px;
      left: 2px;
    }
  }

  .button {
    margin-bottom: 20px;
    text-align: center;
    span {
      border-radius: 5px;
      font-size: 14px;
      display: inline-block;
      width: 80px;
      height: 30px;
      line-height: 30px;
      color: #fff;
      &:first-child {
        background-color: #fb5630;
      }
      &:last-child {
        margin-left: 10px;
        background-color: #100F65;
      }
    }
  }

</style>
