<!-- 盘点单导入 ImportData -->
<template>
    <div id="ImportData">
        <el-dialog title="盘点-导入盘点数据" width="50%" v-model="data.addVisible" :close-on-click-modal="false" @close="closed"
            :close-on-press-escape="false">
            <div class="box">
                <div class="contant">
                    <div class="label">
                        <span>*</span><span>导入文件：</span>
                    </div>
                    <div>
                        <el-button size="small" @click="uploadTrigger" :loading="data.upLoading"
                            :disabled="data.upLoading">
                            <el-icon>
                                <ElUploadFilled />
                            </el-icon>选择上传文件
                        </el-button>
                    </div>
                    <!-- <el-button size="small" @click="downloadTemp" type="text" class="downloadTemp">下载模板</el-button> -->
                    <input type="file" accept=".xlsx" ref="uploadExcelFrom" @change="uploadChange"
                        style="display: none" />
                </div>
                <div>
                    <span class="text">{{ data.resultMsg }}</span>
                    <el-button size="small" @click="downloadFailTemp" type="text" v-if="data.errorKey">下载导入缺失数据
                    </el-button>
                </div>
            </div>
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
    provide,
    onBeforeMount,
    ref,
    inject
} from "vue";
import tablePage from "@/compositionApi/tablePage";
import { download } from "@/utils/util";
const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
const data = reactive({
    addVisible: false,
    promptVisible: false,
    funMsg: {},
    infoValue: {},
    upLoading: false,
    errorKey: false,
    resultMsg: '',
    checkNumber: '',
});
const { downloadTemplate } = tablePage();
// 下载失败数据
const downloadFailTemp = () => {
    console.log("data.funMsg", data.funMsg);
    // downloadTemplate(data.funMsg.fail, '失败数据', data.errorKey ? { errorKey: data.errorKey } : []);
    api.inventory.checkDataExcelFailExport({ checkNumber: data.checkNumber }).then(res => {
        let tempName = "失败数据";
        let fileType = ".xlsx";
        const blob = new Blob([res], {
        });
        if ("msSaveOrOpenBlob" in navigator) {
            window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
            return;
        }
        const blobUrl = window.URL.createObjectURL(blob);
        download(blobUrl, tempName, fileType);
    })
};
const uploadExcelFrom = ref(null);
// 上传
const uploadTrigger = () => {
    // 解决同名文件无法监听上传问题，必须要写在点击file前面
    uploadExcelFrom.value.value = null;
    uploadExcelFrom.value.click();
};
//关闭弹窗
const closed = () => {
    data.errorKey = false
    data.resultMsg = ''
    data.addVisible = false
}
// 弹窗控制
const checkDialog = (checkNumber) => {
    data.addVisible = true;
    data.checkNumber = checkNumber;
};
const getTableData = inject("getTableData");
// 上传文件
const uploadChange = () => {
    let uploadExcelFile = uploadExcelFrom.value.files[0];
    if (uploadExcelFile.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || uploadExcelFile.type == "application/vnd.ms-excel") {
    } else {
        return vue.$message.warning('上传文件只能是 xls/xlsx 格式!')
    }
    let excelData = new FormData();
    excelData.append("file", uploadExcelFile);
    excelData.append("checkNumber", data.checkNumber);
    if (uploadExcelFile.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || uploadExcelFile.type == "application/vnd.ms-excel") {
    } else {
        return vue.$message.warning('上传文件只能是 xls/xlsx 格式!')
    }
    data.upLoading = true;
    api.inventory
        .checkDataExcelImport(excelData)
        .then(res => {
            if (res.code == 200) {
                data.upLoading = false;
                vue.$message.success(res.msg)
                closed()
                getTableData();
            } else {
                vue.$message.error(res.msg);
                data.resultMsg = res.msg
                data.errorKey = true
                data.upLoading = false;
            }
        })
        .catch(error => {
            data.upLoading = false;
        });

};
defineExpose({ checkDialog });
</script>
<style scoped lang='scss'>
#ImportData {
    .box {
        padding: 20px;
        margin-bottom: 20px;
    }

    .contant {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .label {
            >span:nth-child(1) {
                color: red;
            }
        }

        .downloadTemp {
            padding-left: 10px;
        }
    }

    .text {
        color: red;
        margin-left: 67px;
    }

    :deep(.el-dialog__header) {
        margin-right: 0;
    }
}
</style>