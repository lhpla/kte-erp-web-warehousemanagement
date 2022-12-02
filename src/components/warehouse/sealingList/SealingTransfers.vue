<!-- 封箱详情 调拨 -->
<template>
  <div id="SealingTransfers">
    <el-dialog title="调拨" v-model="transfersVisible" width="50%" :close-on-click-modal="false"
      :before-close="transfersClose" :close-on-press-escape="false">
      <el-form :model="transfersForm" ref="transfersRef" :rules="formRule" :inline="true" label-width="130px"
        class="demo-ruleForm transfersRef">
        <div>
          <el-form-item label="SKU:">{{ transfersForm.sku }}</el-form-item>
          <el-form-item label="中转仓库:" prop="transferWarehouseId">
            <el-select v-model="transfersForm.transferWarehouseId" filterable clearable placeholder="请选择">
              <el-option :label="item.name" :value="item.id" v-for="item in wareHouseList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="数量:" prop="transferNum">
            <el-input v-model="transfersForm.transferNum" clearable style="width: 193px"></el-input>
          </el-form-item>
          <el-form-item label="国外仓区:" prop="transferOverseasWarehouseId">
            <el-select v-model="transfersForm.transferOverseasWarehouseId" filterable clearable placeholder="请选择">
              <el-option :label="item.name" :value="item.id" v-for="item in warehouseAreaList" :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="运输方式:" prop="transferTransportMode">
            <el-select v-model="transfersForm.transferTransportMode" filterable placeholder="请选择" clearable>
              <el-option v-for="item in transportation_type" :key="item.dizKey" :label="item.value" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" :loading="btnFlag" :disabled="btnFlag" @click="transfersClose">取 消</el-button>
          <el-button type="primary" size="small" :loading="btnFlag" :disabled="btnFlag" @click="saveSubmit">确 定
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
  name: "SealingTransfers",
  setup(prop, ctx) {
    const data = reactive({
      transfersVisible: false,
      transfersForm: {},
      transportation_type: [], //运输方式
      formRule: {
        transferWarehouseId: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        transferTransportMode: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        transferOverseasWarehouseId: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        transferNum: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              let ret = /^\+?[1-9]\d*$/;
              if (!ret.test(value)) {
                callback(new Error("格式错误"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      wareHouseList: [], // 中转仓
      warehouseAreaList: [], //仓区
      btnFlag: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const getMsg = (msg) => {
      data.transportation_type = localGet("purchaseDict").transportation_type
        ? localGet("purchaseDict").transportation_type
        : [];
      data.transfersVisible = true;
      data.transfersForm = msg;
      // 中转仓
      api.system.getWareHouseList({ type: 1 }).then((res) => {
        if (res.code == 200) {
          data.wareHouseList = res.data;
        }
      });
      // 仓区
      api.develop.getDirectAndOverseasWarehouse().then((res) => {
        if (res.code == 200) {
          data.warehouseAreaList = res.data;
        }
      });
    };
    const transfersRef = ref(null);
    // 关闭
    const transfersClose = () => {
      data.transfersVisible = false;
      if (transfersRef.value) {
        transfersRef.value.clearValidate();
        transfersRef.value.resetFields();
      }
    };

    const getWarehouseCasesDetail = inject("getWarehouseCasesDetail");

    //保存调拨信息
    const saveSubmit = () => {
      if (data.transfersForm.transferNum > data.transfersForm.encasementNum) {
        vue.$message.warning({
          message: "请输入正确调拨数量",
          type: "warning",
        });
        return;
      }
      transfersRef.value.validate((valid) => {
        if (valid) {
          data.btnFlag = true;
          api.warehouse
            .saveTransfer(data.transfersForm)
            .then((res) => {
              if (res.code == 200) {
                data.btnFlag = false;
                vue.$message.success(res.msg);
                transfersClose();
                getWarehouseCasesDetail();
              } else {
                vue.$message.warning(res.msg);
                data.btnFlag = false;
              }
            })
            .catch((e) => {
              data.btnFlag = false;
            });
        }
      });
    };
    const refData = toRefs(data);
    return {
      ...refData,
      transfersClose,
      saveSubmit,
      getMsg,
      transfersRef,
      getWarehouseCasesDetail,
    };
  },
};
</script>
<style scoped lang="scss">
#SealingTransfers {
  .transfersRef {
    .el-form-item {
      width: 48%;
    }
  }
}
</style>
