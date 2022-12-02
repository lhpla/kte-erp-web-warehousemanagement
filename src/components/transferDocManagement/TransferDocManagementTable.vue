<!-- TransferDocManagementTable 调拨单管理表格 -->
<template>
  <div id="TransferDocManagementTable">
    <div class="operation">
      <el-button type="primary" size="small" @click="exportDataList" v-if="buttonAuthor.export">
        <div style="display: flex; align-items:center">
          <span>导出调拨数据</span>
          <el-tooltip class="item" effect="light" content="根据筛选条件导出已完结的调拨单数据">
            <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
          </el-tooltip>
        </div>
      </el-button>
      <el-button type="primary" size="small" @click="printTransferOrder" v-if="buttonAuthor.printTransfer">打印调拨单
      </el-button>
      <el-button type="primary" size="small" @click="printSummary" v-if="buttonAuthor.printCollect">打印汇总单</el-button>
      <el-button type="primary" size="small" @click="printReceiptDetails" v-if="buttonAuthor.printFormDetails">打印入库明细
      </el-button>
      <el-button type="primary" size="small" @click="registrationTrackingNum" v-if="buttonAuthor.trackNum">登记跟踪号
      </el-button>
      <el-button type="primary" size="small" @click="createTransferOrder" v-if="buttonAuthor.add">创建调拨单</el-button>
    </div>
    <div>
      <vxe-table border show-header-overflow :checkbox-config="{showHeader:true}" :row-config="{ isHover: true }"
        :data="tableData" :height="tableHeight" @checkbox-all="selectChangeEvent" @checkbox-change="selectChangeEvent"
        :column-config="{ resizable: true }" header-row-class-name="header_size" ref="table">
        <vxe-column type="checkbox" width="50" align="center"></vxe-column>
        <vxe-column type="seq" title="NO." width="60" align="center"></vxe-column>
        <vxe-column field="transferCode" title="调拨单号" align="center" min-width="40">
          <template #default="scope">{{ scope.row.transferCode ? scope.row.transferCode : '-' }}</template>
        </vxe-column>
        <vxe-column field="startTransferPurposWarehouse" title="调拨仓" align="center" min-width="40">
          <template #default="scope">
            {{ scope.row.startTransferWarehouse ? scope.row.startTransferWarehouse : '-' }}-{{
            scope.row.startPurposeWarehouse ? scope.row.startPurposeWarehouse : '-'
            }}-{{ scope.row.startTransportMode ? scope.row?.startTransportMode : '-' }}
          </template>
        </vxe-column>
        <vxe-column field="endtTransferPurposWarehouse" title="目的仓" align="center" min-width="60">
          <template #default="scope">
            {{ scope.row.endTransferWarehouse ? scope.row.endTransferWarehouse : '-' }}-{{
            scope.row.endPurposeWarehouse ? scope.row.endPurposeWarehouse : '-'
            }}-{{ scope.row.endTransportMode ? scope.row.endTransportMode : '-' }}
          </template>
        </vxe-column>
        <vxe-column field="trackingNum" title="跟踪号" align="center" min-width="60">
          <template #default="scope">{{ scope.row.trackingNum ? scope.row.trackingNum : '-' }}</template>
        </vxe-column>
        <vxe-column field="skuTypeNum" title="SKU种类数" align="center" width="80">
          <template #default="scope">
            {{ scope.row.skuTypeNum ? scope.row.skuTypeNum == -1 ? '-' : scope.row.skuTypeNum :
            '-'
            }}
          </template>
        </vxe-column>
        <vxe-column field="skuTotal" title="SKU总数" align="center" width="80">
          <template #default="scope">{{ scope.row.skuTotal ? scope.row.skuTotal == -1 ? '-' : scope.row.skuTotal : '-'
          }}</template>
        </vxe-column>
        <vxe-column title="操作员" align="center" min-width="60px">
          <template #default="scope">
            <div class="extend-user">
              <div>创建人：{{ scope.row.createUserName ? scope.row.createUserName : '-' }}</div>
              <div>出库员：{{ scope.row.outWarehouseUserName ? scope.row.outWarehouseUserName : '-' }}</div>
              <div>入库员：{{ scope.row.intoWarehouseUserName ? scope.row.intoWarehouseUserName : '-' }}</div>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="时间" align="center" min-width="95px">
          <template #default="scope">
            <div class="extend-user">
              <div>创建时间：{{ scope.row.createTime ? scope.row.createTime : '-' }}</div>
              <div>出库时间：{{ scope.row.outWarehouseTime ? scope.row.outWarehouseTime : '-' }}</div>
              <div>完结时间：{{ scope.row.endTime ? scope.row.endTime : '-' }}</div>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="status" title="状态" align="center" width="80px">
          <template #default="{ row }">{{ findStatus(row.status) }}</template>
        </vxe-column>
        <vxe-column title="操作" align="center" fixed="right" min-width="40">
          <template #default="scope">
            <span v-if="buttonAuthor.view">
              <el-button type="primary" text @click="view(scope.row)">查 看</el-button>
            </span>
            <!--            v-if="scope.row.status == 1"-->
            <span v-if="scope.row.status == 1 && buttonAuthor.update">
              <el-button type="primary" text @click="toVoid(scope.row)">作 废</el-button>
            </span>
            <!--            v-if="scope.row.status == 2"-->
            <span v-if="scope.row.status == 2 && buttonAuthor.auditWarhouse">
              <el-button type="primary" text @click="confirmWarehousing(scope.row)">确认入库</el-button>
            </span>
            <!--            v-if="scope.row.status == 3"-->
            <span v-if="scope.row.status == 3 && buttonAuthor.auditWarhouse">
              <el-button type="primary" text @click="continueWarehousing(scope.row)">继续入库</el-button>
            </span>
            <!--            v-if="scope.row.status == 1"-->
            <span v-if="scope.row.status == 1 && buttonAuthor.audit">
              <el-button type="primary" text @click="confirmDelivery(scope.row)">确认出库</el-button>
            </span>
            <span
              v-if="(scope.row.type == 1 || scope.row.type == 4) && scope.row.status == 4 && buttonAuthor.printCarton">
              <el-button type="primary" text @click="printBoxLabel(scope.row)">打印箱标</el-button>
            </span>
            <span v-if="buttonAuthor.log">
              <el-button type="primary" text @click="journal(scope.row.transferCode)">日 志</el-button>
            </span>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <!-- 确认出库 -->
    <ConfirmDelivery ref="ConfirmDeliveryRef"></ConfirmDelivery>
    <!-- 登记跟踪号 -->
    <RegistrationTrackingNum ref="RegistrationTrackingNumRef" @changeStatus="changeStatus"></RegistrationTrackingNum>
    <!-- 确认入库-中转调中转 -->
    <TransferToTransfer ref="TransferToTransferRef"></TransferToTransfer>
    <!-- 确认入库-直发调中转 -->
    <StraightToTransfer ref="StraightToTransferRef"></StraightToTransfer>
    <!-- 日志 -->
    <LogTransfer ref="JournalLogRef"></LogTransfer>
    <!-- 目的仓为直发 -->
    <TransferToStraight ref="TransferToStraightRef"></TransferToStraight>
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
  nextTick,
  inject,
} from "vue";
import LogTransfer from "./transferToTransfer/LogTransfer.vue";
import { download } from "@/utils/util";
import { ElMessageBox } from "element-plus";
import JournalLog from "@/components/logDialog/JournalLog.vue";
import RegistrationTrackingNum from "./RegistrationTrackingNum.vue";
import ConfirmDelivery from "./ConfirmDelivery.vue";
import authorButtons from "@/compositionApi/authorButtons";
import TransferToTransfer from "./transferToTransfer/TransferToTransfer.vue";
import StraightToTransfer from "./straightToTransfer/StraightToTransfer.vue";
import TransferToStraight from "./transferToStraight/TransferToStraight.vue";
import { getLodop } from "@/utils/LodopFuncs";
import { useTableHeight } from "@/compositionApi/useTableHeight.js";
import { AJAX_getAllotList_invalid } from "@/api/transfers/requisitionManagement";
export default {
  name: "TransferDocManagementTable",
  props: {
    tableLoading: {
      type: Boolean,
      default: false,
    },
    tableData: {
      type: Array,
    },
    searchMsg: {
      type: Object,
    },
    tableInfo: {
      type: Object,
    }
  },
  components: {
    JournalLog,
    LogTransfer,
    RegistrationTrackingNum,
    ConfirmDelivery,
    TransferToTransfer,
    StraightToTransfer,
    TransferToStraight,
  },
  setup(prop, ctx) {
    const data = reactive({
      selectList: [],
    });
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const { tableHeight } = useTableHeight(355);
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    //勾选事件
    const selectChangeEvent = (vo) => {
      data.selectList = vo.records;
    };
    //查看
    const view = (msg) => {
      // const { href } = vue.$router.resolve({
      //   path: "/warehouseManagement/TransferDocManagement/transferOrderDetail",
      //   // query: msg,
      // });
      const { href } = vue.$router.resolve({
        path: "/warehouseManagement/TransferDocManagement/transferOrderDetail",
        query: { type: msg.type, id: msg.id, transferCode: msg.transferCode, status: msg.status },
      });

      window.open(href, "_blank");
    };
    //作废 todo 调接口
    const toVoid = (row) => {
      ElMessageBox.confirm(
        `确认作废该调拨单【${row.transferCode}】，作废后将不再继续调拨`,
        "调拨单-作废",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
          buttonSize: "small"
        }
      )
        .then(async () => {
          try {
            const res = await AJAX_getAllotList_invalid({ id: row.id });
            if (res.code == 200) {
              vue.$message.success("作废成功!");
              getTableData();
            } else {
              vue.$message.error(res.msg);
            }
          } catch (e) {
            // vue.$message.error(e)
          }
        })
        .catch(() => { });
    };
    //确认入库-中转调中转
    const transferToTransfer = (row) => {
      vue.$refs.TransferToTransferRef.openDialog(row);
    };
    //确认入库-直发调中转
    const straightToTransfer = (row, step) => {
      vue.$refs.StraightToTransferRef.openDialog(row, step);
    };
    //确认入库-中转调直发
    const isStraight = (row) => {
      vue.$refs.TransferToStraightRef.openDialog(row);
    };
    const findStatus = (status) => {
      const list = [
        { value: "待出库", dizKey: 1 },
        { value: "已出库", dizKey: 2 },
        { value: " 入库中", dizKey: 3 },
        { value: "已完结", dizKey: 4 },
        { value: "已作废", dizKey: 5 },
      ];
      const value = list.find((item) => item.dizKey == status) || [
        { value: "暂无状态" },
      ];
      return value.value;
    };
    const getTableData = inject("getTableData");
    //继续入库
    const continueWarehousing = (row) => {
      straightToTransfer(row, 'second');
    };
    //确认出库
    const confirmDelivery = (row) => {
      vue.$refs.ConfirmDeliveryRef.openDialog(row);
    };
    //导出数据列表
    const exportDataList = () => {
      if (prop.tableData.length === 0) {
        vue.$message.warning('符合条件的数据条数为0，不能执行导出')
        return false
      }
      if (prop.searchMsg) {
        let info = {};
        info = prop.searchMsg;
        // info.status = 4
        if (!info.status) {
          info.status = '1,2,3,4,5'
        }
        info.size = prop.tableInfo.size;
        info.current = prop.tableInfo.current;
        // console.log(info, 1111111111111111);
        //导出
        api.requisitionManagement.exportTransferOrder(info).then((res) => {
          let tempName = "调拨数据";
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
        });
      }
    };
    //打印箱标
    const printBoxLabel = (row) => {
      // 调lodop
      let LODOP = getLodop();
      if (typeof LODOP == "string") {
        vue.$message.warning({
          dangerouslyUseHTMLString: true,
          message: LODOP,
        });
        return;
      }
      let msg = {
        actionType: 1,
        transferCode: row.transferCode,
      };
      api.requisitionManagement.printBoxLabel(msg).then((res) => {
        if (res.code == 200) {
          let datas = [];
          for (let item of res.data) {
            let obj = {
              cartonNum: item.endCabinetNum,
              encasementNum: item.skuNum,
              num: 1,
              sku: "200-" + item.sku,
              warehouse:
                item.endTransferWarehouse.indexOf("TS") != -1
                  ? item.endPurposeWarehouse + "-TS"
                  : item.endPurposeWarehouse,
              cabinetNum: item.endCartonNum,
              drawback: item.isDrawback ? "是" : "-",
              isPhoto: item.isPhotograph ? "【拍照】" : "",
            };

            datas.push(obj);
          }
          vue.$printFn(LODOP, datas, "cartonNum");
        } else {
          vue.$message.warning(res.msg);
        }
      });
    };
    //打印调拨单
    const printTransferOrder = () => {
      if (data.selectList.length) {
        if (data.selectList.length > 1) {
          return vue.$message.warning("只能单个调拨单进行打印");
        }
        api.requisitionManagement
          .printDialList({ transferCode: data.selectList[0].transferCode })
          .then((res) => {
            if (res.code == 200) {
              window.open(res.data);
            } else {
              vue.$message.warning(res.msg);
            }
          });
      } else {
        vue.$message.warning("请选择调拨单");
      }
    };
    //打印汇总单
    const printSummary = () => {
      if (data.selectList.length) {
        if (data.selectList.length > 1) {
          return vue.$message.warning("只能单个调拨单进行打印");
        }
        api.requisitionManagement
          .printGatherList({ transferCode: data.selectList[0].transferCode })
          .then((res) => {
            if (res.code == 200) {
              window.open(res.data);
            } else {
              vue.$message.warning(res.msg);
            }
          });
      } else {
        vue.$message.warning("请选择调拨单");
      }
    };
    //打印入库明细
    const printReceiptDetails = () => {
      if (data.selectList.length) {
        if (data.selectList.length > 1) {
          return vue.$message.warning("只能单个调拨单进行打印");
        }
        api.requisitionManagement
          .printWarehousingDetail({
            transferCode: data.selectList[0].transferCode,
          })
          .then((res) => {
            if (res.code == 200) {
              window.open(res.data);
            } else {
              vue.$message.warning(res.msg);
            }
          });
      } else {
        vue.$message.warning("请选择调拨单");
      }
    };
    //登记跟踪号
    const registrationTrackingNum = () => {
      if (data.selectList.length) {
        vue.$refs.RegistrationTrackingNumRef.openDialog(data.selectList);
      } else {
        vue.$message.warning("请选择调拨单");
      }
    };
    const changeStatus = () => {
      data.selectList = []
      vue.$refs['table'].clearCheckboxRow()
    }
    //创建调拨单
    const createTransferOrder = () => {
      // let msg = {
      //   title: "创建",
      //   id: null,
      //   key: "add",
      // };
      const { href } = vue.$router.resolve({
        path: "/warehouseManagement/TransferDocManagement/createTransferOrder",
        // query: msg,
      });

      window.open(href, "_blank");
    };
    //journal 日志
    const journal = (transferCode) => {
      let msg = {
        servers: "warehouseManagement",
        transferCode,
        isAbnormal: false,
      };
      nextTick(() => {
        vue.$refs.JournalLogRef.checkLogDialog(msg);
      });
    };

    const confirmWarehousing = (row) => {
      if (row.type == 4) {
        transferToTransfer(row);
      }
      if (row.type == 3) {
        straightToTransfer(row, 'first');
      }
      if (row.type == 1) {
        isStraight(row);
      }
    };
    const refData = toRefs(data);
    return {
      ...refData,
      printTransferOrder,
      printSummary,
      printReceiptDetails,
      registrationTrackingNum,
      createTransferOrder,
      journal,
      selectChangeEvent,
      view,
      toVoid,
      transferToTransfer,
      straightToTransfer,
      isStraight,
      continueWarehousing,
      confirmDelivery,
      printBoxLabel,
      findStatus,
      tableHeight,
      buttonAuthor,
      changeStatus,
      confirmWarehousing,
      exportDataList
    };
  },
};
</script>
<style scoped lang='scss'>
#TransferDocManagementTable {
  padding-bottom: 60px;

  .operation {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    background: #f5f5f5;
  }

  .button {
    margin-right: 5px;
  }

  ::v-deep .vxe-cell--title {
    // padding: 0 2px;
  }

  .extend-user {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    text-align: left;
  }
}

.back:hover {
  background-color: #ecf5ff !important;
}
</style>
