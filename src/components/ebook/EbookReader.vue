<template>
  <div class="ebook-reader">
    <div id="read">
    </div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import Epub from 'epubjs'
  import { getFontFamily, getFontSize, saveFontFamily, saveFontSize } from '../../utils/localStorage'
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
        if (this.menuVisible) {
          this.setSettingVisible(-1)
          this.setFontFamilyVisible(false)
        }
        this.setMenuVisible(!this.menuVisible)
      },
      hiddeTitleAndMenu () {
        this.setMenuVisible(false)
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      },
      initFontSize () {
        // Fontsize Setting
        const fontSize = getFontSize(this.fileName)
        if (!fontSize) {
          saveFontSize(this.fileName, this.defaultFontSize)
        } else {
          // 有配置字体
          this.rendition.themes.fontSize(fontSize)
          this.setDefaultFontSize(fontSize)
        }
      },
      initFontFamily () {
        // Font Setting
        const font = getFontFamily(this.fileName)
        if (!font) {
          saveFontFamily(this.fileName, this.defaultFontFamily)
        } else {
          // 有配置字体
          this.rendition.themes.font(font)
          this.setDefaultFontFamily(font)
        }
      },
      initEpub () {
        const url = `${process.env.VUE_APP_RES_URL}/epub/${this.fileName}.epub`
        this.book = new Epub(url)
        this.setCurrentBook(this.book)
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight,
          method: 'default'
        })
        this.rendition.display().then(() => {
          this.initFontSize()
          this.initFontFamily()
        })
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
        this.rendition.hooks.content.register(contents => {
          Promise.all([
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
          ])
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