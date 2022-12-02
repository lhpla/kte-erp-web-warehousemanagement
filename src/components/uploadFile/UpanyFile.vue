<!-- 文件上传 -->
<template>
  <div style="display: flex">
    <div>
      <el-upload
        action="string"
        ref="uploadImgRef"
        class="upload-demo"
        :fileList="fileList"
        :http-request="uploadImage"
        :multiple="true"
        :limit="imgLimit"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="beforeAvatarUpload"
        :on-success="handleAvatarSuccess"
        :on-exceed="handleExceed"
        :on-error="imgUploadError"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
    </div>

    <!-- <div v-else>
      <span v-for="(item, index) of fileList" :key="index" class="imgBox">
        <i v-if="!isUpdate && type !== 3 && type !== 6 && type !== 8 && type !== 4" class="el-icon-circle-close filebadge" type="primary" @click="removeImg"></i>
        <span v-if="item.url">
          <el-popover placement="right" trigger="hover" width="250">
            <template #reference>
              <el-image style="width: 95px; height: 95px" fit="contain" :src="item.url"></el-image>
            </template>
            <el-image :src="item.url" style="width: 300px; height: 300px" fit="contain"></el-image>
          </el-popover>
        </span>
      </span>
    </div> -->
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick, onUnmounted } from "vue";
export default {
  name: "UpanyFile",
  setup(prop, ctx) {
    const data = reactive({
      fileList: [],
      imgLimit: 1, // 最多上传条数
      isUpdate: true, // true--新增或修改  false--展示文件
      type: 0,
      pathName: "warehouse/purchase/purchaseChild/firstRecord/img",
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();

    const api = vue.$http;
    onBeforeMount(() => {});
    onUnmounted(() => {});
    onMounted(() => {});
    const uploadImgRef = ref(null);
    // 获取文件路径
    const getImgMsg = info => {
      data.fileList = [];
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
      data.imgLimit = info.imgLimit;
    };

    // 文件上传
    const beforeAvatarUpload = file => {
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        vue.$message.error("上传文件大小不能超过 5MB!");
      }
      return isLt2M;
    };
    // 文件预览
    const handlePictureCardPreview = file => {
      data.dialogImageUrl = file.url;
      data.otherPicVisible = true;
    };

    // 文件删除
    const handleRemove = file => {
      data.fileList.map((item, index) => {
        if (item.url == file.url) {
          data.fileList.splice(index, 1);
        }
      });
      ctx.emit("removeImg", file.url);
    };

    // 移除文件
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
      vue.$message.success("上传文件成功!");
    };

    // 上传错误提示
    const imgUploadError = (err, file, fileList) => {
      // 文件上传失败调用
      vue.$message.error("文件异常，请重新上传!");
    };

    // 文件数超出提示
    const handleExceed = (file, fileList) => {
      // 文件上传超过数量限制
      vue.$message.error("上传文件不能超过" + data.imgLimit + "张!");
      console.log(file, fileList);
    };

    // 上传文件
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
      handlePictureCardPreview,
      beforeAvatarUpload,
      getImgMsg,
      removeImg,
      imgUploadError,
      uploadImgRef,
    };
  },
};
</script>
<style lang="scss">
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
