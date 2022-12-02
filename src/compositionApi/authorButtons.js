import { onBeforeMount, onMounted, getCurrentInstance, ref } from 'vue'
import { useStore } from 'vuex'
import { localGet } from '../utils/util'

const authorButtons = () => {
  const store = useStore()
  const { ctx: vueDev, proxy: vue } = getCurrentInstance()

  // const BUTTONS = ref(localGet("authorButton").find(item => item.path ==vue.$route.path) || {});
  const BUTTONS = ref(localGet('authorButton')[vue.$route.meta.key] || {})

  onBeforeMount(() => {})
  onMounted(() => {})
  return {
    BUTTONS,
  }
}

export default authorButtons
