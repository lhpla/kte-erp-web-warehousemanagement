<!-- 标记 -->
<template>
  <div id="TagPop">
    <el-dialog title="发货计划-标记入库类型" v-model="dialogVisible" width="30%" :close-on-click-modal="false" @close="closed" :close-on-press-escape="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="120px" class="demo-ruleForm">
        <el-form-item prop="enterCodeType" class="label" v-if="headerAttribute!=3"> 
          <template #label>
            <div class="enterCodeType">
              <span>入库单类型：</span>
              <el-tooltip content="谷仓入库单类型" placement="bottom" effect="light">
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </div>
          </template>
          <el-radio-group v-model="ruleForm.enterCodeType">
            <el-radio :label="3">中转入库</el-radio>
            <el-radio :label="0">自发入库</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="运输方式：" prop="shippingMethod">
          <el-radio-group v-model="ruleForm.shippingMethod">
            <!-- :disabled="headerAttribute==3&&item.dizKey=='1'?true:false" -->
            <el-radio v-for="item in seceiving_shipping"  :label="item.dizKey">{{ item.value }}</el-radio>
          </el-radio-group>
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
import { localGet } from "@/utils/util";
export default {
  name: "TagPop",
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      type: "",
      btnLoading: false,
      shippingIds: [],
      seceiving_shipping: [],
      rules: {
        enterCodeType: { required: true, message: '请选择', trigger: 'change' },
        shippingMethod: { required: true, message: '请选择', trigger: 'change' },
      },
      ruleForm: {
        enterCodeType: 3,
        shippingMethod: '1'
      },
      headerAttribute: '1'
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const getTableData = inject("getTableData");
    const clearSelect = inject("clearSelect");
    onBeforeMount(() => { });
    onMounted(() => { });

    //closed 关闭弹框
    const closed = () => {
      data.ruleForm = {
        enterCodeType: 3,
        shippingMethod: '1'
      }
      data.dialogVisible = false;
      clearSelect()
    };

    //onSubmit 确认
    const onSubmit = () => {
      vue.$refs.ruleFormRef.validate((valid) => {
        if (valid) {
          if (data.ruleForm.enterCodeType == 3 && data.ruleForm.shippingMethod == 2 && data.headerAttribute != 3) {
            vue.$message.warning('中转入库类型不能选择快递的运输方式，请重新选择')
            return false
          }
          let msg = {
            shippingIds: data.shippingIds,
            enterCodeType: data.ruleForm.enterCodeType,
            shippingMethod: data.ruleForm.shippingMethod,
          };
          api.warehouse
            .markShippingSchedule(msg)
            .then((res) => {
              if (res.code == 200) {
                data.btnLoading = false;
                vue.$message.success(res.msg)
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
    const openLog = (shippingIds, headerAttribute) => {
      data.shippingIds = shippingIds //发货计划状态
      data.headerAttribute = headerAttribute;
      data.ruleForm.shippingMethod = headerAttribute == 3 ? '4' : '1'
      data.seceiving_shipping =
        localGet("purchaseDict") && localGet("purchaseDict").seceiving_shipping ? localGet("purchaseDict").seceiving_shipping : [];
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
#TagPop {
  .label {
    ::v-deep .el-form-item__label {
      display: flex;
    }

    .enterCodeType {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
