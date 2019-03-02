import {commonParams,options} from 'api/config'
import axios from 'axios'

export function getMusic(mid) {
  let url = '/api/music'

  const data = Object.assign({},commonParams,{
    needNewCode: 0,
    loginUin: 0,
    songmid:mid,
    filename:'C400'+mid+'.m4a',
    guid:1819638027,
    platform:'yqq',
    hostUin:0,
    g_tk:5381,
    uin:0,
    cid:205361747,
    format:'json'
  })

  return axios.get(url,{
    params:data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
