<!-- 质检  批量修改尺寸 -->
<template>
  <div id="BatchModifySize">
    <el-dialog :title="`SKU： ${tableData.sku ? tableData.sku : '-'}`" v-model="dialogVisibleBatch" width="40%"
      :close-on-click-modal="false" @close="handleClose" :close-on-press-escape="false" destroy-on-close>
      <div style="margin-bottom: 10px; font-size:16px;">
        {{ tableData.purposeWarehouse ? tableData.purposeWarehouse : '-' }}：{{ tableData.totalNum ? tableData.totalNum :
            0
        }}</div>
      <el-table :data="[tableData]" border style="width: 100%" v-loading="btnLoading"
        :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }">
        <el-table-column label="柜号" prop="cabinetNum" width="100px"></el-table-column>
        <el-table-column label="装箱数量" prop="encasementNum" width="100px"></el-table-column>
        <el-table-column label="尺寸（长x宽x高）cm" min-width="210">
          <template #default="{ row, $index }">
            <el-form :model="row" :rules="attrRules" ref="attrForm">
              <div style="display: flex;">
                <el-form-item v-if="$index >= 0" prop="length">
                  <el-input clearable v-model.trim="row['length']" style="width: 90px"></el-input>
                </el-form-item>
                &nbsp;&nbsp;
                <el-form-item v-if="$index >= 0" prop="width">
                  <el-input clearable v-model.trim="row.width" style="width: 90px"></el-input>
                </el-form-item>
                &nbsp;&nbsp;
                <el-form-item v-if="$index >= 0" prop="height">
                  <el-input clearable v-model.trim="row.height" style="width: 90px"></el-input>
                </el-form-item>
              </div>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="handleClose" :disabled="btnLoading" :loading="btnLoading">取 消</el-button>
          <el-button type="primary" size="small" :disabled="btnLoading" :loading="btnLoading" @click="submit">确认
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
const dialogVisibleBatch = ref(false)
const tableData = ref([])
const btnLoading = ref(false)
const ids = ref([])
const attrRules = {
  length: [
    { required: true, message: "请输入", trigger: "blur" },
    { pattern: /^[1-9]\d{0,2}$/, message: "1-999正整数", trigger: "blur" }
  ],
  width: [
    { required: true, message: "请输入", trigger: "blur" },
    { pattern: /^[1-9]\d{0,2}$/, message: "1-999正整数", trigger: "blur" }
  ],
  height: [
    { required: true, message: "请输入", trigger: "blur" },
    { pattern: /^[1-9]\d{0,2}$/, message: "1-999正整数", trigger: "blur" }
  ]
}
const attrForm = ref()
const getTableData = inject("getTableData");
//确认修改尺寸
const submit = () => {
  attrForm.value.validate(valid => {
    if (valid) {
      const info = {
        ids: ids.value,
        length: tableData.value['length'],
        width: tableData.value.width,
        height: tableData.value.height,
      }
      api.warehouse.updateCasesSize(info).then(res => {
        if (res.code == 200) {
          vue.$message.success(res.msg)
          getTableData()
          btnLoading.value = false
          handleClose()
        } else {
          vue.$message.warning(res.msg)
          btnLoading.value = false
        }
      }).catch(() => {
        btnLoading.value = false
      })
    }
  })
};
//打开批量修改弹窗
const openDialog = (data, id) => {
  ids.value = id
  tableData.value = data
  dialogVisibleBatch.value = true;
};

//关闭批量修改弹窗
const handleClose = () => {
  if (attrForm.value) {
    attrForm.value.resetFields();
    attrForm.value.clearValidate();
  }
  tableData.value = []
  ids.value = []
  dialogVisibleBatch.value = false;
};
defineExpose({ openDialog })
</script>

<style scoped lang="scss">

</style>
