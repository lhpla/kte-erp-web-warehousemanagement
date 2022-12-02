<!-- 文件上传 -->
<template>
  <div>
    <input type="file" accept=".xlsx" ref="uploadExcelFrom" @change="uploadChange" />
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick } from "vue";

import tablePage from "../../compositionApi/tablePage";
export default {
  name: "UploadFile",
  setup(prop, ctx) {
    const data = reactive({
      funMsg: {},
      pathName: "warehouse/purchase/purchaseChild/firstRecord/file",
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const { getTableList, dataService, dataApi } = tablePage();
    const refData = toRefs(data);
    const uploadExcelFrom = ref(null);
    // 上传供应商文件
    const uploadTrigger = funMsg => {
      // import ---导入方法
      // servers --- 微服务模块名
      data.pathName = funMsg.pathName;
      // dataService.value = funMsg.servers;
      // dataApi.value = funMsg.dataApi;
      data.funMsg = funMsg;
      // 解决同名文件无法监听上传问题，必须要写在点击file前面
      uploadExcelFrom.value.value = null;
      uploadExcelFrom.value.click();
    };

    // 上传文件
    const uploadChange = () => {
      let uploadExcelFile = uploadExcelFrom.value.files[0];
      let excelData = new FormData();
      excelData.append("file", uploadExcelFile);
      // excelData.append("type", data.funMsg.type);
      excelData.append("pathName", data.pathName);
      // if (data.funMsg.isUpdate == 0) {
      //   excelData.append("isUpdate", 0);
      // }

      // api[data.funMsg.servers]
      //   [data.funMsg.import](excelData)
      //   .then(res => {
      api.uploadImg
        .uploadImgAllFun(excelData)
        .then(res => {
          if (res.code == 200) {
            vue.$message.success("导入文件成功!");
            let msg = {
              name: data.funMsg.type,
              index: data.funMsg.index,
              data: res.data,
            };
            ctx.emit("clickImg", msg);
          } else {
            vue.$message.error("导入文件失败!");
          }
        })
        .catch(error => {
          console.error(error);
          vue.$message.error("导入文件失败!");
        });
    };
    return {
      ...refData,
      uploadTrigger,
      uploadChange,
      uploadExcelFrom,
    };
  },
};
</script>
<style scoped lang='scss'></style>
