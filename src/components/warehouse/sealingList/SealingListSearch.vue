<!-- 封箱列表搜索 -->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" ref="formInlineRef" label-width="85px" :model="searchForm" class="demo-form-inline el-from">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="箱号:" class="SearchPanel-form-item">
          <el-input v-model.trim="searchForm.cartonNum" placeholder="请输入" clearable @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="序列号:" class="SearchPanel-form-item">
          <el-input v-model.trim="searchForm.serialNum" placeholder="请输入" clearable @keyup.enter="search"></el-input>
        </el-form-item>

        <el-form-item label="中转仓库:" class="SearchPanel-form-item">
          <el-select v-model="searchForm.transferWarehouseId" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item in wareHouseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否封箱:" class="SearchPanel-form-item">
          <el-select v-model="searchForm.status" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item in warehouse_cases_status" :key="item.dizKey" :label="item.value"
              :value="item.dizKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓区:" class="SearchPanel-form-item">
          <el-select filterable clearable v-model="searchForm.purposeWarehouseId" placeholder="请选择" @change="search">
            <el-option v-for="item in purposeWarehouseList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="柜号:" class="SearchPanel-form-item">
          <el-input v-model.trim="searchForm.cabinetNum" placeholder="请输入" clearable @keyup.enter="search"></el-input>
        </el-form-item>

        <el-form-item label="创建时间:" class="SearchPanel-form-item">
          <el-date-picker v-model="searchForm.createTime" @change="createDateBlur(searchForm.createTime)"
            type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>

        <el-form-item label="封箱时间:" class="SearchPanel-form-item">
          <el-date-picker v-model="searchForm.dateTime" @change="dateBlur(searchForm.dateTime)" type="datetimerange"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="SKU:" class="SearchPanel-form-item">
          <el-input v-model.trim="searchForm.sku" placeholder="多个以英文逗号分隔" clearable @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="采购单号:" v-if="buttonAuthor.publicationRejection" class="SearchPanel-form-item">
          <el-input v-model.trim="searchForm.purchaseOrderCode" placeholder="请输入" clearable @keyup.enter="search">
          </el-input>
        </el-form-item>
      </div>
      <div class="footer-button">
        <el-form-item>
          <el-button type="primary" text size="small" class="open" @click="searchShow = !searchShow"
            v-if="showSearchBtn">
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
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
import { localGet, parseTime } from "@/utils/util";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";
import authorButtons from "@/compositionApi/authorButtons";
export default {
  name: "SealingListSearch",

  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      searchForm: {},
      wareHouseList: [], // 中转仓
      purposeWarehouseList: [], // 仓区
      searchShow: false,
      warehouse_cases_status: [] //封箱字典
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      getDictList();
    });
    const getDictList = () => {
      // 中转仓
      api.warehouse.selectTransitWarehouse().then(res => {
        if (res.code == 200) {
          data.wareHouseList = res.data;
        }
      });
      // 仓区
      api.system.getWareHouseList({ type: 0 }).then(res => {
        if (res.code == 200) {
          data.purposeWarehouseList = res.data;
        }
      });

      data.warehouse_cases_status = localGet("purchaseDict").warehouse_cases_status ? localGet("purchaseDict").warehouse_cases_status : [];
    };
    const refData = toRefs(data);
    const getTableData = inject("getTableData");
    // 搜索
    const search = () => {
      data.searchForm.scroll = 0;
      let info = JSON.parse(JSON.stringify(data.searchForm))
      getTableData(info, true);
    };

    //创建时间事件
    const createDateBlur = e => {
      if (e) {
        data.searchForm.startTime = parseTime(e[0]);
        data.searchForm.endTime = parseTime(e[1]);
      } else {
        data.searchForm.startTime = "";
        data.searchForm.endTime = "";
      }
      search()
    };

    //封箱时间事件
    const dateBlur = e => {
      if (e) {
        data.searchForm.startBoxSealTime = parseTime(e[0]);
        data.searchForm.endBoxSealTime = parseTime(e[1]);
      } else {
        data.searchForm.startBoxSealTime = "";
        data.searchForm.endBoxSealTime = "";
      }
      search()
    };
    return {
      ...refData,
      getTableData,
      search,
      createDateBlur,
      dateBlur,
      showSearchBtn,
      buttonAuthor
    };
  }
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
