<!-- 仓区管理 搜索 -->
<template>
  <div id="WarehouseAreaManagementSearch">
    <el-form :inline="true"  ref="formInlineRef" label-width="90px" :model="searchForm"
      class="demo-form-inline el-from">
      <div>
        <el-form-item label="仓库代码:">
          <el-input v-model.trim="searchForm.code" placeholder="请输入" clearable @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="仓库名称:">
          <el-input v-model="searchForm.name" placeholder="请输入" clearable @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="searchForm.status" filterable clearable placeholder="请选择" @change="search">
            <el-option label="禁用" :value="false"></el-option>
            <el-option label="启用" :value="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓库类型:">
          <el-select v-model="searchForm.type" filterable clearable placeholder="请选择" @change="search">
            <el-option label="国外仓" :value="0"></el-option>
            <el-option label="国内仓" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="footer-button">
        <el-form-item>
          <el-button type="primary" size="small"  @click="search">搜 索</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
export default {
  name: "WarehouseAreaManagementSearch",
  setup(prop, ctx) {
    const data = reactive({
      searchForm: {},
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const refData = toRefs(data);
    const getTableData = inject("getTableData");
    // 搜索
    const search = () => {
      data.searchForm.name = data.searchForm.name ? data.searchForm.name.trim() : "";
      getTableData(data.searchForm, 0);
    };
    return {
      ...refData,
      getTableData,
      search,
    };
  },
};
</script>
<style scoped lang='scss'>
#WarehouseAreaManagementSearch {
  .footer-button {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
