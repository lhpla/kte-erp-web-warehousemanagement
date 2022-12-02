<!--PaypalLog  Paypal日志-->
<template>
  <div id="PaypalLog">
    <el-dialog title="操作日志" width="85%" v-model="logVisible" :close-on-click-modal="false" @close="closed" :close-on-press-escape="false">
      <el-table :data="logTableData" tooltip-effect="dark" element-loading-text="加载中" :header-cell-style="{
        background: '#fafafa',
        color: '#2d2f30',
        fontWeight: 'bold',
        fontSize: '12px',
      }" v-loading="loading" border>
        <el-table-column label="#" type="index" align="center" width="40"></el-table-column>
        <el-table-column label="内容" align="center" prop="message"></el-table-column>
        <el-table-column align="center" label="操作人名称" width="200" prop="createUserName"></el-table-column>
        <el-table-column align="center" label="创建时间" width="200" prop="createTime"></el-table-column>
      </el-table>
      <el-pagination class="log-pagination" background @size-change="handleSizeChangeLog"
        @current-change="handleCurrentChangeLog" :current-page="pageableLog.current" :page-sizes="[10, 25, 50, 100]"
        :page-size="pageableLog.size" layout="total, sizes, prev, pager, next, jumper" :total="pageableLog.total">
      </el-pagination>
    </el-dialog>
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
  inject,
  nextTick,
} from "vue";
// todo
import { AJAX_getAllotList_log } from "@/api/transfers/requisitionManagement";

export default {
  name: "PaypalLog",
  setup(prop, ctx) {
    const data = reactive({
      // log日志表格数据
      logTableData: [],
      //日志
      // 加载loading
      loading: false,
      logTitle: "原片",
      resources: [],
      logType: 1,
      // 日志分页
      pageableLog: {
        current: 1,
        size: 10,
        total: 0,
      },
      msg: "",
      type: "",
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const test = () => "background:#fafafa;color:#2d2f30;font-weight:bold;font-size:12px"

    onBeforeMount(() => {
    });
    onMounted(() => {
    });
    const refData = toRefs(data);
    let logVisible = ref(false);
    // 打开loading
    const checkLogDialog = (msg) => {
      data.msg = msg;
      handleLog();
      logVisible.value = true;

    };

    // 查看日志
    const handleLog = () => {
      data.logTableData = [];
      let logData = {
        current: data.pageableLog.current,
        size: data.pageableLog.size,
        ...data.msg
      };
      // 日志请求修改
      AJAX_getAllotList_log(logData).then((res) => {
        if (res.code == 200) {
          data.logTableData = res.data.records;
          data.pageableLog.size = res.data.size;
          data.pageableLog.current = res.data.current;
          data.pageableLog.total = res.data.total;
        } else {
          vue.$message({
            type: "warning",
            message: res.msg,
          });
        }
      });
    };
    // 日志每页条数发生改变
    const handleSizeChangeLog = (val) => {
      data.pageableLog.current = 1;
      data.pageableLog.size = val;
      handleLog();
    };
    // 日志当前页发生改变
    const handleCurrentChangeLog = (val) => {
      data.pageableLog.current = val;
      handleLog();
    };

    // closed 关闭弹框回调
    const closed = () => {
      data.logTableData = [];
      logVisible.value = false;
    };

    return {
      ...refData,
      checkLogDialog,
      closed,
      handleSizeChangeLog,
      handleCurrentChangeLog,
      logVisible,
      test
    };
  },
};
</script>
<style scoped lang='scss'>
* {
  box-sizing: border-box;
}

#PaypalLog {
  .log-pagination {
    display: flex;
    justify-content: flex-end;
    position: static;
    bottom: 0;
    right: 0;
    background: #fff;
    border: none;
    border-radius: 50px;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>



