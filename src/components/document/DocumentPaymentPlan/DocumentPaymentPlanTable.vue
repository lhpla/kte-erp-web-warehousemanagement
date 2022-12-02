<!-- 单证付款计划表格 -->
<template>
  <div id="DocumentPaymentPlanTable">
    <el-table height="calc(100vh - 310px)" :data="tableData" v-loading="tableLoading"
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }" border
      style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="index" align="center" label="#" min-width="40"></el-table-column>
      <el-table-column label="单证付款计划编号" prop="enterWarehouseCode"></el-table-column>
      <el-table-column label="服务商" prop="transferWarehouse"></el-table-column>
      <el-table-column label="费用类别" prop="purposeWarehouse"></el-table-column>
      <el-table-column label="币种" prop="cabinetNum"></el-table-column>
      <!-- <el-table-column label="箱号" prop="warehouseName"></el-table-column> -->
      <el-table-column label="请款金额" prop="provider"></el-table-column>
      <el-table-column label="更新时间" prop="docUserName" v-if="buttonAuthor.isAdministrator"></el-table-column>
      <el-table-column label="付款状态" min-width="90" prop="outboundStatus">
        <template #default="scope">
          <div>
            出库状态:
            <span v-if="scope.row.outboundStatus !== '' && scope.row.outboundStatus">出库</span>
            <span v-else>未出库</span>
          </div>
          <div>
            分配状态:
            <span v-if="scope.row.docUserName">已分配</span>
            <span v-else>未分配</span>
          </div>
          <div>
            单证状态:
            <span v-if="scope.row.docStatus !== '' && scope.row.docStatus">已发送</span>
            <span v-else>处理中</span>
          </div>
          <div>
            审核状态:
            {{ tableTypeComputed(doc_audit_status, scope.row.docAuditStatus) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120" align="center">
        <template #default="scope">
          <el-button size="mini" type="text" @click="selectDocLog(scope.row)">日志</el-button>
          <el-button size="mini" type="text" @click="openPop(scope.row)">详情</el-button>
          <el-button size="mini" type="text" @click="deteleInfo(scope.row)">删除</el-button>
          <el-button size="mini" type="text" @click="urgent(scope.row)" v-if="!scope.row.docStatus">加急</el-button>
          <el-button size="mini" type="text" @click="credentials(scope.row)" v-if="!scope.row.docStatus">付款凭证
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 日志 -->
    <el-dialog title="单证付款计划日志" v-model="logDialogVisible" width="40%" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-table height="calc(100vh - 400px)" :header-cell-style="rowClass" :data="logTableData" tooltip-effect="dark"
        element-loading-text="加载中" v-loading="logLoading" border>
        <el-table-column label="#" type="index" align="center" width="100"></el-table-column>
        <el-table-column prop="message" align="center" label="内容"></el-table-column>
        <el-table-column prop="createUserName" align="center" label="操作人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" align="center" label="修改时间" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 付款凭证 -->
    <el-dialog title="付款凭证" v-model="paymentDialogVisible" width="45%" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="table-header">
        <div class="info">
          请款总金额：
          <span>235665USD</span>
          未付金额:
          <span></span>
        </div>
      </div>
      <el-table height="calc(100vh - 400px)" :header-cell-style="rowClass" :data="paymentTableData"
        tooltip-effect="dark" border>
        <el-table-column prop="message" align="center" label="单证付款计划编号"></el-table-column>
        <el-table-column prop="createUserName" align="center" label="币种" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" align="center" label="已付金额" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" align="center" label="付款时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" align="center" label="付款凭证" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-dialog>
    <DocumentPaymentPlanDetail ref="DocumentPaymentPlanDetail"></DocumentPaymentPlanDetail>
  </div>

</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, nextTick, computed } from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import DocumentPaymentPlanDetail from "./DocumentPaymentPlanDetail.vue"
import { download, localGet } from "@/utils/util";
import { useStore } from "vuex";
export default {
  name: "DocumentPaymentPlanTable",
  props: ["tableData", "tableLoading"],
  components: { DocumentPaymentPlanDetail },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const store = useStore();
    const data = reactive({
      logDialogVisible: false,
      moneyVisible: false,
      logLoading: false,
      paymentDialogVisible: false,
      paymentTableData: [],
      logTableData: [],
      docUserId: "",
      documentList: [], //单证员列表
      money: "",
      selectList: [], //选择列表
      row: "",
      doc_audit_status: [], //审核状态
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      data.doc_audit_status = localGet("purchaseDict") && localGet("purchaseDict").doc_audit_status ? localGet("purchaseDict").doc_audit_status : [];
    });
    const refData = toRefs(data);
    const getTableData = inject("getTableData");
    const tabMenuList = computed(() => store.state.tabMenu.tabMenuList);
    //打开详情
    const openPop = row => {
      vue.$refs.DocumentPaymentPlanDetail.checkInfoDialog(row)
    };

    // 付款凭证
    const credentials = (row) => {
      data.paymentDialogVisible = true
    };
    // 删除
    const deteleInfo = () => {
      vue
        .$confirm("此操作将删除此数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          buttonSize: "small"
        })
        .then(() => {

        })
        .catch(() => {
          vue.$message({
            type: "info",
            message: "已取消修改",
          });
        });
    };
    // 加急取消加急
    const urgent = () => {
      vue
        .$confirm(`此操作将提示财务加急处理, 是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          buttonSize: "small"
        })
        .then(() => {

        })
        .catch(() => {
          vue.$message({
            type: "info",
            message: "已取消修改",
          });
        });
    };

    // 单证确认发送
    // const confirmSendDoc = row => {
    //   vue
    //     .$confirm("此操作将发送单证信息, 是否继续?", "提示", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning",
    //     })
    //     .then(() => {
    //       api.documentList.confirmSendDoc({ id: row.id }).then(res => {
    //         if (res.code == 200) {
    //           vue.$message.success(res.msg);
    //           getTableData();
    //         } else {
    //           vue.$message.warning(res.msg);
    //         }
    //       });
    //     })
    //     .catch(() => {
    //       vue.$message({
    //         type: "info",
    //         message: "已取消修改",
    //       });
    //     });
    // };

    //日志
    const selectDocLog = row => {
      data.logDialogVisible = true
    };

    // 列表选择
    const handleSelectionChange = val => {
      data.selectList = val;
    };

    //草稿下载
    const downloadDeclareMaterial = id => {
      // api.documentList
      //   .downloadDeclareMaterial({ downType: "all", cabinetId: id, isDraft: true })
      //   .then(res => {
      //     data.btnFlag = false;
      //     let tempName = "单证草稿资料";
      //     let fileType = ".zip";
      //     const blob = new Blob([res], {
      //       // type: "application/msword;charset=UTF-8",
      //     });
      //     if ("msSaveOrOpenBlob" in navigator) {
      //       window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
      //       return;
      //     }
      //     const blobUrl = window.URL.createObjectURL(blob);
      //     download(blobUrl, tempName, fileType);
      //   })
      //   .catch(err => {
      //     data.btnFlag = false;
      //   });
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
      buttonAuthor,
      openPop,
      handleSelectionChange,
      selectDocLog,
      tabMenuList,
      store,
      downloadDeclareMaterial,
      tableTypeComputed,
      getTableData,
      credentials,
      deteleInfo,
      urgent
    };
  },
};
</script>
<style scoped lang='scss'>
#DocumentPaymentPlanTable {
  .flex {
    display: flex;
    align-items: center;
  }

  .table-header {
    background: #f5f5f5;
    padding: 10px 20px;
    display: flex;
    margin-top: 0px;
    align-content: center;
    justify-content: space-between;

    .info {
      font-size: 14px;

      span {
        font-size: 14px;
      }

      span:first-child {
        margin-right: 20px;
        line-height: 29px;
      }
    }
  }
}
</style>
