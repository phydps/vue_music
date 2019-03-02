import {mapGetters,mapMutations,mapActions} from 'vuex'
import {playMode} from "./config"
import {shuffList} from 'common/js/util2'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  activated() {
    this.handlePlayList(this.playList)
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(newval) {
      this.handlePlayList(newval)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

//播放相关
export const playerMixin = {
  computed: {
    currentPlayModeIcon() {
      return this.mode === playMode.sequence ? 'icon-sequence' :this.mode === playMode.random ? 'icon-random' : 'icon-loop'
    },
    ...mapGetters([
      'mode',
      'sequenceList',
      'currentSong',
      'playList',
      'favoriteList'
    ])
  },
  methods: {
    toggleFavorite(song) {
      if (this.isFavoriteSong(song)) {
        this.deleteFavoriteSong(song)
      }else {
        this.saveFavoriteSong(song)
      }
    },
    //获取歌曲是否是收藏歌曲样式
    getFavoriteCls(song) {
      if (this.isFavoriteSong(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'

    },
    //判断是否是收藏歌曲
    isFavoriteSong(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
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
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList:'SET_PLAYLIST',
      setCurrentIndex:'SET_CURRENT_INDEX'
    }),
    ...mapActions([
      'saveFavoriteSong',
      'deleteFavoriteSong'
    ])
  }
}

//搜索相关
export const searchMixin = {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    //监听search-box的派发事件
    onQueryChange(query) {
      //console.log('yyyy')
      this.query = query
    },
    blurInput() {
      this.$refs.searchBox.searchBoxInputBlur()
    },
    saveSearch() {
      this.saveHistory(this.query)
    },
    //热门词选择或者搜索历史选取一项 进入搜索框搜索
    addQueryKey(hotkey) {
      this.$refs.searchBox.setQuery(hotkey)
    },
    ...mapActions([
      'saveHistory',
      'deleteHistory'
    ]),
  }
}
