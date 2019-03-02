<template>
  <div class="singers">
    <list-view :data="singers"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
	import {getSingerList} from 'api/singer'
	import {ERR_OK} from 'api/config'
  import ListView from 'base/listview/listview'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

	export default {
	  data() {
      return {
        singers: []
      }
	  },
		created() {
		  this._getSingerList()
		},
		methods: {
		  _getSingerList() {
	       getSingerList().then((res) => {
	          if (ERR_OK === res.code) {
	             this.singers = this._normalizedData(res.data.list)
	             console.log(this.singers)

	          }
	       })
		  },

		  //处理数据
		  _normalizedData(list) {
         let map = {
            hot :{
              title: HOT_NAME,
              items: []
            }
         }

         list.forEach((item, index) => {
           if (index < HOT_SINGER_LEN) {
              map.hot.items.push({
                name: item.Fsinger_name,
                avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`,
                id: item.Findex
              })
           }

           const key = item.Findex
           if (!map[key]) {
              map[key] ={
                 title: key,
                 items: []
              }
           }

           map[key].items.push({
                name: item.Fsinger_name,
                avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`,
                id: item.Findex
           })

         })
         //整理处理map为一维数组
         const hot = []
         const ret = []
         for (let key in map) {
            const val = map[key]
            if (val.title === HOT_NAME) {
               hot.push(val)
            } else if (val.title.match(/[a-zA-Z]/)) {
               ret.push(val)
            }
         }

         ret.sort((a, b) => {
           return a.title.charCodeAt(0) - b.title.charCodeAt(0)
         })

         return hot.concat(ret)
		  }
		},
		components: {
		  ListView
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	.singers
	    position: fixed
	    top: 88px
	    bottom: 0
	    width: 100%
</style>
