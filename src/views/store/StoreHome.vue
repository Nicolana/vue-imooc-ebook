<template>
  <div class="store-home">
    <search-bar></search-bar>
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
      <div>111</div>
    </scroll>
  </div>
</template>

<script>
  import SearchBar from '../../components/home/SearchBar'
  import Scroll from '../../components/common/Scroll'
  import { storeHomeMixin } from '../../utils/mixin'

  export default {
    name: 'StoreHome',
    mixins: [storeHomeMixin],
    components: {
      SearchBar,
      Scroll
    },
    data () {
      return {
        scrollTop: 94
      }
    },
    methods: {
      onScroll (offsetY) {
        this.setOffsetY(offsetY)
        if (offsetY > 0) {
          this.scrollTop = 52
        } else {
          this.scrollTop = 94
        }
        this.$refs.scroll.refresh()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/global.scss';
  .store-home {
    width: 100%;
    height: 100%;
  }
</style>
