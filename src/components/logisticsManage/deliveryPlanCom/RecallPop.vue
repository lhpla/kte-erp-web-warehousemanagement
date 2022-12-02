<!-- 撤回 RecallPop -->
<template>
  <div id="RecallPop">
    <el-dialog title="操作确认" v-model="dialogVisible" width="30%" :close-on-click-modal="false" @close="closed" :close-on-press-escape="false">
      <div style="font-size: 16px;margin-bottom: 20px; margin-left: 20px;">是否撤回？</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="撤回原因：" prop="revokeReason">
          <el-input type="textarea" :rows="3" placeholder="请输入撤回意见" v-model="ruleForm.revokeReason" maxlength="500">
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closed" size="small" :disabled="btnLoading" :loading="btnLoading">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="btnLoading" :loading="btnLoading" size="small">确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  ref,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  inject,
} from "vue";
export default {
  name: "RecallPop",
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      btnLoading: false,
      shippingId: "",
      ruleForm: {
        revokeReason: "",
      },
      rules: {
        revokeReason: [{ required: true, message: '请输入撤回原因', trigger: 'blur' },]
      }
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const getTableData = inject("getTableData");
    onBeforeMount(() => { });
    onMounted(() => { });

    //closed 关闭弹框
    const closed = () => {
      data.dialogVisible = false;
      vue.$refs.ruleFormRef.clearValidate()
      data.ruleForm = {
        revokeReason: "",
      }
    };

    //onSubmit 确认
    const onSubmit = () => {
      vue.$refs.ruleFormRef.validate((valid) => {
        if (valid) {
          data.btnLoading = true;
          let msg = {
            shippingId: data.shippingId,
            revokeReason: data.ruleForm.revokeReason ? data.ruleForm.revokeReason.trim() : "",
          };
          api.warehouse
            .withdrawalPlanN(msg)
            .then((res) => {
              if (res.code == 200) {
                data.btnLoading = false;
                getTableData();
                closed();
              } else {
                vue.$message.warning(res.msg);
                data.btnLoading = false;
              }
            })
            .catch((err) => {
              data.btnLoading = false;
            });
        }
      })

    };

    //openLog 打开弹框
    const openLog = (shippingId) => {
      data.shippingId = shippingId ? shippingId : "";
      data.dialogVisible = true;
    };

    const refData = toRefs(data);
    return {
      ...refData,
      closed,
      openLog,
      onSubmit,
      getTableData,
    };
  },
};
</script>
<style scoped lang="scss">
#RecallPop {
  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
