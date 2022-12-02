<!-- 单证付款计划搜索 -->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" size="mini" ref="searchParamRef" label-width="100px" :model="searchParam"
      class="demo-form-inline el-from">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="服务商 :" prop="transferWarehouseId" class="SearchPanel-form-item">
          <el-select v-model="searchParam.ServiceProviderId" size="mini" filterable clearable placeholder="请选择服务商"
            @change="search">
            <el-option :label="item.providersCname" :value="item.id" v-for="item in ServiceProviderList" :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费用类别 :" prop="purposeWarehouseId" class="SearchPanel-form-item">
          <el-select v-model="searchParam.purposeWarehouseId" size="mini" filterable clearable placeholder="请选择"
            @change="search">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="柜号 :" prop="cabinetNum" class="SearchPanel-form-item">
          <el-select v-model="searchParam.purposeWarehouseId" size="mini" filterable clearable placeholder="请选择"
            @change="search">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单证付款计划编号 :" prop="id" label-width="140px" class="SearchPanel-form-item">
          <el-input v-model.trim="searchParam.id" clearable placeholder="请输入" @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="更新时间 :" prop="endTime" class="SearchPanel-form-item">
          <el-date-picker style="width: 180px" v-model="searchParam.time" @change="dateBlur(searchParam.time)"
            placeholder="请选择更新时间" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item label="付款状态 :" prop="docDistributeStatus" class="SearchPanel-form-item">
          <el-select v-model="searchParam.docDistributeStatus" size="mini" filterable clearable placeholder="请选择"
            @change="search">
            <el-option label="已分配" value="true"></el-option>
            <el-option label="未分配" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否加急 :" prop="docDistributeStatus" class="SearchPanel-form-item">
          <el-select v-model="searchParam.docDistributeStatus" size="mini" filterable clearable placeholder="请选择"
            @change="search">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
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
import authorButtons from "@/compositionApi/authorButtons";
import { localGet, parseTime } from "@/utils/util";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";

export default {
  name: "DocumentPaymentPlanSearch",
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const { showSearchBtn } = useShowSearchBtn();
    const data = reactive({
      searchShow: false,
      searchParam: {},
      wareHouseList: [],
      ServiceProviderList: [],
      //仓区
      warehouseAreaList: [],
      provdierList: [], //服务商列表
      documentUserList: [], //单证人员列表
      doc_audit_status: [], //审核状态
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      getDictList();
    });
    const refData = toRefs(data);
    const getDictList = () => {
      data.doc_audit_status = localGet("purchaseDict") && localGet("purchaseDict").doc_audit_status ? localGet("purchaseDict").doc_audit_status : [];
      // 服务商
      api.assest.getAllProvdier().then(res => {
        if (res.code == 200) {
          data.ServiceProviderList = res.data;
        }
      });
    };
    const getTableData = inject("getTableData");
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
    return {
      ...refData,
      search,
      buttonAuthor,
      getTableData,
      dateBlur,
      showSearchBtn,
    };
  },
};
</script>
<style scoped lang='scss'>
#SearchPanel {
  .el-from {
    .el-form-item {
      margin-right: 0 !important;
      // width: 25%;

      .el-input {
        width: 180px;
      }

      .el-select {
        width: 180px;
      }
    }

    .createTime {
      width: 50%;

      .el-form-item {
        width: 100%;
      }
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
      width: 99%;
    }
  }
}
</style>