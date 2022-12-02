<!-- 封箱列表 表格 -->
<template>
  <div id="SealingListTable">
    <div class="table-box">
      <div class="table-header">
        <el-button type="primary" size="small" @click="downloadQueue" v-if="buttonAuthor.downloadQueue">下载队列</el-button>
        <el-button type="primary" size="small" v-if="buttonAuthor.export" @click="exportDataList"
          style="margin-right: 5px;">导出列表数据</el-button>
        <el-dropdown>
          <el-button type="primary" size="small">
            批量修改<el-icon class="el-icon--right">
              <ElArrowDown />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="buttonAuthor.update" @click="updateCabinetNumClick">修改柜号</el-dropdown-item>
              <el-dropdown-item v-if="buttonAuthor.updateSize" @click="updateSize">修改尺寸</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <el-table v-loading="tableLoading" :data="tableData" border height="calc(100vh - 280px)"
      @selection-change="handleSelectionChange" :header-cell-style="{
        background: '#fafafa',
        color: '#2d2f30',
        fontWeight: 'bold',
        fontSize: '12px',
      }">

      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
      <el-table-column label="中转仓库" prop="transferWarehouse"></el-table-column>
      <el-table-column label="仓区" prop="purposeWarehouse"></el-table-column>
      <el-table-column label="运输方式" prop="transportMode"></el-table-column>
      <el-table-column label="箱号尺寸(cm)" prop="logisticsNum">
        <template #default="scope">
          <span>
            {{
                scope.row['length'] + "*" + scope.row.width + "*" + scope.row.height
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="箱号" prop="cartonNum"></el-table-column>
      <el-table-column label="柜号" prop="cabinetNum"></el-table-column>
      <el-table-column label="SKU" prop="skus">
        <template #default="scope">
          <span v-if="scope.row.skus && scope.row.skus.length > 0">
            <div v-for="(item, index) of scope.row.skus" :key="index">
              <div v-if="index < 3">{{ item }}</div>
            </div>
            <div class="oder-color nameHover" v-if="scope.row.skus.length > 3" @click="showMore(scope.row.skus)">
              更多
            </div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="采购单号" v-if="buttonAuthor.publicationRejection" prop="purchaseOrderCode"></el-table-column>
      <el-table-column label="序列号" prop="serialNum"></el-table-column>
      <el-table-column label="SKU种类数" prop="skuKindNum"></el-table-column>
      <el-table-column label="SKU总数" prop="skuNum"></el-table-column>
      <el-table-column label="质检数量" prop="qualityNum"></el-table-column>
      <el-table-column label="非质检数量" prop="notQualityNum"></el-table-column>
      <el-table-column label="时间">
        <template #default="scope">
          <span>
            <div>
              封箱时间：{{
                  scope.row.boxSealTime ? scope.row.boxSealTime : "-"
              }}
            </div>
            <div>
              创建时间：{{ scope.row.createTime ? scope.row.createTime : "-" }}
            </div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="封箱状态" prop="status">
        <template #default="scope">
          <div v-if="scope.row.status">
            {{ tableTypeComputed(warehouse_cases_status, scope.row.status) }}
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="80px">
        <template #default="scope">
          <div class="oper">
            <el-button size="small" type="primary" text v-if="buttonAuthor.view" @click="openView(scope.row)">
              查看</el-button>
            <el-button type="primary" text size="small" @click="journal(scope.row)" v-if="buttonAuthor.log">日志
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <SealingListDetail ref="SealingListDetail"></SealingListDetail>
    <!-- 封箱弹窗 -->
    <SealingPop ref="SealingPop"></SealingPop>
    <!-- 导出数据列表 -->
    <SealingExportDataList ref="SealingExportDataList"></SealingExportDataList>
    <!-- 展示更多sku详情 -->
    <SkuView ref="SkuView"></SkuView>
    <!-- 日志 -->
    <newLogDialog ref="newLogDialogRef">
      <template #column>
        <el-table-column label="#" type="index" align="center" width="100"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" width="180"></el-table-column>
        <el-table-column prop="createUserName" label="操作人" width="110"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="message" label="操作内容"></el-table-column>
      </template>
    </newLogDialog>
    <!-- 批量修改柜号 -->
    <UpdateCabinetNum ref="UpdateCabinetNumRef"></UpdateCabinetNum>
    <!-- 批量修改尺寸 -->
    <BatchModifySize ref="BatchModifySizeRef"></BatchModifySize>
    <!-- 下载队列 -->
    <DownListTable ref="DownListTableRef"></DownListTable>
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
  computed,
  inject,
} from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import SealingListDetail from "./SealingListDetail.vue";
import SealingExportDataList from "./SealingExportDataList.vue";
import SkuView from "./SkuView.vue";
import SealingPop from "./SealingPop";
import UpdateCabinetNum from "./UpdateCabinetNum.vue";
import newLogDialog from "@/components/logDialog/newLogDialog.vue";
import DownListTable from "./DownListTable.vue"
import { localGet, download } from "@/utils/util";
import BatchModifySize from "./BatchModifySize.vue";
export default {
  name: "SealingListTable",
  props: ["tableData", "tableLoading", "searchMsg", "tableInfo"],
  components: {
    SealingListDetail,
    SealingPop,
    SealingExportDataList,
    SkuView,
    newLogDialog,
    UpdateCabinetNum,
    BatchModifySize,
    DownListTable
  },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      purchaseDict: [], // 字典数组
      warehouse_cases_status: [],
      selectList: [],
      serialNum: [],
      ids: []
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      data.purchaseDict = localGet("purchaseDict")
        ? localGet("purchaseDict")
        : [];
      data.warehouse_cases_status = data.purchaseDict.warehouse_cases_status
        ? data.purchaseDict.warehouse_cases_status
        : [];
    });

    const refData = toRefs(data);
    // 查看
    const openView = (row) => {
      nextTick(() => {
        vue.$refs.SealingListDetail.getMsg({ serialNum: row.serialNum });
      });
    };
    //批量修改尺寸
    const updateSize = () => {
      if (data.selectList.length < 1) {
        vue.$message({
          message: "至少选择一条信息!",
          type: "warning",
        });
      } else {
        api.warehouse.updateCasesSizeVerify(data.ids).then(res => {
          if (res.code == 200) {
            const info = ref({
              length: '',
              width: '',
              height: ''
            })
            Object.assign(info.value, res.data)
            vue.$refs.BatchModifySizeRef.openDialog(info.value, data.ids);
          } else {
            vue.$message.warning(res.msg)
          }
        })
      }
    }
    // 列表选择
    const handleSelectionChange = (val) => {
      data.selectList = val;
      data.ids = val.map((i) => {
        return i.id;
      });
    };
    // 封箱
    // const sealing = (row) => {
    //   vue.$refs.SealingPop.getMsg(
    //     row.serialNum,
    //     row.transferWarehouseId,
    //     row.purposeWarehouseId,
    //     row.transportMode
    //   );
    // };

    const getTableData = inject("getTableData");
    // 日志
    const journal = (row) => {
      let msg = {
        servers: "warehouse",
        dataApi: "getCasesLogByCasesIdList",
        params: { casesSerialNum: row.serialNum },
      };
      nextTick(() => {
        vue.$refs.newLogDialogRef.checkLogDialog(msg);
      });
    };
    //批量封箱
    // const batchSealWarehouseCases = () => {
    //   if (data.selectList.length < 1) {
    //     vue.$message({
    //       message: "至少选择一条信息!",
    //       type: "warning",
    //     });
    //   } else {
    //     api.warehouse.batchSealWarehouseCases(data.serialNum).then((res) => {
    //       if (res.code == 200) {
    //         vue.$message.success(res.msg);
    //         getTableData();
    //       } else {
    //         vue.$message.warning(res.msg);
    //       }
    //     });
    //   }
    // };

    //导出数据列表
    const exportDataList = () => {
      if (prop.tableData.length === 0) {
        vue.$message.warning('符合条件的数据条数为0，不能执行导出')
        return false
      }
      if (prop.searchMsg) {
        let info = {};
        info = prop.searchMsg;
        info.size = prop.tableInfo.size;
        info.current = prop.tableInfo.current;
        //导出
        api.warehouse.casesInfoExcelExport(info).then((res) => {
          if (res.code == 200) {
            vue.$message.success(res.msg);
          } else {
            vue.$message.warning(res.msg);
          }
        });
      }
    };
    //批量修改柜号
    const updateCabinetNumClick = () => {
      if (data.selectList.length < 1) {
        vue.$message({
          message: "至少选择一条信息!",
          type: "warning",
        });
      } else {
        vue.$refs.UpdateCabinetNumRef.openDialog(data.ids);
      }
    }

    //展示更多sku
    const showMore = (list) => {
      vue.$refs.SkuView.getMsg(list);
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
      };
    });

    //下载队列
    const downloadQueue = () => {
      vue.$refs.DownListTableRef.getMsg()
    }
    return {
      ...refData,
      openView,
      buttonAuthor,
      tableTypeComputed,
      // sealing,
      handleSelectionChange,
      // batchSealWarehouseCases,
      getTableData,
      exportDataList,
      showMore,
      journal,
      updateCabinetNumClick,
      updateSize,
      downloadQueue
    };
  },
};
</script>
<style scoped lang="scss">

</style>
