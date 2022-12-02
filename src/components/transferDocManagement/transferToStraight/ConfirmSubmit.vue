<!-- ConfirmSubmit -->
<template>
  <div id="ConfirmSubmit">
    <el-dialog
      title="调拨入库-异常确认"
      v-model="confimSubmitDialogVisible"
      width="80%"
      :close-on-click-modal="false"
      @close="closeDialog"
      destroy-on-close
      :close-on-press-escape="false"
    >
      <div style="color: red; margin-bottom: 10px">下列数据入库数量小于调拨数量，确认继续入库，继续入库将生成调拨异常</div>
      <vxe-table border align="center" :data="confirmData">
        <vxe-column type="seq" width="60" title="NO."></vxe-column>
        <vxe-column field="sku" title="SKU">
          <template #default="{ row }">
            <div>
              <span>{{ row.sku ? row.sku : "-" }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="transferNum" title="调拨数量(PCS)">
          <template #default="{ row }">
            <div>
              <span>{{ row.transferNum ? row.transferNum : "-" }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="startCabinetNum" title="调拨柜号">
          <template #default="{ row }">
            <div>
              <span>{{ row.startCabinetNum ? row.startCabinetNum : "-" }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="startCartonNum" title="调拨箱号">
          <template #default="{ row }">
            <div>
              <span>{{ row.startCartonNum ? row.startCartonNum : "-" }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="receiptNum" title="入库数量(PCS)">
          <template #default="{ row, rowIndex }">
            <div class="input_box">
              <span v-for="item in row.locationList" :key="item">
                <span>{{ item.receiptNum ? item.receiptNum : "-" }}</span>
              </span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="endLocation" title="入库库位">
          <template #default="{ row, rowIndex }">
            <div class="input_box">
              <span v-for="item in row.locationList" :key="item">
                <span>{{ item.endLocation ? item.endLocation : "-" }}</span>
              </span>
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
  name: "ConfirmSubmit",
  setup(prop, ctx) {
    const data = reactive({
      confimSubmitDialogVisible: false,
      confirmData: [],
      tableData: [],
      rowInfo: {},
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const getTableData = inject("getTableData");
    const closed = inject("closed");
    const getMsg = (confirmData, tableData, rowInfo) => {
      data.confimSubmitDialogVisible = true;
      data.confirmData = confirmData;
      data.tableData = tableData;
      data.rowInfo = rowInfo;
    };
    const closeDialog = () => {
      data.confimSubmitDialogVisible = false;
      data.confirmData = [];
      data.tableData = [];
      data.rowInfo = {};
    };
    const onSubmit = () => {
      const infoObj = { skuList: data.tableData, ...data.rowInfo };
      api.requisitionManagement.transferTransferDirectHairWarehousing(infoObj).then((res) => {
        if (res.code == 200) {
          vue.$message.success(res.msg);
          data.confimSubmitDialogVisible = false;
          closed();
          getTableData();
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
      onSubmit,
    };
  },
};
</script>
<style scoped lang="scss">
#ConfirmSubmit {
  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
