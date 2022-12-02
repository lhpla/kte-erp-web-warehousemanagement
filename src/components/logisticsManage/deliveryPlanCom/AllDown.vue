<!--  AllDown-->
<template>
  <div id="AllDownDialog">
    <el-dialog :title="title" width="600px" v-model="addVisible" :close-on-click-modal="false" @close="closed" :close-on-press-escape="false">
      <div class="box">
        <div class="contant">
          <div class="label">
            <span>*</span><span>导入文件：</span>
          </div>
          <div>
            <el-button size="small" @click="uploadTrigger" :loading="upLoading" :disabled="upLoading"
              >
              选择上传文件
            </el-button>
          </div>
          <el-button size="small" @click="downloadTemp" type="text" class="downloadTemp">下载模板</el-button>
          <input type="file" accept=".xlsx" ref="uploadExcelFrom" @change="uploadChange" style="display: none" />
        </div>
        <div>
          <span class="text">{{ resultMsg }}</span>
          <el-button size="small" @click="downloadFailTemp" type="text" v-if="errorKey">下载导入失败数据</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount, onMounted, getCurrentInstance, ref, inject } from "vue";
import tablePage from "@/compositionApi/tablePage";
export default {
  name: "AllDown",
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
      errorKey: '',
      resultMsg: ''
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const { getTableList, dataService, dataApi, downloadTemplate } = tablePage();
    onBeforeMount(() => { });
    onMounted(() => { });
    const refData = toRefs(data);
    // 获取信息
    const getMsg = info => {
      console.log("上传信息", info);
    };
    // 下载模板
    const downloadTemp = () => {
      console.log("data.funMsg", data.funMsg);
      downloadTemplate(data.funMsg.temp, data.funMsg.title);
    };
    // 下载失败数据
    const downloadFailTemp = () => {
      console.log("data.funMsg", data.funMsg);
      downloadTemplate(data.funMsg.fail, '失败数据', data.errorKey ? { errorKey: data.errorKey } : []);
    };
    const uploadExcelFrom = ref(null);
    // 上传供应商文件
    const uploadTrigger = () => {
      // 解决同名文件无法监听上传问题，必须要写在点击file前面
      uploadExcelFrom.value.value = null;
      uploadExcelFrom.value.click();
    };
    //关闭弹窗
    const closed = () => {
      data.errorKey = ''
      data.resultMsg = ''
      data.addVisible = false
    }
    // 弹窗控制
    const checkDialog = (state, funMsg) => {
      // temp ---下载模板方法
      //fail----下载失败方法
      // import ---导入方法
      // servers --- 微服务模块名
      data.addVisible = state;
      dataService.value = funMsg.servers;
      dataApi.value = funMsg.dataApi;
      data.funMsg = funMsg;
    };
    const getDataList = inject("getDataList");
    const getTableData = inject("getTableData");
    // 上传文件
    const uploadChange = () => {
      let uploadExcelFile = uploadExcelFrom.value.files[0];
      if (uploadExcelFile.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || uploadExcelFile.type == "application/vnd.ms-excel") {
      } else {
        return vue.$message.warning('上传文件只能是 xls/xlsx 格式!')
      }

      let dataType = ['importWarehouseOutCabinetExcel'];
      let excelData = new FormData();
      excelData.append("file", uploadExcelFile);
      if (data.funMsg.shippingId) {
        excelData.append("shippingId", data.funMsg.shippingId);
      }
      data.upLoading = true;
      api[data.funMsg.servers]
      [data.funMsg.import](excelData)
        .then(res => {
          if (res.code == 200) {
            data.upLoading = false;
            data.errorKey = res.data.errorKey
            data.resultMsg = res.data.resultMsg
            console.log(dataType, data.funMsg.import);
            if (
              dataType.some(i => {
                return i == data.funMsg.import;
              })
            ) {
              getDataList(data.funMsg.updateData);

              if (getTableList) {
                getTableList();
              }
            }
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
      getMsg,
      downloadTemp,
      uploadTrigger,
      uploadChange,
      checkDialog,
      uploadExcelFrom,
      getDataList,
      downloadFailTemp,
      closed,
    };
  },
};
</script>
<style scoped lang="scss">
#AllDownDialog {
  .box {
    padding: 20px;
    margin-bottom: 20px;
  }

  .contant {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .label {
      >span:nth-child(1) {
        color: red;
      }
    }

    .downloadTemp {
      padding-left: 10px;
    }
  }

  .text {
    color: red;
    margin-left: 67px;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
