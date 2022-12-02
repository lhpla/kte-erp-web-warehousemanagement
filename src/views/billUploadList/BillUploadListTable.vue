<!--BillUploadListTable  账单上传表格-->
<template>
  <div id="BillUploadListTable">
    <div class="table-box">
      <div class="table-header">
        <el-button size="mini" type="primary">日志</el-button>
        <el-button size="mini" type="primary">导入</el-button>
      </div>
    </div>
    <el-table :data="tableData" tooltip-effect="dark" ref="tables" @selection-change="handleSelectionChange"
      element-loading-text="加载中" v-loading="loading" border height="calc(100vh - 310px)">
      <el-table-column label="柜号" type="index" align="center" width="200"></el-table-column>
      <el-table-column prop="supplierGrade" label="费用类别">
        <template #default="scope">
          <span>{{
          scope.row.supplierGrade ? scope.row.supplierGrade : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="supplierGrade" label="币种">
        <template #default="scope">
          <span>{{
          scope.row.supplierGrade ? scope.row.supplierGrade : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="supplierGrade" label="金额">
        <template #default="scope">
          <span>{{
          scope.row.supplierGrade ? scope.row.supplierGrade : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="supplierGrade" label="上传时间">
        <template #default="scope">
          <span>{{
          scope.row.supplierGrade ? scope.row.supplierGrade : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="attachment" label="附件">
        <template #default="scope">
          <span class="attachment">{{
          scope.row.attachment ? scope.row.attachment : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default>
          <el-button type="text" size="mini" icon="el-icon-shopping-cart-full" @click="handleDelete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
} from "vue";
export default {
  name: "BillUploadListTable",
  setup(prop, ctx) {
    const data = reactive({
      tableData: [
        {
          supplierGrade: 1,
          attachment: "2021-12-24运费账单",
        },
      ],
      selectList: [],
      loading: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const refData = toRefs(data);

    // 选中的表格数据
    const handleSelectionChange = (e) => {
      data.selectList = e;
    };

    // 单个删除
    const handleDelete = (id) => {
      vue
        .$confirm("此操作将删除此数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          buttonSize: "small"
        })
        .then(() => {
          // api.buyersBlacklist.removeBlackList({ id: id }).then(res => {
          //   if (res.code == 200) {
          //     vue.$message({
          //       type: "success",
          //       message: res.msg,
          //     });
          //     getTableData();
          //   } else {
          //     vue.$message({
          //       type: "warning",
          //       message: res.msg,
          //     });
          //   }
          // });
          console.log("删除");
        })
        .catch(() => {
          // vue.$message({
          //   type: "info",
          //   message: "已取消修改",
          // });
          console.log("取消");
        });
    };

    return {
      ...refData,
      handleSelectionChange,
      handleDelete,
    };
  },
};
</script>
<style scoped lang="scss">
#BillUploadListTable {
  :deep(.cell) {
    text-align: center;
  }

  .attachment {
    color: #409eff;
  }
}
</style>
