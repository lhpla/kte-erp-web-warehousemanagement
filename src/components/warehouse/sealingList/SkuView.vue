<!-- sku表格 -->
<template>
  <div id="SkuView">
    <el-dialog title="SKU详情" v-model="dialogTableVisible" :close-on-press-escape="false">
      <el-table :data="tableData" border :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }">
        <el-table-column type="index" width="100" align="center" label="NO."></el-table-column>
        <el-table-column property="sku" label="SKU"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
export default {
  name: "SkuView",
  setup(prop, ctx) {
    const data = reactive({
      tableData: [],
      dialogTableVisible: false
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    //展示物流详情
    const getMsg = list => {
      data.tableData = [];
      data.dialogTableVisible = true;
      for (let item of list) {
        let obj = {
          sku: item
        };
        data.tableData.push(obj);
      }
    };
    const refData = toRefs(data);
    return {
      ...refData,
      getMsg
    };
  }
};
</script>
<style scoped lang="scss"></style>
