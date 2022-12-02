<!-- OffOrderTable -->
<template>
  <div id="OffOrderTable">
    <div class="table-box">
      <div class="table-header">
        <div>订单总数: {{ total || 0 }}</div>
        <el-button size="small" type="primary" @click="batchShelves">下架</el-button>
      </div>
    </div>
    <div class="table">
      <vxe-table
        :data="tableData"
        :column-config="{ resizable: true }"
        :expand-config="{ showIcon: false }"
        :row-config="{ isHover: true }"
        ref="xTable"
        v-loading="tableLoading"
        border
        style="width: 100%"
        :height="tableHeight"
        :header-row-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
        @checkbox-change="handleSelectionChange"
        @checkbox-all="selectAllChangeEvent"
      >
        <vxe-column fixed="left" type="checkbox" align="center" width="55" />
        <vxe-column prop="date" title="订单号/运单号" width="180">
          <template #default="scope">
            <div><span>订单号: </span><span class="nameHover" @click.stop="handelEditOpen(scope.row)">
              
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
        <vxe-column prop="province" title="拣货类型" width="70">
          <template #default="scope">
            <span>{{ tableTypeComputed(order_type, scope.row.orderType) }}</span>
          </template>
        </vxe-column>
        <vxe-column prop="city" title="运输方式/服务商" width="110">
          <template #default="scope">
            <span>{{ scope.row.logisticsName ? scope.row.logisticsName : "-" }}</span>
            /
            <span>{{ scope.row.providesCname ? scope.row.providesCname : "-" }}</span>
          </template>
        </vxe-column>
        <vxe-column prop="address" title="目的国家或地区缩写中文/店铺名称" width="150">
          <template #default="scope">
            <span>{{ scope.row.custCountryCn ? scope.row.custCountryCn : "-" }}</span>
            /
            <span>{{ scope.row.custCountryAbbr ? scope.row.custCountryAbbr : "-" }}</span>
            /
            <span>{{ scope.row.shopName ? scope.row.shopName : "-" }}</span>
          </template>
        </vxe-column>
        <vxe-column title="SKU/数量" width="130">
          <template #default="scope">
            <ul v-for="(item, index) in ComputedSku(scope.row.skuInfos)" :key="index">
              <li>{{ item }}</li>
            </ul>
          </template>
        </vxe-column>
        <vxe-column title="已预报天数" width="80">
          <template #default="scope">
            <span>{{ scope.row.forecastTime ? scope.row.forecastTime : "-" }}</span>
          </template>
        </vxe-column>
        <vxe-column title="时间" width="170">
          <template #default="scope">
            <div>付款：{{ scope.row.paymentTime ? scope.row.paymentTime : "-" }}</div>
            <div>创建：{{ scope.row.createTime ? scope.row.createTime : "-" }}</div>
          </template>
        </vxe-column>
        <vxe-column title="备注">
          <template #default="scope">
            <div class="remark-box" v-if="scope.row.remarks">
              <span class="text-title">系统备注: </span> 
              <el-tooltip placement="top-start" popper-class="diy-popper">
                <template #content>
                  {{ scope.row.remarks }}
                </template>
                <span>
                  {{ scope.row.remarks }}
                </span>
              </el-tooltip>
              <!-- <span v-else>{{ scope.row.remarks }}</span> -->
            </div>
            <div class="remark-box" v-if="scope.row.serviceRemarks">
              <span class="text-title">客服备注: </span> 
              <!-- v-if="scope.row.serviceRemarks.length > 50" -->
              <el-tooltip placement="top-start" popper-class="diy-popper">
                <template #content>
                  {{ scope.row.serviceRemarks }}
                </template>
                <span>
                  {{ scope.row.serviceRemarks }}
                </span>
              </el-tooltip>
              <!-- <span v-else>{{ scope.row.serviceRemarks }}</span> -->
            </div>
          </template>
        </vxe-column>
        <vxe-column title="操作" align="center" fixed="right" width="80">
          <template #default="scope">
            <el-button size="small" type="text" @click="shelves(scope.row.orderId)">下架</el-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <!-- 下架 -->
    <el-dialog title="下架配置" width="30%" v-model="ruleVisible" :close-on-click-modal="false" @close="handleClose" :close-on-press-escape="false">
      <el-form  ref="ruleForm" :model="shelvesForm" :rules="formRules" label-width="110px" class="demo-ruleForm">
        <el-form-item label="指定拣货员:" prop="pickUserId">
          <el-select v-model="shelvesForm.pickUserId"  @change="changePickUser" filterable clearable>
            <el-option v-for="(item, index) in AllPickingUserList" :key="index" :label="item.realName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveInfo" :disabled="isDisabled" :loading="isDisabled" size="small">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, watch, provide, nextTick, inject, computed, onUnmounted, onDeactivated } from "vue";
import { useTableHeight } from "@/compositionApi/useTableHeight.js";
import { documentCopy, localGet, localSet } from "@/utils/util";
import changeRoute from "@/compositionApi/changeRoute";
export default {
  name: "OffOrderTable",
  props: ["tableData", "tableLoading", "total"],
  components: {},
  setup(prop, ctx) {
    const { tableHeight } = useTableHeight(320);
    const { getModuleID } = changeRoute();
    const data = reactive({
      //编辑弹窗
      disLog: false, //添加弹窗显示隐藏
      selectList: [],
      isShow: true,
      ids: [],
      oneIds: [],
      selectIds: [],
      value: "",
      logId: "",
      logVisible: false,
      ruleVisible: false,
      isDisabled: false,
      wareHouseList: [],
      channelList: [],
      AllPickingUserList: [],
      order_type: [],
      shelvesForm: {},
      orderId: '',
      formRules: {
        pickUserId: [{ required: true, trigger: "blur", message: "请输入" }],
      },
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
      // getTableData()
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
      api.orderList.getAllPickingUser().then(res => {
        if (res.code == 200) {
          data.AllPickingUserList = res.data;
        } else {
          vue.$message({
            type: "warning",
            message: res.msg,
          });
        }
      });
    });
    const refData = toRefs(data);
    // 关闭弹框
    const handleClose = () => {
      data.ruleVisible = false;
      data.shelvesForm = {};
      data.oneIds = []
      nextTick(() => {
        vue.$refs.ruleForm.clearValidate();
      });
      // getTableData({});
    };
    const getTableData = inject("getTableData");
    const shelves = id => {
      data.oneIds = [id]
      data.ruleVisible = true;
      api.orderList.getAllPickingUser().then(res => {
        if (res.code == 200) {
          data.AllPickingUserList = res.data;
        } else {
          vue.$message({
            type: "warning",
            message: res.msg,
          });
        }
      });
    };
    // 选择下架人
    const changePickUser = (val) => {
    let info = data.AllPickingUserList.find(i => {
        return i.id == val
      })
      data.shelvesForm.pickUserName = info.realName
    };
    // 全选
    const selectAllChangeEvent = ({ $table }) => {
      data.ids = $table.getCheckboxRecords().map(i => {
        return i.orderId;
      });
    };
    // 多选
    const handleSelectionChange = ({ $table }) => {
      data.ids = $table.getCheckboxRecords().map(i => {
        return i.orderId;
      });
    };
    // 批量下架
    const batchShelves = () => {
      if (!data.ids.length) {
        vue.$message({
          type: "warning",
          message: "请选择订单!",
        });
        return false;
      } else {
        api.orderList.getAllPickingUser().then(res => {
        if (res.code == 200) {
          data.AllPickingUserList = res.data;
        } else {
          vue.$message({
            type: "warning",
            message: res.msg,
          });
        }
      });
        data.ruleVisible = true;
      }
    };
    // 下架配置
    const saveInfo = () => {
      vue.$refs.ruleForm.validate(valid => {
        if (valid) {
          let info = {
            orderId: data.ids,
            pickUserId: data.shelvesForm.pickUserId,
            pickUserName: data.shelvesForm.pickUserName,
          }
          if(data.oneIds.length) {
            info.orderId = data.oneIds
          }
          else {
            info.orderId = data.ids
          }
          api.orderList.batchPutDown(info).then(res => {
            if (res.code == 200) {
              vue.$message({
                type: "success",
                message: "下架成功",
              });
              const { href } = vue.$router.resolve({
              path: "/warehouseManagement/warehouseManagement/straightOutbound/offList",
            });
              window.open(href, "_self");
              handleClose();
              getTableData();
            } else {
              vue.$message({
                type: "warning",
                message: res.msg,
              });
            }
          });
          
        }
      });
    };
    // 跳转到下架单列表
    const jump = path => {
      let query = {
        isDev: 1,
        fid: "",
      };
      getModuleID(path, query);
    };
    //编辑  详情
    const handelEditOpen = row => {
      const { href } = vue.$router.resolve({
        path: "/order/orderDetail/list",
        query: {
          orderId: row.orderId,
          type: "edit",
        },
      });
      window.open(href, "_blank");
    };
    // 处理SKU及数量
    const ComputedSku = computed(() => {
      return list => {
        list.forEach(i => {
          i.text = `${i.sku} * ${i.quantity}`;
        });
        let arr = list.map(i => {
          return i.text;
        });
        return arr;
      };
    });
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
      shelves,
      tableHeight,
      batchShelves,
      saveInfo,
      handleClose,
      tableTypeComputed,
      ComputedSku,
      handelEditOpen,
      changePickUser,
      getModuleID,
      jump
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
#OffOrderTable {
  .remark-box {
    // padding: 10px 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    .text-title {
      font-weight: bold;
    }
  }
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
