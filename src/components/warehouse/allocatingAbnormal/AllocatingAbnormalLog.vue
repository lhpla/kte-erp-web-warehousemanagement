
<!--AllocatingAbnormalLog  调拨异常日志-->
<template>
    <div id="AllocatingAbnormalLog">
        <el-dialog title="操作日志" width="85%" v-model="logVisible" :close-on-click-modal="false" @close="closed" :close-on-press-escape="false">
            <el-table border max-height="400" :data="logTableData" tooltip-effect="dark" element-loading-text="加载中"
                v-loading="loading">
                <el-table-column label="操作人" align="center" width="100" :header-cell-style="rowClass" prop="createUserName">
                </el-table-column>
                <el-table-column label="操作内容" align="center">
                    <template #default="scope">
                        <div class="textLeft" v-html='scope.row.message'></div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作时间" width="200" prop="createTime"></el-table-column>
            </el-table>
            <el-pagination class="log-pagination" background @size-change="handleSizeChangeLog"
                @current-change="handleCurrentChangeLog" :current-page="pageableLog.current"
                :page-sizes="[10, 25, 50, 100]" :page-size="pageableLog.size"
                layout="total, sizes, prev, pager, next, jumper" :total="pageableLog.total"></el-pagination>
        </el-dialog>
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
    inject,
    nextTick,
} from "vue";
import { AJAX_getAllotList_log } from "@/api/transfers/requisitionManagement";
// todo
export default {
    name: "allocatingAbnormalLog",
    setup(prop, ctx) {
        const data = reactive({
            // log日志表格数据
            logTableData: [],
            //日志
            // 加载loading
            loading: false,
            // 日志分页
            pageableLog: {
                current: 1,
                size: 10,
                total: 0,
            },
            rowClass: {
                background: "#fafafa",
                color: "#2d2f30",
                fontWeight: "bold",
                fontSize: "12px",
            },
            type: "",
            id:"",
        });
        const { ctx: vueDev, proxy: vue } = getCurrentInstance();
        const api = vue.$http;
        onBeforeMount(() => {
        });
        onMounted(() => {
        });
        const refData = toRefs(data);
        let logVisible = ref(false);
        // 打开loading
        const checkLogDialog = (id) => {
            // console.log(id);
            data.id=id
            handleLog();
            logVisible.value = true;
        };

        // 查看日志
        const handleLog = () => {
            data.logTableData = [];
            data.loading = true;
            let logData = {
                current: data.pageableLog.current,
                size: data.pageableLog.size || 10,
                transferCode:data.id,
                isAbnormal: true,
            };
            // 日志请求修改
            AJAX_getAllotList_log(logData).then((res) => {
                if (res.code == 200) {
                    data.logTableData = res.data.records;
                    data.pageableLog.size = res.data.size;
                    data.pageableLog.current = res.data.current;
                    data.pageableLog.total = res.data.total;
                    data.loading = false;
                } else {
                    data.loading = false;
                    vue.$message({
                        type: "warning",
                        message: res.msg,
                    });
                }
            });
        };
        // 日志每页条数发生改变
        const handleSizeChangeLog = (val) => {
            data.pageableLog.current = 1;
            data.pageableLog.size = val;
            handleLog();
        };
        // 日志当前页发生改变
        const handleCurrentChangeLog = (val) => {
            data.pageableLog.current = val;
            handleLog();
        };

        // closed 关闭弹框回调
        const closed = () => {
            data.logTableData = [];
            logVisible.value = false;
        };

        return {
            ...refData,
            checkLogDialog,
            closed,
            handleSizeChangeLog,
            handleCurrentChangeLog,
            logVisible
        };
    },
};
</script>
<style scoped lang='scss'>
#AllocatingAbnormalLog {
    .log-pagination {
        display: flex;
        justify-content: flex-end;
        position: static;
        bottom: 0;
        right: 0;
        background: #fff;
        border: none;
        border-radius: 50px;
    }

    :deep(.el-dialog__header) {
        margin-right: 0;
    }
}
</style>



