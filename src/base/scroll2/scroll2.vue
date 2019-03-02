//抽象Bscroll
<template>
  <div ref="wrapper">
     <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';

export default{
  props:{
    probeType:{
      type:Number,
      default:1
    },
    data:{
      type:Array,
      default:[]
    },
    click:{
      type:Boolean,
      default:true
    },
    whetherListenScroll:{
      type: Boolean,
      default:false
    },
    pullup:{//是否下拉刷新
      type: Boolean,
      default: false
    },
    beforeScroll:{
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted(){
    setTimeout(() =>{
      this._initScroll()
    },20)
  },
  methods:{
    _initScroll(){
      if(!this.$refs.wrapper){
        return
      }
      this.scroll=new BScroll(this.$refs.wrapper,{
        probeType:this.probeType,
        click:this.click
      })
      //是否监听scroll滚动事件
      if(this.whetherListenScroll){

        let me = this

        this.scroll.on('scroll',(pos) => {
          //console.log(pos)
          me.$emit('scrollDistribute',pos)
        })
      }

      //是否支持上拉，派发scrollEnd事件
      if(this.pullup) {
        this.scroll.on('scrollEnd',() => {
          if(this.scroll.y <= this.scroll.maxScrollY + 50) {
            //console.log(this.scroll.y)

            this.$emit('scrollToEnd')
          }
        })
      }

      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart',() => {
          this.$emit('beforeScroll')
        })
      }
    },

    //scroll的几个代理方法
    enable(){
      this.scroll()&&this.scroll.enable()
    },
    disable(){
      this.scroll&&this.scroll.disable()
    },
    refresh(){
      this.scroll&&this.scroll.refresh()
    },
    scrollTo(){
      this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
    },
    scrollToElement(){
      this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
    }
  },
  //传入数据有变化，则刷新scroll
  watch:{
    data(){
      setTimeout(()=> {
        this.refresh()
      },20)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
