import {playMode} from "../common/js/config";
import {loadPlay, loadSearch, loadFavoriteList} from "../common/js/cache"

const state = {
  singer:{},
  playing:false,//播放状态
  fullScreen:false,//是否全屏播放
  playList:[],//当前播放歌单
  sequenceList:[],//原始歌单列表
  mode:playMode.sequence, //播放模式
  currentIndex:-1,//当前播放歌曲下标
  disc: {},//推荐歌单
  topList:{},//排行榜歌单
  searchHistory:loadSearch(),//本地存储历史搜索记录
  playHistory:loadPlay(),//歌曲历史播放记录，从本地读取
  favoriteList: loadFavoriteList()
}

export default state
