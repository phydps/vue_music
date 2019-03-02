import jsonp from 'common/js/jsonp2'
import {commonParams,options} from 'api/config'
import axios from 'axios'
import {param} from "../common/js/jsonp";
export function getRecommend(){
  let url='https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data=Object.assign({},commonParams,{
    platform: 'h5',
    uin:0,
    needNewCode: 1
  })

  return jsonp(url,data,options)
}

//获取热门歌单推荐列表
export function getDiscList(){
  const url='/api/getDiscList';

  const data=Object.assign({},commonParams,{
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });
//axios get方法
  return axios.get(url,{params:data}).then((res)=>{
    return Promise.resolve(res.data)
  })
}


export function getSonglist(dissid) {
  //const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

  const url = '/api/getSongList'
  const data = Object.assign({},commonParams,{
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: dissid,
    needNewCode: 0,
    notice: 0,
    platform: 'yqq',
    hostUin: 0,
    format: 'json'
  })

  //return jsonp(url,data,options)

  return axios.get(url,{
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

