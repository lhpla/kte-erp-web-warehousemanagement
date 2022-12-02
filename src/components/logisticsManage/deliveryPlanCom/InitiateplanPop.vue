<!-- 发起发货计划 -->
<template>
  <div id="InitiateplanPop">
    <el-dialog title="发起计划" v-model="dialogVisible" width="90%" :close-on-click-modal="false" @close="closed" :close-on-press-escape="false">
      <el-form :model="formParam" ref="searchForm" label-width="100px"  class="demo-form-inline"
        :rules="rules">
        <el-form-item label="仓区:" prop="warehouseArea">
          <el-select v-model="formParam.warehouseArea"  filterable clearable placeholder="请选择"
            @change="conditionChange">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运输方式:" prop="transportMode">
          <el-select v-model="formParam.transportMode" filterable @change="conditionChange">
            <el-option v-for="item in ChannelList" :key="item.dizKey" :label="item.value" :value="item.dizKey">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="box">
          <div class="label"> <span style="color: red;padding-right: 5px;font-size:14px">*</span ><span style="font-size:14px">发货柜号:</span></div>
          <div class="table">
            <el-table :data="formParam.tableData" border :header-cell-style="{
              background: '#fafafa',
              color: '#2d2f30',
              fontWeight: 'bold',
              fontSize: '12px',
            }">
              <el-table-column align="center" label="柜号" prop="cabinetNum"></el-table-column>
              <el-table-column align="center" label="中转仓库" prop="transferWarehouse"></el-table-column>
              <el-table-column align="center" label="仓区" prop="purposeWarehouse"></el-table-column>
              <el-table-column align="center" label="总体积(m³)" prop="totalVolume"></el-table-column>
              <el-table-column align="center" label="总箱数" prop="totalCasesNum"></el-table-column>
              <el-table-column align="center" label="SKU种类数" prop="skuTypeNum"></el-table-column>
              <el-table-column align="center" label="SKU总数(个)" prop="totalSkuNum"></el-table-column>
              <el-table-column align="center">
                <template #header>
                  <el-button type="primary" size="small" @click="addCabinet">添 加</el-button>
                </template>
                <template #default="scope">
                  <el-button size="small" type="primary" text @click="delRow(scope.$index)">移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closed" size="small" :disabled="btnLoading" :loading="btnLoading">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="btnLoading" :loading="btnLoading" size="small">确 认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加柜号 -->
    <AddCabinetPop ref="AddCabinetPop" @clickFu="changeTable"></AddCabinetPop>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick, inject } from 'vue';
import { localGet } from "@/utils/util";
import AddCabinetPop from "./AddCabinetPop.vue";
export default {
  name: 'InitiateplanPop',
  components: {
    AddCabinetPop
  },
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      btnLoading: false,
      //仓区
      warehouseAreaList: [],
      ChannelList: [],
      rules: {
        warehouseArea: [{ required: true, message: "请选择仓区", trigger: "change" }],
        transportMode: [{ required: true, message: "请选择运输方式", trigger: "change" }],
      },
      formParam: {
        warehouseArea: '',
        transportMode: 'sea_tran',
        tableData: [],
      }
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { })
    onMounted(() => { })
    const refData = toRefs(data);

    const getTableData = inject("getTableData");
    //closed 关闭弹框
    const closed = () => {
      data.formParam = {
        warehouseArea: '',
        transportMode: 'sea_tran',
        tableData: [],
      }
      vue.$refs.searchForm.clearValidate();
      data.dialogVisible = false;
    };
    //openLog 打开弹框
    const openLog = () => {
      // 仓区
      api.warehouse.selectPurposeWarehouse().then(res => {
        if (res.code == 200) {
          data.warehouseAreaList = res.data;
        }
      });
      //运输方式
      data.purchaseDict = localGet("purchaseDict") ? localGet("purchaseDict") : [];
      data.ChannelList = data.purchaseDict.transportation_type ? data.purchaseDict.transportation_type : [];
      data.dialogVisible = true;
      nextTick(() => {
        vue.$refs.searchForm.clearValidate();
      })
    };

    //onSubmit 确认
    const onSubmit = () => {
      if (data.formParam.tableData.length == 0) {
        vue.$message.warning('请添加发货柜号,最少选择一个柜子')
        return
      }
      data.btnLoading = true;
      const info = data.formParam.tableData
      api.warehouse
        .confirmInitiationOfShippingPlan(info)
        .then((res) => {
          if (res.code == 200) {
            data.btnLoading = false;
            getTableData();
            closed();
          } else {
            vue.$message({
              dangerouslyUseHTMLString: true,
              type: 'warning',
              message: `<div style="max-width:500px;word-warp:break-word;word-break:break-all">${res.msg}</div>`
            })
            data.btnLoading = false;
          }
        }).catch(() => {
          data.btnLoading = false;
        })
    };
    //搜索条件变化后，清空已选择数据
    const conditionChange = () => {
      data.formParam.tableData = []
    }
    //添加柜号
    const addCabinet = () => {
      vue.$refs.searchForm.validate((valid) => {
        if (valid) {
          nextTick(() => {
            vue.$refs.AddCabinetPop.getMsg(data.formParam)
          })
        }
      })

    }

    //移除
    const delRow = index => {
      data.formParam.tableData.splice(index, 1)
    }
    const changeTable = (list) => {
      data.formParam.tableData = list
    }
    return {
      ...refData,
      openLog,
      closed,
      onSubmit,
      addCabinet,
      delRow,
      changeTable,
      conditionChange
    }
  }
};
</script>
<style scoped lang='scss'>
#InitiateplanPop {
  .box {
    display: flex;

    .table {
      width: 90%;
    }

    .label {
      width: 100px;
      text-align: end;
      padding-right: 8px;
      white-space: nowrap;
    }
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  } 

}
</style>