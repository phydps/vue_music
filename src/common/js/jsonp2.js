import originJsonp from 'jsonp'

export default function jsonp(url,data,option){
  url+=(url.indexOf('?')<0?'?':'&')+pinData(data)

  return new Promise((resolve,reject) => {
    originJsonp(url,option,(err,data) => {
      if(!err){
        resolve(data)
      }else{
        reject(err)
      }
    })
  })
}

//拼接请求参数
export function pinData(data){
  let url=''
  for(let i in data){
    let value=data[i]!==undefined?data[i]:''
    //拼接成带请求的url参数
    url +='&'+i+'='+encodeURIComponent(value)
  }
//如果url存在，则删除第一位&符
  return url?url.substr(0):''
}
