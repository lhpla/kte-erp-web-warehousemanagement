<!--审核发货计划 搜索  -->
<template>
  <div id="AuditDeliveryPlanSearch">
    <el-form :model="searchParam" ref="searchForm" label-width="120px" size="mini" class="el-from" :inline="true">
      <div class="SearchPanel-item-box">
        <el-form-item label="出库号 :" prop="deliveryNo" class="SearchPanel-form-item">
          <el-input v-model="searchParam.deliveryNo" clearable placeholder="请输入出库号"></el-input>
        </el-form-item>
        <el-form-item label="状态 :" prop="state" class="SearchPanel-form-item">
          <el-select v-model="searchParam.state" size="mini" filterable clearable placeholder="请选择">
            <el-option :label="item.name" :value="item.value" v-for="item in warehouseList" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="中转仓库 :" prop="transitWarehouse" class="SearchPanel-form-item">
          <el-select v-model="searchParam.transitWarehouse" size="mini" filterable clearable placeholder="请选择">
            <el-option :label="item.name" :value="item.value" v-for="item in warehouseList" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="SearchPanel-form-item" label="仓区 :" prop="warehouseArea">
          <el-select v-model="searchParam.warehouseArea" size="mini" filterable clearable placeholder="请选择">
            <el-option :label="item.name" :value="item.value" v-for="item in warehouseList" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="SearchPanel-form-item" style="margin-left: 55px">
          <el-button style="margin-left: 50px" type="primary" size="mini" icon="el-icon-search" @click="search">搜 索</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
export default {
  name: "AuditDeliveryPlanSearch",
  setup(prop, ctx) {
    const data = reactive({
      searchParam: {
        deliveryNo: "", //出库号
        state: "", //状态
        transitWarehouse: "", //中转仓库
        warehouseArea: "", //仓区
      },
      warehouseList: [
        {
          name: "鑫哥仓",
          value: "1",
        },
      ], //中转仓库
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const getTableData = inject("getTableData");
    onBeforeMount(() => {});
    onMounted(() => {});

    //search 搜索
    const search = () => {
      console.log(data.searchParam);
    };

    const refData = toRefs(data);
    return {
      ...refData,
      search,
      getTableData,
    };
  },
};
</script>
<style scoped lang='scss'>
</style>
