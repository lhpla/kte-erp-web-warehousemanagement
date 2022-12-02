<!-- FirstConfirmSubmit -->
<template>
  <div id="FirstConfirmSubmit">
    <el-dialog title="调拨入库-异常确认" v-model="confimSubmitDialogVisible" width="80%" :close-on-click-modal="false"
      @close="closeDialog" destroy-on-close :close-on-press-escape="false">
      <div style="color: red; margin-bottom: 10px">下列数据收货数量小于调拨数量，确认继续入库，继续入库将生成调拨异常</div>
      <vxe-table :data="confirmData" border max-height="300px" header-cell-class-name="header_size1" show-overflow
        :column-config="{ resizable: true }">
        <vxe-column type="seq" title="NO." align="center"></vxe-column>
        <vxe-column field="sku" title="SKU" align="center">
          <template #default="{ row }">
            {{ row.sku ? row.sku : "-" }}
          </template>
        </vxe-column>
        <vxe-column field="transferNum" title="调拨数量（PCS）" align="center">
          <template #default="{ row }">
            {{ row.transferNum ? row.transferNum : "-" }}
          </template>
        </vxe-column>
        <vxe-column field="startLocation" title="库位" align="center">
          <template #default="{ row }">
            {{ row.startLocation ? row.startLocation : "-" }}
          </template>
        </vxe-column>
        <vxe-column field="receiptNum" align="center">
          <template #header>
            <div style="display: flex; align-items: center; justify-content: center">
              <span>收货数量（PCS）</span>
              <el-tooltip class="item" effect="light" content="实收数量大于调拨数量可联系调拨仓补充建单">
                <i class="el-icon-warning-outline" style="margin-left: 5px"></i>
              </el-tooltip>
            </div>
          </template>
          <template #default="{ row, rowIndex }">
            <div style="padding: 5px 10px 0 10px">
              {{ row.receiptNum ? row.receiptNum : "-" }}
            </div>
          </template>
        </vxe-column>
        <vxe-column field="packNum" title="装箱数（箱）" align="center">
          <template #default="{ row }">
            <div style="padding: 5px 10px 0 10px">
              {{ row.packNum ? row.packNum : "-" }}
            </div>
          </template>
        </vxe-column>
      </vxe-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog" size="small">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="small">确 定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
export default {
  name: "FirstConfirmSubmit",
  setup(prop, ctx) {
    const data = reactive({
      confimSubmitDialogVisible: false,
      confirmData: [],
      tableData: [],
      transferCode: "",
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const getTableData = inject("getTableData");
    const getSecondData = inject("getSecondData");
    const getMsg = (confirmData, tableData, transferCode) => {
      data.confimSubmitDialogVisible = true;
      data.confirmData = confirmData;
      data.tableData = tableData;
      data.transferCode = transferCode;
    };
    const closeDialog = () => {
      data.confimSubmitDialogVisible = false;
      data.confirmData = [];
      data.tableData = [];
      data.transferCode = "";
    };

    const onSubmit = () => {
      api.requisitionManagement.submitFirstStep({ infos: data.tableData, transferCode: data.transferCode }).then((res) => {
        if (res.code == 200) {
          getSecondData(data.transferCode);
          data.confimSubmitDialogVisible = false;
          getTableData()
        } else {
          vue.$message.warning(res.msg);
        }
      });
    };
    const refData = toRefs(data);
    return {
      ...refData,
      getMsg,
      closeDialog,
      getSecondData,
      onSubmit,
    };
  },
};
</script>
<style scoped lang="scss">
#FirstConfirmSubmit {
  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
