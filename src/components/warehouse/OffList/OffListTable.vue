<!-- 下架单列表 -->
<template>
  <div id="OffListTable">
    <div class="table-header">
      <el-button type="primary" size="small" @click="exportList">下载队列</el-button>
      <el-button type="primary" size="small" @click="exportInfo">导出</el-button>
    </div>

    <div class="table">
      <vxe-table :data="tableData" :column-config="{ resizable: true }" :expand-config="{ showIcon: false }"
        :row-config="{ isHover: true }" ref="xTable" v-loading="tableLoading" border style="width: 100%"
        :height="tableHeight"
        :header-row-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
        @checkbox-change="handleSelectionChange" @checkbox-all="selectAllChangeEvent">
        <vxe-column fixed="left" type="checkbox" align="center" width="55" />
        <vxe-column prop="deliveryWarehouse" title="仓库名称" width="70">
          <template #default="scope">
            <span>{{ scope.row.deliveryWarehouse || "-" }}</span>
          </template>
        </vxe-column>
        <vxe-column prop="name" title="拣货单号" width="110">
          <template #default="scope">
            <el-popover placement="right" trigger="click" :width="600">
              <template #reference>
                <span @click="pickingNoInfo(scope.row)" class="hover-title">{{scope.row.pickingOrderNo || '-'}}</span>
              </template>
              <template #default>
                <h2 style="border-bottom: 2px solid #eee; padding-bottom: 5px">{{scope.row.pickingOrderNo}}</h2>
                <vxe-table :data="pickingNoTableData" :column-config="{ resizable: true }"
                  :expand-config="{ showIcon: false }" :row-config="{ isHover: true }" border style="width: 100%"
                  height="300"
                  :header-row-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }">
                  <vxe-column type="checkbox" width="60"></vxe-column>
                  <vxe-column prop="name" title="拣货单号">
                    <template #default="scope">
                      <span>{{ scope.row.pickingOrderNo || "-" }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column prop="name" title="订单号">
                    <template #default="scope">
                      <span>{{ scope.row.orderId || "-" }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column prop="name" title="运单号">
                    <template #default="scope">
                      <span>{{ scope.row.logisticsCode || "-" }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column prop="city" title="运输方式">
                    <template #default="scope">
                      <span>{{ scope.row.logisticsName ? scope.row.logisticsName : "-" }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column prop="city" title="服务商">
                    <template #default="scope">
                      <span>{{ scope.row.providesCname ? scope.row.providesCname : "-" }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column prop="city" title="SKU">
                    <template #default="scope">
                      <span>{{ scope.row.sku ? scope.row.sku : "-" }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column prop="city" title="库位">
                    <template #default="scope">
                      <span>{{ scope.row.locationNum ? scope.row.locationNum : "-" }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column prop="city" title="配货数">
                    <template #default="scope">
                      <span>{{ scope.row.quantity }}</span>
                    </template>
                  </vxe-column>
                </vxe-table>
              </template>
            </el-popover>
            <!-- <span>{{ scope.row.pickingNo || "-" }}</span> -->
          </template>
        </vxe-column>
        <vxe-column prop="name" title="数量">
          <template #default="scope">
            <div>订单总数：{{ scope.row.orderNum}}</div>
            <div>产品总数：{{ scope.row.productNum }}</div>
            <div>库位总数：{{ scope.row.locationTotal }}</div>
          </template>
        </vxe-column>
        <vxe-column prop="name" title="配货情况">
          <template #default="scope">
            <div>未配货：{{ scope.row.undistribution }}</div>
            <div>已配货：{{ scope.row.distribution }}</div>
          </template>
        </vxe-column>
        <vxe-column prop="name" title="状态" width="100">
          <template #default="scope">
            <div>拣货：{{ scope.row.pickingStatus == 1 ? '未完成' : "已完成" }}</div>
            <div>标签：{{ scope.row.tagStatus == 1 ? '未完成' : "已完成" }}</div>
          </template>
        </vxe-column>
        <vxe-column prop="city" title="运输方式/服务商">
          <template #default="scope">
            <span>{{ scope.row.logisticsAndProvides ? scope.row.logisticsAndProvides : "-" }}</span>
          </template>
        </vxe-column>
        <vxe-column prop="province" title="拣货类型">
          <template #default="scope">
            <!-- <span>{{ tableTypeComputed(order_type, scope.row.pickType) }}</span> -->
            <span>{{ scope.row.pickType ? scope.row.pickType : "-" }}</span>
          </template>
        </vxe-column>

        <vxe-column prop="address" title="操作人" width="110">
          <template #default="scope">
            <div>下架员：{{ scope.row.dismounter ? scope.row.dismounter : "-" }}</div>
            <div>配货员：{{ scope.row.distributor ? scope.row.distributor : "-" }}</div>
          </template>
        </vxe-column>
        <vxe-column title="时间" width="170">
          <template #default="scope">
            <div>创建：{{ scope.row.createTime ? scope.row.createTime : "-" }}</div>
            <div>更新：{{ scope.row.updateTime ? scope.row.updateTime : "-" }}</div>
          </template>
        </vxe-column>
        <vxe-column title="操作" align="center" fixed="right" width="100">
          <template #default="scope">
            <div class="oper">
              <el-button size="small" type="primary" text @click="withSingle(scope.row)">配单</el-button>
              <el-button size="small" type="primary" text @click="logInfo(scope.row)">日志</el-button>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <LogDialog ref="logDialog"></LogDialog>
    <OffOrderDownPop ref="OffOrderDownPop"></OffOrderDownPop>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, watch, provide, nextTick, inject, computed, onUnmounted, onDeactivated } from "vue";
import { useTableHeight } from "@/compositionApi/useTableHeight.js";
import { documentCopy, localGet, localSet, download } from "@/utils/util";
import LogDialog from "@/components/logDialog/newLogDialog.vue"
import OffOrderDownPop from "./OffListDownPop.vue"
export default {
  name: "OffListTable",
  props: ["tableData", "tableLoading", "searchMsg"],
  components: { LogDialog, OffOrderDownPop },
  setup(prop, ctx) {
    const { tableHeight } = useTableHeight(320);
    const data = reactive({
      //编辑弹窗
      disLog: false, //添加弹窗显示隐藏
      selectList: [],
      isShow: true,
      ids: [],
      value: "",
      logId: "",
      logVisible: false,
      ruleVisible: false,
      isDisabled: false,
      wareHouseList: [],
      channelList: [],
      order_type: [],
      AutomaticAddForm: {},
      pickingNoTableData: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      // getTableData()
      data.order_type = localGet("orderDicList").order_type ? localGet("orderDicList").order_type : [];
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
    const selectAllChangeEvent = ({ $table }) => {
      data.ids = $table.getCheckboxRecords().map(i => {
        return i.pickingOrderNo;
      });
    };
    // 多选
    const handleSelectionChange = ({ $table }) => {
      data.ids = $table.getCheckboxRecords().map(i => {
        return i.pickingOrderNo;
      });
    };
    // 日志
    const logInfo = row => {
      let msg = {
        servers: "orderList",
        dataApi: "getOffLog",
        params: {
          actionModule: 1,
          pickNo: row.pickingOrderNo,
        }
      };
      nextTick(() => {
        vue.$refs.logDialog.checkLogDialog(msg);
      });
    };
    // 配单
    const withSingle = row => {
      const { href } = vue.$router.resolve({
        path: "/warehouseManagement/straightOutbound/distributionOrder",
        query: {
          pickingOrderNo: row.pickingOrderNo,
        },
      });
      window.open(href, "_blank");
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
    // 导出
    const exportInfo = () => {
      let info = {
        codes: data.ids,
      };
      data.ids.length ? info.downloadType = false : info.downloadType = true
      info.query = prop.searchMsg
      // Object.assign(info, data.searchMsg);
      api.orderList.exportoffListDate(info).then(res => {
        if (res.code == 200) {
          vue.$message({
            type: "success",
            message: res.msg,
          });
        } else {
          vue.$message.warning(res.msg);
        }
      });
    };
    // 下载队列
    const exportList = () => {
      vue.$refs.OffOrderDownPop.getMsg();
    };
    // 拣货单详情
    const pickingNoInfo = row => {
      api.orderList.getPickingInfoByNo({ pickNo: row.pickingOrderNo }).then(res => {
        if (res.code == 200) {
          data.pickingNoTableData = res.data
        } else {
          vue.$message.warning(res.msg);
        }
      });
    };
    return {
      ...refData,
      handleSelectionChange,
      selectAllChangeEvent,
      tableHeight,
      tableTypeComputed,
      logInfo,
      withSingle,
      pickingNoInfo,
      exportInfo,
      exportList
    };
  },
};
</script>
<style scoped lang="scss">
// ::v-deep .el-card__header {
//   height: 30px;
//   line-height: 30px;
//   padding: 0px;
// }
// ::v-deep .el-dialog__body {
//   padding: 20px;
// }
// ::v-deep .vxe-table {
//   height: calc(100vh - 310px) !important;
// }
#OffListTable {
  .table {
    box-sizing: border-box;
    // :deep(.cell) {
    //   text-align: center;
    // }
  }

  .table-header {
    display: -webkit-flex;
    justify-content: right;

    div {
      color: rgb(2 167 240);
      //   height: 40px;
      margin-top: 10px;
      font-size: 14px;
    }
  }

  .hover-title {
    color: rgb(186 100 110);
    cursor: pointer;
  }

  .hover-title:hover {
    border-bottom: 1px solid rgb(186 100 110);
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

    .box-main {}
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
