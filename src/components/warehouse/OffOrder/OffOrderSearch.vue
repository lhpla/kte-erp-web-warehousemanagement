<!-- 订单下架 搜索 -->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" ref="formInlineRef" label-width="125px" :model="searchForm"
      class="demo-form-inline el-from">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item class="SearchPanel-form-item" label="订单平台：">
          <el-select v-model="searchForm.platformId"  @change="platChange" filterable clearable
            placeholder="请选择">
            <el-option v-for="item in platformOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="searchForm.shopId" :loading="shopIdLoading"  @change="search" multiple collapse-tags
            collapse-tags-tooltip class="margin-left" filterable clearable placeholder="店铺账户">
            <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="SearchPanel-form-item" label="单号：">
          <el-select v-model="searchForm.orderIdList"  filterable clearable placeholder="请选择">
            <el-option v-for="item in orderInfoOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-input @dblclick="openInput(searchForm.orderInfo, 'orderInfo')" @keyup.enter="search" v-model="searchForm.orderInfo"
            class="widthText-input" style="margin-left: 5px" clearable  placeholder="双击批量查询,可模糊搜索">
          </el-input>
        </el-form-item>
        <el-form-item class="SearchPanel-form-item" label="仓库名称：">
          <el-select v-model="searchForm.deliveryWarehouseId" filterable @change="search" clearable placeholder="请选择">
            <el-option v-for="item in wareHouseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="SearchPanel-form-item" label="操作模式：">
          <el-select v-model="searchForm.operatingMode" @change="search"  filterable clearable placeholder="请选择">
            <el-option label="按单分拣" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="SearchPanel-form-item" label="拣货类型：">
          <el-select v-model="searchForm.orderType" @change="search"  filterable clearable placeholder="请选择">
            <el-option v-for="item in order_type" :key="item.dicKey" :label="item.value" :value="item.dicKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="SearchPanel-form-item" label="订单重量(KG)：">
          <el-input v-model="searchForm.orderWeightStart" @input="
            inputTradeProportion(
              $event,
              'orderWeightStart',
              /\d+(\.\d{0,2})?/
            )
          " style="width: 85px; margin-right: 5px" @keyup.enter="search" clearable  placeholder="请输入"></el-input>
          <span>到</span>
          <el-input v-model="searchForm.orderWeightEnd" @input="
            inputTradeProportion($event, 'orderWeightEnd', /\d+(\.\d{0,2})?/)
          " style="width: 85px; margin-left: 5px" clearable  @keyup.enter="search" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item class="SearchPanel-form-item" label="服务商：">
          <el-select v-model="searchForm.providesId"  filterable clearable placeholder="请选择"
            @change="changeProvides">
            <el-option v-for="item in provdierList" :key="item.id" :label="item.providersCname" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="SearchPanel-form-item" label="运输方式：">
          <el-select v-model="searchForm.logisticsId"  @change="search" filterable clearable placeholder="请选择">
            <el-option :label="item.chineseName" :value="item.id" v-for="item in ChannelList" :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="SearchPanel-form-item" label="已预报天数：">
          <el-input v-model="searchForm.forecastTimeStart" @input="
            inputTradeProportion(
              $event,
              'forecastTimeStart',
              /\d+(\.\d{0,1})?/
            )
          " style="width: 85px; margin-right: 5px" @keyup.enter="search" clearable  placeholder="请输入"></el-input>
          <span>到</span>
          <el-input v-model="searchForm.forecastTimeEnd" @input="
            inputTradeProportion($event, 'forecastTimeEnd', /\d+(\.\d{0,1})?/)
          " style="width: 85px; margin-left: 5px" clearable  @keyup.enter="search" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item class="SearchPanel-form-item" label="备注：">
          <el-input v-model="searchForm.remark" @keyup.enter="search" clearable  style="width: 100%" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item class="SearchPanel-form-item" label="产品SKU：">
          <el-input @dblclick="openInput(searchForm.sku, 'sku')" v-model="searchForm.sku" @keyup.enter="search" style="width: 100%" clearable
             placeholder="可输入多个，以分号隔开"></el-input>
        </el-form-item>
        <el-form-item class="SearchPanel-form-item" label="SKU总数：">
          <el-input v-model="searchForm.skuTotalStart" style="width: 85px; margin-right: 5px"
            @input="inputTradeProportion($event, 'skuTotalStart', /\d+()?/)" clearable  @keyup.enter="search" placeholder="请输入">
          </el-input>
          <span>到</span>
          <el-input v-model="searchForm.skuTotalEnd" style="width: 85px; margin-left: 5px"
            @input="inputTradeProportion($event, 'skuTotalEnd', /\d+()?/)" clearable  @keyup.enter="search" placeholder="请输入">
          </el-input>
        </el-form-item>
        <el-form-item label="开发状态:" prop="sellStatus" class="SearchPanel-form-item">
          <el-select v-model="searchForm.sellStatus" filterable clearable @change="search" placeholder="请选择">
            <el-option v-for="item in pro_dev_status" :key="item.devStatus" :label="item.devStatusName"
              :value="item.devStatus"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="SearchPanel-form-item" label="目的国家或地区：">
          <el-select v-model="searchForm.countryAbbreviations" @change="search" clearable filterable placeholder="请选择">
            <el-option v-for="item in CountriesList" :key="item.id" :label="`${item.secondWord}[${item.cnName}]`"
              :value="item.secondWord"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品品类:" prop="productClassificationId" class="SearchPanel-form-item">
          <el-cascader filterable clearable :options="cascaderOptions" @change="categoryChange"
            v-model="searchForm.productClassificationId" :props="cascaderRule"></el-cascader>
        </el-form-item>
        <el-form-item class="SearchPanel-form-item" label="时间：">
          <el-select style="margin-right: 5px" v-model="searchForm.timeType" clearable filterable placeholder="请选择">
            <el-option v-for="item in timeType" :key="item.value" :label="item.lable" :value="item.value"></el-option>
          </el-select>
          <el-date-picker v-model="timeInfo" @change="changeTime" type="datetimerange" range-separator="到"
            start-placeholder="开始时间" end-placeholder="结束时间" />
        </el-form-item>
      </div>
      <br v-if="!searchShow" />
      <div class="footer-button">
        <el-form-item>
          <el-button type="text"  class="open" @click="searchShow = !searchShow" v-if="showSearchBtn">
            {{ searchShow ? "合并" : "展开" }}
            <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </el-button>
          <el-button type="primary" size="small" @click="search">
            搜 索</el-button>
          <el-button type="primary" size="small" @click="reset">
            重 置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, nextTick, watch } from "vue";
import { localGet, parseTime } from "@/utils/util";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";
export default {
  name: "OffOrderSearch",
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const data = reactive({
      showMessage:false,
      searchForm: {
        scroll: 0,
        orderIdList: "orderId",
        shopId: [],
      },
      searchShow: false,
      platformOptions: [],
      // 产品分类匹配规则
      cascaderRule: {
        label: "name",
        value: "id",
        expandTrigger: "hover",
        checkStrictly: true,
      },
      timeInfo: [],
      shopList: [], //店铺列表
      wareHouseList: [], //发货仓库
      provdierList: [], //服务商列表
      CountriesList: [], //国家
      ChannelList: [], //运输方式
      pro_dev_status: [],
      order_type: [], //订单类型
      cascaderOptions: [],
      shopIdLoading: false, //
      orderInfoOptions: [
        //订单信息
        {
          label: "订单号",
          value: "orderId",
        },
        {
          label: "运单号",
          value: "logisticsCode",
        },
      ],
      timeType: [
        {
          lable: "创建时间",
          value: "1",
        },
        {
          lable: "付款时间",
          value: "2",
        },
      ],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      getList();
    });
    const getList = () => {
      //平台
      data.order_type = localGet("orderDicList").order_type ? localGet("orderDicList").order_type : [];
      data.platformOptions = localGet("platformLiist");
      // 中转仓
      api.orderList.getDeliveryWarehouse().then((res) => {
        if (res.code == 200) {
          data.wareHouseList = res.data;
        } else {
          vue.$message.warning(res.msg);
          data.wareHouseList = [];
        }
      });
      //服务商列表
      api.assest.getServiceProvider().then((res) => {
        if (res.code == 200) {
          data.provdierList = res.data;
        }
      });
      // 目的国家
      api.system.getCountriesList().then((res) => {
        if (res.code == 200) {
          data.CountriesList = res.data;
        }
      });
      // 开发状态

      api.product.getProDevStatus().then((res) => {
        if (res.code == 200) {
          data.pro_dev_status = res.data;
          console.log("res.data", res.data);
        }
      });
      // 运输方式
      api.logistics.getAllLogisticsManageAndId().then((res) => {
        if (res.code == 200) {
          data.ChannelList = res.data;
        } else {
          vue.$message.warning(res.msg);
        }
      });
      // 产品分类列表
      api.system.getAllCategoryList({ isDisable: 0 }).then((res) => {
        data.cascaderOptions = res.data;
      });
    };
    const changeProvides = (id) => {
      data.searchForm.logisticsId = "";
      api.logistics.getAllByProvider({ providerId: id }).then((res) => {
        if (res.code == 200) {
          data.ChannelList = res.data;
        }
      });
      search()
    };

    const refData = toRefs(data);
    const getTableData = inject("getTableData");
    // 搜索
    const search = () => {
      let msg = JSON.stringify(data.searchForm);
      msg = JSON.parse(msg);
      if (data.searchForm.orderIdList && data.searchForm.orderInfo) {
        delete msg.orderIdList;
        msg[data.searchForm.orderIdList] =
          data.searchForm.orderInfo.indexOf("；") != -1 ? data.searchForm.orderInfo.replace(/；/gi, ";") : data.searchForm.orderInfo;
        delete msg.orderInfo;
      } else {
        delete msg.orderIdList;
        delete msg.orderInfo;
      }
      getTableData(msg);
    };
    const inputTradeProportion = (e, prop, rest) => {
      data.searchForm[prop] = e.match(rest) ? e.match(rest)[0] : "";
    };
    // 分类切换
    const categoryChange = (e) => {
      data.searchForm.productClassificationId = e ? e[e.length - 1] : "";
      search()
    };
    //重置
    const reset = () => {
      data.searchForm = {};
      data.timeInfo = [];
      getTableData({});
      // 运输方式
      api.logistics.getAllLogisticsManageAndId().then((res) => {
        if (res.code == 200) {
          data.ChannelList = res.data;
        } else {
          vue.$message.warning(res.msg);
        }
      });
    };

    //根据平台搜索店铺
    const platChange = (e) => {
      if (e) {
        data.searchForm.shopId = [];
        data.shopIdLoading = true;
        api.systemNew
          .getShopList({ platformId: e })
          .then((res) => {
            if (res.code == 200) {
              data.shopList = res.data;
            } else {
              data.shopList = [];
            }
            data.shopIdLoading = false;
          })
          .catch((e) => {
            data.shopIdLoading = false;
            data.shopList = [];
          });
      } else {
        data.shopList = [];
      }
    };
    //选择时间
    const changeTime = (time) => {
      if (time) {
        // 创建时间
        data.searchForm.startTime = parseTime(time[0]);
        data.searchForm.endTime = parseTime(time[1]);
        //   付款时间
      } else {
        data.timeInfo = [];
        data.searchForm.startTime = "";
        data.searchForm.endTime = "";
      }
      search()
    };

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
    };

    //订单批量搜索
    const openInput = (info, name) => {
      data.showMessage = true;
      vue
        .$prompt("可输入多个，以英文分号、逗号、空格或者回车隔开", "批量查询", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValue: info,
          inputType: "textarea",
        })
        .then(({ value }) => {
          data.searchForm[name] = temp.value
            .replaceAll("\n", ";")
            .replaceAll(" ", ";")
            .replaceAll(",", ";")
            .replaceAll('，', ";")
            .replace(/；/g, ";");
          data.searchForm[name] = data.searchForm[name]
            .split(";")
            .filter((item) => item !== "")
            .join(';');
          data.showMessage = false;
          temp.value = "";
        })
        .catch(() => { 
          temp.value = "";
          data.showMessage = false;
        });
    };
      const temp = ref("");
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
            textarea.addEventListener('input',()=>{
              temp.value = textarea.value;
            })
          });
        }
      }
    );
    const handleInputREnter = (e) => {
      const index = e.srcElement.selectionStart;
      return index;
    };
    return {
      ...refData,
      getTableData,
      search,
      reset,
      changeClick,
      platChange,
      openInput,
      changeProvides,
      showSearchBtn,
      changeTime,
      inputTradeProportion,
      categoryChange,
    };
  },
};
</script>
<style scoped lang="scss">
#SearchPanel {
  .widthText {
    .el-form-item {
      width: 100%;
      display: flex;
    }

    :deep(.el-form-item__content) {
      width: 90% !important;
    }

    .widthText-input {
      width: 200px;
      margin-left: 5px;
    }
  }

  .el-input {
    width: 47%;
    // margin-left: 5px;
  }

  .margin-left {
    margin-left: 5px;
  }

  .search-title {
    display: -webkit-flex;
  }

  .form-content {
    height: 40px;
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
</style>
<style lang="scss" scoped></style>
