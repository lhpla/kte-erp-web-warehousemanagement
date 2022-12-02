<!-- ReviewDeliveryPlanList 柜号列表 -->
<template>
  <div id="ReviewDeliveryPlanList">
    <!-- 柜号列表搜索 -->
    <ReviewDeliveryPlanSearch :searchMsg="searchMsg"></ReviewDeliveryPlanSearch>
    <!-- 柜号列表表格 -->
    <ReviewDeliveryPlanTable :tableData="tableData" :tableLoading="tableLoading"></ReviewDeliveryPlanTable>
    <!-- 分页 -->
    <Pagination :total="myPages.total" :limit="myPages.size" :page="myPages.current"
      @update:limit="myPages.size = $event" @update:page="myPages.current = $event" :hidden="myPages.total <= 0"
      @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></Pagination>
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
  provide,
  nextTick,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
} from "vue";
import ReviewDeliveryPlanSearch from "@/components/warehouse/reviewDeliveryPlanCom/ReviewDeliveryPlanSearch.vue";
import ReviewDeliveryPlanTable from "@/components/warehouse/reviewDeliveryPlanCom/ReviewDeliveryPlanTable.vue";
import { backTableTop } from "@/utils/util";
export default {
  name: "reviewDeliveryPlan",
  components: {
    ReviewDeliveryPlanSearch,
    ReviewDeliveryPlanTable,
  },
  setup(prop, ctx) {
    const data = reactive({
      myPages: {
        total: 0,
        size: 0,
        limit: 0,
      },
      scroll: 0,
      searchMsg: {
        type: 2,
      },
      tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      },
      tableData: [],
      tableLoading: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      getTableList({ current: 1, size: 10, type: 2 });
      window.addEventListener("scroll", handleScroll, true);
    });
    onActivated(() => {
      // getTableList({ current: 1, size: 10 ,type:2});
      setTimeout(() => {
        backTableTop("#ReviewDeliveryPlanTable", data.scroll);
      }, 100);
      window.addEventListener("scroll", handleScroll, true);
    });
    onDeactivated(() => {
      window.removeEventListener("scroll", handleScroll, true);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("scroll", handleScroll, true);
    });
    const handleScroll = () => {
      data.scroll = document.querySelector(
        `#ReviewDeliveryPlanTable .el-table .el-table__body-wrapper`
      ).scrollTop;
    };
    //获取数据列表
    const getTableList = (msg) => {
      data.searchMsg = msg || data.searchMsg;
      let info = {};
      if (data.searchMsg) {
        info = data.searchMsg;
      }
      data.tableLoading = true;
      api.warehouse
        .cabinetSelectList(info)
        .then((res) => {
          if (res.code == 200) {
            data.tableData = res.data.records;
            data.tableLoading = false;
            data.tableInfo.current = res.data.current;
            data.tableInfo.size = res.data.size;
            data.myPages.size = res.data.size;
            data.myPages.current = res.data.current;
            data.myPages.total = res.data.total;
            if (msg && msg.scroll == 0) {
              data.scroll = 0;
            }
            nextTick(() => {
              backTableTop("#ReviewDeliveryPlanTable", data.scroll);
            });
          } else {
            data.tableLoading = false;
            vue.$message.warning(res.msg);
          }
        })
        .catch((err) => {
          data.tableLoading = false;
        });
    };

    provide("getTableList", getTableList);

    //handleCurrentChange 当前页发生变化
    const handleCurrentChange = (val) => {
      data.tableInfo.current = val;
      data.myPages.current = val;
      let info = data.searchMsg;
      info.current = data.myPages.current;
      info.size = data.myPages.size;
      data.searchMsg = info;
      data.scroll = 0;
      getTableList(data.searchMsg);
    };

    //handleSizeChange 每页多少条发生变化
    const handleSizeChange = (val) => {
      data.tableInfo.size = val;
      data.myPages.size = val;
      let info = data.searchMsg;
      info.size = data.myPages.size;
      info.current = data.myPages.current;
      data.searchMsg = info;
      data.scroll = 0;
      getTableList(data.searchMsg);
    };

    const refData = toRefs(data);
    return {
      ...refData,
      handleCurrentChange,
      handleSizeChange,
      getTableList,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
