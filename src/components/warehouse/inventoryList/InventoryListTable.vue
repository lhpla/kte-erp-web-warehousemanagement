<!-- 库存 表格 -->
<template>
  <div id="InventoryListTable">
    <div class="table-box">
      <div class="table-header">
        <el-button type="primary" size="small" @click="downloadQueue" v-if="buttonAuthor.downloadQueue"
          style="margin-right: 5px;">下载队列</el-button>
        <el-dropdown>
          <el-button type="primary" size="small" :disabled="btnloading">导出库存数据<el-icon class="el-icon--right">
              <ElArrowDown />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="excelExport" v-if="buttonAuthor.excelExport">导出汇总数据</el-dropdown-item>
              <el-dropdown-item @click="exportInventoryDetail" v-if="buttonAuthor.exportInventoryDetail">导出明细数据
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

      </div>
    </div>
    <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%" height="calc(100vh - 230px)"
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }">
      <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
      <el-table-column label="产品信息">
        <template #default="scope">
          <div>SKU：{{ scope.row.sku ? scope.row.sku : "-" }}</div>
          <div>产品名称:{{ scope.row.productCname ? scope.row.productCname : "-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="国内仓库" prop="domesticWarehouse"></el-table-column>
      <el-table-column label="目的仓库" prop="foreignWarehouse"></el-table-column>
      <el-table-column label="运输方式" prop="transportMode"></el-table-column>
      <el-table-column label="采购在途" prop="transitNum">
        <template #default="scope">
          <span :class="scope.row.transitNum ? 'textColor' : ''" @click="getTransitOrderCode(scope.row)">{{
              scope.row.transitNum
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="待质检" prop="qualityInspectionNum"></el-table-column>
      <!-- <el-table-column label="待上架" prop="putShelfNum"></el-table-column> -->
      <el-table-column label="库存" prop="inventory"></el-table-column>
      <el-table-column label="待出库" prop="forOutOfLibrary"></el-table-column>
      <el-table-column label="出库" prop="outOfLibrary"></el-table-column>
      <el-table-column label="时间">
        <template #default="scope">
          <div>创建：{{ scope.row.createTime ? scope.row.createTime : "-" }}</div>
          <div>更新：{{ scope.row.updateTime ? scope.row.updateTime : "-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="70px">
        <template #default="scope">
          <el-button type="primary" text v-if="buttonAuthor.log" @click="openLog(scope.row)">日志</el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <InventoryListLog ref="InventoryListLog"></InventoryListLog>
    <!-- 下载队列 -->
    <DownListTable ref="DownListTableRef"></DownListTable>
    <TransitOrderCode ref="TransitOrderCodeRef"></TransitOrderCode>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick } from "vue";
import InventoryListLog from "./InventoryListLog.vue";
import DownListTable from "./DownListTable.vue"
import { parseTime } from "@/utils/util";
import authorButtons from "@/compositionApi/authorButtons";
import TransitOrderCode from "./TransitOrderCode.vue";
export default {
  name: "InventoryListTable",
  props: ["tableData", "tableLoading", "searchMsg"],
  components: { InventoryListLog, DownListTable, TransitOrderCode },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      btnloading: false
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const refData = toRefs(data);
    // 打开日志
    const openLog = row => {
      vue.$refs.InventoryListLog.getMsg(row.id);
    };
    //下载队列
    const downloadQueue = () => {
      vue.$refs.DownListTableRef.getMsg()
    }
    //获取在途采购单
    const getTransitOrderCode = (row) => {
      if (row.transitNum) {
        nextTick(() => {
          vue.$refs.TransitOrderCodeRef.openDialog(row)
        })
      }
    }
    //库存明细导出
    const exportInventoryDetail = () => {
      const time = new Date()
      let info = {
        downloadType: true,
        fileName: parseTime(time, '{y}-{m}-{d}'),
        query: prop.searchMsg
      }
      data.btnloading = true
      api.warehouse
        .exportInventoryDetail(info)
        .then((res) => {
          if (res.code == 200) {
            vue.$message.success(res.msg);
          } else {
            vue.$message.warning(res.msg);
          }
          data.btnloading = false
        }).catch(() => {
          data.btnloading = false
        });
    }
    //导出库存数据
    const excelExport = () => {
      const time = new Date()
      let info = {
        downloadType: true,
        fileName: parseTime(time, '{y}-{m}-{d}'),
        query: prop.searchMsg
      }
      data.btnloading = true
      api.warehouse
        .exportInventoryData(info)
        .then((res) => {
          if (res.code == 200) {
            vue.$message.success(res.msg);
          } else {
            vue.$message.warning(res.msg);
          }
          data.btnloading = false
        }).catch(() => {
          data.btnloading = false
        });
    };
    return {
      ...refData,
      openLog,
      buttonAuthor,
      downloadQueue,
      excelExport,
      exportInventoryDetail,
      getTransitOrderCode
    };
  },
};
</script>
<style scoped lang="scss">
#InventoryListTable {
  .textColor {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
