<!-- ReviewDeliveryPlanSearch  柜号列表搜索-->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" label-width="110px" :model="searchParam" class="demo-form-inline" ref="searchFormDataRef">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="中转仓库:" class="SearchPanel-form-item">
          <el-select v-model="searchParam.transitWarehouse" multiple clearable collapse-tags collapse-tags-tooltip
            placeholder="请选择" @change="search">
            <el-option v-for="item in transitWarehouseList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <!-- </el-select>
          <el-select v-model="searchParam.transitWarehouse" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item in transitWarehouseList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="仓区:" class="SearchPanel-form-item">
          <el-select v-model="searchParam.warehouseArea" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="头程属性:" class="SearchPanel-form-item">
          <el-select v-model="searchParam.headerAttribute" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item in header_attribute" :key="item.dizKey" :label="item.value" :value="item.dizKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="SearchPanel-form-item" label="运输方式：">
          <el-select v-model="searchParam.transportMode" @change="search" filterable clearable placeholder="请选择">
            <el-option v-for="item in channelList" :key="item.dizKey" :label="item.value" :value="item.dizKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="柜号:" class="SearchPanel-form-item">
          <el-input v-model="searchParam.deliveryNo" placeholder="请输入" clearable @keyup.enter="search"></el-input>
        </el-form-item>
      </div>
      <div style="margin-top: 15px;">
        <el-form-item label="柜子状态:">
          <el-checkbox-group v-model="searchParam.state"
            @change="changeClick(searchParam.state, 'state', stateList.length)">
            <el-checkbox-button label="0">全部</el-checkbox-button>
            <el-checkbox-button v-for="item of stateList" :label="item.dizKey" :key="item.dizKey">{{ item.value }}
            </el-checkbox-button>
          </el-checkbox-group>
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
          <el-button type="primary" size="small" @click="reset">重 置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
import { localGet } from "@/utils/util";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";
export default {
  name: "ReviewDeliveryPlanSearch",
  props: ["searchMsg"],
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const data = reactive({
      searchParam: {
        //出库号
        deliveryNo: "",
        //状态
        state: ["0"],
        //中转仓库
        transitWarehouse: [],
        //仓区
        warehouseArea: "",
        //运输方式
        transportMode: "",
        headerAttribute: ""
      },
      //状态列表
      stateList: [],
      //中转仓库列表
      transitWarehouseList: [],
      //仓区
      warehouseAreaList: [],
      //运输方式
      channelList: [],
      searchShow: false,
      header_attribute: []
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const getTableList = inject("getTableList");
    onBeforeMount(() => { });
    onMounted(() => {
      data.stateList =
        localGet("purchaseDict") && localGet("purchaseDict").cabinet_status ? localGet("purchaseDict").cabinet_status : [];
      data.header_attribute =
        localGet("purchaseDict") && localGet("purchaseDict").header_attribute ? localGet("purchaseDict").header_attribute : [];
      // 中转仓
      api.warehouse.selectTransitWarehouse().then(res => {
        if (res.code == 200) {
          data.transitWarehouseList = res.data;
        }
      });
      // 仓区
      api.warehouse.selectPurposeWarehouse().then(res => {
        if (res.code == 200) {
          data.warehouseAreaList = res.data;
        }
      });
      //运输方式
      data.channelList = localGet("purchaseDict") && localGet("purchaseDict").transportation_type ? localGet("purchaseDict").transportation_type : [];
    });

    //search 搜索
    const search = () => {
      let msg = {
        cabinetNum: data.searchParam.deliveryNo,
        statuses: data.searchParam.state[0] == "0" ? null : data.searchParam.state,
        transferWarehouseIds: data.searchParam.transitWarehouse,
        purposeWarehouseId: data.searchParam.warehouseArea,
        transportMode: data.searchParam.transportMode,
        type: 2,
        size: vue.searchMsg.size,
        current: vue.searchMsg.current,
      };
      msg.scroll = 0;
      getTableList(msg);
    };
    const searchFormDataRef = ref()
    //重置
    const reset = () => {
      searchFormDataRef.value.resetFields();
      searchFormDataRef.value.clearValidate();
      const keys = Object.entries(data.searchParam)
      console.log(keys);
      for (let i in keys) {
        if (keys[i][0] == 'state') {
          data.searchParam[keys[i][0]] = ["0"]
        } else if (keys[i][0] == 'transitWarehouse') {
          data.searchParam[keys[i][0]] = []
        } else {
          data.searchParam[keys[i][0]] = ""
        }
      }
      console.log(data.searchParam);
      search();
    };
    // 多选改变
    const changeClick = (arr, name, length) => {
      if (arr.length > 0) {
        if (arr.length == length && arr[0] !== "0") {
          data.searchParam[name] = ["0"];
        } else if (arr[0] == "0") {
          let findResult = arr.indexOf("0");
          if (findResult !== -1) {
            data.searchParam[name].splice(findResult, 1);
          }
        } else {
          let findResult = arr.indexOf("0");
          if (findResult !== -1) {
            data.searchParam[name] = ["0"];
          }
        }
      } else {
        data.searchParam[name] = ["0"];
      }
      search()
    };

    const refData = toRefs(data);
    return {
      ...refData,
      search,
      getTableList,
      changeClick,
      showSearchBtn,
      reset,
      searchFormDataRef
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

  .SearchPanel-form-item {
    margin-bottom: 15px !important;
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
    margin: 0px 0 10px 0;
  }


}
</style>
