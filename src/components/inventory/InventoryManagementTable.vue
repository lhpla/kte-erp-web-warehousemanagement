<!-- 盘点管理表格 InventoryManagementTable -->
<template>
    <div id="InventoryManagementTable">
        <div class="table-box">
            <div class="table-header">
                <!-- -->
                <el-button type="primary" size="small" @click="downloadQueue" v-if="buttonAuthor.downloadQueue">下载队列
                </el-button>
                <el-dropdown class="margin-right" v-if="buttonAuthor.set">
                    <el-button type="primary" size="small">
                        创建盘点单
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="createStraight" v-if="buttonAuthor.add">直发仓
                            </el-dropdown-item>
                            <el-dropdown-item @click="createTransit" v-if="buttonAuthor.update">中转仓
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-button type="primary" size="small" @click="exportResult" v-if="buttonAuthor.export">导出盘点结果
                </el-button>
                <el-button type="primary" size="small" @click="exportInventory" v-if="buttonAuthor.authorization">导出盘点数据
                </el-button>
            </div>
        </div>
        <!-- 下载队列 -->
        <DownListTable ref="DownListTableRef"></DownListTable>
        <!-- 创建直发盘点单 -->
        <CreateStraight ref="CreateStraightRef"></CreateStraight>
        <!-- 创建中转盘点单 -->
        <CreateTransit ref="CreateTransitRef"></CreateTransit>
        <el-table v-loading="props.tableLoading" :data="props.tableData" border height="calc(100vh - 300px)"
            style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{
                background: '#fafafa',
                color: '#2d2f30',
                fontWeight: 'bold',
                fontSize: '12px',
            }">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="盘点单号" prop="checkNumber">
                <template #default="scope">
                    <div class="oder-color nameHover" @click="view(scope.row)">
                        {{ scope.row.checkNumber }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="仓库" prop="transferWarehouse"></el-table-column>
            <el-table-column label="盘点阶段" prop="checkPhase">
                <template #default="scope">
                    <span v-if="scope.row.checkPhase">
                        <div v-if="scope.row.checkPhase == 3">
                            终盘
                        </div>
                        <div v-if="scope.row.checkPhase == 2">
                            复盘
                        </div>
                        <div v-if="scope.row.checkPhase == 1">
                            初盘
                        </div>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="人员">
                <template #default="scope">
                    <span>
                        <div>
                            创建人员：{{
                            scope.row.createUserName ? scope.row.createUserName : "-"
                            }}
                        </div>
                        <div>
                            更新人员：{{ scope.row.updateUserName ? scope.row.updateUserName : "-" }}
                        </div>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="时间" width="200">
                <template #default="scope">
                    <span>
                        <div>
                            创建时间：{{
                            scope.row.createTime ? scope.row.createTime : "-"
                            }}
                        </div>
                        <div>
                            更新时间：{{ scope.row.updateTime ? scope.row.updateTime : "-" }}
                        </div>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="status">
                <template #default="scope">
                    <div v-if="scope.row.status">
                        {{ tableTypeComputed(data.warehouse_check_status, scope.row.status) }}
                    </div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="80px">
                <template #default="scope">
                    <div class="oper">
                        <el-button type="primary" text @click="view(scope.row)" v-if="buttonAuthor.view">
                            详 情</el-button>
                        <el-button type="primary" text @click="journal(scope.row.id)" v-if="buttonAuthor.log">日 志
                        </el-button>
                        <el-button type="primary" text @click="importData(scope.row.checkNumber)"
                            v-if="buttonAuthor.edit && scope.row.status == 'to_bo_counted' || scope.row.status == 'reject_pending_inventory'">
                            导 入
                        </el-button>
                        <!-- <el-button type="primary" text  @click="entry(scope.row)"  v-if="scope.row.status == 'to_bo_counted'||scope.row.status == 'reject_pending_inventory'">录 入</el-button> -->
                        <el-button type="primary" text @click="invalidData(scope.row.checkNumber)"
                            v-if="buttonAuthor.abandoned && scope.row.status == 'to_bo_counted' || scope.row.status == 'warehouse_pending_review'">
                            作 废
                        </el-button>
                        <el-button type="primary" text @click="audit(scope.row)"
                            v-if="buttonAuthor.audit && scope.row.status == 'warehouse_pending_review'">审 核</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 审核 -- 直发 -->
        <StraightAudit ref="StraightAuditRef"></StraightAudit>
        <!-- 审核 -- 中转 -->
        <TransitAudit ref="TransitAuditRef"></TransitAudit>
        <!-- 导入 -->
        <ImportData ref="ImportDataRef" />
        <!-- 作废 -->
        <InvalidData ref="InvalidDataRef" />
        <!-- 日志 -->
        <LogDialogUpdate ref="LogDialogUpdateRef"> </LogDialogUpdate>
    </div>
</template>

<script setup>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, computed, nextTick } from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import ImportData from "./pop/ImportData.vue";
import InvalidData from "./pop/InvalidData.vue";
import CreateStraight from "./pop/CreateStraight.vue";
import CreateTransit from "./pop/CreateTransit.vue";
import StraightAudit from "./pop/StraightAudit.vue";
import TransitAudit from "./pop/TransitAudit.vue";
import DownListTable from "./pop/DownListTable.vue";
import LogDialogUpdate from "@/components/logDialog/LogDialogUpdate.vue"
import { localGet, parseTime } from "@/utils/util";
const { BUTTONS } = authorButtons();
const buttonAuthor = BUTTONS.value;
onBeforeMount(() => { });
onMounted(() => {
});
const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
const getTableData = inject("getTableData");
const props = defineProps(['tableData', 'tableLoading'])
const data = reactive({
    selectList: [],
    // 盘点状态
    warehouse_check_status: [],
});
onMounted(() => {
    //盘点状态
    data.warehouse_check_status = localGet("purchaseDict").warehouse_check_status
        ? localGet("purchaseDict").warehouse_check_status
        : [];
});
// 计算表格字典
const tableTypeComputed = computed(() => {
    return function (list, dizKey) {
        if (list && list.length > 1 && dizKey !== -1) {
            for (let item of list) {
                if (dizKey == item.dizKey) {
                    return item.value;
                }
            }
        }
    };
});
//选择数据
const handleSelectionChange = (val) => {
    data.selectList = val
};

//导入
const importData = checkNumber => {
    vue.$refs.ImportDataRef.checkDialog(checkNumber)
}
//作废
const invalidData = checkNumber => {
    vue.$refs.InvalidDataRef.checkDialog(checkNumber)
}
// 跳转路由
const jump = (path) => {
    let { href } = vue.$router.resolve({
        path,
    });
    window.open(href);
};
//journal 日志
const journal = (id) => {
    let msg = {
        servers: "inventory",
        dataApi: "getLogList",
        params: { id: id, }
    };
    nextTick(() => {
        vue.$refs.LogDialogUpdateRef.checkLogDialog(msg);
    });
};

//下载队列
const downloadQueue = () => {
    vue.$refs.DownListTableRef.getMsg()
}

//导出盘点结果
const exportResult = () => {
    if (data.selectList.length) {
        let arr = []
        data.selectList.map(item => {
            arr.push(item.checkNumber)
        })
        api.inventory.checkResultExcelExport({ codes: arr, fileName: parseTime(new Date(), '{y}-{m}-{d}') }).then(res => {
            if (res.code == 200) {
                vue.$message.success(res.msg)
            } else {
                vue.$message.warning(res.msg)
            }
        })
    } else {
        vue.$message.warning('请勾选数据！')
    }

}

//导出盘点数据
const exportInventory = () => {
    if (data.selectList.length) {
        let arr = []
        data.selectList.map(item => {
            arr.push(item.checkNumber)
        })
        api.inventory.checkDataExcelExport({ codes: arr, fileName: parseTime(new Date(), '{y}-{m}-{d}') }).then(res => {
            if (res.code == 200) {
                vue.$message.success(res.msg)
            } else {
                vue.$message.warning(res.msg)
            }
        })
    } else {
        vue.$message.warning('请勾选数据！')
    }
}

//创建直发盘点单
const createStraight = () => {
    vue.$refs.CreateStraightRef.checkDialog()
}
//创建中转盘点单
const createTransit = () => {
    vue.$refs.CreateTransitRef.checkDialog()
}

//审核
const audit = row => {
    if (row.isDirect) {
        //直发
        vue.$refs.StraightAuditRef.checkDialog(row, true, '盘点审核')
    } else {
        //中转
        vue.$refs.TransitAuditRef.checkDialog(row, true, '盘点审核')
    }

}
//详情
const view = row => {
    if (row.isDirect) {
        //直发
        vue.$refs.StraightAuditRef.checkDialog(row, true, '盘点详情')
    } else {
        //中转
        vue.$refs.TransitAuditRef.checkDialog(row, true, '盘点详情')
    }
}
//录入
const entry = row => {
    if (row.isDirect) {
        //直发
        vue.$refs.StraightAuditRef.checkDialog(row, false, '盘点录入')
    } else {
        //中转
        vue.$refs.TransitAuditRef.checkDialog(row, false, '盘点录入')
    }

}
</script>
<style scoped lang='scss'>
#InventoryManagementTable {
    :deep(.el-dropdown) {
        margin-right: 10px;
        margin-left: 10px;
    }
}
</style>