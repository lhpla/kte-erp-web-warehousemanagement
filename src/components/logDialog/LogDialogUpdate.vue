<!-- 日志组件 -->
<template>
  <!-- 日志dialog -->
  <div id="LogDialogUpdate">
    <el-dialog title="操作日志" width="80%" v-model="data.logVisible" :close-on-click-modal="false" destroy-on-close
      @close="closed"  :close-on-press-escape="false">
      <el-table :header-cell-style="{
          background: '#fafafa',
          color: '#2d2f30',
          fontWeight: 'bold',
          fontSize: '12px',
      }" :data="data.logTableData" tooltip-effect="dark" element-loading-text="加载中"
        v-loading="data.loading" border height="530">
        <slot name="column">
          <el-table-column label="#" type="index" align="center" width="40"></el-table-column>
          <el-table-column prop="message" label="操作内容"></el-table-column>
          <el-table-column prop="createUserName" label="操作人" width="110"></el-table-column>
          <el-table-column prop="createTime" label="操作时间" width="180"></el-table-column>
        </slot>
      </el-table>
      <el-pagination class="log-pagination" background @size-change="handleSizeChangeLog"
        @current-change="handleCurrentChangeLog" v-model:currentPage="data.current" :page-sizes="[10, 25, 50, 100]"
        v-model:page-size="data.pageMsg.size" layout="total, sizes, prev, pager, next, jumper"
        :total="data.pageMsg.total">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
} from "vue";
const data = ref({
  logVisible: false,
  funMsg: {},
  // log日志表格数据
  logTableData: [],
  // 操作日志
  logVisible: false,
  // logID
  logDataId: null,
  // 日志分页
  pageMsg: {
    current: 1,
    size: 10,
    total: 0,
  },
  // 加载loading
  loading: false,
})
const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
onBeforeMount(() => { });
onMounted(() => { });

// 日志每页条数发生改变
const handleSizeChangeLog = (val) => {
  data.value.pageMsg.size = val;
  console.log(data.pageMsg);
  handleLog();
};
// 日志当前页发生改变
const handleCurrentChangeLog = (val) => {
  data.value.pageMsg.current = val;
  handleLog();
};
// 打开loading
const checkLogDialog = (funMsg) => {
  data.value.logVisible = true;
  data.value.pageMsg = {
    current: 1,
    size: 10,
  }
  data.value.funMsg = funMsg;
  handleLog();
};
// 查看日志
const handleLog = () => {
  api[data.value.funMsg.servers][data.value.funMsg.dataApi]({
    current: data.value.pageMsg.current,
    size: data.value.pageMsg.size,
    ...data.value.funMsg.params
  }).then((res) => {
    if (res.code == 200) {
      data.value.logTableData = res.data.records;
      data.value.pageMsg.total = res.data.total;
    } else {
      vue.$message.warning(res.msg)
    }
  });
};

//关闭
const closed = () => {
  data.value.funMsg = {}
  data.value.logVisible = false
};

defineExpose({ checkLogDialog });

</script>
<style scoped lang="scss">
#LogDialogUpdate {
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
