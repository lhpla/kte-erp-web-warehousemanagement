<!-- 库位管理 LocationManagement-->
<template>
  <div id="LocationManagement">
    <LocationManagementSearch :searchMsg="searchMsg"></LocationManagementSearch>
    <LocationManagementTable :tableData="tableData" :tableLoading="tableLoading"></LocationManagementTable>
    <!-- 分页 -->
    <Pagination :total="myPages.total" :limit="myPages.pageSize" :page="myPages.pageNum"
      @update:limit="myPages.size = $event" @update:page="myPages.current = $event" :hidden="myPages.total <= 0"
      @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></Pagination>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, provide } from 'vue';
import LocationManagementSearch from '@/components/locationManagement/LocationManagementSearch.vue'
import LocationManagementTable from '@/components/locationManagement/LocationManagementTable.vue';
import { backTableTop } from "@/utils/util";
export default {
  name: 'LocationManagement',
  components: { LocationManagementTable, LocationManagementSearch },
  setup(prop, ctx) {
    const data = reactive({
      tableLoading: false,
      tableData: [],
      // 分页数据
      dataInfo: {
        total: 20,
        size: 10,
        current: 1,
      },
      myPages: {
        pageSize: 10,
        pageNum: 1,
        pages: 1,
        total: 0,
      },
      scroll: 0,
      searchMsg: {},
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      getTableData({ current: 1, size: 10 });
    });

    //获取表格数据
    const getTableData = (msg) => {
      data.tableLoading = true;
      data.searchMsg = msg || data.searchMsg;
      api.warehouseManagement
        .warehouseTemporaryLocation(data.searchMsg)
        .then((res) => {
          if (res.code == 200) {
            data.tableData = res.data.records;
            data.tableLoading = false;
            data.dataInfo.size = res.data.size;
            data.dataInfo.current = res.data.current;
            data.dataInfo.total = res.data.total;
            data.myPages.pageSize = res.data.size;
            data.myPages.pageNum = res.data.current;
            data.myPages.pages = res.data.pages;
            data.myPages.total = res.data.total;
            if (msg && msg.scroll == 0) {
              data.scroll = 0;
            }
            nextTick(() => {
              backTableTop("#LocationManagement", data.scroll);
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
    provide("getTableData", getTableData);

    //handleCurrentChange 当前页发生变化
    const handleCurrentChange = (val) => {
      data.dataInfo.current = val;
      let info = data.searchMsg;
      info.current = data.dataInfo.current;
      info.size = data.dataInfo.size;
      data.searchMsg = info;
      data.scroll = 0;
      getTableData(data.searchMsg);
    };

    //handleSizeChange 每页多少条发生变化
    const handleSizeChange = (val) => {
      data.dataInfo.size = val;
      let info = data.searchMsg;
      info.size = data.dataInfo.size;
      info.current = data.dataInfo.current;
      data.searchMsg = info;
      data.scroll = 0;
      getTableData(data.searchMsg);
    };

    const refData = toRefs(data);
    return {
      ...refData,
      handleCurrentChange,
      handleSizeChange,
      getTableData,
    }
  }
};
</script>
<style scoped lang='scss'>

</style>