import {commonParams,options} from 'api/config'
import axios from 'axios'
import jsonp from 'common/js/jsonp2'

/*
export function getSong(mid) {
    let url='/api/getMusic'

  const dataAdd = {"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"4733453868","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"4733453868","songmid":["001OyHbk2MSIi4"],"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},"comm":{"uin":0,"format":"json","ct":20,"cv":0}}


  const data=Object({},commonParams,{
      guid: 4733453868,
      platform: 'yqq',
      loginUin: 0,
      hostUin: 0,
      needNewCode: 0,
      g_tk: 5381,
      uin: 0,
      format: 'json',
      callback:'getplaysongvkey6864531664009375',
      jsonpCallback: 'getplaysongvkey6864531664009375',
    //songmid:mid,
      //cid:205361747,
      //filename:'C400'+mid+'.m4a',
      data:dataAdd
    })


    return axios.get(url,{
      params: data
    }).then((res) => {
      return Promise.resolve(res.data)
    })

}

*/


//{"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"4733453868","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"4733453868","songmid":["001OyHbk2MSIi4"],"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},"comm":{"uin":0,"format":"json","ct":20,"cv":0}}


export function getSongVkey (songmid) { // 获取歌曲的vkey
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = Object.assign({}, {
    callback: 'musicJsonCallback',
    loginUin: 3051522991,
    format: 'jsonp',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 3051522991,
    guid: 5931742855,
    songmid: songmid,
    filename: `C400${songmid}.m4a`
  })

  return jsonp(url, data)
}
