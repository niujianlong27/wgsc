<template>
  <div class="goodsDetails">
    <nav v-show="topShow">
      <van-tabs v-show="topShow" @click="isClick" v-model="active">
        <van-tab title="宝贝"></van-tab>
        <!--<van-tab title="评价"></van-tab>-->
        <van-tab title="推荐"></van-tab>
        <van-tab title="详情"></van-tab>
      </van-tabs>
    </nav>
    <header>
      <span style="position: absolute;left: 20px">
        <van-icon @click="toPath" size="18px"
                  name="arrow-left"/>
      </span>
      <span style="position: absolute;right: 20px">
        <!--<van-icon size="18px"-->
                  <!--:name="require('../../assets/Share.png')"/>-->
      </span>

      <van-swipe ref="swipes" @change="onChange">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <img :src="image.filePath | setImg" alt="">
        </van-swipe-item>
        <van-swipe-item>
          <span class="check">
           查看详情
          </span>
        </van-swipe-item>
        <template #indicator>
          <div class="custom-indicator">
            {{images.length > 0 ? current + 1 : 0 }}/{{images.length}}
          </div>
        </template>
      </van-swipe>
      <h4 class="textLeft">
        {{goodsObj.commodityName}}
      </h4>
    </header>

    <main>
      <section>
        <div class="flex">

          <template v-if="goodsObj.commodityPrice =='未配置买卖关系' || goodsObj.commodityPrice =='购买权限未开通'">
            <template v-if="goodsObj.companyId=='UK4711'||goodsObj.companyId == 'U48102'">
              <p>
                <span>市场价： </span>
                <span>¥{{ Number(goodsObj.price) * 1.05 | fixNum}}</span>
              </p>
              <p>
                <span>会员价：</span>
                <span style="color: #EB6464;font-size:14px;">{{goodsObj.commodityPrice}}</span>
              </p>
            </template>
            <template v-else-if="goodsObj.companyId=='U17686'">
              <p>
                <span>市场价： </span>
                <span> {{ goodsObj.price | fixNum}} {{goodsObj.commodityUnit}}}</span>
              </p>
              <p>
                <span>会员价：</span>
                <span style="color: #EB6464;font-size:14px;">{{goodsObj.commodityPrice}}</span>
              </p>
            </template>
            <template v-else>
              <p>
                <span>市场价： </span>
                <span>{{goodsObj.price | fixNum}} {{goodsObj.commodityUnit}}</span>
              </p>
              <p>
                <span>会员价：</span>
                <span style="color: #EB6464;font-size:14px;">{{goodsObj.commodityPrice}}</span>
              </p>
            </template>
          </template>
          <template v-else>
            <template v-if="goodsObj.companyId=='UK4711'||goodsObj.companyId == 'U48102'">
              <p>
                <span>市场价： </span>
                <span>{{Number(goodsObj.price) * 1.05 | fixNum}} {{goodsObj.commodityUnit}}</span>
              </p>
              <p>
                <span>会员价：</span>
                <span style="color: #EB6464;font-size:14px;">¥{{Number(goodsObj.commodityPrice)| fixNum}}</span>
              </p>

            </template>
            <template v-else-if="goodsObj.companyId=='U17686'">

              <p>
                <span>市场价： </span>
                <span>{{goodsObj.price | fixNum}} {{goodsObj.commodityUnit}}</span>
              </p>
              <p>
                <span>会员价：</span>
                <span style="color: #EB6464;font-size:14px;">¥{{Number(goodsObj.commodityPrice)| fixNum}}</span>
              </p>
            </template>
            <template v-else>
              <p>
                <span>市场价： </span>
                <span> {{goodsObj.price | fixNum}} {{goodsObj.commodityUnit}}</span>
              </p>
              <p>
                <span>会员价：</span>
                <span
                  style="color: #EB6464;font-size:14px;">{{goodsObj.commodityPrice | fixNum}} {{goodsObj.commodityUnit}}</span>
              </p>
            </template>
          </template>

        </div>

        <div class="flex">
          <p>
            <span>系统编码：</span>
            <span>{{goodsObj.interSysCode}}</span></p>
          <p>
            <span>货号：</span>
            <span>{{goodsObj.commodityArticleNo}}</span>
          </p>
        </div>
        <div class="flex">
          <p>
            <span>发货地：</span>
            <span><van-icon name="location-o"/>  </span>
          </p>
          <p>
            <span>配送方式：{{goodsObj.freightDesc}}</span>
            <span>
               <span style="color:#AAAAAA " class="right">
               月销1212
               </span>
            </span>
          </p>
        </div>

        <div class="flexjd" v-if="isJD">
          <p>
            <span>
              <van-field
                readonly
                clickable
                :value="searchAreaName"
                label="配送地址"
                :error="false"
                placeholder="选择省市区"
                @click="showArea = true"
                :rules="[{ required: true, message: '请选择省市区' }]"
              /></span>
          </p>
          <p>
            {{hasGoods ? '有货' : '无货'}}
          </p>
        </div>
      </section>

      <section>
        <div>
          <p>
            <span>供应商：</span>
            <span>{{goodsObj.supplierName}}</span>
          </p>
        </div>
        <div class="flex">
          <p>
            <span>交货期： </span>
            <span>{{goodsObj.deliverDayStart}}-{{goodsObj.deliverDayEnd}}天</span>
          </p>
          <p>
            <span>最小起订量：</span>
            <span>{{goodsObj.moq}}({{goodsObj.commoditySite}})</span>
          </p>
        </div>
      </section>

      <section class="popup">
        <div>
          <p>
            <span style="line-height: 24px">选择</span>
            <span>
              <van-stepper button-size="22" v-model="goodsValue"/>
           </span>
          </p>
        </div>
        <!--<div>-->
        <!--<p>-->
        <!--<span style="line-height: 24px">参数</span>-->
        <!--<span>-->
        <!--<van-cell is-link @click="showPopup">商品规格参数</van-cell>-->
        <!--<van-popup v-model="show" style="border:none" position="bottom" :style="{ height: '30%' }"/>-->
        <!--</span>-->
        <!--</p>-->
        <!--</div>-->
      </section>
      <section>
        <div>
          <p>
            <span>送货评价</span>
            <span class="pingjia">
                <span>描述相符  <span><img src="../../assets/up.png" alt=""></span> </span>
                <span>服务态度  <span><img src="../../assets/up.png" alt=""></span></span>
                <span>交货及时  <span><img src="../../assets/up.png" alt=""></span>  </span>
                <span> 售后服务 <span><img src="../../assets/up.png" alt=""></span></span>
             </span>
          </p>
        </div>
      </section>
      <!--<div id="evaluate">-->
      <!--<p>-->
      <!--<span class="left">商品评价</span>-->
      <!--<span style="color: #171060" class="right">查看全部 <van-icon name="arrow"/></span>-->
      <!--</p>-->
      <!--<p>-->
      <!--<span><img src="../../assets/touxiang.png" alt=""></span>-->
      <!--<span>用户182**12</span>-->
      <!--</p>-->
      <!--<p>收到货物非常满意，客服服务态度也好，都会耐心指导，用起来也不-->
      <!--错，非常满意的一次购物！</p>-->
      <!--</div>-->

      <div id="similar">
        <p>
          <span>同类商品推荐</span>
        </p>
        <div class="scroll">
          <van-grid class="grid" :border="false" :column-num="20">
            <van-grid-item @click="clickSim(item.commodityNo)" v-for="item in similarCommodityList" :key="item.id">
              <img :src="item.attachFile | setImg" alt="">
              <span>{{item.commodityName}}</span>
              <span>¥{{item.price | fixNum}}</span>
            </van-grid-item>
          </van-grid>
        </div>
      </div>

      <div id="details">
        <div>
          <span style="color: #373737;text-align: left;
                font-weight: 600">商品详情</span>
          <div ref="container">
            <van-sticky :container="container">
              <van-tabs @change="tabChagne" v-model="detailsActive">
                <van-tab title="产品介绍">
                </van-tab>
                <van-tab title="规格参数">
                </van-tab>
                <van-tab title="售后服务">

                </van-tab>
              </van-tabs>
            </van-sticky>
            <div class="jieshao">
            </div>
            <div v-show="false" class="hide">
              <h5>售后服务总则 :</h5>

              <table style="border-collapse:collapse" border="1">
                <tbody>
                <tr>
                  <td>退换类别</td>
                  <td>具体描述</td>
                  <td>是否支持15天（含）内退/换货</td>
                  <td>是否收取返回运费</td>
                </tr>
                <tr>
                  <td>国家法律所规定的功能性故障或商品质量问题</td>
                  <td>经由生产厂家指定或特约售后服务中心检测确认，并出具检测报告或经京东售后确认属于商品质量问题。</td>
                  <td>是</td>
                  <td>否</td>
                </tr>
                <tr>
                  <td>到货物流损、缺件或商品描述与网站不符等京东原因</td>
                  <td>物流损指在运输过程中造成的损坏、漏液、破碎、性能故障，经售后人员核查情况属实。缺件指商品原装配件缺失。</td>
                  <td>是</td>
                  <td>否</td>
                </tr>
                </tbody>
              </table>

              <h5>特别说明，以下情况不予办理退换货： </h5>
              <p>1.过保商品（超过三包保修期的商品）；</p>
              <p>2.未经授权的维修、误用、碰撞、疏忽、滥用、进液、事故、改动、不正确的安装所造成的商品质量问题，或撕毁、涂改标贴、机器序号、防伪标记；</p>
              <p>3.无法提供商品的发票、保修卡等三包凭证或者三包凭证信息与商品不符及被涂改的；</p>
              <p>4.其他依法不应办理退换货的。</p>
              <h5>服务承诺</h5>
              <h5>1.售后上门 :</h5>
              <p>
                客户购买商品15日内（含15日，自客户收到商品之日起计算）因质量问题提交退换申请且审核通过，京东提供免费上门取件服务。法定节假日、停电、天气等不可抗力情况除外。</p>
              <h5>2.售后服务处理周期 :</h5>
              <p>
                退货处理周期，自接收到问题商品之日起7日之内为您处理完成；换货处理周期，自接收到问题商品之日起10日之内为您处理完成；正常维修处理周期，自接收到问题商品之日起30日内为您处理完成。国家法定节假日，因部分品牌生产厂家的售后服务中心推迟提供服务，返修时间也相应延长。</p>
            </div>
          </div>
        </div>

      </div>
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
    <footer>
      <van-goods-action>
        <van-goods-action-icon @click="clickStart" icon="star-o" text="收藏" :color="startColor"/>
        <van-goods-action-icon icon="cart-o" color="#AAAAAA" text="购物车" @click="toPathUrl('/shopCart')"/>
        <van-goods-action-icon  @click="toPathUrl('/onlineService')" :icon="require('../../assets/kefu.png')" color="#AAAAAA" text="在线客服"/>
        <van-goods-action-button @click="addCart" type="warning" text="加入购物车"/>
        <van-goods-action-button type="danger" @click="toOrder" text="立即购买"/>
      </van-goods-action>
    </footer>

  </div>
</template>

<script>
  import {
    Swipe, Cell, SwipeItem, GoodsAction, Field, GoodsActionIcon, GoodsActionButton, Toast,
    Lazyload, Tabs, Tab, Icon, Popup, Grid, GridItem, Sku, Stepper, Sticky, Loading, Picker
  } from 'vant';
  import Vue from 'vue';
  import urls from '../../utils/urls';
  import http from '../../utils/http';
  import {getlocalStorage, getSessionStorage, add, mul} from "../../config/Utils";

  Vue.use(Lazyload, {
    lazyComponent: true
  });
  export default {
    name: "goodsDetails",
    components: {
      [Field.name]: Field,
      [Picker.name]: Picker,
      [Sku.name]: Sku,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Icon.name]: Icon,
      [Cell.name]: Cell,
      [Grid.name]: Grid,
      [Popup.name]: Popup,
      [Swipe.name]: Swipe,
      [Toast.name]: Toast,
      [Sticky.name]: Sticky,
      [Loading.name]: Loading,
      [Stepper.name]: Stepper,
      [GridItem.name]: GridItem,
      [SwipeItem.name]: SwipeItem,
      [GoodsAction.name]: GoodsAction,
      [GoodsActionIcon.name]: GoodsActionIcon,
      [GoodsActionButton.name]: GoodsActionButton,
    },
    data() {
      return {
        areaList: [{values: [], defaultIndex: 0},
          {values: [], defaultIndex: 0},
          {values: [], defaultIndex: 0}],        //自定义数据三级结构
        searchAreaName: '', // 地区显示
        searchAreaCode: '',// 地区显示code
        showArea: false, // 选择地区
        startColor: '#AAAAAA',
        container: null,
        current: 0, // 轮播页索引
        show: false,  // 参数 规格控制显示
        selectShow: false, // 参数 规格控制显示
        topShow: false, // 导航栏显示控制住
        active: 0,   // tab索引
        navHeight: 0, // 导航栏高度
        eHeight: 0,   //评价标签相对页面顶部的绝对高度
        sHeight: 0,   //推荐标签相对页面顶部的绝对高度
        dsHeight: 0,  //详情标签相对页面顶部的绝对高度
        detailsActive: 0,//商品详情导航栏
        goodsValue: 1,//选择商品数量
        goodsObj: {},
        scrollNum: 0, // 滚动标记初始0 次
        isLoding: true,
        similarCommodityList: [],//相似产品
        images: [],
        addressData: [],//
        isJD: false,//判断京东商品
        hasGoods: true // 判断有货无货
      }
    },
    methods: {
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
        this.checkJdFororder()
        this.showArea = false;
      },

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


      isClick() { // 点击导航栏
        switch (this.active) {
          case 0:
            this.$refs.swipes.swipeTo(0);
            window.scrollTo({
              top: 0,
            });
            break;
          // case 1:
          //   window.scrollTo({ // 设置滚动条滚动高度
          //     top: this.eHeight - this.navHeight - 20,
          //   });
          //   break;
          case 1:
            window.scrollTo({
              top: this.sHeight - this.navHeight - 20,
            });
            break;
          case 2:
            window.scrollTo({
              top: this.dsHeight - this.navHeight - 20,
            });
            break;
          default:
            window.scrollTo(0, 0)
        }
      },
      myFunction() {
        //滚动条滚动高度
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        let sDiv = document.getElementById('similar');  // 推荐
        // let eDiv = document.getElementById('evaluate'); // 评价
        let dsDiv = document.getElementById('details'); // 详情
        // this.eHeight = eDiv.offsetTop; // 评价标签相对页面顶部的绝对高度
        this.sHeight = sDiv.offsetTop; // 推荐标签相对页面顶部的绝对高度
        this.dsHeight = dsDiv.offsetTop; // 详情标签相对页面顶部的绝对高度

        if (scrollTop > 100) {
          this.topShow = true;
          let nav = document.getElementsByTagName('nav')[0];
          this.navHeight = nav.scrollHeight; // nav 标签高度
          this.active = 0;
          // if (this.eHeight - this.navHeight - 25 < scrollTop) {
          //   this.active = 1;
          //   this.$refs.swipes.swipeTo(0);
          // }
          if (this.sHeight - this.navHeight - 25 < scrollTop) {
            this.active = 1
          }
          if (this.dsHeight - this.navHeight - 25 < scrollTop) {
            this.active = 2;
          }
          if (this.dsHeight < scrollTop) {
            this.topShow = false
          }
        } else {
          this.topShow = false
        }
      },

      addCart() { // 加入购物车
        let token = getlocalStorage("token");
        http.get(`${urls.addCommodityToShopCar}?flag=wg&appCode=WG&access_token=${token}`, {
          requestAmount: this.goodsValue,
          commodityNo: this.goodsObj.commodityNo,
        }).then(res => {
          if (res.success) {
            Toast.success(res.msg);
          } else {
            Toast.fail(res.msg)
          }
        }).catch(err => {

        })
      },

      toOrder() { // 立即购买跳转确认订单页面
        let jdAdd = 0;
        jdAdd = mul(this.goodsObj.commodityPrice, this.goodsValue); // 计算京东商品总价
        if (this.isJD && jdAdd < 99) { // 京东商品总价格需不小于99
          Toast.fail('结算金额不得小于最小起订金额');
          return
        }

        let token = getlocalStorage("token");
        http.get(`${urls.addCommodityToShopCar}?flag=wg&appCode=WG&access_token=${token}`, {
          requestAmount: this.goodsValue,
          commodityNo: this.goodsObj.commodityNo,
        }).then(res => {
          if (res.success) {
            Toast('努力加载中...');
            this.$router.push({path: '/orderConfirm', query: {commodStr: this.goodsObj.commodityNo}})
          } else {
            Toast.fail(res.msg)
          }
        }).catch(err => {

        });

      },
      toPathUrl(url){
        this.$router.push({path: url})
      },


      clickStart() { // 加入收藏
        this.startColor = "#ffd01e";
        http.get(urls.addFavorite, {commodityNo: this.goodsObj.commodityNo}).then(res => {
          if (res.success) {
            Toast.success(res.obj.info)
          }
        }).catch(err => {

        })
      },

      toPath() { // 返回上一页
        this.$router.go(-1)
      },

      clickSim(data) { // 同类商品推荐
        this.$router.push({path: '/goodsDetails', query: {id: data}})
      },


      getDetails() { // 查询详情
        const toast = Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          message: '数据加载中',
        });
        this.isLoding = true;
        let num = Math.random();
        http.get(urls.queryCommodityDetail, {
          commodityId: this.$route.query.id,
          headType: 1,
          random: num
        }).then(res => {
          Toast.clear();
          this.goodsObj = res.commodityVo;
          if (this.goodsObj.showPos === '0520') { // 判断为京东商品
            this.isJD = true;
            if (getSessionStorage('filterAddress')) {
              this.searchAreaName = getSessionStorage('filterAddress');
              this.searchAreaCode = getSessionStorage('filterAddressCode');
              this.checkJdFororder()
            } else {
              this.getAddress();
            }
          }
          this.images = res.commodityVo.attachList;
          let grid = document.querySelector(".grid"); //获取同类商品标签
          this.similarCommodityList = res.similarCommodityList; // 同类商品集合
          let width = this.similarCommodityList.length * 111 + 10; // 设置标签宽度
          grid.style.width = `${width}px`;
          this.isLoding = false;
          this.introduce();
        }).catch(err => {
          Toast.clear();
        })
      },

      checkJdFororder() { // 判断有货无货
        let params = {
          commodityArticleNo: this.goodsObj.commodityArticleNo,
          searchAreaCode: this.searchAreaCode
        };
        http.get(urls.checkJdFororder, params).then(res => {
          this.hasGoods = res;

        }).catch(err => {

        })


      },

      onChange(index) { // 轮播图切换
        if (index < this.images.length) {
          this.current = index;
        } else {
          let dsDiv = document.getElementById('details'); // 详情
          this.dsHeight = dsDiv.offsetTop; // 详情标签相对页面顶部的绝对高度
          window.scrollTo({
            top: this.dsHeight - this.navHeight - 30,
            behavior: "smooth"
          });
        }
      },

      tabChagne(index) { // 商品介绍切换 获取到的数据可能是带标签的字符串"<p>121</P>" 要动态创建标签插入
        let jieshao = document.querySelector(".jieshao");
        jieshao.innerHTML = '';
        switch (index) {
          case 0:
            this.introduce();
            break;
          case 1:
            this.parameter(jieshao);
            break;
          case 2:
            this.afterSale(jieshao);
            break

        }
      },

      introduce() { // 商品介绍  可以使用 v-html
        let jieshao = document.querySelector(".jieshao"); // 创建标签 添加标签
        jieshao.innerHTML = ""; // 标签内容设置为空
        let p1 = document.createElement("p"); // 创建p 标签 赋值 this.goodsObj.commodityModels
        p1.innerHTML = this.goodsObj && this.goodsObj.commodityModels || " "; // 取商品信息介绍
        jieshao.appendChild(p1); //添加到商品介绍 jieshao 的标签

        if (this.goodsObj.companyId == "UK4711" || this.goodsObj.companyId == 'U48102') {
          let p2 = document.createElement("p"); // 创建p 标签
          p2.innerHTML = `<h5>包装清单:</h5>`; // p标签赋值
          jieshao.appendChild(p2);// 添加到商品介绍的标签
          let div = document.createElement("div"); // 创建div  赋值 this.goodsObj.commoditySynopsis
          div.innerHTML = this.goodsObj && this.goodsObj.commoditySynopsis || " ";
          jieshao.appendChild(div); // /添加到商品介绍 jieshao 的标签
        }

        let box = document.createElement("div"); // 创建box ，赋值 this.goodsObj.commodityDesc
        box.innerHTML = this.goodsObj && this.goodsObj.commodityDesc || "暂无数据";
        jieshao.appendChild(box); // 添加到商品介绍标签
        let divs = document.querySelectorAll(".jieshao div"); // 获取所有的div
        divs.forEach(item => { // 设置宽度 减去 40px 的内边距
          item.style.width = `calc(100vw - 40px)`;
          item.style.marginLeft = "0"; // 设置外边距为0
          item.style.marginRight = "0"// 设置外边距为0
        });

        let imgs = document.querySelectorAll(".jieshao img"); // 获取所有的img
        imgs.forEach(item => { // 重新设置宽度
          item.style.width = "100%"
        })
      },

      parameter(jieshao) { // 规格参数
        let p1 = document.createElement("p");
        p1.innerHTML = this.goodsObj && this.goodsObj.commodityModels || "  ";
        jieshao.appendChild(p1);

        let p = document.createElement("p");
        p.innerHTML = '<h5>包装清单:</h5>';
        jieshao.appendChild(p);

        let div = document.createElement("div");
        div.innerHTML = this.goodsObj && this.goodsObj.commoditySynopsis || "暂无数据";
        jieshao.appendChild(div);
      }
      ,

      afterSale(jieshao) { // 售后服务
        if (this.goodsObj && this.goodsObj.showPos === '0520') {
          let hideDiv = document.querySelector(".hide");
          let box = document.createElement("div");
          box.innerHTML = hideDiv.innerHTML;
          jieshao.appendChild(box);
        } else {
          let p = document.createElement("p");
          p.innerHTML = '<h5>保修条款：</h5>';
          jieshao.appendChild(p);
          let div = document.createElement("div");
          div.innerHTML = this.goodsObj && this.goodsObj.saleSupport || "暂无数据";
          jieshao.appendChild(div);
        }
      },

      getAddress() { // 查询地址
        http.post(urls.loadConsignee, {page: 1, rows: 50}).then(res => {
          if (res.success) { // 地址滚动加载
            this.addressData = res.obj.rows || [];
            this.addressData.forEach(item => {
              if (item.isDefault == '1') {
                this.searchAreaName = `${item.province}/${item.city}/${item.area}`;
                this.searchAreaCode = `${item.provinceCode}_${item.cityCode}_${item.areaCode}`;
                this.checkJdFororder()
              }
            });
          }
        }).catch(err => {

        })
      },
    },

    destroyed() { // 销毁钩子函数
      window.removeEventListener('scroll', this.myFunction)
    },

    mounted() {
      this.container = this.$refs.container;
      window.addEventListener('scroll', this.myFunction);
      this.getDetails();
      this.getArea(1, "")  // 查询地区

    },

    watch: {
      $route() {   // 监听路由参数变化重新加载
        this.container = this.$refs.container;
        window.addEventListener('scroll', this.myFunction);
        this.getDetails();
      }
    }

  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .goodsDetails {
    box-sizing: border-box;
    text-align: left;
    nav {
      box-sizing: border-box;
      width: 100%;
      background-color: white;
      padding: 0 20px;
      z-index: 40;
      position: fixed;
      top: 0;
    }
    header {
      > span {
        z-index: 20;
        top: 15px;
      }
      padding: 1px 0;
      background-color: #ffffff;
      .van-swipe {
        .van-swipe__track {
          height: 290px;
        }
        .van-swipe-item {
          width: 375px;
          height: 290px;
          img {
            @include wh(230px, 230px);
            @include center;
          }
        }
      }
      h4 {
        padding: 0 20px;
      }
    }
    main {
      background-color: #F5F5F5;
      padding-bottom: 50px;
      .van-icon {
        position: relative;
        top: 2px;
      }
      > div {
        box-sizing: border-box;
        font-size: 13px;
        margin: 5px 0;
        padding: 1px 20px;
        background-color: #ffffff;
        p {
          margin: 8px 0;
          overflow: hidden;
          &:first-child {
            span {
              &:first-child {
                color: #373737;
                font-weight: 600;
              }
            }
          }
          &:nth-child(2) {
            display: flex;
            span {
              flex-shrink: 0;
              line-height: 24px;
              &:first-child {
                @include wh(35px, 24px);
                img {
                  @include wh(24px, 100%)
                }
              }
            }
          }
        }
        > div {
          /deep/ .van-grid-item__content {
            padding: 8px;
          }
          img {
            @include wh(95px, 95px)
          }
          span {
            text-align: center;
            display: block;
            width: 95px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 3px 0;
            &:last-child {
              color: #FF6464;
            }
          }
        }
      }
    }

    section {
      background-color: #ffffff;
      margin: 2px 0;
      padding: 0 20px;
      color: #585858;
      .van-cell__value {
        color: #585858;
      }
      > div {
        /deep/ .van-cell {
          padding: 0;
          color: #AAAAAA;
        }
        padding: 10px 0;
        border-top: 1.3px solid #F5F5F5;
        &:first-child {
          border-top: none;
        }
        > p {
          margin: 0;
          font-size: 13px;
          > span {
            &:first-child {
              color: #AAAAAA;
            }
          }
        }
      }
      .flex {
        display: flex;
        > p {
          flex-shrink: 0;
          &:first-child {
            width: 45%;
          }
          &:last-child {
            width: 55%
          }
        }
      }

      .flexjd {
        color: #AAAAAA;
        display: flex;
        > p {
          flex-shrink: 0;
          &:first-child {
            width: 83%;
          }
          &:last-child {
            width: 17%;
            line-height: 23px;
          }
        }
      }
    }
  }

  /deep/ .van-sticky--fixed {
    padding: 0 20px;
  }

  .check {
    color: #000;
    font-size: 0.14rem;
    line-height: 0.24rem;
    width: 5px;
    display: block;
    @include posAb(30px, 50%);
    transform: translateY(-50%);
  }

  .popup {
    margin: 2px 0;
    > div {
      p {
        display: flex;
        span {
          div {
            padding: 0;
          }
          flex-shrink: 0;
          &:first-child {
            width: 20%;
          }
          &:last-child {
            width: 80%;
          }
        }
      }
    }
  }

  .jieshao {
    width: 335px;
    min-height: calc(100vh - 44px - 60px);
    padding-bottom: 10px;
    h5 {
      font-size: 15px;
      margin: 10px 0;
    }
    p {
      letter-spacing: 2px;
      text-indent: 2em;
      color: #585858;
    }
  }

  .custom-indicator {
    position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 2px 5px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
  }

  .pingjia {
    font-size: 12px;
    img {
      @include wh(12px, 14px);
      position: relative;
      top: 2px;
    }
  }

  .scroll {
    width: 335px;
    overflow-x: scroll;
    .grid {
      min-width: 600px !important;
    }
  }

  .van-goods-action {
    z-index: 10;
  }

</style>
