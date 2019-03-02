<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent.stop="progressTouchStart" @touchmove.prevent.stop="progressTouchMove" @touchend.prevent="progressTouchEnd">
        <div class="progress-btn" ></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const progressBtnWidth = 16 //进度条按钮宽度
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      progressTouchStart(e) {
        //console.log('ttt')
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e) {
        if(!this.touch.initiated) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX //x轴位移量
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth-progressBtnWidth,Math.max(0,deltaX+this.touch.left))

        //
        this._offset(offsetWidth)
      },
      progressTouchEnd() {
        this._trigglePercent()
        this.touch.initiated = false
      },
      progressClick(e) {
        const offsetX = e.offsetX
        this._offset(offsetX)
        this._trigglePercent()
      },
      //计算percent比例，回传派发给父组件percentChange事件
      _trigglePercent() {
        const percent = this.$refs.progress.clientWidth/(this.$refs.progressBar.clientWidth - progressBtnWidth)

        this.$emit('percentChange',percent)
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width =  `${offsetWidth}px`
        this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`
      }
    },
    watch: {
      //观测父组件所传时间比值，实时调整进度条样式
      percent(newPercent) {
        if(newPercent >= 0 && !this.touch.initiated) {
          const barwidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const progresswidth = barwidth * newPercent

          this._offset(progresswidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
