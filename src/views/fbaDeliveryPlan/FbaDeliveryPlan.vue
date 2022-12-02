<!-- FBA发货计划 -->
<template>
  <div id="FbaDeliveryPlan">
    <FbaDeliveryPlanSearch :searchMsg="searchMsg" :plan_status_num="plan_status_num"></FbaDeliveryPlanSearch>
    <FbaDeliveryPlanTable :tableData="tableData" :tableLoading="tableLoading" :searchMsg="searchMsg"
      class="FbaDeliveryPlanTable" ref="FbaDeliveryPlanTableRef">
    </FbaDeliveryPlanTable>
    <Pagination :total="myPages.total" :limit="myPages.pageSize" :page="myPages.pageNum"
      @update:limit="myPages.pageSize = $event" @update:page="myPages.pageNum = $event" :hidden="myPages.total <= 0"
      @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange">
    </Pagination>
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
  provide,
} from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import FbaDeliveryPlanSearch from "@/components/fbaDeliveryPlan/FbaDeliveryPlanSearch.vue";
import FbaDeliveryPlanTable from "@/components/fbaDeliveryPlan/FbaDeliveryPlanTable.vue";
export default {
  name: "FbaDeliveryPlan",
  components: { FbaDeliveryPlanSearch, FbaDeliveryPlanTable },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      tableData: [],
      tableLoading: false,
      myPages: {
        pageSize: 10,
        pageNum: 1,
        pages: 1,
        total: 0,
      },
      searchMsg: { current: 1, size: 10, sortBy: false },
      plan_status_num: []
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      getTableData();
      window.addEventListener("message", (e) => {
        if (e.data.fbaAppendix) {
          //用来刷新使用
          getTableData();
        }
      });
      getNumOfDifferentStates()
    });
    const refData = toRefs(data);
    const getNumOfDifferentStates = () => {
      //计划状态
      api.fba.getNumOfDifferentStates().then((res) => {
        if (res.code == 200) {
          data.plan_status_num = res.data;
        }
      })
    }
    const getTableData = (msg, current) => {
      //按钮权限
      // if (buttonAuthor.dataDetails) {
      data.tableLoading = true;
      if (msg) {
        msg.sortBy = msg.sortBy !== false && msg.sortBy !== true ? data.searchMsg.sortBy : msg.sortBy
      }
      data.searchMsg = msg || data.searchMsg;
      if (!current) {
        data.searchMsg.current = 1
      }
      getNumOfDifferentStates()
      api.fba
        .warehouseFbaShipList(data.searchMsg)
        .then(res => {
          if (res.code == 200) {
            data.tableData = res.data.records;
            data.tableData.map(item => {
              item.list = []
            })
            data.myPages.pageSize = res.data.size;
            data.myPages.pageNum = res.data.current;
            data.myPages.pages = res.data.pages;
            data.myPages.total = res.data.total;
            data.searchMsg.current = res.data.current
            data.searchMsg.size = res.data.size
            vue.$refs.FbaDeliveryPlanTableRef.refreshTableRef()
            data.tableLoading = false;
          } else {
            data.tableLoading = false;
            vue.$message.warning(res.msg);
          }
        })
        .catch(err => {
          data.tableLoading = false;
        });
      // }
    };
    provide("getTableData", getTableData);
    const handleCurrentChange = (val) => {
      data.searchMsg.current = val
      getTableData(data.searchMsg, val);
    };
    const handleSizeChange = (val) => {
      data.searchMsg.size = val
      getTableData();
    };
    return {
      ...refData,
      buttonAuthor,
      handleCurrentChange,
      handleSizeChange,
      getTableData,
    };
  },
};
</script>
<style scoped lang="scss">
#FbaDeliveryPlan {
  .FbaDeliveryPlanTable {
    padding-bottom: 52px;
  }
}
</style>

