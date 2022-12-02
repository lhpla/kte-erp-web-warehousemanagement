<!-- ConfirmDelivery 确认出库 -->
<template>
  <div id='ConfirmDelivery'>
    <el-dialog title="发货计划-确认出库" v-model="dialogVisible" width="500px" :close-on-click-modal="false" @close="closed" :close-on-press-escape="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="导入文件：" prop="fileList">
          <el-upload class="upload-demo" action="" :on-preview="handlePreview" :on-remove="handleRemove"
            :before-remove="beforeRemove" :before-upload="beforeAvatarUpload" multiple :limit="1"
            :on-exceed="handleExceed" :file-list="ruleForm.fileList" :http-request="uploadImage" accept=".zip, .rar"
            ref="upload" :show-file-list="false">
            <el-button size="small"><el-icon><ElUploadFilled /></el-icon>点击上传</el-button>
            
            <div slot="tip" class="el-upload__tip">
              <div style="display: block;">
                <span style="color:red;">只能上传ZIP，RAR文件，文件大小不能超过50M</span>
              <el-progress :percentage="progress" style="padding-top: 5px;" v-if="progress!=0&&progress!=100" />
            </div>
             
            </div>
          </el-upload>
          <div v-if="ruleForm.fileList.length">
            <div v-for="item in ruleForm.fileList" class="list">
              <div><i class="el-icon--document">{{item.name}}</i></div>
              <div><i class="el-icon-close" @click="handleRemove"></i></div>
            </div>
          </div>
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
import { ref, getCurrentInstance, inject, watch } from 'vue';

const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
const getTableData = inject("getTableData");
const dialogVisible = ref(false)
const ruleForm = ref({
  fileList: []
})
const progress = ref(0)
const rowData = ref([])
const rules = {
  fileList: [{ required: true, message: '请上传', trigger: 'change' },]
}
const btnLoading = ref(false)
const openDialog = (row) => {
  rowData.value = row
  progress.value = 0
  dialogVisible.value = true
}
const closed = () => {
  ruleForm.value.fileList = []
  progress.value = 0
  dialogVisible.value = false
}
watch(
  () => progress.value,
  (val, oldVal) => {
    if (val == 100) {
      progress.value = ruleForm.value.fileList.length ? 100 : 99
    }
  }
);
// 上传文件
const uploadImage = param => {
  let formImgData = new FormData();
  formImgData.append("file", param.file);
  formImgData.append("pathName", "warehouse/purchase/purchaseChild/firstRecord/img");
  let onProgress = (v) => {
    progress.value = Number(v.replace('%', ''))
  }
  api.uploadImg.uploadImgAllFun(formImgData, onProgress).then(res => {
    console.log(res);
    if (res.code == 200) {
      param.onSuccess();
      ruleForm.value.fileList.push({ url: res.data.link, name: res.data.originalName });
      progress.value = 100
      console.log('object', ruleForm.value.fileList);
      // ctx.emit("clickFu", res.data);
    } else {
      param.onError();
    }
  });
};
const handleRemove = (file, fileList) => {
  ruleForm.value.fileList = []
  progress.value = 0
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
  const isZip = file.type === 'application/x-zip-compressed' || file.type === 'application/zip';
  const type = file.name.split('.')[1]
  const isRar = type == 'rar';
  const isLt2M = file.size / 1024 / 1024 < 50;

  if (!isZip && !isRar) {
    vue.$message.error('只能上传ZIP，RAR文件!');
  }
  if (!isLt2M) {
    vue.$message.error('文件大小不能超过50M!');
  }
  return (isZip || isRar) && isLt2M;
}
const onSubmit = () => {
  if (ruleForm.value.fileList.length) {
    btnLoading.value = true
    const info = ref({
      shippingId: rowData.value.shippingId,
      // cabinetPhoto: ruleForm.value.fileList.join(','),
      videoPath: ruleForm.value.fileList[0].url,
    });
    api.warehouse.uploadPhotoAndVideo(info.value).then((res) => {
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

  .list {
    display: flex;
    justify-content: space-between;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>