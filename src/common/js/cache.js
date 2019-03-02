import storage from 'good-storage'
import {favoriteList} from "../../store/getters"; //本地记录存储用

const SEARCH_KEY = '__search__'
const SERCH_KEY_MAX_LENGTH = 15

const PLAY_KEY = '__paly__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

function insertKeysArray(arr, val, compar, SERCH_KEY_MAX_LENGTH) {

  const index =arr.findIndex(compar)

  if (index === 0) {//插入的val值在数组中且是第一位
    return
  }

  if (index > 0) {
    arr.splice(index, 1)//删除原数组重复的值
  }
  arr.unshift(val)//插入数组第一位

  if (SERCH_KEY_MAX_LENGTH && arr.length > SERCH_KEY_MAX_LENGTH) {
    arr.pop()
  }
}

function deleteKeysArray(arr,compar){
  const index = arr.findIndex(compar)

  if (index > -1) {
    arr.splice(index,1)
  }
}


export function loadSearch() {
  return storage.get(SEARCH_KEY,[])
}

//保存一条历史记录
export function saveSearch(query) {
  const searches = storage.get(SEARCH_KEY,[])

  insertKeysArray(searches, query, (item) => {
    return item.trim() === query.trim()
  },SERCH_KEY_MAX_LENGTH)

  storage.set(SEARCH_KEY,searches)

  return searches
}

//删除一条历史记录
export function deleteSearch(query) {
  const searches = storage.get(SEARCH_KEY,[])

  deleteKeysArray(searches,(item) => {
    return item.trim() === query.trim()
  })

  storage.set(SEARCH_KEY,searches)

  return searches
}

//清除所有历史记录
export function clearSearch (){
  storage.remove(SEARCH_KEY)
  return []
}

//加载本地存储歌曲播放记录
export function loadPlay() {
  return storage.get(PLAY_KEY,[])
}

//保存当前播放歌曲到本地（记录播放记录）
export function savePlay(song) {
  const plays = storage.get(PLAY_KEY,[])
  insertKeysArray(plays,song,(item) => {
    return item.id === song.id
  },PLAY_MAX_LENGTH)

  storage.set(PLAY_KEY,plays)
  return plays
}

//存储一首歌曲到喜爱歌曲列表并到本地保存
export function saveFavorite(song) {
  const favoriteLists = storage.get(FAVORITE_KEY,[])
  insertKeysArray(favoriteLists,song,(item) => {
    return item.id === song.id
  },FAVORITE_MAX_LENGTH)

  storage.set(FAVORITE_KEY,favoriteLists)
  return favoriteLists
}

//从喜爱歌曲列表中删除一首歌
export function deleteFavorite(song) {
  const favoriteLists = storage.get(FAVORITE_KEY,[])

  deleteKeysArray(favoriteLists,(item) => {
    return item.id === song.id
  })

  storage.set(FAVORITE_KEY,favoriteLists)
  return favoriteLists
}

//从本地获取喜爱列表
export function loadFavoriteList() {
  return storage.get(FAVORITE_KEY,[])
}
