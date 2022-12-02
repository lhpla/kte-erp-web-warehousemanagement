<!-- 单证表格 -->
<template>
  <div id="DocumentTable">
    <el-table height="calc(100vh - 250px)" :data="tableData" v-loading="tableLoading" :header-cell-style="{
      background: '#fafafa',
      color: '#2d2f30',
      fontWeight: 'bold',
      fontSize: '12px',
    }" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="index" align="center" label="#" min-width="40"></el-table-column>
      <el-table-column label="发货计划ID" prop="shippingId"></el-table-column>
      <el-table-column label="海柜号" prop="overseasCabinetNum"></el-table-column>
      <el-table-column label="仓区" prop="purposeWarehouse"></el-table-column>
      <el-table-column label="物流服务商">
        <template #default="scope">
          {{ tableTypeComputed(logistics_service, scope.row.provider) }}
        </template>
      </el-table-column>
      <el-table-column label="单证员" prop="docUserName" v-if="buttonAuthor.isAdministrator"></el-table-column>
      <el-table-column label="国内仓柜子信息" prop="enterWarehouseCode" min-width="180">
        <template #default="scope">
          <span v-if="scope.row.detailed && scope.row.detailed.length">
            <div v-for="(item, index) of scope.row.detailed" :key="index">
              <div>柜号:{{ item.cabinetNum ? item.cabinetNum : '-' }} 入库单号:{{ item.enterWarehouseCode
                  ? item.enterWarehouseCode : '-'
              }}
                中转仓:{{ item.transferWarehouse ? item.transferWarehouse : '-' }} </div>
            </div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="110" prop="outboundStatus">
        <template #default="scope">
          <div>
            出库状态:
            <span v-if="scope.row.outboundStatus !== '' && scope.row.outboundStatus">已出库</span>
            <span v-else>待出库</span>
          </div>
          <div>
            分配状态:
            <span v-if="scope.row.docDistributeStatus">已分配</span>
            <span v-else>待分配</span>
          </div>
          <div>
            单证状态:
            {{ tableTypeComputed(doc_doc_status, scope.row.docStatus) }} <span
              v-if="scope.row.docAuditStatus == 'false'">
              <el-tooltip effect="dark" content="有报关资料审核失败" placement="bottom"><i class="el-icon-warning color-red"></i>
              </el-tooltip>
            </span>
          </div>

        </template>
      </el-table-column>
      <el-table-column label="时间" min-width="150">
        <template #default="scope">
          <div class="mle1">
            生成计划:{{
                scope.row.generateShipTime ? scope.row.generateShipTime : "-"
            }}
          </div>
          <div class="mle1">
            出库时间:{{
                scope.row.outWarehouseTime ? scope.row.outWarehouseTime : "-"
            }}
          </div>
          <div class="mle1">
            发送时间:{{ scope.row.docSendTime ? scope.row.docSendTime : "-" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="120" align="center">
        <template #default="scope">
          <!-- <el-button  type="primary" text @click="distribute(scope.row)"
            v-if="buttonAuthor.set && !scope.row.docUserName">
            分配</el-button> -->
          <el-button type="primary" text @click="downloadDeclareMaterial(scope.row.shippingId)"
            v-if="buttonAuthor.export">
            草稿下载
          </el-button>
          <el-button type="primary" text v-if="buttonAuthor.log" @click="selectDocLog(scope.row)">日志</el-button>
          <el-button type="primary" text v-if="buttonAuthor.detail && scope.row.outboundStatus"
            @click="openPop(scope.row)">
            单证详情
          </el-button>
          <el-button type="primary" text @click="confirmSendDoc(scope.row)" v-if="buttonAuthor.view &&
            scope.row.docStatus == 'processing'
          ">
            发送
          </el-button>
          <el-button type="primary" text v-if="
            scope.row.outboundStatus && buttonAuthor.warehousingOrder && scope.row.docStatus != 'processing'
          " @click="setDataMaintenance(scope.row)">资料维护
          </el-button>
          <el-button type="primary" text v-if="
            scope.row.outboundStatus && buttonAuthor.freeTradeEdit && scope.row.docStatus != 'processing'
          " @click="saveListData(scope.row)">存档资料
          </el-button>
          <el-button type="primary" text @click="outboundData(scope.row.videoPath)"
            v-if="buttonAuthor.outboundData && scope.row.outboundStatus !== '' && scope.row.outboundStatus">
            出库资料
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 日志 -->
    <newLogDialog ref="newLogDialogRef">
      <template #column>
        <el-table-column label="#" type="index" align="center" width="100"></el-table-column>
        <el-table-column prop="message" align="center" label="内容"></el-table-column>
        <el-table-column prop="createUserName" align="center" label="操作人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" align="center" label="修改时间" show-overflow-tooltip></el-table-column>
      </template>
    </newLogDialog>
    <DataMaintenance ref="DataMaintenance"></DataMaintenance>
    <!-- 存单资料 -->
    <SaveListData ref="SaveListData"></SaveListData>
    <!-- <el-dialog title="分配单证" v-model="dialogVisible" width="30%" :before-close="handleClose"
      :close-on-click-modal="false">
      <div class="flex">
        <div>单证员：</div>
        <div>
          <el-select v-model="docUserId"   filterable clearable placeholder="请选择">
            <el-option v-for="item in documentList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose"  size="small">取 消</el-button>
          <el-button type="primary" @click="submit"  size="small">确 定</el-button>
        </span>
      </template>
    </el-dialog> -->
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
  nextTick,
  computed,
} from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import DataMaintenance from "./ducmentPop/documentMaintenance/DataMaintenance.vue";
import SaveListData from "./ducmentPop/documentMaintenance/SaveListData.vue";
import { download, localGet } from "@/utils/util";
import newLogDialog from "@/components/logDialog/newLogDialog.vue";
import { useStore } from "vuex";
export default {
  name: "DocumentTable",
  props: ["tableData", "tableLoading"],
  components: { DataMaintenance, newLogDialog, SaveListData },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const store = useStore();
    const data = reactive({
      // dialogVisible: false,
      docUserId: "",
      documentList: [], //单证员列表
      money: "",
      selectList: [], //选择列表
      distributeId: "", //需要分配的id
      shippingId: '',
      row: "",
      doc_doc_status: [], //单证状态
      logistics_service: [], //服务商列表
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      data.doc_doc_status =
        localGet("purchaseDict") && localGet("purchaseDict").doc_doc_status
          ? localGet("purchaseDict").doc_doc_status
          : [];
      //服务商列表
      data.logistics_service = localGet("purchaseDict") && localGet("purchaseDict").logistics_service ? localGet("purchaseDict").logistics_service : [];
    });
    const refData = toRefs(data);
    const getTableData = inject("getTableData");
    const tabMenuList = computed(() => store.state.tabMenu.tabMenuList);
    //打开详情
    const openPop = (row) => {
      let { href } = vue.$router.resolve({
        path: "/document/documentDetail/list",
        query: {
          shippingId: row.shippingId,
          id: row.id,
        }
      });
      window.open(href);
    };

    //打开弹窗 分配人员
    // const distribute = (row) => {
    //   data.dialogVisible = true;
    //   data.distributeId = row.id;
    //   data.shippingId = row.shippingId;
    //   data.docUserId = row.docUserId && row.docUserId > 0 ? row.docUserId : "";
    //   // 单证员
    //   api.documentList.getUserPostName().then((res) => {
    //     if (res.code == 200) {
    //       data.documentList = res.data;
    //     }
    //   });
    // };
    //确认分配人员
    // const submit = () => {
    //   if (data.docUserId) {
    //     api.documentList
    //       .distribute({ id: data.distributeId, docUserId: data.docUserId, shippingId: data.shippingId })
    //       .then((res) => {
    //         if (res.code == 200) {
    //           handleClose();
    //           vue.$message.success(res.msg);
    //           getTableData();
    //         } else {
    //           vue.$message.warning(res.msg);
    //         }
    //       });
    //   } else {
    //     vue.$message.warning("请选择单证人员");
    //   }
    // };
    // //关闭分配弹窗
    // const handleClose = () => {
    //   data.docUserId = "";
    //   data.distributeId = "";
    //   data.dialogVisible = false;
    // };

    // 单证确认发送
    const confirmSendDoc = (row) => {
      vue
        .$confirm("此操作将发送单证信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          buttonSize: "small"
        })
        .then(() => {
          api.documentList.confirmSendDocNew({ shippingId: row.shippingId }).then((res) => {
            if (res.code == 200) {
              vue.$message.success(res.msg);
              getTableData();
            } else {
              vue.$message.warning(res.msg);
            }
          });
        })
        .catch(() => {
          vue.$message({
            type: "info",
            message: "已取消修改",
          });
        });
    };



    //单证日志
    const selectDocLog = (row) => {
      let msg = {
        servers: "documentList",
        dataApi: "selectDocLog",
        params: { id: row.id }
      };
      nextTick(() => {
        vue.$refs.newLogDialogRef.checkLogDialog(msg);
      });
    };

    // 列表选择
    const handleSelectionChange = (val) => {
      data.selectList = val;
    };

    //草稿下载
    const downloadDeclareMaterial = (shippingId) => {
      api.documentList
        .downloadDeclareMaterial({
          downType: "all",
          shippingId: shippingId,
          isDraft: true,
        })
        .then((res) => {
          data.btnFlag = false;
          let tempName = "单证草稿资料";
          let fileType = ".zip";
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
        .catch((err) => {
          data.btnFlag = false;
        });
    };

    //资料维护
    const setDataMaintenance = (row) => {
      nextTick(() => {
        vue.$refs.DataMaintenance.getMsg(row);
      });
    };

    //存单资料
    const saveListData = row => {
      nextTick(() => {
        vue.$refs.SaveListData.getMsg(row);
      });
    }

    //出库资料
    const outboundData = videoPath => {
      window.open(videoPath)
    }

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
      // distribute,
      // handleClose,
      // submit,
      handleSelectionChange,
      confirmSendDoc,
      selectDocLog,
      tabMenuList,
      store,
      downloadDeclareMaterial,
      tableTypeComputed,
      getTableData,
      setDataMaintenance,
      saveListData,
      outboundData
    };
  },
};
</script>
<style scoped lang="scss">
#DocumentTable {
  .flex {
    display: flex;
    align-items: center;
  }
}
</style>
