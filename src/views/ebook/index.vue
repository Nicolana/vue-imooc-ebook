<template>
  <div class="ebook" ref="ebook">
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
    <ebook-bookmark></ebook-bookmark>
  </div>
</template>

<script>
  import EbookReader from '../../components/ebook/EbookReader'
  import EbookTitle from '../../components/ebook/EbookTitle'
  import EbookMenu from '../../components/ebook/EbookMenu'
  import EbookBookmark from '../../components/ebook/EbookBookmark'
  import { getReadTime, saveReadTime } from '../../utils/localStorage'
  import { ebookMixin } from '../../utils/mixin'
  export default {
    name: 'index',
    mixins: [ebookMixin],
    components: {
      EbookReader,
      EbookTitle,
      EbookMenu,
      EbookBookmark
    },
    watch: {
      offsetY (v) {
        if (!this.menuVisible && this.bookAvailable) {
          if (v > 0) {
            this.move(v)
          } else if (v === 0) {
            this.restore(v)
          }
        }
      }
    },
    methods: {
      restore (v) {
        this.$refs.ebook.style.top = 0
        this.$refs.ebook.style.transition = 'all .2s linear'
        setTimeout(() => {
          this.$refs.ebook.style.transition = ''
        }, 200)
      },
      move (v) {
        this.$refs.ebook.style.top = v + 'px'
      },
      startLoopReadTime () {
        // 计算阅读时间
        // let readTime = getReadTime(this.fileName)
        let readTime = getReadTime(this.fileName)
        if (!readTime) {
          // 阅读时间不存在，说明我们是第一次进入，需要初始化阅读时间
          readTime = 0
        }
        // 设置定时器，每一秒对定时器执行加一操作
        this.task = setInterval(() => {
          readTime++
          // eslint-disable-next-line no-constant-condition
          if (readTime % 30 === 0) {
            if (this.fileName !== undefined) {
              saveReadTime(this.fileName, readTime)
            }
          }
        }, 1000)
      }
    },
    mounted () {
      this.startLoopReadTime()
    },
    beforeDestroy () {
      if (this.task) {
        // 终止定时任务
        clearInterval(this.task)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/css" scoped>
  @import '../../assets/styles/global';
  .ebook {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
