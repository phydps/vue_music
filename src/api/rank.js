import {commonParams,options} from "./config"
import jsonp from 'common/js/jsonp2'

/*
export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_opt.fcg'

  const data = Object.assign({},commonParams,{
    page: 'index',
    format: 'html',
    tpl: 'macv4',
    v8debug: 1,
    jsonp:'jsonpCallback'
  })

  return jsonp(url,data,options)
}
*/
export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}


export function getMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data= Object.assign({},commonParams,{
    tpl:3,
    page:'detail',
    //date: new Date()
    topid: topid,
    type: 'top',
    hostUin: 0,
    loginUin: 0,
    notice: 0,
    needNewCode:0,
    platform: 'yqq'
  })

  return jsonp(url,data,options)
}
