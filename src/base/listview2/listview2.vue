<template>
  <Scroll @scrollDistribute="scroll"
          :probe-type="probeType"
          :data="data"
          :whether-listen-scroll="whetherListenScroll"
          class="listview"
          ref="listview">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item" @click="selectItem(item)">
            <img v-lazy="item.avatar" class="avatar"/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut">
      <ul>
        <li v-for="(item,index) in shortCutList" @touchstart.stop.prevent="onShortCutTouchStart" @touchmove.stop.prevent="onShortCutTouchMove" class="item" :data-index="index" :class="{'current':currentIndex===index}">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="shortCutTitle">
      <div class="fixed-title" ref="fixed">{{shortCutTitle}}</div>
    </div>
    <loading class="loading-container" v-show="!data.length"></loading>
  </Scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll2/scroll2'
  import {getData} from 'common/js/dom2'
  import Loading from 'base/loading2/loading2'

  const ANCHOR_HEIGHT = 18 //一个快速导航栏元素高度
  const FIXED_TITLE = 30

  export default {
    props:{
      data:{
        type:Array,
        default:[]
      }
    },
    data(){
      return {
        currentIndex:0,//当前导航栏下标
        scrollY:-1,//scroll Y轴滚动距离量
        diff:-1
      }
    },
    created(){
      this.touch={},//快速导航栏记录当前下标anchorIndex 以及当前点击点的y坐标(y1) 以及滑动后的y坐标(y2)
      this.listHeight=[],
        this.probeType=3,
      this.whetherListenScroll=true

    },
    computed:{
      //截取快速导航栏数据
      shortCutList() {
        return this.data.map((group) => {
          return group.title.substr(0,1)
        })
      },
      shortCutTitle(){
        if(this.scrollY>0){
          return ''
        }
        return this.data[this.currentIndex]?this.data[this.currentIndex].title:''
      }
    },

    methods:{
      refresh() {
        this.$refs.listview.refresh()
      },

      //点击快速导航栏，获取导航栏数组对应的下标（给导航栏增加了与index相关的动态样式）
      onShortCutTouchStart(e){
        //
        let anchorIndex = getData(e.target,'index');//根据:data-index="index"设置来取index
        let firstTouch = e.touches[0]
        this.touch.y1=firstTouch.pageY
        this.touch.anchorIndex = anchorIndex;


        //this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex],0)
        this._scrollTo(anchorIndex)
      },
      onShortCutTouchMove(e){
        let endTouch = e.touches[0]
        this.touch.y2=endTouch.pageY
        //快速导航栏滑动位移量
        let delta =(this.touch.y2-this.touch.y1)/ANCHOR_HEIGHT|0
        //点击时的坐标加上偏移量 则为滑动后所停留的坐标
        let anchorIndex = parseInt(this.touch.anchorIndex)+delta;

        //this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex],0)
        this._scrollTo(anchorIndex)
      },
      scroll(pos){
        this.scrollY = pos.y;
        //console.log(pos)
      },
      selectItem(item){
        this.$emit('select',item)
      },
      _scrollTo(index){
        if(index<0){
          index = 0
        }else if(index > this.listHeight.length-2){
          index = this.listHeight.length-2
        }

        this.scrollY = -this.listHeight[index]

        //console.log(this.scrollY+'|'+index)
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
      },
      _calculateHeight(){
        this.listHeight= []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for(let i = 0;i<list.length;i++){
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
        //console.log(this.listHeight)
      }
    },
    watch:{
      data(){4
        setTimeout(() => {
          this._calculateHeight()
        },20)
      },
      scrollY(newY){
        const listHeight =this.listHeight
        //看scroll滚动量在listHeigth数组之间,确定currentIndex
        if(newY>0){
          this.currentIndex = 0
          return
        }

        for(let i = 0;i<listHeight.length-1;i++){
          let minHeight = listHeight[i]
          let maxHeight = listHeight[i+1]
          if(-newY>=minHeight && -newY < maxHeight){
            this.currentIndex = i
            this.diff = maxHeight+newY
            //console.log(this.diff)
            return
          }
        }

        this.currentIndex = listHeight.length-2
      },
      diff(newVal){
        let fixedTop = (newVal> 0 && newVal < FIXED_TITLE?newVal-FIXED_TITLE:0)

        if(fixedTop === this.fixedTop){
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform= `translate3d(0,${fixedTop}px,0)`


      }
    },
    components:{
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
