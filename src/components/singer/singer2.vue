<template>
  <div class="singers" ref="singers">
    <list-view :data="singers" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>

  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import listView from 'base/listview2/listview2'
  import {Singer} from 'common/js/singer'
  import {mapMutations} from 'vuex'
  import {playListMixin} from 'common/js/mixin'

  export default{
    mixins : [playListMixin],
    data(){
      return {
        singers:[]
      }
    },
    created(){
      this._getSingerList();
    },
    methods:{
      handlePlayList(playList) {
        const bottom = playList.length> 0 ? '60px' : ''
        this.$refs.singers.style.bottom = bottom
        this.$refs.list.refresh()
      },

      selectSinger(singer){
        this.$router.push({path:`/singer/${singer.id}`})
        //console.log(singer)

        this.setSinger(singer)
      },

      _getSingerList(){
        getSingerList().then((res) => {
          if(0===res.code){
            this.singers=this._normalizedData(res.data.list)
            //console.log(res.data.list)
          }
        })
      },
      //格式化处理数据
      _normalizedData(data){
        let map = {
          hot:{
            title:'热门',
            items:[]
          }
        }

        data.forEach((val,index) => {
          if(index<10){
            map.hot.items.push({
              avatar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${val.Fsinger_mid}.jpg?max_age=2592000`,
              name:val.Fsinger_name,
              id:val.Fsinger_mid
            })
          }

          const key = val.Findex
          if(!map[key]){
            map[key]={
              title:key,
              items:[]
            }
          }

          map[key].items.push({
            avatar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${val.Fsinger_mid}.jpg?max_age=2592000`,
            name:val.Fsinger_name,
            id:val.Fsinger_mid
          })
        })

        let hot = []
        let ret = []
        for(let key in map){
          let val = map[key]
          if(val.title=='热门'){
            hot.push(val)
          }else if(val.title.match(/[a-zA-Z]/)){
            ret.push(val)
          }
        }

        //升序排列
        ret.sort((a,b)=>{
          return a.title.charCodeAt(0)-b.title.charCodeAt(0)
        })

        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger : 'SET_SINGER'
      })
    },
    components:{
      listView
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singers
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
