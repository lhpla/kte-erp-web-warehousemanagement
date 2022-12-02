<!-- ConfirmDelivery 上传箱唛 -->
<template>
  <div id='ConfirmDelivery'>
    <el-dialog title="上传箱唛" v-model="dialogVisible" width="500px" :close-on-click-modal="false" @close="closed"
      destroy-on-close :close-on-press-escape="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="导入文件：" prop="fileList">
          <el-upload class="upload-demo" action="" :on-preview="handlePreview" :on-remove="handleRemove"
            :before-remove="beforeRemove" :before-upload="beforeAvatarUpload" multiple :limit="1"
            :on-exceed="handleExceed" accept=".pdf" :file-list="ruleForm.fileList" :http-request="uploadImage">
            <el-button size="small" icon="el-icon-upload">点击上传</el-button>
            <template #tip>
              <div style="color:red;">只能上传 pdf 文件，且不超过 5M</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closed" size="small" :disabled="btnLoading" :loading="btnLoading">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="btnLoading" :loading="btnLoading" size="small">确 定
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
const getTableData = inject("getTableData");
const dialogVisible = ref(false)
const ruleForm = ref({
  fileList: []
})
const rowData = ref([])
const rules = {
  fileList: [{ required: true, message: '请上传', trigger: 'change' },]
}
const btnLoading = ref(false)
const openDialog = (row) => {
  rowData.value = row
  dialogVisible.value = true
}
const closed = () => {
  ruleForm.value.fileList = []
  dialogVisible.value = false
}
// 上传文件
const uploadImage = param => {
  let formImgData = new FormData();
  formImgData.append("file", param.file);
  formImgData.append("pathName", param.file.name);
  api.uploadImg.uploadImgAllFun(formImgData).then(res => {
    console.log(res);
    if (res.code == 200) {
      param.onSuccess();
      ruleForm.value.fileList.push({ url: res.data.link, name: res.data.originalName });
      console.log('object', ruleForm.value.fileList);
      // ctx.emit("clickFu", res.data);
    } else {
      param.onError();
    }
  });
};
const handleRemove = (file, fileList) => {
  ruleForm.value.fileList = []
}
const handlePreview = (file) => {
}
const handleExceed = (files, fileList) => {
  vue.$message.warning(`当前限制1个文件`);
}
const beforeRemove = (file, fileList) => {
  // return vue.$confirm(`确定移除 ${file.name}？`);
}
const beforeAvatarUpload = (file) => {
  console.log('dddddd', file);
  // const isZip = file.type === 'application/x-zip-compressed' || file.type === 'application/zip';
  // const type = file.name.split('.')[1]
  // const isRar = type == 'rar';
  const isLt2M = file.size / 1024 / 1024 < 5;

  if (!isLt2M) {
    vue.$message.error('文件大小不能超过5M!');
  }
  return isLt2M;
}
const onSubmit = () => {
  console.log(ruleForm.value);
  if (ruleForm.value.fileList.length) {
    btnLoading.value = true
    const info = ref({
      id: rowData.value.id,
      fileUrl: ruleForm.value.fileList[0].url,
      fileName: ruleForm.value.fileList[0].name
    });
    api.fba.importBoxMarkPdf(info.value).then((res) => {
      if (res.code == 200) {
        getTableData()
        closed()
      } else {
        vue.$message.warning(res.msg);
      }
      btnLoading.value = false
    }).catch(() => {
      btnLoading.value = false
    })
  } else {
    vue.$message.warning('请上传文件')
  }

}
defineExpose({ openDialog })
</script>

<style  lang='scss'>
#ConfirmDelivery {
  .el-upload-list__item {
    transition: none !important;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>