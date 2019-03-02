<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" v-model="query" :placeholder="placeholder" ref="inputQuery"/>
    <i class="icon-dismiss" @click="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from 'common/js/util2'

  export default {
    props: {
      placeholder: {
        type : String,
        default : '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        query:''
      }
    },
    methods:{
      //清空搜索栏
      clear() {
        this.query = ''
      },
      //外部调用
      setQuery(query) {
        this.query = query
      },
      searchBoxInputBlur() {
        this.$refs.inputQuery.blur()
      }
    },
    created() {
      //debounce方法 节流搜索交易，防止连续快速输入多次发送搜索交易
      this.$watch('query',debounce((newQuery) => {
        this.$emit('query',newQuery)
      },200))
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    //width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
