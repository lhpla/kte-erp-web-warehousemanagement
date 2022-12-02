<!-- 修改柜号 -->
<template>
  <div id="UpdateCabinetNum">
    <el-dialog v-model="UpdateDialogVisible" :title="title" width="30%" @close="handleClose" :destroy-on-close="true" :close-on-press-escape="false">
      <el-form ref="ruleFormRef" :model="ruleForm" label-width="100px" :rules="rules">
        <el-form-item prop="cabinetNum" label="柜号：">
          <el-select v-model="ruleForm.cabinetNum" clearable placeholder="请选择">
            <el-option v-for="item in cabinetNumList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <span class="add" @click="add" v-show="addShow">新增</span>
        </el-form-item>
        <el-form-item prop="cabinetAttribute" label="柜号属性："
          v-if="newCabinetNums&&ruleForm.cabinetNum == newCabinetNums">
          <el-select v-model="ruleForm.cabinetAttribute" clearable placeholder="请选择">
            <el-option v-for="item in cabinet_attribute" :key="item.dizKey" :label="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
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
} from "vue";
import { localGet } from "@/utils/util";
export default {
  name: "UpdateCabinetNum",
  setup(prop, ctx) {
    const data = reactive({
      UpdateDialogVisible: false,
      cabinetNumList: [],
      cabinet_attribute: [],
      newCabinetNums: "",
      title: "",
      addShow: true,
      ruleForm: {
        cabinetNum: "",
        cabinetAttribute: ""
      },
      rules: {
        cabinetNum: [{ required: true, message: "请选择", trigger: "change" }],
        cabinetAttribute: [{ required: true, message: "请选择", trigger: "change" }],
      },
      selectList: []
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const ruleFormRef = ref();
    //打开弹窗
    const openDialog = (list, transferWarehouseId) => {
      data.selectList = list.selectList
      data.cabinet_attribute =
        localGet("purchaseDict") && localGet("purchaseDict").cabinet_attribute
          ? localGet("purchaseDict").cabinet_attribute
          : [];
      const info = {
        purposeWarehouseId: list.selectList[0].warehouseId,
        transferWarehouseId: transferWarehouseId,
        transportMode: list.selectList[0].transportMode,
      };
      api.warehouse.getCabinetNumList(info).then((res) => {
        if (res.code == 200) {
          data.cabinetNumList = res.data.cabinetNums;
          data.newCabinetNums = res.data.newCabinetNums;
        }
      });
      data.title = list.warehouse;
      data.UpdateDialogVisible = true;
    };
    //关闭弹窗
    const handleClose = () => {
      data.addShow = true;
      data.ruleForm = {
        cabinetNum: "",
        cabinetAttribute: ""
      };
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
            num: data.selectList.length,
            cabinetAttribute: data.newCabinetNums && data.newCabinetNums == data.ruleForm.cabinetNum ? data.ruleForm.cabinetAttribute : ''
          }
          api.warehouse.getCabinetCasesNumList(info).then((res) => {
            if (res.code == 200) {
              ctx.emit("handleCabinetNum", data.ruleForm.cabinetNum, data.title, res.data);
              handleClose();
            }
          });
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
