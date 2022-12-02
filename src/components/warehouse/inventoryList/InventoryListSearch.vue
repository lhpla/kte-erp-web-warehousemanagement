<!-- 库存  搜索 -->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" label-width="90px" :model="searchForm" class="demo-form-inline el-from">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="仓库:" class="SearchPanel-form-item">
          <el-select v-model="searchForm.domesticWarehouse" clearable filterable placeholder="请选择" @change="search">
            <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓区:" class="SearchPanel-form-item">
          <el-select filterable clearable v-model="searchForm.foreignWarehouse" placeholder="请选择" @change="search">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SKU:" class="SearchPanel-form-item">
          <el-input v-model.trim="searchForm.sku" clearable @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="是否质检:" class="SearchPanel-form-item">
          <el-select v-model="searchForm.isQuality" filterable clearable placeholder="请选择" @change="search">
            <el-option label="否" :value="false"></el-option>
            <el-option label="是" :value="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:" class="SearchPanel-form-item">
          <el-select v-model="searchForm.status" filterable clearable placeholder="请选择" @change="search">
            <el-option label="否" :value="false"></el-option>
            <el-option label="是" :value="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库龄:" class="SearchPanel-form-item">
          <div class="flex">
            <el-input v-model.trim="searchForm.startDays" clearable style="width: 100px" @keyup.enter="search"
              maxlength="10" @input="searchForm.startDays = searchForm.startDays.replace(/[^\d]/g, '')">
            </el-input>
            <div style="margin: 0 10px">至</div>
            <el-input v-model.trim="searchForm.endDays" clearable style="width: 100px" @keyup.enter="search"
              maxlength="10" @input="searchForm.endDays = searchForm.endDays.replace(/[^\d]/g, '')">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="日期:" class="SearchPanel-form-item">
          <div class="flex">
            <el-select v-model="searchForm.timeType" filterable clearable placeholder="请选择" class="size-width"
              @change="search">
              <el-option v-for="item in dateList" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <el-date-picker v-model="searchForm.dateTime" @change="dateBlur(searchForm.dateTime)" type="datetimerange"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </div>
        </el-form-item>
      </div>

      <div class="footer-button">
        <el-form-item>
          <el-button type="primary" text class="open" @click="searchShow = !searchShow" v-if="showSearchBtn">
            {{ searchShow ? "合并" : "展开" }}
            <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </el-button>
          <el-button type="primary" size="small" @click="search">搜 索</el-button>
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
  inject,
} from "vue";
import { parseTime } from "@/utils/util";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";
export default {
  name: "InventoryListSearch",
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const data = reactive({
      searchForm: {
        startDays: '',
        endDays: '',
      },
      warehouseList: [], // 仓库
      warehouseAreaList: [], // 仓区
      dateList: [
        // { key: "0", value: "全部" },
        { key: "create_time", value: "创建时间" },
        { key: "update_time", value: "更新" },
      ],
      searchShow: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      getDictList();
    });
    const refData = toRefs(data);
    const getDictList = () => {
      // 仓库
      api.system.getWareHouseList({ type: 1 }).then(res => {
        if (res.code == 200) {
          data.warehouseList = res.data;
        }
      });
      // 仓区
      api.develop.getDirectAndOverseasWarehouse().then(res => {
        if (res.code == 200) {
          data.warehouseAreaList = res.data;
        }
      });
    };

    // 日期修改
    const dateBlur = (e) => {
      if (data.searchForm.timeType) {
        if (e) {
          data.searchForm.startTime = parseTime(e[0]);
          data.searchForm.endTime = parseTime(e[1]);
        } else {
          data.searchForm.startTime = "";
          data.searchForm.endTime = "";
        }
        search()
      } else {
        data.searchForm.dateTime = null;
        vue.$message({
          type: "warning",
          message: "请选择时间类型",
        });
      }

    };

    const getTableData = inject("getTableData");

    const search = () => {
      if (data.searchForm.startDays) {
        data.searchForm.startDays = Number(data.searchForm.startDays);
      }
      if (data.searchForm.endDays) {
        data.searchForm.endDays = Number(data.searchForm.endDays);
      }
      data.searchForm.scroll = 0;
      getTableData(data.searchForm, true);
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
<style scoped lang="scss">
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
    height: 35px;
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
