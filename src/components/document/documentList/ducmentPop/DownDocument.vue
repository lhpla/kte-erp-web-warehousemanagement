<!-- 单证下载 -->
<template>
  <div id="DownDocument">
    <el-dialog v-model="dialogVisible" width="40%" :before-close="handleClose" :close-on-press-escape="false">
      <template #title>
        <div class="dialog-title">
          <span>选择下载</span>
          <div>
            <el-button type="primary" @click="handleOpen" size="mini" plain>下载队列</el-button>
          </div>
        </div>
      </template>
      <div>
        <el-form size="mini" :model="selectExport" :rules="rules" label-width="120px" class="demo-ruleForm" ref="selectExportRef">
          <el-form-item label="下载的数据:" prop="operationType">
            <el-select v-model="selectExport.operationType" filterable clearable placeholder="请选择">
              <el-option label="整份单证资料" value="all"></el-option>
              <el-option label="报关资料" value="declare"></el-option>
              <el-option label="清关资料" value="clearance"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" :disabled="btnFlag" :loading="btnFlag" @click="handleClose">取 消</el-button>
          <el-button type="primary" size="mini" :disabled="btnFlag" :loading="btnFlag" @click="downloadDeclareMaterial">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <DownloadListTable ref="DownloadListTable"></DownloadListTable>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
import { download } from "@/utils/util";
export default {
  name: "DownDocument",
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false, //下载弹窗
      id: "",
      btnFlag: false,
      rules: {
        operationType: [{ required: true, trigger: "change", message: "请选择" }],
      },
      selectExport: {
        operationType: "all",
      },
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    //打开弹窗
    const getMsg = id => {
      data.dialogVisible = true;
      data.id = id;
      data.selectExport.operationType = "all";
    };
    //关闭弹窗
    const handleClose = () => {
      data.dialogVisible = false;
      if (selectExportRef.value) {
        selectExportRef.value.clearValidate();
        selectExportRef.value.resetFields();
      }
    };

    //打开消息队列
    const handleOpen = () => {
      vue.$refs.DownloadListTable.getMsg();
    };

    const selectExportRef = ref(null);
    //下载
    const downloadDeclareMaterial = () => {
      selectExportRef.value.validate(valid => {
        if (valid) {
          data.btnFlag = true;
          // api.documentList
          //   .downloadDeclareMaterial({ downType: data.selectExport.operationType, cabinetId: data.id, isDraft: false })
          //   .then(res => {
          //     data.btnFlag = false;
          //     let tempName = "单证资料";
          //     let fileType = ".zip";
          //     const blob = new Blob([res], {
          //       // type: "application/msword;charset=UTF-8",
          //     });

          //     if ("msSaveOrOpenBlob" in navigator) {
          //       window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
          //       return;
          //     }
          //     const blobUrl = window.URL.createObjectURL(blob);
          //     download(blobUrl, tempName, fileType);
          //   })
          //   .catch(err => {
          //     data.btnFlag = false;
          //   });
        }
      });
    };

    return {
      ...refData,
      handleClose,
      handleOpen,
      downloadDeclareMaterial,
      selectExportRef,
      getMsg,
    };
  },
};
</script>
<style scoped lang='scss'>
#DownDocument {
  .dialog-title {
    display: flex;
    justify-content: space-between;
    padding: 0 50px 0 0;
    align-items: center;
    span {
      font-size: 16px;
    }
  }
}
</style>