<!--下架单列表  -->
<template>
  <div>
    <OffListSearch></OffListSearch>
    <OffListTable ref="OffListTable" :tableData="tableData" :tableLoading="tableLoading" :searchMsg="searchMsg"></OffListTable>
    <Pagination
      :total="myPages.total"
      :limit="myPages.pageSize"
      :page="myPages.pageNum"
      @update:limit="myPages.pageSize = $event"
      @update:page="myPages.pageNu = $event"
      :hidden="myPages.total <= 0"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    ></Pagination>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick, provide, onActivated, onDeactivated, onBeforeUnmount } from "vue";
import OffListSearch from "@/components/warehouse/OffList/OffListSearch.vue";
import OffListTable from "@/components/warehouse/OffList/OffListTable.vue";
import { backTableTop } from "@/utils/util";
export default {
  name: "OffList",
  components: {
    OffListSearch,
    OffListTable
  },
  setup(prop, ctx) {
    const data = reactive({
      tableData: [],
      tableLoading: false,
      myPages: {
        pageSize: 10,
        pageNum: 1,
        pages: 1,
        total: 0
      },
      tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10 // 每页10条
      },
      searchMsg: {},
      scroll: 0,
      scroll0: 0
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      getTableData();
      window.addEventListener("scroll", handleScroll, true);
    });

    onActivated(() => {
      // getTableData();
      setTimeout(() => {
        backTableTop("#OffListTable", data.scroll);
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
      // data.scroll = document.querySelector(`#OffListTable .el-table .el-table__body-wrapper`).scrollTop;
      // data.scroll = document.querySelector(`#OffListTable .vxe-table--body-wrapper body--wrapper`).scrollTop;
    };
    const refData = toRefs(data);
    const getTableData = msg => {
        data.tableLoading = true;
        data.searchMsg = msg || data.searchMsg;
        let info = {};
        if (data.searchMsg) {
          info = data.searchMsg;
          info.size = data.tableInfo.size;
          info.current = data.tableInfo.current;
        }
        api.orderList
          .gettakeOffList(info)
          .then(res => {
            if (res.code == 200) {
              data.tableData = res.data.records;
              data.tableInfo.current = res.data.current;
              data.tableInfo.size = res.data.size;
              data.myPages.pageSize = res.data.size;
              data.myPages.pageNum = res.data.current;
              data.myPages.pages = res.data.pages;
              data.myPages.total = res.data.total;

            if (msg && msg.scroll == 0) {
              data.scroll = 0;
            }
            nextTick(() => {
              // backTableTop("#OffListTable", data.scroll);
              data.scroll = 0;
            });
            data.tableLoading = false;
            vue.$refs.OffListTable.ids = [];
          } else {
            vue.$message({
              type: "warning",
              message: res.msg
            });
            data.tableLoading = false;
          }
        })
        .catch(err => {
          data.tableLoading = false;
        });
    };
    provide("getTableData", getTableData);
    const handleSizeChange = val => {
      data.tableInfo.size = val;
      let info = data.searchMsg;
      info.size = data.tableInfo.size;
      data.searchMsg = info;
      getTableData(data.searchMsg);
    };
    const handleCurrentChange = val => {
      data.tableInfo.current = val;
      let info = data.searchMsg;
      info.current = data.tableInfo.current;
      data.searchMsg = info;
      getTableData(data.searchMsg);
    };

    return {
      ...refData,
      handleCurrentChange,
      handleSizeChange
    };
  }
};
</script>

<style scoped lang="scss"></style>
