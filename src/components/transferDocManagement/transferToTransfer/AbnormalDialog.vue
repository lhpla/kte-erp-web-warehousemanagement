<!-- 异常确认弹框 AbnormalDialog-->
<template>
  <div id='AbnormalDialog'>
    <el-dialog v-model="AbnormalDialogVisible" title="调拨入库-异常确认" width="60%" @close="handleClose" destroy-on-close
      :close-on-click-modal="false">
      <div class="title">下列数据入库数量小于调拨数量，请确认是否继续入库，继续入库将生成调拨异常 </div>
      <vxe-table :data="tableData" border :column-config="{ resizable: true }">
        <vxe-column type="seq" title="NO." align="center" width="50"></vxe-column>
        <vxe-column field="sku" title="SKU" align="center">
          <template #default="{ row }">
            {{ row.sku ? row.sku : '-' }}
          </template>
        </vxe-column>
        <vxe-column field="transferNum" title="调拨数量（PCS）" align="center" width="100">
          <template #default="{ row }">
            {{ row.transferNum ? row.transferNum : row.transferNum == 0 ? 0 : '-' }}
          </template>
        </vxe-column>
        <vxe-column field="startCabinetNum" title="调拨柜号" align="center" width="60">
          <template #default="{ row }">
            {{ row.startCabinetNum ? row.startCabinetNum : '-' }}
          </template>
        </vxe-column>
        <vxe-column field="startCartonNum" title="调拨箱号" align="center" width="60">
          <template #default="{ row }">
            {{ row.startCartonNum ? row.startCartonNum : '-' }}
          </template>
        </vxe-column>
        <vxe-column field="endCabinetNum" title="入库柜号" align="center">
          <template #default="{ row }">
            <div class="input_box">
              <span v-for="item in row.confirmDataVos" :key="item.id">
                {{ item.endCabinetNum }}
              </span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="endCartonNum" title="入库箱号" align="center">
          <template #default="{ row }">
            <div class="input_box">
              <span v-for="item in row.confirmDataVos" :key="item.id">
                {{ item.endCartonNum }}
              </span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="singleCartonCount" align="center">
          <template #header="{ row }">
            <span>单箱数量（PCS）</span>
            <el-tooltip class="item" effect="light" content="实收数量大于调拨数量可联系调拨仓补充建单" placement="bottom">
              <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
            </el-tooltip>
          </template>
          <template #default="{ row }">
            <div class="input_box">
              <span v-for="item in row.confirmDataVos" :key="item.id">
                {{ item.singleCartonCount }}
              </span>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="尺寸（cm）" align="center" width="300px">
          <template #default="{ row }">
            <div class="input_box">
              <span v-for="item in row.confirmDataVos" :key="item.id" style="display: flex;">
                {{ item.length }}*{{ item.width }}*{{ item.height }}
              </span>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose" size="small" :disabled="btnLoading" :loading="btnLoading">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="btnLoading" :loading="btnLoading" size="small">确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, inject } from 'vue';

const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;

const tableData = ref([])
const AbnormalDialogVisible = ref(false)
const btnLoading = ref(false)
const transferCode = ref('')
const openAbnormalDialog = (list, code) => {
  console.log(transferCode);
  tableData.value = list
  transferCode.value = code
  AbnormalDialogVisible.value = true
}
const handleClose = () => {
  AbnormalDialogVisible.value = false
}
const getTableData = inject("getTableData");
const emit = defineEmits(['closed'])
const onSubmit = () => {
  const info = {
    transferCode: transferCode.value,
    confirmDataVos: []
  }
  btnLoading.value = true
  api.requisitionManagement.submitConfirmAbnormal(info).then(res => {
    if (res.code == 200) {
      handleClose()
      emit('closed')
      getTableData();
      vue.$message.success(res.msg)
    } else {
      vue.$message.warning(res.msg)
    }
    btnLoading.value = false;
  })
    .catch(() => {
      btnLoading.value = false;
    })
}
defineExpose({ openAbnormalDialog })
</script>

<style scoped lang='scss'>
#AbnormalDialog {
  .title {
    color: red;
    margin: 0 0 20px 10px;
  }

  .input_box {
    display: flex;
    flex-direction: column;


    >span {
      border-top: 1px solid #eee;
      padding: 10px 15px;
      height: 54px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    >span:nth-child(1) {
      border-top: 0
    }
  }

  ::v-deep .vxe-body--column {
    // display: flex;
    padding: 0;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>