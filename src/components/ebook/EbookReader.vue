<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div
      class="ebook-reader-mask"
      @click="onMaskClick"
      @touchmove="move"
      @touchend="moveEnd"
      @mousedown.left="onMouseEnter"
      @mousemove.left="onMouseMove"
      @mouseup.left="onMouseEnd"
    ></div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import { flatten } from '../../utils/book'
  import Epub from 'epubjs'
  import {
    getFontFamily,
    getFontSize,
    getTheme,
    saveFontFamily,
    saveFontSize,
    saveTheme,
    getLocation
  } from '../../utils/localStorage'
  global.ePub = Epub
  export default {
    name: 'EbookReader',
    mixins: [ebookMixin],
    methods: {
      // 1 - 鼠标进入状态
      // 2 - 鼠标进入后的移动
      // 3 - 鼠标从移动状态松手
      // 4 - 鼠标还原
      onMouseEnd (e) {},
      onMouseMove (e) {
        if (this.mouseState === 1) {
          console.log('you are moving')
          this.mouseState = 2
        } else if (this.mouseState === 2) {
          console.log('你进入了第二阶段')
        }
        e.preventDefault()
        e.stopPropagation()
      },
      onMouseEnter (e) {
        this.mouseState = 1
        e.preventDefault()
        e.stopPropagation()
      },
      move (e) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.changedTouches[0].clientY - this.firstOffsetY // 拖动当前的位置减去初始值，由此获得Y轴的偏移量
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.changedTouches[0].clientY // 拖动的起点
        }
        e.preventDefault()
        e.stopPropagation()
      },
      moveEnd (e) {
        this.setOffsetY(0) // 拖动松开，还原偏移量
        this.firstOffsetY = null
      },
      onMaskClick (e) {
        const offsetX = e.offsetX
        const width = window.innerWidth
        if (offsetX > 0 && offsetX < width * 0.3) {
          this.prevPage()
        } else if (offsetX > 0 && offsetX > width * 0.7) {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
        e.preventDefault()
        e.stopPropagation()
      },
      prevPage () {
        if (this.rendition) {
          this.hideTitleAndMenu()
          this.rendition.prev().then(() => {
            this.refreshLocation()
          })
        }
      },
      nextPage () {
        if (this.rendition) {
          this.hideTitleAndMenu()
          this.rendition.next().then(() => {
            this.refreshLocation()
          })
        }
      },
      toggleTitleAndMenu () {
        if (this.menuVisible) {
          this.setSettingVisible(-1)
          this.setFontFamilyVisible(false)
        }
        this.setMenuVisible(!this.menuVisible)
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
      initTheme () {
        let defaultTheme = getTheme(this.fileName)
        if (!defaultTheme) {
          defaultTheme = this.themeList[0].name
          saveTheme(this.fileName, defaultTheme)
        }
        this.setDefaultTheme(defaultTheme)
        this.themeList.forEach(theme => {
          this.rendition.themes.register(theme.name, theme.style)
        })
        this.rendition.themes.select(defaultTheme)
      },
      initRendition () {
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight,
          method: 'default'
          // flow: 'scrolled'
        })
        const location = getLocation(this.fileName)
        this.display(location, () => {
          this.initTheme()
          this.initFontSize()
          this.initFontFamily()
          this.initGlobalStyle()
        })
        this.rendition.hooks.content.register(contents => {
          Promise.all([
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
          ])
        })
      },
      initGesture () {
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
      },
      parseBook () {
        this.book.loaded.cover.then((cover) => {
          this.book.archive.createUrl(cover).then(url => {
            this.setCover(url)
          })
        })
        this.book.loaded.metadata.then(metadata => {
          this.setMetadata(metadata)
        })
        this.book.loaded.navigation.then(nav => {
          const navigation = flatten(nav.toc)
          function find (item, level = 0) {
            if (!item.parent) {
              return level
            } else {
              return find(navigation.filter(parentItem => parentItem.id === item.parent)[0], ++level)
            }
          }
          navigation.forEach(item => {
            item.level = find(item)
          })
          // this.saveNavigation(this.fileName, navigation)
          this.setNavigation(navigation)
        })
      },
      initEpub () {
        const url = `${process.env.VUE_APP_RES_URL}/epub/${this.fileName}.epub`
        this.book = new Epub(url)
        this.setCurrentBook(this.book)
        this.initRendition()
        // this.initGesture()
        this.parseBook()
        this.book.ready.then(() => {
          // Simple paginate algorithm
          return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize((this.fileName) / 16)))
        }).then(locations => {
          this.setBookAvailable(true)
          this.refreshLocation()
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

  .ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask {
      position: absolute;
      top: 0;
      left: 0;
      background: transparent;
      z-index: 100;
      width: 100%;
      height: 100%;
    }
  }
</style>
