<!-- 签收表格 -->
<template>
  <div id="SignForTable">
    <div class="containerNumber">
      <span class="title">签收箱数：</span>
      <el-input class="textarea" @input="signNumber" clearable v-model="casesNum" clear placeholder="请输入">
      </el-input>
      <el-button size="small" type="primary" @click="submitClick" v-if="buttonAuthor.submit">确 认</el-button>
    </div>

    <el-tabs v-model="activeName" type="border-card" v-show="tableData.length">
      <el-tab-pane v-for="(item, index) in tableData" :key="index" :label="item.logistics" :name="item.logistics">
        <el-table :data="item.vo" border height="calc(100vh - 380px)" style="width: 100%" :header-cell-style="{
          background: '#fafafa',
          color: '#2d2f30',
          fontWeight: 'bold',
          fontSize: '12px',
        }" :row-key="(row) => row.warehouseProductVos[0].id" :expand-row-keys="expands">
          <el-table-column type="expand">
            <template #default="scope">
              <el-table :data="scope.row.warehouseProductVos" :ref="`warehouseProductList${scope.row.id}`"
                class="table-expand" border style="width: 100%">
                <el-table-column label="SKU" prop="sku"></el-table-column>
                <el-table-column label="图片">
                  <template #default="{ row }">
                    <span v-show="row.pricturePath">
                      <el-popover placement="right" trigger="hover" width="250">
                        <template #reference>
                          <el-image style="width: 180px; height: 95px" fit="contain" :src="row.pricturePath"></el-image>
                        </template>
                        <el-image :src="row.pricturePath" style="width: 400px; height: 300px" fit="contain"></el-image>
                      </el-popover>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="产品信息" prop="productCname"></el-table-column>
                <el-table-column label="采购数量" prop="purNumber"></el-table-column>
                <el-table-column label="可收货数量">
                  <template #header>
                    <div style="display: flex; align-items:center">
                      <span>可收货数量</span>
                      <el-tooltip class="item" effect="light" content="对应物流号可收货的SKU数量">
                        <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
                      </el-tooltip>
                    </div>
                  </template>
                  <template #default="{ row }">
                    {{ row.number }}
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
          <el-table-column label="PO单" prop="orderCode" min-width="110">
            <template #default="scope">
              <span>{{ scope.row.orderCode ? scope.row.orderCode : "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="供应商" prop="supplierName" min-width="140">
            <template #default="scope">
              <span>{{
                  scope.row.supplierName ? scope.row.supplierName : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="质检" prop="isCheck">
            <template #default="scope">
              <span>{{ scope.row.isCheck == true ? "是" : "否" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="中转仓库" prop="warehouseName">
            <template #default="scope">
              <span>{{
                  scope.row.warehouseName ? scope.row.warehouseName : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="仓区" prop="purposeWarehouse" width="150">
            <template #default="scope">
              <div v-show="scope.row.purposeWarehouse.length">
                <span>{{ scope.row.purposeWarehouse[0] }}</span>
                <el-popover placement="right" trigger="hover" v-if="scope.row.purposeWarehouse.length > 1">
                  <template #reference>
                    <i style="padding-left: 5px; cursor: pointer">...</i>
                  </template>
                  <div>
                    {{ scope.row.productWarehouseNamesCope }}
                  </div>
                </el-popover>
              </div>
              <div v-show="!scope.row.purposeWarehouse.length">-</div>
            </template>
          </el-table-column>
          <el-table-column label="采购员" prop="buyer">
            <template #default="scope">
              <span>{{ scope.row.buyer ? scope.row.buyer : "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status">
            <template #default="scope">
              <div v-show="scope.row.status">
                {{ tableTypeComputed(receipt_status, scope.row.status) }}
              </div>
              <div v-show="!scope.row.status">-</div>
            </template>
          </el-table-column>
          <el-table-column label="对仓备注" prop="warehouseRemarks" min-width="130">
            <template #default="scope">
              <span>{{
                  scope.row.warehouseRemarks ? scope.row.warehouseRemarks : "-"
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>


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
  watch,
} from "vue";
import { localGet } from "@/utils/util";
import authorButtons from "@/compositionApi/authorButtons";

export default {
  name: "SignForTable",
  props: ["transferWarehouseId"],
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      pos: 0, // 合并图形行相关
      tableData: [],
      receipt_status: [],
      casesNum: "",
      logisticsNum: "",
      expands: [],
      orderCodeType: "",
      activeName: ''
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      data.receipt_status = localGet("purchaseDict").receipt_status
        ? localGet("purchaseDict").receipt_status
        : [];
    });
    watch(
      () => data.tableData,
      (count, prevCount) => {
        if (count.length) {
          data.expands = []
          data.expands.push(count[0].vo[0].warehouseProductVos[0].id);
        }
      }
    );

    const refData = toRefs(data);
    const warehouseProductList = ref(null);
    // 调整table
    const setTable = (tableall, logisticsNum, orderCodeType, activeName) => {
      data.tableData = tableall;
      data.logisticsNum = logisticsNum;
      data.pos = data.tableData.length;
      data.orderCodeType = orderCodeType;
      data.activeName = activeName
      // data.casesNum = casesNum > 0 ? casesNum : "";
    };

    // 确认
    const submitClick = () => {
      if (data.casesNum > 0) {
        let num = 0;
        data.tableData.map((i) => {
          i.vo.map(k => {
            k.warehouseProductVos.map(f => {
              num += f.number * 1
            })
          })
        });
        if (data.casesNum <= num) {
          let msg = {};
          if (data.orderCodeType == "sku") {
            msg.casesNum = data.casesNum;
            msg.sku = data.logisticsNum;
            msg.transferWarehouseId = prop.transferWarehouseId
              ? prop.transferWarehouseId
              : null;
          } else {
            msg.casesNum = data.casesNum;
            msg.logisticsNum = data.activeName;
            msg.transferWarehouseId = prop.transferWarehouseId
              ? prop.transferWarehouseId
              : null;
          }
          api.warehouse.warehouseReceiptConfirm(msg).then((res) => {
            if (res.code == 200) {
              vue.$message({ type: "success", message: res.msg });
            } else {
              vue.$message({
                type: "warning",
                message: res.msg,
              });
            }
          });
        } else {
          vue.$message.warning("签收数量不能大于总采购数量");
        }
      } else {
        vue.$message({
          type: "warning",
          message: "请输入签收箱数",
        });
      }
    };

    const signNumber = (e) => {
      let r = new RegExp(/[^\d]/g, "");
      if (!r.test(e)) {
        data.casesNum = e;
      } else {
        data.casesNum = "";
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
    //基础数据切换 清空箱数
    const changeBoxNum = () => {
      data.casesNum = "";
    };
    return {
      ...refData,
      setTable,
      submitClick,
      tableTypeComputed,
      warehouseProductList,
      signNumber,
      changeBoxNum,
      buttonAuthor,
    };
  },
};
</script>
<style scoped lang="scss">
.containerNumber {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 30px;
  margin: 15px 0;

  .title {
    width: 100px;
  }

  .el-input {
    width: 300px;
    margin-right: 20px;
  }
}

.purposeWarehouse {
  display: flex;
  flex-direction: column;

  >span {
    padding: 5px;
  }
}
</style>
