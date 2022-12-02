<!-- 质检详情 -->
<template>
  <div id="QualityInspectionLisDetail">
    <el-dialog title="质检详情" v-model="dialogVisible" width="70%" :close-on-click-modal="false"
      :before-close="handleClose" :close-on-press-escape="false">
      <el-form :model="formItem" :inline="true" label-width="130px" class="demo-ruleForm">
        <div>
          <el-form-item label="物流单号:">
            {{
            formItem.currentLogisticsNum ? formItem.currentLogisticsNum : "-"
            }}
          </el-form-item>

          <el-form-item label="签收时间:">
            {{
            formItem.signTime ? formItem.signTime : "-"
            }}
          </el-form-item>

          <el-form-item label="采购单:">
            {{ formItem.orderCode ? formItem.orderCode : "-" }}
          </el-form-item>

          <el-form-item label="供应商:">
            {{ formItem.supplierName ? formItem.supplierName : "-" }}
          </el-form-item>

          <el-form-item label="质检:">
            <span v-if="formItem.isCheck !== ''">
              {{ formItem.isCheck ? "是" : "否" }}
            </span>
            <span v-else>-</span>
          </el-form-item>

          <el-form-item label="中转仓库:">
            {{ formItem.warehouseName ? formItem.warehouseName : "-" }}
          </el-form-item>
          <el-form-item label="采购员:">
            {{ formItem.buyer ? formItem.buyer : "-" }}
          </el-form-item>
          <el-form-item label="状态:">
            <span v-if="formItem.qualityStatus">{{
            tableTypeComputed(
            quality_inspection_status,
            formItem.qualityStatus
            )
            }}</span>
            <span v-else>-</span>
          </el-form-item>
        </div>

        <div>
          <el-form-item label="对仓备注:">
            {{ formItem.warehouseRemarks ? formItem.warehouseRemarks : "-" }}
          </el-form-item>
        </div>
      </el-form>

      <el-table :data="formItem.warehouseProductVos" border style="width: 100%" :header-cell-style="{
        background: '#fafafa',
        color: '#2d2f30',
        fontWeight: 'bold',
        fontSize: '12px',
      }">
        <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
        <el-table-column label="SKU" prop="sku"></el-table-column>
        <el-table-column label="图片">
          <template #default="scope">
            <span v-if="scope.row.pricturePath">
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
              产品名称:
              {{ scope.row.productCname ? scope.row.productCname : "-" }}
            </div>
            <div>
              规格: {{ scope.row.proVoltage ? scope.row.proVoltage : "-" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="质检" width="60">
          <template #default="scope">
            <span>
              {{ scope.row.isQuality ? "是" : "否" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="采购数量" prop="number"></el-table-column>
        <el-table-column label="收货数量" prop="receiptQuantity"></el-table-column>
        <el-table-column label="质检数量" prop="qualifiedQuantity"></el-table-column>
        <el-table-column label="不合格数量" prop="unqualifiedQuantity"></el-table-column>
        <el-table-column label="收货时间" prop="qualityTime">
          <template #default="scope">
            {{ scope.row.qualityTime ? scope.row.qualityTime : "-" }}
          </template>
        </el-table-column>
      </el-table>
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
} from "vue";
import { localGet, localSet } from "@/utils/util";
export default {
  name: "QualityInspectionLisDetail",
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      formItem: {},
      receipt_status: [],
      quality_inspection_status: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const refData = toRefs(data);
    const getMsg = (msg) => {
      data.receipt_status =
        localGet("purchaseDict") && localGet("purchaseDict").receipt_status
          ? localGet("purchaseDict").receipt_status
          : [];
      data.quality_inspection_status = localGet("purchaseDict")
        .quality_inspection_status
        ? localGet("purchaseDict").quality_inspection_status
        : [];
      data.dialogVisible = true;
      api.warehouse.warehouseReceiptDetail(msg).then((res) => {
        if (res.code == 200) {
          data.formItem = res.data;
        }
      });
    };

    // 关闭
    const handleClose = () => {
      data.dialogVisible = false;
      data.formItem = {};
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
      handleClose,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
