<!-- 单证付款计划详情 -->
<template>
  <div id="DocumentPaymentPlanDetail">

    <el-dialog title="付款计划详情" width="60%" v-model="infoVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="table-head">
        <div class="info">
          单证付款计划编号:
          <span>235665USD</span>
          请款金额:
          <span></span>
        </div>
      </div>
      <el-table height="calc(100vh - 400px)" :header-cell-style="rowClass" :data="infoData" tooltip-effect="dark"
        element-loading-text="加载中" v-loading="loading" border>
        <el-table-column label="NO." type="index" align="center" width="100"></el-table-column>
        <el-table-column prop="message" align="center" label="头程单号"></el-table-column>
        <el-table-column prop="createUserName" align="center" label="柜号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" align="center" label="服务商" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" align="center" label="中转仓" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" align="center" label="目的仓" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" align="center" label="资料发送时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" align="center" label="账单类别" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" align="center" label="币种" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" align="center" label="实际金额" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
import tablePage from "@/compositionApi/tablePage";
export default {
  name: "DocumentPaymentPlanDetail",
  setup(prop, ctx) {
    const { rowClass } = tablePage();
    const data = reactive({
      funMsg: {},
      infoData: [],
      infoVisible: false,
      // 加载loading
      loading: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const refData = toRefs(data);

    // 打开loading
    const checkInfoDialog = id => {
      data.infoVisible = true;
      handleInfo(id);
    };
    // 查看日志
    const handleInfo = id => {
      data.infoData = [];

    };
    return {
      ...refData,
      checkInfoDialog,
      rowClass,
    };
  },
};
</script>
<style scoped lang="scss">
#DocumentPaymentPlanDetail {
  .log-pagination {
    display: flex;
    justify-content: flex-end;
    position: static;
    bottom: 0;
    right: 0;
    background: #fff;
    border: none;
    border-radius: 50px;
    margin: -50px 0 10px 0;
  }

  .table-head {
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
