<!-- 前端分页组件 -->
<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-table :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" style="width: 100%" border
      :header-cell-style="{
        background: '#fafafa',
        color: '#2d2f30',
        fontWeight: 'bold',
        fontSize: '12px',
      }">
      <slot name="column"></slot>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :background="true"
      :current-page.sync="currentPage" :page-sizes="[5, 10, 25, 50]" :page-size="pagesize" :layout="layout"
      :total="tableData.length">
      <span class="pageSizeInput">
        <el-input style="height: 28px" class="pageSizeBorder" type="number" @blur="handlePageSize"
          v-model.number="limits" @keyup.enter="handlePageSize"></el-input>
        条/页
      </span>
    </el-pagination>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from 'vue';
export default {
  name: '',
  props: {
    //表格数据
    tableData: {
      type: Array,
      default: true,
    },
    layout: {
      // 组件布局
      type: String,
      default: 'total, prev, pager,sizes, next, jumper,slot',
    },
  },
  setup(prop, ctx) {
    const data = reactive({
      currentPage: 1, //默认页码为1
      pagesize: 10, //默认一页显示10条
      limits: 10,
      flag: false,
      hidden: false
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { })
    onMounted(() => { })
    const handleSizeChange = (val) => {
      data.pagesize = val;
    }
    const handleCurrentChange = (val) => {
      data.currentPage = val;
    }
    //条数触发校验
    const handlePageSize = () => {

      console.log(2222222222);
      data.flag = true
      let regN = /^[a-zA-Z0-9_]{0,}$/
      if (!regN.test(data.limits)) {
        console.log(11111111111);
        data.flag = false
        return vue.$message.warning('请输入大于0,小于500的正整数,不可输入符号')
      }
      let reg = /^\+?[1-9]\d*$/
      if (!reg.test(data.limits)) {
        data.flag = false
        return vue.$message.warning('请输入大于0,小于500的正整数,不可输入符号')
      }
      if (data.limits > 500) {
        console.log(5555555);
        data.flag = false
        return vue.$message.warning('请输入大于0,小于500的正整数,不可输入符号')
      }
      handleSizeChange(data.limits)
    }
    const refData = toRefs(data);
    return {
      ...refData,
      handleSizeChange,
      handleCurrentChange,
      handlePageSize
    }
  }
};
</script>
<style scoped lang='scss'>
.pagination-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;

  .refresh_icon {
    width: 32px;
    color: #409eff;
    margin: 8px 0 0 15px;
    cursor: pointer;
    font-weight: 600;
    font-size: 18px;
  }

  .pageSizeInput {
    // width: 80px;
    color: #606266;
    font-weight: 400;

    :deep(.el-input__inner) {
      height: 28px;
      padding: 0 3px;
    }

    :deep(.el-input) {
      width: 50px;
      line-height: 28px;
      margin-left: 8px;
    }
  }
}

.isFixed {
  position: static !important;
  //display: flex;
  //justify-content: flex-end;
  bottom: 0;
  right: 0;
  //width: 50%;
  //max-width: 80%;
  border: none;
  background: #fff;
  border-radius: 50px;
  /* margin: 60px 40px; */
  //margin: 15px 15px;
  z-index: 1100;
  //padding: 5px 20px
}

// .hidden {
//   display: none;
// }
</style>