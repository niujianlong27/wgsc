import environment from "../config/environment";

export default {
  doLogin: `${environment.wgApp}doLogin`, //登录接口
  getProvince: `${environment.wgApp}portal/getProvince`,//获取定位地址
  toSign: `${environment.wgApp}toSign`, //单点登录验证接口
  interfaceDetail: `${environment.wgApp}rfq/notice/detail`, //采购公告详情
  material: `${environment.wgApp}purchase/inquiry/approve/inquiry/material`, //查询物料
  queryNoticeList: `${environment.wgApp}portal/queryNoticeList`,//最新公告查询
  initClassTree: `${environment.wgApp}portal/initClassTree`, //商品类型多级菜单
  addCommodityToShopCar: `${environment.wgApp}cart/addCommodityToShopCar`,//加入购物车
  queryShoppingList: `${environment.wgApp}cart/queryShoppingList`,//购物车列表查询
  queryCommodityDetail: `${environment.wgApp}/portal/queryCommodityDetail`, //商品详情
  toCommodityView: `${environment.wgApp}portal/toCommodityView`, //商品类型三级菜单详情 // 查询接口
  queryCommodity: `${environment.wgApp}portal/queryCommodity`, //分页查询接口 筛选
  addCommoditysToShopCar: `${environment.wgApp}cart/addCommoditysToShopCar`, //场景加入购物车
  interface: `${environment.wgApp}rfq/notice/agent-interface`,//采购公告查询
  toOrderDetermine: `${environment.wgApp}order/toOrderDetermine`,//订单确认查询接口
  querySimilarCommodity: `${environment.wgApp}portal/querySimilarCommodity`,//购物车推荐商品
  favoriteList: `${environment.wgApp}portal/favoriteList`,//查询收藏
  addFavorite: `${environment.wgApp}portal/addFavorite`,//添加收藏
  cancelFavorite: `${environment.wgApp}portal/cancelFavorite`,//取消收藏
  loadConsignee: `${environment.wgApp}order/loadConsignee`,//查询收货地址
  updateConsignee: `${environment.wgApp}order/updateConsignee`,//删除收货地址
  addAddress: `${environment.wgApp}order/addAddress`,//新增收货地址
  editConsignee: `${environment.wgApp}order/editConsignee`,//修改收货地址
  queryArea: `${environment.wgApp}order/queryArea`,//查询省市区乡
  getBankName: `${environment.wgApp}statement/getBankName`,//查询银行名称
  queryAreaInfo: `${environment.wgApp}statement/queryAreaInfo`,//查询银行地区
  copyStatementCenter: `${environment.wgApp}statement/copyStatementCenter`,//新增发票
  searchStatementCenter: `${environment.wgApp}statement/searchStatementCenter`,//查询发票
  deleteStatement: `${environment.wgApp}statement/deleteStatement`,//删除发票
  Insertorder: `${environment.wgApp}order/Insertorder`,//生成订单
  deleteCommodityFromShopCar: `${environment.wgApp}cart/deleteCommodityFromShopCar`,//购物车删除
  updateRedisNum: `${environment.wgApp}cart/updateRedisNum`,//购物车数量改变
  searchOderByPurchase: `${environment.wgApp}order/searchOderByPurchase`,//订单分类查询
  doConfirmReceipt: `${environment.wgApp}order/doConfirmReceipt`,//确认收货
  searchOderBySupplier: `${environment.wgApp}order/searchOderBySupplier`,//供应商查询订单
  toOrderDetailView: `${environment.wgApp}order/toOrderDetailView`,//查看订单详情
  updateRedisStatus: `${environment.wgApp}cart/updateRedisStatus`,//更改购物车选中状态
  searchSupplierDelivery: `${environment.wgApp}order/searchSupplierDelivery`,//发货单查询
  AjaxLoadReceptItemList: `${environment.wgApp}order/AjaxLoadReceptItemList`,//发货单查询详情
  ajaxSelectOrderDelivery: `${environment.wgApp}order/ajaxSelectOrderDelivery`,//创建送货单查询订单信息
  ajaxQueryOrderItemById: `${environment.wgApp}order/ajaxQueryOrderItemById`,//根据订单查询商品
  doCreateDelivery: `${environment.wgApp}order/doCreateDelivery`,//创建发货单
  searchOderCountByPurchase: `${environment.wgApp}order/searchOderCountByPurchase`,//获取采购商各状态订单数接口
  searchOderCountBySupplier: `${environment.wgApp}order/searchOderCountBySupplier`,//获取供应商各状态订单数
  querySceneCommodity: `${environment.wgApp}portal/querySceneCommodity`,//查询场景化
  checkJdCommodity: `${environment.wgApp}order/checkJdCommodity`,//京东商品验证
  selectAllSupplierName: `${environment.wgApp}portal/selectAllSupplierName`,//查询自营供应商
  checkJdFororder: `${environment.wgApp}portal/checkJdFororder`,//查询有货没货
  searchNotice: `${environment.wgApp}rfq/notice/searchNotice`,//搜索公告
  advertList: `${environment.wgApp}portal/advertList`,//图片查询
  querySupplierStatus: `${environment.wgApp}rfq/notice/queryPreauditSupplierStatus`,//报名查询状态
  preauditSupplierAdd: `${environment.wgApp}rfq/notice/preauditSupplierAdd`,//报名


  getNewSysNotice: `${environment.wgRfq}rfqRequest/getNewSysNotice`,//查询消息



}

