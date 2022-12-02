<!-- 签收列表搜索 -->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" ref="formInlineRef" label-width="90px" :model="searchForm" class="demo-form-inline el-from">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="物流单号:" class="SearchPanel-form-item">
          <el-input v-model.trim="searchForm.logisticsNum" placeholder="请输入" clearable @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="供应商:" class="SearchPanel-form-item">
          <SupplierPublic ref="searcSupplierPublic" @handChange="searcHandChange"></SupplierPublic>
        </el-form-item>
        <el-form-item label="中转仓库:" class="SearchPanel-form-item">
          <el-select v-model="searchForm.warehouseId" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item in wareHouseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="PO单号:" class="SearchPanel-form-item">
          <el-input v-model.trim="searchForm.orderCode" placeholder="请输入" clearable @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="SKU:" class="SearchPanel-form-item">
          <el-input v-model.trim="searchForm.sku" placeholder="请输入" clearable @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="采购员:" class="SearchPanel-form-item">
          <el-select filterable clearable v-model="searchForm.buyerId" placeholder="请选择" @change="search">
            <el-option v-for="item in purchaseUserList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签收员:" class="SearchPanel-form-item">
          <el-select filterable clearable v-model="searchForm.signer" placeholder="请选择" @change="search">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否质检:" class="SearchPanel-form-item">
          <el-select v-model="searchForm.isCheck" filterable clearable placeholder="请选择" @change="search">
            <el-option label="否" :value="false"></el-option>
            <el-option label="是" :value="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签收批次:" class="SearchPanel-form-item">
          <el-input v-model.trim="searchForm.receiptBatchNum"
            @input="searchForm.receiptBatchNum = searchForm.receiptBatchNum.replace(/[^\d]/g, '')" placeholder="请输入"
            clearable @keyup.enter="search">
          </el-input>
        </el-form-item>
        <el-form-item label="创建时间:" class="SearchPanel-form-item">
          <el-date-picker v-model="searchForm.dateTime" @change="dateBlur(searchForm.dateTime)" type="datetimerange"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
      </div>

      <div class="footer-button">
        <el-form-item>
          <el-button type="primary" text size="small" class="open" @click="searchShow = !searchShow"
            v-if="showSearchBtn">
            {{ searchShow ? "合并" : "展开" }}
            <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </el-button>
          <el-button type="primary" size="small" @click="search"> 搜 索
          </el-button>
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
  nextTick,
} from "vue";
import { parseTime } from "@/utils/util";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";
export default {
  name: "SignForListSearch",
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const data = reactive({
      searchForm: {
        receiptBatchNum: ''
      },
      wareHouseList: [], // 中转仓
      searchShow: false,
      purchaseUserList: [], // 采购员
      userList: [],//签收员
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      getDictList();
    });
    const refData = toRefs(data);
    // 获取下拉信息
    const getDictList = () => {
      // 中转仓
      api.system.getWareHouseList({ type: 1 }).then((res) => {
        if (res.code == 200) {
          data.wareHouseList = res.data;
        }
      });
      // 采购员
      api.userOperation.getHeadOfPurchasing().then((res) => {
        if (res.code == 200) {
          data.purchaseUserList = res.data;
        }
      });
      // 签收员
      api.warehouse.getUsersOfWarehouse().then((res) => {
        if (res.code == 200) {
          data.userList = res.data;
        }
      });
    };
    const getTableData = inject("getTableData");
    // 搜索
    const search = () => {
      data.searchForm.scroll = 0;
      getTableData(data.searchForm);
    };
    // 搜索供应商
    const searcHandChange = (e, name) => {
      data.searchForm.supplierName = name;
      search();
    };

    // 日期修改
    const dateBlur = (e) => {
      if (e) {
        data.searchForm.startTime = parseTime(e[0]);
        data.searchForm.endTime = parseTime(e[1]);
      } else {
        data.searchForm.startTime = "";
        data.searchForm.endTime = "";
      }
      search();
    };
    return {
      ...refData,
      searcHandChange,
      search,
      dateBlur,
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









