<template>
  <div class="ebook">
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
  </div>
</template>

<script>
  import EbookReader from '../../components/ebook/EbookReader'
  import EbookTitle from '../../components/ebook/EbookTitle'
  import EbookMenu from '../../components/ebook/EbookMenu'
  import { getReadTime, saveReadTime } from '../../utils/localStorage'
  import { ebookMixin } from '../../utils/mixin'
  export default {
    name: 'index',
    mixins: [ebookMixin],
    components: {
      EbookReader,
      EbookTitle,
      EbookMenu
    },
    methods: {
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

</style>
