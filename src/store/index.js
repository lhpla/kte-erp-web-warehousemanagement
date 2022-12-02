import { createStore } from 'vuex'

export default createStore({
  state: {
    // 视频上传组件是否显示上传
    uploadFlag: false,
    // 成片列表上传组件是否显示
    FilmUploadFlag: false,
  },
  mutations: {
    // 视频上传组件是否显示上传
    setUploadFlag: (state, data) => {
      state.uploadFlag = data
    },
    // 成片列表上传组件是否显示
    setFilmUploadFlag: (state, data) => {
      state.FilmUploadFlag = data
    },
  },
  actions: {},
  modules: {},
})
