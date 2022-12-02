<!-- 单证列表 -->
<template>
  <div id="DocumentList">
    <DocumentSearch ref="DocumentSearch"></DocumentSearch>
    <DocumentTable :tableData="tableData" :tableLoading="tableLoading"></DocumentTable>
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
  provide,
  nextTick,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
} from "vue";
import DocumentSearch from "@/components/document/documentList/DocumentSearch.vue";
import DocumentTable from "@/components/document/documentList/DocumentTable.vue";
import authorButtons from "@/compositionApi/authorButtons";
import { backTableTop } from "@/utils/util";
export default {
  name: "documentList",
  components: { DocumentSearch, DocumentTable },
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
    onMounted(() => { });
    onMounted(() => {
      getTableData();
      window.addEventListener("scroll", handleScroll, true);
    });
    onActivated(() => {
      setTimeout(() => {
        backTableTop("#DocumentTable", data.scroll);
      }, 100);
      window.addEventListener("scroll", handleScroll, true);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("scroll", handleScroll, true);
    });
    onDeactivated(() => {
      window.removeEventListener("scroll", handleScroll, true);
    });
    const handleScroll = () => {
      data.scroll = document.querySelector(
        `#DocumentTable .el-table .el-table__body-wrapper`
      ).scrollTop;
    };
    const getTableData = (msg) => {
      data.tableLoading = true;
      data.searchMsg = msg || data.searchMsg;
      let info = {};
      if (data.searchMsg) {
        info = data.searchMsg;
        info.size = data.tableInfo.size;
        info.current = data.tableInfo.current;
      }
      api.documentList
        .getSelectList(info)
        .then((res) => {
          if (res.code == 200) {
            data.tableLoading = false;
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
              backTableTop("#DocumentList", data.scroll);
            });
          } else {
            data.tableLoading = false;
            vue.$message.warning(res.msg);
          }
        })
        .catch(() => {
          data.tableLoading = false;
        });
      //     data.tableLoading = false;

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
    const refData = toRefs(data);
    return {
      ...refData,
      handleSizeChange,
      handleCurrentChange,
      buttonAuthor,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
