<!-- 库存流水表格 -->
<template>
  <div id="inventoryFlowTable">
    <div class="table-box">
      <div class="table-header">
        <el-button type="primary" size="small"  v-if="buttonAuthor.export" @click="exportSerial">流水数据导出</el-button>
      </div>
    </div>
    <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%" height="calc(100vh - 295px)"
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }">
      <el-table-column label="SKU" align="center" prop="sku">
        <template #default="scope">
          <div>{{ scope.row.sku ? scope.row.sku : "-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="仓库" align="center" prop="warehouse">
        <template #default="scope">
          <div>{{ scope.row.warehouse ? scope.row.warehouse : "-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="采购在途" align="center" prop="purTransit">
        <template #default="scope">
          <div>{{ scope.row.purTransit ? scope.row.purTransit : "-" }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="待质检" align="center" prop="collectionName">
        <template #default="scope">
          <div>{{ scope.row.qualityInspection ? scope.row.qualityInspection : "-" }}</div>
        </template>
      </el-table-column> -->
      <el-table-column label="待上架" align="center" prop="putShelf">
      </el-table-column>
      <el-table-column label="待出库" align="center" prop="forOutOfLibrary">
      </el-table-column>
      <el-table-column label="出库数量"  align="center" prop="outLibraryChange">
      </el-table-column>
      <!-- <el-table-column label="异常数量" align="center" prop="abnormalQuantity">
        <template #default="scope">
          <div>{{ scope.row.abnormalQuantity ? scope.row.abnormalQuantity : "-" }}</div>
        </template>
      </el-table-column> -->
      <el-table-column label="库存变更" align="center" prop="stockChange">
      </el-table-column>
      <el-table-column label="库存数量" align="center" prop="inventory">
      </el-table-column>
      <el-table-column label="类型" align="center" prop="inventoryOperateType">
        <template #default="scope">
          <div>{{ scope.row.inventoryOperateType ? scope.row.inventoryOperateType : "-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" prop="createUserName">
        <template #default="scope">
          <div>{{ scope.row.createUserName ? scope.row.createUserName : "-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center" prop="createTime">
        <template #default="scope">
          <div style="text-align: left">{{ scope.row.createTime ? scope.row.createTime : "-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="批次号" align="center" prop="purOrderCode">
        <template #default="scope">
          <div v-if="scope.row.purOrderCode">
            {{ scope.row.purOrderCode }}
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="关联单号" align="center" prop="relatedNumber">
        <template #default="scope">
          <div v-if="scope.row.relatedNumber">
            单号:{{ scope.row.relatedNumber }}
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
     
    </el-table>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import { download } from "@/utils/util";
export default {
  name: "inventoryFlowTable",
  props: ["tableLoading", "tableData", 'searchMsg'],
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({

    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const getTableData = inject("getTableData");
    const refData = toRefs(data);
    //导出库存流水
    const exportSerial = () => {
      api.warehouse.exportSerial(vue.$props.searchMsg).then(res => {
        let tempName = "库存流水数据";
        let fileType = ".xlsx";
        const blob = new Blob([res], {
          // type: "application/msword;charset=UTF-8",
        });
        if ("msSaveOrOpenBlob" in navigator) {
          window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
          return;
        }
        const blobUrl = window.URL.createObjectURL(blob);
        download(blobUrl, tempName, fileType);
      })
    }
    return {
      ...refData,
      buttonAuthor,
      exportSerial
    };
  }
};
</script>
<style scoped lang="scss">

</style>
