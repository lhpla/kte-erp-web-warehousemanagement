<!-- 合同下载 -->
<template>
  <div>
    <el-dialog
      title="合同下载"
      width="60%"
      v-model="contractVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <!-- <div class="table-download">
          <el-button type="primary" size="mini" icon="el-icon-download">批量下载合同</el-button>
        </div> -->
      <el-table
        :header-cell-style="rowClass"
        :data="contractTableData"
        tooltip-effect="dark"
        element-loading-text="加载中"
        v-loading="loading"
        border
      >
        <el-table-column
          prop="fileName"
          label="文件名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="format"
          label="格式"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="number"
          label="顺序"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" align="center" min-width="70px">
          <template #default="scope">
            <el-dropdown class="margin-left">
              <el-button size="mini" type="text" icon="el-icon-arrow-down"
                >下载</el-button
              >
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    @click="contractDownload(scope.row, 'contract', 'docx')"
                    >DOCX</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click="contractDownload(scope.row, 'contract', 'pdf')"
                    >PDF</el-dropdown-item
                  >
                  <!-- <el-dropdown-item v-if="scope.row.number == 1" @click="contractDownload(scope.row, 'contract', 'xlsx')">XLSX</el-dropdown-item> -->
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <el-button
              v-if="scope.row.requestId == -1"
              size="mini"
              type="text"
              icon="el-icon-refresh"
              @click="updateContract"
              >更新</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" @click="contractVisible = false" :loading="btnFlag">取 消</el-button>
          <el-button type="primary" size="mini" @click="contractDownload('', 'all')" :loading="btnFlag">下载全部</el-button>
        </span>
      </template> -->
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
} from "vue";
import tablePage from "@/compositionApi/tablePage";
export default {
  name: "ContractDownload",
  setup(prop, ctx) {
    const { rowClass, downloadTemplate, dataService } = tablePage();
    const data = reactive({
      contractVisible: false,
      contractTableData: [],
      downList: [],
      contractId: "",
      //按钮loing //---这里不进行loding处理 否则时间成本太大
      btnFlag: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    dataService.value = "financial";
    // 获取信息 弹窗
    const getMsg = (contractId) => {
      data.contractVisible = true;
      data.contractId = contractId;
      getContractDownDetail(data.contractId);
    };
    //获取列表信息
    const getContractDownDetail = (contractId) => {
      data.contractTableData = [];
      api.financial
        .getContractDownDetail({ contractId: contractId })
        .then((res) => {
          if (res.code == 200) {
            data.contractTableData = res.data;
          }
        });
    };

    // 下载文件
    const contractDownload = (row, type, format) => {
      let msg = {
        downloadType: "",
        contractId: data.contractId,
        requestId: row && row.requestId !== -1 ? row.requestId : "",
        fileType: format,
        orderCode:row.orderCode ? row.orderCode : ''
      };
      if (row && row.requestId !== -1) {
        msg.downloadType = "payment";
        msg.orderCode = row.orderCode;
      } else if (row && row.requestId == -1) {
        msg.downloadType = "contract";
      } else {
        msg.downloadType = type;
      }
      if (!msg.requestId) {
        delete msg.requestId;
      }
      downloadTemplate("downloadContract", row.fileName, msg, "." + format);
      // downloadTemplate("downloadContract", downloadType == "all" ? "全部合同" : row.fileName, msg, downloadType == "all" ? ".zip" : "." + row.format.toLowerCase());
    };
    //更新合同
    const updateContract = () => {
      api.financial
        .modifyContract({ contractId: data.contractId })
        .then((res) => {
          if (res.code == 200) {
            vue.$message.success(res.msg);
            data.contractId = res.data;
            getContractDownDetail(data.contractId);
          } else {
            vue.$message.warning(res.msg);
          }
        });
    };

    const refData = toRefs(data);
    return {
      ...refData,
      getMsg,
      rowClass,
      contractDownload,
      updateContract,
    };
  },
};
</script>
<style scoped lang="scss">
.table-download {
  float: right;
  margin-bottom: 10px;
}
</style>
