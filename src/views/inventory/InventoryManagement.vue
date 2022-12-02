<!-- 盘点管理 InventoryManagement -->
<template>
    <div>
        <InventoryManagementSearch ref="InventoryManagementSearchRef" />
        <InventoryManagementTable :tableData="data.tableData" :tableLoading="data.tableLoading" />
        <Pagination :total="data.myPages.total" :limit="data.myPages.pageSize" :page="data.myPages.pageNum"
            @update:limit="data.myPages.pageSize = $event" @update:page="data.myPages.pageNu = $event"
            :hidden="data.myPages.total <= 0" @handleCurrentChange="handleCurrentChange"
            @handleSizeChange="handleSizeChange"></Pagination>
    </div>
</template>

<script setup>
import {
    defineComponent,
    reactive,
    onMounted,
    getCurrentInstance,
    provide,
    ref
} from "vue";
import InventoryManagementSearch from "@/components/inventory/InventoryManagementSearch.vue";
import InventoryManagementTable from "@/components/inventory/InventoryManagementTable.vue";
import authorButtons from "@/compositionApi/authorButtons";
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
    tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
    },
    searchMsg: {
        orderStatus: "",
    },
});
const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
onMounted(() => {
    getTableData();
    window.addEventListener("message", (e) => {
        if (e.data.inventoryManagement) {
            getTableData();
        }
    });
});
const getTableData = (msg) => {
    data.tableLoading = true;
    data.searchMsg = msg || data.searchMsg;
    let info = {};
    if (data.searchMsg) {
        info = data.searchMsg;
        info.size = data.tableInfo.size;
        info.current = data.tableInfo.current;
    }
    api.inventory
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

};

const handleSizeChange = (val) => {
    data.myPages.pageSize = val;
    data.myPages.pageNum = 1;
    data.searchMsg.current = 1;
    data.tableInfo.current = 1;
    data.tableInfo.size = val;
    data.searchMsg.size = val;
    getTableData(data.searchMsg);
};
const handleCurrentChange = (val) => {
    data.myPages.pageNum = val;
    data.searchMsg.current = val;
    data.tableInfo.current = val;
    getTableData(data.searchMsg);
};
provide("getTableData", getTableData);
</script>
<style scoped lang='scss'>

</style>