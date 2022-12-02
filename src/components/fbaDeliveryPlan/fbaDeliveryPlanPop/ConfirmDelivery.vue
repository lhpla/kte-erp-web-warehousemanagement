<!-- 确认出库  -->
<template>
  <div id="AuditPop">
    <el-dialog title="确认出库" v-model="dialogVisible" width="40%" :close-on-click-modal="false" @close="closed"
      destroy-on-close :close-on-press-escape="false">
      <div>
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="150px">
          <el-form-item label="提货单号：" prop="ladingNumber">
            <el-input v-model="ruleForm.ladingNumber"  style="width: 220px;" maxlength="50" />
          </el-form-item>
          <el-form-item label="实际出库时间：" prop="actualDeliveryTime">
            <el-date-picker v-model="ruleForm.actualDeliveryTime" type="datetime" placeholder="选择日期时间" >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closed" size="small" :disabled="btnLoading" :loading="btnLoading">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="btnLoading" :loading="btnLoading" size="small">确 认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, inject } from 'vue';
import { parseTime } from "@/utils/util";
const { ctx: vueDev, proxy: vue } = getCurrentInstance();

const api = vue.$http;
const dialogVisible = ref(false)
const btnLoading = ref(false)
const rules = ref({
  ladingNumber: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  actualDeliveryTime: [
    { required: true, message: '请选择', trigger: 'change' },
  ],
})
const ruleForm = ref({
  actualDeliveryTime: new Date(),
  ladingNumber: ''
})
//打开弹窗
const openDialog = (ids) => {
  ruleForm.value.ladingNumber = ''
  ruleForm.value.actualDeliveryTime = new Date()
  ruleForm.value.ids = ids
  dialogVisible.value = true
}
//关闭弹窗
const closed = () => {
  ruleForm.value = {
    actualDeliveryTime: new Date(),
    ladingNumber: ''
  }
  if (ruleFormRef.value) {
    ruleFormRef.value.clearValidate();
  }
  dialogVisible.value = false
}
const getTableData = inject("getTableData");
const ruleFormRef = ref(null)
const clearSelect = inject('clearSelect')
//确认出库
const onSubmit = () => {
  ruleFormRef.value.validate(valid => {
    if (valid) {
      btnLoading.value = true
      let msg = ruleForm.value
      msg.actualDeliveryTime = parseTime(msg.actualDeliveryTime)
      api.fba.confirmOutOfStock(msg).then(res => {
        if (res.code == 200) {
          vue.$message.success(res.msg)
          btnLoading.value = false
          clearSelect()
          getTableData()
          closed()
        } else {
          btnLoading.value = false
          vue.$message.warning(res.msg)
        }
      }).catch(() => {
        btnLoading.value = false
      })
    }
  })

}
defineExpose({ openDialog })
</script>

<style scoped lang="scss">
#AuditPop {
  :deep(.el-dialog__header) {
    margin-right: 0;
  }
  :deep(.el-input__wrapper:last-child .el-input__inner) {
    padding-left: 12px !important;
    width: 160px;
  }
}
</style>
