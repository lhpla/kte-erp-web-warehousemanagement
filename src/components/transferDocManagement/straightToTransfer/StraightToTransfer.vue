<!-- StraightToTransfer 直发调中转-->
<template>
  <div id="StraightToTransfer">
    <el-dialog title="调拨单-入库" v-model="dialogVisible" width="80%" :close-on-click-modal="false" @close="closed"
      destroy-on-close :close-on-press-escape="false">
      <div class="StraightToTransfer_title">
        <span>{{ `调拨仓：${rowInfo.startTransferWarehouse}-${rowInfo.startPurposeWarehouse}-${rowInfo.startTransportMode}`
        }}</span>
        <span>{{ `目的仓：${rowInfo.endTransferWarehouse}-${rowInfo.endPurposeWarehouse}-${rowInfo.endTransportMode}`
        }}</span>
      </div>
      <el-steps :space="200" :active="activeStep">
        <el-step>
          <template #icon>
            <span>1</span>
          </template>
          <template #title>
            <span style="font-size: 12px">调拨收货装箱</span>
          </template>
        </el-step>
        <el-step>
          <template #icon>
            <span>2</span>
          </template>
          <template #title>
            <span style="font-size: 12px">装箱数据确认</span>
          </template>
        </el-step>
      </el-steps>
      <StepFirst v-if="activeStep == 1" ref="StepFirstRef"></StepFirst>
      <StepSecond v-if="activeStep == 2" ref="StepSecondRef"></StepSecond>
      <template #footer>
        <span class="dialog-footer">
          <span v-if="activeStep == 1">
            <el-button @click="closed" size="small" :disabled="btnLoading" :loading="btnLoading">取 消</el-button>
            <el-button type="primary" @click="next" :disabled="btnLoading" :loading="btnLoading" size="small">下一步
            </el-button>
          </span>
          <span v-if="activeStep == 2">
            <el-button @click="onSave" size="small" :disabled="btnLoading" :loading="btnLoading">暂 存</el-button>
            <el-button type="primary" @click="onSubmit" :disabled="btnLoading" :loading="btnLoading" size="small">确 定
            </el-button>
          </span>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, nextTick, provide, inject } from "vue";
import StepFirst from "./StepFirst.vue";
import StepSecond from "./StepSecond.vue";

const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
const dialogVisible = ref(false);
const activeStep = ref(1);
const btnLoading = ref(false);
const rowInfo = ref({});
const StepFirstList = ref([]);
const StepSecondList = ref([]);
const getTableData = inject("getTableData");
//打开弹窗
const openDialog = (row, step) => {
  if (step == "first") {
    api.requisitionManagement.getTransferOrderList({ transferCode: row.transferCode }).then((res) => {
      if (res.code == 200) {
        rowInfo.value = res.data.detailVo;
        StepFirstList.value = res.data;
        dialogVisible.value = true;
        setTimeout(() => {
          vue.$refs.StepFirstRef.getMsg(StepFirstList.value);
        }, 0);
      } else {
        vue.$message.warning(res.msg);
        dialogVisible.value = false;
      }
    });
  } else if (step == "second") {
    getSecondData(row.transferCode);
  }
};

//提交第一步数据
const submitFirstData = (submitData) => {
  api.requisitionManagement.submitFirstStep({ infos: submitData, transferCode: rowInfo.value.transferCode }).then((res) => {
    if (res.code == 200) {
      getSecondData(rowInfo.value.transferCode);
      getTableData()
    } else {
      vue.$message.warning(res.msg);
    }
  });
};
//获取第二步数据
const getSecondData = (transferCode) => {
  api.requisitionManagement.getSecondStepData({ transferCode: transferCode }).then((res) => {
    if (res.code == 200) {
      activeStep.value = 2;
      rowInfo.value = res.data.detailVo;
      StepSecondList.value = res.data;
      setTimeout(() => {
        vue.$refs.StepSecondRef.getMsg(StepSecondList.value);
      }, 0);
      dialogVisible.value = true;
    } else {
      vue.$message.warning(res.msg);
    }
  });
};
provide("getSecondData", getSecondData);

//提交第二步数据
const submitSecondData = (obj) => {
  api.requisitionManagement.submitConfirm(obj).then((res) => {
    if (res.code == 200) {
      vue.$message.success(res.msg);
      getTableData();
      dialogVisible.value = false;
      activeStep.value = 1;
    } else {
      vue.$message.warning(res.msg);
    }
  });
};

//下一步
const next = () => {
  nextTick(() => {
    vue.$refs.StepFirstRef.validateMethod(() => {
      nextTick(() => {
        const submitData = vue.$refs.StepFirstRef.submitData();
        submitFirstData(submitData);
      });
    });
  });
};
//关闭弹窗
const closed = () => {
  dialogVisible.value = false;
  activeStep.value = 1;
};
provide("closed", closed);
//更改柜号、尺寸关闭弹窗后更新数据
const updateMsg = (transferCode) => {
  getSecondData(transferCode);
};
provide("updateMsg", updateMsg);
//确定
const onSubmit = () => {
  vue.$refs.StepSecondRef.validateMethod(() => {
    const submitData = vue.$refs.StepSecondRef.submitData();
    let obj = { confirmDataVos: [], transferCode: "" };
    submitData.forEach((item) => {
      obj.confirmDataVos.push(...item.confirmDataVos);
    });
    obj.transferCode = submitData[0].transferCode;
    submitSecondData(obj);
  });
};

//暂存
const onSave = () => {
  vue.$refs.StepSecondRef.validateMethod(() => {
    const submitData = vue.$refs.StepSecondRef.submitData();
    for (let i = 0; i < submitData.length; i++) {
      let num = 0;
      submitData[i].confirmDataVos.forEach((item) => {
        num += item.singleCartonCount - 0;
      });
      if (num > submitData[i].receiptNum) {
        vue.$message.warning("收货数量大于调拨数量");
      }
    }
    let obj = { confirmDataVos: [], transferCode: "" };
    submitData.forEach((item) => {
      obj.confirmDataVos.push(...item.confirmDataVos);
    });
    obj.transferCode = submitData[0].transferCode;
    api.requisitionManagement.saveConfirm(obj).then((res) => {
      if (res.code == 200) {
        vue.$message.success(res.msg);
        getTableData();
        dialogVisible.value = false;
        activeStep.value = 1;
      } else {
        vue.$message.warning(res.msg);
      }
    });
  });
};
defineExpose({
  openDialog,
});
</script>

<style scoped lang="scss">
#StraightToTransfer {
  .StraightToTransfer_title {
    margin-bottom: 20px;

    span {
      font-size: 16px;
      margin-right: 30px;
    }
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
