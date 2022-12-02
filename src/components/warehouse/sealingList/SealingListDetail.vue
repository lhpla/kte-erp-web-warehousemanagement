<!-- 封箱详情 -->
<template>
  <div id="SealingListDetail">
    <el-dialog title="查看封箱详情" v-model="dialogVisible" width="70%" :close-on-click-modal="false"
      :before-close="dialogClose" :close-on-press-escape="false">
      <span v-if="formItem">
        <el-form :model="formItem" ref="formRef" :rules="formRule" :inline="true" label-width="130px"
          class="demo-ruleForm">
          <div>
            <el-form-item label="序列号:">
              {{ formItem.serialNum ? formItem.serialNum : "-" }}
            </el-form-item>

            <el-form-item label="箱号:">
              {{ formItem.cartonNum ? formItem.cartonNum : "-" }}
            </el-form-item>
            <el-form-item label="中转仓库:">
              {{
              formItem.transferWarehouse ? formItem.transferWarehouse : "-"
              }}
            </el-form-item>
            <el-form-item label="仓区:">
              {{ formItem.purposeWarehouse ? formItem.purposeWarehouse : "-" }}
            </el-form-item>
            <el-form-item label="运输方式:">
              {{ formItem.transportMode ? formItem.transportMode : "-" }}
            </el-form-item>

            <el-form-item label="长(cm):" prop="length">
              <el-input v-model="formItem.length" :disabled="!formItem.isAlter" clearable style="width: 100px">
              </el-input>
            </el-form-item>
            <el-form-item label="宽(cm):" prop="width">
              <el-input v-model="formItem.width" :disabled="!formItem.isAlter" clearable style="width: 100px">
              </el-input>
            </el-form-item>
            <el-form-item label="高(cm):" prop="height">
              <el-input v-model="formItem.height" :disabled="!formItem.isAlter" clearable style="width: 100px">
              </el-input>
            </el-form-item>
          </div>
        </el-form>

        <div class="table-box">
          <div class="table-header">
            <el-button type="primary" size="small" @click="updateCartonNum" :disabled="!formItem.isAlter">修改箱子
            </el-button>
            <el-button type="primary" size="small" @click="printAllCartonNum">打印箱号</el-button>
            <el-dropdown class="margin-left">
              <el-button type="primary" size="small">
                打印条码
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="printSkuAllClick('4px')">4PX</el-dropdown-item>
                  <el-dropdown-item @click="printSkuAllClick('谷仓')">谷仓</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <!-- <el-button type="primary" size="mini" @click="printSkuAllClick">打印条码</el-button> -->
          </div>
        </div>

        <el-table :data="formItem.skuVos" border style="width: 100%" :header-cell-style="{
          background: '#fafafa',
          color: '#2d2f30',
          fontWeight: 'bold',
          fontSize: '12px',
        }" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
          <el-table-column label="SKU" prop="sku"></el-table-column>
          <el-table-column label="图片">
            <template #default="scope">
              <span v-if="scope.row.picturePath">
                <el-popover placement="right" trigger="hover" width="250">
                  <template #reference>
                    <el-image style="width: 110px; height: 95px" fit="contain" :src="scope.row.picturePath"></el-image>
                  </template>
                  <el-image :src="scope.row.picturePath" style="width: 400px; height: 300px" fit="contain"></el-image>
                </el-popover>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="批次号" prop="orderCode">
            <template #default="scope">
              {{ scope.row.orderCode ? scope.row.orderCode : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="采购数量" prop="encasementNum"></el-table-column>
          <el-table-column label="是否质检">
            <template #default="scope">
              <div>{{ scope.row.isQuality ? "是" : "否" }}</div>
            </template>
          </el-table-column>
          <el-table-column label="尺寸(cm)" prop="number">
            <template #default="scope">
              {{
              scope.row["length"] +
              "*" +
              scope.row.width +
              "*" +
              scope.row.height
              }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" align="center" min-width="70px">
            <template #default="scope">
              <el-button size="mini" type="text" @click="editView(scope.row)">调拨</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" :loading="btnFlag" :disabled="btnFlag" @click="dialogClose">取 消</el-button>
          <el-button type="primary" size="small" :loading="btnFlag" :disabled="btnFlag" @click="allSubmit">确 定
          </el-button>
        </span>
      </template>

      <SealingTransfers ref="SealingTransfers"></SealingTransfers>
      <SealingEditCartonNum ref="SealingEditCartonNum"></SealingEditCartonNum>
      <!-- 打印条码 -->
      <SealingSkuNumEdit ref="SealingSkuNumEdit"></SealingSkuNumEdit>
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
  provide,
} from "vue";
import SealingTransfers from "./SealingTransfers.vue";
import SealingEditCartonNum from "./SealingEditCartonNum.vue";
import SealingSkuNumEdit from "./SealingSkuNumEdit.vue";
import { getLodop } from "@/utils/LodopFuncs";
export default {
  name: "SealingListDetail",
  components: { SealingTransfers, SealingEditCartonNum, SealingSkuNumEdit },
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      btnFlag: false,
      formItem: {},
      formRule: {
        length: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,
            message: "格式错误",
          },
        ],
        width: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,
            message: "格式错误",
          },
        ],
        height: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,
            message: "格式错误",
          },
        ],
        cartonNum: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      selectList: [],
      msg: "",
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const refData = toRefs(data);
    // 获取信息
    const getMsg = (msg) => {
      data.dialogVisible = true;
      data.msg = msg;
      getWarehouseCasesDetail();
    };

    //获取详情
    const getWarehouseCasesDetail = () => {
      api.warehouse.warehouseCasesDetail(data.msg).then((res) => {
        if (res.code == 200) {
          data.formItem = res.data;
        }
      });
    };
    provide("getWarehouseCasesDetail", getWarehouseCasesDetail);

    // 关闭
    const dialogClose = () => {
      data.dialogVisible = false;
      if (formRef.value) {
        formRef.value.clearValidate();
        formRef.value.resetFields();
      }
    };
    provide("dialogClose", dialogClose);
    //点击修改
    const editView = (row) => {
      let msg = {
        sku: row.sku,
        encasementNum: row.encasementNum,
        oldSerialNum: data.formItem.serialNum,
        overseasWarehouseId: data.formItem.purposeWarehouseId,
        warehouseId: data.formItem.transferWarehouseId,
        transportMode: data.formItem.transportMode
          ? data.formItem.transportMode
          : "",
      };
      vue.$refs.SealingTransfers.getMsg(msg);
    };

    const getTableData = inject("getTableData");

    const formRef = ref(null);

    // 确定
    const allSubmit = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          data.btnFlag = true;
          let msg = {
            height: Number(data.formItem.height),
            length: Number(data.formItem.length),
            width: Number(data.formItem.width),
            serialNum: data.formItem.serialNum,
          };
          api.warehouse
            .updateSize(msg)
            .then((res) => {
              if (res.code == 200) {
                vue.$message.success({
                  message: res.msg,
                  type: "success",
                });
                getTableData();
                dialogClose();
                data.btnFlag = false;
              } else {
                vue.$message.warning({
                  message: res.msg,
                  type: "warning",
                });
                data.btnFlag = true;
              }
            })
            .catch((e) => {
              data.btnFlag = true;
            });
        }
      });
    };
    // 列表选择
    const handleSelectionChange = (val) => {
      data.selectList = val;
    };
    //打印全部箱号
    const printAllCartonNum = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          if (data.selectList.length < 1) {
            vue.$message({
              message: "至少选择一条信息!",
              type: "warning",
            });
          } else {
            let LODOP = getLodop();
            if (typeof LODOP == "string") {
              vue.$message.warning({
                dangerouslyUseHTMLString: true,
                message: LODOP,
              });
              return;
            }
            let datas = [];
            for (let item of data.selectList) {
              let arr = {
                cartonNum: data.formItem.cartonNum,
                encasementNum: item.encasementNum,
                num: 1,
                sku: "200-" + item.sku,
                warehouse:
                  data.formItem.transferWarehouse.indexOf("TS") != -1
                    ? data.formItem.purposeWarehouse + "-TS"
                    : data.formItem.purposeWarehouse,
                cabinetNum: data.formItem.cabinetNum,
                drawback: item.drawback ? "是" : "-",
                isPhoto: item.isPhoto ? "【拍照】" : "",
              };
              datas.push(arr);
            }
            vue.$printFn(LODOP, datas, "cartonNum");
          }
        }
      });
    };

    //打印所有sku
    const printSkuAllClick = type => {
      formRef.value.validate((valid) => {
        if (valid) {
          if (data.selectList.length < 1) {
            vue.$message({
              message: "至少选择一条信息!",
              type: "warning",
            });
          } else {
            let datas = {
              sku: [],
            };
            if (type == '4px') {//4px
              let arr = []
              for (let item of data.selectList) {
                if (item.printSkuId && item.customerCode) {
                  datas.sku.push({
                    sku: item.sku,
                    productEname: item.productEname,
                    num: item.encasementNum,
                    skuId: item.printSkuId,
                    customerCode: item.customerCode + '-' + item.sku
                  });
                } else {
                  arr.push(item.sku)
                }
              }
              if (arr.length > 0) {
                vue.$message.warning('递四方不存在对应的sku：' + arr)
                return
              }
            } else {//谷仓
              for (let item of data.selectList) {
                datas.sku.push({
                  sku: "200-" + item.sku,
                  productEname: item.productEname,
                  num: item.encasementNum,
                  encasementNum: item.encasementNum,
                });
              }
            }
            vue.$refs.SealingSkuNumEdit.getMsg(datas, type);
          }
        }
      });
    };
    //修改箱号
    const updateCartonNum = () => {
      if (data.selectList.length < 1) {
        vue.$message({
          message: "至少选择一条信息!",
          type: "warning",
        });
      } else {
        let skuList = data.selectList.map((i) => {
          return i.sku;
        });
        let skuIdList = data.selectList.map((i) => {
          return i.skuId;
        });
        vue.$refs.SealingEditCartonNum.getMsg(data.formItem.serialNum, skuList, skuIdList);
      }
    };

    return {
      ...refData,
      dialogClose,
      getTableData,
      getMsg,
      allSubmit,
      formRef,
      editView,
      printAllCartonNum,
      printSkuAllClick,
      handleSelectionChange,
      updateCartonNum,
      getWarehouseCasesDetail,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
