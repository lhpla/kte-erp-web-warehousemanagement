<!-- 出柜异常表格 -->
<template>
  <div id="OutArkAbnormalTable">
    <div class="table-box">
      <div class="table-header">
        <el-button type="primary" size="small" @click="exportCabinetAbnormal" v-if="buttonAuthor.exportCabinetAbnormal">
          导出数据</el-button>
      </div>
    </div>
    <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%"
      @selection-change="handleSelectionChange" height="calc(100vh - 280px)" :header-cell-style="{
        background: '#fafafa',
        color: '#2d2f30',
        fontWeight: 'bold',
        fontSize: '12px',
      }">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
      <el-table-column align="center" label="发货计划ID" prop="shippingId"></el-table-column>
      <el-table-column align="center" label="柜号" prop="cabinetNum" width="100"></el-table-column>
      <el-table-column align="center" label="中转仓库" prop="transferWarehouse" width="80"></el-table-column>
      <el-table-column align="center" label="仓区" prop="purposeWarehouse"></el-table-column>
      <el-table-column align="center" label="运输方式" prop="transportMode" width="80"></el-table-column>
      <el-table-column align="center" label="箱数" prop="boxNum" width="60"></el-table-column>
      <el-table-column align="center" label="SKU种类数" prop="skuKind" width="90"></el-table-column>
      <el-table-column align="center" label="SKU总数" prop="skuNum" width="70"></el-table-column>
      <el-table-column align="center" label="类型" prop="type" width="60">
        <template #default="scope">
          <div>
            {{ tableTypeComputed(cabinet_abnormal_type, scope.row.type) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="abnormalStatus">
        <template #default="scope">
          <div>
            异常状态：{{ tableTypeComputed(cabinet_abnormal_status, scope.row.abnormalStatus) }}
          </div>
          <div>
            入库单状态：{{ scope.row.enterCodeStatus ? tableTypeComputed(shippingEnterCodeStatusList,
            scope.row.enterCodeStatus)
            : '-'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="入库单" prop="enterWarehouseCode">
        <template #default="scope">
          <span>
            {{
            scope.row.enterWarehouseCode ? scope.row.enterWarehouseCode : "-"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="skuNum">
        <template #default="scope">
          <div>
            创建时间：{{ scope.row.createTime ? scope.row.createTime : "-" }}
          </div>
          <div>
            更新时间：{{ scope.row.updateTime ? scope.row.updateTime : "-" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100" width="120px">
        <template #default="scope">
          <el-button size="small" type="primary" text  v-if="buttonAuthor.view"
            @click="dealAbnormal(scope.row, 'see')">查看</el-button>
          <!-- <el-button size="small" type="primary" text 
            v-if="buttonAuthor.export && scope.row.abnormalStatus == 'synced'" @click="print(scope.row)">
            打印
          </el-button> -->
          <!--谷仓箱唛 1）加货类型的异常已同步状态可以选择打印该异常所有箱子的SKU的入库箱标和对应入库单的箱唛； -->
          <span v-if="buttonAuthor.print">
            <el-button size="small" type="primary" text 
              v-if="scope.row.abnormalStatus == 'synced' && scope.row.type == 'more'" @click="print(scope.row)">
              谷仓箱唛
            </el-button>
          </span>


          <!--箱标 2）减货，待定类型的异常已处理状态可以选择打印该异常所有箱子的SKU的入库箱标； -->
          <span v-if="buttonAuthor.storageBoxLabel">
            <el-button size="small" type="primary" text 
              v-if="(scope.row.abnormalStatus == 'processed' && (scope.row.type == 'little' || scope.row.type == 'pending')) || (scope.row.abnormalStatus == 'synced' && scope.row.type == 'more')"
              @click="printBoxLabel(scope.row)">
              入库箱标
            </el-button>
          </span>

          <!-- 处理
          待定-> 未处理、处理中
          减货-> 未处理、处理中
          -->
          <span v-if="buttonAuthor.audit">
            <el-button size="small" type="primary" text  v-if="
              scope.row.abnormalStatus == 'not_processed' && scope.row.type == 'pending' ||
              scope.row.abnormalStatus == 'processing' && scope.row.type == 'pending' ||
              scope.row.abnormalStatus == 'not_processed' && scope.row.type == 'little' ||
              scope.row.abnormalStatus == 'processing' && scope.row.type == 'little'
            " @click="dealAbnormal(scope.row, 'deal')">
              处理
            </el-button>
          </span>
          <el-button size="small" type="primary" text  v-if="buttonAuthor.log"
            @click="openLog(scope.row)">日志</el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 查看处理异常弹窗 -->
    <AbnormalDetail ref="AbnormalDetail"></AbnormalDetail>
    <!-- 日志 -->
    <OutArkAbnormalLog ref="OutArkAbnormalLog"></OutArkAbnormalLog>
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
  computed,
  nextTick,
} from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import AbnormalDetail from "./pop/AbnormalDetail.vue";
import OutArkAbnormalLog from "./pop/OutArkAbnormalLog.vue";
import { localGet, download } from "@/utils/util";
import { getLodop } from "@/utils/LodopFuncs";
export default {
  name: "OutArkAbnormalTable",
  props: ["tableData", "tableLoading"],
  components: { AbnormalDetail, OutArkAbnormalLog },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      cabinet_abnormal_status: [],
      cabinet_abnormal_type: [],
      shippingEnterCodeStatusList: [],
      selectList: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      //异常状态
      data.cabinet_abnormal_status =
        localGet("purchaseDict") &&
          localGet("purchaseDict").cabinet_abnormal_status
          ? localGet("purchaseDict").cabinet_abnormal_status
          : [];
      data.cabinet_abnormal_type =
        localGet("purchaseDict") &&
          localGet("purchaseDict").cabinet_abnormal_type
          ? localGet("purchaseDict").cabinet_abnormal_type
          : [];
      //入库单状态
      data.shippingEnterCodeStatusList =
        localGet("purchaseDict") && localGet("purchaseDict").shipping_enter_code_status ? localGet("purchaseDict").shipping_enter_code_status : [];
    });
    const refData = toRefs(data);
    //处理异常
    const dealAbnormal = (row, type) => {
      vue.$refs.AbnormalDetail.openLog(row, type);
    };
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
          cartonNum: row.cartonNums,
          madeInChina: true,
          surplusPrinting: true,
          abnormalId: row.id,
        })
        .then((res) => {
          if (res.code == 200) {
            vue.$printFn(LODOP, res.data, "pdf");
          } else {
            vue.$message.warning(res.msg);
          }
        });
    };

    //打印箱标
    const printBoxLabel = row => {
      let LODOP = getLodop();
      if (typeof LODOP == "string") {
        vue.$message.warning({
          dangerouslyUseHTMLString: true,
          message: LODOP,
        });
        return;
      }
      let datas = [];
      for (let item of row.printBoxLabelDataVos) {
        let obj = {
          cartonNum: item.casesNum,
          encasementNum: item.skuNum,
          num: 1,
          sku: "200-" + item.sku,
          warehouse:
            row.transferWarehouse.indexOf("TS") != -1
              ? row.purposeWarehouse + "-TS"
              : row.purposeWarehouse,
          cabinetNum: row.cabinetNum,
          drawback: item.isDrawback ? "是" : "-",
          isPhoto: item.isPhotograph ? "【拍照】" : "",
        };
        datas.push(obj);
      }
      vue.$printFn(LODOP, datas, "cartonNum");
    }

    // 打开弹框
    const openLog = (e) => {
      //日志
      const msg = {
        servers: "warehouse",
        dataApi: "getAbnormalLog",
        abnormalId: e.abnormalId,
      };
      nextTick(() => {
        vue.$refs.OutArkAbnormalLog.checkLogDialog(msg);
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

    //选择数据
    const handleSelectionChange = (val) => {
      data.selectList = val
    };

    //导出数据
    const exportCabinetAbnormal = () => {
      if (data.selectList.length) {
        let abnormalIds = [];
        data.selectList.map(item => {
          // console.log(item)
          abnormalIds.push(item.abnormalId)
        })
        api.warehouse.exportCabinetAbnormal(abnormalIds).then(res => {
          console.log(res);
          let tempName = "出柜异常数据导出";
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
      } else {
        vue.$message.warning('请至少选择一条数据进行操作！')
      }
    };

    return {
      ...refData,
      buttonAuthor,
      dealAbnormal,
      tableTypeComputed,
      print,
      openLog,
      printBoxLabel,
      handleSelectionChange,
      exportCabinetAbnormal
    };
  },
};
</script>
<style scoped lang="scss">

</style>
