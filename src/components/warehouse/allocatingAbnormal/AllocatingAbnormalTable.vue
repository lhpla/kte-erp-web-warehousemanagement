<!-- AllocatingAbnormalTable 调拨异常列表 -->
<template>
  <div id="AllocatingAbnormalTable">
    <vxe-table align="center" :data="tableData" border :loading="tableLoading" :header-row-style="{
      background: '#fafafa',
      color: '#2d2f30',
      fontWeight: 'bold',
      fontSize: '12px',
    }" style="width: 100%" :height="tableHeight" ref="table">
      <vxe-column type="seq" width="60" title="NO."></vxe-column>
      <vxe-column field="transferCode" width="160" title="调拨单号"></vxe-column>
      <vxe-column field="start" title="调拨仓" min-width="160">
        <template #default="scope">
          {{ `${scope.row.startTransferWarehouse}-${scope.row.startPurposeWarehouse}-${scope.row.startTransportMode}` }}
        </template>
      </vxe-column>
      <vxe-column field="end" title="目的仓" min-width="160">
        <template #default="scope">
          {{ `${scope.row.endTransferWarehouse}-${scope.row.endPurposeWarehouse}-${scope.row.endTransportMode}` }}
        </template>
      </vxe-column>
      <vxe-column field="trackingNum" title="跟踪号" min-width="60">
        <template #default="scope">
          {{ scope.row.trackingNum ? scope.row.trackingNum : '-' }}
        </template>
      </vxe-column>
      <vxe-column field="transferTotalNum" title="调拨数量" min-width="60"></vxe-column>
      <vxe-column field="abnormalTotalNum" title="异常数量" min-width="60"></vxe-column>
      <vxe-column field="updateTime" title="更新时间" min-width="160">
        <template #default="scope">
          {{ scope.row.updateTime ? scope.row.updateTime : '-' }}
        </template>
      </vxe-column>
      <vxe-column field="status" title="状态" min-width="60">
        <template #default="scope">
          {{ scope.row.status == 1 ? '已确认' : '待确认' }}
        </template>
      </vxe-column>
      <vxe-column field="" title="操作" width="190" fixed="right">
        <template #default="scope">
          <div class="oper">
            <el-button size="small" type="primary" text v-if="buttonAuthor.detail" @click="openInfo(scope.row)">
              详情</el-button>
            <el-button size="small" type="primary" text v-if="buttonAuthor.operation && scope.row.status == 0"
              @click="storageWay(scope.row,scope.row.startTransferWarehouseId)">确认入库</el-button>
            <el-button size="small" type="primary" text @click="openLog(scope.row.transferCode)"
              v-if="buttonAuthor.log">
              日志
            </el-button>
            <el-button size="small" type="primary" text @click="print(scope.row)"
              v-if="buttonAuthor.export && scope.row.isDirect == false && scope.row.status == 1">
              打印箱标</el-button>
          </div>
        </template>
      </vxe-column>
    </vxe-table>
    <!--调拨异常详情 -->
    <AllocatingAbnormalInfo ref="AllocatingAbnormalInfo"></AllocatingAbnormalInfo>
    <!--调拨日志 -->
    <AllocatingAbnormalLog ref="AllocatingAbnormalLog"></AllocatingAbnormalLog>
    <!-- 入库方式-->
    <StorageWayDialog ref="StorageWayDialog"></StorageWayDialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, nextTick, computed, provide, watch } from "vue";
import { documentCopy } from "@/utils/util";
import authorButtons from "@/compositionApi/authorButtons";
import AllocatingAbnormalLog from "@/components/warehouse/allocatingAbnormal/AllocatingAbnormalLog";
import StorageWayDialog from "@/components/warehouse/allocatingAbnormal/StorageWayDialog";
import AllocatingAbnormalInfo from "@/components/warehouse/allocatingAbnormal/AllocatingAbnormalInfo.vue";
import { useTableHeight } from '@/compositionApi/useTableHeight.js'
import { getLodop } from "@/utils/LodopFuncs";
export default {
  name: "abnormalWarehousingTable",
  props: ["tableLoading", "tableData", "searchMsg"],
  components: { AllocatingAbnormalLog, StorageWayDialog, AllocatingAbnormalInfo, useTableHeight },
  setup(prop, ctx) {
    const data = reactive({
      infotable: [],
      buttonRef: false,
    });
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const { tableHeight } = useTableHeight(230)
    const api = vue.$http;
    const table = ref();
    onBeforeMount(() => {
    });
    onMounted(() => { });
    const refData = toRefs(data);
    // 查看详情内容
    const openInfo = (row) => {
      nextTick(() => {
        vue.$refs.AllocatingAbnormalInfo.checkStorageDialog(row);
      });
    }
    // 刷新列表
    const getTableList = inject("getTableList");

    // provide("tableTypeComputed", tableTypeComputed);
    // 查看日志
    const openLog = id => {
      nextTick(() => {
        vue.$refs.AllocatingAbnormalLog.checkLogDialog(id);
      });
    };
    //打印箱标
    const print = row => {
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
      api.requisitionManagement.printUnusualBoxLabel(msg).then((res) => {
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
        }
      });
    }
    //选择入库方式
    const storageWay = (e, id) => {
      nextTick(() => {
        vue.$refs.StorageWayDialog.checkStorageDialog(e, id);
      });
    }

    // 点击复制
    const copyText = text => {
      documentCopy(text);
    };
    return {
      ...refData,
      getTableList,
      buttonAuthor,
      openLog,
      copyText,
      table,
      tableHeight,
      openInfo,
      print,
      storageWay
    };
  }
};
</script>
<style scoped lang="scss">

</style>
