<!-- TransferDocManagement 调拨单管理-->
<template>
  <div>
    <TransferDocManagementSearch :searchMsg="searchMsg"></TransferDocManagementSearch>
    <TransferDocManagementTable :tableData="tableData" :tableLoading="tableLoading" :searchMsg="searchMsg"
      :tableInfo="form"></TransferDocManagementTable>
    <!-- 分页 -->
    <Pagination :total="form.total" :limit="form.size" :page="form.current" @update:limit="form.size = $event"
      @update:page="form.current = $event" :hidden="form.total <= 0" @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"></Pagination>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, provide } from 'vue';
import TransferDocManagementTable from '@/components/transferDocManagement/TransferDocManagementTable.vue';
import TransferDocManagementSearch from '@/components/transferDocManagement/TransferDocManagementSearch.vue';
import authorButtons from "@/compositionApi/authorButtons";
import { AJAX_getAllotList } from "@/api/transfers/requisitionManagement";
export default {
  name: "transferDocManagement",
  components: { TransferDocManagementTable, TransferDocManagementSearch },
  setup(prop, ctx) {
    const data = reactive({
      tableLoading: false,
      tableData: [],
      form: {
        size: 10,
        current: 1,
        total: 0
      },
      scroll: 0,
      searchMsg: {},
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    onBeforeMount(() => { });
    onMounted(() => {
      window.addEventListener("message", (e) => {
        if (e.data.CreateTransferOrderFlag) {
          getTableData();
        }
      });
      getTableData({ current: 1, size: 10 });
    });

    //获取表格数据
    const getTableData = async (msg, flag = false) => {
      if (flag == true) {
        data.form.current = 1;
      }
      data.tableLoading = true;
      try {
        data.searchMsg = msg || data.searchMsg;
        const res = await AJAX_getAllotList({ ...data.searchMsg, ...data.form });
        if (res.code == 200) {
          data.form.total = res.data.total;
          data.tableData = res.data.records;
        } else {
          data.tableLoading = false;
          vue.$message.warning(res.msg);
        }
      } catch (e) {
        data.tableLoading = false;
      }
    };
    provide("getTableData", getTableData);

    //handleCurrentChange 当前页发生变化
    const handleCurrentChange = (val) => {
      data.form.current = val;
      data.scroll = 0;
      getTableData(data.searchMsg);
    };

    //handleSizeChange 每页多少条发生变化
    const handleSizeChange = (val) => {
      data.form.size = val;
      data.form.current = 1;
      data.scroll = 0;
      getTableData(data.searchMsg);
    };

    const refData = toRefs(data);

    return {
      ...refData,
      handleCurrentChange,
      handleSizeChange,
      getTableData,
      buttonAuthor,
    }
  },
};
</script>
<style scoped lang='scss'>

</style>
