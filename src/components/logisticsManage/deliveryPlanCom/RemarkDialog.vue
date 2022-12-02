<!-- RemarkDialog 入库单备注-->
<template>
  <div id='RemarkDialog'>
    <el-dialog title="入库单-备注" v-model="dialogVisible" width="500px" :close-on-click-modal="false" @close="closed" :close-on-press-escape="false">
      <el-form :inline="true"  ref="formInlineRef" label-width="80px" :model="searchForm"
        class="demo-form-inline el-from" :rules="rules">
        <el-form-item class="SearchPanel-form-item" label="备注：" prop="enterCodeRemark">
          <el-input v-model="searchForm.enterCodeRemark" type="textarea" :rows="4" clearable 
            style="width: 350px" placeholder="请输入" maxlength="300"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="closed" :loading="btnFlag" :disabled="btnFlag">取 消</el-button>
          <el-button size="small" type="primary" @click="onSubmit" :loading="btnFlag" :disabled="btnFlag">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, inject } from 'vue';
import { reduce } from 'xe-utils';

const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
const searchForm = ref({
  enterCodeRemark: ''
})
const rules = {
  enterCodeRemark: [{ required: true, message: "请输入", trigger: "blur" }]
}
const rowData = ref({})
const handleExpand = inject('handleExpand', rowData.value)
const dialogVisible = ref(false)
const btnFlag = ref(false)
const cabinetNum = ref('')
//打开弹窗
const openDialog = (row, rowN) => {
  searchForm.value.enterCodeRemark = row.enterCodeRemark
  cabinetNum.value = row.cabinetNum
  rowData.value = rowN
  dialogVisible.value = true
}
//关闭弹窗
const closed = () => {
  searchForm.value = { enterCodeRemark: '' }
  vue.$refs.formInlineRef.clearValidate()
  dialogVisible.value = false
}
//
const onSubmit = () => {
  vue.$refs.formInlineRef.validate((valid) => {
    if (valid) {
      let info = {
        cabinetNum: cabinetNum.value,
        enterCodeRemark: searchForm.value.enterCodeRemark
      }
      btnFlag.value = true
      api.warehouse.saveEnterCodeRemark(info).then(res => {
        if (res.code == 200) {
          btnFlag.value = false
          vue.$message.success(res.msg)
          handleExpand(rowData.value)
          closed()
        } else {
          vue.$message.warning(res.msg);
          btnFlag.value = false;
        }
      }).catch(() => {
        btnFlag.value = false;
      })
    }
  })
}
defineExpose({ openDialog })
</script>

<style scoped lang='scss'>
#RemarkDialog {
  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>