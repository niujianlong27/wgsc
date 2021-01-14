let environment = {};
switch (process.env.NODE_ENV) {
  case 'development': {
    // environment.wgApp = "https://www.iewego.com/wg-app/";
    environment.wgApp = "https://www.iewego.com/wg-app/";
  }
    break;
  case 'testing': {
    environment.wgApp = "http://dev-wg1.ouyeelbuy.com/wg-app/";
  }
    break;
  case 'production': {
    environment.wgApp = "https://www.iewego.com/wg-app/";
  }
    break;

}
export default environment;

