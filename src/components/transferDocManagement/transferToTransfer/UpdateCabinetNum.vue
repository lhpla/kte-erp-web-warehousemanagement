<!-- 修改柜号 -->
<template>
  <div id="UpdateCabinetNum">
    <el-dialog v-model="UpdateDialogVisible" title="调拨入库-修改柜号" width="30%" @close="handleClose" destroy-on-close :close-on-press-escape="false">
      <div class="title">选择已有的柜号或者点击【新增】新增柜号</div>
      <el-form ref="ruleFormRef" :model="ruleForm" label-width="80px" :rules="rules" :inline="true">
        <el-form-item prop="cabinetNum" label="柜号：">
          <el-select v-model="ruleForm.cabinetNum" clearable placeholder="请选择">
            <el-option v-for="item in cabinetNumList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <span class="add" @click="add" v-if="addShow">新增</span>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose" size="small">取消</el-button>
          <el-button type="primary" @click="onSubmit" size="small">确认</el-button>
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
  name: "UpdateCabinetNum",
  setup(prop, ctx) {
    const data = reactive({
      UpdateDialogVisible: false,
      cabinetNumList: [],
      newCabinetNums: "",
      addShow: true,
      ruleForm: {
        cabinetNum: "",
      },
      rules: {
        cabinetNum: [{ required: true, message: "请选择", trigger: "change" }],
      },
      selectList: [],
      transferCode: ''
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const ruleFormRef = ref();
    //打开弹窗
    const openDialog = (list, resInfo, transferCode) => {
      data.transferCode = transferCode
      list.map(row => {
        // data.selectList.push(row.sku)
        row.confirmDataVos.map(item => {
          data.selectList.push(item.id)
        })
      })
      const info = {
        purposeWarehouseId: resInfo.endPurposeWarehouseId,
        transferWarehouseId: resInfo.endTransferWarehouseId,
        transportMode: resInfo.endTransportMode,
      };
      api.warehouse.getCabinetNumList(info).then((res) => {
        if (res.code == 200) {
          data.cabinetNumList = res.data.cabinetNums;
          data.newCabinetNums = res.data.newCabinetNums;
        } else {
          vue.$message.warning(res.msg)
        }
      });
      data.UpdateDialogVisible = true;
    };
    //关闭弹窗
    const handleClose = () => {
      data.addShow = true;
      data.ruleForm.cabinetNum = "";
      data.cabinetNumList = [];
      data.newCabinetNums = "";
      ruleFormRef.value.clearValidate();
      data.UpdateDialogVisible = false;
    };
    //修改柜号
    const onSubmit = () => {
      ruleFormRef.value.validate((valid) => {
        if (valid) {
          const info = {
            cabinetNum: data.ruleForm.cabinetNum,
            ids: data.selectList,
            transferCode: data.transferCode
          }
          api.requisitionManagement.updateCabinetNum(info).then((res) => {
            if (res.code == 200) {
              getMsg()
              vue.$message.success(res.msg)
              handleClose();
            } else {
              vue.$message.warning(res.msg)
            }
          })
        }
      });
    };
    const getMsg = inject('getMsg')
    //添加柜号
    const add = () => {
      if (data.newCabinetNums) {
        data.cabinetNumList.push(data.newCabinetNums);
        data.ruleForm.cabinetNum = data.newCabinetNums;
        vue.$message.success(`新增柜号${data.newCabinetNums}成功`);
      } else {
        vue.$message.warning(`新增柜号失败`);
      }
      data.addShow = false;
    };
    const refData = toRefs(data);

    return {
      ...refData,
      openDialog,
      handleClose,
      onSubmit,
      ruleFormRef,
      add,
    };
  },
};
</script>
<style scoped lang="scss">
#UpdateCabinetNum {
  .title {
    margin: 0 0 20px 25px;
  }

  .add {
    color: #409eff;
    cursor: pointer;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
