<!-- 调拨异常搜索 -->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" ref="formInlineRef" label-width="80px" :model="searchForm" class="demo-form-inline el-from">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="调拨仓:" class="SearchPanel-form-item">
          <div class="flex">
            <el-select v-model="searchForm.startTransferWarehouseId" clearable filterable @change="search"
              placeholder="中转仓库" class="size-width">
              <el-option v-for="item in wareHouseList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="searchForm.startPurposeWarehouseId" clearable filterable @change="search"
              placeholder="仓区" class="size-width">
              <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="目的仓:" class="SearchPanel-form-item">
          <el-select v-model="searchForm.endTransferWarehouseId" clearable filterable @change="search"
            placeholder="中转仓库" class="size-width">
            <el-option v-for="item in wareHouseList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="searchForm.endPurposeWarehouseId" clearable filterable @change="search" placeholder="仓区"
            class="size-width">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调拨单号:" class="SearchPanel-form-item">
          <el-input v-model="searchForm.transferCode" placeholder="请输入" clearable @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="状态:" class="SearchPanel-form-item">
          <el-select filterable v-model="searchForm.status" placeholder="请选择" @change="search">
            <el-option v-for="item in qualityTestingList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新:" class="SearchPanel-form-item">
          <el-date-picker v-model="searchForm.dateTime" @change="dateBlur(searchForm.dateTime)" type="datetimerange"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
      </div>
      <div class="footer-button">
        <el-form-item>
          <el-button type="primary" text class="open footer-button-expand" @click="searchShow = !searchShow"
            v-if="showSearchBtn">
            {{ searchShow ? "合并" : "展开" }}
            <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </el-button>
          <el-button type="primary" size="small" @click="search">搜 索</el-button>
          <el-button type="primary" size="small" @click="reset">重 置</el-button>
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
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";
import { localGet, parseTime } from "@/utils/util";
export default {
  name: "abnormalWarehousingSearch",
  props: ["searchMsg"],
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const data = reactive({
      searchShow: false,
      searchForm: {
        status: ""
      },
      wareHouseList: [],
      warehouseAreaList: [],
      qualityTestingList: [
        { name: "全部", id: "" },
        { name: "待确认", id: "0" },
        { name: "已确认", id: "1" },
      ],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      getDictList();
    });
    const getTableList = inject("getTableList");
    const refData = toRefs(data);
    const getDictList = () => {
      // 中转仓
      api.system.getWareHouseList({ type: 1 }).then(res => {
        if (res.code == 200) {
          data.wareHouseList = res.data;
        }
      });
      // 仓区
      api.develop.getDirectAndOverseasWarehouse({ type: 0 }).then(res => {
        if (res.code == 200) {
          data.warehouseAreaList = res.data;
        }
      });
    };

    //搜索列表
    const search = () => {
      if (data.searchForm.transferCode) {
        data.searchForm.transferCode = data.searchForm.transferCode.trim();
      }
      getTableList(data.searchForm);
    };
    //重置
    const reset = () => {
      data.searchForm = {
        status: ""
      }
      search();
    }
    //更新时间事件
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
    return {
      ...refData,
      search,
      getTableList,
      showSearchBtn,
      reset,
      dateBlur
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

.searchShow {
  margin-top: 20px;
}

@media screen and (min-width: 2000px) {
  .footer-button-expand {
    display: none !important;
  }

}
</style>
