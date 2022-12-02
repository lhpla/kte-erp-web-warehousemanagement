import {
  ref,
  onMounted,
  onUnmounted,
  nextTick,
  watch,
  onActivated,
  onDeactivated
} from 'vue'

export const useShowSearchBtn = () => {
  const searchPanelWidth = ref(0)
  const showSearchBtn = ref(true)

  const getPanelWidth = () => {
    nextTick(() => {
      searchPanelWidth.value = window
        .getComputedStyle(document.getElementById('SearchPanel'))
        .width.replace('px', '')
    })
  }
  onMounted(() => {
    window.addEventListener('resize', getPanelWidth)
    getPanelWidth()
  })
  onActivated(() => {
    getPanelWidth()
    window.addEventListener('resize', getPanelWidth)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', getPanelWidth)
  })
  onDeactivated(() => {
    window.removeEventListener('resize', getPanelWidth)
  })



  watch(
    () => searchPanelWidth.value,
    (val) => {
      if (val) {
        nextTick(() => {
          let itemList = Array.from(
            document.getElementsByClassName('SearchPanel-form-item')
          )
          let width = 0
          itemList.map((item) => {
            width += Number(
              window.getComputedStyle(item).width.replace('px', '')
            ) + 10
          })
          //+10 是加的padding/margin
          if (width >= Number(val)) showSearchBtn.value = true
          else showSearchBtn.value = false
        })
      }
    }, {
      immediate: true
    }
  )
  return {
    showSearchBtn,
  }
}