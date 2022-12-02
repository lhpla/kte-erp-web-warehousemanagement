<!-- 中转盘点单审核 TransitAudit-->
<template>
    <div id='TransitAudit'>
        <el-dialog :title="data.title" width="90%" v-model="data.addVisible" :close-on-click-modal="false"
            @close="closed" :close-on-press-escape="false">
            <el-form ref="ruleRef" label-width="130px" :inline="true" :model="data.ruleForm" :rules="data.rules"
                class="demo-form-inline el-from form">
                <el-form-item label="盘点单号:" prop="checkNumber">
                    {{ data.ruleForm.checkNumber }}
                </el-form-item>
                <el-form-item label="仓库名称:" prop="transferWarehouse">
                    {{ data.ruleForm.transferWarehouse }}
                </el-form-item>
                <el-form-item label="盘点维度:" prop="checkDimensions">
                    {{ data.ruleForm.checkDimensions }}
                </el-form-item>
                <br />
                <el-form-item label="创建人:" prop="createUserName">
                    {{ data.ruleForm.createUserName }}
                </el-form-item>
                <el-form-item label="创建时间:" prop="createTime">
                    {{ data.ruleForm.createTime }}
                </el-form-item>
                <el-form-item label="更新人:" prop="updateUserName">
                    {{ data.ruleForm.updateUserName }}
                </el-form-item>
                <el-form-item label="更新时间:" prop="updateTime">
                    {{ data.ruleForm.updateTime }}
                </el-form-item>
                <br />
                <el-form-item v-if="data.checkPhase !== 1 && data.showRemark" :label="data.label" prop="remark">
                    {{ data.ruleForm.remark }}
                </el-form-item>

            </el-form>
            <el-divider></el-divider>
            <el-form ref="ruleRef" label-width="80px" :inline="true" :model="data.searchForm" :rules="data.rules"
                class="demo-form-inline el-from form">
                <el-form-item label="SKU:" prop="sku">
                    <el-input placeholder="双击批量查询" v-model="data.searchForm.sku"
                        @dblclick="openInput(data.searchForm.sku, 'sku')" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="柜号:" prop="cabinetNum">
                    <el-input placeholder="双击批量查询" v-model="data.searchForm.cabinetNum"
                        @dblclick="openInput(data.searchForm.cabinetNum, 'cabinetNum')" clearable></el-input>
                </el-form-item>
                <el-form-item label="数据筛选:" prop="isDifferenceDetails" v-show="data.isShow">
                    <el-radio-group v-model="data.searchForm.isDifferenceDetails" @change="search">
                        <el-radio-button :label="false">所有数据</el-radio-button>
                        <el-radio-button :label="true">差异数据</el-radio-button>
                    </el-radio-group>
                </el-form-item>

                <el-button size="small" type="primary" class="margin-left" @click="search">搜 索
                </el-button>
            </el-form>
            <div class="margin-top">
                <el-table v-loading="data.tableLoading" :data="data.tableData" border style="width: 100%"
                    max-height="500" :header-cell-style="{
                        background: '#fafafa',
                        color: '#2d2f30',
                        fontWeight: 'bold',
                        fontSize: '12px',
                    }">
                    <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
                    <el-table-column label="SKU" prop="sku"></el-table-column>
                    <el-table-column label="仓区" prop="purposeWarehouse"></el-table-column>
                    <el-table-column label="柜号" prop="cabinetNum"></el-table-column>
                    <el-table-column label="容器码" prop="containerCode"></el-table-column>
                    <el-table-column label="运输方式" prop="transportMode"></el-table-column>
                    <el-table-column label="箱号" prop="cartonNum"></el-table-column>
                    <el-table-column label="长宽高(cm)" prop="purposeWarehouse">
                        <template #default="scope">
                            <span>
                                {{ scope.row.length }}*{{ scope.row.width }}*{{ scope.row.height }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="系统数量" prop="number"></el-table-column>
                    <el-table-column label="初盘数量" prop="firstCheckNumber"></el-table-column>
                    <el-table-column label="复盘数量" prop="pluralCheckNumber"></el-table-column>
                    <el-table-column label="终盘数量" prop="finalCheckNumber"></el-table-column>
                    <el-table-column label="差异值" prop="differenceValue">
                        <template #default="scope">
                            <span
                                :class="scope.row.differenceValue == 0 ? '' : scope.row.differenceValue > 0 ? 'green' : 'red'">
                                {{ scope.row.differenceValue }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="结果" prop="res">
                        <template #default="scope">
                            <span :class="scope.row.result == '盘平' ? '' : scope.row.result == '盘盈' ? 'green' : 'red'">
                                {{ scope.row.result }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="盘点备注" prop="checkRemark"></el-table-column>
                </el-table>
            </div>
            <el-pagination class="log-pagination" background @size-change="handleSizeChangeLog"
                @current-change="handleCurrentChangeLog" :current-page="data.pageableLog.current"
                :page-sizes="[100, 200, 300, 500]" :page-size="data.pageableLog.size"
                layout="total, sizes, prev, pager, next, jumper" :total="data.pageableLog.total"></el-pagination>
            <template #footer>
                <div class="dialog-footer " v-if="data.title && data.title !== '盘点详情'">
                    <el-button @click="closed" size="small" :disabled="data.btnLoading" :loading="data.btnLoading">取 消
                    </el-button>
                    <el-button type="primary" v-if="data.title && data.title == '盘点录入'" @click="onSubmit"
                        :disabled="data.btnLoading" :loading="data.btnLoading" size="small">确 认
                    </el-button>
                    <el-button v-if="data.title && data.title == '盘点审核'" type="primary" @click="onAudit"
                        :disabled="data.btnLoading" :loading="data.btnLoading" size="small">审 核
                    </el-button>
                </div>
                <div class="dialog-footer" v-if="data.status == 'completed'">
                    <el-button type="primary" @click="printBoxLabel" size="small">打印箱标
                    </el-button>
                </div>
            </template>
            <AuditPop ref="AuditPopRef"></AuditPop>
        </el-dialog>
    </div>
</template>

<script setup>
import {
    reactive,
    getCurrentInstance,
    ref,
    watch,
    nextTick,
    provide,
    toRefs, onBeforeMount, onMounted,
} from "vue";
import AuditPop from "./AuditPop.vue"
import { getLodop } from "@/utils/LodopFuncs";
const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
const data = reactive({
    addVisible: false,
    textarea: '',
    btnLoading: false,
    tableLoading: false,
    pageableLog: {
        current: 1,
        size: 100,
        total: 0,
    },
    ruleForm: {},
    searchForm: {
        isDifferenceDetails: false
    },
    tableData: [],
    showMessage: false,
    isShow: false,
    title: '',
    checkPhase: '',//盘点状态
    label: '',//备注说明label
    showRemark: true,//是否展示相关驳回原因
    status: ''
});

//关闭
const closed = () => {
    data.addVisible = false;
    data.searchForm.isDifferenceDetails = false;
}
provide("closed", closed);
//确定
const onSubmit = () => { }

//审核
const onAudit = () => {
    vue.$refs.AuditPopRef.checkDialog(data.ruleForm.checkNumber)
}

//搜索
const search = () => {
    getDetail(data.searchForm)
}

// 弹窗控制
const checkDialog = (row, isShow, title) => {
    if (row.status == 'finance_pending') {
        data.label = '仓管审核通过说明:'
    } else if (row.status == 'to_bo_counted') {
        data.label = '仓管审核驳回说明:'
    } else if (row.status == 'completed') {
        data.label = '财务审核通过说明:'
    } else if (row.status == 'reject_pending_inventory') {
        data.label = '财务审核驳回说明:'
    } else {
        data.showRemark = false
    }
    data.status = row.status
    data.addVisible = true;
    data.isShow = isShow
    data.title = title
    data.checkPhase = row.checkPhase
    data.searchForm.checkNumber = row.checkNumber
    data.searchForm.id = row.id
    data.searchForm.type = 'list'
    getDetail({ checkNumber: row.checkNumber, id: row.id, type: 'list', current: 1, size: 100, isDifferenceDetails: false })
};
//获取数据
const getDetail = msg => {
    data.tableLoading = true
    api.inventory.checkListDetails(msg).then(res => {
        data.tableData = []
        if (res.code == 200) {
            data.ruleForm = res.data
            data.tableData = res.data.detailsData.records
            data.pageableLog.current = res.data.detailsData.current;
            data.pageableLog.size = res.data.detailsData.size;
            data.pageableLog.total = res.data.detailsData.total;
            data.tableLoading = false
        } else {
            data.tableLoading = false
            vue.$message.warning(res.msg)
        }
    }).catch(() => {
        data.tableLoading = false
    })
}
// 每页条数发生改变
const handleSizeChangeLog = val => {
    data.pageableLog.size = val;
    data.pageableLog.pageNum = 1;
    data.searchForm.current = 1;
    data.searchForm.size = val;
    getDetail(data.searchForm)
};
//当前页发生改变
const handleCurrentChangeLog = val => {
    data.pageableLog.current = val;
    data.searchForm.current = val;
    getDetail(data.searchForm)
};
const temp = ref("");
//批量搜索
const openInput = (info, name) => {
    data.showMessage = true;
    vue
        .$prompt("可输入多个，以英文分号、逗号、空格或者回车隔开", "批量查询", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputValue: info,
            inputType: "textarea",
            inputValidator: (value) => {
                if (value && value.length > 500) {
                    return "输入字符不能大于500 ";
                }
            },
        })
        .then(({ value }) => {
            data.searchForm[name] = temp.value
                .trim()
                .replaceAll("\n", ";")
                .replaceAll(" ", ";")
                .replaceAll(",", ";")
                .replaceAll("，", ";")
                .replaceAll("；", ";");
            data.searchForm[name] = data.searchForm[name]
                .split(";")
                .filter((item) => item !== "")
                .join(";");
            data.showMessage = false;
            temp.value = "";
        })
        .catch(() => {
            temp.value = "";
            data.showMessage = false;
        });
};

watch(
    () => data.showMessage,
    (val) => {
        if (val) {
            nextTick(() => {
                let textarea = document.getElementsByTagName("textarea")[0];
                textarea.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        const index = handleInputREnter(e);
                        textarea.value = textarea.value.substring(0, index) + "\n" + textarea.value.substring(index);
                    }
                    temp.value = textarea.value;
                });
                textarea.addEventListener("input", () => {
                    temp.value = textarea.value;
                });
            });
        }
    }
);
const handleInputREnter = (e) => {
    const index = e.srcElement.selectionStart;
    return index;
};

//打印箱标 （盘盈、盘亏）
//打印箱标
const printBoxLabel = () => {
    vue.$confirm(` `, {
        title: "提示",
        message: "点击确定打印当前盘点单的盘盈和盘亏数据的箱标！",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        api.inventory.getBoxLabel({ checkNumber: data.ruleForm.checkNumber }).then(res => {
            if (res.code == 200) {
                console.log(res);
                if (res.data.length > 0) {
                    let LODOP = getLodop();
                    if (typeof LODOP == "string") {
                        vue.$message.warning({
                            dangerouslyUseHTMLString: true,
                            message: LODOP,
                        });
                        return;
                    }
                    let datas = [];
                    for (let item of res.data) {
                        let obj = {
                            cartonNum: item.casesNum,
                            encasementNum: item.skuNum,
                            num: 1,
                            sku: "200-" + item.sku,
                            warehouse:
                                item.transferWarehouse.indexOf("TS") != -1
                                    ? item.purposeWarehouse + "-TS"
                                    : item.purposeWarehouse,
                            cabinetNum: item.cabinetNum,
                            drawback: item.isDrawback ? "是" : "-",
                            isPhoto: item.isPhotograph ? "【拍照】" : "",
                        };
                        datas.push(obj);
                    }
                    vue.$printFn(LODOP, datas, "cartonNum");
                }
            } else {
                vue.$message.warning(res.msg)
            }
        })
    }).catch(() => {

    })



}
defineExpose({ checkDialog });
</script>
<style scoped lang='scss'>
#TransitAudit {
    overflow-y: scroll;

    :deep(.el-form-item) {
        margin-bottom: 0px
    }

    :deep(.el-divider--horizontal) {
        margin: 5px 0 10px 0;
    }

    :deep(.el-table) {
        margin-bottom: 10px;
    }

    .margin-left {
        margin-left: 50px
    }

    .red {
        color: red;
    }

    .green {
        color: green;
    }

    .margin-top {
        margin-top: 10px;
        margin-bottom: 52px;
    }

    :deep(.el-dialog__header) {
        margin-right: 0;
    }
}
</style>