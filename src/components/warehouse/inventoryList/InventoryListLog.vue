<!-- 库存 日志 -->
<template>
  <div id="InventoryListLog">
    <el-dialog
      title="操作日志"
      width="70%"
      v-model="logVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-table
        :header-cell-style="{
          background: '#fafafa',
          color: '#2d2f30',
          fontWeight: 'bold',
          fontSize: '12px',
        }"
        :data="logTableData"
        tooltip-effect="dark"
        element-loading-text="加载中"
        v-loading="loading"
        border
      >
        <!-- <el-table-column label="#" type="index" align="center" width="100"></el-table-column> -->
        <el-table-column
          prop="sku"
          label="SKU"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="transferWarehouse"
          label="中转仓库"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="foreignWarehouse"
          label="国外仓库"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="domesticWarehouse"
          label="国内仓库"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="inventory"
          label="库存"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="时间"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <el-pagination
        class="log-pagination"
        background
        @size-change="handleSizeChangeLog"
        @current-change="handleCurrentChangeLog"
        :current-page="pageableLog.current"
        :page-sizes="[10, 25, 50, 100]"
        :page-size="pageableLog.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageableLog.total"
      ></el-pagination>
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
  name: "InventoryListLog",
  setup(prop, ctx) {
    const data = reactive({
      logVisible: false,
      logTableData: [],
      loading: false,
      inventoryId: "",
      // 日志分页
      pageableLog: {
        current: 1,
        size: 10,
        total: 0,
      },
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    // 打开弹窗
    const getMsg = (inventoryId) => {
      data.pageableLog = {
        current: 1,
        size: 10,
        total: 0,
      };
      data.logVisible = true;
      data.logTableData = [];
      data.loading = true;
      handleLog(inventoryId);
    };

    const handleLog = (inventoryId) => {
      data.inventoryId = inventoryId;
      let msg = {
        current: data.pageableLog.current,
        size: data.pageableLog.size,
        inventoryId: data.inventoryId,
      };
      api.warehouse.warehouseLogList(msg).then((res) => {
        if (res.code == 200) {
          data.logTableData = res.data.records;
          data.pageableLog.current = res.data.current;
          data.pageableLog.size = res.data.size;
          data.pageableLog.total = res.data.total;
        }
      });
      data.loading = false;
    };
    onMounted(() => { });
    // 日志每页条数发生改变
    const handleSizeChangeLog = (val) => {
      data.pageableLog.size = val;
      handleLog(data.inventoryId);
    };
    // 日志当前页发生改变
    const handleCurrentChangeLog = (val) => {
      data.pageableLog.current = val;
      handleLog(data.inventoryId);
    };
    const refData = toRefs(data);
    return {
      ...refData,
      handleSizeChangeLog,
      handleCurrentChangeLog,
      getMsg,
    };
  },
};
</script>
<style scoped lang="scss">
#InventoryListLog {
  .log-pagination {
    display: flex;
    justify-content: flex-end;
    position: static;
    bottom: 0;
    right: 0;
    background: #fff;
    border: none;
    border-radius: 50px;
    margin: -20px 0 10px 0;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
