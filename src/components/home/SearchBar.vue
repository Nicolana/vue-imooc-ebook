<template>
    <div class="search-bar-wrapper" :class="{'hiden-title': !titleVisible, 'hide-shadow': !shadowVisible}">
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
        <div class="title-text-wrapper">
          <span class="title-text title">{{$t('home.title')}}</span>
        </div>
        <div class="title-icon-shake-wrapper">
          <span class="icon-shake"></span>
        </div>
      </div>
      </transition>
      <div class="title-icon-back-wrapper" :class="{'hide-title': !titleVisible}">
        <span class="icon-back icon"></span>
      </div>
      <div class="search-bar-input-wrapper" :class="{'hide-title': !titleVisible}">
        <div class="search-bar-blank" :class="{'hide-title': !titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input class="input"
          type="text"
          :placeholder="$t('home.hint')"
          v-model="searchText">
        </div>
      </div>
    </div>
</template>

<script>
  import { storeHomeMixin } from '../../utils/mixin'

  export default {
    name: 'SearchBar',
    mixins: [storeHomeMixin],
    data () {
      return {
        searchText: '',
        titleVisible: true,
        shadowVisible: false
      }
    },
    watch: {
      offsetY (offsetY) {
        if (offsetY > 0) {
          this.hideTitle()
          this.showShadow()
        } else {
          this.showTitle()
          this.hideShadow()
        }
      }
    },
    methods: {
      hideTitle () {
        this.titleVisible = false
      },
      showTitle () {
        this.titleVisible = true
      },
      hideShadow () {
        this.shadowVisible = false
      },
      showShadow () {
        this.shadowVisible = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/global';
  .search-bar-wrapper {
    position: relative;
    width: 100%;
    z-index: 150;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    &.hide-title {
      height: px2rem(52);
    }
    &.hide-shadow {
      box-shadow: none;
    }
    .search-bar-title-wrapper {
      /*position: absolute;*/
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(42);
      .title-text-wrapper {
        height: px2rem(42);
        @include center;
      }
      .title-icon-shake-wrapper {
        position: absolute;
        right: px2rem(15);
        font-size: px2rem(20);
        top: 0;
        height: px2rem(42);
        @include center;
      }
    }
    .search-bar-input-wrapper {
      /*position: absolute;*/
      display: flex;
      left: 0;
      top: px2rem(42);
      width: 100%;
      height: px2rem(52);
      padding: 0 px2rem(15);
      box-sizing: border-box;
      transition: top $animationTime $animationType;
      &.hide-title {
        top: 0;
      }
      @include center;
      .search-bar-input{
        flex: 1;
        width: 100%;
        background: #f4f4f4;
        padding: px2rem(5) px2rem(15);
        border-radius: px2rem(20);
        box-sizing: border-box;
        border: px2rem(1) solid #eee;
        @include left;
        .icon-search {
          color: #999;
        }
        .input {
          width: 100%;
          height: px2rem(22);
          border: none;
          background: transparent;
          /*padding: 0 px2rem(15);*/
          margin-left: px2rem(10);
          font-size: px2rem(12);
          &:focus {
            outline: none;
          }
          &::-webkit-input-placeholder {
            color: #ccc;
          }
        }
      }
      .search-bar-blank {
        flex: 0 0 0;
        width: 0;
        transition: all $animationTime $animationType;
        &.hide-title {
          flex: 0 0 px2rem(31);
          width: px2rem(31);
        }
      }
    }
    .title-icon-back-wrapper {
      position: absolute;
      left: px2rem(15);
      top: 0;
      height: px2rem(42);
      @include center;
      transition: height $animationTime $animationType;
      &.hide-title {
        height: px2rem(52);
      }
    }
  }
</style>
