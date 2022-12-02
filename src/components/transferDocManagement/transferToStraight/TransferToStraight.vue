<!-- TransferToStraight 中转调直发 -->
<template>
  <div id="TransferToStraight">
    <el-dialog title="调拨单-入库" v-model="dialogVisible" width="95%" :close-on-click-modal="false" @close="closed"
      destroy-on-close :close-on-press-escape="false">
      <div class="TransferToTransfer_title">
        <span>{{ `调拨仓：${rowInfo.startTransferWarehouse}-${rowInfo.startPurposeWarehouse}-${rowInfo.startTransportMode}`
        }}</span>
        <span>{{ `目的仓：${rowInfo.endTransferWarehouse}-${rowInfo.endPurposeWarehouse}-${rowInfo.endTransportMode}`
        }}</span>
      </div>
      <vxe-table border align="center" :data="tableData" max-height="400">
        <vxe-column type="seq" width="60" title="NO."></vxe-column>
        <vxe-column field="sku" title="SKU">
          <template #default="{ row }">
            <div>
              <span :class="row.errorMsg ? 'red' : ''">{{ row.sku ? row.sku : "-" }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="transferNum" title="调拨数量(PCS)">
          <template #default="{ row }">
            <div>
              <span>{{ row.transferNum ? row.transferNum : "-" }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="startCabinetNum" title="调拨柜号">
          <template #default="{ row }">
            <div>
              <span>{{ row.startCabinetNum ? row.startCabinetNum : "-" }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="startCartonNum" title="调拨箱号">
          <template #default="{ row }">
            <div>
              <span>{{ row.startCartonNum ? row.startCartonNum : "-" }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="receiptNum" title="入库数量(PCS)">
          <template #default="{ row, rowIndex }">
            <div class="input_box">
              <span v-for="item in row.locationList" :key="item">
                <el-form :model="item" :rules="rules" :ref="`receiptNum_${rowIndex}_${item.index}`"
                  style="display: flex" @submit.native.prevent>
                  <el-form-item prop="receiptNum">
                    <el-input v-model="item.receiptNum" clearable @change="inputBlur('receiptNum', rowIndex, item)"
                      @blur="inputBlur('receiptNum', rowIndex, item)">
                    </el-input>
                  </el-form-item>
                </el-form>
              </span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="endLocation" title="入库库位">
          <template #default="{ row, rowIndex }">
            <div class="input_box">
              <span v-for="item in row.locationList" :key="item">
                <el-form :model="item" :rules="rules" :ref="`endLocation_${rowIndex}_${item.index}`"
                  style="display: flex" @submit.native.prevent>
                  <el-form-item prop="endLocation">
                    <el-select v-model="item.endLocation" placeholder="请选择" :loading="optionsLoading"
                      @change="inputBlur('endLocation', rowIndex, item)"
                      @blur="inputBlur('endLocation', rowIndex, item)" @click="onEndLocationClick(rowIndex)">
                      <el-option v-for="item in options" :key="item.storageLocation" :label="item.storageLocation"
                        :value="item.storageLocation">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="operation" title="操作">
          <template #default="{ row, rowIndex }">
            <div class="input_box">
              <span v-for="(item, i) in row.locationList" :key="item.index">
                <el-button type="primary" text @click="onAdd(rowIndex)" v-if="i == 0">增 加</el-button>
                <el-button type="primary" text @click="onDelete(rowIndex, item.index)" style="color: red" v-if="i != 0">
                  删 除</el-button>
              </span>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closed" size="small" :disabled="btnLoading" :loading="btnLoading">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="btnLoading" :loading="btnLoading" size="small">确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <ConfirmSubmit ref="ConfirmSubmit"></ConfirmSubmit>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick, inject, provide } from "vue";
import ConfirmSubmit from "./ConfirmSubmit.vue";
export default {
  name: "StraightWarehouse",
  components: { ConfirmSubmit },
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      btnLoading: false,
      optionsLoading: false,
      rowInfo: {},
      //调拨单号
      transferCode: "",
      //   initTableData: [],
      //   changeList: [],
      tableData: [],
      options: [],
      tempRow: [],
      rules: {
        receiptNum: [
          { required: true, message: "请输入", trigger: "blur" },
          { pattern: /^([0]|[1-9]\d*)$/, message: "格式错误", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              let flag = value > data.tempRow.transferNum;
              if (flag) {
                callback(new Error("大于调拨数量"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          },
        ],
        endLocation: [{ required: true, message: "请选择", trigger: "change" }],
      },
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const getTableData = inject("getTableData");
    const getMsg = () => {
      //调接口获取tableData
      api.requisitionManagement.getTransferOrderList({ transferCode: data.transferCode }).then((res) => {
        if (res.code == 200) {
          data.rowInfo = res.data.detail;
          data.tableData = res.data.infos;
          data.tableData.forEach((item) => {
            item.errorMsg = false;
            item.transferNum == -1 ? data.tableData.transferNum : null;
            item.receiptNum == -1 ? data.tableData.receiptNum : null;
            item.locationList = [{ receiptNum: "", endLocation: "" }];
            item.locationList.forEach((ite, i) => {
              ite.index = i;
              ite.endLocation = item.endLocation
              ite.receiptNum = item.receiptNum
            });
          });
          data.dialogVisible = true;
        } else {
          vue.$message.warning(res.msg);
        }
      });
      validateList();
    };
    //循环校验列表
    const validateList = () => {
      setTimeout(() => {
        data.tableData.forEach((row, rowIndex) => {
          data.tempRow = row;
          row.locationList.forEach((item) => {
            if (vue.$refs[`receiptNum_${rowIndex}_${item.index}`]) {
              vue.$refs[`receiptNum_${rowIndex}_${item.index}`][0].validate();
            }
            if (vue.$refs[`endLocation_${rowIndex}_${item.index}`]) {
              vue.$refs[`endLocation_${rowIndex}_${item.index}`][0].validate();
            }
          });
        }, 0);
      });
    };

    //获取列表数据
    const openDialog = (row) => {
      // data.rowInfo = row;
      data.transferCode = row.transferCode;
      getMsg(row);
    };
    //关闭弹窗
    const closed = () => {
      data.dialogVisible = false;
      data.tableData = [];
    };
    provide("closed", closed);
    //判断是否加入到changeList(目前未做分页，不需要)
    // const onAddChangeList = (rowIndex, columnName, item) => {
    //   let flag = null;
    //   if (item) {
    //     flag =
    //       data.tableData[rowIndex].locationList[item.index][columnName] !== data.initTableData[rowIndex].locationList[item.index][columnName] ||
    //       data.tableData[rowIndex].locationList.length !== data.initTableData[rowIndex].locationList.length;
    //   } else {
    //     flag = data.tableData[rowIndex].locationList.length !== data.initTableData[rowIndex].locationList.length;
    //   }
    //   if (flag) {
    //     let isCover = data.changeList.find((item) => {
    //       return item.index == rowIndex;
    //     });
    //     if (!isCover) {
    //       data.changeList.push({ index: rowIndex, item: data.tableData[rowIndex] });
    //     }
    //   }
    // };

    //增加时
    const onAdd = (rowIndex) => {
      let location = JSON.parse(JSON.stringify(data.tableData[rowIndex].locationList[0]));
      location.index = data.tableData[rowIndex].locationList.at(-1).index + 1;
      data.tableData[rowIndex].locationList.push(location);
      validateList();
      inputBlur("", rowIndex, "");
      //   onAddChangeList(rowIndex);
    };

    //删除
    const onDelete = (rowIndex, itemIndex) => {
      console.log(rowIndex, itemIndex);
      let i = data.tableData[rowIndex].locationList.findIndex((item) => {
        return item.index == itemIndex;
      });
      data.tableData[rowIndex].locationList.splice(i, 1);
      inputBlur("", rowIndex, "");
      //   onAddChangeList(rowIndex);
    };
    //输入框失去焦点时判断是否加入changeList
    const inputBlur = (columnName, rowIndex, item) => {
      data.tempRow = data.tableData[rowIndex];
      let num = 0;
      for (let k in data.tableData[rowIndex].locationList) {
        num += data.tableData[rowIndex].locationList[k].receiptNum - 0;
      }
      if (num > data.tableData[rowIndex].transferNum) {
        data.tableData[rowIndex].errorMsg = true;
      } else {
        data.tableData[rowIndex].errorMsg = false;
      }
      //   onAddChangeList(rowIndex, columnName, item);
    };

    const onEndLocationClick = (rowIndex) => {
      data.tempRow = data.tableData[rowIndex];
      //获取库位下拉数据
      data.optionsLoading = true;
      api.requisitionManagement.getLocationDetail({ sku: data.tempRow.sku, warehouseId: data.rowInfo.endPurposeWarehouseId }).then((res) => {
        if (res.code == 200) {
          data.options = res.data;
          data.optionsLoading = false;
        }
      });
    };
    const validateMethods = ref([]);

    const validateMethod = (successMethods) => {
      validateMethods.value = [];
      data.tableData.forEach((row, rowIndex) => {
        data.tempRow = data.tableData[rowIndex];
        row.locationList.forEach((item) => {
          if (vue.$refs[`receiptNum_${rowIndex}_${item.index}`] && vue.$refs[`receiptNum_${rowIndex}_${item.index}`][0]) {
            validateMethods.value.push(vue.$refs[`receiptNum_${rowIndex}_${item.index}`][0].validate());
          }
          if (vue.$refs[`endLocation_${rowIndex}_${item.index}`] && vue.$refs[`endLocation_${rowIndex}_${item.index}`][0]) {
            validateMethods.value.push(vue.$refs[`endLocation_${rowIndex}_${item.index}`][0].validate());
          }
        });
      });
      Promise.all(validateMethods.value)
        .then(() => {
          if (successMethods) {
            //判断入库数量大于调拨数量
            let confirmData = [];
            let flag = true;
            for (let i in data.tableData) {
              let num = 0;
              for (let k in data.tableData[i].locationList) {
                num += data.tableData[i].locationList[k].receiptNum - 0;
              }
              if (num > data.tableData[i].transferNum) {
                data.tableData[i].errorMsg = true;
                flag = false;
              } else if (num < data.tableData[i].transferNum) {
                confirmData.push(data.tableData[i]);
              }
            }
            if (flag) {
              if (confirmData.length > 0) {
                vue.$refs.ConfirmSubmit.getMsg(confirmData, data.tableData, data.rowInfo);
              } else {
                successMethods();
              }
            } else {
              vue.$message.warning("入库数量不能大于调拨数量，红字已标识错误数据，请检查");
            }
          }
        })
        .catch((error) => {
          console.log(error);
          vue.$message.error("表单填写有误,请检查");
        });
    };

    //提交
    const onSubmit = () => {
      validateMethod(() => {
        const infoObj = { skuList: data.tableData, ...data.rowInfo };
        api.requisitionManagement.transferTransferDirectHairWarehousing(infoObj).then((res) => {
          if (res.code == 200) {
            vue.$message.success(res.msg);
            data.dialogVisible = false;
            getTableData();
          } else {
            vue.$message.warning(res.msg);
          }
        });
      });
    };
    const refData = toRefs(data);
    return {
      ...refData,
      openDialog,
      closed,
      onAdd,
      onDelete,
      inputBlur,
      onEndLocationClick,
      validateMethod,
      onSubmit,
    };
  },
};
</script>
<style lang="scss">
#TransferToStraight {
  .red {
    color: red;
  }

  .vxe-cell {
    padding: 0 !important;
  }

  td {
    padding: 0 !important;
  }

  .input_box {
    display: flex;
    flex-direction: column;

    >span {
      border-top: 1px solid #eee;
      padding: 10px 15px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;

      .el-form-item {
        margin-bottom: 0;
      }
    }

    >span:nth-child(1) {
      border-top: 0;
    }
  }

  .TransferToTransfer_title {
    margin-bottom: 20px;

    span {
      font-size: 16px;
      margin-right: 30px;
    }
  }

  ::v-deep .vxe-body--column {
    // display: flex;
    padding: 0;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
