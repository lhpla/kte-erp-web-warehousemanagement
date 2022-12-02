<!-- 下载弹窗 -->
<template>
  <div id="AllDownDialog">
    <el-dialog :title="title ? title : '导入'" width="600px" v-model="addVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="allAdd-box">
        <div>
          <h3 class="add-title">
            <span class="add-next">①</span>
            步骤1
          </h3>
          <el-button size="small" @click="downloadTemp">
            <i class="el-icon-download"></i>
            下载模板
          </el-button>
        </div>
        <div>
          <h3 class="add-title">
            <span class="add-next">②</span>
            步骤2
          </h3>
          <el-button size="small" @click="uploadTrigger" :loading="upLoading" :disabled="upLoading">
            <i class="el-icon-upload2"></i>
            上传文件
          </el-button>
          <h4 class="add-tip">按模板填写后上传</h4>
          <input type="file" accept=".xlsx" ref="uploadExcelFrom" @change="uploadChange" style="display: none" />
        </div>
      </div>
    </el-dialog>
    <el-dialog title="提示" width="30%" v-model="promptVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="info-box">
        <p class="info-top">{{ infoValue.resMessage }}</p>
        <p>详细描述</p>
        <ul style="margin-top: 10px">
          <li style="margin-bottom: 5px" v-for="(item, index) in infoValue.errorMessages" :key="index">{{ item }}</li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount, onMounted, getCurrentInstance, ref, inject } from "vue";
import tablePage from "@/compositionApi/tablePage";
export default {
  name: "AllDownDialog",
  props: {
    title: {
      type: String,
      default: "导入",
    },
  },
  setup(prop, ctx) {
    const data = reactive({
      addVisible: false,
      promptVisible: false,
      funMsg: {},
      infoValue: {},
      upLoading: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const { dataService, dataApi, downloadTemplate } = tablePage();
    onBeforeMount(() => { });
    onMounted(() => { });
    const refData = toRefs(data);
    // 下载模板
    const downloadTemp = () => {
      console.log("data.funMsg", data.funMsg);
      downloadTemplate(data.funMsg.temp, data.funMsg.title, data.funMsg.type ? { type: data.funMsg.type } : data.funMsg.orderCode ? data.funMsg.orderCode : []);
    };
    const uploadExcelFrom = ref(null);
    // 上传供应商文件
    const uploadTrigger = () => {
      // 解决同名文件无法监听上传问题，必须要写在点击file前面
      uploadExcelFrom.value.value = null;
      uploadExcelFrom.value.click();
    };
    // 弹窗控制
    const checkDialog = (state, funMsg) => {
      // temp ---下载模板方法
      // import ---导入方法
      // servers --- 微服务模块名
      data.addVisible = state;
      dataService.value = funMsg.servers;
      dataApi.value = funMsg.dataApi;
      data.funMsg = funMsg;
    };
    const getTableData = inject("getTableData");
    // 上传文件
    const uploadChange = () => {
      let uploadExcelFile = uploadExcelFrom.value.files[0];
      let excelData = new FormData();
      excelData.append("file", uploadExcelFile);
      if (data.funMsg.isUpdate == 0) {
        excelData.append("isUpdate", 0);
      }
      data.upLoading = true;
      api[data.funMsg.servers]
      [data.funMsg.import](excelData)
        .then(res => {
          if (res.code == 200) {
            data.upLoading = false;
            if (res.data.resMessage) {
              data.infoValue = res.data || {};
              data.promptVisible = true;
            } else {
              vue.$message.success("批量导入文件成功!");
              data.addVisible = false;
            }
            getTableData();
          } else {
            vue.$message.error(res.msg);
            data.upLoading = false;
          }
        })
        .catch(error => {
          data.upLoading = false;
        });
    };
    return {
      ...refData,
      downloadTemp,
      uploadTrigger,
      uploadChange,
      checkDialog,
      uploadExcelFrom,
    };
  },
};
</script>
<style scoped lang="scss">
#AllDownDialog {
  .allAdd-box {
    display: flex;
    justify-content: space-between;
    padding: 0 100px;
  }

  .add-title {
    margin: 10px 0 20px 0;
  }

  .add-next {
    font-size: 19px;
    margin-right: 5px;
  }

  .add-tip {
    font-size: 14px;
    color: #666;
    margin: 20px 0 45px 0;
  }

  .info-box {
    font-size: 16px;

    .info-top {
      color: red;
      margin-bottom: 30px;
    }
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>