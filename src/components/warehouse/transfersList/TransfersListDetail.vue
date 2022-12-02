<!-- 调拨详情 -->
<template>
  <div id="TransfersListDetail">
    <el-dialog :title="
      title == 'view' ? '调拨详情' : title == 'eidt' ? '调拨处理' : '调拨确认'
    " v-model="dialogVisible" width="90%" :close-on-click-modal="false" :before-close="handleClose" :close-on-press-escape="false">
      <el-table :data="formItem.warehouseProductVos" border style="width: 100%" :header-cell-style="{
        background: '#fafafa',
        color: '#2d2f30',
        fontWeight: 'bold',
        fontSize: '12px',
      }">
        <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
        <el-table-column label="SKU" prop="sku"></el-table-column>
        <el-table-column label="调拨数量" prop="transferNum"></el-table-column>
        <el-table-column label="调拨仓库" prop="transferWarehouse"></el-table-column>
        <el-table-column label="调拨仓区" prop="transferOverseasWarehouse">
          <template #default="scope">
            <span>{{
                scope.row.transferOverseasWarehouse
                  ? scope.row.transferOverseasWarehouse
                  : ""
            }}</span>
            <span v-if="scope.row.transferTransportMode">({{ scope.row.transferTransportMode }})</span>
          </template>
        </el-table-column>
        <el-table-column label="中转仓库" prop="warehouseName"></el-table-column>
        <el-table-column label="中转仓区" prop="overseasWarehouse">
          <template #default="scope">
            <span>{{
                scope.row.overseasWarehouse ? scope.row.overseasWarehouse : ""
            }}</span>
            <span v-if="scope.row.transportMode">({{ scope.row.transportMode }})</span>
          </template>
        </el-table-column>
        <el-table-column label="调拨箱号" prop="newCartonNum" v-if="title !== 'eidt'">
          <template #default="scope">
            <div v-if="title == 'view' || title == 'print'">
              {{ scope.row.newCartonNum }}
            </div>
            <el-form v-else :inline-message="true" :model="scope.row" :rules="{
              newCartonNum: [
                { required: true, message: '请输入', trigger: 'blur' },
                { pattern: /^[1-9][0-9]{0,3}$/, message: '格式错误' },
              ],
            }" ref="ruleForm" class="demo-ruleForm">
              <el-form-item prop="newCartonNum" style="margin-bottom: 0">
                <el-input v-model="scope.row.newCartonNum" size="mini" clearable></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="调拨柜号" prop="newCabinetNum" v-if="title !== 'eidt'">
          <template #default="scope">
            <div v-if="title == 'view' || title == 'print'">
              {{ scope.row.newCabinetNum }}
            </div>
            <el-form v-else :inline-message="true" ref="newCabinetNumRef" :model="scope.row" :rules="{
              newCabinetNum: [
                { required: true, message: '请输入', trigger: 'blur' }
              ],
            }" class="demo-ruleForm">
              <el-form-item prop="newCabinetNum" style="margin-bottom: 0">
                <el-input v-model.trim="scope.row.newCabinetNum" size="mini" clearable></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="尺寸（长x宽x高）cm" min-width="210" v-if="title !== 'eidt'">
          <template #default="scope">
            <div v-if="title == 'view' || title == 'print'">
              {{ scope.row.length }}x{{ scope.row.width }}x{{
                  scope.row.height
              }}
            </div>
            <div v-else>
              <el-form :inline-message="true" :model="scope.row" ref="sizeRef" :rules="tableRules"
                class="demo-ruleForm">
                <el-form-item prop="length">
                  <el-input size="mini" v-model.trim="scope.row.length" style="width: 90px"></el-input>
                </el-form-item>
                <el-form-item prop="width">
                  <el-input size="mini" v-model.trim="scope.row.width" style="width: 90px"></el-input>
                </el-form-item>
                <el-form-item prop="height">
                  <el-input size="mini" v-model.trim="scope.row.height" style="width: 90px"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="title == 'audit'" width="100">
          <template #default="scope">
            <el-button size="mini" type="text" :loading="btnFlag" :disabled="btnFlag" @click="saveDispose(scope.row)">确定
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex" v-if="title !== 'print'">
        <div>备 注：</div>
        <el-input v-if="title == 'eidt'" v-model.trim="remarks" style="width: 90%" type="textarea"
          :autosize="{ minRows: 4, maxRows: 4 }" size="mini"></el-input>
        <div style="width: 90%" v-else>
          {{ remarks }}
        </div>
      </div>

      <template #footer v-if="title == 'eidt' || title == 'print'">
        <span class="dialog-footer">
          <el-button size="mini" @click="handleClose" :disabled="btnFlag" :loading="btnFlag">取 消</el-button>
          <el-button type="primary" v-if="title == 'eidt'" size="mini" :disabled="btnFlag" :loading="btnFlag"
            @click="refusalTransfer">驳 回</el-button>
          <el-button type="primary" v-if="title == 'eidt'" size="mini" :disabled="btnFlag" :loading="btnFlag"
            @click="processTransfer">处 理</el-button>
          <el-dropdown class="margin-left" v-if="title == 'print'">
            <el-button type="primary" size="mini" :disabled="btnFlag" :loading="btnFlag">
              打印条码
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="
                  printCartonNum(formItem.warehouseProductVos[0], '谷仓')
                ">谷仓</el-dropdown-item>
                <el-dropdown-item @click="
                  printCartonNum(formItem.warehouseProductVos[0], '4PX')
                ">4PX</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
  computed,
  inject,
} from "vue";
import { localGet } from "@/utils/util";
import { getLodop } from "@/utils/LodopFuncs";
export default {
  name: "TransfersListDetail",
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      btnFlag: false,
      formItem: {},
      rules: {},
      purchaseDict: [], // 字典数组
      receipt_status: [],
      title: "view",
      remarks: "",
      id: "",
      row: "",
      tableRules: {
        length: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,
            message: "请输入正确数据",
            trigger: "blur",
          },
        ],
        width: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,
            message: "请输入正确数据",
            trigger: "blur",
          },
        ],
        height: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,
            message: "请输入正确数据",
            trigger: "blur",
          },
        ],
      },
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const refData = toRefs(data);
    const getMsg = (row, text) => {
      data.title = text;
      data.id = row.id;
      data.row = row;
      data.purchaseDict = localGet("purchaseDict")
        ? localGet("purchaseDict")
        : [];
      data.receipt_status = data.purchaseDict.receipt_status
        ? data.purchaseDict.receipt_status
        : [];
      data.dialogVisible = true;
      api.warehouse
        .getTransferSelectOne({
          id: row.id,
          isDetail: text == "view" ? true : false,
        })
        .then((res) => {
          if (res.code == 200) {
            data.formItem.warehouseProductVos = [res.data];
            data.remarks = res.data.remarks;
          }
        });
    };
    const getTableData = inject("getTableData");

    //打印
    const printCartonNum = (row, type) => {
      data.btnFlag = true;
      let LODOP = getLodop();
      if (row.newCartonNum) {
        if (typeof LODOP == "string") {
          vue.$message.warning({
            dangerouslyUseHTMLString: true,
            message: LODOP,
          });
          return;
        }
        let datas = {
          cartonNum: row.newCartonNum,
          encasementNum: row.transferNum,
          num: 1,
          sku: type == "谷仓" ? "200-" + row.sku : row.sku,
          warehouse: row.transferOverseasWarehouse,
        };
        vue.$printFn(LODOP, datas, "cartonNum");
        data.btnFlag = false;
      } else {
        vue.$message.warning({
          message: "箱号不能为空",
          type: "warning",
        });
        data.btnFlag = false;
      }
    };

    // 关闭
    const handleClose = () => {
      data.dialogVisible = false;
      data.formItem = {};
      data.id = "";
      data.remarks = "";
    };

    const sizeRef = ref();
    const newCabinetNumRef = ref();
    // 处理
    const saveDispose = (row) => {
      vue.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const open = ref(true);
          if (newCabinetNumRef.value) {
            newCabinetNumRef.value.validate((valid1) => {
              if (!valid1) {
                open.value = false;
              }
            });
          }
          if (sizeRef.value) {
            sizeRef.value.validate((valid2) => {
              if (!valid2) {
                open.value = false;
              }
            });
          }
          if (!open.value) {
            return false;
          }
          data.btnFlag = true;
          let msg = {
            height: row.height,
            id: data.id,
            length: row.length,
            newCabinetNum: row.newCabinetNum,
            newCartonNum: row.newCartonNum,
            newSerialNum: row.newSerialNum,
            oldCabinetNum: row.oldCabinetNum,
            oldCartonNum: row.oldCartonNum,
            oldSerialNum: row.oldSerialNum,
            overseasWarehouse: row.overseasWarehouse,
            overseasWarehouseId: row.overseasWarehouseId,
            sku: row.sku,
            transferNum: row.transferNum,
            transferOverseasWarehouse: row.transferOverseasWarehouse,
            transferOverseasWarehouseId: row.transferOverseasWarehouseId,
            transferWarehouse: row.transferWarehouse,
            transferWarehouseId: row.transferWarehouseId,
            warehouseId: row.warehouseId,
            warehouseName: row.warehouseName,
            width: row.width,
            transferTransportMode: data.row.transferTransportMode,
          };
          console.log("yyyyyyy--处理---transferTransportMode", msg);
          api.warehouse
            .confirmTransfer(msg)
            .then((res) => {
              if (res.code == 200) {
                vue.$message.success({
                  message: res.msg,
                  type: "success",
                });
                data.btnFlag = false;
                handleClose();
                getTableData();
              } else {
                vue.$message.warning({
                  message: res.msg,
                  type: "warning",
                });
                data.btnFlag = false;
              }
            })
            .catch((e) => {
              data.btnFlag = false;
            });
        }
      });
    };
    //处理调拨
    const processTransfer = () => {
      data.btnFlag = true;
      api.warehouse
        .processTransfer({ id: data.id, remarks: data.remarks })
        .then((res) => {
          if (res.code == 200) {
            vue.$message.success({
              message: res.msg,
              type: "success",
            });
            handleClose();
            getTableData();
            data.btnFlag = false;
          } else {
            vue.$message.warning({
              message: res.msg,
              type: "warning",
            });
            data.btnFlag = false;
          }
        })
        .catch((e) => {
          data.btnFlag = false;
        });
    };

    //驳回调拨
    const refusalTransfer = () => {
      data.btnFlag = true;
      api.warehouse
        .refusalTransfer({ id: data.id, remarks: data.remarks })
        .then((res) => {
          if (res.code == 200) {
            vue.$message.success({
              message: res.msg,
              type: "success",
            });
            handleClose();
            getTableData();
            data.btnFlag = false;
          } else {
            vue.$message.warning({
              message: res.msg,
              type: "warning",
            });
            data.btnFlag = false;
          }
        })
        .catch((e) => {
          data.btnFlag = false;
        });
    };

    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (list, dizKey) {
        if (list.length > 1 && dizKey !== -1) {
          for (let item of list) {
            if (dizKey == item.dizKey) {
              return item.value;
            }
          }
        }
      };
    });
    return {
      ...refData,
      getMsg,
      tableTypeComputed,
      saveDispose,
      handleClose,
      processTransfer,
      refusalTransfer,
      printCartonNum,
      newCabinetNumRef,
      sizeRef,
    };
  },
};
</script>
<style scoped lang="scss">
</style>
