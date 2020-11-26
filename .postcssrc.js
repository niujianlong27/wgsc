// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    'autoprefixer': {
      browsers: ['Android >= 4.0', 'iOS >= 7']
    },

    'postcss-pxtorem': {
      rootValue: 100, //vant-UI的官方根字体大小是37.5
      propList: ['*']
    }
  }
}
