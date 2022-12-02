<!-- FBA发货计划驳回 -->
<template>
  <div id="Reject">
    <el-dialog title="驳回" v-model="dialogFormVisible" width="50%" :close-on-click-modal="false" @close="handleClose" :close-on-press-escape="false">
      <el-form :model="form" ref="formRef" :rules="rules">
        <el-form-item label="驳回原因:" prop="remarksDismissed" label-width="100px">
          <el-input v-model="form.remarksDismissed" type="textarea" :rows="5" placeholder="请简述驳回原因" maxlength="300">
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose" size="small" :disabled="btnLoading" :loading="btnLoading">取 消
          </el-button>
          <el-button type="primary" @click="submit" size="small" :disabled="btnLoading" :loading="btnLoading">
            确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, inject } from "vue";

const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;

const form = ref({
  remarksDismissed: "",
  shipId: "",
})
const dialogFormVisible = ref(false)
const rules = ref({
  remarksDismissed: [
    { required: true, message: "请简述驳回原因", trigger: "blur" },
  ],
})
const btnLoading = ref(false)
const formRef = ref(null);
const getTableData = inject("getTableData");
//获取基础信息
const getMsg = (row) => {
  form.value.shipId = row.id;
  dialogFormVisible.value = true;
};
//关闭弹窗
const handleClose = () => {
  form.value.remarksDismissed = "";
  form.value.shipId = "";
  dialogFormVisible.value = false;
};
//确定
const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      btnLoading.value = true;
      api.fba
        .fbaRefusal(form.value)
        .then((res) => {
          if (res.code == 200) {
            vue.$message.success(res.msg);
            btnLoading.value = false;
            getTableData()
            handleClose();
          } else {
            btnLoading.value = false;
            vue.$message.warning(res.msg);
          }
        })
        .catch((err) => {
          btnLoading.value = false;
        });
    }
  });
};
defineExpose({ getMsg })
</script>
<style scoped lang="scss">
#Reject {
  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
