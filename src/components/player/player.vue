<template>
  <div class="player" v-show="playList.length>0">

    <transition class="normal-player" name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background" >
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back" ></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <h2 class="playing-lyric">{{playingLyric}}</h2>
            </div>
          </div>
          <scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text" ref="lyricLine" v-for="(line,index) in currentLyric.lines" :class="{'current':currentLineNum === index}">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
          </div>

          <!--播放时长、进度条、总时长区域-->
          <div class="progress-wrapper">
            <span class="time time-l">{{_formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressPercentChange"></progress-bar>
            </div>
            <span class="time time-r">{{_formatTime(currentSong.duration)}}</span>
          </div>
          <!--操作按钮区域-->
          <div class="operators">
            <div class="icon icon-left">
              <i :class="currentPlayModeIcon" @click="changeMode"></i>
            </div>
            <div class="icon icon-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon icon-center" :class="disableCls">
              <i @click="togglePlay" :class="toggleCls"></i>
            </div>
            <div class="icon icon-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon icon-right" @click="toggleFavorite(currentSong)">
              <i :class="getFavoriteCls(currentSong)"></i>
            </div>
          </div>

        </div>
      </div>
    </transition>
    <transition class="mini-player" name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon" >
          <img :class="cdCls" :src="currentSong.image" width="40" height="40">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control" @click.stop.prevent="togglePlay">
          <progress-circle :radius="radius" :percent="percent">
            <i :class="toggleMiniIcon" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist" @click.stop="showPlayList"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playlist"></play-list>

    <audio ref="audio" :src="currentSong.url" @play="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters,mapMutations,mapActions} from 'vuex'
  import animations from 'create-keyframe-animation' //动画库引入
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {playMode} from 'common/js/config'
  import {shuffList} from 'common/js/util2'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll2/scroll2'
  import PlayList from 'components/playlist/playlist'
  import {playerMixin} from 'common/js/mixin'

  export default {
    mixins:[playerMixin],
    data() {
      return {
        songReady: false,
        currentTime: 0,
        radius: 32,
        currentLyric:null,//当前歌词文本数据
        currentLineNum:0,//当前高亮歌词行数
        currentShow: 'cd',//左右切换页面的当前显示页面标识
        playingLyric: '',//cd播放页面所显示的当前歌词高亮行
      }
    },
    created() {
      this.touch = {} //左右滑动时，记录坐标等相关数据️
    },
    computed:{
      toggleCls() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      toggleMiniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      /*mixin中已包含该计算方法

      currentPlayModeIcon() {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      },*/
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      disableCls() {
        this.songReady ? '' : 'disable'
      },
      //进度条比重
      percent() {
        let percent = this.currentTime / this.currentSong.duration
        return percent
      },
      ...mapGetters([
        'fullScreen',
        'playing',
        'currentIndex',
      ])
    },
    methods:{

      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      /*动画起始*/
      enter(el,done) {
        const {x,y,scale} = this._getPosAndScale()

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper,'move',done)
      },
      afterEnter(){
        animations.registerAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el,done){
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x,y,scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend',done)
      },
      afterLeave(){
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style.transform = ''

      },
      /*动画终止*/

      //左右滑动 开始
      middleTouchStart(e) {
        this.touch.initiated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY

      },
      middleTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaX) < Math.abs(deltaY)) {
          return
        }

        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0,Math.max(-window.innerWidth, deltaX + left))

        this.touch.percent = Math.abs(offsetWidth/window.innerWidth)
        this.$refs.middleL.style.opacity = 1- this.touch.percent
        this.$refs.middleL.style.transitionDuration = 0

        this.$refs.lyricList.$el.style.transform=`translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style.transitionDuration = 0

        //console.log(offsetWidth)
      },
      middleTouchEnd() {
        let opacity
        let offsetWidth

        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = - window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            opacity = 1
            this.currentShow = 'cd'
          } else {
            offsetWidth = - window.innerWidth
            opacity = 0
          }
        }

        const time = 300
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style.transitionDuration = `${time}ms`

        this.$refs.lyricList.$el.style.transform=`translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style.transitionDuration = `${time}ms`

        this.touch.initiated = false
      },
      //左右滑动结束

      //歌词获取
      getLyric() {
        this.currentSong.getLyric().then((lyric) => {

          if (this.currentSong.lyric !== lyric) {
            return
          }

          this.currentLyric = new Lyric(lyric,this.handleLyric)
          //console.log(this.currentLyric)

          //歌曲播放，歌词也跟随滚动播放
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {//歌词获取异常处理
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      handleLyric(ret) {
        this.currentLineNum = ret.lineNum
        //歌词自动滚动
        if (ret.lineNum > 5) {//自动播放歌词到5行以上，scroll开始滚动
          let lineEl = this.$refs.lyricLine[ret.lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl,1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }

        this.playingLyric = ret.txt
        //console.log(this.currentLineNum)
      },
      //歌词获取   完

/*
      //改变播放模式
      changeMode() {
        let mode = (this.mode+1)%3
        this.setPlayMode(mode)

        //console.log('第一次curr'+this.currentIndex)
        let list = null
        if(mode === playMode.random) {//重排序播放列表
          list = shuffList(this.sequenceList)
        }else{
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },
      resetCurrentIndex(list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id
        })
        //console.log('第2次curr'+this.currentIndex)

        this.setCurrentIndex(index)
      },
*/
      togglePlay() {
        if(!this.songReady) {
          return
        }
        this.setPlayingState(!this.playing)

        //播放暂停键切换，歌词的播放暂停也切换
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      //下一曲
      next() {
        if(!this.songReady) {
          return
        }

        if (this.playList.length === 1) {//播放列表只有一首歌
          this.loop()
          return
        } else {
          let index = this.currentIndex+1
          if(index === this.playList.length) {
            index = 0
          }

          this.setCurrentIndex(index)
          if(!this.playing) {//暂停时点击下一曲，播放暂停键改变为播放
            this.togglePlay()
          }
        }

        this.songReady = false
      },
      //上一曲
      prev() {
        if(!this.songReady) {
          return
        }

        if (this.playList.length === 1) {//播放列表只有一首歌
          this.loop()
          return
        } else {
          let index = this.currentIndex - 1
          if(index === -1) {
            index = this.playList.length-1
          }

          this.setCurrentIndex(index)
          if(!this.playing) {//暂停时点击上一曲，播放暂停键改变为播放
            this.togglePlay()
          }
        }

        this.songReady = false
      },
      //audio标签的paly函数，增加一个标志位songReady，防止连续点击，dom报错
      ready() {
        this.songReady = true
        //记录当前播放成功歌曲到本地存储
        this.savePlayHistory(this.currentSong)
      },
      error() {
        this.songReady = true
      },
      end() {
        if (this.mode === playMode.loop) {//单曲循环
          this.loop()
        }else{
          this.next()
        }
      },
      // audio标签相关属性 完


      loop() {//单曲循环播放结束时，audio标签属性重置 歌词跳转到0位置
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()

        //单曲循环
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },

      updateTime(e) {
        //audio标签的timeupdate属性 获取当前播放时间
        this.currentTime = e.target.currentTime
      },
      //子组件progress-bar派发的事件，根据回传的newPercent跳转歌曲时长 跳转歌词滚动
      onProgressPercentChange(newPercent) {
        //console.log(newPercent)
        const currentTime = this.currentSong.duration * newPercent
        this.$refs.audio.currentTime = currentTime

        if (this.currentLyric) {//歌词跟随进度条 跳转
          this.currentLyric.seek(currentTime * 1000)
        }

        if (!this.playing) {
          this.togglePlay()
        }
      },

      //点击mini播放器播放列表
      showPlayList() {
        this.$refs.playlist.show()
      },

      //处理时间回显
      _formatTime(time) {
        let inputTime = time | 0
        let minute = inputTime / 60 | 0 //分钟
        let second = this._pad(inputTime % 60) //秒钟,

        return `${minute}:${second}`
      },
      //时间个位显示，则十位补0
      _pad(inputval,n =2) {
        let len = inputval.toString().length

        while (len < n) {
          inputval = '0'+inputval
          len ++
        }

        return inputval
      },
      _getPosAndScale() {
        const targetWidth = 40//mini播放器唱片宽度
        const paddingLeft = 30// mini播放器唱片x轴距左侧偏移量
        const paddingBottom = 30 //mini播放器唱片y轴距底部偏移量
        const paddingTop = 80//中心唱片y轴距顶端偏移量
        const width = window.innerWidth * 0.8 //中心唱片宽度

        const scale = targetWidth/width
        const x = -(window.innerWidth/2-targetWidth/2-paddingLeft)
        const y = window.innerHeight-paddingTop- width/2 - paddingBottom

        return {x,y,scale}
      },
      ...mapMutations({
        setFullScreen:'SET_FULL_SCREEN',
        setPlayingState:'SET_PLAYING',
        //setCurrentIndex:'SET_CURRENT_INDEX',
        //setPlayMode: 'SET_PLAY_MODE',
        //setPlayList: 'SET_PLAYLIST'
      }),
      ...mapActions([
        'savePlayHistory'
      ])
    },
    watch: {
      currentSong(newVal,oldVal) {
        //播放列表为空，currentSong为空
        if(!newVal.id) {
          return
        }

        if(newVal.id === oldVal.id) {
          return
        }

        //切换歌曲后，清空歌词播放对象 及相关歌词用到的数据
        if (this.currentLyric) {
          this.currentLyric.stop();//
          this.currentLineNum = 0
          this.currentTime = 0
          this.currentLyric = null
        }

        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$refs.audio.play() //audio标签的play函数
          this.getLyric()
        },1000)
      },
      //监听playing状态，决定是否播放
      playing(newPlayingState) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlayingState ? audio.play() : audio.pause()
        })
      }
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      PlayList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          .icon
            flex: 1
            color: $color-theme
            //align-items: center
            text-align: center
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
