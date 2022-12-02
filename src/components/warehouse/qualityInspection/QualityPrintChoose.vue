<!-- 打印选择 -->
<template>
  <div id="QualityPrintChoose">
    <el-dialog title="打印选择" v-model="dialogVisible" width="40%" :close-on-click-modal="false" :before-close="handleClose" :close-on-press-escape="false">
      <el-select size="mini" v-model="printChoose" placeholder="请选择">
        <el-option v-for="item in list" :key="item.value" :label="item.name" :value="item.value"></el-option>
      </el-select>
      <el-button size="mini" type="primary" @click="printClick">打 印</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
import { getLodop } from "@/utils/LodopFuncs";
export default {
  name: "QualityPrintChoose",
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      list: [],
      msg: {},
      printChoose: "",
      type: "",
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    // 获取信息
    const getMsg = (list, msg, type) => {
      data.dialogVisible = true;
      data.list = list;
      data.msg = msg;
      data.type = type;
    };

    // 打印
    const printClick = () => {
      if (data.printChoose !== "") {
        let LODOP = getLodop();
        data.msg.printer = data.printChoose;
        vue.$printFn(LODOP, data.msg, data.type);
      } else {
        vue.$message.warning({
          message: "请选择",
          type: "warning",
        });
      }
    };

    // 关闭
    const handleClose = () => {
      data.dialogVisible = false;
    };
    return {
      ...refData,
      handleClose,
      getMsg,
      printClick,
    };
  },
};
</script>
<style scoped lang='scss'>
#QualityPrintChoose {
  .el-button {
    margin-left: 10px;
  }
}
</style>
