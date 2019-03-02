<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSonglist} from 'api/recommend2'
  import {ERR_OK} from 'api/config'
  import {createdSong} from 'common/js/song2'
  import {getSongVkey} from 'api/song'

  export default {
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList(){
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }


        getSonglist(this.disc.dissid).then((res) => {
          //console.log(ERR_OK === res.code)
          if (ERR_OK === res.code) {
            this.songs = this._normolizeSongList(res.cdlist[0].songlist)
            //console.log(res)
          }
        })
      },
      _normolizeSongList(list){
        let arr = []
        list.forEach((item) => {
          if (item.songid && item.albumid) {
            getSongVkey(item.songmid).then((res) => {
              //console.log(res)
              if(ERR_OK === res.code){
                const svkey = res.data.items
                const songVkey = svkey[0].vkey

                const newSong = createdSong(item,songVkey)

                arr.push(newSong)
              }
            })
          }
        })

        return arr
      }
    },
    components:{
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
