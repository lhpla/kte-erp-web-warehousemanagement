<!-- DeliveryPlanTable 发货计划列表 -->
<template>
  <div id="DeliveryPlanTable">
    <div class="table-box">
      <div class="table-header">
        <el-button type="primary" size="small" @click="downloadQueue" v-if="buttonAuthor.downloadQueue">下载队列</el-button>
        <el-button type="primary" size="small" @click="excelExport" :disabled="btnloading"
          v-if="buttonAuthor.excelExport">导出发货计划
        </el-button>
        <el-button type="primary" size="small" @click="importShipping" v-if="buttonAuthor.import">导入发货计划
        </el-button>
        <el-button type="primary" size="small" @click="initiateplan" v-if="buttonAuthor.initiateplan">发起发货计划</el-button>
        <el-button type="primary" size="small" @click="tag(true)" v-if="buttonAuthor.batchTag">
          <span>批量标记</span>
          <el-tooltip content="批量标记发货计划的入库单类型" placement="bottom" effect="light">
            <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
          </el-tooltip>
        </el-button>
      </div>
    </div>
    <div class="table-button">
      <el-table v-loading="tableLoadingN" :data="tableDataList" border style="width: 100%" :expand-row-keys="expands"
        ref="table" row-key="id" @selection-change="handleSelectionChange" :header-cell-style="{
          background: '#fafafa',
          color: '#2d2f30',
          fontWeight: 'bold',
          fontSize: '12px',
        }" height="calc(100vh - 420px)">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="expand" width="1">
          <template #default="scopeN">
            <el-table :data="scopeN.row.childList" border>
              <el-table-column align="center" label="柜号">
                <template #default="scope">
                  <span style="magin-left:5px">
                    {{ scope.row.cabinetNum ? scope.row.cabinetNum : "-" }}
                  </span>
                  <span v-show="scope.row.casesAbnormalList.length">
                    <el-popover width="480" placement="bottom" trigger="hover" :ref="`popover-${scope.$index}`">
                      <template #reference>
                        <span>
                          <i style="font-size: 16px;" class="icon-color"
                            :class="scope.row.abnormalFlag ? 'el-icon-success' : 'el-icon-warning'"></i>
                        </span>
                      </template>
                      <el-table :data="scope.row.casesAbnormalList" :header-cell-style="{
                        background: '#fafafa',
                        color: '#2d2f30',
                        fontWeight: 'bold',
                        fontSize: '12px',
                      }">
                        <el-table-column width="130" property="cabinetNum" label="柜号"></el-table-column>
                        <el-table-column property="cartonAbnormalNum" label="异常箱数"></el-table-column>
                        <el-table-column property="type" label="异常类型">
                          <template #default="{ row }">
                            {{ getStateText(row.type, cabinet_abnormal_type) }}
                          </template>
                        </el-table-column>
                        <el-table-column property="status" label="异常状态">
                          <template #default="{ row }">
                            {{ getStateText(row.status, cabinet_abnormal_status) }}
                          </template>
                        </el-table-column>
                        <el-table-column property="sku" label="操作">
                          <template #default="{ row }">
                            <el-button type="primary" text size="small" @click="toOutArkAbnormalList(row)">详情
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-popover>
                  </span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="中转仓库">
                <template #default="scope">
                  <span>{{ scope.row.transferWarehouse ? scope.row.transferWarehouse : "-" }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="仓区">
                <template #default="scope">
                  <span>
                    {{
                        scope.row.purposeWarehouse ? scope.row.purposeWarehouse : "-"
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="总重量kg">
                <template #default="scope">
                  <span>{{ scope.row.weightTotal ? scope.row.weightTotal : "-" }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="总体积m³">
                <template #default="scope">
                  <span>{{ scope.row.totalVolume ? scope.row.totalVolume : "-" }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="箱数" width="80">
                <template #default="scope">
                  <span>
                    {{ scope.row.totalCasesNum ? scope.row.totalCasesNum : "-" }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="SKU种类数" width="85">
                <template #default="scope">
                  <span>
                    {{ scope.row.skuTypeNum ? scope.row.skuTypeNum : "-" }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="SKU总数" width="80">
                <template #default="scope">
                  <span>
                    {{ scope.row.totalSkuNum ? scope.row.totalSkuNum : "-" }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="入库单号">
                <template #default="scope">
                  <div style="display: flex; align-items:center;justify-content: center;">
                    <span> {{
                        scope.row.enterWarehouseCode ? scope.row.enterWarehouseCode : "-"
                    }}</span>
                    <el-tooltip class="item" effect="light"
                      v-if="scope.row.enterWarehouseCode && scope.row.enterCodeRemark">
                      <template #content>
                        <div style="display: flex;">
                          <span>备注：</span>
                          <span>{{ scope.row.enterCodeRemark }}</span>
                        </div>
                      </template>
                      <i class="el-icon-tickets" style="margin-left: 5px; color: #409eff;"></i>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="入库单状态">
                <template #default="scope">
                  <span>
                    {{ getStateText(scope.row.enterCodeStatus, shippingEnterCodeStatusList) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template #default="scope">
                  <span>
                    <span
                      v-if="buttonAuthor.print && scopeN.row.shippingStatus != 'revoke' && scopeN.row.shippingStatus != 'overrule' && scope.row.enterWarehouseCode">
                      <el-button type="primary" text size="small" @click="print(scope.row)" style="margin-right: 5px;">
                        打印箱唛</el-button>
                    </span>
                    <span>
                      <el-button type="primary" text size="small" @click="deleteShippingMark(scope.row)"
                        style="margin-right: 5px;" v-if="scope.row.isDelBoxMark && buttonAuthor.deleteShippingMark">删除箱唛
                      </el-button>
                    </span>
                    <span v-if="buttonAuthor.manualGoodGrn">
                      <el-button type="primary" text size="small" style="margin-right: 5px;"
                        v-if="
                        scope.row.isSyncGoodcangCreate && !scope.row.isSyncGoodcangCreateSuccess && scopeN.row.shippingStatus != 'revoke' && scopeN.row.shippingStatus != 'overrule'"
                        @click="manualGoodGrn(scope.row, false)" :loading="btnFlag" :disabled="btnFlag">
                        同步入库单
                      </el-button>
                    </span>
                    <span v-if="buttonAuthor.submitGoodGrn">
                      <el-button type="primary" text size="small" style="margin-right: 5px;"
                        v-if="
                        scope.row.isSyncGoodcangEdit && !scope.row.isSyncGoodcangEditSuccess && scope.row.isSyncGoodcangCreate &&
                        scope.row.isSyncGoodcangCreateSuccess && scopeN.row.shippingStatus != 'revoke' && scopeN.row.shippingStatus != 'overrule'" @click="manualGoodGrn(scope.row, true)"
                        :loading="btnFlag" :disabled="btnFlag">
                        提交入库单
                      </el-button>
                    </span>
                    <span v-if="buttonAuthor.remark">
                      <el-button v-if="scope.row.enterCodeStatus == 'good_cang_draft'" size="small" type="primary" text
                        style="margin-right: 5px;" @click="remark(scope.row, scopeN.row)">备注</el-button>
                    </span>
                    <span v-if="buttonAuthor.view">
                      <el-button type="primary" text size="small" @click="see(scope.row)" style="margin-right: 5px;">查看
                      </el-button>
                    </span>
                    <span v-if="buttonAuthor.cabinetLog">
                      <el-button type="primary" text size="small" @click="cabinetJournal(scope.row.cabinetId)"
                        style="margin-right: 5px;">日志
                      </el-button>
                    </span>
                    <span v-if="buttonAuthor.printContainerCode">
                      <el-button type="primary" text size="small" style="margin-right: 5px;"
                        v-if="scope.row.headerAttribute == 3 && scope.row.enterWarehouseCode"
                        @click="printInventoryListPdf(scope.row.enterWarehouseCode)">打印入库清单
                      </el-button>
                    </span>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" width="55" align="center" label="NO.">
          <template #default="{ row, $index }">
            <div>
              <span>
                {{ row.index }}
              </span>
              <!-- 1、驳回状态 直接不展示
                   2、撤回 =》 1.当前单子为审核状态  =》需要展示  反之不展示
              -->
              <div
                v-show="!(row.shippingStatus == 'overrule') && !(row.shippingStatus == 'revoke' && !row.isRevokeAudit)">
                <i v-show="!row.isExpansion" class="el-icon-arrow-right" style="cursor: pointer"
                  @click="changeExpand(row, $index)"></i>
                <i v-show="row.isExpansion" class="el-icon-arrow-down" style="cursor: pointer"
                  @click="changeExpand(row, $index)"></i>
              </div>
            </div>

          </template>
        </el-table-column>
        <el-table-column label="发起计划ID" width="100">
          <template #default="scope">
            <div style="display: flex;flex-direction: column;">
              <span>
                {{
                    scope.row.shippingId ? scope.row.shippingId : "-"
                }}
              </span>
              <div>
                <el-tooltip class="item" effect="light" v-if="scope.row.isUserDraft">
                  <template #content>
                    <div>该发货计划使用预发数据进行报关，<br />减货异常存在退税仓SKU只能调拨至买单仓</div>
                  </template>
                  <i class="el-icon-tickets" style="color: orange;font-size: 16px;"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="light" v-if="scope.row.abnormalStatus !== ''">
                  <template #content>
                    <div>
                      <span v-if="scope.row.abnormalStatus == 1">该发货计划存在异常并已处理</span>
                      <span v-else>该发货计划存在未处理异常</span>
                    </div>
                  </template>
                  <i class="icon-color" :class="scope.row.abnormalStatus == 1 ? 'el-icon-success' : 'el-icon-warning'"
                    style="font-size: 16px;"></i>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="入库单类型">
          <template #default="scope">
            <span>
              {{
                  scope.row.enterCodeType ? scope.row.enterCodeType : "-"
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="仓库">
          <template #default="scope">
            <span>
              {{
                  scope.row.transferWarehouses ? scope.row.transferWarehouses : "-"
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="仓区">
          <template #default="scope">
            <span>
              {{
                  scope.row.purposeWarehouse ? scope.row.purposeWarehouse : "-"
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="运输方式">
          <template #default="scope">
            {{ tableTypeComputed(warehouseCasesStatusList, scope.row.shippingTransport) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="SO号">
          <template #default="scope">
            <span>
              {{ scope.row.soCode ? scope.row.soCode : "-" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="海柜号/车牌号">
          <template #default="scope">
            <span v-if="scope.row.overseasCabinetNum || scope.row.numberPlate">
              {{ scope.row.shippingTransport == 4 ? scope.row.overseasCabinetNum : scope.row.numberPlate }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="服务商">
          <template #default="scope">
            <span>
              {{ scope.row.provider ? scope.row.provider : "-" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="总体积m³">
          <template #default="scope">
            <span>
              {{ scope.row.totalVolume ? scope.row.totalVolume : "-" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="总重量kg">
          <template #default="scope">
            <span>
              {{ scope.row.totalWeight ? scope.row.totalWeight : "-" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="总箱数(箱)">
          <template #default="scope">
            <span>
              {{ scope.row.totalCasesNum ? scope.row.totalCasesNum : "-" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="SKU种类数">
          <template #default="scope">
            <span>
              {{ scope.row.skuTypeNum ? scope.row.skuTypeNum : "-" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="SKU总数">
          <template #default="scope">
            <span>
              {{ scope.row.totalSkuNum ? scope.row.totalSkuNum : "-" }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="时间" min-width="180">
          <template #default="scope">
            <span>
              <div>创建：{{ scope.row.createTime ? scope.row.createTime : "-" }}</div>
              <div>出库：{{ scope.row.outWarehouseTime ? scope.row.outWarehouseTime : "-" }}</div>
              <div>更新：{{ scope.row.updateTime ? scope.row.updateTime : "-" }}</div>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="scope">
            <div style="display: flex; align-items:center;justify-content: center;">
              <span> {{ getStateText(scope.row.shippingStatus, shippingStatusList) }}</span>
              <el-tooltip class="item" effect="light"
                :content="scope.row.shippingStatus == 'revoke' ? `撤回原因：${scope.row.revokeReason}` : `驳回原因：${scope.row.overruleReason}`"
                v-if="scope.row.shippingStatus == 'revoke' || scope.row.shippingStatus == 'overrule'">
                <i class="el-icon-warning-outline" style="margin-left: 5px;color: #409eff;"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="单证员">
          <template #default="scope">
            {{ scope.row.docUserName ? scope.row.docUserName : "-" }}
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="非质检数量"></el-table-column> -->
        <el-table-column align="center" label="操作" min-width="100px">
          <template #default="scope">
            <span>
              <span v-if="buttonAuthor.tag">
                <el-button size="small" type="primary" text
                  @click="tag(false, scope.row.shippingId, scope.row.headerAttribute)"
                  v-if="scope.row.shippingStatus == 'mark'">标记</el-button>
              </span>
              <span v-if="buttonAuthor.withdraw">
                <el-button size="small" type="primary" text @click="recall(scope.row)"
                  v-if="scope.row.shippingStatus == 'mark' || scope.row.shippingStatus == 'generated'">
                  撤回</el-button>
              </span>
              <span v-if="buttonAuthor.logisticsInfo">
                <el-button size="small" type="primary" text @click="logisticsInfo(scope.row)"
                  v-if="scope.row.shippingStatus == 'keepped' || scope.row.shippingStatus == 'in_cabinet'">
                  物流信息</el-button>
              </span>
              <span v-if="buttonAuthor.confirmDelivery">
                <el-button size="small" type="primary" text @click="confirmDelivery(scope.row)"
                  v-if="scope.row.shippingStatus == 'wait_out_of_stock'">确认出库
                </el-button>
              </span>
              <span v-if="buttonAuthor.comeOut">
                <el-button size="small" type="primary" text @click="comeOut(scope.row)"
                  v-if="scope.row.shippingStatus == 'keepped' || scope.row.shippingStatus == 'in_cabinet'">装柜
                </el-button>
              </span>
              <span v-if="buttonAuthor.detail">
                <el-button size="small" type="primary" text @click="detail(scope.row)"
                  v-if="scope.row.shippingStatus == 'wait_out_of_stock' || scope.row.shippingStatus == 'out_of_stock' || scope.row.shippingStatus == 'overseas_on_teh_shelf'">
                  详情</el-button>
              </span>
              <span v-if="buttonAuthor.log">
                <el-button size="small" type="primary" text @click="journal(scope.row.shippingId)">日志</el-button>
              </span>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 查看发货计划弹框 -->
    <ViewCabinet ref="ViewCabinetRef"></ViewCabinet>
    <!-- 日志 -->
    <JournalLog ref="JournalLog"></JournalLog>
    <!-- 标记 -->
    <TagPop ref="TagPop"></TagPop>
    <!-- 撤回 -->
    <RecallPop ref="RecallPop"></RecallPop>
    <!-- 装柜 -->
    <ComeOutPop ref="ComeOutPop"></ComeOutPop>
    <!-- 发货计划详情 -->
    <ViewGeneratePlanLog ref="ViewGeneratePlanLog"></ViewGeneratePlanLog>
    <!-- 发起发货计划 -->
    <InitiateplanPop ref="InitiateplanPop"></InitiateplanPop>
    <!-- 确认出库 -->
    <ConfirmDelivery ref="ConfirmDeliveryRef"></ConfirmDelivery>
    <!-- 下载队列 -->
    <DownListTable ref="DownListTableRef"></DownListTable>
    <!-- 物流信息 -->
    <LogisticsInfo ref="LogisticsInfoRef"></LogisticsInfo>
    <!-- 入库单-备注 -->
    <RemarkDialog ref="RemarkDialogRef"></RemarkDialog>
    <!-- 导入发货计划 -->
    <AllDownDialog ref="AllDownDialog"></AllDownDialog>
    <!-- 批量删除 -->
    <DeleteCarton ref="DeleteCartonRef"></DeleteCarton>
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
  watch,
  computed,
  provide
} from "vue";
import { localGet, parseTime } from "@/utils/util";
import { getLodop } from "@/utils/LodopFuncs";
import ViewCabinet from "./ViewCabinet.vue";
import InitiateplanPop from "./InitiateplanPop.vue";
import TagPop from "./TagPop.vue";
import JournalLog from "@/components/logDialog/JournalLog.vue";
import authorButtons from "@/compositionApi/authorButtons";
import RecallPop from "./RecallPop.vue";
import ComeOutPop from "./ComeOutPop.vue";
import ViewGeneratePlanLog from "./ViewGeneratePlanLog.vue"
import changeRoute from "@/compositionApi/changeRoute";
import ConfirmDelivery from "./ConfirmDelivery.vue";
import DownListTable from "./DownListTable.vue"
import LogisticsInfo from "./LogisticsInfo.vue";
import RemarkDialog from "./RemarkDialog.vue";
import DeleteCarton from "./DeleteCarton.vue";

export default {
  name: "DeliveryPlanTable",
  components: {
    ViewCabinet,
    JournalLog,
    TagPop,
    RecallPop,
    ComeOutPop,
    InitiateplanPop,
    ViewGeneratePlanLog,
    ConfirmDelivery,
    DownListTable,
    LogisticsInfo,
    RemarkDialog,
    DeleteCarton
  },
  props: {
    tableLoading: {
      type: Boolean,
      default: false,
    },
    tableData: {
      type: Array,
    },
  },
  setup(prop, ctx) {
    const data = reactive({
      // 屏幕高度
      screenHeight: document.documentElement.clientHeight - 400,
      shippingStatusList: [],
      shippingEnterCodeStatusList: [],
      selectList: [],
      expands: [],
      tableDataList: [],
      tableLoadingN: false,
      warehouseCasesStatusList: [],
      cabinet_abnormal_type: [],
      cabinet_abnormal_status: [],
      btnloading: false,
      btnFlag: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const { getModuleID } = changeRoute();
    const api = vue.$http;
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;

    const getTableData = inject("getTableData");
    onBeforeMount(() => { });
    onMounted(() => {
      //发货计划状态
      data.shippingStatusList =
        localGet("purchaseDict") && localGet("purchaseDict").shipping_status ? localGet("purchaseDict").shipping_status : [];
      //入库单状态
      data.shippingEnterCodeStatusList =
        localGet("purchaseDict") && localGet("purchaseDict").shipping_enter_code_status ? localGet("purchaseDict").shipping_enter_code_status : [];
      //运输方式
      data.warehouseCasesStatusList = localGet("purchaseDict")
        .seceiving_shipping
        ? localGet("purchaseDict").seceiving_shipping
        : [];
      data.cabinet_abnormal_type =
        localGet("purchaseDict") && localGet("purchaseDict").cabinet_abnormal_type ? localGet("purchaseDict").cabinet_abnormal_type : [];
      data.cabinet_abnormal_status =
        localGet("purchaseDict") && localGet("purchaseDict").cabinet_abnormal_status ? localGet("purchaseDict").cabinet_abnormal_status : [];
    });
    watch(
      () => prop.tableData,
      (count, prevCount) => {
        let $table = vue.$refs.table;
        data.tableDataList = JSON.parse(JSON.stringify(count))
        data.tableDataList.forEach((i, index) => {
          i.isExpansion = false;
          i.index = index + 1;
          //默认展开第一行
          // if (index == 0) {
          //   i.isExpansion = true;
          //   data.tableLoadingN = true
          //   api.warehouse
          //     .shippingScheduleDetail({ shippingId: i.shippingId })
          //     .then((res) => {
          //       if (res.code == 200) {
          //         res.data.map(item => {
          //           if (item.casesAbnormalList.length) {
          //             item.abnormalFlag = item.casesAbnormalList.every(ev => {
          //               return ev.status == 'processed' || ev.status == 'synced'
          //             })
          //           }
          //         })
          //         data.tableDataList[0].childList = res.data;
          //         data.tableLoadingN = false
          //         $table.toggleRowExpansion(i, true);
          //       }
          //     }).catch(() => {
          //       data.tableLoadingN = false
          //     })

          // }
          i.childList = []
        });
      }, { deep: true }
    );
    watch(
      () => prop.tableLoading,
      (count, prevCount) => {
        data.tableLoadingN = count
      }
    );
    //刷新柜子表格
    const handleExpand = (row) => {
      data.tableLoadingN = true
      api.warehouse
        .shippingScheduleDetail({ shippingId: row.shippingId })
        .then((res) => {
          if (res.code == 200) {
            res.data.map(item => {
              if (item.casesAbnormalList.length) {
                item.abnormalFlag = item.casesAbnormalList.every(ev => {
                  return ev.status == 'processed' || ev.status == 'synced'
                })
              }
            })
            data.tableDataList[row.index - 1].childList = res.data;
            data.tableLoadingN = false
          }
        }).catch(() => {
          // vue.$refs.table.toggleRowExpansion(data.tableDataList[index], true);
          data.tableLoadingN = false
        })
    }
    provide('handleExpand', handleExpand)
    //展开行变化
    const changeExpand = (row) => {
      let $table = vue.$refs.table;

      if (row && !row.isExpansion) {
        handleExpand(row)
      }
      data.tableDataList.map((item) => {
        if (row.id != item.id || row.isExpansion) {
          item.isExpansion = false;
          $table.toggleRowExpansion(item, false);
        } else {
          nextTick(() => {
            item.isExpansion = true;
            $table.toggleRowExpansion(item, true);
          });
        }
      });

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
    //删除箱唛
    const deleteShippingMark = (row) => {
      nextTick(() => {
        vue.$refs.DeleteCartonRef.openDialog(row)
      })
    }
    //标记
    const tag = (flag, shippingIds, headerAttribute) => {
      let ids = []
      if (flag) { //多个勾选
        if (data.selectList.length) {
          ids = data.selectList.map(i => {
            return i.shippingId;
          });
        } else {
          vue.$message.warning('请勾选需标记的数据')
          return false
        }

      } else { //单个
        ids.push(shippingIds)
      }
      nextTick(() => {
        if (flag) {
          api.warehouse.checkShippingType(ids).then(res => {
            if (res.code == 200) {
              vue.$refs.TagPop.openLog(res.data.shippingIds, res.data.headerAttribute);
            } else {
              vue.$message.warning(res.msg)
            }
          })
        } else {
          vue.$refs.TagPop.openLog(ids, headerAttribute);
        }
      });
    }
    //确认出库
    const confirmDelivery = (row) => {
      if (row.docUserName) {
        nextTick(() => {
          vue.$refs.ConfirmDeliveryRef.openDialog(row)
        })
      } else {
        vue.$message.warning('请联系单证分配人员后才可出库')
      }

    }
    //清空选择
    const clearSelect = () => {
      data.selectList = []
      vue.$refs.table.clearSelection();
    }
    provide('clearSelect', clearSelect)
    //撤回
    const recall = row => {
      nextTick(() => {
        vue.$refs.RecallPop.openLog(row.shippingId);
      });
    }
    //备注
    const remark = (row, rowN) => {
      nextTick(() => {
        vue.$refs.RemarkDialogRef.openDialog(row, rowN)
      })
    }
    //装柜 comeOut
    const comeOut = (row) => {
      vue.$refs.ComeOutPop.openLog(row);
    };
    //详情
    const detail = (row) => {
      nextTick(() => {
        vue.$refs.ViewGeneratePlanLog.openLog(row);
      });
    }
    //下载队列
    const downloadQueue = () => {
      vue.$refs.DownListTableRef.getMsg()
    }
    //导出发货计划
    const excelExport = () => {
      let ids = []
      if (data.selectList.length) {
        ids = data.selectList.map(i => {
          return i.shippingId;
        });
      } else {
        vue.$message.warning('请勾选需导出的数据')
        return false
      }
      const time = new Date()
      let info = {
        codes: ids,
        downloadType: false,
        fileName: parseTime(time, '{y}-{m}-{d}')
      }
      data.btnloading = true
      api.warehouse
        .downloadShipping(info)
        .then((res) => {
          if (res.code == 200) {
            vue.$message.success(res.msg);
            data.selectList = []
            vue.$refs.table.clearSelection();
          } else {
            vue.$message.warning(res.msg);
          }
          data.btnloading = false
        }).catch(() => {
          data.btnloading = false
        });
    };

    //导入发货计划
    const importShipping = () => {
      let info = {
        title: "发货计划模板",
        temp: "warehouseShippingExcel",
        import: "importShipping",
        servers: "warehouse",
        dataApi: "getTableData",
      };
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info);
      });
    }
    //Print 打印
    const print = (row) => {
      let LODOP = getLodop();
      if (typeof LODOP == "string") {
        vue.$message.warning({
          dangerouslyUseHTMLString: true,
          message: LODOP,
        });
        return;
      }
      api.warehouse
        .printReceivingBox({
          cabinetNum: row.cabinetNum,
          madeInChina: true,
        })
        .then((res) => {
          if (res.code == 200) {
            if (row.headerAttribute == 3) {
              vue.$printFn(LODOP, res.data, "urlPrint");
            } else {
              vue.$printFn(LODOP, res.data, "pdf");
            }

          } else {
            vue.$message.warning(res.msg);
          }
        });
    };
    //同步谷仓入库单
    const manualGoodGrn = (row, isModify) => {
      vue
        .$confirm(isModify ? "确认同步入库单?" : "确认提交入库单?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          buttonSize: "small"
        })
        .then(() => {
          data.btnFlag = true
          api.warehouse
            .manualGoodGrn({ cabinetNum: row.cabinetNum, isModify: isModify })
            .then((res) => {
              if (res.code == 200) {
                data.btnFlag = false
                getTableList({ type: 2 });
              } else {
                data.btnFlag = false
                vue.$message.warning(res.msg);
              }
            }).catch(() => {
              data.btnFlag = false
            })
        });

    };
    //打印入库清单
    const printInventoryListPdf = (enterWarehouseCode) => {
      api.warehouse.printInventoryListPdf({ consignmentNo: enterWarehouseCode }).then(res => {
        if (res.code == 200) {
          window.open(res.data)
          // urlPrint
          // vue.$printFn(LODOP, res.data, "urlPrint");
        } else {
          vue.$message.warning(res.msg)
        }
      })
    }
    //发起计划
    const initiateplan = () => {
      nextTick(() => {
        vue.$refs.InitiateplanPop.openLog();
      });
    }
    //see 查看发货计划
    const see = (e) => {
      nextTick(() => {
        vue.$refs.ViewCabinetRef.openLog(e);
      });
    };
    //checkbox变化
    const handleSelectionChange = (val) => {
      data.selectList = val
    }
    //物流信息
    const logisticsInfo = (row) => {
      nextTick(() => {
        vue.$refs.LogisticsInfoRef.openDialog(row)
      })
    }
    //计算状态 getStateText
    const getStateText = (e, list) => {
      let text = "";
      for (let i in list) {
        if (e == list[i].dizKey) {
          text = list[i].value;
          return text;
        } else if (i == list.length - 1 && e != list[i].dizKey) {
          return text = "-"
        }
      }

    };

    //journal 日志
    const journal = (id) => {
      let msg = {
        servers: "warehouse",
        dataApi: "selectShippingLog",
        id: id,
      };
      nextTick(() => {
        vue.$refs.JournalLog.checkLogDialog(msg);
      });
    };
    //柜子日志
    const cabinetJournal = (id) => {
      let msg = {
        servers: "warehouse",
        dataApi: "selectCabinetLog",
        id: id,
      };
      nextTick(() => {
        vue.$refs.JournalLog.checkLogDialog(msg);
      });
    };
    //跳转出柜异常列表
    const toOutArkAbnormalList = (row) => {
      // window.microApp.dispatch({ path: `/warehouseManagement/warehouseManagement/outArkAbnormal/list?cabinetNum=${row.cabinetNum}`})
      getModuleID('/warehouseManagement', '/warehouseManagement/outArkAbnormal/list', { cabinetNum: row.cabinetNum, type: row.type });

    };

    const refData = toRefs(data);
    return {
      ...refData,
      getTableData,
      see,
      journal,
      getStateText,
      buttonAuthor,
      handleSelectionChange,
      changeExpand,
      tag,
      recall,
      comeOut,
      print,
      manualGoodGrn,
      initiateplan,
      clearSelect,
      tableTypeComputed,
      detail,
      toOutArkAbnormalList,
      confirmDelivery,
      downloadQueue,
      excelExport,
      cabinetJournal,
      logisticsInfo,
      remark,
      importShipping,
      printInventoryListPdf,
      deleteShippingMark
    };
  },
};
</script>
<style  lang="scss">
#DeliveryPlanTable {
  .hover {
    cursor: pointer;
  }

  .el-table__expand-column .cell {
    display: none;
  }

  .icon-color {
    color: #02A7F0;
    // background-color: #02A7F0
  }
}
</style>
