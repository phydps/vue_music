import originJsonp from 'jsonp'

export default function jsonp(url, data, option) {
  url +=  (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  return new Promise((resolve,reject) => {
    originJsonp(url, option, (err,data) => {
      if (!err) {
        resolve(data);  
      } else {
      	reject(err)
      }
    })
  })
}
export function param(data) {
	let url = ''
	for (let i in data) {
		let value = data[i] !== undefined ? data[i] : ''
    // 拼接成带请求参数的url
    url += '&' + i +'=' + encodeURIComponent(value)
	}
	// 如果url存在，则去掉最前面的’&‘符
	return url ? url.substring(1) : ''
} 
