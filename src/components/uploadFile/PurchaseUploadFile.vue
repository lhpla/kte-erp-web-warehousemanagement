<!-- PurchaseUploadFile 采购文件上传组件(可图片与非图片文件混合上传，并图片文件以图片形式展示) -->
<template>
  <div id="PurchaseUploadFile">
    <div class="uploadFileBox">
      <div class="fileListBox" v-if="enclosureList && enclosureList.length > 0">
        <div class="imageFileBox">
          <div v-for="(item, index) in enclosureList" :key="index">
            <div class="fileItem" v-if="item.isImage">
              <i
                class="el-icon-circle-close filebadge1"
                type="primary"
                @click="handleRemove(item, index)"
              ></i>
              <el-popover placement="right" trigger="hover" width="250">
                <template #reference>
                  <el-image
                    style="width: 95px; height: 95px"
                    fit="contain"
                    :src="item.url"
                  ></el-image>
                </template>
                <el-image
                  :src="item.url"
                  style="width: 300px; height: 300px"
                  fit="contain"
                ></el-image>
              </el-popover>
            </div>
          </div>
        </div>

        <div style="margin-top: 30px">
          <div v-for="(item, index) in enclosureList" :key="index">
            <div class="fileItem" v-if="!item.isImage">
              <el-tooltip class="item" effect="dark" content="单击下载文件">
                <a class="remove-a-Aag fileItem" :href="item.url">
                  <div class="name">{{ item.name }}</div>
                  <div><i class="el-icon-download"></i></div>
                </a>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="单击删除文件">
                <i
                  class="el-icon-circle-close"
                  style="margin-left: 5px"
                  @click="handleRemove(item, index)"
                ></i>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
      <el-upload
        class="upload-demo"
        ref="upload"
        action=""
        :file-list="enclosureList"
        :auto-upload="true"
        :http-request="uploadfile"
        :multiple="multiple"
        :limit="limit"
        :on-success="handleAvatarSuccess"
        :on-error="handleAvatarError"
        :on-exceed="handleExceed"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
      >
        <!--  -->
        <el-button size="small" :loading="upLoding" type="primary"
          >选取文件</el-button
        >
        <!-- <i class="el-icon-plus avatar-uploader-icon"></i> -->
        <!-- <template #tip>
          <div class="el-upload__tip">只能上传 .xlsx/.xls 文件</div>
        </template> -->
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
} from "vue";
export default {
  name: "PurchaseUploadFile",
  props: {
    // 是否支持文件多选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 最大上传数量
    limit: {
      type: Number || String,
      default: 5,
    },
  },
  setup(prop, ctx) {
    const data = reactive({
      //文件数据附件
      enclosureList: [],
      // 文件上传loding
      upLoding: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});

    // 文件上传前的验证
    const beforeAvatarUpload = (file) => {
      data.upLoding = true;
      const isImage =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      let fileObj = {
        url: "",
        name: "",
        isImage: null,
      };
      fileObj.name = file.name;
      if (isImage) {
        fileObj.isImage = true;
      } else {
        fileObj.isImage = false;
      }
      data.enclosureList.push(fileObj);
    };

    // 获取文件列表 用于查看回显
    const getFileList = (info) => {
      data.enclosureList = [];
      if (info && info.length > 0) {
        data.enclosureList = info;
      }
    };

    // 文件删除
    const handleRemove = (item, index) => {
      data.enclosureList.splice(index, 1);
    };

    // 自定义上传方法
    const uploadfile = (file) => {
      data.upLoding = true;
      let formImgData = new FormData();
      formImgData.append("file", file.file);
      formImgData.append("pathName", data.pathName);
      api.uploadImg
        .uploadImgAllFun(formImgData)
        .then((res) => {
          if (res.code == 200) {
            data.upLoding = false;
            file.onSuccess();
            if (data.enclosureList.length) {
              data.enclosureList.map((item) => {
                if (item.name == res.data.originalName) {
                  item.url = res.data.link;
                }
              });
            }
            ctx.emit("pushFile", data.enclosureList);
          } else {
            file.onError();
            data.upLoding = false;
          }
        })
        .catch((err) => {
          data.upLoding = false;
        });
    };

    // 上传文件成功钩子
    const handleAvatarSuccess = (file) => {
      vue.$message.success("上传文件成功!");
    };

    // 上传文件失败钩子
    const handleAvatarError = (file) => {
      data.upLoding = false;
      vue.$message.error("文件异常，请重新上传!");
    };

    // 文件超出个数限制时的钩子
    const handleExceed = (file) => {
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
    };
  },
};
</script>
<style scoped lang="scss">
#PurchaseUploadFile {
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
    .imageFileBox {
      width: 500px;
      display: flex;
      flex-wrap: wrap;
      .filebadge1 {
        position: relative;
        right: -105px;
        color: #409eff;
        font-size: 18px;
        cursor: pointer;
        top: -30px;
        z-index: 10;
      }
    }
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
        color: #409eff;
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
