<!-- 出柜异常搜索 -->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" label-width="120px" :model="searchForm" class="demo-form-inline el-from"
      ref="formRef" @submit.native.prevent>
      <div>
        <el-form-item label="中转仓库:">
          <el-select v-model="searchForm.transferWarehouseId" clearable filterable placeholder="请选择" @change="search">
            <el-option v-for="item in wareHouseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓区:">
          <el-select filterable clearable v-model="searchForm.purposeWarehouseId" placeholder="请选择" @change="search">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="柜号:">
          <el-input v-model.trim="searchForm.cabinetNum" placeholder="请输入" clearable @keyup.enter="search"
            maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="发货计划ID:">
          <el-input v-model.trim="searchForm.shippingId" placeholder="请输入" clearable @keyup.enter="search"
            maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="类型:">
          <el-select filterable clearable v-model="searchForm.cabinetAbnormalType" placeholder="请选择" @change="search">
            <el-option v-for="item in cabinet_abnormal_type" :key="item.dizKey" :label="item.value"
              :value="item.dizKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="异常状态:">
          <el-checkbox-group v-model="searchForm.statuses"
            @change="changeClick(searchForm.statuses, 'statuses', cabinet_abnormal_status.length)">
            <el-checkbox-button label="0">全部</el-checkbox-button>
            <el-checkbox-button v-for="item of cabinet_abnormal_status" :label="item.dizKey" :key="item.dizKey">{{
            item.value
            }}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="入库单状态:">
          <el-checkbox-group v-model="searchForm.enterCodeStatus"
            @change="changeClick(searchForm.enterCodeStatus, 'enterCodeStatus', shippingEnterCodeStatusList.length)">
            <el-checkbox-button label="0">全部</el-checkbox-button>
            <el-checkbox-button v-for="item of shippingEnterCodeStatusList" :label="item.dizKey" :key="item.dizKey">{{
            item.value
            }}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </div>

      <div class="footer-button">
        <el-form-item>
          <el-button type="primary" size="small"  @click="search">搜 索</el-button>
          <el-button type="primary" size="small"  @click="reset">重 置</el-button>
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
import { localGet } from "@/utils/util";
import authorButtons from "@/compositionApi/authorButtons";
export default {
  name: "OutArkAbnormalSearch",
  setup(prop, ctx) {
    const data = reactive({
      searchForm: {
        statuses: ["0"],
        cabinetNum: "",
        purposeWarehouseId: "",
        transferWarehouseId: "",
        enterCodeStatus: ["0"],
        shippingId: ""
      },
      invoice_status: [],
      wareHouseList: [], // 中转仓库
      warehouseAreaList: [], // 仓区
      cabinet_abnormal_status: [],
      shippingEnterCodeStatusList: [],
      cabinet_abnormal_type: []
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    onBeforeMount(() => { });
    onMounted(() => {
      getDictList();
      data.searchForm.cabinetNum = vue.$route.query.cabinetNum ? vue.$route.query.cabinetNum : data.searchForm.cabinetNum;
      data.searchForm.cabinetAbnormalType = vue.$route.query.type ? vue.$route.query.type : data.searchForm.cabinetAbnormalType;
      search()
    });
    const refData = toRefs(data);
    const getDictList = () => {
      // 中转仓库
      api.warehouse.selectTransitWarehouse().then((res) => {
        if (res.code == 200) {
          data.wareHouseList = res.data;
        }
      });
      // 仓区
      api.warehouse.selectPurposeWarehouse().then((res) => {
        if (res.code == 200) {
          data.warehouseAreaList = res.data;
        }
      });
      //异常状态
      data.cabinet_abnormal_status =
        localGet("purchaseDict") &&
          localGet("purchaseDict").cabinet_abnormal_status
          ? localGet("purchaseDict").cabinet_abnormal_status
          : [];
      //入库单状态
      data.shippingEnterCodeStatusList =
        localGet("purchaseDict") && localGet("purchaseDict").shipping_enter_code_status ? localGet("purchaseDict").shipping_enter_code_status : [];

      //类型
      data.cabinet_abnormal_type =
        localGet("purchaseDict") && localGet("purchaseDict").cabinet_abnormal_type ? localGet("purchaseDict").cabinet_abnormal_type : [];
    };

    const getTableData = inject("getTableData");
    // 多选改变
    const changeClick = (arr, name, length) => {
      if (arr.length > 0) {
        if (arr.length == length && arr[0] !== "0") {
          data.searchForm[name] = ["0"];
        } else if (arr[0] == "0") {
          let findResult = arr.indexOf("0");
          if (findResult !== -1) {
            data.searchForm[name].splice(findResult, 1);
          }
        } else {
          let findResult = arr.indexOf("0");
          if (findResult !== -1) {
            data.searchForm[name] = ["0"];
          }
        }
      } else {
        data.searchForm[name] = ["0"];
      }
      search()
    };
    const formRef = ref()
    //重置
    const reset = () => {
      formRef.value.resetFields();
      const keys = Object.entries(data.searchForm)
      for (let i in keys) {
        if (keys[i][0] == 'statuses' || keys[i][0] == 'enterCodeStatus') {
          data.searchForm[keys[i][0]] = ["0"]
        } else {
          data.searchForm[keys[i][0]] = ""
        }
      }
      console.log(data.searchForm);
      search();
    };
    const search = () => {
      let msg = JSON.parse(JSON.stringify(data.searchForm));
      msg.statuses =
        data.searchForm.statuses[0] === "0" ? null : data.searchForm.statuses;
      msg.enterCodeStatus =
        data.searchForm.enterCodeStatus[0] === "0" ? null : data.searchForm.enterCodeStatus;
      data.searchForm.scroll = 0;
      getTableData(msg);

    };
    return {
      ...refData,
      changeClick,
      getTableData,
      search,
      reset,
      formRef,
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
