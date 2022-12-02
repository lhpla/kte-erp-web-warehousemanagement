<!-- 库存流水 -->
<template>
  <div>
    <inventoryFlowSearch ref="inventoryFlowSearch"></inventoryFlowSearch>
    <inventoryFlowTable ref="inventoryFlowTable" :tableLoading="tableLoading" :tableData="tableData"
      :searchMsg="searchMsg"></inventoryFlowTable>
    <Pagination :total="myPages.total" :limit="myPages.pageSize" :page="myPages.pageNum"
      @update:limit="myPages.pageSize = $event" @update:page="myPages.pageNum = $event" :hidden="myPages.total <= 0"
      @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></Pagination>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onBeforeUnmount, onMounted, getCurrentInstance, provide, onActivated, onDeactivated } from "vue";
import inventoryFlowSearch from "@/components/inventoryFlowList/inventoryFlowSearch.vue";
import inventoryFlowTable from "@/components/inventoryFlowList/inventoryFlowTable.vue";
import authorButtons from "@/compositionApi/authorButtons";
import { backTableTop, localGet } from "@/utils/util";
export default {
  name: "inventoryFlowList",
  components: { inventoryFlowSearch, inventoryFlowTable },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      tableLoading: false,
      //类型
      inventoryOperateTypeList: [],
      myPages: {
        pageSize: 10,
        pageNum: 1,
        pages: 1,
        total: 0
      },
      scroll: 0,
      tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10 // 每页10条
      },
      tableData: [],
      searchMsg: {}
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {
      data.inventoryOperateTypeList = localGet("purchaseDict").inventory_serial_type;
    });
    onMounted(() => {
      getTableData();
      window.addEventListener("scroll", handleScroll, true);
    });
    onActivated(() => {
      setTimeout(() => {
        backTableTop("#InventoryListTable", data.scroll);
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
      data.scroll = document.querySelector(`#inventoryFlowTable .el-table .el-table__body-wrapper`).scrollTop;
    };
    const getTableData = (msg, flag = false) => {
      data.tableLoading = true;
      data.searchMsg = msg ? msg : data.searchMsg;
      data.searchMsg.size = data.tableInfo.size;
      data.searchMsg.current = data.tableInfo.current;
      if (flag) {
        data.searchMsg.current = 1;
        data.tableInfo.current = 1;
        data.myPages.pageNum = 1;
      }
      api.warehouse
        .getInventoryFlow(data.searchMsg)
        .then(res => {
          if (res.code == 200) {
            data.tableData = res.data.records;
            if (data.inventoryOperateTypeList) {
              data.tableData.forEach(item => {
                const type = data.inventoryOperateTypeList.find(ite => {
                  return ite.dizKey === item.inventoryOperateType;
                });
                item.inventoryOperateType = type.value
              });
            }
            data.tableInfo.current = res.data.current;
            data.tableInfo.size = res.data.size;
            data.myPages.pageSize = res.data.size;
            data.myPages.pageNum = res.data.current;
            data.myPages.pages = res.data.pages;
            data.myPages.total = res.data.total;
            data.tableLoading = false;
          } else {
            data.tableLoading = false;
            vue.$message.warning(res.msg);
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
      data.scroll = 0;
      getTableData(data.searchMsg);
    };
    const handleCurrentChange = val => {
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
      buttonAuthor,
      handleSizeChange,
      handleCurrentChange
    };
  }
};
</script>
<style scoped lang="scss">

</style>
