<!-- 出柜异常详情 -->
<template>
  <div id="AbnormalDetail">
    <el-dialog title="出柜异常详情页" v-model="dialogVisible" width="90%" :close-on-click-modal="false" @close="closed"
      destroy-on-close :close-on-press-escape="false">
      <div>
        <div class="titles">
          <div class="title-item">柜号：{{ currentRow.cabinetNum ? currentRow.cabinetNum : "-" }}</div>
          <div class="title-item">SKU总种类：{{ currentRow.skuKind ? currentRow.skuKind : "-" }}</div>
          <div class="title-item">SKU总数：{{ currentRow.skuNum ? currentRow.skuNum : "-" }}</div>
          <div class="title-item">箱数：{{ currentRow.boxNum ? currentRow.boxNum : "-" }}</div>
          <div class="title-item">总体积：{{ currentRow.totalVolume ? currentRow.totalVolume : "-" }}m³</div>
        </div>
        <div class="tags">
          <div class="tags-item">
            运输方式：
            <span>{{ detail.shippingScheduleTransportation ? detail.shippingScheduleTransportation : "-"
            }}</span>
          </div>
          <div class="tags-item">
            起运港口：
            <span>{{ detail.startPort ? detail.startPort : "-" }}</span>
          </div>
          <div class="tags-item">
            目的港口：
            <span>{{ detail.endPort ? detail.endPort : "-" }}</span>
          </div>
          <div class="tags-item">
            运费价格：
            <span>{{ detail.freight ? detail.freight : "-" }}</span>
          </div>
        </div>
        <div style="margin-top: 20px;display:flex;">
          <div>
            <el-button type="primary" style="margin-left: 10px" size="small" @click="transfersNO" v-if="type == 'deal'">
              调拨
              <el-tooltip class="item" effect="light" content="调拨当前页被勾选的数据">
                <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
              </el-tooltip>
            </el-button>
          </div>
          <div>
            <el-button type="primary" style="margin-left: 10px" size="small" @click="printBoxLabel"
              v-if="type != 'deal'">
              入库箱标</el-button>
          </div>
          <div>
            <el-button type="primary" style="margin-left: 10px" size="small" @click="print"
              v-show="type != 'deal' && currentRow.type != 'little'">
              谷仓箱唛</el-button>
          </div>
        </div>
        <div class="table-box">
          <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%"
            @selection-change="handleSelectionChange" :header-cell-style="{
              background: '#fafafa',
              color: '#2d2f30',
              fontWeight: 'bold',
              fontSize: '12px',
            }">
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
            <el-table-column align="center" label="发货计划ID" prop="shippingId"></el-table-column>
            <el-table-column align="center" label="中转仓库" prop="transferWarehouse"></el-table-column>
            <el-table-column align="center" label="仓区" prop="purposeWarehouse"></el-table-column>
            <el-table-column align="center" label="箱号" prop="cartonNum"></el-table-column>
            <el-table-column align="center" label="尺寸（长*宽*高cm）">
              <template #default="scope">
                <span>{{
                    `${scope.row.length}x${scope.row.width}x${scope.row.height}`
                }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="重量（kg）" prop="weight"></el-table-column>
            <el-table-column align="center" label="SKU" style="padding: 0;">
              <template #default="scope">
                <div class="table_line">
                  <span v-for="item in scope.row.skuVo"> {{ item.sku }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="发货数量（个）">
              <template #default="scope">
                <div class="table_line">
                  <span v-for="item in scope.row.skuVo"> {{ item.encasementNum }}</span>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="上架数量（个）">
              <template #default="scope">
                <div class="table_line">
                  <span v-for="item in scope.row.skuVo"> {{ item.barnShelfNum == -1 ? "-" : item.barnShelfNum }}</span>
                </div>
              </template>
            </el-table-column> -->

            <el-table-column label="状态" prop="abnormalStatus" align="center">
              <template #default="scope">
                <div>{{ tableTypeComputed(cabinet_abnormal_status, scope.row.abnormalStatus) }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
          <!-- 分页 -->
          <el-pagination background @size-change="handleSizeChangeFir"
            @current-change="handleCurrentChangeFir" :current-page="dataInfo.current" :page-sizes="[10, 25, 50, 100]"
            :page-size="dataInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="dataInfo.total">
          </el-pagination>
      </div>
    </el-dialog>
    <transfersNOPop ref="transfersNOPop"></transfersNOPop>
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
  provide,
} from "vue";
import transfersNOPop from "./transfersNOPop.vue";
import { localGet } from "@/utils/util";
import { getLodop } from "@/utils/LodopFuncs";
export default {
  name: "AbnormalDetail",
  components: { transfersNOPop },
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      btnFlag: false,
      tableLoading: false,
      tableData: [],
      //搜索条件
      sku: "",
      dataInfo: {
        total: 0,
        size: 10,
        current: 1,
      },
      secondTitle: "",
      //当前行数据
      currentRow: {},
      cabinet_abnormal_status: [],
      //分页搜索
      searchMsg: {
        current: 1,
        size: 10,
        cabinetNum: "",
        shippingId: ""
      },
      selectList: [],
      detail: {},
      // typeOfShippingList: [],
      serviceProviderList: [],
      type: 'see',
      seceiving_shipping: []
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      // data.typeOfShippingList = localGet("purchaseDict")
      //   .warehouse_transport_mode
      //   ? localGet("purchaseDict").warehouse_transport_mode
      //   : [];
      data.seceiving_shipping = localGet('purchaseDict')
        .seceiving_shipping
        ? localGet("purchaseDict").seceiving_shipping
        : []
      data.serviceProviderList = localGet("purchaseDict")
        .logistics_service
        ? localGet("purchaseDict").logistics_service
        : [];
      data.cabinet_abnormal_status =
        localGet("purchaseDict") &&
          localGet("purchaseDict").cabinet_abnormal_status
          ? localGet("purchaseDict").cabinet_abnormal_status
          : [];
    });
    const refData = toRefs(data);
    const handleSelectionChange = (val) => {
      data.selectList = val
    }
    //openLog 打开弹框
    const openLog = (e, type) => {
      data.type = type
      data.currentRow = e;
      data.dialogVisible = true;
      getFirstTable();
    };
    // 调拨箱号
    const transfersNO = () => {
      if (data.selectList.length) {
        let flag = data.selectList.every(item => {
          return item.abnormalStatus == 'not_processed'
        })
        if (flag) {
          let obj = {
            transferWarehouse: data.currentRow.transferWarehouse,
            transferWarehouseId: data.currentRow.transferWarehouseId,
            shippingScheduleTransportation: data.detail.shippingScheduleTransportation,
            id: data.currentRow.abnormalId,
            cabinetNum: data.currentRow.cabinetNum,
            shippingId: data.currentRow.shippingId,
            purposeWarehouseId:data.detail.purposeWarehouseId
          }
          vue.$refs.transfersNOPop.openLog(data.selectList, obj);
        } else {
          vue.$message.warning('请选择未处理的数据进行调拨！')
        }
      } else {
        vue.$message.warning('请选择调拨箱号')
      }
    };

    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (option, dizKey) {
        if (option.length > 1 && dizKey !== -1) {
          for (let item of option) {
            if (dizKey == item.dizKey) {
              return item.value;
            }
          }
        }
      };
    });

    //获取一级详情列表
    const getFirstTable = (e) => {
      data.tableLoading = true;
      let msg = {
        abnormalId: data.currentRow.abnormalId,
        cabinetNum: data.currentRow.cabinetNum,
        shippingId: data.currentRow.shippingId,
        id: data.currentRow.id,
        size: data.searchMsg.size,
        current: data.searchMsg.current,
      };
      api.warehouse
        .warehouseAbnormalDetail(msg)
        .then((res) => {
          if (res.code == 200) {
            data.tableData = res.data.cabinet.records;
            data.dataInfo.total = res.data.cabinet.total;
            data.dataInfo.size = res.data.cabinet.size;
            data.dataInfo.current = res.data.cabinet.current;
            data.detail = res.data;
            data.tableLoading = false;
          } else {
            data.tableLoading = false;
            vue.$message.warning(res.msg);
          }
        })
        .catch((err) => {
          data.tableLoading = false;
        });
    };

    provide("getFirstTable", getFirstTable)

    //closed 关闭弹框
    const closed = () => {
      data.dialogVisible = false;
      data.detail = {};
      data.currentRow = {};
    };
    provide("closed", closed);
    //openPreviewImage 图片弹框
    const openPreviewImage = () => {
      vue.$refs.PreviewImageLog.openLog(data.detail.cabinetPhoto);
    };

    //handleCurrentChange  当前页发生变化
    const handleCurrentChangeFir = (val) => {
      data.searchMsg.current = val;
      data.searchMsg.cabinetNum = data.currentRow.cabinetNum;
      data.searchMsg.shippingId = data.currentRow.shippingId
      data.searchMsg.id = data.currentRow.id;
      data.searchMsg.abnormalId = data.currentRow.abnormalId,
        getFirstTable();
    };

    //handleSizeChange 每页多少条发生了变化
    const handleSizeChangeFir = (val) => {
      data.searchMsg.size = val;
      data.searchMsg.cabinetNum = data.currentRow.cabinetNum;
      data.searchMsg.shippingId = data.currentRow.shippingId
      data.searchMsg.id = data.currentRow.id;
      data.searchMsg.abnormalId = data.currentRow.abnormalId;
      getFirstTable();
    };

    //Print 打印箱唛
    const print = () => {
      if (data.selectList.length < 1) {
        vue.$message.warning('请勾选数据！')
        return
      }
      let cartonNum = []
      data.selectList.map(item => {
        cartonNum.push(item.cartonNum)
      })
      let LODOP = getLodop();
      if (typeof LODOP == "string") {
        vue.$message.warning({
          dangerouslyUseHTMLString: true,
          message: LODOP,
        });
        return;
      }
      api.warehouse
        .printReceivingBox({
          cartonNum: cartonNum,
          cabinetNum: data.currentRow.cabinetNum,
          madeInChina: true,
        })
        .then((res) => {
          if (res.code == 200) {
            vue.$printFn(LODOP, res.data, "pdf");
          } else {
            vue.$message.warning(res.msg);
          }
        });
    };


    //打印箱标
    const printBoxLabel = () => {
      if (data.selectList.length == 0) {
        vue.$message.warning('请选择数据')
        return false
      } else {
        let LODOP = getLodop();
        if (typeof LODOP == "string") {
          vue.$message.warning({
            dangerouslyUseHTMLString: true,
            message: LODOP,
          });
          return;
        }
        let datas = [];
        for (let item of data.selectList) {
          for (let ite of item.skuVo) {
            let obj = {
              cartonNum: item.cartonNum,
              encasementNum: ite.encasementNum,
              num: 1,
              sku: "200-" + ite.sku,
              warehouse:
                item.transferWarehouse.indexOf("TS") != -1
                  ? item.purposeWarehouse + "-TS"
                  : item.purposeWarehouse,
              cabinetNum: item.cabinetNum,
              drawback: ite.isDrawback ? "是" : "-",
              isPhoto: ite.isPhotograph ? "【拍照】" : "",
            };
            datas.push(obj);
          }
        }
        vue.$printFn(LODOP, datas, "cartonNum");
      }
    }

    return {
      ...refData,
      closed,
      openLog,
      handleCurrentChangeFir,
      handleSizeChangeFir,
      openPreviewImage,
      tableTypeComputed,
      transfersNO,
      handleSelectionChange,
      print,
      printBoxLabel
    };
    return {
      ...refData,
    };
  },
};
</script>
<style scoped lang="scss">
#AbnormalDetail {
  .titles {
    display: flex;

    .title-item {
      margin-right: 50px;
      font-size: 22px;
      color: #666666;
      font-weight: 600;
    }
  }

  .tags {
    margin-top: 40px;
    display: flex;

    .tags-item {
      margin-right: 40px;
      display: flex;
      align-items: center;
    }
  }

  .table-box {
    min-height: 400px;
    margin-top: 35px;
  }

  .table_line {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;

    span {
      border-top: 1px solid rgb(240, 239, 239);
      width: 100%;
    }

    >span:nth-child(1) {
      border-top: 0;
    }
  }

  // ::v-deep .cell {
  //   padding: 0;
  // }
  .el-pagination {
    position: absolute !important;
    bottom: 10px !important
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }

}
</style>
