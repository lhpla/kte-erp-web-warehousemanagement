import {
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  ref,
  computed
} from "vue";
import {
  useStore
} from "vuex";
import {
  localGet
} from "../utils/util";

const dictCodeList = () => {
  const store = useStore();
  const {
    ctx: vueDev,
    proxy: vue
  } = getCurrentInstance();
  const DICTCODELIST = ref(localGet("dictCodeList") || {});
  onBeforeMount(() => {});
  onMounted(() => {});
  return {
    DICTCODELIST
  };
};

export default dictCodeList;
