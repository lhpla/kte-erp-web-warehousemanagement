<!-- 添加柜号 -->
<template>
  <div id="AddCabinetPop">
    <el-dialog title="添加柜号" v-model="dialogVisible" width="90%" :close-on-click-modal="false" @close="closed"
      :modal="false" :close-on-press-escape="false">
      <el-form :model="formParam" label-width="80px" :inline="true"  class="demo-form-inline">
        <el-form-item label="中转仓库:" prop="transferWarehouseId">
          <el-select v-model="formParam.transferWarehouseId"  filterable clearable placeholder="请选择"
            @change="search" multiple>
            <el-option v-for="item in transitWarehouseList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="柜号:" prop="cabinetNumber" class="SearchPanel-form-item">
          <el-input v-model="formParam.cabinetNumber" clearable placeholder="请输入" maxlength="100" @keyup.enter="search">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="search">搜 索</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%;margin-bottom:0"
        :header-cell-style="{
          background: '#fafafa',
          color: '#2d2f30',
          fontWeight: 'bold',
          fontSize: '12px',
        }">
        <el-table-column align="center" label="柜号" prop="cabinetNum"></el-table-column>
        <el-table-column align="center" prop="transferWarehouse">
          <template #header>
            <div style="display: flex; align-items:center;justify-content: center;">
              <span>中转仓库</span>
              <el-tooltip class="item" effect="light" content="不能同时选择宁波和东莞的仓库">
                <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="仓区" prop="purposeWarehouse"></el-table-column>
        <el-table-column align="center" label="总体积（m³）" prop="totalVolume"></el-table-column>
        <el-table-column align="center" label="总箱数" prop="totalCasesNum"></el-table-column>
        <el-table-column align="center" label="SKU种类数" prop="skuTypeNum"></el-table-column>
        <el-table-column align="center" label="SKU总数(个)" prop="totalSkuNum"></el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button type="primary" text  @click="changeType(scope.row.type, scope.$index)"
              v-if="!scope.row.type">选择
            </el-button>
            <el-button type="primary" text  @click="changeType(scope.row.type, scope.$index)"
              v-if="scope.row.type">取消选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>


      <template #footer>
        <div class="dialog-footer ">
          <div class="pagination">
            <el-pagination class="log-pagination" background @size-change="handleSizeChangeLog"
              @current-change="handleCurrentChangeLog" :current-page="pageableLog.current" :page-sizes="[5, 10, 25, 50]"
              :page-size="pageableLog.size" layout="total, sizes, prev, pager, next, jumper" :total="pageableLog.total">
            </el-pagination>
          </div>
          <span class="">
            <el-button @click="closed" size="small" :disabled="btnLoading" :loading="btnLoading">取 消</el-button>
            <el-button type="primary" @click="onSubmit" :disabled="btnLoading" :loading="btnLoading" size="small">确 认
            </el-button>
          </span>
        </div>

      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from 'vue';
export default {
  name: 'AddCabinetPop',
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      formParam: {
        transferWarehouseId: [],
        cabinetNumber: ''
      },
      tableData: [],
      btnLoading: false,
      //中转仓库列表
      transitWarehouseList: [],
      selectList: [],
      tableLoading: false,
      searchMsg: {
        transferWarehouseId: [],
        cabinetNumber: '',
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      },
      pageableLog: {
        current: 1,
        size: 10,
        total: 10,
      },
      parentInfo: {
        warehouseArea: '',
        transportMode: '',
      }
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { })
    onMounted(() => { })
    const refData = toRefs(data);

    const getTableData = (msg) => {
      data.tableLoading = true;
      data.searchMsg = msg || data.searchMsg;
      let info = {};
      if (data.searchMsg) {
        info = data.searchMsg;
        info.purposeWarehouseId = data.parentInfo.warehouseArea
        info.transportMode = data.parentInfo.transportMode

      }
      api.warehouse
        .getCabinetByInitiatePlan(info)
        .then((res) => {
          if (res.code == 200) {
            data.tableData = res.data.records;
            handleType(res.data.records)
            data.pageableLog.current = res.data.current;
            data.pageableLog.size = res.data.size;
            data.pageableLog.total = res.data.total;
            data.tableLoading = false;
          } else {
            data.tableLoading = false;
          }
        })
        .catch((err) => {
          data.tableLoading = false;
        });
    };
    //当列表数据重新获取时，重新判断是否被选择
    const handleType = (newList) => {
      for (let newListItem of newList) {
        newListItem.type = false
        data.selectList.map((searchItem) => {
          if (newListItem.id == searchItem.id) {
            newListItem.type = true
          }
        })
      }
      data.tableData = JSON.parse(JSON.stringify(newList))
    }
    //打开弹窗
    const getMsg = vo => {
      data.tableData = []
      data.parentInfo.transportMode = vo.transportMode
      data.parentInfo.warehouseArea = vo.warehouseArea
      // 中转仓
      api.warehouse.selectTransitWarehouse().then(res => {
        if (res.code == 200) {
          data.transitWarehouseList = res.data;
        }
      });
      data.selectList = JSON.parse(JSON.stringify(vo.tableData))
      data.dialogVisible = true;
      getTableData()
    }
    //搜索
    const search = () => {
      const info = {
        cabinetNum: data.formParam.cabinetNumber ? data.formParam.cabinetNumber : '',
        transferWarehouseIds: data.formParam.transferWarehouseId,
        isize: data.pageableLog.size,
        current: 1,
      }
      data.tableData = []
      getTableData(info)
    }
    //确定
    const onSubmit = () => {
      if (data.selectList.length) {
        let arr = ref([])
        let str = ref("")
        data.selectList.forEach(item => {
          const arrItem = ref("")
          str.value = item.transferWarehouse.substring(0, 2)
          arrItem.value = arr.value.find((i) => {
            return i == str.value
          })
          if (!arrItem.value) {
            arr.value.push(str.value)
          }
        })
        console.log('arr.value', arr.value);
        if (arr.value.length > 1) {
          vue.$message.warning('不同中转仓的柜子不能发起同一个计划')
          return
        }
      }
      vue.$emit('clickFu', data.selectList)
      closed()
    }

    //切换状态
    const changeType = (type, index) => {
      if (type) {//切换为取消选择
        data.tableData[index].type = false
        for (let i = 0; i <= data.selectList.length - 1; i++) {
          if (data.tableData[index].id == data.selectList[i].id) {
            data.selectList.splice(i, 1)

          }
        }
      } else {//切换为选择
        data.tableData[index].type = true
        if (data.selectList.length == 0) {
          data.selectList.push(data.tableData[index])
          return
        }
        for (let i = 0; i <= data.selectList.length - 1; i++) {
          if (data.tableData[index].id == data.selectList[i].id) {
            return false
          } else if (data.tableData[index].id != data.selectList[i].id && i == data.selectList.length - 1) {
            data.selectList.push(data.tableData[index])
          }
        }
      }
    }
    //closed 关闭弹框
    const closed = () => {
      data.dialogVisible = false;
      data.formParam = {
        transferWarehouseId: [],
        cabinetNumber: ''
      },
        data.searchMsg = {
          transferWarehouseId: [],
          cabinetNumber: '',
          current: 1, // 当前页为 1
          size: 10, // 每页10条
        }
    };

    // 日志每页条数发生改变
    const handleSizeChangeLog = val => {
      data.pageableLog.size = val;
      let info = data.searchMsg;
      info.size = data.pageableLog.size;
      data.searchMsg = info;
      getTableData(data.searchMsg);
    };
    // 日志当前页发生改变
    const handleCurrentChangeLog = val => {
      data.pageableLog.current = val;
      let info = data.searchMsg;
      info.current = data.pageableLog.current;
      data.searchMsg = info;
      getTableData(data.searchMsg);
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

  :deep(.el-dialog__header) {
    margin-right: 0;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    //   position: absolute;
    //   bottom: 0;
    //   right: 200px;
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

    margin: 20px 10px;
  }
}
</style>