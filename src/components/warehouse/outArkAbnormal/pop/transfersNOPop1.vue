<!-- 调拨箱号 -->
<template>
  <div id="transfersNOPop">
    <el-dialog title="调拨箱号数据" v-model="dialogVisible" width="60%" :close-on-click-modal="false" @close="closedPop" :close-on-press-escape="false">
      <div>
        <div class="titles">
          <div class="title-item">中转仓：{{ currentRow.transferWarehouse }}</div>
          <div class="title-item">海外仓：{{ currentRow.purposeWarehouse }}</div>
          <div class="title-item">柜号：{{ currentRow.cabinetNum }}</div>
          <div style="height: 24px; line-height: 24px; font-size: 14px; margin-right: 3px">调拨柜号:</div>
          <el-select v-model="searchId" style="width: 200px" size="mini" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in List" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div class="table-box">
          <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%"
            @selection-change="handleSelectionChange"
            :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }">
            <el-table-column type="selection" width="50" align="center" :selectable="checkSelectable"></el-table-column>
            <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
            <el-table-column align="center" label="箱号">
              <template #default="scope">
                <span>{{ scope.row.cartonNum }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="SKU">
              <template #default="scope">
                <span style="cursor: pointer; color: #02a7f0" @click="rowSku(scope.row)">{{ scope.row.sku }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="数量">
              <template #default="scope">
                <span>{{ scope.row.num }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="尺寸">
              <template #default="scope">
                <span>{{ `${scope.row.length}x${scope.row.width}x${scope.row.height}` }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="序列号">
              <template #default="scope">
                <span>{{ scope.row.serialNum }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="abnormalStatus">
              <template #default="scope">
                <div>
                  {{ tableTypeComputed(cabinet_abnormal_status, scope.row.abnormalStatus) }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closedPop" :loading="submitActive" :disabled="submitActive" size="mini">取 消</el-button>
          <el-button type="primary" @click="submit" :loading="submitActive" :disabled="submitActive" size="mini">确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog :title="`查看(箱号${rowCartonNum} - 序列号${rowSerialNum})`" v-model="rowDialogVisible" width="40%"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <div>
        <div class="table-box">
          <el-table :data="rowTableData" border style="width: 100%"
            :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }">
            <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>

            <el-table-column align="center" label="SKU">
              <template #default="scope">
                <span>{{ scope.row.sku }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="名称">
              <template #default="scope">
                <span>{{ scope.row.productName }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="数量">
              <template #default="scope">
                <span>{{ scope.row.encasementNum }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="重量">
              <template #default="scope">
                <span>{{ scope.row.weight }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, computed, inject } from "vue";
import { localGet } from "@/utils/util";
export default {
  name: "transfersNOPop",
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      rowDialogVisible: false,
      searchId: "",
      btnFlag: false,
      tableLoading: false,
      submitActive: false,
      tableData: [],
      rowTableData: [],
      rowCartonNum: "",
      rowSerialNum: "",
      cabinet_abnormal_status: [],
      //搜索条件
      sku: "",
      secondTitle: "",
      //当前行数据
      currentRow: {},
      selectList: [],
      List: [],
      //分页搜索
      searchMsg: {
        current: 1,
        size: 10,
        cabinetNum: "",
      },
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      data.cabinet_abnormal_status = localGet("purchaseDict") && localGet("purchaseDict").cabinet_abnormal_status ? localGet("purchaseDict").cabinet_abnormal_status : [];
    });
    const refData = toRefs(data);
    const getTableList = inject("getTableList");
    const closed = inject("closed");
    //openLog 打开弹框
    const openLog = e => {
      console.log(e);
      data.currentRow = e;
      data.dialogVisible = true;
      let msg = {
        abnormalId: e.abnormalId,
      };
      let info = {
        purposeWarehouse: e.purposeWarehouse,
        transferWarehouse: e.transferWarehouse,
        cabinetNum: e.cabinetNum,
      };
      getFirstTable(msg);
      selectCabinetNum(info);
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
    // 处理多选择 已处理状态不能选择
    const checkSelectable = (row, index) => {
      if (row.abnormalStatus == "not_processed") {
        return true;
      } else {
        return false;
      }
    };
    // 查看此箱号SKU
    const rowSku = row => {
      data.rowSerialNum = row.serialNum;
      data.rowCartonNum = row.cartonNum;
      data.rowDialogVisible = true;
      data.row;
      api.warehouse
        .abnormalCasesDetail({ serialNum: row.serialNum })
        .then(res => {
          if (res.code == 200) {
            data.rowTableData = res.data;
          } else {
            vue.$message.warning(res.msg);
          }
        })
        .catch(err => {
          data.tableLoading = false;
        });
      console.log("rrr", row);
    };
    const selectCabinetNum = e => {
      api.warehouse.selectCabinetNum(e).then(res => {
        if (res.code == 200) {
          data.List = res.data;
        } else {
          vue.$message.warning(res.msg);
        }
      });
    };

    //获取一级详情列表
    const getFirstTable = e => {
      data.tableLoading = true;
      api.warehouse
        .warehouseAbnormalCasesSku(e)
        .then(res => {
          if (res.code == 200) {
            data.tableData = res.data;
            data.tableLoading = false;
          } else {
            data.tableLoading = false;
            vue.$message.warning(res.msg);
          }
        })
        .catch(err => {
          data.tableLoading = false;
        });
    };

    //closed 关闭弹框
    const closedPop = () => {
      data.dialogVisible = false;
      data.currentRow = {};
    };
    // 列选择
    const handleSelectionChange = val => {
      data.selectList = val.map(i => {
        return i.cartonNum;
      });
    };
    //确定调拨
    const submit = () => {
      if (!data.selectList.length) {
        vue.$message.warning("请选择箱号数据");
        return false;
      }
      if (data.searchId == "") {
        vue.$message.warning("请选择调拨柜号");
        return false;
      }
      data.submitActive = true;
      let msg = {
        abnormalId: data.currentRow.abnormalId,
        newCabinetNum: data.searchId,
        boxNums: data.selectList,
        cabinetNum: data.currentRow.cabinetNum,
        purposeWarehouse: data.currentRow.purposeWarehouse,
        purposeWarehouseId: data.currentRow.purposeWarehouseId,
        transferWarehouse: data.currentRow.transferWarehouse,
        transferWarehouseId: data.currentRow.transferWarehouseId,
      };
      api.warehouse
        .abnormalTransfer(msg)
        .then(res => {
          if (res.code == 200) {
            vue.$message.success(res.msg);
            data.submitActive = false;
            closedPop();
            closed();
            getTableList();
          } else {
            data.submitActive = false;
            vue.$message.warning(res.msg);
          }
        })
        .catch(err => {
          data.submitActive = false;
        });
    };

    return {
      ...refData,
      closed,
      openLog,
      tableTypeComputed,
      handleSelectionChange,
      submit,
      checkSelectable,
      rowSku,
      selectCabinetNum,
      closedPop,
    };
    return {
      ...refData,
    };
  },
};
</script>
<style scoped lang='scss'>
#transfersNOPop {
  .titles {
    display: flex;

    .title-item {
      margin-right: 50px;
      font-size: 14px;
      color: #666666;
      //   font-weight: 600;
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
    min-height: 350px;
    margin-top: 50px;
  }

  .paging {
    margin-top: 50px;
    height: 50px;
  }
}
</style>