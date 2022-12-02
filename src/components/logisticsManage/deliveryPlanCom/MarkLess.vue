<!-- 添加柜号 -->
<template>
  <div id="AddCabinetPop">
    <el-dialog :title="title" v-model="dialogVisible" width="90%" :close-on-click-modal="false" @close="closed"
      :modal="false" :close-on-press-escape="false">
      <el-form :model="formParam" ref="searchForm" label-width="80px" :inline="true" 
        class="demo-form-inline" v-if="shippingTransport == '4'">
        <el-form-item label="柜号:" prop="cabinetNum" class="SearchPanel-form-item">
          <el-input v-model="formParam.cabinetNum" clearable placeholder="请输入" maxlength="100" @keyup.enter="search">
          </el-input>
        </el-form-item>
        <el-form-item label="箱号:" prop="cartonNum" class="SearchPanel-form-item">
          <el-input v-model="formParam.cartonNum" clearable placeholder="请输入" maxlength="100" @keyup.enter="search">
          </el-input>
        </el-form-item>
        <el-form-item label="中转仓库:" prop="warehouseId">
          <el-select v-model="formParam.warehouseId"  filterable clearable placeholder="请选择"
            @change="search">
            <el-option v-for="item in transitWarehouseList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" size="small">搜 索</el-button>
        </el-form-item>
      </el-form>
      <!-- <div class="red" v-if="shippingTransport == '4'">请标记不能确定少装原因的箱子，未被标记的箱子出库后会同步谷仓入库单删减对应箱号</div> -->
      <div class="red" v-if="shippingTransport == '1' || shippingTransport == '2'">
        注：点击【确定】所有形成【减货】类型异常
      </div>
      <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%;margin-bottom:20px"
        :header-cell-style="{
          background: '#fafafa',
          color: '#2d2f30',
          fontWeight: 'bold',
          fontSize: '12px',
        }">
        <el-table-column align="center" label="中转仓库" prop="transferWarehouse"></el-table-column>
        <el-table-column align="center" label="仓区" prop="purposeWarehouse"></el-table-column>
        <el-table-column align="center" label="柜号" prop="cabinetNum"></el-table-column>
        <el-table-column align="center" label="箱号" prop="cartonNum"></el-table-column>
        <el-table-column align="center" label="SKU" prop="skus">
          <template #default="scope">
            <span v-if="scope.row.skus.length">
              <span v-for="(sku, index) in scope.row.skus" :key="index">{{ sku }}</span>
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="装箱数（个）" prop="num"></el-table-column>
        <!-- <el-table-column align="center" label="操作" v-if="shippingTransport == '4'">
          <template #default="scope">
            <el-button type="text" icon="el-icon-circle-plus-outline" @click="changeType(scope.row.id, true)"
              v-if="!scope.row.isMark">标记
            </el-button>
            <el-button type="text" icon="el-icon-remove-outline" v-if="scope.row.isMark"
              @click="changeType(scope.row.id, false)">取消标记
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>


      <template #footer>
        <div class="dialog-footer">
          <div class="paginationN">
            <el-pagination class="log-pagination" background @size-change="handleSizeChangeLog"
              @current-change="handleCurrentChangeLog" :current-page="pageableLog.current" :page-sizes="[5, 10, 25, 50]"
              :page-size="pageableLog.size" layout="total, sizes, prev, pager, next, jumper" :total="pageableLog.total">
            </el-pagination>
          </div>
          <span class="button">
            <el-button @click="closed" size="small" :disabled="btnLoading" :loading="btnLoading">取 消
            </el-button>
            <el-button type="primary" @click="onSubmit" :disabled="btnLoading" :loading="btnLoading" size="small">确 认
            </el-button>
          </span>
        </div>

      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from 'vue';
export default {
  name: 'AddCabinetPop',
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      formParam: {
        warehouseId: '',
        cabinetNum: '',
        cartonNum: ''
      },
      tableData: [],
      btnLoading: false,
      shippingTransport: '',
      title: '',

      overseasCabinetNum: '',
      numberPlate: '',
      shipCabinetNums: [],
      shippingId: '',
      unBoxedNum: '',
      totalCases: '',
      boxedNum: '',
      otherBoxedNum: '',

      //中转仓库列表
      transitWarehouseList: [],
      tableLoading: false,
      pageableLog: {
        current: 1,
        size: 10,
        total: 10,
      },
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { })
    onMounted(() => { })
    const refData = toRefs(data);
    const closedDialog = inject('closedDialog')
    const getTableDataN = inject("getTableData");
    //减货列表
    const getTableData = (current) => {
      data.tableLoading = true;
      let info = {
        overseasCabinetNum: data.overseasCabinetNum,
        shipCabinetNums: data.shipCabinetNums,
        shippingId: data.shippingId,
        totalCases: data.totalCases,
        boxedNum: data.boxedNum,
        unBoxedNum: data.unBoxedNum,
        otherBoxedNum: data.otherBoxedNum,
        size: data.pageableLog.size,
        warehouseId: data.formParam.warehouseId,
        cabinetNum: data.formParam.cabinetNum,
        cartonNum: data.formParam.cartonNum,
        current: current ? current : 1
      };
      api.warehouse.checkLess(info).then((res) => {
        if (res.code == 200) {
          data.tableData = JSON.parse(JSON.stringify(res.data.records))
          data.tableLoading = false;
        } else {
          data.tableLoading = false;
        }
      })
        .catch((err) => {
          data.tableLoading = false;
        });
    };
    //打开弹窗
    const getMsg = (resData, msg, shippingTransport, numberPlate) => {
      data.shippingTransport = shippingTransport
      if (shippingTransport == '1') {//海运散货
        data.title = '标记少装-海运散货'
      } else if (shippingTransport == '4') {//海运整柜
        data.title = '标记少装-海运整柜'
      } else if (shippingTransport == '2') {//快递
        data.title = '标记少装-快递'
      }
      data.tableData = resData.records
      data.numberPlate = numberPlate
      data.pageableLog.total = resData.total
      data.pageableLog.size = resData.size
      data.pageableLog.current = resData.current
      data.overseasCabinetNum = msg.overseasCabinetNum
      data.shipCabinetNums = msg.shipCabinetNums
      data.shippingId = msg.shippingId
      data.unBoxedNum = msg.unBoxedNum
      data.totalCases = msg.totalCases,
        data.boxedNum = data.boxedNum,
        data.otherBoxedNum = data.otherBoxedNum,
        // 中转仓
        api.warehouse.selectTransitWarehouse().then(res => {
          if (res.code == 200) {
            data.transitWarehouseList = res.data;
          }
        });
      data.dialogVisible = true;
    }
    //搜索
    const search = () => {
      data.tableData = []
      getTableData()
    }
    //确定
    const onSubmit = () => {
      data.btnLoading = true;
      let info = {
        overseasCabinetNum: data.overseasCabinetNum,
        shipCabinetNums: data.shipCabinetNums,
        shippingId: data.shippingId,
        unBoxedNum: data.unBoxedNum,
        numberPlate: data.numberPlate
      };
      api.warehouse.outCabinetN(info).then(res => {
        if (res.code == 200) {
          data.btnLoading = false;
          getTableDataN()
          closedDialog()
          closed()
        } else {
          data.btnLoading = false;
        }
      }).catch((err) => {
        data.btnLoading = false;
      });

    }

    //切换状态
    const changeType = (casesId, isMark) => {
      data.tableLoading = true;
      api.warehouse
        .mark({ casesId: casesId, isMark: isMark })
        .then((res) => {
          if (res.code == 200) {
            getTableData()
            data.tableLoading = false;
          } else {
            data.tableLoading = false;
          }
        })
        .catch((err) => {
          data.tableLoading = false;
        });
    }
    //closed 关闭弹框
    const closed = () => {
      data.dialogVisible = false;
      data.formParam = {
        warehouseId: '',
        cabinetNum: '',
        cartonNum: ''
      }
    };

    // 每页条数发生改变
    const handleSizeChangeLog = val => {
      data.pageableLog.size = val;
      getTableData();
    };
    // 当前页发生改变
    const handleCurrentChangeLog = val => {
      data.pageableLog.current = val;
      getTableData(data.pageableLog.current);
    };

    return {
      ...refData,
      getMsg,
      search,
      onSubmit,
      closed,
      changeType,
      handleSizeChangeLog,
      handleCurrentChangeLog,
    }
  }
};
</script>
<style scoped lang='scss'>
#AddCabinetPop {
  position: relative;

  .paginationN {
    display: flex;
    justify-content: flex-end;
    // position: absolute;
    // bottom: 40px !important;
    // right: 100px;
  }

  .dialog-footer {
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .button {
      text-align: end;
    }
  }

  .log-pagination {
    display: flex;
    justify-content: flex-end;
    position: static;
    // bottom: 0;
    // right: 0;
    background: #fff;
    border: 1px solid #cecfcf;
    // border: none;
    border-radius: 50px;

    margin: -20px 20px;
  }

  .red {
    color: red;
    padding: 5px 0;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>