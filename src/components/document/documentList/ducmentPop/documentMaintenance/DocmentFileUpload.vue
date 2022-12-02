<!--单证资料上传组件 -->
<template>
  <div id="DocmentFileUpload">
    <div class="uploadFileBox">
      <div class="doc-title">
        {{ title }}
      </div>
      <el-upload v-if="circle" class="upload-demo" ref="upload" action="" :file-list="fileList" :auto-upload="true"
        :http-request="uploadfile" :multiple="multiple" :limit="limit" :on-success="handleAvatarSuccess"
        :on-error="handleAvatarError" :on-exceed="handleExceed" :show-file-list="false"
        :before-upload="beforeAvatarUpload" :disabled="audit == 'auditing' || audit == 'audit_pass'">
        <el-button size="small" :loading="upLoding" type="primary"
          :disabled="audit == 'auditing' || audit == 'audit_pass'">上 传</el-button>
      </el-upload>
      <div class="fileListBox" v-if="fileList && fileList.length > 0">
        <div class="fileItem" v-for="(item, index) in fileList" :key="index">
          <div class="name">{{ item.name }}</div>
          <a class="remove-a-Aag" :href="item.url">
            <i class="el-icon-download" style="color:#409eff"></i>
          </a>
          <i class="el-icon-zoom-in" style="margin-left: 5px;color:#409eff"
            @click="handlePictureCardPreview(item.url)"></i>
          <i class="el-icon-circle-close" style="margin-left: 5px;color:#409eff"
            @click="handleRemove(item, index, audit == 'auditing' || audit == 'audit_pass')"></i>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" destroy-on-close :close-on-press-escape="false">
      <div style="width: 100%; height: 100%">
        <el-image style="width: 100%; height: 100%" :src="dialogImageUrl" fit="contain" alt=""></el-image>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
export default {
  name: "DocmentFileUpload",
  props: {
    // 是否支持文件多选
    multiple: {
      type: Boolean,
      default: true,
    },
    // 最大上传数量
    limit: {
      type: Number || String,
      default: 5,
    },
    // 是否能够删除
    circle: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: ""
    },
    audit: {
      type: String,
      default: ""
    }
  },
  setup(prop, ctx) {
    const data = reactive({
      // 文件数据
      fileList: [],
      // 文件上传loding
      upLoding: false,
      dialogVisible: false,
      dialogImageUrl: ''
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const refData = toRefs(data);
    // 文件上传前的验证
    const beforeAvatarUpload = file => {
      data.upLoding = true;
      const isImage = file.type === "image/jpg" || file.type === "image/jpeg" || file.type === "image/png" || file.type === "application/pdf";
      if (!isImage) {
        vue.$message.error("上传文件只能是 jpg/jpeg/png/pdf 格式!");
        data.upLoding = false;
      } else {
        data.upLoding = false;
      }
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        vue.$message.error("上传文件大小不能超过 5M!");
      }
      return isImage && isLt2M;
    };

    // 获取文件列表 用于查看回显
    const getFileList = info => {
      data.fileList = [];
      if (info && info.length > 0) {
        data.fileList = info;
      }
    };
    const removeBefore = () => {
      data.fileList = [];
    };

    // 文件删除
    const handleRemove = (item, index, type) => {
      if (!type) {
        data.fileList.splice(index, 1);
        ctx.emit("removeFileBook", data.fileList);
      } else {
        vue.$message.warning('当前状态禁止删除！')
      }

    };

    // 自定义上传方法
    const uploadfile = file => {
      data.upLoding = true;
      let formImgData = new FormData();
      formImgData.append("file", file.file);
      formImgData.append("pathName", file.file.name);
      // //测试代码
      // let fileObj = {
      //   name: file.file.name,
      //   url: "ferfgergvrfedsg",
      // };
      // data.fileList.push(fileObj);
      // ctx.emit("pushFile", data.fileList);
      data.upLoding = false;
      api.uploadImg
        .uploadImgAllFun(formImgData)
        .then(res => {
          if (res.code == 200) {
            data.upLoding = false;
            file.onSuccess();
            let fileObj = {
              name: res.data.originalName,
              url: res.data.link,
            };
            data.fileList.push(fileObj);
            ctx.emit("pushFile", data.fileList);
          } else {
            file.onError();
            data.upLoding = false;
          }
        })
        .catch(err => {
          data.upLoding = false;
        });
    };

    // 上传文件成功钩子
    const handleAvatarSuccess = file => {
      vue.$message.success("上传文件成功!");
    };

    // 上传文件失败钩子
    const handleAvatarError = file => {
      data.upLoding = false;
      vue.$message.error("文件异常，请重新上传!");
    };

    // 文件超出个数限制时的钩子
    const handleExceed = file => {
      data.upLoding = false;
      vue.$message.error("上传文件不能超过" + vue.$props.limit + "个!");
    };

    //图片预览
    const handlePictureCardPreview = url => {
      if (url.indexOf(".pdf") != -1) {
        window.open(url)
      } else {
        data.dialogVisible = true;
        data.dialogImageUrl = url
      }

    }

    return {
      ...refData,
      handleRemove,
      uploadfile,
      handleAvatarSuccess,
      handleAvatarError,
      handleExceed,
      beforeAvatarUpload,
      getFileList,
      removeBefore,
      handlePictureCardPreview
    };
  },
};
</script>
<style scoped lang='scss'>
#DocmentFileUpload {
  .uploadFileBox {
    width: 300px;
    border: 1px solid #eee;
    padding: 0 10px;
    margin: 10px;

    .doc-title {
      font-size: 14px;
      font-weight: bold;
      line-height: 30px;
      margin-top: 10px;
    }

    .upload-demo {
      :deep(.el-upload) {
        height: 60px !important;
        line-height: 60px;
      }

      .el-upload--text {
        height: 50px !important;
      }
    }

    .remove-a-Aag:hover {
      color: #409eff;
      cursor: pointer;
    }
  }

  .fileListBox {
    width: 100%;

    .fileItem {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 2px 0;
      font-size: 12px;
      align-items: center;
      line-height: 20px;

      .name {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 80%;
      }
    }

    .fileItem:hover {
      background-color: #f5f7fa;
      color: #409eff;
    }
  }
}
</style>