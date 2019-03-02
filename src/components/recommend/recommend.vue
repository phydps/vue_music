<template>
  <div class="recommend" ref="recommend">
    <Scroll class="recommend-content" ref="scroll" :data="discList">
     <div>
      <div class="slider-wrapper" v-if="recommends.length">
        <Slider >
          <div v-for="item in recommends">
             <a :href="item.linkUrl">
               <img @load="loadImg" :src="item.picUrl"/>
             </a>
          </div>
        </Slider>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
            <li @click="selectItem(item)" v-for="item in discList" class="item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
        </ul>
      </div>
     </div>
     <div class="loading-container" v-show="!discList.length">
        <Loading></Loading>
     </div>
    </Scroll>

    <router-view></router-view>

  </div>
</template>

<script type="text/ecmascript-6">
  import {getRecommend,getDiscList} from 'api/recommend2'
  import {ERR_OK} from 'api/config'
  import Slider from 'base/slider/slider2'
  import {commonParams, options} from 'api/config'
  import Scroll from 'base/scroll2/scroll2'
  import Loading from 'base/loading2/loading2'
  import {playListMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mixins : [playListMixin],
    data() {
      return {
        recommends: [],
        discList: []
      }
    },
    created() {

      /* 测试滚动图片加载速度慢,配合scrool刷新滚动区域
      setTimeout(() => {
        this._getRecommend()
      }, 2000)
  */

      this._getRecommend()
      //this._getDiscList()


      setTimeout(() => {
        this._getDiscList()
      }, 1000)


    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length> 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },

      selectItem(item) {
        //console.log(item)
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })

        this.setDisc(item)
      },
       _getRecommend() {
         getRecommend().then((res) => {
           if(res.code===0){
             //console.log(res.data.slider)
             this.recommends=res.data.slider
           }
         })

       },
       _getDiscList() {
         getDiscList().then((res) => {
            if (res.code === ERR_OK) {
              this.discList = res.data.list
              //console.log(res.data.list)
            }
          })


         const data2 = Object.assign({}, commonParams, {
            platform: 'yqq',
            hostUin: 0,
            sin: 0,
            ein: 29,
            sortId: 5,
            needNewCode: 0,
            categoryId: 10000000,
            rnd: Math.random(),
            format: 'json'
         })

         // console.log(data2)
       },
       /*  添加load事件，以确保scroll计算内层元素高度时，内层dom元素已全部渲染（即内层高度已被撑开）
          （Scroll组件内层元素主要是 滚动图片和歌曲列表2部分。此处用于图片占位，即保证至少有一张图片被渲染 产品列表已有传给Scroll组件的data数据撑开）
       */
       loadImg() {
         if (!this.loadImgSuccess) {
           this.$refs.scroll.refresh()
           this.loadImgSuccess = true
         }
       },
      ...mapMutations({
        setDisc : 'SET_DISC'
      })
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"

.recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
