<template>
  <transition name="slide">
    <div class="add-song" @click.stop v-show="showFlag">
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" >
          <i class="icon-close" @click="hide"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box placeholder="搜索歌曲" @query="onQueryChange" ref="searchBox"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <div class="list-wrapper">
          <switches :switches="switches" @switchClick="switchItem" :currentIndex="currentIndex"></switches>

          <div class="list-scroll">
            <!--最近播放-->
            <scroll ref="songList" :data="playHistory" v-if="currentIndex===0" class="list-scroll" >
              <div class="list-inner">
                <song-list :songs="playHistory" @select="selectSong"></song-list>
              </div>
            </scroll>
            <!--搜索历史-->
            <scroll ref="searchList" :data="searchHistory" v-if="currentIndex===1" class="list-scroll" >
              <div class="list-inner">
                <search-list :searches="searchHistory" @delete="deleteHistory" @select="addQueryKey"></search-list>
              </div>
            </scroll>
          </div>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" @listScroll="blurInput" @select="selectSuggest" ref="suggest" :showSinger="showSinger"></suggest>
      </div>
      <top-tip ref="topTip" :delayTime="delayTime">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲添加至播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import {searchMixin} from 'common/js/mixin'
  import Suggest from 'components/suggest/suggest'
  import Switches from 'base/switches/switches'
  import SongList from 'base/song-list/song-list'
  import {mapGetters,mapActions} from 'vuex'
  import Scroll from 'base/scroll2/scroll2'
  import SearchList from 'base/search-list/search-list'
  import Song from 'common/js/song2'
  import TopTip from 'base/top-tip/top-tip'

  export default {
    mixins: [searchMixin],
    data() {
      return {
        showFlag: false,
        showSinger: false,
        currentIndex: 0,
        switches: [
          {name:'最近播放'},
          {name:'搜索记录'}
        ],
        delayTime: 2000
      }
    },
    computed: {
      ...mapGetters([
        'playHistory',
        //'searchHistory'
      ])
    },
    methods :{
      show() {
        this.showFlag = true

        //列表展示。重新计算scroll高度，即刷新
        setTimeout(() => {
          if(this.currentIndex === 0) {
            this.$refs.songList.refresh()
          }else {
            this.$refs.searchList.refresh()
          }
        }, 20)

      },
      hide() {
        this.showFlag = false
      },
      switchItem(index) {
        this.currentIndex = index
      },
      //点击最近播放列表，插入歌曲到当前播放列表并播放
      selectSong(song,index) {
        if (index !== 0) {
          //console.log(song)
          this.insertSong(new Song(song))
          this.topTipShow()
        }
      },
      selectSuggest() {
        this.saveSearch()//搜索历史保存
        this.topTipShow()
      },
      topTipShow(){
        this.$refs.topTip.show()
      },
      ...mapActions([
        'insertSong'
      ])
    },
    components: {
      SearchBox,
      Suggest,
      Switches,
      SongList,
      SearchList,
      Scroll,
      TopTip
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
