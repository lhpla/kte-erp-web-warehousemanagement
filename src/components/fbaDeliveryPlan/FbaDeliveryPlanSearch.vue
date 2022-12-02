<!--FBA发货计划  -->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" ref="searchParamRef" label-width="120px" :model="searchParam"
      class="demo-form-inline el-from">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="中转仓库 :" prop="transferWarehouseId" class="SearchPanel-form-item">
          <el-select v-model="searchParam.transferWarehouseId" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item in wareHouseList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓区:" prop="purposeWarehouseId" class="SearchPanel-form-item">
          <el-select v-model="searchParam.purposeWarehouseId" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" class="SearchPanel-form-item" label-width="180px">
          <template #label>
            <div>
              shipment ID :
              <el-button size="small" @click="tmClick" :class="searchParam.transparentPlan?'set-btn':'set-other-btn'">T
              </el-button>
            </div>
          </template>
          <el-input v-model="searchParam.shipmentId" placeholder="请输入" clearable @keyup.enter="search"></el-input>
        </el-form-item>

        <el-form-item label="货件追踪号:" class="SearchPanel-form-item" prop="goodsTrackNum">
          <el-input v-model="searchParam.goodsTrackNum" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <div class="SearchPanel-form-item">
          <el-form-item label="计划状态:" prop="planStatus">
            <el-checkbox-group v-model="searchParam.planStatus"
              @change="changeClick(searchParam.planStatus, 'planStatus', plan_status.length)">
              <el-checkbox-button label="0">全部</el-checkbox-button>
              <el-checkbox-button v-for="item of plan_status" :label="item.dizKey" :key="item.dizKey">
                {{ item.value }}
                <span v-for="num of plan_status_num" :key="num.status">
                  <span v-if="item.dizKey == num.status">({{ num.number }})</span>
                </span>
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div class="SearchPanel-form-item">
          <el-form-item label="提货安排:" prop="fbaShipmentIds">
            <el-checkbox-group v-model="searchParam.fbaShipmentIds"
              @change="changeClick(searchParam.fbaShipmentIds, 'fbaShipmentIds', selectPickUpGoodsList.length)">
              <el-checkbox-button label="0">全部</el-checkbox-button>
              <template v-for="item of selectPickUpGoodsList" :key="item.shippingId">
                <el-checkbox-button :label="item.shippingId">
                  <div style="display: flex; align-items:center">
                    <span style="magin-left:5px">{{item.provider}}-{{item.time}}</span>
                    <el-popover width="530" placement="bottom" trigger="hover">
                      <template #reference>
                        <span style="color: #409eff;padding: 1px 0 0 2px;">
                          <i class="el-icon-tickets"></i>
                        </span>
                      </template>
                      <vxe-table :data="[item]" border header-row-class-name="header_size">
                        <vxe-column width="100" field="transitWarehouse" title="中转仓库"></vxe-column>
                        <vxe-column width="100" field="provider" title="服务商"></vxe-column>
                        <vxe-column width="130" field="pickUpTime" title="提货时间"></vxe-column>
                        <vxe-column width="100" field="transportMode" title="运输方式"></vxe-column>
                        <vxe-column width="100" field="freight" title="预估运费"></vxe-column>
                      </vxe-table>
                    </el-popover>
                  </div>
                </el-checkbox-button>
              </template>
            </el-checkbox-group>
          </el-form-item>
        </div>

      </div>
      <div class="footer-button">
        <el-button type="primary" text size="small" class="open" @click="searchShow = !searchShow" v-if="showSearchBtn">
          {{ searchShow ? "合并" : "展开" }}
          <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </el-button>
        <el-button type="primary" size="small" @click="search">搜 索</el-button>
        <el-button type="primary" size="small" @click="reset">重 置</el-button>
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
import { localGet } from "@/utils/util";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";
export default {
  name: "FbaDeliveryPlanSearch",
  props: ["searchMsg", 'plan_status_num'],
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const data = reactive({
      searchParam: {
        planStatus: ["0"],
        fbaShipmentIds: ["0"],
        transparentPlan: false
      },
      wareHouseList: [],
      warehouseAreaList: [],
      searchShow: false,
      selectPickUpGoodsList: [],
      //计划状态
      plan_status: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      getDictList();
    });
    const refData = toRefs(data);
    const searchParamRef = ref(null)
    //获取下拉信息
    const getDictList = () => {
      data.plan_status =
        localGet("purchaseDict") &&
          localGet("purchaseDict").plan_status
          ? localGet("purchaseDict").plan_status
          : [];
      // 中转仓
      api.system.getWareHouseList({ type: 1 }).then((res) => {
        if (res.code == 200) {
          data.wareHouseList = res.data;
        }
      });
      // 仓区
      api.system.getWareHouseList({ type: 0 }).then((res) => {
        if (res.code == 200) {
          data.warehouseAreaList = res.data;
        }
      });

      // 提货安排
      api.fba.selectPickUpGoods().then((res) => {
        if (res.code == 200) {
          data.selectPickUpGoodsList = res.data;
        }
      });
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
    const getTableData = inject("getTableData");
    //搜索
    const search = () => {
      let vo = JSON.parse(JSON.stringify(data.searchParam))
      vo.planStatus = vo.planStatus[0] == 0 ? null : vo.planStatus
      vo.fbaShipmentIds = vo.fbaShipmentIds[0] == 0 ? null : vo.fbaShipmentIds
      vo.size = prop.searchMsg.size
      vo.current = 1
      getTableData(vo);
    };
    const tmClick = () => {
      data.searchParam.transparentPlan = !data.searchParam.transparentPlan
      search()
    }
    //重置
    const reset = () => {
      searchParamRef.value.resetFields()
      data.searchParam = {
        planStatus: ["0"],
        fbaShipmentIds: ["0"],
        transparentPlan: false
      },
        search()
    }
    return {
      ...refData,
      getTableData,
      showSearchBtn,
      changeClick,
      reset,
      searchParamRef,
      search,
      tmClick
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
    margin: 8px 0;
    margin-right: 10px;
  }

  .set-btn {
    color: #fff;
    background-color: #66b1ff;
    border-color: #66b1ff;
  }


  .set-other-btn {
    color: #409eff;
    background-color: #fff;
    border-color: #dcdfe6;
  }



}
</style>
