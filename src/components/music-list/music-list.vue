<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back" ></i>
    </div>
    <h1 class="title" v-html="title"></h1>

    <div class="bg-image" :style="bgStyle" ref="bgImage">
        <div class="play-wrapper">
          <div class="play" v-show="songs.length>0" ref="playBtn" @click="randomPlayBtn">
            <i class="icon-play"></i>
            <span class="text">随机播放全部</span>
          </div>
        </div>

    </div>

    <!--随歌单滚动的黑色背景 依据scroll滚动量偏移-->
    <div class="bg-layer" ref="layer"></div>

    <scroll @scrollDistribute="scroll" :data="songs" :whether-listen-scroll="whetherListenScroll" :probe-type="probeType" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
      <loading v-show="!songs.length" class="loading-container"></loading>
    </scroll>

  </div>
</template>

<script type="text/ecmascript-6">
  import SongList from 'base/song-list/song-list'
  import Scroll from 'base/scroll2/scroll2'
  import Loading from 'base/loading2/loading2'
  import {mapActions} from 'vuex'
  import {playListMixin} from 'common/js/mixin'

  const RESERVED_HEIGHT = 40//
  export default {
    mixins: [playListMixin],
    props: {
        songs: {
            type: Array,
            default: []
        },
        bgImage: {
            type: String,
            default: ''
        },
        title:{
            type: String,
            default: ''
        }
    },
    data(){
      return {
        scrollY:0
      }
    },
    created(){
        this.probeType =3,
        this.whetherListenScroll = true
    },
    computed: {
        //歌手歌单背景图
        bgStyle(){
            return `background-image:url(${this.bgImage})`
        }
    },
    mounted(){
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
      this.translateYMax = -this.imageHeight+RESERVED_HEIGHT//黑色layer能上滑最大值
    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },

      //scroll派发的事件，监听y轴滚动量，赋值给scroolY
      scroll(pos){
        this.scrollY = pos.y
        //console.log(pos)
      },
      back() {
          this.$router.back()
      },
      selectItem(item,index){
        this.selectPlay({
          list:this.songs,
          index:index
        })
      },
      randomPlayBtn() {
        this.randomPlay({
          list: this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch:{
      //监听scrollY变化
      scrollY(newVal){
        //console.log(newVal-this.translateYMax)

        let translateY = Math.max(this.translateYMax,newVal)
        let zIndex = 0 //
        let scale = 1 //下拉放大系数

        const prevent = Math.abs(newVal/this.imageHeight)
        if(newVal>0){
          scale = 1 +prevent
          zIndex = 10
        }
        this.$refs.layer.style.transform=`translate3d(0,${translateY}px,0)`

        if(newVal<this.translateYMax){//歌单往上滑动且覆盖图片的时候(停止于一个标题的高度，即40px) 黑色背景同步跟随一起覆盖图片(需限制)
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none'
        }else{
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playBtn.style.display = ''
        }

        this.$refs.bgImage.style.transform = `scale(${scale})`//下拉图片放大
        this.$refs.bgImage.style.zIndex = zIndex

      }
    },
    components:{
      SongList,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
