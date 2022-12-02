<!-- FBA发货计划 表格 -->
<template>
  <div id="FbaDeliveryPlanTable">
    <div class="table-box">
      <div class="table-header">
        <!-- v-if="buttonAuthor.export" @click="exportDataList" -->
        <el-button type="primary" size="small" @click="confirmDelivery('select')" v-if="buttonAuthor.audit">确认出库
        </el-button>
        <el-button size="small" type="primary" @click="completeStick()" v-if="buttonAuthor.completeStick">完成贴唛
        </el-button>
        <el-button type="primary" size="small" @click="printFbaPickingList" v-if="buttonAuthor.printFbaPicking">打印拣货明细
        </el-button>
        <el-button type="primary" size="small" @click="exportFbaShipExcel('fba')"
          v-if="buttonAuthor.exportFbaShipExcelFba">导出发货计划</el-button>
        <el-button type="primary" size="small" @click="exportFbaShipExcel('pack')"
          v-if="buttonAuthor.exportFbaShipExcelPack">导出装箱明细</el-button>
        <div class="margin-left margin-right" v-if="buttonAuthor.printFba">
          <el-dropdown>
            <el-button type="primary" size="small">
              打印FBA标签<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="printFba('all')">打印全部</el-dropdown-item>
                <el-dropdown-item @click="printFba('one')">打印部分</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="margin-right">
          <el-dropdown>
            <el-button type="primary" size="small">
              导出标签<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="buttonAuthor.exportBoxMarkPdf" @click="exportBoxMarkPdf(false)">箱唛标签
                </el-dropdown-item>
                <el-dropdown-item v-if="buttonAuthor.trackNum" @click="exportBoxMarkPdf(true)">透明计划标签</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <el-button type="primary" size="small" @click="createDelivery(1)" v-if="buttonAuthor.createDelivery">发起发货计划
        </el-button>
      </div>
    </div>
    <vxe-table :row-config="{ isHover: true, keyField: 'id' }" :data="tableData" :column-config="{ resizable: true }"
      header-row-class-name="header_size" v-loading="tableLoading" border @checkbox-all="handleSelectionChange"
      @checkbox-change="handleSelectionChange" @toggle-row-expand="expandChange"
      :expand-config="{ accordion: true, reserve: false }" ref="tableRef" :sort-config="{
        defaultSort: [{ field: 'updateTime', order: 'desc' }],
        remote: true,
        multiple: true,
      }" @sort-change="changeSort">
      <vxe-column type="checkbox" width="40" align="center"></vxe-column>
      <vxe-column type="expand" width="60" align="center" title="NO.">
        <template #default="{ row, rowIndex }">
          <span>{{ Number(rowIndex) + Number(1) }}</span>
        </template>
        <template #content="{ row }">
          <div style="padding:10px 20px 10px 20px;">
            <vxe-table :data="row.list" border header-row-class-name="header_size">
              <vxe-column title="SKU" field="sku"></vxe-column>
              <vxe-column title="M SKU" field="fbaSku"></vxe-column>
              <vxe-column title="商品名称" field="proName">
                <template #default="{ row }">
                  <div v-if="row.proName.length > 20">
                    <span>{{ row.proName.substr(0, 20) }}</span>
                    <el-popover placement="right" trigger="hover">
                      <template #reference>
                        <i style="padding-left: 5px;cursor: pointer;">...</i>
                      </template>
                      <div class="purposeWarehouse">
                        {{ row.proName }}
                      </div>
                    </el-popover>
                  </div>
                  <div v-else>{{ row.proName ? row.proName : '-' }}</div>
                </template>
              </vxe-column>
              <vxe-column title="FNSKU" field="fnSku"></vxe-column>
              <vxe-column title="状况" field="situation"></vxe-column>
              <vxe-column title="采购单号" field="orderCodes">
                <template #default="{ row }">
                  <div v-if="row.orderCodes.length">
                    <span>{{ row.orderCodes[0] }}</span>
                    <el-popover placement="right" trigger="hover" v-if="row.orderCodes.length > 1">
                      <template #reference>
                        <i style="padding-left: 5px;cursor: pointer;">...</i>
                      </template>
                      <div class="purposeWarehouse">
                        {{ row.orderCodes.join(',') }}
                      </div>
                    </el-popover>
                  </div>
                  <div v-else>-</div>
                </template>
              </vxe-column>
              <vxe-column title="发货数量(pcs)" field="shipNum"></vxe-column>
              <vxe-column title="装箱数(箱)" field="boxNum"></vxe-column>
              <vxe-column title="备注" field="remark"></vxe-column>
              <vxe-column title="操作" align="center" min-width="70px">
                <template #default="scope">
                  <div class="dropdown" v-if="buttonAuthor.printFba">
                    <el-dropdown>
                      <el-button size="small" type="primary" text>
                        打印FBA标签<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item @click="printFbaRow('all', scope.row)">打印全部</el-dropdown-item>
                          <el-dropdown-item @click="printFbaRow('one', scope.row)">打印部分</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </template>
              </vxe-column>
            </vxe-table>
          </div>
        </template>
      </vxe-column>
      <vxe-column title="shipment ID" field="shipmentId">
        <template #default="{ row }">
          <div style="display: flex; align-items:center">
            <span style="magin-left:5px">{{ row.shipmentId }}</span>
            <span v-show="row.planStatus != 'to_be_boxed' && row.planStatus != 'to_be_maintained'">
              <el-popover width="530" placement="bottom" trigger="hover">
                <template #reference>
                  <span>
                    <i class="el-icon-tickets" style="color: #409eff;"></i>
                  </span>
                </template>
                <vxe-table :data="[row.logisticsVo]" border header-row-class-name="header_size">
                  <vxe-column width="100" field="transferWarehouse" title="中转仓库"></vxe-column>
                  <vxe-column width="100" field="logisticsServiceProvider" title="服务商"></vxe-column>
                  <vxe-column width="130" field="pickUpDate" title="提货时间"></vxe-column>
                  <vxe-column width="100" field="transportMode" title="运输方式"></vxe-column>
                  <vxe-column width="100" field="freight" title="预估运费"></vxe-column>
                </vxe-table>
              </el-popover>
            </span>
            <span v-if="row.transparentPlan">
              <el-tooltip class="item" effect="light" content="透明计划">
                <i class="el-icon-office-building" style="color: #409eff;"></i>
              </el-tooltip>
            </span>
          </div>
        </template>
      </vxe-column>
      <vxe-column title="中转仓库" field="transferWarehouse"></vxe-column>
      <vxe-column title="仓区" field="purposeWarehouse"></vxe-column>
      <vxe-column title="提货时间" field="createTime">
        <template #default="{ row }">
          {{ row.createTime ? row.createTime : '-' }}
        </template>
      </vxe-column>
      <vxe-column title="服务商" field="serviceProvider">
        <template #default="{ row }">
          {{ row.serviceProvider ? row.serviceProvider : '-' }}
        </template>
      </vxe-column>
      <vxe-column title="SKU总数(pcs)" field="totalSku"></vxe-column>
      <vxe-column title="总箱数(箱)" field="totalCases"></vxe-column>
      <vxe-column title="总体积(m³)" field="totalVolume"></vxe-column>
      <vxe-column title="更新时间" field="updateTime" sortable min-width="110">
        <template #default="scope">
          {{ scope.row.updateTime ? scope.row.updateTime : "-" }}
        </template>
      </vxe-column>
      <vxe-column title="创建用户" field="createUserName"></vxe-column>
      <vxe-column title="状态">
        <template #default="{ row }">
          <div style="display: flex; align-items:center" :class="row.planStatus == 'warehouse_rejected' ? 'red' : ''">
            <span>{{ tableTypeComputed(plan_status, row.planStatus) }}</span>
            <el-tooltip class="item" effect="light" v-if="row.planStatus == 'warehouse_rejected'">
              <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
              <template #content>
                驳回原因：<span style="color:#999999">{{ row.remarksDismissed ? row.remarksDismissed : '-' }}</span>
              </template>
            </el-tooltip>
          </div>
        </template>
      </vxe-column>
      <!-- v-if="buttonAuthor.operation" -->
      <vxe-column title="操作" min-width="70px">
        <template #default="{ row }">
          <div class="oper">
            <el-button size="small" type="primary" text @click="createDelivery(3, row)" v-if="buttonAuthor.view">查看
            </el-button>
            <el-button size="small" type="primary" text @click="createDelivery(2, row)"
              v-if="buttonAuthor.edit && row.planStatus == 'to_be_boxed'">编辑</el-button>
            <el-button size="small" type="primary" text @click="rejectPlan(row)"
              v-if="buttonAuthor.reject && row.planStatus == 'to_be_boxed'">驳回
            </el-button>
            <el-button size="small" type="primary" text @click="packing(row)"
              v-if="buttonAuthor.comeOut && row.planStatus == 'to_be_boxed'">装箱
            </el-button>
            <el-button size="small" type="primary" text @click="upload(row)"
              v-if="buttonAuthor.upload && (row.planStatus == 'pending_upload' || row.planStatus == 'to_be_posted')">上传箱唛
            </el-button>
            <el-button size="small" type="primary" text @click="completeStick(row)"
              v-if="buttonAuthor.completeStick && row.planStatus == 'to_be_posted'">
              完成贴唛</el-button>
            <el-button size="small" type="primary" text @click="confirmDelivery('row', row)"
              v-if="buttonAuthor.audit && row.planStatus == 'cabinet_to_be_loaded'">确认出库</el-button>
            <el-button size="small" type="primary" text @click="shelves(row)"
              v-if="buttonAuthor.shelves && row.planStatus == 'out_of_stock'">上架
            </el-button>
            <el-button size="small" type="primary" text @click="shelves(row, 'info')"
              v-if="buttonAuthor.shelvesInfo && row.planStatus == 'listed'">上架信息
            </el-button>
            <el-button size="small" type="primary" text @click="deletePlan(row)"
              v-if="buttonAuthor.delete && row.planStatus == 'warehouse_rejected'">
              删除</el-button>
            <el-button size="small" type="primary" text @click="journal(row.id)" v-if="buttonAuthor.log">日志</el-button>
          </div>
        </template>
      </vxe-column>
    </vxe-table>
    <!-- 确认出库 -->
    <ConfirmDelivery ref="ConfirmDeliveryRef"></ConfirmDelivery>
    <!-- FBA发货计划 驳回 -->
    <Reject ref="RejectRef"></Reject>
    <!-- 日志 -->
    <newLogDialog ref="newLogDialogRef">
      <template #column>
        <el-table-column label="#" type="index" align="center" width="100"></el-table-column>
        <el-table-column prop="createUserName" label="操作人" width="110"></el-table-column>
        <el-table-column prop="message" label="操作内容"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" width="180"></el-table-column>
      </template>
    </newLogDialog>
    <!-- FBA发货计划 上架 -->
    <FbaDeliveryPlanShelves ref="FbaDeliveryPlanShelvesRef"></FbaDeliveryPlanShelves>
    <!-- FBA发货计划 装箱 -->
    <FbaDeliveryPlanPacking ref="FbaDeliveryPlanPackingRef"></FbaDeliveryPlanPacking>
    <!-- FBA发货计划 上传箱唛 -->
    <FbaDeliveryPlanUpload ref="FbaDeliveryPlanUploadRef"></FbaDeliveryPlanUpload>
    <!-- 打印部分fba标签 -->
    <FbaPrintPop ref="FbaPrintPopRef"></FbaPrintPop>
    <!-- 批量打印全部 fba标签 -->
    <AllPrint ref="AllPrintRef"></AllPrint>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, nextTick, inject, computed, provide } from 'vue';
import { download, localGet } from "@/utils/util";
import authorButtons from "@/compositionApi/authorButtons";
import ConfirmDelivery from "./fbaDeliveryPlanPop/ConfirmDelivery.vue"
import Reject from "./fbaDeliveryPlanPop/Reject.vue";
import newLogDialog from "@/components/logDialog/newLogDialog.vue"
import FbaDeliveryPlanShelves from "./fbaDeliveryPlanPop/FbaDeliveryPlanShelves.vue";
import FbaDeliveryPlanPacking from "./fbaDeliveryPlanPop/FbaDeliveryPlanPacking.vue";
import FbaDeliveryPlanUpload from "./fbaDeliveryPlanPop/FbaDeliveryPlanUpload.vue";
import { getLodop } from "@/utils/LodopFuncs";
import FbaPrintPop from "./fbaDeliveryPlanPop/FbaPrintPop.vue"
import AllPrint from "./fbaDeliveryPlanPop/AllPrint.vue"

const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;

const { BUTTONS } = authorButtons();
const buttonAuthor = BUTTONS.value;
const props = defineProps(['tableData', 'tableLoading', 'searchMsg'])
const selectList = ref([])
const plan_status = ref([])
const getTableData = inject("getTableData");
// 选中的表格数据
const handleSelectionChange = (e) => {
  selectList.value = e.records;
};
//排序时间
const changeSort = (val) => {
  if (val.order == "asc") {
    if (val.property == "updateTime") {
      props.searchMsg.sortBy = true;
    }
    getTableData(vue.searchMsg);
  }
  if (val.order == "desc") {
    if (val.property == "updateTime") {
      props.searchMsg.sortBy = false;
    }
    getTableData(vue.searchMsg);
  }
}
//打印fba揀貨明細
const printFbaPickingList = () => {
  if (selectList.value.length) {
    let ids = [];
    selectList.value.map((item) => {
      ids.push(item.id);
    });
    api.fba.printFbaPickingList(ids).then(res => {
      if (res.code == 200) {
        for (let item of res.data) {
          window.open(item)
        }
      } else {
        vue.$message.warning(res.msg)
      }

    })
  } else {
    vue.$message.warning('请勾选数据')
  }
}
//導出發貨計劃
const exportFbaShipExcel = type => {
  if (selectList.value.length > 0) {
    let ids = [];
    selectList.value.map((item) => {
      ids.push(item.id);
    });
    api.fba.exportFbaShipExcel({ ids: ids, type: type }).then((res) => {
      let tempName = type == 'fba' ? "fba发货计划" : '装箱明细';
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
    });
  } else {
    vue.$message.warning("至少选择一条数据！");
  }
}
//打印标签
const printFba = (type) => {
  let fbaShipId = ''
  if (selectList.value.length == 1) {
    fbaShipId = selectList.value[0].id
  } else {
    return vue.$message.warning('请选择一条数据！')
  }
  api.fba.printFbaLabel({ fbaShipId: fbaShipId }).then(res => {
    if (res.code == 200) {
      let datas = []
      for (let item of res.data) {
        let msg = {
          tag: item.fnSku,
          num: item.shipNum,
          productEname: item.proName,
          type: item.situation
        }
        datas.push(msg);
      }
      if (type == 'all') {
        // let LODOP = getLodop();
        // if (typeof LODOP == "string") {
        //   vue.$message.warning({
        //     dangerouslyUseHTMLString: true,
        //     message: LODOP,
        //   });
        //   return;
        // }
        // //标签
        // vue.$printFn(
        //   LODOP,
        //   datas,
        //   "fbaTag"
        // );
        vue.$refs.AllPrintRef.openPop(res.data)
      } else {
        vue.$refs.FbaPrintPopRef.openPop(res.data, true)
      }
    } else {
      vue.$message.warning(res.msg)
    }
  })

}

//打印行内sku  fba标签
const printFbaRow = (type, row) => {
  if (type == 'all' && row) {
    let datas = []
    let msg = {
      tag: row.fnSku,
      num: row.shipNum,
      productEname: row.proName,
      type: row.situation
    }
    datas.push(msg);

    let LODOP = getLodop();
    if (typeof LODOP == "string") {
      vue.$message.warning({
        dangerouslyUseHTMLString: true,
        message: LODOP,
      });
      return;
    }
    //标签
    vue.$printFn(
      LODOP,
      datas,
      "fbaTag"
    );
  } else {
    vue.$refs.FbaPrintPopRef.openPop([row], false)
  }

}
//展开行row
const expandChange = ({ expanded, row }) => {
  if (expanded) {
    row.list = []
    api.fba
      .warehouseFbaSkuList({ shipSchedule: row.id })
      .then((res) => {
        if (res.code == 200) {
          nextTick(() => {
            row.list = res.data;
          });
        }
      });
  }
};
//确认出库
const confirmDelivery = (flag, row) => {
  if (flag == 'select') {
    if (selectList.value.length) {
      let ids = [];
      selectList.value.map((item) => {
        ids.push(item.id);
      });
      nextTick(() => {
        vue.$refs.ConfirmDeliveryRef.openDialog(ids)
      })
    } else {
      vue.$message.warning('请勾选数据')
    }
  } else {
    nextTick(() => {
      vue.$refs.ConfirmDeliveryRef.openDialog([row.id])
    })
  }
}
//发起发货计划1;编辑2;查看3
const createDelivery = (type, row) => {
  let msg = { type }
  if (type != 1) {
    msg.id = row.id
  }
  const { href } = vue.$router.resolve({
    path: "/fba/fbaAppendix",
    query: msg,
  });
  window.open(href, "_blank");
};
//驳回
const rejectPlan = (row) => {
  nextTick(() => {
    vue.$refs.RejectRef.getMsg(row);
  });
};

//上架
const shelves = (row, v) => {
  nextTick(() => {
    vue.$refs.FbaDeliveryPlanShelvesRef.getMsg(row.id, v);
  });
};

//装箱
const packing = (row) => {
  nextTick(() => {
    vue.$refs.FbaDeliveryPlanPackingRef.getMsg(row);
  });
};

//上传箱唛
const upload = (row) => {
  nextTick(() => {
    vue.$refs.FbaDeliveryPlanUploadRef.openDialog(row);
  });
}

//删除
const deletePlan = (row) => {
  vue
    .$confirm("确认删除该计划", "删除计划", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      closeOnClickModal: false,
      buttonSize: "small"
    })
    .then(() => {
      api.fba.deleteFbaShip({ id: row.id }).then((res) => {
        if (res.code == 200) {
          vue.$message.success(res.msg);
          getTableData();
        } else {
          vue.$message.warning(res.msg);
        }
      });
    })
    .catch(() => { });
};
//清空所选数据
const clearSelect = () => {
  vue.$refs.tableRef.clearCheckboxRow()
  selectList.value = []
}

provide('clearSelect', clearSelect)
//完成贴唛
const completeStick = (row) => {
  if (!row && !selectList.value.length) {
    vue.$message.warning('请选择一条数据')
    return false
  }
  let idList = ref([])
  if (row) {
    idList.value = [row.id]
  } else {
    selectList.value.map(i => {
      idList.value.push(i.id)
    })
  }
  vue
    .$confirm("确认该计划所有箱子已完成贴唛", "完成贴唛", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      closeOnClickModal: false,
      buttonSize: "small"
    })
    .then(() => {
      api.fba.stickMark(idList.value).then((res) => {
        if (res.code == 200) {
          vue.$message.success(res.msg);
          clearSelect()
          getTableData();
        } else {
          vue.$message.warning(res.msg);
        }
      });
    })
    .catch(() => { });
};

//导出箱唛
const exportBoxMarkPdf = type => {
  if (selectList.value.length > 0) {
    let ids = [];
    selectList.value.map((item) => {
      ids.push(item.id);
    });
    api.fba.exportBoxMarkPdf({ ids: ids, isShippingMark: type }).then((res) => {
      let tempName = type ? '透明计划' : "箱唛";
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
    });
  } else {
    vue.$message.warning("至少选择一条数据！");
  }
};
//journal 日志
const journal = (id) => {
  let msg = {
    servers: "fba",
    dataApi: "fbaLogList",
    params: { shipId: id }
  };

  nextTick(() => {
    vue.$refs.newLogDialogRef.checkLogDialog(msg);
  });
};
// 计算表格字典
const tableTypeComputed = computed(() => {
  return function (list, dizKey) {
    if (list && list.length > 1 && dizKey !== -1) {
      for (let item of list) {
        if (dizKey == item.dizKey) {
          return item.value;
        }
      }
    }
  }
});
const init = () => {
  //计划状态
  plan_status.value = localGet("purchaseDict") &&
    localGet("purchaseDict").plan_status
    ? localGet("purchaseDict").plan_status
    : []
}
//手动清空展开行
const refreshTableRef = () => {
  vue.$refs.tableRef.clearRowExpand()
}
init()
defineExpose({ refreshTableRef })
</script>

<style scoped lang="scss">
#FbaDeliveryPlanTable {
  .margin-right {
    margin-right: 10px;
  }

  .margin-left {
    margin-right: 10px;
  }

  .red {
    color: red;
  }
}
</style>
