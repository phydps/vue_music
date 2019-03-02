//用于打乱数组顺序
export function shuffList(arr) {
  let _arr = arr.slice()

  for (let i = 0;i < _arr.length; i++) {
    let j = getRandomInt(0,i)
    let temp = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = temp
  }

  return _arr
}

//获取所传值之间的一个数（包含边界）
function getRandomInt(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1) + min)
  return num
}

//扩展
export function debounce(func,delay) {
  let timer = ''

  return function(...args){
    if(timer){
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      func.apply(this,args)
    },delay)
  }
}
