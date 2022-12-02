<!-- 修改柜号 -->
<template>
  <div id="UpdateCabinetNum">
    <el-dialog v-model="UpdateDialogVisible" title="批量修改柜号" width="30%" :before-close="handleClose"
      :destroy-on-close="true" :close-on-press-escape="false">

      <el-form ref="ruleFormRef" :model="ruleForm" label-width="80px" :rules="rules">
        <el-form-item>
          <div>
            选择已有的柜号或者点击【新增】，新增柜号，新增柜号需要选择对应属性
          </div>
        </el-form-item>
        <el-form-item prop="cabinetNum" label="柜号：">
          <el-select v-model="ruleForm.cabinetNum" clearable placeholder="请选择">
            <el-option v-for="item in cabinetNumList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <span class="add" @click="add" v-show="addShow">新增</span>
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose" size="small" :loding="loading" :disabled="loading">取消</el-button>
          <el-button type="primary" @click="onSubmit" size="small" :loding="loading" :disabled="loading">确认</el-button>
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
      loading: false,
      addShow: true,
      ruleForm: {
        cabinetNum: "",
      },
      rules: {
        cabinetNum: [{ required: true, message: "请选择", trigger: "change" }],
      },
      ids: []
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const ruleFormRef = ref();
    //打开弹窗
    const openDialog = (list) => {
      data.ids = list
      data.cabinetNumList = [];
      api.warehouse.getCabinetNumListForCasesList(data.ids).then((res) => {
        if (res.code == 200) {
          data.cabinetNumList = res.data.cabinetNums;
          data.newCabinetNums = res.data.newCabinetNums;
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
    const getTableData = inject("getTableData");
    //修改柜号
    const onSubmit = () => {
      ruleFormRef.value.validate((valid) => {
        if (valid) {
          data.loading = true
          const info = {
            cabinetNum: data.ruleForm.cabinetNum,
            ids: data.ids
          }
          api.warehouse.batchUpdateCabinet(info).then((res) => {
            if (res.code == 200) {
              vue.$message.success(res.msg)
              data.loading = false
              handleClose();
              getTableData()
            } else {
              data.loading = false
              vue.$message.warning(res.msg)
            }
          }).catch(() => {
            data.loading = false
          })
        }
      });
    };
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
  .add {
    color: #409eff;
    cursor: pointer;
    margin-left: 5px;
  }
}
</style>
