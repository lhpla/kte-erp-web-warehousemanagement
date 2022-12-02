<!-- 视频上传 -->
<template>
  <div id="videoBox">
    <div v-for="(item, index) of fileList" :key="index" class="videoBox">
      <div class="videoList_box">
        <!-- <img v-if="uploadFlag" @click="removeVideo(index)" src="../../assets/images/cancelIcon.png" class="cancelIcon" alt="" /> -->
        <i
          v-if="uploadFlag"
          @click="removeVideo(index)"
          class="el-icon-circle-close image_close cancelIcon"
          type="primary"
        ></i>
        <video
          v-if="item.videoPath"
          :src="item.videoPath"
          class="avatar"
          controls="controls"
        >
          您的浏览器不支持视频播放
        </video>
      </div>
      <div class="videoName">
        <el-tooltip effect="dark" :content="item.videoName" placement="bottom">
          <span>
            {{ item.videoName }}
          </span>
        </el-tooltip>
      </div>
      <div class="videoSize">{{ item.videoSize }}</div>
    </div>
    <div
      style="margin: 20px 0"
      v-if="fileList && fileList.length === 0 && !uploadFlag"
    >
      暂无视频
    </div>
    <div class="uploadVideo" v-if="uploadFlag && isShow">
      <el-upload
        class="elUpload"
        drag
        action="string"
        ref="uploadVidRef"
        list-type="none"
        :show-file-list="false"
        :fileList="fileList"
        :http-request="uploadVideo"
        :multiple="true"
        :limit="imgLimit"
        :before-upload="beforeAvatarUpload"
        :on-success="handleAvatarSuccess"
        :on-error="vidUploadError"
        :on-exceed="exceed"
        v-loading="videoFlag"
      >
        <i class="el-icon-upload"></i>
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
  computed,
  inject,
} from "vue";
// import { localGet } from "../../utils/util";
import { useStore } from "vuex";
export default {
  name: "UploadVideos",
  components: {},
  props: {
    fileList: {
      type: Array,
    },
    imgLimit: {
      type: Number,
      default: 9999,
    },
    sizeLimit: {
      type: Number,
      default: 150,
    },
  },
  setup(prop, ctx) {
    const data = reactive({
      fileList: [],
      videoFlag: false,
      videoSize: "",
      isShow: true,
    });
    const store = useStore();
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    const uploadFlag = computed(() => store.state.uploadFlag);

    // 获取视频
    const getVideoList = () => {
      vue.$nextTick(() => {
        data.fileList = vue.$props.fileList;
      });
    };

    const removeVideoParent = inject("removeVideoParent");

    // 删除视频
    const removeVideo = (i) => {
      data.isShow = true;
      removeVideoParent(i);
    };
    // 图片上传
    const beforeAvatarUpload = (file) => {
      data.videoFlag = true;
      const isImage =
        file.type === "video/mp4" ||
        file.type === "video/ogg" ||
        file.type === "video/flv" ||
        file.type === "video/avi" ||
        file.type === "video/wmv" ||
        file.type === "video/rmvb" ||
        file.type === "video/mov";
      const isLt2M = file.size / 1024 / 1024 < prop.sizeLimit;
      data.videoSize = (file.size / 1024 / 1024).toFixed(2) + "MB";
      if (!isImage) {
        vue.$message.error("上传格式不正确！");
        data.videoFlag = false;
        return false;
      }
      if (!isLt2M) {
        vue.$message.error(`上传图片大小不能超过 ${prop.sizeLimit}MB!`);
        data.videoFlag = false;
        return false;
      }
      return isImage && isLt2M;
    };

    // 上传视频
    const uploadVideo = (param) => {
      let formImgData = new FormData();
      formImgData.append("file", param.file);
      formImgData.append("pathName", data.pathName);
      api.uploadImg.uploadImgAllFun(formImgData).then((res) => {
        if (res.code == 200) {
          param.onSuccess();
          let videoInfo = {
            videoPath: res.data.link,
            videoName: res.data.originalName,
            videoSize: data.videoSize,
          };
          ctx.emit("clickV", videoInfo);
        } else {
          param.onError();
        }
      });
    };

    // 上传错误提示
    const vidUploadError = (err, file, fileList) => {
      vue.$message.error("文件异常，请重新上传!");
      data.videoFlag = false;
    };
    // 文件数超出提示
    const exceed = (file, fileList) => {
      // 图片上传超过数量限制
      vue.$message.error("上传视频不能超过" + prop.imgLimit + "个!");
    };
    // 上传成功
    const handleAvatarSuccess = (res, file, uploadFiles) => {
      data.isShow = true;
      if (uploadFiles.length == prop.imgLimit) {
        data.isShow = false;
      }
      vue.$message.success("上传视频成功!");
      data.videoFlag = false;
    };

    return {
      ...refData,
      uploadVideo,
      beforeAvatarUpload,
      handleAvatarSuccess,
      vidUploadError,
      store,
      uploadFlag,
      getVideoList,
      removeVideo,
      removeVideoParent,
      exceed,
    };
  },
};
</script>
<style scoped lang="scss">
#videoBox {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .videoList_box {
    position: relative;
    font-size: 20px;
    .image_close {
      position: relative;
      right: -80px;
      color: #409eff;
      font-size: 24px;
      top: 20px;
      z-index: 10;
    }
  }
  .videoBox {
    .videoList_box:hover {
      .cancelIcon {
        transition: all 0.2s linear;
        transform: translateY(0%);
        opacity: 1;
        cursor: pointer;
        z-index: 999;
      }
    }
    .videoName {
      width: 95%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 10px 0;
      margin-left: 5%;
    }
    .videoSize {
      width: 95%;
      margin-left: 5%;
    }
    .videoList_box {
      width: 360px;
      height: 180px;
      margin: 10px 5px;
      position: relative;
      overflow: hidden;
      display: block;
      video {
        width: 100%;
        height: 100%;
        display: block;
      }
      .cancelIcon {
        transition: all 0.2s linear;
        transform: translateY(-100%);
        opacity: 0;
        display: block;
        position: absolute;
        right: 0;
        // width: 24px;
        // height: 24px;
        top: 0;
      }
    }
  }
  .uploadVideo {
    width: 360px;
    height: 240px;
    .elUpload {
      width: 360px;
      height: 180px;
      margin: 10px 5px;
      display: block;
      border: 1px dashed rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
