<!-- 批量修改毛重、包装尺寸 UpdateDialog-->
<template>
    <div id='UpdateDialog1'>
        <el-dialog v-model="UpdateDialogVisible" title="修改" width="60%" @close="handleClose" destroy-on-close
            :close-on-click-modal="false">
            <vxe-table :data="tableData" border :column-config="{ resizable: true }" :row-config="{ isHover: true}"
                :loading="tableLoading">
                <vxe-column title="sku" field="sku" align="center" width="100"></vxe-column>
                <vxe-column title="产品名称" field="sku" align="center"></vxe-column>
                <vxe-column title="尺寸（长宽高）cm" align="center" min-width="160">
                    <template #default="{ row,rowIndex }">
                        <div class="input_box">
                            <span>
                                <el-form :model="row" :rules="rules" :ref="`size_${rowIndex}`"
                                    style="display: flex; padding-left: 10px" @submit.native.prevent>

                                    <el-form-item prop="domesticLength">
                                        <span> 长 </span><span>
                                            <el-input v-model="row.domesticLength" style="width: 85px">
                                            </el-input>
                                        </span>
                                    </el-form-item>

                                    <el-form-item prop="domesticWidth">
                                        <span style="margin-left: 5px"> 宽 </span> <span>
                                            <el-input v-model="row.domesticWidth" style="width: 85px">
                                            </el-input>
                                        </span>
                                    </el-form-item>

                                    <el-form-item prop="domesticHeight">
                                        <span style="margin-left: 5px"> 高 </span><span>
                                            <el-input v-model="row.domesticHeight" style="width: 85px">
                                            </el-input>
                                        </span>
                                    </el-form-item>
                                </el-form>
                            </span>
                        </div>
                    </template>
                </vxe-column>
                <vxe-column title="毛重（kg）" align="center" width="105">
                    <template #default="{ row,rowIndex }">
                        <el-form :model="row" :rules="rules" :ref="`grossWeight_${rowIndex}`">
                            <el-form-item prop="grossWeight">
                                <el-input v-model="row.grossWeight" clearable style="width: 90px">
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </template>
                </vxe-column>
            </vxe-table>
            <div style="color: red; margin-top: 5px;">注：已收货状态的SKU才能进行修改。</div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose" size="small" :disabled="tableLoading" :loading="tableLoading">取 消
                    </el-button>
                    <el-button type="primary" @click="onSubmit" :disabled="tableLoading" :loading="tableLoading"
                        size="small">确 定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, inject } from 'vue';

const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
const UpdateDialogVisible = ref(false)
const props = defineProps(['logisticsNumCope'])
const refreshSeach = inject('refreshSeach')
const tableData = ref([])
const tableLoading = ref(false)
const rules = {
    domesticLength: [
        { required: true, message: "请输入", trigger: "blur" },
        {
            pattern: /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/,
            message: "正数，两位小数",
            trigger: "blur",
        },
    ],
    domesticWidth: [
        { required: true, message: "请输入", trigger: "blur" },
        {
            pattern: /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/,
            message: "正数，两位小数",
            trigger: "blur",
        },
    ],
    domesticHeight: [
        { required: true, message: "请输入", trigger: "blur" },
        {
            pattern: /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/,
            message: "正数，两位小数",
            trigger: "blur",
        },
    ],
    grossWeight: [
        { required: true, message: "请输入", trigger: "blur" },
        // { max: 8, message: "长度不超过8字符", trigger: "change" },
        { pattern: /(^[1-9]([0-9]{0,7})?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: "8位正数,2位小数" },
    ],
}
const openDialog = (list) => {
    tableData.value = JSON.parse(JSON.stringify(list))
    UpdateDialogVisible.value = true
}
const handleClose = () => {
    tableData.value = []
    UpdateDialogVisible.value = false
}
const onSubmit = () => {
    const validateMethods = [];
    tableData.value.forEach((row, index) => {
        console.log(vue.$refs)
        if (vue.$refs[`size_${index}`]) {
            validateMethods.push(vue.$refs[`size_${index}`].validate());
        }
        if (vue.$refs[`grossWeight_${index}`]) {
            validateMethods.push(vue.$refs[`grossWeight_${index}`].validate());
        }
    });
    Promise.all(validateMethods)
        .then(() => {
            tableLoading.value = true;
            api.warehouse.updateSkuSizeAndWeight(tableData.value).then((res) => {
                if (res.code == 200) {
                    vue.$message.success(res.msg);
                    refreshSeach(props.logisticsNumCope)
                    handleClose();
                } else {
                    vue.$message.warning(res.msg);
                }
                tableLoading.value = false;
            });
        })
        .catch(() => {
            vue.$message.error("表单填写有误,请检查");
            tableLoading.value = false;
        });
};
defineExpose({ openDialog })
</script>

<style scoped lang='scss'>
#UpdateDialog1 {
    .input_box {
        display: flex;
        justify-content: center;
    }
}
</style>