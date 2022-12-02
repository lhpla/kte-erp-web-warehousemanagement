<!-- 库存流水搜索 -->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" ref="searchFormDataRef" label-width="80px" :model="searchFormData"
      class="demo-form-inline el-from">
      <div class="form-content" :class="{ collapseClass: searchShow }">
      <el-form-item label="仓库:" class="SearchPanel-form-item">
        <el-select v-model="searchFormData.transferWarehouseId" filterable placeholder="请选择" clearable @change="search">
          <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓区:" class="SearchPanel-form-item">
        <el-select v-model="searchFormData.warehouseId" filterable placeholder="请选择" clearable @change="search">
          <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SKU:" class="SearchPanel-form-item">
        <el-input v-model.trim="searchFormData.sku" placeholder="输入sku" clearable @keyup.enter="search"></el-input>
      </el-form-item>
      <el-form-item label="批次号:" class="SearchPanel-form-item">
        <el-input v-model.trim="searchFormData.purOrderCode" placeholder="输入批次号" clearable @keyup.enter="search">
        </el-input>
      </el-form-item>
      <el-form-item label="关联单号:" class="SearchPanel-form-item">
        <el-input v-model.trim="searchFormData.relatedNumber" placeholder="输入关联单号" clearable @keyup.enter="search">
        </el-input>
      </el-form-item>
      <el-form-item label="类型:" class="SearchPanel-form-item">
        <el-select v-model="searchFormData.inventoryOperateType" filterable placeholder="请选择" clearable
          @change="timeTypeChange">
          <el-option v-for="item in typeList" :key="item.dizKey" :label="item.value" :value="item.dizKey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间:" class="SearchPanel-form-item">
        <div class="flex">
          <el-date-picker v-model="time" @change="dateBlur(time)" type="datetimerange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </div>
      </el-form-item>
    </div>
      <div class="footer-button">
        <el-form-item>
          <el-button type="primary" text class="open footer-button-expand" @click="searchShow = !searchShow"
            v-if="showSearchBtn">
            {{ searchShow ? "合并" : "展开" }}
            <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </el-button>
          <el-button type="primary" @click="search" size="small">搜 索</el-button>
          <el-button type="primary" @click="reset" size="small">重 置</el-button>
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
  name: "inventoryFlowSearch",
  setup(prop, ctx) {
    const data = reactive({
      //仓库列表
      warehouseList: [],
      //仓区列表
      warehouseAreaList: [],
      //类型列表
      typeList: [],
      //搜索表单
      searchFormData: {
        warehouseId: "",
        transferWarehouseId: "",
        sku: "",
        relatedNumber: "",
        purOrderCode: "",
        inventoryOperateType: "",
        startTime: "",
        endTime: ""
      },
      time: "",
      searchShow: false,
    });
    const { showSearchBtn } = useShowSearchBtn();
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      getDictList();
    });
    const getTableData = inject("getTableData");
    // 日期修改
    const dateBlur = e => {
      if (e) {
        data.searchFormData.startTime = parseTime(e[0]);
        data.searchFormData.endTime = parseTime(e[1]);
      } else {
        data.time = "";
        data.searchFormData.startTime = "";
        data.searchFormData.endTime = "";
      }
      search()
    };

    //重置
    const reset = () => {
      data.searchFormData = {
        warehouseId: "",
        transferWarehouseId: "",
        sku: "",
        relatedNumber: "",
        purOrderCode: "",
        inventoryOperateType: "",
        startTime: "",
        endTime: ""
      }
      data.time = "";
      getTableData(data.searchFormData, true);
    };
    //搜索
    const search = () => {
      if (data.searchFormData.startDays) {
        data.searchFormData.startDays = Number(data.searchFormData.startDays);
      }
      if (data.searchFormData.endDays) {
        data.searchFormData.endDays = Number(data.searchFormData.endDays);
      }
      data.searchFormData.scroll = 0;
      data.searchFormData.sku = data.searchFormData.sku.trim()
      data.searchFormData.purOrderCode = data.searchFormData.purOrderCode.trim()
      data.searchFormData.relatedNumber = data.searchFormData.relatedNumber.trim()
      getTableData(data.searchFormData, true);
    };

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
      //类型
      data.typeList = localGet("purchaseDict").inventory_serial_type;
    };

    const timeTypeChange = (e) => {
      data.time = ''
      data.searchFormData.startTime = ''
      data.searchFormData.endTime = ''
    }
    //获取类型列表
    const refData = toRefs(data);
    return {
      ...refData,
      dateBlur,
      reset,
      search,
      timeTypeChange,
      showSearchBtn
    };
  }
};
</script>
<style scoped lang="scss">
#SearchPanel {
  margin: 0;

  .form-content {
    height: 35px;
    overflow: hidden;
    transition: all 0.5s !important;
  }

  .el-form-item {
    margin-bottom: 5px !important;
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
