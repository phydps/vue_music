<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>

</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getMusicList} from 'api/rank'
  import {getSongVkey} from 'api/song'
  import {createdSong} from 'common/js/song2'
  import {ERR_OK} from 'api/config'


  export default {
    data() {
      return {
        songs:[]
      }
    },
    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        return this.topList.picUrl
      },
      ...mapGetters([
        'topList'
      ])
    },
    created(){
      this._getMusicList()
    },
    methods: {
      _getMusicList(){
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }

        getMusicList(this.topList.id).then((res) => {
          if (ERR_OK === res.code) {
            this.songs = this._normolizeSong(res.songlist)
            //console.log(this.songs)
          }



        })
      },

      _normolizeSong(list){
        let ret = []
        list.forEach((item) => {
          let {musicData} = item.data
          //console.log(item.data)
          if(item.data.songid && item.data.albumid) {

            getSongVkey(item.data.songmid).then((res) => {
              //console.log(res)
              if(ERR_OK === res.code){
                const svkey = res.data.items
                const songVkey = svkey[0].vkey

                const newSong = createdSong(item.data,songVkey)

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
  .slide-enter-active,.slide-leave-active
     transition: all 0.3s
  .slide-enter,.slide-leave-to
     transform :translate3d(100%,0,0)
</style>
