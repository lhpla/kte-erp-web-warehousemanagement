<!-- StepFirst调拨收获装箱 -->
<template>
  <div id="StepFirst">
    <el-form :model="ruleForm" :rules="rules" ref="StepFirstRef">
      <vxe-table :data="tableData" border :loading="tableLoading" max-height="400" header-cell-class-name="header_size1"
        show-overflow :column-config="{ resizable: true }">
        <vxe-column type="seq" title="NO." align="center"></vxe-column>
        <vxe-column field="sku" title="SKU" align="center">
          <template #default="{ row }">
            {{ row.sku ? row.sku : "-" }}
          </template>
        </vxe-column>
        <vxe-column field="transferNum" title="调拨数量（PCS）" align="center">
          <template #default="{ row }">
            {{ row.transferNum ? row.transferNum : "-" }}
          </template>
        </vxe-column>
        <vxe-column field="startLocation" title="库位" align="center">
          <template #default="{ row }">
            {{ row.startLocation ? row.startLocation : "-" }}
          </template>
        </vxe-column>
        <vxe-column field="receiptNum" align="center">
          <template #header>
            <div style="display: flex; align-items: center; justify-content: center">
              <span>收货数量（PCS）</span>
              <el-tooltip class="item" effect="light" content="实收数量大于调拨数量可联系调拨仓补充建单">
                <i class="el-icon-warning-outline" style="margin-left: 5px"></i>
              </el-tooltip>
            </div>
          </template>
          <template #default="{ row, rowIndex }">
            <div style="padding: 5px 10px 0 10px">
              <el-form :model="row" :rules="rules" :ref="`receiptNum${row.index}`" @submit.native.prevent>
                <el-form-item prop="receiptNum">
                  <el-input v-model="row.receiptNum" @change="onBlur(rowIndex)" @blur="onBlur(rowIndex)">
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="packNum" title="装箱数（箱）" align="center">
          <template #default="{ row, rowIndex }">
            <div style="padding: 5px 10px 0 10px">
              <el-form :model="row" :rules="rules" :ref="`packNum${row.index}`" @submit.native.prevent>
                <el-form-item prop="packNum">
                  <el-input v-model="row.packNum"  @change="onBlur(rowIndex)" @blur="onBlur(rowIndex)">
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </el-form>
    <FirstConfirmSubmit ref="FirstConfirmSubmit"></FirstConfirmSubmit>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import FirstConfirmSubmit from "./FirstConfirmSubmit.vue";
const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
const rules = ref({
  receiptNum: [
    { required: true, message: "请输入", trigger: "blur" },
    { pattern: /^([0]|[1-9]\d*)$/, message: "格式错误", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        let flag = value > tempRow.value.transferNum;
        if (flag) {
          callback(new Error("大于调拨数量"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    },
  ],
  packNum: [
    { required: true, message: "请输入", trigger: "blur" },
    { pattern: /^([0]|[1-9]\d*)$/, message: "格式错误", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        let flag1 = +value > +tempRow.value.transferNum;
        let flag2 = +value > +tempRow.value.receiptNum;
        let flag3 = +tempRow.value.receiptNum != 0 && +value == 0
        if (flag1) {
          callback(new Error("大于调拨数量"));
        } else {
          if (flag2) {
            callback(new Error("大于收货数量"));
          } else {
            if (flag3) {
              callback(new Error("收货数量不为0时，装箱数也不能为0"));
            }
            callback();
          }
        }
      },
      trigger: "blur"
    },
  ],
});
const ruleForm = ref({});
const tableLoading = ref(false);
const tableData = ref([]);
const tempRow = ref({});
const transferCode = ref('')
//收获数量验证
const onBlur = (rowIndex) => {
  tempRow.value = tableData.value[rowIndex];
  vue.$refs[`receiptNum${tableData.value[rowIndex].index}`].clearValidate()
  vue.$refs[`packNum${tableData.value[rowIndex].index}`].clearValidate()
  vue.$refs[`receiptNum${tableData.value[rowIndex].index}`].validate()
  vue.$refs[`packNum${tableData.value[rowIndex].index}`].validate()
};

//循环校验列表
const validateList = () => {
  setTimeout(() => {
    tableData.value.forEach((row) => {
      tempRow.value = row;
      if (vue.$refs[`receiptNum${row.index}`]) {
        vue.$refs[`receiptNum${row.index}`].validate();
      }
      if (vue.$refs[`packNum${row.index}`]) {
        vue.$refs[`packNum${row.index}`].validate();
      }
    }, 0);
  });
};
const validateMethods = ref([]);
//successMethods成功后调用的方法
const validateMethod = (successMethods) => {
  validateMethods.value = [];
  tableData.value.forEach((row) => {
    tempRow.value = row
    if (vue.$refs[`receiptNum${row.index}`]) {
      validateMethods.value.push(vue.$refs[`receiptNum${row.index}`].validate());
    }
    if (vue.$refs[`packNum${row.index}`]) {
      validateMethods.value.push(vue.$refs[`packNum${row.index}`].validate());
    }
  });
  Promise.all(validateMethods.value)
    .then(() => {
      if (successMethods) {
        let confirmData = ref([]);
        for (let i in tableData.value) {
          if (tableData.value[i].transferNum > tableData.value[i].receiptNum) {
            confirmData.value.push(tableData.value[i]);
          }
        }
        if (confirmData.value.length > 0) {
          vue.$refs.FirstConfirmSubmit.getMsg(confirmData.value, tableData.value, transferCode.value);
        } else {
          successMethods();
        }
      }
    })
    .catch((err) => {
      console.log(err);
      vue.$message.error("表单填写有误,请检查");
    });
};
//获取数据
const getMsg = (data) => {
  tableData.value = data.skus;
  transferCode.value = data.detailVo.transferCode;
  tableData.value.map((item, index) => {
    item.index = index;
  });
};

const submitData = () => {
  return tableData.value;
};

defineExpose({ validateMethod, getMsg, submitData });
</script>

<style lang="scss">
#StepFirst {
  .el-pagination {
    position: static;
  }

  .header_size1 {
    height: 20px !important;
    line-height: 5px !important;
  }

  .paging {
    // margin-top: 20px;
    height: 50px;
    display: flex;
    justify-content: flex-end;
  }

}
</style>
