const book = {
  state: {
    fileName: '',
    menuVisible: false,
    settingVisible: -1, // -1 表示不显示， 0：字号，2：主题，3：目录
    defaultFontSize: 16
  },
  mutations: {
    SET_FILENAME: (state, filename) => {
      state.fileName = filename
    },
    SET_MENUVISIBLE: (state, menuVisible) => {
      state.menuVisible = menuVisible
    },
    SET_SETTINGVISIBLE: (state, settingVisible) => {
      state.settingVisible = settingVisible
    },
    SET_DEFAULT_FONTSIZE: (state, defaultFontSize) => {
      state.defaultFontSize = defaultFontSize
    }
  }
}

export default book
