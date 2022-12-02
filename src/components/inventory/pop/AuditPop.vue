<!-- 审核弹窗 AuditPop-->
<template>
    <div id='AuditPop'>
        <el-dialog title="仓管审核" width="50%" v-model="data.addVisible" :close-on-click-modal="false"
            @close="closedChild" :close-on-press-escape="false">
            <div class="as-radio">
                <el-radio v-model="data.isPass" :label="true">审核通过</el-radio>
                <el-radio v-model="data.isPass" :label="false">审核驳回</el-radio>
            </div>
            <span v-if="data.isPass">
                <div class='notice'>审核通过</div>
                <div class='lineHeight'>确认所选盘点信息通过？</div>
            </span>
            <span v-else>
                <div class='notice'>驳回确认</div>
                <div class='lineHeight'>确认所选盘点信息驳回？</div>
            </span>
            <el-input type="textarea" :placeholder="data.isPass ? '通过说明' : '驳回说明'" v-model="data.textarea"
                :autosize="{ minRows: 4, maxRows: 6 }" maxlength="100" show-word-limit>
            </el-input>
            <template #footer>
                <div class="dialog-footer ">
                    <el-button @click="closedChild" size="small" :disabled="data.btnLoading" :loading="data.btnLoading">取
                        消
                    </el-button>
                    <el-button type="primary" @click="onSubmit" :disabled="data.btnLoading" :loading="data.btnLoading"
                        size="small">确 认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import {
    reactive,
    getCurrentInstance,
    inject
} from "vue";
const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
const data = reactive({
    addVisible: false,
    textarea: '',
    btnLoading: false,
    checkNumber: '',
    isPass: true
});
//关闭
const closedChild = () => {
    data.addVisible = false;
    data.textarea = ''
    data.checkNumber = ''
    data.isPass = true
}
const getTableData = inject("getTableData");
const closed = inject("closed");
//确定
const onSubmit = () => {
    if (data.textarea.trim()) {
        data.btnLoading = true
        api.inventory.checkWarehouseAudit({ checkNumber: data.checkNumber, rejectRemark: data.textarea, isPass: data.isPass }).then(res => {
            if (res.code == 200) {
                vue.$message.success(res.msg)
                data.btnLoading = false
                getTableData()
                closedChild()
                closed()
            } else {
                data.btnLoading = false
                vue.$message.warning(res.msg)
            }
        }).catch(() => {
            data.btnLoading = false
        })
    } else {
        vue.$message.warning(data.isPass ? '请输入通过说明' : '请输入驳回说明')
    }
}

// 弹窗控制
const checkDialog = (checkNumber) => {
    data.addVisible = true;
    data.checkNumber = checkNumber;
};
defineExpose({ checkDialog });
</script>
<style scoped lang='scss'>
#AuditPop {
    .as-radio {
        margin: 10px 0;
    }

    .notice {
        font-size: 17px;
        font-weight: bold;
    }

    .lineHeight {
        line-height: 40px;
    }

    :deep(.el-dialog__header) {
        margin-right: 0;
    }
}
</style>