<!--  仓区管理-->
<template>
  <div>
    <WarehouseAreaManagementSearch ref="WarehouseAreaManagementSearch">
    </WarehouseAreaManagementSearch>
    <WarehouseAreaManagementTable ref="WarehouseAreaManagementTable" :tableData="tableData"
      :tableLoading="tableLoading"></WarehouseAreaManagementTable>
    <Pagination :total="myPages.total" :limit="myPages.pageSize" :page="myPages.pageNum"
      @update:limit="myPages.pageSize = $event" @update:page="myPages.pageNu = $event" :hidden="myPages.total <= 0"
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
  nextTick,
  provide,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
} from "vue";
import WarehouseAreaManagementSearch from "@/components/warehouse/warehouseAreaManagement/WarehouseAreaManagementSearch";
import WarehouseAreaManagementTable from "@/components/warehouse/warehouseAreaManagement/WarehouseAreaManagementTable";
import { backTableTop } from "@/utils/util";
export default {
  name: "warehouseAreaManagement",
  components: { WarehouseAreaManagementSearch, WarehouseAreaManagementTable },
  setup(prop, ctx) {
    const data = reactive({
      tableData: [],
      tableLoading: false,
      myPages: {
        pageSize: 10,
        pageNum: 1,
        pages: 1,
        total: 0,
      },
      scroll: 0,
      tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      },
      searchMsg: {},
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      getTableData();
      window.addEventListener("scroll", handleScroll, true);
    });
    onActivated(() => {
      // getTableData();
      setTimeout(() => {
        backTableTop("#WarehouseAreaManagementTable", data.scroll);
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
        `#WarehouseAreaManagementTable .el-table .el-table__body-wrapper`
      ).scrollTop;
    };
    const refData = toRefs(data);
    const getTableData = (msg, scroll) => {
      data.tableLoading = true;
      data.searchMsg = msg || data.searchMsg;
      let info = {};
      if (data.searchMsg) {
        info = data.searchMsg;
        info.size = data.tableInfo.size;
        info.current = data.tableInfo.current;
      }
      api.warehouse
        .getWareHousePage(info)
        .then((res) => {
          if (res.code == 200) {
            data.tableData = res.data.records;
            data.tableInfo.current = res.data.current;
            data.tableInfo.size = res.data.size;
            data.myPages.pageSize = res.data.size;
            data.myPages.pageNum = res.data.current;
            data.myPages.pages = res.data.pages;
            data.myPages.total = res.data.total;
            if (scroll == 0) {
              data.scroll = 0;
            }
            nextTick(() => {
              backTableTop("#WarehouseAreaManagementTable", data.scroll);
            });
            data.tableLoading = false;
          } else {
            vue.$message({
              type: "warning",
              message: res.msg,
            });
            data.tableLoading = false;
          }
        })
        .catch((err) => {
          data.tableLoading = false;
          vue.$message.warning(err.msg);
        });
    };
    provide("getTableData", getTableData);
    const handleSizeChange = (val) => {
      data.tableInfo.size = val;
      let info = data.searchMsg;
      info.size = data.tableInfo.size;
      data.searchMsg = info;
      data.scroll = 0;
      getTableData(data.searchMsg);
    };
    const handleCurrentChange = (val) => {
      data.tableInfo.current = val;
      let info = data.searchMsg;
      info.current = data.tableInfo.current;
      data.searchMsg = info;
      data.scroll = 0;
      getTableData(data.searchMsg);
    };
    return {
      ...refData,
      handleCurrentChange,
      handleSizeChange,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
