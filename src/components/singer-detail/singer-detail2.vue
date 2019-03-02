<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>

</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import MusicList from 'components/music-list/music-list'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createdSong} from 'common/js/song2'
  import {getSongVkey} from 'api/song'

  export default {
    data(){
      return {
        songs:[]
      }
    },
    computed:{
      title(){
        return this.singer.name
      },
      bgImage(){
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    created(){
      this._getDetail()
    },
    methods:{
      _getDetail(){
        //console.log(this.singer)
        getSingerDetail(this.singer.id).then((res) => {
          //console.log(res)
          if(ERR_OK === res.code){
            this.songs = this._normolizeSongList(res.data.list)
            //console.log(this.songs)
          }
        })
      },
      _normolizeSongList(list){
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if(musicData.songid && musicData.albumid) {

            getSongVkey(musicData.songmid).then((res) => {
              //console.log(res)
              if(ERR_OK === res.code){
                const svkey = res.data.items
                const songVkey = svkey[0].vkey

                const newSong = createdSong(musicData,songVkey)

                ret.push(newSong)
              }
            })
            //ret.push(createdSong(musicData))
          }
        })

        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active,.slide-leave-active
      transition:all 0.3s
  .slide-enter,.slide-leave-to
      transform :translate3d(100%,0,0)
</style>
