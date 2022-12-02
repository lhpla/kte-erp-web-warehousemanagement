<!-- 质检列表 表格 -->
<template>
  <div id="QualityInspectionListTable">
    <el-table v-loading="tableLoading" height="calc(100vh - 230px)" :data="tableData" border style="width: 100%"
      :header-cell-style="{
        background: '#fafafa',
        color: '#2d2f30',
        fontWeight: 'bold',
        fontSize: '12px',
      }">
      <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
      <el-table-column label="PO号" prop="orderCode" min-width="100"></el-table-column>
      <el-table-column label="供应商" prop="supplierName" min-width="110"></el-table-column>
      <el-table-column label="仓区" prop="productWarehouseNames" min-width="140">
        <template #default="scope">
          <div v-if="scope.row.productWarehouseNames.length">
            <span>{{ scope.row.productWarehouseNames[0] }}</span>
            <el-popover placement="right" trigger="hover" v-if="scope.row.productWarehouseNames.length > 1">
              <template #reference>
                <i style="
                    padding-left: 5px;
                    cursor: pointer;
                  ">...</i>
              </template>
              <div class="purposeWarehouse">
                {{ scope.row.productWarehouseName }}
              </div>
            </el-popover>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="物流号" prop="logisticsNum" min-width="170"></el-table-column>
      <el-table-column label="签收批次" prop="receiptBatchNum" min-width="100">
        <template #default="scope">
          {{ scope.row.receiptBatchNum ? scope.row.receiptBatchNum : "-" }}
        </template>
      </el-table-column>
      <el-table-column label="签收箱数" prop="casesNum">
        <template #default="scope">
          {{ scope.row.casesNum ? scope.row.casesNum : "-" }}
        </template>
      </el-table-column>
      <el-table-column label="质检" prop="isCheck" min-width="50px">
        <template #default="scope">
          <div>
            {{ scope.row.isCheck ? "是" : "否" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="采购员" prop="buyer"></el-table-column>
      <el-table-column label="质检员" prop="qualityUserName">
        <template #default="scope">
          {{ scope.row.qualityUserName ? scope.row.qualityUserName : "-" }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="qualityStatus">
        <template #default="scope">
          <div v-if="scope.row.qualityStatus">
            {{
            tableTypeComputed(
            quality_inspection_status,
            scope.row.qualityStatus
            )
            }}
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="签收时间" prop="signTime">
        <template #default="scope">
          {{ scope.row.signTime ? scope.row.signTime : "-" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" text v-if="buttonAuthor.view" @click="openView(scope.row)">
            查看</el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <QualityInspectionLisDetail ref="QualityInspectionLisDetail"></QualityInspectionLisDetail>
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
} from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import QualityInspectionLisDetail from "./QualityInspectionLisDetail";
import { localGet } from "@/utils/util";
export default {
  name: "QualityInspectionListTable",
  props: ["tableData", "tableLoading"],
  components: { QualityInspectionLisDetail },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      receipt_status: [],
      purchaseDict: [],
      quality_inspection_status: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      data.quality_inspection_status = localGet("purchaseDict")
        .quality_inspection_status
        ? localGet("purchaseDict").quality_inspection_status
        : [];
      data.purchaseDict = localGet("purchaseDict")
        ? localGet("purchaseDict")
        : [];
      // data.receipt_status = data.purchaseDict.receipt_status ? data.purchaseDict.receipt_status : [];
    });

    const refData = toRefs(data);
    const openView = (row) => {
      let msg = {
        isQuality: true,
        logisticsNum: row.logisticsNum,
        orderCode: row.orderCode,
      };
      vue.$refs.QualityInspectionLisDetail.getMsg(msg);
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
      openView,
      buttonAuthor,
      tableTypeComputed,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
