<!-- 普通质检表格 -->
<template>
  <div id="QualityInspectionTable">
    <div class="QualityInspectionTable-expand-box-class">
      <div class="top_button">
        <el-button size="small" type="primary" @click="handleUpdate" v-if="buttonAuthor.edit">修改</el-button>
      </div>

      <el-table ref="tableRef" :data="resData.warehouseProductVos" border height="calc(100vh - 380px)"
        style="width: 100%" @expand-change="expandChange" :expand-row-keys="expands" :row-key="getRowKeys"
        @selection-change="handleSelectionChange" :header-cell-style="{
          background: '#fafafa',
          color: '#2d2f30',
          fontWeight: 'bold',
          fontSize: '12px',
        }">
        <el-table-column type="selection" width="55" />
        <el-table-column width="1" type="expand" class="expand-class">
          <template #default="{ row }">
            <div style="margin-bottom: 10px;">
              <span>SKU备注：</span>
              <span class="skuRemarks">{{ row.skuRemarks ? row.skuRemarks : "-" }}</span>
            </div>
            <span v-show="row.isExpansion">
              <el-table :data="row.childTableData" class="table-expand" border style="width: 100%">
                <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
                <el-table-column prop="sku" label="SKU" min-width="150px">
                  <template #default="scope">
                    {{ scope.row.sku }}
                    <i v-show="scope.row.sku" class="el-icon-document-copy" @click="copyText(scope.row.sku)"></i>
                  </template>
                </el-table-column>
                <el-table-column prop="transferWarehouse" label="中转仓库">
                  <template #default="scope">
                    {{ scope.row.transferWarehouse }}
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="purposeWarehouse" label="仓区">
              <template #default="scope">
                {{ scope.row.purposeWarehouse }}
              </template>
            </el-table-column> -->
                <!-- <el-table-column prop="purposeWarehouse" label="运输方式">
              <template #default="scope">
                {{ scope.row.purposeWarehouse }}
              </template>
            </el-table-column> -->
                <el-table-column prop="purchaseNum" label="采购数量">
                  <template #default="scope">
                    {{ scope.row.purchaseNum }}
                  </template>
                </el-table-column>
                <el-table-column prop="abnormalNum" label="异常数量">
                  <template #default="scope">
                    {{ scope.row.abnormalNum }}
                  </template>
                </el-table-column>
                <el-table-column prop="abnormalType" label="异常类型">
                  <template #default="scope">
                    {{
                    tableTypeComputed(abnormal_new_type, scope.row.abnormalType)
                    }}
                  </template>
                </el-table-column>
                <el-table-column prop="abnormalStatus" label="状态">
                  <template #default="scope">
                    {{
                    tableTypeComputed(abnormal_status, scope.row.abnormalStatus)
                    }}
                  </template>
                </el-table-column>
                <el-table-column prop="" label="操作">
                  <template #default="scope">
                    <span v-show="scope.row.abnormalStatus == 'not_end'">
                      <el-button size="small" type="primary" text @click="dealWith(row, scope.row)">
                        <el-icon>
                          <ElPointer />
                        </el-icon> 二次入库
                      </el-button>
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </span>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50" align="center" label="">
          <template #default="{ row }">
            <div>
              <i v-show="!row.isExpansion" class="el-icon-arrow-right" style="cursor: pointer"
                @click="changeExpand(row, row.index)"></i>
              <i v-show="row.isExpansion" class="el-icon-arrow-down" style="cursor: pointer"
                @click="changeExpand(row, row.index)"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
        <el-table-column label="SKU" prop="sku"></el-table-column>
        <el-table-column label="图片">
          <template #default="scope">
            <span v-show="scope.row.pricturePath">
              <el-popover placement="right" trigger="hover" width="250">
                <template #reference>
                  <el-image style="width: 110px; height: 95px" fit="contain" :src="scope.row.pricturePath"></el-image>
                </template>
                <el-image :src="scope.row.pricturePath" style="width: 400px; height: 300px" fit="contain"></el-image>
              </el-popover>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="产品信息">
          <template #default="scope">
            <div>
              产品名称：
              {{ scope.row.productCname ? scope.row.productCname : "-" }}
            </div>
            <div>
              包装尺寸：
              <span v-if="scope.row.domesticLength||scope.row.domesticWidth||scope.row.domesticHeight">{{
              scope.row.domesticLength }}*{{scope.row.domesticWidth}}*{{scope.row.domesticHeight}}</span>
              <span v-else>-</span>
            </div>
            <div>
              毛重：
              {{ scope.row.grossWeight ? scope.row.grossWeight : "-" }}
            </div>
            <div>
              规格：{{ scope.row.proVoltage ? scope.row.proVoltage : "-" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="质检" width="80">
          <template #default="scope">
            <span>
              {{ scope.row.isQuality ? "是" : "否" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="仓区" prop="warehouse">
          <template #default="scope">
            <div class="purposeWarehouse_content" v-for="item in scope.row.productWarehouseQualityList">
              {{ item.warehouse }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="采购数量" prop="num" width="80">
          <template #default="scope">
            <div class="purposeWarehouse_content" v-for="item in scope.row.productWarehouseQualityList">
              {{ item.num }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="可收货数量" prop="mayReceiptNum" width="110">
          <template #header>
            <div style="display: flex; align-items:center">
              <span>可收货数量</span>
              <el-tooltip class="item" effect="light" content="对应物流号可收货的SKU数量">
                <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
              </el-tooltip>
            </div>
          </template>
          <template #default="scope">
            <div class="purposeWarehouse_content" v-for="item in scope.row.productWarehouseQualityList">
              {{ item.mayReceiptNum }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="收货数量" prop="receiptNum" width="80">
          <template #default="scope">
            <div class="purposeWarehouse_content" v-for="item in scope.row.productWarehouseQualityList">
              {{ item.receiptNum }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="调拨数量" prop="transferNum" width="80">
          <template #default="scope">
            <div class="purposeWarehouse_content" v-for="item in scope.row.productWarehouseQualityList">
              {{ item.transferNum }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="可打印数量" prop="printNum" width="100">
          <template #default="scope">
            <div class="purposeWarehouse_content" v-for="item in scope.row.productWarehouseQualityList">
              {{ item.printNum }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="采购数量" prop="number"></el-table-column>
      <el-table-column label="收货数量" prop="receiptQuantity"></el-table-column>
      <el-table-column label="质检数量" prop="qualifiedQuantity"></el-table-column>
      <el-table-column label="不合格数量" prop="unqualifiedQuantity"></el-table-column> -->
        <el-table-column label="操作" align="center" min-width="70px">
          <template #default="scope">
            <span v-show="calculateQuantity(scope.row.productWarehouseQualityList) > 0">
              <el-button size="small" type="primary" text @click="submitClick(scope.row)"
                v-show="buttonAuthor.submit && !scope.row.receivingStatus">
                <el-icon>
                  <ElCircleCheck />
                </el-icon>
                收货
              </el-button>
              <el-button size="small" type="primary" text
                v-show="scope.row.receivingStatus && buttonAuthor.export" @click="printClick(scope.row)">
                <el-icon>
                  <ElPrinter />
                </el-icon>
                打印
              </el-button>
            </span>
            <span v-show="calculateQuantity(scope.row.productWarehouseQualityList) <= 0">- -</span>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <QualityInspectionCargo ref="QualityInspectionCargo" v-model:activeTag="activeTag"></QualityInspectionCargo>
    <QualityInspectionPrint ref="QualityInspectionPrint">
    </QualityInspectionPrint>
    <UpdateDialog ref="UpdateDialogRef" :logisticsNumCope="logisticsNumCope">
    </UpdateDialog>
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
  watch,
  nextTick,
  provide
} from "vue";
import QualityInspectionCargo from "./QualityInspectionCargo.vue";
import QualityInspectionPrint from "./QualityInspectionPrint.vue";
import authorButtons from "@/compositionApi/authorButtons";
import { localGet, documentCopy } from "@/utils/util";
import UpdateDialog from "./UpdateDialog.vue";

export default {
  name: "QualityInspectionTable",
  props: {
    resData: {
      type: Object,
    },
    sendKeyUpFlag: {
      type: Number,
      default: 1,
    },
    activeTag: {
      type: String,
      default: ""
    },
    logisticsNumCope: {
      type: Object,
      default: ""
    }
  },
  components: { QualityInspectionCargo, QualityInspectionPrint, UpdateDialog },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      casesNum: "",
      logisticsNum: "",
      expands: [],
      abnormal_status: [],
      abnormal_new_type: [],
      selectList: []
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      data.abnormal_new_type =
        localGet("purchaseDict") && localGet("purchaseDict").abnormal_new_type
          ? localGet("purchaseDict").abnormal_new_type
          : [];
      data.abnormal_status =
        localGet("purchaseDict") && localGet("purchaseDict").abnormal_status
          ? localGet("purchaseDict").abnormal_status
          : [];
    });

    watch(
      () => vue.$props.sendKeyUpFlag,
      (val, oldVal) => {
        data.expands = [];
      }
    );

    watch(() => vue.$props.resData, (val) => {
      val.warehouseProductVos.map(item => {
        data.expands.push(item.sku);
      })
    },
      {
        deep: true,
        immediate: true
      })


    const refData = toRefs(data);
    //勾选事件
    const handleSelectionChange = (val) => {
      data.selectList = val
    }
    const receivingStatusList = ref([])
    //修改毛重、包装尺寸
    const handleUpdate = () => {
      receivingStatusList.value = []
      if (vue.$props.resData.warehouseProductVos.length) {
        receivingStatusList.value = data.selectList.length ? data.selectList.filter(e => e.receivingStatus) : vue.$props.resData.warehouseProductVos.filter(e => e.receivingStatus)
        if (receivingStatusList.value.length) {
          nextTick(() => {
            vue.$refs.UpdateDialogRef.openDialog(receivingStatusList.value)
          })
        } else {
          vue.$message.warning('请选择已收货数据')
        }
      }
    }
    //操作完成清除之前所勾选的数据
    const clearSelectList = () => {
      data.selectList = [];
      vue.$refs.tableRef.clearSelection();
    };
    // 点击复制
    const copyText = (text) => {
      documentCopy(text);
    };
    const expandChange = (row, expandedRows) => {
      if (expandedRows.length) {
        data.expands = [];
        if (row) {
          row.childTableData = []
          data.expands.push(row.sku);
          let vo = {
            orderCode: prop.resData.orderCode,
            skus: [row.sku],
          };
          api.warehouse.getQualityAbnormalDetail(vo).then((res) => {
            if (res.code == 200) {
              row.childTableData = res.data;
            }
          });
        }
      } else {
        data.expands = [];
      }
    };

    const changeExpand = (row, rowIndex) => {
      console.log(row.isExpansion, row);
      if (!row.isExpansion) {
        row.childTableData = []
        let vo = {
          orderCode: prop.resData.orderCode,
          skus: [row.sku],
        };
        api.warehouse.getQualityAbnormalDetail(vo).then((res) => {
          if (res.code == 200) {
            row.childTableData = res.data;
          }
        });
      }
      row.isExpansion = !row.isExpansion
    };

    const getRowKeys = (row) => {
      return row.sku;
    };

    // 确认
    const submitClick = (row) => {
      let msg = {
        orderCode: prop.resData.orderCode,
        logisticsNum: prop.resData.currentLogisticsNum,
        productId: row.id,
        isSecondary: false, //是否二次入库
      };
      vue.$refs.QualityInspectionCargo.getMsg(row, msg);
    };

    // 打印
    const printClick = (row) => {
      let msg = {
        orderCode: prop.resData.orderCode,
        sku: row.sku,
      };
      vue.$refs.QualityInspectionPrint.getMsg(msg);
    };

    //处理
    const dealWith = (row, e) => {
      let msg = {
        orderCode: prop.resData.orderCode,
        logisticsNum: prop.resData.currentLogisticsNum,
        productId: row.id,
        abnormalId: e.id,
        abnormalNum: e.abnormalNum,
        isSecondary: true, //是否二次入库
      };
      vue.$refs.QualityInspectionCargo.getMsg(row, msg);
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

    //计算sku下的总可收货数量
    const calculateQuantity = computed(() => {
      return function (list) {
        if (list.length) {
          let num = 0;
          for (let i of list) {
            num += Number(i.mayReceiptNum)
          }
          return num
        }
      }
    })

    return {
      ...refData,
      submitClick,
      printClick,
      buttonAuthor,
      expandChange,
      getRowKeys,
      dealWith,
      tableTypeComputed,
      copyText,
      changeExpand,
      calculateQuantity,
      handleSelectionChange,
      handleUpdate,
      clearSelectList
    };
  },
};
</script>
<style lang="scss">
#QualityInspectionTable {
  .QualityInspectionTable-expand-box-class {
    .el-table__expand-column .cell {
      display: none !important;
    }
  }

  .skuRemarks {
    word-break: break-all;
    word-wrap: break-word;
  }

  .top_button {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
}
</style>
