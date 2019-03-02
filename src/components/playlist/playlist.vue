<template>
  <transition name="list-fade">
    <div class="playlist" name="playlist" @click="hide" v-show="showFlag">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon"  :class="currentPlayModeIcon" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="confirmShow"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll class="list-content" :data="sequenceList" ref="listContent">
          <ul ref="list" name="list" >
            <li class="item" v-for="item in sequenceList" ref="item">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
                <i :class="getFavoriteCls(item)"></i>
              </span>
              <span class="delete" @click="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </ul>
        </scroll>
        <div class="list-operate">
          <div  class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div  class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters,mapActions} from 'vuex'
  import Scroll from 'base/scroll2/scroll2'
  import Confirm from 'base/confirm/confirm'
  import {playMode} from 'common/js/config'
  import {playerMixin} from 'common/js/mixin'
  import AddSong from 'components/add-song/add-song'

  export default {
    mixins: [playerMixin],
    data() {
      return {
        showFlag:false
      }
    },
    computed: {

      modeText() {//当前播放模式文本
        return this.mode === playMode.sequence ? '顺序播放' :this.mode === playMode.random ? '随机播放' : '单曲循环'
      },


    },
    methods: {
      addSong() {
        this.$refs.addSong.show()
      },
      //列表中正在播放的歌曲前显示当前播放样式
      getCurrentIcon(item) {
        if (item.id === this.currentSong.id){
          return 'icon-play'
        }
      },
      //清空播放列表提示
      confirmShow() {
        this.$refs.confirm.show()
      },
      //确认清空播放列表
      confirmClear() {
        this.clearSongLists()
        this.hide()
      },
      //删除一首歌
      deleteOne(item){
        this.deleteSong(item)
        if(!this.playList.length){//播放列表被删完了
          this.hide()
        }
      },
      //当前播放歌曲滚动到第一行显示
      scrollToCurrent(song) {
        const sIndex = this.sequenceList.findIndex((item) => {
          return item.id === song.id
        })

        this.$refs.listContent.scrollToElement(this.$refs.list.children[sIndex],300)
      },
      show() {
        this.showFlag = true

        setTimeout(() => {
          this.$refs.listContent.refresh()
          this.scrollToCurrent(this.currentSong)
        },20)
      },
      hide() {
        this.showFlag = false
      },
      ...mapActions([
        'deleteSong',
        'clearSongLists'
      ])
    },
    watch: {
      currentSong(newSong,oldSong) {
        setTimeout(() => {
          this.scrollToCurrent(newSong)
        },20)
      }
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
