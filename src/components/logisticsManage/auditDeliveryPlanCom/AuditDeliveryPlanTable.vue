<!-- AuditDeliveryPlanTable 审核发货计划 列表 -->
<template>
  <div id="AuditDeliveryPlanTable">
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      style="width: 100%"
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
      :height="screenHeight"
    >
      <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
      <el-table-column align="center" prop="" label="出库号"></el-table-column>
      <el-table-column align="center" prop="" label="中转仓库"></el-table-column>
      <el-table-column align="center" prop="" label="仓区"></el-table-column>
      <el-table-column align="center" prop="" label="箱号数量"></el-table-column>
      <el-table-column align="center" prop="" label="SKU总种类"></el-table-column>
      <el-table-column align="center" prop="" label="SKU总数量"></el-table-column>
      <el-table-column align="center" prop="" label="总体积"></el-table-column>
      <el-table-column align="center" prop="" label="异常SKU种类"></el-table-column>
      <el-table-column align="center" prop="" label="异常SKU数量"></el-table-column>
      <el-table-column align="center" prop="" label="状态"></el-table-column>
      <el-table-column align="center" prop="" label="操作">
        <template #default>
          <span>
            <div>
              <el-button type="text" icon="el-icon-view">查看</el-button>
            </div>
            <div>
              <el-button type="text" icon="el-icon-finished">确认</el-button>
            </div>
            <div>
              <el-button type="text" icon="el-icon-tickets">单证</el-button>
            </div>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
export default {
  name: "AuditDeliveryPlanTable",
  props: {
    tableLoading: {
      type: Boolean,
      default: false,
    },
    // tableData: {
    //   type: Array,
    // },
  },
  setup(prop, ctx) {
    const data = reactive({
      tableData: [{ name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }],
      // 屏幕高度
      screenHeight: document.documentElement.clientHeight - 400,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});

    const refData = toRefs(data);
    return {
      ...refData,
    };
  },
};
</script>
<style scoped lang='scss'>
#AuditDeliveryPlanTable {
}
</style>