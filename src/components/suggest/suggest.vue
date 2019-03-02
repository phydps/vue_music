<template>
  <Scroll class="suggest" :data="result" :pullup="pullup" :beforeScroll="beforeScroll" @scrollToEnd="searchMore" ref="suggest" @beforeScroll="listenBeforeScroll">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCla(item)"></i>
        </div>
        <div class="name">
          <p class="text">{{handlerSingerAndSong(item)}}</p>
        </div>
      </li>
      <Loading title="" v-show="hasMore"></Loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </Scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {getSongVkey} from 'api/song'
  import {createdSong} from 'common/js/song2'
  import Scroll from 'base/scroll2/scroll2'
  import Singer from 'common/js/singer'
  import Loading from 'base/loading2/loading2'
  import NoResult from 'base/no-result/no-result'
  import {mapActions,mapMutations} from 'vuex'

  const perpage = 20
  const SINGER_TYPE = 'singer'

  export default {
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query:{
        type :String,
        default : ''
      }
    },
    data() {
      return {
        page: '1',
        result: [],
        pullup:true,//上拉更新标示
        hasMore:true,//当前展示页是否现有数据已展示完，是否还有数据未展示，可以上拉滚动
        beforeScroll: true
      }
    },
    methods :{
      search() {
        //console.log('rrrr')
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0,0)
        search(this.query,this.page,this.showSinger,perpage).then((res) => {
          if (ERR_OK === res.code) {
            let temp1 = []
            let temp2 = []
            if (res.data.zhida && res.data.zhida.singerid) {
              temp1.push({...res.data.zhida,...{type:SINGER_TYPE}})
            }
            this.result = temp1

            if(res.data.song) {
              this._normolizeSong(res.data.song.list).then((res) => {//异步获取vkey烦死了
                temp2 = res

                this.result = this.result.concat(temp2)

                //console.log(this.result.length)

              })
              this._checkHasMore(res.data)

            }

            //this.result = this._genResult(res.data)
            //console.log(this.result)
          }

        })
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page ++
        search(this.query,this.page,this.showSinger,perpage).then((res) => {
          if (ERR_OK === res.code) {
            //this.result = this._genResult(res.data)
            //console.log(this.result)

            let temp2 = []

            if(res.data.song) {
              //this.result = this.result.concat(this._normolizeSong(res.data.song.list))
              this._normolizeSong(res.data.song.list).then((res) => {
                temp2 = res

                this.result = this.result.concat(temp2)

                //console.log(this.result)

              })
              //console.log(this.result)
              this._checkHasMore(res.data)

            }
          }

        })
      },
      getIconCla(item) {
        if (item.type=== SINGER_TYPE) {
          return 'icon-mine'
        }else {
          return 'icon-music'
        }
      },
      handlerSingerAndSong(item){
        if (item.type === SINGER_TYPE) {
          return item.singername
        }else {
          return `${item.name}-${item.singer}`
        }
      },
      selectItem(item) {
        if (item.type === SINGER_TYPE) {//歌手
          const singer = new Singer({id:item.singermid,name:item.singername})
          this.$router.push({
            path:'/search/${singer.id}'
          })

          this.setSinger(singer)
        }else {
          //console.log(item)
          this.insertSong(item)
        }

        //
        this.$emit('select',item)
      },
      listenBeforeScroll() {
        this.$emit('listScroll')
      },
      refresh() {
        this.$refs.suggest.refresh()
      },
      _checkHasMore(data) {

        //console.log(data)
        const song = data.song
        if (!song.list.length || (song.curnum+song.curpage * perpage) >= song.totalnum) {
          this.hasMore = false
        }
        //console.log((song.curnum+song.curpage * perpage)-song.totalnum)

      },
      _genResult(data) {
        let arr = []
        //存在歌手
        if (data.zhida && data.zhida.singerid) {
          arr.push({...data.zhida,...{type: SINGER_TYPE}})
        }
        if(data.song) {
          this._normolizeSong(data.song.list).then((ret) => {
            arr = arr.concat(ret)

            //console.log(arr)
            return arr
          })
        }
        return arr
      },
      _normolizeSong(list) {
        //var deferred = new $.Deferred()
        return new Promise((resolve) => {
          let arr = []
          list.forEach((item,index) => {
            if (item.songid && item.albumid) {
              getSongVkey(item.songmid).then((res) => {
                //console.log(res)
                if(ERR_OK === res.code){
                  const svkey = res.data.items
                  const songVkey = svkey[0].vkey

                  const newSong = createdSong(item,songVkey)

                  arr.push(newSong)


                  if(index == list.length-1) {
                    //console.log(arr.length)
                    return resolve(arr)

                  }
                }
              })
            }
          })
          //console.log(arr.length)
        })



        //return arr
/*
        return new Promise((resolve,reject) => {
          let ret =[]
          list.forEach((item) => {
            if(item.songid && item.albummid) {
              getSongVkey(item.songmid).then((res) => {
                if (ERR_OK === res.code) {
                  const svkey = res.data.items
                  const songVkey = svkey[0].vkey
                  //console.log(songVkey)
                  const newSong = createdSong(item,songVkey)

                  ret.push(newSong)
                }
              })
            }
          })
          //console.log(ret)
          resolve(ret)
        })
*/

      },
      ...mapMutations({
        setSinger:'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query() {
        this.search()
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
        .icon
          flex: 0 0 30px
          width: 30px
          [class^="icon-"]
            font-size: 14px
            color: $color-text-d
        .name
          flex: 1
          font-size: $font-size-medium
          color: $color-text-d
          overflow: hidden
          .text
            no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
