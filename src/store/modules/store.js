const store = {
  state: {
    hotSearchOffsetY: 0
  },
  mutations: {
    SET_HOT_SEARCH_OFFSET (state, offsetY) {
      state.hotSearchOffsetY = offsetY
    }
  }
}

export default store
