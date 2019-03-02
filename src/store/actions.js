import * as types from './mutation-types'
import {playMode} from "../common/js/config"
import {shuffList} from "../common/js/util2";
import {saveSearch,deleteSearch,clearSearch,savePlay,saveFavorite,deleteFavorite} from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function({commit,state},{list,index}){
  commit(types.SET_SEQUENCE_LIST,list)

  commit(types.SET_PLAYLIST,list)

  commit(types.SET_CURRENT_INDEX,index)

  commit(types.SET_PLAYING,true)

  commit(types.SET_FULL_SCREEN,true)
}

export const randomPlay = function({commit},{list}) {
  commit(types.SET_PLAY_MODE,playMode.random)

  commit(types.SET_SEQUENCE_LIST,list)

  let randomList = shuffList(list)
  commit(types.SET_PLAYLIST,randomList)

  commit(types.SET_CURRENT_INDEX,0)

  commit(types.SET_PLAYING,true)

  commit(types.SET_FULL_SCREEN,true)

}

export const insertSong = function({commit,state},song){
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  //记录当前播放歌曲
  let currentSong = playList[currentIndex]

  //查找当前播放列表中是否有待插入的这首歌，并返回index
  let findPlayListIndex = findIndex(playList,song)

  //因为时插入歌曲所以 索引+1
  currentIndex ++
  //console.log(currentIndex)
  //当前索引位置插入歌曲
  playList.splice(currentIndex,0,song)
  //console.log(playList)

  //如果原播放列表包含了待插入的歌曲
  if (findPlayListIndex > -1) {
    if (currentIndex > findPlayListIndex) {//插入的歌曲的序号大于列表中的序号（即插入的歌曲之前的位置还有一首同样的歌曲存在，删掉之前重复的歌曲，并序号减1）
      playList.splice(findPlayListIndex,1)
      currentIndex --
    }else {//插入的歌曲的序号小于等于列表中的序号（即插入的歌曲在同样歌曲之前，删掉后面的同样的歌曲）
      playList.splice(findPlayListIndex + 1,1)
    }
  }

  let currentSIndex = findIndex(sequenceList,currentSong) + 1

  let fSIndex = findIndex(sequenceList,song)

  sequenceList.splice(currentSIndex,0,song)

  if (fSIndex > -1) {
    if (currentSIndex > fSIndex) {
      sequenceList.splice(fSIndex, 1)
    }else {
      sequenceList.splice(fSIndex+1,1)
    }
  }

  commit(types.SET_PLAYLIST,playList)
  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_CURRENT_INDEX,currentIndex)

  commit(types.SET_PLAYING,true)

  commit(types.SET_FULL_SCREEN,true)

}

export const saveHistory = function({commit},query) {
  commit(types.SET_SEARCH_HISTORY,saveSearch(query))

}

export const deleteHistory = function({commit},query) {
  commit(types.SET_SEARCH_HISTORY,deleteSearch(query))
}

export const clearHistory = function({commit}) {
  commit(types.SET_SEARCH_HISTORY,clearSearch())
}

//删除一首歌
export const deleteSong = function({commit,state},song){
  let playList = state.playList.slice();//声明副本，防止数据污染，最后更改后用commit提交即可
  let sequenceList = state.sequenceList.slice();//声明副本，防止数据污染，最后更改后用commit提交即可
  let currentIndex = state.currentIndex

  const pIndex = findIndex(playList,song)
  playList.splice(pIndex,1);//删除当前播放列表中该首歌

  const sIndex = findIndex(sequenceList,song)
  sequenceList.splice(sIndex,1)

  if (currentIndex > pIndex || currentIndex === playList.length) {//当前播放歌曲的在playList数组中的下标大于要删除歌曲在该数组中的下标，需自减currentIndex;
    currentIndex --
  }

  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_PLAYLIST,playList)
  commit(types.SET_CURRENT_INDEX,currentIndex)

  //增加判断删除一首歌后，是否继续播放;即是否是删除最后一首歌，播放器控件是否继续播放
  if (!playList.length) {
    commit(types.SET_PLAYING,false)
  }else{
    commit(types.SET_PLAYING,true)
  }

}

//清空播放列表
export const clearSongLists =function({commit}) {
  commit(types.SET_PLAYING,false)
  commit(types.SET_CURRENT_INDEX,-1)
  commit(types.SET_PLAYLIST,[])
  commit(types.SET_SEQUENCE_LIST,[])
}

//存储歌曲播放到本地
export const savePlayHistory= function ({commit},song) {
  commit(types.SET_PLAY_HISTORY,savePlay(song))
}

//存储喜爱歌曲到本地列表数组
export const saveFavoriteSong = function({commit},song) {
  commit(types.SET_FAVORITE_LIST,saveFavorite(song))
}

export const deleteFavoriteSong = function({commit},song) {
  commit(types.SET_FAVORITE_LIST,deleteFavorite(song))
}
