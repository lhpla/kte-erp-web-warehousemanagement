<!-- PreviewImageLog 图片弹框 -->
<template>
  <div id="PreviewImageLog">
    <el-dialog
      title="柜号图片"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      @close="closed"
      :close-on-press-escape="false"
    >
      <span v-for="item in image" :key="item">
        <el-popover placement="right" trigger="hover" width="250">
          <template #reference>
            <el-image
              style="width: 180px; height: 95px"
              fit="contain"
              :src="item"
            ></el-image>
          </template>
          <el-image
            :src="item"
            style="width: 400px; height: 300px"
            fit="contain"
          ></el-image>
        </el-popover>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  ref,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
} from "vue";
export default {
  name: "PreviewImageLog",
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      image: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });

    //closed 关闭弹框
    const closed = () => {
      data.dialogVisible = false;
    };

    //openLog 打开弹框
    const openLog = (e) => {
      data.dialogVisible = true;
      data.image = e ? e.split(",") : [];
    };
    const refData = toRefs(data);
    return {
      ...refData,
      closed,
      openLog,
    };
  },
};
</script>
<style scoped lang="scss">
#PreviewImageLog {
  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
