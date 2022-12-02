<!-- 签收 -->
<template>
  <div id="SignFor">
    <div>
      <div class="logisticsNum">
        <span class="title">单号：</span>
        <div class="flex">
          <el-select v-model="searchForm.orderCodeType" filterable placeholder="请选择" class="size-width"
            @change="changeCode('orderCodeType')">
            <el-option v-for="item in orderCodeTypeList" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
          <el-input v-model.trim="searchForm.logisticsNum" style="width: 190px" clearable @change="changeCode"
            @keyup.enter="sendkeybtn"></el-input>
          <span class="title1" v-show="searchForm.orderCodeType == 'sku'">中转仓库：</span>
          <el-select v-model="searchForm.transferWarehouseId" v-show="searchForm.orderCodeType == 'sku'"
            style="margin-right: 20px" filterable clearable placeholder="请选择" @change="sendkeybtn">
            <el-option :label="item.name" :value="item.id" v-for="item in warehouseList" :key="item.id"></el-option>
          </el-select>
        </div>
        <el-button size="small" type="primary" @click="sendkeybtn">
          搜 索
        </el-button>
      </div>
    </div>
    <SignForTable ref="SignForTable" :transferWarehouseId="searchForm.transferWarehouseId"></SignForTable>
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
  computed,
  nextTick,
} from "vue";
import SignForTable from "@/components/warehouse/signFor/SignForTable.vue";
import { localGet } from "@/utils/util";
import authorButtons from "@/compositionApi/authorButtons";
export default {
  name: "signFor",
  components: {
    SignForTable,
  },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      warehouseList: [],
      searchForm: {
        // logisticsNum: "651654654",
        logisticsNum: "",
        orderCodeType: "logisticsNum",
        transferWarehouseId: "",
      },
      purchaseDict: [], // 字典数组
      receipt_status: [],
      tableData: [],
      orderCodeTypeList: [
        {
          value: "物流单号",
          key: "logisticsNum",
        },
        {
          value: "SKU",
          key: "sku",
        },
      ],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      // 中转仓
      api.system.getWareHouseList({ type: 1 }).then((res) => {
        if (res.code == 200) {
          data.warehouseList = res.data;
        }
      });
      data.purchaseDict = localGet("purchaseDict")
        ? localGet("purchaseDict")
        : [];
      data.receipt_status = data.purchaseDict.receipt_status
        ? data.purchaseDict.receipt_status
        : [];
    });
    const search = (info) => {
      if (info) {
        api.warehouse.warehouseReceiptSearch(info).then((res) => {
          if (res.code == 200) {
            data.tableData = res.data;
            data.tableData.map(item => {
              item.vo.map(ite => {
                const productWarehouseNamesCope = [];
                ite.purposeWarehouse.map((i) => {
                  productWarehouseNamesCope.push(i);
                });
                ite.productWarehouseNamesCope =
                  productWarehouseNamesCope.join(",");
                ite.purposeWarehouse = productWarehouseNamesCope;
              })
            })
            let activeName = data.tableData.length ? data.tableData[0].logistics : ''
            vue.$refs.SignForTable.setTable(
              data.tableData,
              data.searchForm.logisticsNum,
              data.searchForm.orderCodeType,
              activeName
            );
          } else {
            data.tableData = [];
            vue.$refs.SignForTable.setTable([], "", '', '');
            vue.$message.warning({
              message: res.msg,
              type: "warning",
            });
          }
        });
      }
    };
    // 搜索
    const sendkeybtn = () => {
      const info = {};
      if (!data.searchForm.logisticsNum) {
        vue.$message.warning(
          `请输入${data.searchForm.orderCodeType === "sku" ? "sku" : "物流单号"
          }`
        );
        return false;
      }
      if (!data.searchForm.orderCodeType) {
        vue.$message.warning("请选择单号类别");
        return false;
      } else if (data.searchForm.orderCodeType === "sku") {
        if (!data.searchForm.transferWarehouseId) {
          vue.$message.warning("请选择中转仓库");
          return false;
        }
        info.sku = data.searchForm.logisticsNum;
        info.transferWarehouseId = data.searchForm.transferWarehouseId;
        info.logisticsNum = null;
      } else if (data.searchForm.orderCodeType === "logisticsNum") {
        info.logisticsNum = data.searchForm.logisticsNum;
        info.sku = null;
      }
      search(info);
    };

    //数据切换 清空下方表格
    const changeCode = (vo) => {
      vue.$refs.SignForTable.setTable([], "");
      vue.$refs.SignForTable.changeBoxNum();
      if (vo == "orderCodeType") {
        data.searchForm.transferWarehouseId = "";
      }
    };
    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (list, dizKey) {
        if (list.length > 1 && dizKey !== -1) {
          for (let item of list) {
            if (dizKey == item.dizKey) {
              return item.value;
            }
          }
        }
      };
    });
    const refData = toRefs(data);
    return {
      ...refData,
      search,
      tableTypeComputed,
      sendkeybtn,
      buttonAuthor,
      changeCode,
    };
  },
};
</script>
<style scoped lang="scss">
#SignFor {
  .logisticsNum {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 30px;
    margin: 15px 0;

    .title {
      width: 100px;
    }

    .title1 {
      width: 80px;
      text-align: right;
      line-height: 29px;
      padding-right: 5px;
    }

    .size-width {
      width: 100px;
      margin-right: 10px;
    }

    .el-input {
      width: 300px;
      margin-right: 20px;
    }
  }

  .formItem {
    margin: 20px 0 10px 0;
    border-bottom: 1px solid #eee;
  }
}
</style>
