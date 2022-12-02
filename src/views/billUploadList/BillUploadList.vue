<!-- 单证   账单上传 -->
<template>
  <div>
    <BillUploadListSearch ref="BillUploadListSearch"></BillUploadListSearch>
    <BillUploadListTable
      ref="BillUploadListTable"
      :tableData="tableData"
    ></BillUploadListTable>
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
import {
  reactive,
  toRefs,
  ref,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
} from "vue";
import BillUploadListSearch from "./BillUploadListSearch.vue";
import BillUploadListTable from "./BillUploadListTable.vue";
export default {
  name: "billUploadList",
  components: { BillUploadListSearch, BillUploadListTable },
  setup(prop, ctx) {
    const data = reactive({
      tableData: [],
      myPages: {
        pageSize: 10,
        pageNum: 1,
        pages: 1,
        total: 0,
      },
      scroll: 0,
      tableLoading: false,
      tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      },
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);

    const handleSizeChange = (val) => {
      data.tableInfo.size = val;
      let info = data.searchMsg;
      info.size = data.tableInfo.size;
      data.searchMsg = info;
      data.scroll = 0;
      getDataList(data.searchMsg);
    };
    const handleCurrentChange = (val) => {
      data.tableInfo.current = val;
      let info = data.searchMsg;
      info.current = data.tableInfo.current;
      data.searchMsg = info;
      data.scroll = 0;
      getDataList(data.searchMsg);
    };
    return {
      ...refData,
      handleSizeChange,
      handleCurrentChange,
    };
  },
};
</script>
<style scoped lang="scss"></style>
