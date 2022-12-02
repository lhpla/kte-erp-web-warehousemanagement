
<!-- NewUploadFile 新的文件上传组件 -->
<template>
  <div id="NewUploadFile">
    <div class="uploadFileBox">
      <el-upload
        v-if="circle"
        class="upload-demo"
        ref="upload"
        action=""
        :file-list="fileList"
        :auto-upload="true"
        :http-request="uploadfile"
        :multiple="multiple"
        :limit="limit"
        :on-success="handleAvatarSuccess"
        :on-error="handleAvatarError"
        :on-exceed="handleExceed"
        :show-file-list="false"
      >
        <!-- :before-upload="beforeAvatarUpload" -->
        <el-button size="small" :loading="upLoding" type="primary">选取文件</el-button>
        <!-- <template #tip>
          <div class="el-upload__tip">只能上传 .xlsx/.xls 文件</div>
        </template> -->
      </el-upload>
      <div class="fileListBox" v-if="fileList && fileList.length > 0">
        <div class="fileItem" v-for="(item, index) in fileList" :key="index">
          <el-tooltip class="item" effect="dark" content="单击下载文件">
            <a class="remove-a-Aag fileItem" :href="item.url">
              <div class="name">{{ item.name }}</div>
              <div><i class="el-icon-download"></i></div>
            </a>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="单击删除文件" v-if="circle">
            <i class="el-icon-circle-close" style="margin-left: 5px" @click="handleRemove(item, index)"></i>
          </el-tooltip>
        </div>
      </div>
      <!-- <div v-else>-</div> -->
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick } from "vue";
export default {
  name: "NewUploadFile",
  props: {
    // 是否支持文件多选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 最大上传数量
    limit: {
      type: Number || String,
      default: 2,
    },
    // 是否能够删除
    circle: {
      type: Boolean,
      default: true,
    },
    // 是否验证格式
    isFormat: {
      type: Boolean,
      default: true,
    },
  },
  setup(prop, ctx) {
    const data = reactive({
      // 文件数据
      fileList: [],
      // 文件上传loding
      upLoding: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});

    // 文件上传前的验证
    const beforeAvatarUpload = file => {
      if(prop.isFormat) {
        data.upLoding = true;
      const isXlsx = file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isXlsx) {
        vue.$message.error("上传文件只能是 .xlsx 格式!");
        data.upLoding = false;
      } else {
        data.upLoding = false;
      }
      return isXlsx;
      }
    };

    // 获取文件列表 用于查看回显
    const getFileList = info => {
      console.log(info);
      data.fileList = [];
      if (info && info.length > 0) {
        data.fileList = info;
        console.log(info);
      }
    };
    const removeBefore = () => {
      data.fileList = [];
    };

    // 文件删除
    const handleRemove = (item, index) => {
      data.fileList.splice(index, 1);
      ctx.emit("removeFileBook", data.fileList);
    };

    // 自定义上传方法
    const uploadfile = file => {
      data.upLoding = true;
      let formImgData = new FormData();
      formImgData.append("file", file.file);
      formImgData.append("pathName", data.pathName);
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

    const refData = toRefs(data);
    return {
      ...refData,
      handleRemove,
      uploadfile,
      handleAvatarSuccess,
      handleAvatarError,
      handleExceed,
      beforeAvatarUpload,
      getFileList,
      removeBefore
    };
  },
};
</script>
<style scoped lang='scss'>
#NewUploadFile {
  .uploadFileBox {
    width: 300px;
    .upload-demo {
      .el-upload {
        height: 50px !important;
      }
      .el-upload--text {
        height: 50px !important;
      }
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
