<!-- 调拨  搜索 -->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" size="mini" label-width="90px" :model="searchForm" class="demo-form-inline el-from">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="中转仓库:" class="SearchPanel-form-item">
          <el-select v-model="searchForm.warehouseId" clearable filterable placeholder="请选择" @change="search">
            <el-option v-for="item in wareHouseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="序列号:" class="SearchPanel-form-item">
          <el-input v-model.trim="searchForm.serialNum" placeholder="请输入" clearable @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="仓区:" class="SearchPanel-form-item">
          <el-select filterable clearable v-model="searchForm.overseasWarehouseId" placeholder="请选择" @change="search">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SKU:" class="SearchPanel-form-item">
          <el-input v-model="searchForm.sku" placeholder="请输入" clearable @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="状态:" class="SearchPanel-form-item">
          <el-select v-model="searchForm.status" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item in warehouse_transfer_status" :key="item.dizKey" :label="item.value"
              :value="item.dizKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期:" class="SearchPanel-form-item">
          <div class="flex">
            <el-date-picker v-model="searchForm.dateTime" @change="dateBlur(searchForm.dateTime)" type="datetimerange"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </div>
        </el-form-item>
      </div>
      <div class="footer-button">
        <el-form-item>
          <el-button type="text" size="mini" class="open" @click="searchShow = !searchShow" v-if="showSearchBtn">
            {{ searchShow ? "合并" : "展开" }}
            <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
import { parseTime, localGet } from "@/utils/util";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";
export default {
  name: "TransfersListSearch",
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const data = reactive({
      searchForm: {},
      wareHouseList: [], // 仓库
      warehouseAreaList: [], // 仓区
      searchShow: false,
      warehouse_transfer_status: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      getDictList();
    });
    const refData = toRefs(data);
    const getDictList = () => {
      data.warehouse_transfer_status =
        localGet("purchaseDict") && localGet("purchaseDict").warehouse_transfer_status ? localGet("purchaseDict").warehouse_transfer_status : [];
      // 仓库
      api.system.getWareHouseList({ type: 1 }).then(res => {
        if (res.code == 200) {
          data.wareHouseList = res.data;
        }
      });
      // 仓区
      api.system.getWareHouseList({ type: 0 }).then(res => {
        if (res.code == 200) {
          data.warehouseAreaList = res.data;
        }
      });
    };

    // 日期修改
    const dateBlur = e => {
      if (e) {
        data.searchForm.startTime = parseTime(e[0]);
        data.searchForm.endTime = parseTime(e[1]);
      } else {
        data.searchForm.startTime = "";
        data.searchForm.endTime = "";
      }
      search()
    };
    const getTableData = inject("getTableData");
    const search = () => {
      data.searchForm.scroll = 0;
      data.searchForm.sku = data.searchForm.sku ? data.searchForm.sku.trim() : "";
      getTableData(data.searchForm);
    };
    return {
      ...refData,
      dateBlur,
      search,
      showSearchBtn,
    };
  },
};
</script>
<style scoped lang='scss'>
#SearchPanel {
  margin: 0;

  .size-width {
    width: 35%;
    margin-right: 10px;
  }

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
