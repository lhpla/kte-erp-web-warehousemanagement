<!-- 出货列表 -->
<template>
  <div id="ShipmentListTable">
    <div class="table">
      <vxe-table
        :data="tableData"
        :column-config="{resizable: true}"
        :expand-config="{showIcon: false}"
        :row-config="{isHover: true}"
        ref="xTable"
        v-loading="tableLoading"
        border
        style="width: 100%"
        :height="tableHeight"
        :header-row-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
        @checkbox-change="handleSelectionChange"
        @checkbox-all="selectAllChangeEvent"
      >
        <!-- <vxe-column fixed="left" type="checkbox" align="center" width="55" /> -->
        <vxe-column prop="date" title="订单号/运单号" width="180">
          <template #default="scope">
            <div><span>订单号: </span><span>
              
              {{ scope.row.orderId ? scope.row.orderId : "-" }}</span></div>
            <div>
              <span>物流单号: </span>
              <span>{{ scope.row.logisticsCode ? scope.row.logisticsCode : "-" }}</span>
            </div>
            
          </template>
        </vxe-column>
        <vxe-column prop="name" title="仓库名称" width="70">
          <template #default="scope">
            <span>{{ scope.row.deliveryWarehouse || "-" }}</span>
          </template>
        </vxe-column>
        <vxe-column prop="name" title="销售信息">
          <template #default="scope">
            <div>销售平台：{{ scope.row.platformName ? scope.row.platformName : "-" }}</div>
            <div>订单属性：{{ tableTypeComputed(order_attribute, scope.row.orderAttribute) }}</div>
          </template>
        </vxe-column>
        <vxe-column prop="city" title="运输方式/服务商" width="110">
          <template #default="scope">
            <span>{{ scope.row.logisticsName ? scope.row.logisticsName : "-" }}</span>
            /
            <span>{{ scope.row.providesCname ? scope.row.providesCname : "-" }}</span>
          </template>
        </vxe-column>
        <vxe-column prop="province" title="拣货类型">
          <template #default="scope">
            <span>{{ tableTypeComputed(order_type, scope.row.pickType) }}</span>
          </template>
        </vxe-column>
        
        <vxe-column prop="address" title="内件数" width="60">
          <template #default="scope">
            <span>{{ scope.row.numberPieces ? scope.row.numberPieces : "-" }}</span>
          </template>
        </vxe-column>
        <vxe-column prop="zip" title="国家或地区/收件人" width="130">
          <template #default="scope">
            <div>国家或地区: {{scope.row.country}}</div>
            <div>收件人: {{scope.row.custName}}</div>
          </template>
        </vxe-column>
        <vxe-column title="订单状态(仓库)">
          <template #default="scope">
            <span>{{ tableTypeComputed(order_warehouse_status, scope.row.orderWarehouseStatus) }}</span>
            <div style="color: red;" v-if="scope.row.orderStatus != '4' && scope.row.orderWarehouseStatus !='4'">拦截申请</div>
          </template>
        </vxe-column>
        <vxe-column title="日期" width="240">
          <template #default="scope">
            <div>创建：{{ scope.row.createDate ? scope.row.createDate : "-" }} {{scope.row.createPeople?`[${scope.row.createPeople}]`:''}}</div>
            <div>打印：{{ scope.row.printDate ? scope.row.printDate : "-" }} {{scope.row.printPeople?`[${scope.row.printPeople}]`:''}}</div>
            <div>打包：{{ scope.row.packingDate ? scope.row.packingDate : "-" }} {{scope.row.packer?`[${scope.row.packer}]`:''}}</div>
            <div>出库：{{ scope.row.expTime ? scope.row.expTime : "-" }} {{scope.row.expUserName?`[${scope.row.expUserName}]`:''}}</div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance,watch, provide, nextTick, inject, computed,onUnmounted,onDeactivated } from "vue";
import {useTableHeight} from "@/compositionApi/useTableHeight.js"
import { documentCopy, localGet, localSet } from "@/utils/util";
export default {
  name: "ShipmentListTable",
  props: ["tableData", "tableLoading"],
  components: {},
  setup(prop, ctx) {
    const {tableHeight} = useTableHeight(254)
    const data = reactive({
      selectList: [],
      isShow: true,
      ids: [],
      value: '',
      logId: "",
      logVisible: false,
      ruleVisible: false,
      isDisabled: false,
      wareHouseList: [],
      order_warehouse_status: [],
      channelList: [],
      order_type: [],
      order_attribute: [],
      // 日志分页
      pageableLog: {
        current: 1,
        size: 10,
        total: 0,
      },
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      data.order_type = localGet("orderDicList").order_type ? localGet("orderDicList").order_type : [];
      data.order_attribute = localGet("orderDicList").order_attribute ? localGet("orderDicList").order_attribute : [];
      data.order_warehouse_status = localGet("orderDicList").order_warehouse_status ? localGet("orderDicList").order_warehouse_status : [];
      api.system.getWareHouseList().then(res => {
        if (res.code == 200) {
          data.wareHouseList = res.data;
        } else {
          vue.$message({
            type: "warning",
            message: res.msg,
          });
        }
      });
    });
    const refData = toRefs(data);
    const getTableData = inject("getTableData");
    // 全选
    const selectAllChangeEvent = ({$table}) => {
      data.ids = $table.getCheckboxRecords().map(i => {
        return i.id;
      });
      if (data.ids.length) {
      }
    }
    // 多选
    const handleSelectionChange = ({$table}) => {
      data.ids = $table.getCheckboxRecords().map(i => {
        return i.id;
      });
      if (data.ids.length) {
      }
    };
    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (list, dicKey) {
        if (list.length > 1 && dicKey !== -1) {
          for (let item of list) {
            if (dicKey == item.dicKey) {
              return item.value;
            }
          }
        }
      };
    });
    return {
      ...refData,
      handleSelectionChange,
      selectAllChangeEvent,
      tableHeight,
      tableTypeComputed
    };
  },
};
</script>
<style scoped lang="scss">
::v-deep .el-card__header {
  height: 30px;
  line-height: 30px;
  padding: 0px;
}
::v-deep .el-dialog__body {
  padding: 20px;
}
// ::v-deep .vxe-table {
//   height: calc(100vh - 310px) !important;
// }
#ShipmentListTable {
  .table {
    box-sizing: border-box;
    :deep(.cell) {
      text-align: center;
    }
  }
  .table-header {
      display: -webkit-flex;
      justify-content: space-between;
      div {
          color: rgb(2 167 240);
        //   height: 40px;
        margin-top: 10px;
        font-size: 14px;
      }
  }
  .card {
    height: 400px;
    overflow-y: auto;
  }
  .title_total {
    // float: right;
    text-align: right;
    margin-bottom: 10px;
  }
  .box-card {
    margin-bottom: 10px;
    font-size: 12px;
    .card-header {
      display: -webkit-flex;
      justify-content: space-around;
      // background: #f5f5f5;
      background: #c0e8f2;
      font-size: 12px;
      font-weight: bold;
      span {
        margin-left: 18px;
      }
    }
    .box-main {
    }
  }
   .log-pagination {
  display: flex;
  justify-content: flex-end;
  position: static;
  bottom: 0;
  right: 0;
  background: #fff;
  border: none;
  border-radius: 50px;
  margin: -50px 0 10px 0;
}
}
</style>
