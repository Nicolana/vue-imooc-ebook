<template>
  <div class="ebook-loading">
    <div class="ebook-loading-wrapper">
      <div class="ebook-loading-item" v-for="(item, index) in data" :key="index">
        <div class="ebook-loading-line-wrapper" v-for="(subItem, subIndex) in item" :key="subIndex">
          <div class="ebook-loading-line" ref="line"></div>
          <div class="ebook-loading-mask" ref="mask"></div>
        </div>
      </div>
      <div class="ebook-loading-center"></div>
    </div>
  </div>
</template>

<script>
  import { px2rem } from '../../utils/utils'

  export default {
    name: 'EbookLoading',
    data () {
      return {
        data: [
          [{}, {}, {}],
          [{}, {}, {}]
        ],
        maskWidth: [
          { label: 0 },
          { label: 0 },
          { label: 0 },
          { label: 0 },
          { label: 0 },
          { label: 0 }
        ],
        lineWidth: [
          { label: 16 },
          { label: 16 },
          { label: 16 },
          { label: 16 },
          { label: 16 },
          { label: 16 }
        ],
        add: true,
        end: false
      }
    },
    mounted () {
      this.task = setInterval(() => {
        this.$refs.mask.forEach((item, index) => {
          const mask = this.$refs.mask[index]
          const line = this.$refs.line[index]
          const maskWidth = this.maskWidth[index]
          const lineWidth = this.lineWidth[index]
          if (index === 0) {
            if (this.add && maskWidth.label < 16) {
              // mask 增加
              maskWidth.label++
              lineWidth.label--
            } else if (!this.add && lineWidth.label < 16) {
              // line 增加
              maskWidth.label--
              lineWidth.label++
            }
          } else {
            if (this.add && maskWidth.label < 16) {
              // 在增加的过程中处理
              const preMaskWidth = this.maskWidth[index - 1]
              if (preMaskWidth.label >= 8) {
                maskWidth.label++
                lineWidth.label--
              }
            } else if (!this.add && lineWidth.label < 16) {
              // 在减少的过程中处理
              const preLineWidth = this.lineWidth[index - 1]
              if (preLineWidth.label >= 8) {
                maskWidth.label--
                lineWidth.label++
              }
            }
          }
          mask.style.width = `${px2rem(maskWidth.label)}rem`
          mask.style.flex = `0 0 ${px2rem(maskWidth.label)}rem`
          line.style.width = `${px2rem(lineWidth.label)}rem`
          line.style.flex = `0 0 ${px2rem(lineWidth.label)}rem`
          if (index === this.maskWidth.length - 1) {
            // 最后一个元素增加结束
            if (this.add) {
              if (maskWidth.label === 16) {
                this.end = true // 最后一个元素遍历到了最后头了
              }
            } else {
              if (maskWidth.label === 0) {
                this.end = true
              }
            }
          }
          if (this.end) {
            this.add = !this.add
            this.end = false
          }
        })
      }, 20)
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/global';
  .ebook-loading {
    position: relative;
    z-index: 400;
    width: px2rem(63);
    height: px2rem(40);
    background: transparent;
    border: px2rem(1.5) solid #d7d7d7;
    border-radius: px2rem(3);
    .ebook-loading-wrapper {
      display: flex;
      width: 100%;
      height: 100%;
      .ebook-loading-item {
        display: flex;
        flex-direction: column;
        flex: 1;
        /*background: chocolate;*/
        padding: px2rem(7) 0;
        box-sizing: border-box;
        .ebook-loading-line-wrapper {
          flex: 1;
          padding: 0 px2rem(7);
          box-sizing: border-box;
          @include left;
          .ebook-loading-line {
            flex: 0 0 px2rem(6);
            width: px2rem(16);
            height: px2rem(2);
            background: #d7d7d7;
          }
          .ebook-loading-mask {
            flex: 0 0 0;
            width: 0;
            height: px2rem(2);
          }
        }
      }
      .ebook-loading-center {
        position: absolute;
        left: 50%;
        top: 0;
        width: px2rem(1.5);
        height: 100%;
        background: #d7d7d7;
      }
    }
  }

</style>
