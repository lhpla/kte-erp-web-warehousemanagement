<!-- 日志组件 -->
<template>
  <!-- 日志dialog -->
  <el-dialog title="操作日志" width="85%" v-model="logVisible" :close-on-click-modal="false" :close-on-press-escape="false">
    <!-- <el-table :header-cell-style="rowClass" :data="logTableData" tooltip-effect="dark" element-loading-text="加载中" v-loading="loading" border>
      <el-table-column label="#" type="index" align="center" width="100"></el-table-column>
      <el-table-column prop="context" align="center" label="内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="operator" align="center" label="操作人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="updateTime" align="center" label="修改时间" show-overflow-tooltip></el-table-column>
    </el-table> -->
    <el-table :header-cell-style="rowClass" :data="logTableData" tooltip-effect="dark" element-loading-text="加载中" v-loading="loading" border>
      <el-table-column label="#" type="index" align="center" width="40"></el-table-column>
      <el-table-column prop="title" label="标题" align="center" width="80"></el-table-column>
      <el-table-column prop="context" label="内容" width="400"></el-table-column>
      <el-table-column prop="ip" label="IP" align="center"></el-table-column>
      <el-table-column prop="picturePath" align="center" label="原片" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.picturePath && scope.row.picturePath.length > 0" class="nameHover" @click="openResource(1, scope.row.picturePath, '原片')">查看原片</span>
          <span v-else>暂无原片</span>
        </template>
      </el-table-column>
      <el-table-column prop="foliationPath" align="center" label=" 成片" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.foliationPath && scope.row.foliationPath.length > 0" class="nameHover" @click="openResource(2, scope.row.foliationPath, '成片')">
            查看成片
          </span>
          <span v-else>暂无成片</span>
        </template>
      </el-table-column>
      <el-table-column prop="videoPath" align="center" label=" 视频" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.videoPath && scope.row.videoPath.length > 0" class="nameHover" @click="openResource(3, scope.row.videoPath, '视频')">查看视频</span>
          <span v-else>暂无视频</span>
        </template>
      </el-table-column>
      <el-table-column prop="operator" align="center" label="操作人" show-overflow-tooltip width="100"></el-table-column>
      <el-table-column prop="updateTime" align="center" label="修改时间" show-overflow-tooltip width="170"></el-table-column>
    </el-table>
    <el-pagination
      class="log-pagination"
      background
      @size-change="handleSizeChangeLog"
      @current-change="handleCurrentChangeLog"
      :current-page="pageableLog.current"
      :page-sizes="[10, 25, 50, 100]"
      :page-size="pageableLog.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageableLog.total"
    ></el-pagination>
  </el-dialog>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
import tablePage from "../../compositionApi/tablePage";

export default {
  name: "publishLogDialog",
  setup(prop, ctx) {
    const { rowClass } = tablePage();
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
        current: null,
        size: null,
        total: null,
      },
      // 加载loading
      loading: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    // 日志每页条数发生改变
    const handleSizeChangeLog = val => {
      data.pageableLog.size = val;
      handleLog();
    };
    // 日志当前页发生改变
    const handleCurrentChangeLog = val => {
      data.pageableLog.current = val;
      handleLog();
    };
    // 打开loading
    const checkLogDialog = funMsg => {
      data.pageableLog = { current: null, size: null, total: null };
      console.log(funMsg);
      data.logVisible = true;
      data.funMsg = funMsg;
      handleLog();
    };
    // 查看日志
    const handleLog = () => {
      let logData = {};
      logData = {
        current: data.pageableLog.current,
        size: data.pageableLog.size,
        type: data.funMsg.type,
      };
      if (!data.funMsg.type) {
        delete logData.type;
      }
      console.log(logData);
      api[data.funMsg.servers][data.funMsg.dataApi](logData).then(res => {
        data.logTableData = res.data.records;
        data.pageableLog = res.data;
        console.log(data.pageableLog);
      });
    };
    return {
      ...refData,
      handleSizeChangeLog,
      handleCurrentChangeLog,
      checkLogDialog,
      rowClass,
    };
  },
};
</script>
<style scoped lang="scss">
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
</style>
