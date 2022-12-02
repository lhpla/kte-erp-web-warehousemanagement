<!-- 调拨 表格 -->
<template>
  <div id="TransfersListTable">
    <el-table v-loading="tableLoading" :data="tableData" height="calc(100vh - 230px)" border style="width: 100%"
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }">
      <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
      <el-table-column label="SKU" prop="sku"></el-table-column>
      <el-table-column label="序列号" prop="oldSerialNum"></el-table-column>
      <el-table-column label="中转仓库" prop="warehouseName"></el-table-column>
      <el-table-column label="仓区" prop="overseasWarehouse">
        <template #default="scope">
          <span>{{ scope.row.overseasWarehouse ? scope.row.overseasWarehouse : "" }}</span>
          <span v-if="scope.row.transportMode">({{ scope.row.transportMode }})</span>
        </template>
      </el-table-column>
      <el-table-column label="调拨仓库" prop="transferWarehouse"></el-table-column>
      <el-table-column label="调拨仓区" prop="transferOverseasWarehouse">
        <template #default="scope">
          <span>{{ scope.row.transferOverseasWarehouse ? scope.row.transferOverseasWarehouse : "" }}</span>
          <span v-if="scope.row.transferTransportMode">({{ scope.row.transferTransportMode }})</span>
        </template>
      </el-table-column>
      <el-table-column label="调拨数量" prop="transferNum"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="状态">
        <template #default="scope">
          <span v-if="scope.row.status">{{ tableTypeComputed(warehouse_transfer_status, scope.row.status) }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button size="mini" type="text" icon="el-icon-view" v-if="buttonAuthor.view"
            @click="openDispose(scope.row, 'view')">查看</el-button>
          <el-button size="mini" type="text" icon="el-icon-thumb"
            v-if="buttonAuthor.edit && scope.row.status == 'untreated'" @click="openDispose(scope.row, 'eidt')">
            处理
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-printer"
            v-if="buttonAuthor.export && scope.row.status == 'complete'" @click="openDispose(scope.row, 'print')">
            打印条码
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-finished"
            v-if="buttonAuthor.audit && scope.row.status == 'out_of_stock'" @click="openDispose(scope.row, 'audit')">
            确认
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <TransfersListDetail ref="TransfersListDetail"></TransfersListDetail>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, computed } from "vue";
import TransfersListDetail from "./TransfersListDetail.vue";
import { localGet } from "@/utils/util";
import authorButtons from "@/compositionApi/authorButtons";
export default {
  name: "TransfersListTable",
  props: ["tableData", "tableLoading"],
  components: { TransfersListDetail },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      warehouse_transfer_status: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      data.warehouse_transfer_status =
        localGet("purchaseDict") && localGet("purchaseDict").warehouse_transfer_status ? localGet("purchaseDict").warehouse_transfer_status : [];
    });

    const refData = toRefs(data);
    // 打开详情
    const openDispose = (row, text) => {
      vue.$refs.TransfersListDetail.getMsg(row, text);
    };

    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (list, dizKey) {
        if (list && list.length > 1 && dizKey !== -1) {
          for (let item of list) {
            if (dizKey == item.dizKey) {
              return item.value;
            }
          }
        }
      };
    });
    return {
      ...refData,
      openDispose,
      buttonAuthor,
      tableTypeComputed,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
