<!--查看文件 -->
<template>
  <div id="FileDialog" v-if="fileVisible">
    <el-dialog title="出库文件" v-model="fileVisible" :close-on-click-modal="false" @close="closedDialog"
      v-if="fileVisible" :close-on-press-escape="false">
      <div style="margin-bottom: 10px;">出库视频：</div>
      <div class="UploadVideos">
        <div v-for="(item, index) of filsForm.videos" :key="index" class="videoBox">
          <div class="videoList_box">
            <video v-if="item.videoPath" :src="item.videoPath" class="avatar" controls="controls">您的浏览器不支持视频播放</video>
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
        <el-upload class="elUpload" drag action="string" list-type="none" :show-file-list="false"
          :fileList="filsForm.videos" :multiple="true">
          <i class="el-icon-upload"></i>
        </el-upload>
      </div>
      <div v-if="filsForm.videos.length === 0" style="margin-bottom: 10px;">暂无视频</div>
      <div style="margin-bottom: 10px;">出库图片：</div>
      <div class="UploadVideos">
        <span v-for="(item, index) of filsForm.pictures" :key="index" class="imgBox">
          <div class="itemImage">
            <span>
              <el-popover placement="right" trigger="hover" width="250">
                <template #reference>
                  <el-image style="width: 100px; height: 100px" fit="contain" :src="item.picturePath"></el-image>
                </template>
                <el-image :src="item.picturePath" style="width: 300px; height: 300px" fit="contain"></el-image>
              </el-popover>
            </span>
          </div>
          <div class="imgName">
            <el-tooltip effect="dark" :content="item.pictureName" placement="bottom">
              <span>
                {{ item.pictureName }}
              </span>
            </el-tooltip>
          </div>
          <div class="imgSize">{{ item.pictureSize }}</div>
        </span>
      </div>
      <div v-if="filsForm.pictures.length === 0">暂无图片</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="closedDialog">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
export default {
  name: "",
  setup(prop, ctx) {
    const data = reactive({
      fileVisible: false,
      filsForm: {
        pictures: [],
        videos: []
      }
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });

    //关闭上传文件弹窗
    const closedDialog = () => {
      data.fileVisible = false;
    };
    const openDialog = vo => {
      data.filsForm = vo;
      data.fileVisible = true;
    };
    const refData = toRefs(data);
    return {
      ...refData,
      closedDialog,
      openDialog
    };
  }
};
</script>
<style scoped lang="scss">
#FileDialog {
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  :deep(.el-dialog__header) {
    margin-right: 0;
  }

  .imgBox {
    display: inline-block;
  }

  .videoBox {
    display: inline-block;

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
        width: 24px;
        height: 24px;
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

  .elUpload {
    display: none;
  }
}
</style>
