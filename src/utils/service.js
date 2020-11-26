import http from "./http"
import urls from "./urls"
import {Toast} from 'vant';

export const getCatalog = async () => {
  return new Promise((resolve, reject) => {
    http.get(urls.initClassTree, {
      ajaxCmd: "classTree", headType: 1
    }).then(res => {
      resolve(res.classTreeMap)
    }).catch(err => {
    });
  })
};

export const getImgs = async (params) => {
  return new Promise((resolve, reject) => {
    http.get(urls.advertList, params).then(res => {
      if (res.rows && res.rows.length > 0) {
        let arr = res.rows[0].imgUrl.split(',');
        let strArr = res.rows[0].imgLink.split(',');
        let Arr = arr.map((item,index) => {
          return {url:item,link:strArr[index]}
        });
        resolve(Arr)
      }

    }).catch( err=> {

    })

  })
};


export const getAddressInfo = async (ip) => {
  return new Promise((resolve, reject) => {
    http.get(urls.getProvince, {
      realIp: ip
    }).then(res => {
      resolve(res.cityName)
    }).catch(err => {
    });
  })
};

export const getUserinfo = async (values) => {
  return new Promise((resolve, reject) => {
    http.post(urls.doLogin, {
      ...values, requestUrl: "http://3303s75z62.zicp.vip/#/home"
    }).then(res => {
      resolve(res)
      }
    ).catch(err => {

    });
  })

};
