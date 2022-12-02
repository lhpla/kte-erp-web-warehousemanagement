<!-- 图片上传 -->
<template>
  <div style="display: flex" id="UploadFilePurchase">
    <div>
      <el-upload
        drag
        action="string"
        ref="uploadImgRefPurchase"
        list-type="picture-card"
        :fileList="fileList"
        :http-request="uploadImage"
        :multiple="true"
        :limit="imgLimit"
        :before-upload="beforeAvatarUpload"
        :on-success="handleAvatarSuccess"
        :on-exceed="handleExceed"
        :on-error="imgUploadError"
      >
        <i class="el-icon-plus"></i>
        <template #file="{ file }">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span class="el-upload-list__item-delete" @click="handleDownload(file)">
              <i class="el-icon-download"></i>
            </span>
            <span class="el-upload-list__item-delete" @click="handleRemove(file, fileList)">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </template>
      </el-upload>
      <span class="el_dialog_image">
        <el-dialog v-model="dialogVisible" class="el_dialog_image" :close-on-click-modal="false" :close-on-press-escape="false">
          <div style="width: 100%; height: 100%">
            <el-image style="width: 100%; height: 100%" :src="dialogImageUrl" fit="contain" alt=""></el-image>
          </div>
        </el-dialog>
      </span>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick, onUnmounted } from "vue";
export default {
  name: "UploadFilePurchase",
  props: {
    imgLimit: {
      type: Number,
      default: 3,
    },
  },
  setup(prop, ctx) {
    const data = reactive({
      isUpdate: true, // true--新增或修改  false--展示图片
      pathName: "warehouse/purchase/purchaseChild/firstRecord/img",
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: "",
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();

    const api = vue.$http;
    onBeforeMount(() => {});
    onUnmounted(() => {});
    onMounted(() => {});
    const uploadImgRefPurchase = ref(null);
    // 获取图片路径
    const getImgMsg = info => {
      data.pathName = info.pathName;
      data.fileList = info.fileList;
    };

    // 图片上传
    const beforeAvatarUpload = file => {
      const isImage = file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png" || file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isImage) {
        vue.$message.error("上传图片只能是 jpg  / png 格式!");
      }
      if (!isLt2M) {
        vue.$message.error("上传图片大小不能超过 5MB!");
      }
      return isImage && isLt2M;
    };
    // 图片预览
    const handlePictureCardPreview = file => {
      console.log(file, vue.$refs.uploadImgRefPurchase);
      data.dialogImageUrl = file.url;
      data.dialogVisible = true;
    };

    //图片下载
    const handleDownload = e => {
      const a = document.createElement("a");
      a.style.display = "none";
      a.download = "kte-oss";
      a.href = e.url;
      a.click();
      // 去除下载对url的影响
      window.URL.revokeObjectURL(e.url);
    };

    // 图片删除
    const handleRemove = (file, fileList) => {
      data.fileList.map((item, index) => {
        if (item.url == file.url) {
          data.fileList.splice(index, 1);
        }
      });
      ctx.emit("removeImg", fileList);
    };

    // 移除图片
    const removeImg = index => {
      data.fileList = [];
      uploadImgRefPurchase.value.clearFiles();
    };

    // 初始进去清除
    const removeBefore = () => {
      if (uploadImgRefPurchase.value) {
        uploadImgRefPurchase.value.clearFiles();
      }
      data.isUpdate = true;
      data.fileList = [];
    };

    // 上传成功
    const handleAvatarSuccess = (res, file) => {
      vue.$message.success("上传图片成功!");
    };

    // 上传错误提示
    const imgUploadError = (err, file, fileList) => {
      // 图片上传失败调用
      vue.$message.error("文件异常，请重新上传!");
    };

    // 文件数超出提示
    const handleExceed = (file, fileList) => {
      // 图片上传超过数量限制
      vue.$message.error("上传图片不能超过" + vue.$props.imgLimit + "张!");
      console.log(file, fileList);
    };

    // 上传图片
    const uploadImage = param => {
      let formImgData = new FormData();
      formImgData.append("file", param.file);
      formImgData.append("pathName", data.pathName);
      api.uploadImg.uploadImgAllFun(formImgData).then(res => {
        if (res.code == 200) {
          param.onSuccess();
          data.fileList.push({ url: res.data.link });
          ctx.emit("clickFu", res.data.link);
        } else {
          param.onError();
        }
      });
    };

    const refData = toRefs(data);
    return {
      ...refData,
      uploadImage,
      handleExceed,
      removeBefore,
      handleAvatarSuccess,
      handleRemove,
      handlePictureCardPreview,
      beforeAvatarUpload,
      getImgMsg,
      removeImg,
      imgUploadError,
      uploadImgRefPurchase,
      handleDownload,
    };
  },
};
</script>
<style lang="scss">
#UploadFilePurchase .el-upload-list__item {
  transition: none !important;
}
.UploadFilePurchase {
  .filebadge {
    position: relative;
    right: -90px;
    color: #409eff;
    font-size: 18px;
    top: -80px;
    z-index: 10;
  }
  .imgBox {
    margin-right: 10px;
  }
}
</style>
