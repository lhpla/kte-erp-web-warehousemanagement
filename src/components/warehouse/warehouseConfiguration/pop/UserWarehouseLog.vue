<!-- 国内仓配置 用户仓库日志 -->
<template>
    <div id="UserWarehouseLog">
        <!-- 日志dialog -->
        <el-dialog :title="tranWarehouseName + '-绑定日志'" width="80%" v-model="logVisible" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-table  :header-cell-style="{
              background: '#fafafa',
              color: '#2d2f30',
              fontWeight: 'bold',
              fontSize: '12px',
            }" :data="logTableData" tooltip-effect="dark" max-height="530"
                element-loading-text="加载中" v-loading="loading" border>
                <el-table-column label="#" type="index" align="center" width="100"></el-table-column>
                <el-table-column prop="createUserName" label="操作人" width="110"></el-table-column>
                <el-table-column prop="message" label="操作内容"></el-table-column>
                <el-table-column prop="createTime" label="操作时间" width="180"></el-table-column>
            </el-table>
            <el-pagination class="log-pagination" background @size-change="handleSizeChangeLog"
                @current-change="handleCurrentChangeLog" :current-page="pageableLog.current"
                :page-sizes="[10, 25, 50, 100]" :page-size="pageableLog.size"
                layout="total, sizes, prev, pager, next, jumper" :total="pageableLog.total">
            </el-pagination>
        </el-dialog>
    </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from 'vue';
export default {
    name: 'UserWarehouseLog',
    props: {
        tranWarehouseName: {
            type: String,
            default: ''
        }
    },
    setup(prop, ctx) {
        const data = reactive({
            logVisible: false,
            funMsg: {},
            // log日志表格数据
            logTableData: [],
            // 操作日志
            logVisible: false,
            // 日志分页
            pageableLog: {
                current: 1,
                size: 10,
                total: 0,
            },
            // 加载loading
            loading: false,
        });
        const { ctx: vueDev, proxy: vue } = getCurrentInstance();
        const api = vue.$http;
        onBeforeMount(() => { });
        onMounted(() => { });
        const refData = toRefs(data);
        // 日志每页条数发生改变
        const handleSizeChangeLog = val => {
            data.pageableLog.size = val;
            handleLog();
        };
        // 日志当前页发生改变
        const handleCurrentChangeLog = val => {
            data.pageableLog.current = val;
            handleLog();
        };
        // 打开loading
        const checkLogDialog = funMsg => {
            data.pageableLog = { current: 1, size: 10, total: 0 };
            data.logVisible = true;
            data.funMsg = funMsg;
            handleLog();
        };
        // 查看日志
        const handleLog = () => {
            let logData = {};
            logData = {
                tranWarehouseId: data.funMsg.tranWarehouseId,
                current: data.pageableLog.current,
                size: data.pageableLog.size,
            };

            api[data.funMsg.servers][data.funMsg.dataApi](logData).then(res => {
                data.logTableData = res.data.records;
                data.pageableLog = res.data;
            });
        };
        return {
            ...refData,
            handleSizeChangeLog,
            handleCurrentChangeLog,
            checkLogDialog,
        };
    },
};
</script>
<style scoped lang='scss'>
#UserWarehouseLog {
    .log-pagination {
        display: flex;
        justify-content: flex-end;
        position: static;
        bottom: 0;
        right: 0;
        background: #fff;
        border: none;
        border-radius: 50px;
        margin: 0 0 10px 0;
    }

    :deep(.el-dialog__header) {
        margin-right: 0;
    }
}
</style>