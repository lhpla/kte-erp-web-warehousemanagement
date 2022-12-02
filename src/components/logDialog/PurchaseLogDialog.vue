<!-- 采购日志组件 -->
<template>
  <!-- 日志dialog -->
  <el-dialog title="操作日志" width="60%" v-model="logVisible" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-table height="calc(100vh - 400px)" :header-cell-style="rowClass" :data="logTableData" tooltip-effect="dark" element-loading-text="加载中" v-loading="loading" border>
      <el-table-column label="#" type="index" align="center" width="100"></el-table-column>
      <el-table-column prop="message" align="center" label="内容"></el-table-column>
      <el-table-column prop="createUser" align="center" label="操作人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" align="center" label="修改时间" show-overflow-tooltip></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
import tablePage from "../../compositionApi/tablePage";

export default {
  name: "PurchaseLogDialog",
  setup(prop, ctx) {
    const { rowClass } = tablePage();
    const data = reactive({
      logVisible: false,
      funMsg: {},
      // log日志表格数据
      logTableData: [],
      // 操作日志
      logVisible: false,
      // 加载loading
      loading: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);

    // 打开loading
    const checkLogDialog = funMsg => {
      data.logVisible = true;
      data.funMsg = funMsg;
      handleLog();
    };
    // 查看日志
    const handleLog = () => {
      data.logTableData = [];
      api[data.funMsg.servers][data.funMsg.dataApi]({ orderId: data.funMsg.orderId }).then(res => {
        data.logTableData = res.data;
      });
    };
    return {
      ...refData,
      checkLogDialog,
      rowClass,
    };
  },
};
</script>
<style scoped lang="scss">
.log-pagination {
  display: flex;
  justify-content: flex-end;
  position: static;
  bottom: 0;
  right: 0;
  background: #fff;
  border: none;
  border-radius: 50px;
  margin: -50px 0 10px 0;
}
</style>
