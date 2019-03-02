//向dom元素中添加样式
export function addClass(el,className2){
  if(hasClass(el,className2)){
    return
  }
  let arr=el.className.split(' ')
  arr.push(className2)
  el.className=arr.join(' ')
}

//检验是否dom元素中已有样式
export function hasClass(el,className){
  let reg=new RegExp('(^|\\s)'+className+'($|\\s)')

  return reg.test(el.className)
}

//获取或者设置dom属性
export function getData(el,name,val){
  let preFix='data-'
  if(val){
    return el.setAttribute(preFix+name,val)
  }
  return el.getAttribute(preFix+name)
}
