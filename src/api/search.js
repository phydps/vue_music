import {commonParams, options} from "./config";
import jsonp from 'common/js/jsonp2'
import axios from 'axios'

//热门搜索词查询
export function getHotKey(){
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({},commonParams,{
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  })

  return jsonp(url,data,options)
}

//搜索
/*
export function search(query, page, zhida, perpage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}*/
export function search(query,page,zhida,perpage) {
  //const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  const url = '/api/search'

  const data = Object.assign({}, commonParams, {
    /*
    w: query,
    p: page,
    perpage: perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'json',
    _:1544880527203
*/
    g_tk:5381,
    uin:0,
    format:'json',
    inCharset:'utf-8',
    outCharset:'utf-8',
    notice:0,
    platform:'h5',
    needNewCode:1,
    w:query,
    zhidaqu:1,
    catZhida: zhida ? 1 : 0,
    t:0,
    flag:1,
    ie:'utf-8',
    sem:1,
    aggr:0,
    perpage:perpage,
    n:20,
    p:page,
    remoteplace:'txt.mqq.all',
    _:new Date().getTime()

  })

  return axios.get(url,{
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

