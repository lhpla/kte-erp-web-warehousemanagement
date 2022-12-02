<!-- 确认出库 ConfirmDelivery -->
<template>
  <div id="ConfirmDelivery">
    <el-dialog title="调拨单-确认出库" v-model="dialogVisible" width="500px" :close-on-click-modal="false" @close="closed"
      destroy-on-close :close-on-press-escape="false">
      <el-form :model="formParam" ref="formRef" label-width="80px" :rules="rules"  @submit.native.prevent >
        <div class="RegistrationTrackingNum_box">
          <span class="text">注：请确认调拨单所有产品已出库，如有跟踪号请填写跟踪号</span>
          <el-form-item label="跟踪号:" prop="a">
            <el-input v-model="formParam.a"  clearable style="width: 220px;"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closed" size="small" :disabled="btnLoading" :loading="btnLoading">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="btnLoading" :loading="btnLoading" size="small">确认出库
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from 'vue';
import { AJAX_getAllotList_confirmOutOfStock } from "@/api/transfers/requisitionManagement";
export default {
  name: 'ConfirmDelivery',
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      btnLoading: false,
      formParam: {
        a: ''
      },
      rules: {
        a: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[0-9a-zA-Z]+$/;
              if (value.length > 30) {
                callback(new Error("字符长度不超过30位"));
              } else if (!reg.test(value) && value.trim()) {
                callback(new Error("跟踪号可输入数字、英文字母"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ]
      },
      id: ''
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { })
    onMounted(() => { })
    const formRef = ref()
    const getTableData = inject('getTableData')
    //打开弹窗
    const openDialog = (row) => {
      data.id = row.id
      data.dialogVisible = true
    }
    //关闭弹窗
    const closed = () => {
      data.formParam = {
        a: ''
      }
      data.dialogVisible = false
    }
    //确认出库
    const onSubmit = () => {
      formRef.value.validate(async (valid) => {
        if (valid) {
          // todo 调接口
          try {
            const res = await AJAX_getAllotList_confirmOutOfStock({ id: data.id, trackingNumber: data.formParam.a })
            if (res.code == 200) {
              vue.$message.success('操作成功!')
              closed()
              getTableData()
            } else {
              vue.$message.error(res.msg)
            }

          } catch (e) {
            // noop
          }

        }
      })
    }
    const refData = toRefs(data);
    return {
      ...refData,
      closed,
      onSubmit,
      formRef,
      openDialog
    }
  }
};
</script>
<style scoped lang='scss'>
#ConfirmDelivery {
  ::v-deep .el-dialog__title {
    font-size: 16px !important;
  }

  .RegistrationTrackingNum_box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .text {
      color: red;
      padding-bottom: 20px;
    }
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
