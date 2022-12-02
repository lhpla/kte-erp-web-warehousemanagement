<!-- 日志组件 -->
<template>
  <!-- 日志dialog -->
  <div id="newLogDialog">
    <el-dialog title="操作日志" width="80%" v-model="logVisible" :close-on-click-modal="false" destroy-on-close
      @close="closed" :close-on-press-escape="false">
      <el-table :header-cell-style="{
      background: '#fafafa',
      color: '#2d2f30',
      fontWeight: 'bold',
      fontSize: '12px',
    }" :data="logTableData" tooltip-effect="dark" element-loading-text="加载中"
        v-loading="loading" border>
        <slot name="column">
          <el-table-column label="#" type="index" align="center" width="100"></el-table-column>
          <el-table-column prop="opeContext" label="操作内容"></el-table-column>
          <el-table-column prop="createTime" label="修改时间" width="180"></el-table-column>
          <el-table-column prop="createUserName" label="操作人" width="110"></el-table-column>
        </slot>
      </el-table>
      <el-pagination class="log-pagination" background @size-change="handleSizeChangeLog"
        @current-change="handleCurrentChangeLog" :current-page="pageableLog.current" :page-sizes="[10, 25, 50, 100]"
        :page-size="pageableLog.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
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
} from "vue";
export default {
  name: "newLogDialog",
  setup(prop, ctx) {
    const data = reactive({
      logVisible: false,
      funMsg: {},
      // log日志表格数据
      logTableData: [],
      // 操作日志
      logVisible: false,
      // logID
      logDataId: null,
      // 日志分页
      pageableLog: {
        current: 1,
        size: 10,
      },
      total: 0,
      // 加载loading
      loading: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const refData = toRefs(data);
    // 日志每页条数发生改变
    const handleSizeChangeLog = (val) => {
      data.pageableLog.size = val;
      handleLog();
    };
    // 日志当前页发生改变
    const handleCurrentChangeLog = (val) => {
      data.pageableLog.current = val;
      handleLog(val);
    };
    // 打开loading
    const checkLogDialog = (funMsg) => {
      data.logVisible = true;
      data.funMsg = funMsg;
      handleLog();
    };
    // 查看日志
    const handleLog = (val) => {
      let logData = ref({
        current: val ? val : 1,
        size: data.pageableLog.size,
      })
      logData.value = Object.assign(logData.value, data.funMsg.params);
      data.loading = true
      api[data.funMsg.servers][data.funMsg.dataApi](logData.value).then((res) => {
        if (res.code == 200) {
          data.loading = false
          data.logTableData = res.data.records;
          data.pageableLog.current = res.data.current;
          data.pageableLog.size = res.data.size;
          data.total = res.data.total;
        } else {
          data.loading = false
          vue.$message.warning(res.msg)
        }
      });
    };

    //关闭
    const closed = () => {
      data.pageableLog = {
        current: 1,
        size: 10,
      }
      data.logTableData = []
      data.funMsg = {}
      data.logVisible = false
    };
    return {
      ...refData,
      handleSizeChangeLog,
      handleCurrentChangeLog,
      checkLogDialog,
      closed
    };
  },
};
</script>
<style scoped lang="scss">
#newLogDialog {
  .log-pagination {
    display: flex;
    justify-content: flex-end;
    position: static;
    bottom: 0;
    right: 0;
    background: #fff;
    border: none;
    border-radius: 50px;
    margin: -50px 0 10px 0;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
