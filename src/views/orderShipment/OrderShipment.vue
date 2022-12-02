<!-- 订单出货 -->
<template>
  <div>
    <div class="AutomaticAdd-box">
      <div class="box-left">
        <div class="title_info">选择仓库</div>

        <div class="left-main">
          <el-card class="box-card">
            <span>
              <span style="color: red">*</span>
              直发仓：
            </span>
            <el-select  @change="changeWareHouse" filterable value-key="id" v-model="wareHouseId">
              <el-option v-for="item in wareHouse" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <div style="color: red; margin: 10px 0px">备注: 按服务商、运输方式可统计待出库的订单数量</div>
            <div>
              <el-tree :data="dataSource" node-key="id" :props="defaultProps" @node-click="handleNodeClick">
                <template #default="{ data }">
                  <span class="custom-tree-node">
                    <span>{{ data.lableName }}</span>
                    <span>
                      <a>{{ data.orderCount }}</a>
                    </span>
                  </span>
                </template>
              </el-tree>
            </div>
          </el-card>
        </div>
      </div>
      <div class="box-middle">
        <div class="title_info">出货操作</div>
        <div class="left-main">
          <el-card class="box-card">
            <el-form  ref="ruleForm" :model="formInfo" :rules="rules" label-width="90px" class="demo-ruleForm">
              <el-form-item label="打包员:" prop="packer">
                <el-select  filterable value-key="id" v-model="formInfo.packer">
                  <el-option v-for="item in packList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="服务商:" prop="providerId">
                <el-select v-model="formInfo.providerId" filterable @change="changeProvides">
                  <el-option v-for="item in ServiceProviderList" :key="item.id" :label="item.providersCname" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="运输方式:" prop="logisticsId">
                <el-select v-model="formInfo.logisticsId" filterable>
                  <el-option v-for="item in ChannelList" :key="item.id" :label="item.chineseName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="订单号:" prop="orderId">
                <el-input v-model="formInfo.orderId" placeholder="请输入" @keyup.enter="sendkeybtn('1')" clearable></el-input>
              </el-form-item>
              <el-form-item label="运单号:" prop="waybillNumber">
                <el-input v-model="formInfo.waybillNumber" placeholder="请输入" @keyup.enter="sendkeybtn('2')" clearable></el-input>
              </el-form-item>
              <el-form-item label="重量/抛重:">
                <el-input v-model="formInfo.weight" placeholder="请输入" maxlength="6" @change="changeWeight" @input="inputNum($event, 'weight', /\d+(\.\d{0,2})?/)" clearable>
                  <template #append>KG</template>
                </el-input>
              </el-form-item>
            </el-form>
            <div class="box-btn">
              <el-button type="primary" size="small" @click="saveInfo" :loading="subflag" :disabled="subflag">订单出货</el-button>
            </div>
          </el-card>
        </div>
      </div>
      <div class="box-right" v-show="isTable">
        <div class="box-right-title">
          <span style="margin-right: 20px">订单总数：{{tableInfo.orderCount}}</span>
          <span>SKU总数：{{tableInfo.skuCount}}</span>
        </div>
        <div class="check-box">
          <vxe-table
            :data="tableInfo.list"
            :column-config="{ resizable: true }"
            :expand-config="{ showIcon: false }"
            :row-config="{ isHover: true }"
            ref="xTable"
            border
            style="width: 100%"
            :header-row-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
          >
            <!-- <vxe-column fixed="left" type="checkbox" align="center" width="55" /> -->
            <vxe-column prop="date" title="订单号">
              <template #default="scope">
                <span>{{ scope.row.orderId ? scope.row.orderId : "-" }}</span>
              </template>
            </vxe-column>
            <vxe-column prop="date" title="运单号">
              <template #default="scope">
                <span>{{ scope.row.waybillId ? scope.row.waybillId : "-" }}</span>
              </template>
            </vxe-column>
            <vxe-column prop="name" title="重量/抛重(KG)">
              <template #default>
                <span>{{ tableInfo.weight || '-' }}</span>
              </template>
            </vxe-column>
            <vxe-column title="订单状态(仓库)">
              <template #default="scope">
                <span>{{ tableTypeComputed(order_warehouse_status, scope.row.orderWarehouseStatus) }}</span>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </div>
    </div>
    <orderShipmentPop ref="orderShipmentPop"></orderShipmentPop>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, computed } from "vue";
import { localGet, localSet, parseTime } from "@/utils/util";
import orderShipmentPop from "./orderShipmentPop.vue";
export default {
  name: "AutomaticAdd",
  components: { orderShipmentPop },
  setup(prop, ctx) {
    const data = reactive({
      ChannelList: [],
      WareHouseList: [],
      formInfo: {},
      subflag: false,
      isTable: false,
      flat: false,
      wareHouseId: "",
      tableData: [],
      defaultProps: {
        children: "subMap",
      },
      dataSource: [],
      tableInfo: {},
      rules: {
        providerId: [{ required: true, message: "请选择服务商", trigger: "change" }],
        logisticsId: [{ required: true, message: "请选择运输方式", trigger: "change" }],
        orderId: [{ required: true, message: "请输入订单号", trigger: "change" }],
        waybillNumber: [{ required: true, message: "请输入运单号", trigger: "change" }],
      },
      ServiceProviderList: [],
      channelList: [],
      packList: [],
      wareHouse: [], //全部仓库
      order_warehouse_status: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      init();
    });
    const ruleForm = ref(null);
    // 初始数据
    const init = () => {
      data.order_warehouse_status = localGet("orderDicList").order_warehouse_status ? localGet("orderDicList").order_warehouse_status : [];
      api.system.getDirectWarehouse().then(res => {
        if (res.code == 200) {
          data.wareHouse = res.data;
          if(data.wareHouse.length) {
            data.wareHouseId = data.wareHouse[0].id
            changeWareHouse(data.wareHouseId)
          }
        }
      });
      api.orderList.getfindPacker().then(res => {
        if (res.code == 200) {
          data.packList = res.data
        }
      });
      //服务商列表
      api.assest.getServiceProvider().then(res => {
        if (res.code == 200) {
          data.ServiceProviderList = res.data;
        }
      });
      // 运输方式
      api.assest.getLogisticsName().then(res => {
        if (res.code == 200) {
          data.ChannelList = res.data;
        } else {
          vue.$message.warning(res.msg);
        }
      });
    };
    const inputNum = (e, prop, rest) => {
      data.formInfo[prop] = e.match(rest) ? e.match(rest)[0] : "";
    };
    const changeWeight = () => {
      if(data.formInfo.weight >999) {
        vue.$message.warning('请输入0-999的正数');
        data.formInfo.weight = ''
        data.flat = true
      }else {
        data.flat = false
      }
    }
    const changeProvides = id => {
      data.formInfo.logisticsId = "";
      api.logistics.getAllByProvider({ providerId: id }).then(res => {
        if (res.code == 200) {
          data.ChannelList = res.data;
        }
      });
    };
    // 订单出货
    const saveInfo = () => {
      ruleForm.value.validate(valid => {
        if (valid) {
          if(!data.flat) {
            api.orderList.shipment(data.formInfo).then(res => {
            if (res.code == 200) {
              data.tableInfo = res.data
                vue.$refs.orderShipmentPop.getMsg(data.tableInfo);
                data.isTable = true
                vue.$message.success({
                message: '订单出货成功',
              });
              changeWareHouse(data.wareHouseId)
            } else {
              vue.$message.warning({
                message: res.msg,
                type: "warning",
              });
            }
          });
          }
          
        
        }
      });
    };
    // 选择直发仓
    const changeWareHouse = val => {
      api.logistics.shippingMethods({ warehouseId: val }).then(res => {
        if (res.code == 200) {
          data.dataSource = res.data;
        } else {
          vue.$message.warning(res.msg);
        }
      });
    };
    // 键盘事件
    const sendkeybtn = type => {
      api.assest.getLogisticsName().then(res => {
        if (res.code == 200) {
          data.ChannelList = res.data;
        }
      });
      let info = {
        type,
        id: type == '1' ? data.formInfo.orderId : data.formInfo.waybillNumber,
      };
      if (type == '1') {
        api.orderList.getOrderLogistics(info).then(res => {
          if (res.code == 200) {
            data.formInfo.waybillNumber = res.data.waybillNumber;
            data.formInfo.providerId = res.data.providerId;
            data.formInfo.logisticsId = res.data.logisticsId;
          }else {
          vue.$message.warning(res.msg);
        }
        });
      } else {
        api.orderList.getOrderLogistics(info).then(res => {
          if (res.code == 200) {
            data.formInfo.orderId = res.data.orderId;
            data.formInfo.providerId = res.data.providerId;
            data.formInfo.logisticsId = res.data.logisticsId;
          }
          else {
          vue.$message.warning(res.msg);
        }
        });
      }
    };
    // 点击当前节点
    const handleNodeClick = row => {
      // 运输方式
      api.assest.getLogisticsName().then(res => {
        if (res.code == 200) {
          data.ChannelList = res.data;
        }
      });
      if (row.logisticsId) {
        data.formInfo.providerId = row.providesId;
        data.formInfo.logisticsId = row.logisticsId;
      } else {
        return false;
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
    const refData = toRefs(data);
    return {
      ...refData,
      init,
      handleNodeClick,
      inputNum,
      changeWareHouse,
      sendkeybtn,
      saveInfo,
      ruleForm,
      tableTypeComputed,
      changeWeight,
      changeProvides
    };
  },
};
</script>
<style scoped lang="scss">
::v-deep .el-card__header {
  height: 50px;
  line-height: 50px;
  padding: 0px !important;
}
::v-deep .el-card__body {
  padding: 20px 10px !important;
}
::v-deep .box-form .el-form-item {
  margin-bottom: 16px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.li_bgc {
  background: #ccc;
  cursor: pointer;
}

.AutomaticAdd-box {
  display: -webkit-flex;
  justify-content: left;
  padding: 0 20px;
  // padding: 0 10px;
  .title_info {
    line-height: 40px;
    color: #000;
    font-weight: bold;
    font-size: 14px;
    // border-left: 3px solid #75b9ff;
  }

  .title_info::before {
    content: "|";
    font-size: 22px;
    color: #75b9ff;
    padding-right: 5px;
  }
  .box-left {
    flex: 0.26;
    margin-right: 20px;
    .left-top {
      height: 35vh;

      .left-main {
        // border: 1px solid #ccc;
        // height: 80%;
        padding: 10px;
        overflow-y: auto;
        font-size: 12px;
      }
    }
  }
  .box-middle {
    flex: 0.24;
    margin-right: 20px;
    .left-top {
      height: 35vh;

      .left-main {
        // border: 1px solid #ccc;
        // height: 80%;
        padding: 10px;
        overflow-y: auto;
        font-size: 12px;
      }
    }
  }

  .box-right {
    flex: 0.5;
    margin-top: 50px;
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f5f5f5;
      span {
        margin-left: 18px;
      }
    }
    .box-right-title {
      text-align: right;
      margin-bottom: 10px;
      span {
        font-size: 16px;
      }
    }
    .check-box {
      width: 100%;
      // height: calc(100vh - 18vh);
      overflow-y: auto;
      .el-checkbox {
        margin-bottom: 10px;
      }
    }
    .text {
      font-size: 12px;
    }

    .item {
      margin-bottom: 18px;
    }

    .box-card {
      //   width: 480px;
      // width: 95%;
      margin-bottom: 30px;
      font-size: 12px;
      height: 500px;
      p {
        color: #2799d7;
        cursor: pointer;
        margin-bottom: 14px;
      }
      .info_item {
        display: -webkit-flex;
        justify-content: space-between;
        // align-content: space-between;
        flex-wrap: wrap;
      }
    }
    .check-ul {
      li {
        margin-bottom: 10px;
      }
    }
  }
}
.box-btn {
  float: right;
  // margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  // .el-button {
  //   width: 120px;
  // }
}
</style>
