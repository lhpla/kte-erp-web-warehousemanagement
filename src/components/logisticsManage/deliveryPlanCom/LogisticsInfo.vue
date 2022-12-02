<!-- LogisticsInfo物流信息 -->
<template>
  <div id='LogisticsInfo'>
    <el-dialog title="物流信息" v-model="dialogVisible" width="50%" :close-on-click-modal="false" @close="closed" :close-on-press-escape="false">
      <div class="LogisticsInfo_box1">
        <div class="LogisticsInfo_title">
          <span>生成信息</span>
        </div>
        <div class="LogisticsInfo_info">
          <div>
            <div>
              <span>运输方式：</span><span>{{
                  logisticsInfo.shippingScheduleTransportationName ? logisticsInfo.shippingScheduleTransportationName :
                    '-'
              }}</span>
            </div>
            <div>
              <span>起运港口：</span><span>{{
                  logisticsInfo.startPortName ? logisticsInfo.startPortName : '-'
              }}</span>
            </div>
            <div>
              <span>币种：</span><span>{{
                  logisticsInfo.currencyName ? logisticsInfo.currencyName : '-'
              }}</span>
            </div>
          </div>
          <div>
            <div>
              <span>预估运费价格：</span><span>{{
                  logisticsInfo.freight ? logisticsInfo.freight : '-'
              }}</span>
            </div>
            <div v-if="logisticsInfo.shippingScheduleTransportationName == '海运整柜'">
              <span>目的港口：</span><span>{{
                  logisticsInfo.endPortName ? logisticsInfo.endPortName : '-'
              }}</span>
            </div>
            <div v-if="logisticsInfo.shippingScheduleTransportationName == '海运整柜'">
              <span>清关港口：</span><span>{{
                  logisticsInfo.qgPortName ? logisticsInfo.qgPortName : '-'
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="LogisticsInfo_box" v-if="logisticsInfo.shippingScheduleTransportationName == '海运整柜'">
        <div class="LogisticsInfo_title">
          <span>物流信息</span>
        </div>
        <div class="LogisticsInfo_info">
          <div>
            <div>
              <span>SO号：</span><span>{{
                  logisticsInfo.soCode ? logisticsInfo.soCode : '-'
              }}</span>
            </div>
            <div>
              <span>计划装柜日期：</span><span>{{
                  logisticsInfo.schedulePackCabinetTime ? logisticsInfo.schedulePackCabinetTime : '-'
              }}</span>
            </div>
          </div>
          <div>
            <div>
              <span>预计开船日期：</span><span>{{
                  logisticsInfo.domesticSailingTime ? logisticsInfo.domesticSailingTime : '-'
              }}</span>
            </div>
            <div>
              <span>预计到港日期：</span><span>{{
                  logisticsInfo.overseasArrivalTime ? logisticsInfo.overseasArrivalTime : '-'
              }}</span>
            </div>
          </div>
          <div>
            <div>
              <span>预计到仓日期：</span><span>{{
                  logisticsInfo.toWarehouseTime ? logisticsInfo.toWarehouseTime : '-'
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, getCurrentInstance, nextTick, computed } from 'vue';
import { localGet } from "@/utils/util";

const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;

const dialogVisible = ref(false)
const creatInfo = ref({
  shippingScheduleTransportationName: '',
  provider: '',
  startPortName: '',
  endPortName: '',
  currencyName: '',
  qgPortName: '',
  freight: '',
})
const shippingStatus = ref("")
const logisticsInfo = ref({})
//查询生成按钮发货计划数据
// const selectGenerate = (shippingIds) => {
//   api.warehouse
//     .selectGenerate({ shippingIds: shippingIds })
//     .then((res) => {
//       if (res.code == 200) {
//         nextTick(() => {
//           for (let i in creatInfo.value) {
//             creatInfo.value[i] = res.data[i] == -1 ? creatInfo.value[i] : res.data[i]
//           }
//         })
//       } else {
//         vue.$message.warning(res.msg);
//       }
//     });
// };
//查询物流详情
const getSelectLogistics = (shippingIds) => {
  api.warehouse
    .selectLogistics({ shippingIds: shippingIds })
    .then((res) => {
      if (res.code == 200) {
        logisticsInfo.value = res.data;
      } else {
        vue.$message.warning(res.msg);
      }
    });
};
const serviceProviderList = ref([])
const typeOfShippingList = ref([])
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
//打开弹窗
const openDialog = (row) => {
  shippingStatus.value = row.shippingStatus
  serviceProviderList.value = localGet("purchaseDict")
    .logistics_service
    ? localGet("purchaseDict").logistics_service
    : [];
  typeOfShippingList.value = localGet("purchaseDict")
    .seceiving_shipping
    ? localGet("purchaseDict").seceiving_shipping
    : [];
  // selectGenerate(row.shippingId)
  getSelectLogistics(row.shippingId);
  dialogVisible.value = true
}
//关闭弹窗
const closed = () => {
  logisticsInfo.value = {}
  creatInfo.value = {
    shippingScheduleTransportationName: '',
    provider: '',
    startPortName: '',
    endPortName: '',
    currencyName: '',
    qgPortName: '',
    freight: '',
  }
  dialogVisible.value = false
}
defineExpose({ openDialog })
</script>

<style scoped lang='scss'>
#LogisticsInfo {
  :deep(.el-dialog__header) {
    margin-right: 0;
  }

  .LogisticsInfo_box {
    .LogisticsInfo_title {
      span {
        color: #409eff;
      }

      padding-bottom:10px;
      border-bottom: 1px solid #ddd;
      margin-bottom:10px;
    }

    .LogisticsInfo_info {
      display: flex;
      flex-direction: column;

      >div {

        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        // flex-grow: 1;

        div {
          display: flex;
          align-items: center;
          padding: 20px;
          box-sizing: border-box;
          width: 50%;

          >span:nth-child(1) {
            width: 100px;
            display: flex;
            justify-content: flex-end;
            font-weight: 800;
          }
        }
      }
    }
  }

  .LogisticsInfo_box1 {
    .LogisticsInfo_title {
      span {
        color: #409eff;
      }

      padding-bottom:10px;
      border-bottom: 1px solid #ddd;
      margin-bottom:10px;
    }

    .LogisticsInfo_info {
      display: flex;
      flex-direction: column;

      >div {

        display: flex;
        flex-wrap: wrap;
        // width: 33%;
        // justify-content: space-between;
        flex-grow: 1;

        div {
          display: flex;
          align-items: center;
          box-sizing: border-box;
          padding: 20px;
          width: 33%;

          >span:nth-child(1) {
            width: 100px;
            display: flex;
            justify-content: flex-end;
            font-weight: 800;
          }
        }
      }
    }
  }
}
</style>