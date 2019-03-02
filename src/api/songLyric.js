import {commonParams} from "./config"
import axios from 'axios'

export function getSongLyric(mid) {
  let url ='/api/getLyric'

  const data = Object.assign({},commonParams,{
    pcachetime: +new Date(),
    songmid: mid,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    notice: 0,
    platform: 'yqq',
    NeedNewCode: 0
  })

  //console.log(mid)
  return axios.get(url,{
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
