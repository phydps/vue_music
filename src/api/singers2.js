import jsonp from 'common/js/jsonp';
import {commonParams,options} from 'api/config';

export function getSingerList(){
  const url='https://u.y.qq.com/cgi-bin/musicu.fcg';

  const data=Object.assign({},commonParams,{

  })
  return jsonp(url,data,options)

}
