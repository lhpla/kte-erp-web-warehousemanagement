<!-- TransitOrderCode -->
<template>
  <div id='TransitOrderCode'>
    <el-dialog title="在途明细" v-model="dialogVisible" width="40%" :close-on-click-modal="false" @close="closed"
      destroy-on-close :close-on-press-escape="false">
      <vxe-table :row-config="{ isHover: true }" :data="tableData" :column-config="{ resizable: true }"
        header-row-class-name="header_size" v-loading="tableLoading" border>
        <vxe-column title="PO单" field="orderCode" align="center">
          <template #default="{ row }">
            <span @click="toQualityInspection(row.orderCode)" class="fontClass">{{ row.orderCode }}</span>
          </template>
        </vxe-column>
        <vxe-column title="预计到货时间" field="purchaseOrderTime" align="center"></vxe-column>
      </vxe-table>
      <template #footer>
        <div class="dialog-footer">
          <div class="pagination">
            <el-pagination class="log-pagination" background @size-change="handleSizeChangeLog"
              @current-change="handleCurrentChangeLog" :current-page="pageableLog.current" :page-sizes="[5, 10, 25, 50]"
              :page-size="pageableLog.pageSize" layout="total, sizes, prev, pager, next, jumper"
              :total="pageableLog.total">
            </el-pagination>
          </div>
        </div>

      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
import changeRoute from "@/compositionApi/changeRoute";

const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const { getModuleID } = changeRoute();
const api = vue.$http;
const dialogVisible = ref(false)
const tableLoading = ref(false)
const pageableLog = ref({
  pageSize: 10,
  pages: 1,
  total: 0,
})
const searchMsg = ref({
  domesticWarehouse: '',
  foreignWarehouse: '',
  sku: '',
  transportMode: '',
  current: 1, // 当前页为 1
  size: 10, // 每页10条
})
const tableData = ref([])
//跳转到质检列表
const toQualityInspection = (orderCode) => {
  getModuleID('/warehouseManagement', '/warehouseManagement/qualityInspectionList/list', { orderCode });
}
//获取在途采购单
const getTransitOrderCode = (info) => {
  tableLoading.value = true
  api.warehouse.getTransitOrderCode(info).then(res => {
    if (res.code == 200) {
      tableLoading.value = false
      tableData.value = res.data.records
      pageableLog.value.current = res.data.current
      pageableLog.value.pageSize = res.data.size
      pageableLog.value.pages = res.data.pages
      pageableLog.value.total = res.data.total
    } else {
      tableLoading.value = false
      vue.$message.warning(res.message)
    }
  }).catch(() => {
    tableLoading.value = false
  })
}
const closed = () => {
  tableData.value = []
  tableLoading.value = false
  dialogVisible.value = false
}
// 日志每页条数发生改变
const handleSizeChangeLog = val => {
  let info = searchMsg.value;
  info.size = val;
  info.current = 1
  searchMsg.value = info;
  getTransitOrderCode(searchMsg.value);
};
// 日志当前页发生改变
const handleCurrentChangeLog = val => {
  let info = searchMsg.value;
  info.current = val;
  searchMsg.value = info;
  getTransitOrderCode(searchMsg.value);
};

const openDialog = (row) => {
  searchMsg.value = {
    domesticWarehouse: row.domesticWarehouse,
    foreignWarehouse: row.foreignWarehouse,
    sku: row.sku,
    transportMode: row.transportMode,
    current: 1, // 当前页为 1
    size: 10, // 每页10条
  }
  dialogVisible.value = true
  getTransitOrderCode(searchMsg.value);
}
defineExpose({ openDialog })
</script>

<style scoped lang='scss'>
#TransitOrderCode {
  .pagination {
    display: flex;
    justify-content: flex-end;
  }

  .fontClass {
    color: #409eff;
    cursor: pointer;
  }

  .log-pagination {
    display: flex;
    justify-content: flex-end;
    position: static;
    background: #fff;
    border: 1px solid #cecfcf;
    border-radius: 50px;
    margin: 20px 10px;
  }
}
</style>