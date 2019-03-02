<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{active:index===currentPageIndex}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {addClass} from 'common/js/dom2'
  import BScroll from 'better-scroll'
  export default {
    name: 'slider',
    data(){
      return {
        dots:[],
        currentPageIndex:0
      }
    },
    props:{
      //是否无缝循环图片
      loop:{
        type:Boolean,
        default:true
      },
      autoPlay:{//是否自动播放
        type:Boolean,
        default:true
      },
      interval:{//自动播放图片时间
        type:Number,
        default:4000
      }
    },
    mounted(){
      setTimeout(()=>{
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        if(this.autoPlay){
          this._play()
        }
      },20)

      window.addEventListener('resize',()=>{
        //未生成bscroll 直接返回
        if(!this.slider){
          return
        }

        //重设设置slider宽度
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    methods:{
      _setSliderWidth(whetherResize){
        this.children=this.$refs.sliderGroup.children;

        let width=0
        let sliderWidth=this.$refs.slider.clientWidth;

        for(let i=0;i<this.children.length;i++){
          let child=this.children[i]
          child.style.width=sliderWidth+'px';
          width+=sliderWidth
          //console.log(width)
          addClass(child,'slider-item')
        }
        //无缝轮播在前后加2个宽度
        if(this.loop&&!whetherResize){
          width+=2*sliderWidth
        }

        this.$refs.sliderGroup.style.width=width+'px'
      },
      _initDots(){
        this.dots=new Array(this.children.length)
      },
      //
      _initSlider(){
        this.slider=new BScroll(this.$refs.slider,{
          scrollX:true,
          scrollY:false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400,
          click:true
        })
        //betterScroll派发scrollEnd事件
        this.slider.on('scrollEnd',() => {
          // betterScroll.getCurrentPage()
          let pageIndex=this.slider.getCurrentPage().pageX

          if(this.loop){
            pageIndex-=1
          }
          this.currentPageIndex=pageIndex

          if(this.autoPlay){
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _play(){
        //获取当前页面索引
        let pageIndex=this.currentPageIndex+1

        if(this.loop){
          pageIndex+=1
        }

        this.timer=setTimeout(()=>{
          this.slider.goToPage(pageIndex,0,400)
        },this.interval)
      }
    },
    destroyed(){
      clearTimeout(this.timer)
    }

  }
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
