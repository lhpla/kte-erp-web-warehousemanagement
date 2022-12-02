<!--StepSecond 第二步  -->
<template>
  <div id="StepSecond">
    <div class="TransferToTransfer_operation">
      <el-button type="primary" @click="changeCabinetNum" size="small">
        <span>修改柜号</span>
        <el-tooltip class="item" effect="light" content="修改当前页被勾选的箱子柜号" placement="bottom">
          <i class="el-icon-warning-outline" style="margin-left: 5px"></i>
        </el-tooltip>
      </el-button>
      <el-button type="primary" @click="changeAllCabinetNum" size="small">
        <span>整单修改柜号</span>
        <el-tooltip class="item" effect="light" content="修改该调拨单所有入库箱子的柜号" placement="bottom">
          <i class="el-icon-warning-outline" style="margin-left: 5px"></i>
        </el-tooltip>
      </el-button>
      <el-button type="primary" @click="changeAll" size="small">
        <span>整单修改尺寸</span>
        <el-tooltip class="item" effect="light" content="修改调拨单所有入库箱子的尺寸" placement="bottom">
          <i class="el-icon-warning-outline" style="margin-left: 5px"></i>
        </el-tooltip>
      </el-button>
    </div>
    <vxe-table border align="center" :data="tableData" @checkbox-all="selectChangeEvent"
      @checkbox-change="selectChangeEvent" max-height="400">
      <vxe-column type="checkbox" width="50" align="center"></vxe-column>
      <vxe-column type="seq" width="60" title="NO."></vxe-column>
      <vxe-column field="sku" title="SKU">
        <template #default="{ row }">
          <div>
            <span :class="row.errorMsg ? 'red' : ''">{{ row.sku ? row.sku : "-" }}</span>
          </div>
        </template>
      </vxe-column>
      <vxe-column field="receiptNum" title="收货数量(PCS)">
        <template #default="{ row }">
          <div>
            <span>{{ row.receiptNum ? row.receiptNum : "-" }}</span>
          </div>
        </template>
      </vxe-column>
      <vxe-column field="startLocation" title="库位">
        <template #default="{ row }">
          <div>
            <span>{{ row.startLocation ? row.startLocation : "-" }}</span>
          </div>
        </template>
      </vxe-column>
      <vxe-column field="endCabinetNum" title="入库柜号">
        <template #default="{ row, rowIndex }">
          <div class="input_box">
            <span v-for="item in row.confirmDataVos" :key="item">
              <el-form :model="item" :rules="rules" :ref="`endCabinetNum_${rowIndex}_${item.index}`"
                style="display: flex" @submit.native.prevent>
                <el-form-item prop="endCabinetNum">
                  <el-input :disabled="true" v-model="item.endCabinetNum" clearable @blur="inputBlur(rowIndex)">
                  </el-input>
                </el-form-item>
              </el-form>
            </span>
          </div>
        </template>
      </vxe-column>
      <vxe-column field="endCartonNum">
        <template #header="{ row }">
          <span>入库箱号</span>
          <el-tooltip class="item" effect="light" content="当前为预箱号，确认入库后在详情中查看正式箱号" placement="bottom">
            <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
          </el-tooltip>
        </template>
        <template #default="{ row, rowIndex }">
          <div class="input_box">
            <span v-for="item in row.confirmDataVos" :key="item">
              <el-form :model="item" :rules="rules" :ref="`endCartonNum_${rowIndex}_${item.index}`"
                style="display: flex" @submit.native.prevent>
                <el-form-item prop="endCartonNum">
                  <el-input v-model="item.endCartonNum" clearable @blur="inputBlur(rowIndex)"> </el-input>
                </el-form-item>
              </el-form>
            </span>
          </div>
        </template>
      </vxe-column>
      <vxe-column field="singleCartonCount" title="单箱数量(PCS)">
        <template #default="{ row, rowIndex }">
          <div class="input_box">
            <span v-for="item in row.confirmDataVos" :key="item">
              <el-form :model="item" :rules="rules" :ref="`singleCartonCount_${rowIndex}_${item.index}`"
                style="display: flex" @submit.native.prevent>
                <el-form-item prop="singleCartonCount">
                  <el-input v-model="item.singleCartonCount" clearable @blur="inputBlur(rowIndex)">
                  </el-input>
                </el-form-item>
              </el-form>
            </span>
          </div>
        </template>
      </vxe-column>
      <vxe-column title="尺寸（cm）" align="center" width="300px">
        <template #default="{ row, rowIndex }">
          <div class="input_box">
            <span v-for="item in row.confirmDataVos" :key="item.index" style="display: flex">
              <!-- 调拨柜号_调拨箱号_index -->
              <el-form :model="item" :rules="rules" :ref="`lwh_${rowIndex}_${item.index}`" style="display: flex"
                @submit.native.prevent>
                <el-form-item prop="length">
                  <span> 长 </span><span>
                    <el-input v-model="item.length" style="width: 60px" @change="inputBlur(rowIndex)"
                      @blur="inputBlur(rowIndex)"></el-input>
                  </span>
                </el-form-item>
                <el-form-item prop="width">
                  <span style="margin-left: 5px"> 宽 </span><span>
                    <el-input v-model="item.width" style="width: 60px" @change="inputBlur(rowIndex)"
                      @blur="inputBlur(rowIndex)"></el-input>
                  </span>
                </el-form-item>
                <el-form-item prop="height">
                  <span style="margin-left: 5px"> 高 </span><span>
                    <el-input v-model="item.height" style="width: 60px" @change="inputBlur(rowIndex)"
                      @blur="inputBlur(rowIndex)"></el-input>
                  </span>
                </el-form-item>
              </el-form>
            </span>
          </div>
        </template>
      </vxe-column>
      <vxe-column align="center" width="80">
        <template #header="{ row, rowIndex }">
          <span>操作</span>
          <el-tooltip class="item" effect="light" content="可增加箱子或删除箱子" placement="bottom">
            <i class="el-icon-warning-outline" style="margin-left: 5px"></i>
          </el-tooltip>
        </template>
        <template #default="{ row, rowIndex }">
          <div class="input_box">
            <span v-for="(item, i) in row.confirmDataVos" :key="item.index">
              <el-button @click="onAdd(rowIndex)" type="primary" text v-if="i == 0">增 加</el-button>
              <el-button @click="onDelete(rowIndex, item.id)" type="primary" text v-if="i != 0" style="color: red">删
                除</el-button>
            </span>
          </div>
        </template>
      </vxe-column>
    </vxe-table>
    <!-- 修改柜号 -->
    <UpdateCabinetNum ref="UpdateCabinetNumRef"></UpdateCabinetNum>
    <!-- 整单修改尺寸 -->
    <ChangeAll ref="ChangeAllRef"></ChangeAll>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick } from "vue";
import UpdateCabinetNum from "./UpdateCabinetNum.vue";
import ChangeAll from "./ChangeAll.vue";
export default {
  name: "StraightWarehouse",
  components: { UpdateCabinetNum, ChangeAll },
  setup(prop, ctx) {
    const data = reactive({
      btnLoading: false,
      selectList: [],
      rowInfo: {},
      //调拨单号
      transferCode: "",
      tableData: [],
      options: [],
      tempRow: [],
      rules: {
        endCartonNum: [
          { required: true, message: "请输入", trigger: "change" },
          { pattern: /^[1-9][0-9]{0,5}$/, message: "格式错误", trigger: "change" },
        ],
        singleCartonCount: [
          { required: true, message: "请输入", trigger: "change" },
          { pattern: /^[1-9][0-9]{0,3}$/, message: "格式错误", trigger: "change" },
          {
            validator: (rule, value, callback) => {
              let flag = value > data.tempRow.receiptNum;
              if (flag) {
                callback(new Error("大于收货数量"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          },
        ],
        length: [
          { required: true, message: "请输入", trigger: "change" },
          { pattern: /^[1-9][0-9]{0,2}$/, message: "格式错误", trigger: "change" },
        ],
        width: [
          { required: true, message: "请输入", trigger: "change" },
          { pattern: /^[1-9][0-9]{0,2}$/, message: "格式错误", trigger: "change" },
        ],
        height: [
          { required: true, message: "请输入", trigger: "change" },
          { pattern: /^[1-9][0-9]{0,2}$/, message: "格式错误", trigger: "change" },
        ],
      },
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const getMsg = (res) => {
      data.rowInfo = res.detailVo;
      data.transferCode = res.detailVo.transferCode;
      data.tableData = res.skuVos;
      data.tableData.map((item) => {
        item.errorMsg = false;
        item.confirmDataVos.map((ite, i) => {
          ite.index = i;
          ite.endCartonNum = ite.endCartonNum == -1 ? null : ite.endCartonNum;
          ite.singleCartonCount = ite.singleCartonCount == -1 ? null : ite.singleCartonCount;
          ite.length = ite.length == -1 ? null : ite.length;
          ite.width = ite.width == -1 ? null : ite.width;
          ite.height = ite.height == -1 ? null : ite.height;
        });
      });
    };
    //循环校验列表
    const validateList = () => {
      setTimeout(() => {
        data.tableData.forEach((row, rowIndex) => {
          data.tempRow = row;
          row.confirmDataVos.forEach((item) => {
            if (vue.$refs[`endCartonNum_${rowIndex}_${item.index}`]) {
              vue.$refs[`endCartonNum_${rowIndex}_${item.index}`][0].validate();
            }
            if (vue.$refs[`singleCartonCount_${rowIndex}_${item.index}`]) {
              vue.$refs[`singleCartonCount_${rowIndex}_${item.index}`][0].validate();
            }
            if (vue.$refs[`lwh_${rowIndex}_${item.index}`]) {
              vue.$refs[`lwh_${rowIndex}_${item.index}`][0].validate();
            }
          });
        }, 0);
      });
    };

    //关闭弹窗
    const closed = () => {
      data.tableData = [];
    };

    //增加时
    const onAdd = (rowIndex) => {
      data.tempRow = data.tableData[rowIndex];
      //调接口增加
      api.requisitionManagement
        .saveTransfeToTransfe({ id: data.tableData[rowIndex].confirmDataVos[0].id })
        .then((res) => {
          if (res.code == 200) {
            let info = res.data;
            data.tableData[rowIndex].confirmDataVos.push(info);
            data.tableData.map((item) => {
              item.confirmDataVos.map((ite, i) => {
                ite.index = i;
                ite.endCartonNum = ite.endCartonNum == -1 ? null : ite.endCartonNum;
                ite.singleCartonCount = ite.singleCartonCount == -1 ? null : ite.singleCartonCount;
                ite.length = ite.length == -1 ? null : ite.length;
                ite.width = ite.width == -1 ? null : ite.width;
                ite.height = ite.height == -1 ? null : ite.height;
              });
            });
            inputBlur(rowIndex)
          } else {
            vue.$message.warning(res.msg);
          }
        })
        .catch(() => { });
      //   validateList();
    };

    //删除
    const onDelete = (rowIndex, id) => {
      //调接口删除
      api.requisitionManagement
        .delTransfeToTransfe({ infoId: id, transferCode: data.transferCode })
        .then((res) => {
          if (res.code == 200) {
            data.tableData[rowIndex].confirmDataVos.map((item, index) => {
              if (item.id == id) {
                data.tableData[rowIndex].confirmDataVos.splice(index, 1);
                inputBlur(rowIndex)
              }
            });
          } else {
            vue.$message.warning(res.msg);
          }
        })
        .catch(() => { });
    };
    const inputBlur = (rowIndex) => {
      data.tempRow = data.tableData[rowIndex];
      let num = 0;
      data.tableData[rowIndex].confirmDataVos.forEach((ite) => {
        num += ite.singleCartonCount - 0;
      });
      if (num !== data.tempRow.receiptNum) {
        data.tableData[rowIndex].errorMsg = true;
      } else {
        data.tableData[rowIndex].errorMsg = false;
      }
    };
    const validateMethods = ref([]);

    const validateMethod = (successMethods) => {
      validateMethods.value = [];
      data.tableData.forEach((row, rowIndex) => {
        data.tempRow = data.tableData[rowIndex];
        row.confirmDataVos.forEach((item) => {
          if (vue.$refs[`endCartonNum_${rowIndex}_${item.index}`] && vue.$refs[`endCartonNum_${rowIndex}_${item.index}`][0]) {
            validateMethods.value.push(vue.$refs[`endCartonNum_${rowIndex}_${item.index}`][0].validate());
          }
          if (vue.$refs[`singleCartonCount_${rowIndex}_${item.index}`] && vue.$refs[`singleCartonCount_${rowIndex}_${item.index}`][0]) {
            validateMethods.value.push(vue.$refs[`singleCartonCount_${rowIndex}_${item.index}`][0].validate());
          }
          if (vue.$refs[`lwh_${rowIndex}_${item.index}`] && vue.$refs[`lwh_${rowIndex}_${item.index}`][0]) {
            validateMethods.value.push(vue.$refs[`lwh_${rowIndex}_${item.index}`][0].validate());
          }
        });
      });

      Promise.all(validateMethods.value)
        .then(() => {
          if (successMethods) {
            //判断装箱数量和收货数量是否一致
            let flag = true;
            data.tableData.forEach((item) => {
              let num = 0;
              item.confirmDataVos.forEach((ite) => {
                num += ite.singleCartonCount - 0;
              });
              if (num !== item.receiptNum) {
                flag = false;
                item.errorMsg = true;
              }
            });
            if (flag) {
              successMethods();
            } else {
              vue.$message.warning("装箱数量和收货数量不一致，红字已标识错误数据，请检查 ");
            }
          }
        })
        .catch((error) => {
          console.log(error);
          vue.$message.error("表单填写有误,请检查");
        });
    };

    //修改柜号
    const changeCabinetNum = () => {
      if (data.selectList.length) {
        saveData(() => {
          vue.$refs.UpdateCabinetNumRef.openDialog(data.selectList, data.rowInfo, data.transferCode);
        });
      } else {
        vue.$message.warning(`请选择需修改柜号的数据`);
      }
    };

    //整单修改柜号
    const changeAllCabinetNum = () => {
      saveData(() => {
        vue.$refs.UpdateCabinetNumRef.openDialog("", data.rowInfo, data.transferCode);
      });
    };
    //整单修改尺寸
    const changeAll = () => {
      saveData(() => {
        vue.$refs.ChangeAllRef.openDialog(data.transferCode);
      });
    };

    //暂存
    const saveData = (fun) => {
      let obj = { confirmDataVos: [], transferCode: "" };
      data.tableData.forEach((item) => {
        obj.confirmDataVos.push(...item.confirmDataVos);
      });
      obj.transferCode = data.tableData[0].transferCode;
      api.requisitionManagement.saveConfirm(obj).then((res) => {
        if (res.code == 200) {
          fun();
        } else {
          vue.$message.warning(res.msg);
        }
      });
    };

    //勾选事件
    const selectChangeEvent = (vo) => {
      data.selectList = vo.records;
    };

    //提交数据
    const submitData = () => {
      return data.tableData;
    };
    const refData = toRefs(data);
    return {
      ...refData,
      closed,
      getMsg,
      onAdd,
      onDelete,
      inputBlur,
      validateMethod,
      changeCabinetNum,
      changeAllCabinetNum,
      changeAll,
      selectChangeEvent,
      submitData,
    };
  },
};
</script>
<style lang="scss">
#StepSecond {
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

  .TransferToTransfer_operation {
    margin-bottom: 20px;
  }

  ::v-deep .vxe-body--column {
    // display: flex;
    padding: 0;
  }
}
</style>
