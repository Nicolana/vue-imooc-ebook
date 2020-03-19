<template>
  <div class="ebook-reader">
    <div id="read">
    </div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import Epub from 'epubjs'
  global.ePub = Epub
  export default {
    name: 'EbookReader',
    mixins: [ebookMixin],
    methods: {
      prevPage () {
        if (this.rendition) {
          this.hiddeTitleAndMenu()
          this.rendition.prev()
        }
      },
      nextPage () {
        if (this.rendition) {
          this.hiddeTitleAndMenu()
          this.rendition.next()
        }
      },
      toggleTitleAndMenu () {
        this.setMenuVisible(!this.menuVisible)
      },
      hiddeTitleAndMenu () {
        this.setMenuVisible(false)
      },
      initEpub () {
        const url = 'http://static.helloworld.com:8081/epub/' + this.fileName + '.epub'
        this.book = new Epub(url)
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight,
          method: 'default'
        })
        this.rendition.display()
        this.rendition.on('touchstart', event => {
          this.touchStartX = event.changedTouches[0].clientX
          this.touchStartTime = event.timeStamp
        })
        this.rendition.on('touchend', event => {
          const offsetX = event.changedTouches[0].clientX - this.touchStartX
          const time = event.timeStamp - this.touchStartTime
          if (time < 500 && offsetX > 40) {
            this.prevPage() // 跳转到上一页
          } else if (time < 500 && offsetX < -40) {
            this.nextPage() // 跳转到下一页
          } else {
            this.toggleTitleAndMenu()
          }
          // event.preventDefault()
          event.stopPropagation()
        })
      }
    },
    mounted () {
      const fileName = this.$route.params.fileName.split('|').join('/')
      this.setFileName(fileName).then(() => {
        this.initEpub()
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/global';
</style>
