<!-- 图片上传 -->
<template>
  <div style="display: flex" id="upImg">
    <span v-for="(item, index) of fileList" :key="index" class="imgBox">
      <div class="itemImage">
        <i
          v-show="uploadFlag"
          class="el-icon-circle-close image_close"
          type="primary"
          @click="removeImg(index)"
        ></i>
        <span>
          <el-popover placement="right" trigger="hover" width="250">
            <template #reference>
              <el-image
                style="width: 100px; height: 100px"
                fit="contain"
                :src="item.picturePath"
              ></el-image>
            </template>
            <el-image
              :src="item.picturePath"
              style="width: 300px; height: 300px"
              fit="contain"
            ></el-image>
          </el-popover>
        </span>
      </div>
      <div class="imgName">
        <el-tooltip
          effect="dark"
          :content="item.pictureName"
          placement="bottom"
        >
          <span>
            {{ item.pictureName }}
          </span>
        </el-tooltip>
      </div>

      <div class="imgSize">{{ item.pictureSize }}</div>
    </span>
    <div v-if="fileList.length === 0 && !uploadFlag">暂无</div>
    <div v-if="uploadFlag && isShow" class="uploadBox">
      <el-upload
        class="elUpload"
        drag
        action="string"
        ref="uploadImgRef"
        list-type="none"
        :fileList="fileList"
        :http-request="uploadImage"
        :show-file-list="false"
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
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  ref,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  nextTick,
  computed,
} from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
export default {
  name: "UploadImages",
  props: {
    fileList: {
      type: Array,
    },
    imgLimit: {
      type: Number,
      default: 9999,
    },
  },
  setup(prop, ctx) {
    const data = reactive({
      fileList: [],
      pricturePath: "",
      // isUpdate: true, //true--新增或修改  false--展示图片
      type: 0,
      pathName: "warehouse/purchase/purchaseChild/firstRecord/img",
      imgSize: "",
      isShow: true,
    });

    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const store = useStore();
    const uploadFlag = computed(() => store.state.uploadFlag);
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const uploadImgRef = ref(null);

    // 获取图片
    const getImgList = () => {
      vue.$nextTick(() => {
        // console.log(vue.$props.fileList, "$props.fileList", typeof vue.$props.fileList);
        data.fileList = vue.$props.fileList ? vue.$props.fileList : [];
      });
    };

    // 图片上传
    const beforeAvatarUpload = (file) => {
      const isImage =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      // const isImage = file.type === "image/jpg" || file.type === "image/png";
      data.imgSize = (file.size / 1024 / 1024).toFixed(2) + "MB";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isImage) {
        // vue.$message.error("上传图片只能是 jpg / jpeg / png / gif 格式!");
        vue.$message.error("上传图片只能是 jpg  / png 格式!");
        return false;
      }
      if (!isLt2M) {
        vue.$message.error("上传头像图片大小不能超过 5MB!");
        return false;
      }
      return isImage && isLt2M;
    };
    // 图片预览
    const handlePictureCardPreview = (file) => {
      data.dialogImageUrl = file.url;
      data.otherPicVisible = true;
    };

    // 图片删除
    const handleRemove = (file) => {
      console.log("shancccc", file);
    };
    // 移除图片
    const removeImg = (i) => {
      data.isShow = true;
      // data.fileList = [];
      // data.isUpdate = true;
      ctx.emit("clickRI", i);
    };
    // 初始进去清除
    const removeBefore = () => {
      if (uploadImgRef.value) {
        uploadImgRef.value.clearFiles();
      }
    };

    // 上传成功
    const handleAvatarSuccess = (res, file, uploadFiles) => {
      data.isShow = true;
      if (uploadFiles.length == prop.imgLimit) {
        data.isShow = false;
      }
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
      vue.$message.error("上传图片不能超过" + prop.imgLimit + "张!");
    };

    // 上传图片
    const uploadImage = (param) => {
      let formImgData = new FormData();
      formImgData.append("file", param.file);
      formImgData.append("pathName", data.pathName);
      api.uploadImg.uploadImgAllFun(formImgData).then((res) => {
        if (res.code == 200) {
          param.onSuccess();
          let imgInfo = {
            picturePath: res.data.link,
            pictureName: res.data.originalName,
            pictureSize: data.imgSize,
          };
          ctx.emit("clickFu", imgInfo);
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
      removeImg,
      imgUploadError,
      uploadImgRef,
      store,
      uploadFlag,
      getImgList,
    };
  },
};
</script>
<style lang="scss" scoped>
#upImg {
  height: 200px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;

  .imgBox {
    width: 100px;
    margin: 5px 10px;
    display: inline-block;
    .itemImage {
      position: relative;
      .image_close {
        position: relative;
        right: -80px;
        color: #409eff;
        font-size: 18px;
        top: 20px;
        z-index: 10;
      }
    }
    .imgName {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 10px 0;
    }
    .imgSize {
      width: 100%;
    }
  }
  .uploadBox {
    width: 115px;
    height: 170px;
    .elUpload {
      display: inline-block;
      margin-top: 20px;
      border: 1px dashed rgba(0, 0, 0, 0.3);
      border-radius: 8px;
    }
  }
}
</style>
