<!-- ReviewDeliveryPlanTable  柜号表格-->
<template>
  <div id="ReviewDeliveryPlanTable">
    <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%" :header-cell-style="{
      background: '#fafafa',
      color: '#2d2f30',
      fontWeight: 'bold',
      fontSize: '12px',
    }" height="calc(100vh - 230px)">
      <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
      <el-table-column align="center" prop="transferWarehouse" label="中转仓库">
        <template #default="scope">
          <span>
            {{
            scope.row.transferWarehouse ? scope.row.transferWarehouse : "-"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="purposeWarehouse" label="仓区">
        <template #default="scope">
          <span>
            {{ scope.row.purposeWarehouse ? scope.row.purposeWarehouse : "-" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="shippingScheduleTransportation" label="运输方式">
        <template #default="scope">
          <span>
            {{ scope.row.transportMode ? scope.row.transportMode : "-" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="cabinetNum" label="柜号">
        <template #default="scope">
          <span>
            {{ scope.row.cabinetNum ? scope.row.cabinetNum : "-" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="totalVolume" label="总体积m3">
        <template #default="scope">
          <span>
            {{ scope.row.totalVolume ? scope.row.totalVolume : "-" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="boxNum" label="箱数">
        <template #default="scope">
          <span>{{ scope.row.boxNum ? scope.row.boxNum : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="skuKind" label="SKU种类数">
        <template #default="scope">
          <span>
            {{ scope.row.skuKind ? scope.row.skuKind : "-" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="skuNum" label="SKU总数">
        <template #default="scope">
          <span>
            {{ scope.row.skuNum ? scope.row.skuNum : "-" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template #default="scope">
          <span v-if="scope.row.status">
            {{ getStateText(scope.row.status) }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="cabinetAttribute" label="柜子属性">
        <template #default="scope">
          <span>
            {{ scope.row.cabinetAttribute ? scope.row.cabinetAttribute : "-" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间">
        <template #default="scope">
          <span>
            {{ scope.row.createTime ? scope.row.createTime : "-" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="" min-width="100" label="操作">
        <template #default="scope">
          <span class="oper">
            <el-button v-if="buttonAuthor.view" type="primary" text size="small" @click="getDetails(scope.row)">查看
            </el-button>
            <el-button v-if="buttonAuthor.log" type="primary" text size="small" @click="journal(scope.row.id)">日志
            </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 一级详情弹框 -->
    <FirstDetailsPop ref="FirstDetailsPop"></FirstDetailsPop>
    <!-- 出柜 -->
    <!-- <ComeOutPop ref="ComeOutPop"></ComeOutPop> -->
    <!-- 日志 -->
    <JournalLog ref="JournalLog"></JournalLog>
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
} from "vue";
import FirstDetailsPop from "@/components/warehouse/reviewDeliveryPlanCom/FirstDetailsPop.vue";
// import ComeOutPop from "@/components/warehouse/reviewDeliveryPlanCom/ComeOutPop.vue";
import authorButtons from "@/compositionApi/authorButtons";
import JournalLog from "@/components/logDialog/JournalLog.vue";
import { getLodop } from "@/utils/LodopFuncs";
import { localGet } from "@/utils/util";
export default {
  name: "ReviewDeliveryPlanTable",
  components: {
    FirstDetailsPop,
    // ComeOutPop, 
    JournalLog
  },
  props: {
    tableData: {
      type: Array,
    },
    tableLoading: {
      type: Boolean,
    },
  },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      stateList: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const getTableList = inject("getTableList");
    onBeforeMount(() => { });
    onMounted(() => {
      data.stateList =
        localGet("purchaseDict") &&
          localGet("purchaseDict").cabinet_status
          ? localGet("purchaseDict").cabinet_status
          : [];
    });

    //计算状态 getStateText
    const getStateText = (e) => {
      let text = "";
      data.stateList.map((item) => {
        if (e == item.dizKey) {
          text = item.value;
        }
      });
      return text;
    };

    //查看 getDetails
    const getDetails = (e) => {
      vue.$refs.FirstDetailsPop.openLog(e);
    };

    //journal 日志
    const journal = (id) => {
      let msg = {
        servers: "warehouse",
        dataApi: "selectCabinetLog",
        id: id,
      };
      nextTick(() => {
        vue.$refs.JournalLog.checkLogDialog(msg);
      });
    };


    const refData = toRefs(data);
    return {
      ...refData,
      getDetails,
      buttonAuthor,
      getTableList,
      getStateText,
      journal,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
