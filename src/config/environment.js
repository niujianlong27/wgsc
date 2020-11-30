let environment = {};
switch (process.env.NODE_ENV) {
  case 'development': {
    // environment.wgApp = "http://www.iewego.com/wg-app/";
    // environment.wgApp = "http://dev-wg1.ouyeelbuy.com/wg-app/";
    environment.wgApp = "http://3n27373365.picp.vip/wg-app/";
    environment.wgRfq = "http://dev-rfq.ouyeelbuy.com/api/";

  }
    break;
  case 'testing': {
    environment.wgApp = "http://dev-wg1.ouyeelbuy.com/wg-app/";
    environment.wgRfq = "http://dev-rfq.ouyeelbuy.com/api/";
  }
    break;
  case 'production': {
    environment.wgApp = "http://www.iewego.com/wg-app/";
    environment.wgRfq = "http://rfq.ouyeelbuy.com/api/";
  }
    break;

}
export default environment;

