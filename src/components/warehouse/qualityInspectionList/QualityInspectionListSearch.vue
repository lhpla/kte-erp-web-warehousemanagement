<!-- 质检列表 -->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" ref="formInlineRef" label-width="85px" :model="searchForm" class="demo-form-inline el-from">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="物流单号:" class="SearchPanel-form-item">
          <el-input v-model="searchForm.logisticsNum" placeholder="请输入" clearable @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="供应商:" class="SearchPanel-form-item">
          <SupplierPublic ref="searcSupplierPublic" @handChange="searcHandChange"></SupplierPublic>
        </el-form-item>
        <el-form-item label="中转仓库:" class="SearchPanel-form-item">
          <el-select v-model="searchForm.warehouseId" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item in wareHouseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:" class="SearchPanel-form-item">
          <el-select v-model="searchForm.qualityStatus" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item in qualityInspectionList" :key="item.dizKey" :label="item.value"
              :value="item.dizKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="PO单号:" class="SearchPanel-form-item">
          <el-input v-model="searchForm.orderCode" placeholder="请输入" clearable @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="SKU:" class="SearchPanel-form-item">
          <el-input v-model.trim="searchForm.sku" placeholder="请输入" clearable @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="采购员:" class="SearchPanel-form-item">
          <el-select filterable clearable v-model="searchForm.buyerId" placeholder="请选择" @change="search">
            <el-option v-for="item in purchaseUserList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="质检员:" class="SearchPanel-form-item">
          <el-select filterable clearable v-model="searchForm.qualityUser" placeholder="请选择" @change="search">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否质检:" class="SearchPanel-form-item">
          <el-select v-model="searchForm.isCheck" filterable clearable placeholder="请选择" @change="search">
            <el-option label="否" :value="false"></el-option>
            <el-option label="是" :value="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货时间:" class="SearchPanel-form-item">
          <el-date-picker v-model="searchForm.qualityTime" @change="dateBlur(searchForm.qualityTime)"
            type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="是否直发:" class="SearchPanel-form-item">
          <el-select v-model="searchForm.isDirect" filterable clearable placeholder="请选择" @change="search">
            <el-option label="否" :value="false"></el-option>
            <el-option label="是" :value="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签收批次:" class="SearchPanel-form-item">
          <el-input v-model.trim="searchForm.receiptBatchNum" placeholder="请输入" clearable
            @input="searchForm.receiptBatchNum = searchForm.receiptBatchNum.replace(/[^\d]/g, '')"
            @keyup.enter="search">
          </el-input>
        </el-form-item>

        <el-form-item label="签收时间:" class="SearchPanel-form-item">
          <el-date-picker v-model="searchForm.signTime" @change="signDateBlur(searchForm.signTime)" type="datetimerange"
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
import { parseTime, localGet } from "@/utils/util";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";
export default {
  name: "QualityInspectionListSearch",
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const data = reactive({
      searchForm: {
        startQualityTime: "",
        endQualityTime: "",
        qualityTime: [],
        signTime: [],
        signEndTime: "",
        signStartTime: "",
        qualityStatus: "",
        sku: "",
        receiptBatchNum: "",
      },
      wareHouseList: [], // 中转仓
      searchShow: false,
      purchaseUserList: [], // 采购员
      qualityInspectionList: [], //质检状态
      userList: [],//质检员
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      data.qualityInspectionList = localGet("purchaseDict")
        .quality_inspection_status
        ? localGet("purchaseDict").quality_inspection_status
        : [];
      getDictList();
      data.searchForm.orderCode = vue.$route.query.orderCode ? vue.$route.query.orderCode : data.searchForm.orderCode;
      search()
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
      // 质检员
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
      data.searchForm.logisticsNum = data.searchForm.logisticsNum
        ? data.searchForm.logisticsNum.trim()
        : "";
      data.searchForm.orderCode = data.searchForm.orderCode
        ? data.searchForm.orderCode.trim()
        : "";
      getTableData(data.searchForm);
    };

    //日期修改
    const dateBlur = (e) => {
      if (e) {
        data.searchForm.startQualityTime = parseTime(e[0]);
        data.searchForm.endQualityTime = parseTime(e[1]);
      } else {
        data.searchForm.startQualityTime = "";
        data.searchForm.endQualityTime = "";
      }
      search();
    };
    const signDateBlur = (e) => {
      if (e) {
        data.searchForm.signStartTime = parseTime(e[0]);
        data.searchForm.signEndTime = parseTime(e[1]);
      } else {
        data.searchForm.signStartTime = "";
        data.searchForm.signEndTime = "";
      }
      search();
    };
    //搜索供应商
    const searcHandChange = (e, name) => {
      data.searchForm.supplierName = name;
      search();
    };
    return {
      ...refData,
      searcHandChange,
      search,
      dateBlur,
      showSearchBtn,
      signDateBlur,
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