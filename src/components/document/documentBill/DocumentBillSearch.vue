<!-- DocumentBillSearch 单证账单列表 搜索 -->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" size="mini" ref="searchParamRef" label-width="100px" :model="searchParam"
      class="demo-form-inline">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="头程单号:" prop="id" class="SearchPanel-form-item">
          <el-input v-model.trim="searchParam.id" clearable placeholder="请输入" @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="柜号:" prop="id" class="SearchPanel-form-item">
          <el-input v-model.trim="searchParam.id" clearable placeholder="请输入" @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="服务商:" prop="transferWarehouseId" class="SearchPanel-form-item">
          <el-select v-model="searchParam.transferWarehouseId" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item in wareHouseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="中转仓:" prop="purposeWarehouseId" class="SearchPanel-form-item">
          <el-select v-model="searchParam.purposeWarehouseId" size="mini" filterable clearable placeholder="请选择"
            @change="search">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目的仓:" prop="purposeWarehouseId" class="SearchPanel-form-item">
          <el-select v-model="searchParam.purposeWarehouseId" size="mini" filterable clearable placeholder="请选择"
            @change="search">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="其他费用状态:" prop="purposeWarehouseId" class="SearchPanel-form-item">
          <el-select v-model="searchParam.purposeWarehouseId" size="mini" filterable clearable placeholder="请选择"
            @change="search">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="税金状态:" prop="purposeWarehouseId" class="SearchPanel-form-item">
          <el-select v-model="searchParam.purposeWarehouseId" size="mini" filterable clearable placeholder="请选择"
            @change="search">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运费状态:" prop="purposeWarehouseId" class="SearchPanel-form-item">
          <el-select v-model="searchParam.purposeWarehouseId" size="mini" filterable clearable placeholder="请选择"
            @change="search">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资料发送时间:" prop="endTime" class="SearchPanel-form-item">
          <el-date-picker v-model="searchParam.time" @change="dateBlur(searchParam.time)" type="datetimerange"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
      </div>

      <div class="footer-button">
        <el-form-item>
          <el-button type="text" size="mini" class="open" @click="searchShow = !searchShow" v-if="showSearchBtn">
            {{ searchShow ? "合并" : "展开" }}
            <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </el-button>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
import { parseTime } from "@/utils/util";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";
export default {
  name: "DocumentBillSearch",
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const data = reactive({
      searchParam: {},
      searchShow: false,
      wareHouseList: [],
      warehouseAreaList: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const getTableData = inject("getTableData");

    onBeforeMount(() => { });
    onMounted(() => { });

    //search 搜索
    const search = () => {
      getTableData(data.searchParam);
    };

    // 日期修改
    const dateBlur = e => {
      if (e) {
        data.searchParam.startTime = parseTime(e[0]);
        data.searchParam.endTime = parseTime(e[1]);
      } else {
        data.searchParam.time = "";
        data.searchParam.startTime = "";
        data.searchParam.endTime = "";
      }
      search()
    };

    const refData = toRefs(data);
    return {
      ...refData,
      search,
      getTableData,
      dateBlur,
      showSearchBtn,
    };
  },
};
</script>
<style scoped lang='scss'>
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
