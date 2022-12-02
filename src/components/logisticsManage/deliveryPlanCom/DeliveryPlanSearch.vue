<!-- DeliveryPlanSearch 发货计划搜索 -->
<template>
  <div id="SearchPanel">
    <el-form :model="searchParam" ref="searchForm" label-width="100px" class="demo-form-inline" :inline="true">
      <div>
        <el-form-item label="单号:" class="SearchPanel-form-item">
          <div class="flex">
            <el-select v-model="searchParam.selectValue" placeholder="请选择" class="size-width">
              <el-option v-for="item in orderCodeTypeList" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
            <el-input clearable v-model.trim="searchParam.selectInputValue" @keyup.enter="search"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="PO单号:" prop="orderCode">
          <el-input placeholder="双击批量查询" v-model="searchParam.orderCode"
            @dblclick="openInput(searchParam.orderCode, 'orderCode')" @keyup.enter="search" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="中转仓库:" prop="transferWarehouseId">
          <el-select v-model="searchParam.transferWarehouseId" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item in transitWarehouseList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓区:" prop="purposeWarehouseId">
          <el-select v-model="searchParam.purposeWarehouseId" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运输方式：">
          <el-select v-model="searchParam.shippingTransport" @change="search" filterable clearable placeholder="请选择">
            <el-option v-for="item in channelList" :key="item.dizKey" :label="item.value" :value="item.dizKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="柜号:" prop="cabinetNum">
          <el-input v-model="searchParam.cabinetNum" clearable placeholder="请输入" @keyup.enter="search" maxlength="100">
          </el-input>
        </el-form-item>
        <el-form-item label="时间:" class="SearchPanel-form-item">
          <div class="flex">
            <el-select v-model="searchParam.timeType" placeholder="请选择" class="size-width1">
              <el-option v-for="item in timeList" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
            <el-date-picker v-model="searchParam.dateTime" @change="dateBlur(searchParam.dateTime)" type="datetimerange"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </div>
        </el-form-item>
        <div>
          <el-form-item label="状态:">
            <el-checkbox-group v-model="searchParam.shippingStatus"
              @change="changeClick(searchParam.shippingStatus, 'shippingStatus', shippingStatusList.length)">
              <el-checkbox-button label="0">全部</el-checkbox-button>
              <el-checkbox-button v-for="item of shippingStatusList" :label="item.dizKey" :key="item.dizKey">{{
                  item.value
              }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div style="margin-top: 3px;">
          <el-form-item label="入库单状态:">
            <el-checkbox-group v-model="searchParam.shippingEnterCodeStatus"
              @change="changeClick(searchParam.shippingEnterCodeStatus, 'shippingEnterCodeStatus', shippingEnterCodeStatusList.length)">
              <el-checkbox-button label="0">全部</el-checkbox-button>
              <el-checkbox-button v-for="item of shippingEnterCodeStatusList" :label="item.dizKey" :key="item.dizKey">{{
                  item.value
              }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </div>

      <div class="footer-button">
        <el-form-item>
          <!-- <el-button type="text" @click="changeSearchShow"
            :icon="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" v-if="showSearchBtn">
            {{ searchShow ? "收起" : "展开" }}
          </el-button> -->
          <el-button type="primary" size="small" @click="search">搜 索</el-button>
          <el-button type="primary" size="small" @click="reset">重 置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, watch, nextTick } from "vue";
import { localGet, parseTime } from "@/utils/util";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";
import authorButtons from "@/compositionApi/authorButtons";
export default {
  name: "DeliveryPlanSearch",
  props: ["searchMsg"],
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const data = reactive({
      searchShow: false,
      orderCodeTypeList: [
        { key: "shippingId", value: "发货计划ID" },
        { key: "soCode", value: "SO号" },
        { key: "overseasCabinetNum", value: "海柜号" },
        { key: "numberPlate", value: "车牌号" },
        { key: "enterWarehouseCode", value: "入库单号" },
      ],
      timeList: [
        { key: "create_time", value: "创建时间" },
        { key: "out_warehouse_time", value: "出库时间" },
        { key: "update_time", value: "更新时间" },
      ],
      searchParam: {
        transferWarehouseId: "",
        shippingTransport: "",
        cabinetNum: "",
        purposeWarehouseId: "",
        shippingEnterCodeStatus: ['0'],
        shippingStatus: ['0'],
        selectValue: 'shippingId',
        selectInputValue: '',
        orderCode: '',
        dateTime: '',
        timeType: "create_time",
        startTime: '',
        endTime: '',
      },
      //中转仓库列表
      transitWarehouseList: [],
      //仓区
      warehouseAreaList: [],
      //运输方式
      channelList: [],
      shippingEnterCodeStatusList: [],
      shippingStatusList: [],
      showMessage: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const getTableData = inject("getTableData");
    onBeforeMount(() => { });

    onMounted(() => {
      //入库单状态
      data.shippingEnterCodeStatusList =
        localGet("purchaseDict") && localGet("purchaseDict").shipping_enter_code_status ? localGet("purchaseDict").shipping_enter_code_status : [];
      //发货计划状态
      data.shippingStatusList =
        localGet("purchaseDict") && localGet("purchaseDict").shipping_status ? localGet("purchaseDict").shipping_status : [];
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
      data.channelList = localGet("purchaseDict") && localGet("purchaseDict").seceiving_shipping ? localGet("purchaseDict").seceiving_shipping : [];
    });

    //search 搜索
    const search = () => {
      let vo = {
        transferWarehouseId: data.searchParam.transferWarehouseId,
        shippingTransport: data.searchParam.shippingTransport,
        cabinetNum: data.searchParam.cabinetNum,
        purposeWarehouseId: data.searchParam.purposeWarehouseId,
        orderCode: data.searchParam.orderCode,
        shippingEnterCodeStatus: data.searchParam.shippingEnterCodeStatus[0] == "0" ? null : data.searchParam.shippingEnterCodeStatus,
        shippingStatus: data.searchParam.shippingStatus[0] == "0" ? null : data.searchParam.shippingStatus,
        timeType: data.searchParam.timeType,
        startTime: data.searchParam.startTime,
        endTime: data.searchParam.endTime,
        size: prop.searchMsg.size,
        current: 1,
      };
      if (data.searchParam.selectValue && data.searchParam.selectInputValue) {
        vo[data.searchParam.selectValue] = data.searchParam.selectInputValue.trim();
      }
      if (data.searchParam.timeType && data.searchParam.timeSelectInputValue) {

        vo[data.searchParam.timeType] = data.searchParam.timeSelectInputValue.trim();
      }
      getTableData(vo);

    };
    const searchForm = ref()
    // 日期修改
    const dateBlur = (e) => {
      if (data.searchParam.timeType) {
        if (e) {
          data.searchParam.startTime = parseTime(e[0]);
          data.searchParam.endTime = parseTime(e[1]);
        } else {
          data.searchParam.startTime = "";
          data.searchParam.endTime = "";
        }
        search()
      } else {
        data.searchParam.dateTime = null;
        vue.$message({
          type: "warning",
          message: "请选择时间类型",
        });
      }

    };
    //重置
    const reset = () => {
      searchForm.value.resetFields();
      const keys = Object.entries(data.searchParam)
      for (let i in keys) {
        if (keys[i][0] == 'shippingEnterCodeStatus' || keys[i][0] == 'shippingStatus') {
          data.searchParam[keys[i][0]] = ["0"]
        } else if (keys[i][0] == 'selectValue') {
          data.searchParam[keys[i][0]] = "shippingId"
        } else {
          data.searchParam[keys[i][0]] = ""
        }

      }
      console.log(data.searchParam);
      search();
    };
    // //changeSearchShow 展开 收起搜索
    // const changeSearchShow = () => {
    //   data.searchShow = !data.searchShow;
    // };

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
    const temp = ref("");
    //批量搜索
    const openInput = (info, name) => {
      data.showMessage = true;
      vue
        .$prompt("可输入多个，以英文分号、逗号、空格或者回车隔开", "批量查询", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValue: info,
          inputType: "textarea",
          inputValidator: (value) => {
            if (value && value.length > 500) {
              return "输入字符不能大于500 ";
            }
          },
        })
        .then(({ value }) => {
          data.searchParam[name] = temp.value
            .trim()
            .replaceAll("\n", ";")
            .replaceAll(" ", ";")
            .replaceAll(",", ";")
            .replaceAll("，", ";")
            .replaceAll("；", ";");
          data.searchParam[name] = data.searchParam[name]
            .split(";")
            .filter((item) => item !== "")
            .join(";");
          data.showMessage = false;
          temp.value = "";
        })
        .catch((e) => {
          temp.value = "";
          data.showMessage = false;
        });
    };

    watch(
      () => data.showMessage,
      (val) => {
        if (val) {
          nextTick(() => {
            let textarea = document.getElementsByTagName("textarea")[0];
            textarea.addEventListener("keydown", (e) => {
              if (e.key === "Enter") {
                const index = handleInputREnter(e);
                textarea.value = textarea.value.substring(0, index) + "\n" + textarea.value.substring(index);
              }
              temp.value = textarea.value;
            });
            textarea.addEventListener("input", () => {
              temp.value = textarea.value;
            });
          });
        }
      }
    );
    const handleInputREnter = (e) => {
      const index = e.srcElement.selectionStart;
      return index;
    };
    const refData = toRefs(data);
    return {
      ...refData,
      search,
      getTableData,
      // changeSearchShow,
      changeClick,
      showSearchBtn,
      reset,
      searchForm,
      openInput,
      dateBlur
    };
  },
};
</script>
<style scoped lang='scss'>
#SearchPanel {
  margin: 0;

  .size-width {
    width: 40%;
    margin-right: 10px;
  }

  .size-width1 {
    width: 100px;
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
    margin: 5px 0;
  }
}
</style>
