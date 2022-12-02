<!-- 作废盘点单 InvalidData -->
<template>
    <div id="InvalidData">
        <el-dialog title="操作确认" width="50%" v-model="data.addVisible" :close-on-click-modal="false" @close="closed" :close-on-press-escape="false">
            <div class='notice'>作废确认</div>
            <div class='lineHeight'>确认所选选品信息进行作废？</div>
            <el-input type="textarea" placeholder="作废说明" v-model="data.textarea" :autosize="{ minRows: 4, maxRows: 6 }"
                maxlength="500" show-word-limit>
            </el-input>
            <template #footer>
                <div class="dialog-footer ">

                    <el-button @click="closed" size="small" :disabled="data.btnLoading" :loading="data.btnLoading">取 消
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
    defineComponent,
    reactive,
    toRefs,
    onMounted,
    getCurrentInstance,
    ref,
    inject
} from "vue";
const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
const getTableData = inject("getTableData");
const data = reactive({
    addVisible: false,
    textarea: '',
    btnLoading: false,
    checkNumber: ''
});
//关闭
const closed = () => {
    data.addVisible = false;
    data.textarea = ''
}

//确定
const onSubmit = () => {
    if (data.textarea.trim()) {
        data.btnLoading = true
        api.inventory.checkNumberOutOfDate({ checkNumber: data.checkNumber, instructionManual: data.textarea }).then(res => {
            if (res.code == 200) {
                vue.$message.success(res.msg)
                data.btnLoading = false
                closed()
                getTableData()
            } else {
                data.btnLoading = false
                vue.$message.warning(res.msg)
            }
        }).catch(() => {
            data.btnLoading = false
        })
    } else {
        vue.$message.warning('请输入作废说明')
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
#InvalidData {
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