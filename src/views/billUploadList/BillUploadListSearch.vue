<!--BillUploadListSearch  账单上传搜索-->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" :model="searchParam" ref="searchForm" class="el-from" size="mini" label-width="100px">
      <el-form-item label="柜号:" prop="user">
        <el-input v-model="searchParam.deptName" placeholder="请输入" clearable @keyup.enter="search"></el-input>
      </el-form-item>

      <el-form-item label="币种:" prop="fullName">
        <el-select placeholder="请选择" filterable clearable v-model="searchParam.createUser" @change="search">
          <el-option v-for="item in ServiceProvidersList" :key="item.id" :label="item.providersCname" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="费用类别:" prop="createUser">
        <el-select filterable clearable v-model="searchParam.createUser" @change="search">
          <el-option label="运费" value="1"></el-option>
          <el-option label="其他费用" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传时间:" prop="createUser">
        <el-select filterable clearable v-model="searchParam.createUser" @change="search">
          <el-option v-for="item in ServiceProvidersList" :key="item.id" :label="item.providersCname" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <div class="footer-button">
        <el-form-item>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
        </el-form-item>
      </div>
    </el-form>
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
  name: "BillUploadListSearch",
  setup(prop, ctx) {
    const data = reactive({
      searchParam: {},
      ServiceProvidersList: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const refData = toRefs(data);

    const search = () => { };
    return {
      ...refData,
      search,
    };
  },
};
</script>
<style scoped lang="scss">
#SearchPanel {
  margin: 0;

  .el-form-item {
    margin-bottom: 5px !important;
  }

  .form-content {
    height: 30px;
    overflow: hidden;
    transition: all 0.5s !important;
  }

  .collapseClass {
    height: auto;
    overflow: auto;
    transition: all 1s;
  }

  .footer-button {
    display: flex;
    justify-content: flex-end;
    margin-top: 5px;
  }
}
</style>
