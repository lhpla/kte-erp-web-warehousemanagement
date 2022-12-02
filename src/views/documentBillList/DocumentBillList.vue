<!-- DocumentBillList 单证账单列表 -->
<template>
  <div id="DocumentBillList">
    <DocumentBillSearch ref="DocumentBillSearch"></DocumentBillSearch>
    <DocumentBillTableList ref="DocumentBillTableList"></DocumentBillTableList>
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
} from "vue";
import DocumentBillSearch from "@/components/document/documentBill/DocumentBillSearch.vue";
import DocumentBillTableList from "@/components/document/documentBill/DocumentBillTableList.vue";
import authorButtons from "@/compositionApi/authorButtons";
import { backTableTop } from "@/utils/util";
export default {
  name: "documentBillList",
  components: { DocumentBillSearch, DocumentBillTableList },
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

    //getTableData 获取列表数据
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
              backTableTop("#DocumentBillList", data.scroll);
            });
          } else {
            data.tableLoading = false;
            vue.$message.warning(res.msg);
          }
        })
        .catch(() => {
          data.tableLoading = false;
        });
    };

    provide("getTableData", getTableData);

    // handleCurrentChange 当前分页改变
    const handleCurrentChange = (val) => {
      data.tableInfo.current = val;
      let info = data.searchMsg;
      info.current = data.tableInfo.current;
      data.searchMsg = info;
      getTableData(data.searchMsg);
      console.log("当前页改变：", val);
      nextTick(() => {
        backTableTop("#DocumentBillTableList");
      });
    };

    // handleSizeChange //每页条数改变
    const handleSizeChange = (val) => {
      data.tableInfo.size = val;
      console.log(data.searchMsg);
      let info = data.searchMsg;
      console.log(data.searchMsg);
      info.size = data.tableInfo.size;
      data.searchMsg = info;
      getTableData(data.searchMsg);
    };

    const refData = toRefs(data);
    return {
      ...refData,
      getTableData,
      handleCurrentChange,
      handleSizeChange,
    };
  },
};
</script>
<style scoped lang="scss">
#DocumentBillList {}
</style>
