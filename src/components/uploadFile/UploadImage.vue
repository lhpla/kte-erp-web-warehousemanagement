<!-- 图片上传 -->
<template>
  <div style="display: flex" id="UploadImage">
    <div v-if="isUpdate">
      <el-upload
        drag
        action="string"
        ref="uploadImgRef"
        list-type="picture-card"
        :fileList="fileList"
        :http-request="uploadImage"
        :multiple="true"
        :limit="limit"
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
            <span class="el-upload-list__item-delete" @click="handleRemove(file)">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </template>
      </el-upload>
      <span class="el_dialog_image">
        <el-dialog v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false">
          <div style="width: 100%; height: 100%">
            <el-image style="width: 100%; height: 100%" :src="dialogImageUrl" fit="contain" alt=""></el-image>
          </div>
        </el-dialog>
      </span>
    </div>

    <div v-else>
      <span v-for="(item, index) of fileList" :key="index" class="imgBox">
        <i v-if="!isUpdate && type !== 3 && type !== 6 && type !== 8 && type !== 4" class="el-icon-circle-close filebadge" type="primary" @click="removeImg"></i>
        <!-- <el-image style="width: 100px; height: 100px" :src="item.url" fit="contain" @click.stop="handleClickItem" :preview-src-list="[item.url]"></el-image> -->
        <span v-if="item.url">
          <el-popover placement="right" trigger="hover" width="250">
            <template #reference>
              <el-image style="width: 95px; height: 95px" fit="contain" :src="item.url"></el-image>
            </template>
            <el-image :src="item.url" style="width: 300px; height: 300px" fit="contain"></el-image>
          </el-popover>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick, onUnmounted } from "vue";
export default {
  name: "UploadImage",
  props: {
    // 最大上传数量
    // limit: {
    //   type: Number || String,
    //   default: 1,
    // },
  },
  setup(prop, ctx) {
    const data = reactive({
      fileList: [],
      limit: 1, // 最多上传条数
      isUpdate: true, // true--新增或修改  false--展示图片
      type: 0,
      pathName: "warehouse/purchase/purchaseChild/firstRecord/img",
      preViewImage: "",
      dialogVisible: false,
      dialogImageUrl: "",
    });

    const { ctx: vueDev, proxy: vue } = getCurrentInstance();

    const api = vue.$http;
    onBeforeMount(() => {});
    onUnmounted(() => {});
    onMounted(() => {});
    const uploadImgRef = ref(null);

    // 图片预览
    const handlePictureCardPreview = file => {
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

    // 获取图片路径
    const getImgMsg = info => {
      data.fileList = [];
      if (info && info.length > 0) {
        data.fileList = info;
      } else {
        data.isUpdate = info.isUpdate;
        data.pathName = info.pathName;
        data.type = info.type ? info.type : 0;
        if (info.fileList.url) {
          data.fileList.push(info.fileList);
        } else if (info.fileList.length > 0) {
          data.fileList = info.fileList;
        } else {
          data.fileList = [];
        }
        data.limit = info.imgLimit;
      }
    };

    // 图片上传
    const beforeAvatarUpload = file => {
      const isImage = file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png" || file.type === "image/gif";
      // const isImage = file.type === "image/jpg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isImage) {
        // vue.$message.error("上传图片只能是 jpg / jpeg / png / gif 格式!");
        vue.$message.error("上传图片只能是 jpg  / png 格式!");
      }
      if (!isLt2M) {
        vue.$message.error("上传图片大小不能超过 5MB!");
      }
      return isImage && isLt2M;
    };

    // 图片删除
    const handleRemove = file => {
      data.fileList.map((item, index) => {
        if (item.url == file.url) {
          data.fileList.splice(index, 1);
        }
      });
      ctx.emit("removeImg", file.url);
    };

    // 移除图片
    const removeImg = index => {
      data.fileList = [];
      data.isUpdate = true;
      ctx.emit("clickFu", []);
    };

    // 初始进去清除
    const removeBefore = () => {
      if (uploadImgRef.value) {
        uploadImgRef.value.clearFiles();
      }
      data.fileList = [];
      data.isUpdate = true;
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
      vue.$message.error("上传图片不能超过" + data.limit + "张!");
      console.log(file, fileList);
    };

    // 上传图片
    const uploadImage = param => {
      let formImgData = new FormData();
      formImgData.append("file", param.file);
      formImgData.append("pathName", data.pathName);
      api.uploadImg.uploadImgAllFun(formImgData).then(res => {
        console.log(res);
        if (res.code == 200) {
          param.onSuccess();
          data.fileList.push({ url: res.data.link });
          ctx.emit("clickFu", res.data);
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
      beforeAvatarUpload,
      getImgMsg,
      removeImg,
      imgUploadError,
      uploadImgRef,
      handlePictureCardPreview,
      handleDownload,
    };
  },
};
</script>
<style lang="scss">
#UploadImage .el-upload-list__item {
  transition: none !important;
}

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
</style>
