<!-- 调拨箱号 -->
<template>
  <div id="transfersNOPop">
    <el-dialog title="调拨箱号数据" v-model="dialogVisible" width="60%" :close-on-click-modal="false" @close="closedPop"
      destroy-on-close :close-on-press-escape="false">
      <el-form :model="formParam" ref="searchFormRef" label-width="120px" :inline="true" 
        class="demo-form-inline" :rules="rules">
        <el-form-item label="中转仓库:" prop="transferWarehouse" class="SearchPanel-form-item">
          <span>{{ transferWarehouseInfo.name ? transferWarehouseInfo.name : '-' }}</span>
        </el-form-item>
        <el-form-item label="仓区:" prop="purposeWarehouseId">
          <el-select v-model="formParam.purposeWarehouseId" disabled filterable clearable placeholder="请选择">
            <el-option v-for="item in purposeWarehouseList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="cabinetNum" class="SearchPanel-form-item">
          <template #label>
            <span style="display: inline-block;">
              <span style="display: flex; align-items:center;">
                <span>柜号 </span>
                <el-tooltip class="item" effect="light" content="新增对应仓的柜号">
                  <i class="el-icon-circle-plus-outline" @click="add"
                    :style="`color:${formParam.purposeWarehouseId ? '#409eff' : ''}`"></i>
                </el-tooltip>
                <span> :</span>
              </span>
            </span>
          </template>
          <el-select v-model="formParam.cabinetNum"  filterable clearable placeholder="请选择"
            :disabled="!formParam.purposeWarehouseId">
            <el-option v-for="item in cabinetNumList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>

        </el-form-item>
      </el-form>
      <TablePagination :tableData="tableData" layout="total, prev, pager,sizes, next, jumper">
        <template #column>
          <el-table-column align="center" label="箱号" prop="cartonNum" width="80"></el-table-column>
          <el-table-column align="center" label="SKU" prop="">
            <template #default="scope">
              <div v-for="(item) in scope.row.skuVo">
                {{ item.sku }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="数量" prop="" width="80">
            <template #default="scope">
              <div v-for="(item) in scope.row.skuVo">
                {{ item.encasementNum }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="尺寸">
            <template #default="scope">
              <span>{{
              `${scope.row.length}x${scope.row.width}x${scope.row.height}`
              }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="序列号" prop="serialNum"></el-table-column>
          <el-table-column align="center" label="操作" prop="weight">
            <template #default="scope">
              <span class="delete" @click="deleteRow(scope.row.cartonNum)">移除</span>
            </template>
          </el-table-column>
        </template>
      </TablePagination>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closedPop" :loading="submitActive" :disabled="submitActive" size="small">取 消</el-button>
          <el-button type="primary" @click="submit" :loading="submitActive" :disabled="submitActive" size="small">确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, computed, inject } from "vue";
import { localGet } from "@/utils/util";
import TablePagination from "@/components/tablePagination/TablePagination"
export default {
  name: "transfersNOPop",
  components: { TablePagination },
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      tableData: [],
      submitActive: false,
      formParam: {},
      //中转仓库列表
      purposeWarehouseList: [],
      cabinetNumList: [],
      purposeWarehouseInfo: {},
      rules: {
        purposeWarehouseId: { required: true, message: '请选择仓区', trigger: 'change' },
        cabinetNum: { required: true, message: '请选择柜号', trigger: 'change' },
      },
      transferWarehouseInfo: {},
      newCabinetNums: '',
      addShow: true,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      data.cabinet_abnormal_status = localGet("purchaseDict") && localGet("purchaseDict").cabinet_abnormal_status ? localGet("purchaseDict").cabinet_abnormal_status : [];
    });
    const refData = toRefs(data);
    const getTableData = inject("getTableData");
    const closed = inject("closed");
    const getFirstTable = inject('getFirstTable')
    //openLog 打开弹框
    const openLog = (e, obj) => {
      data.tableData = JSON.parse(JSON.stringify(e));
      data.purposeWarehouseInfo = obj
      data.formParam.purposeWarehouseId = obj.purposeWarehouseId
      data.dialogVisible = true;
      ///查询买单仓
      api.warehouseManagement.selectBuyPosition({ id: data.purposeWarehouseInfo.transferWarehouseId, shippingId: data.purposeWarehouseInfo.shippingId }).then(res => {
        if (res.code == 200) {
          data.transferWarehouseInfo = res.data
        // 仓区
          api.system.getWareHouseList({ type: 0 }).then(res => {
            if (res.code == 200) {
              data.purposeWarehouseList = res.data;
              search()
            }
          });
        }
      });

    };
    //移除某一项
    const deleteRow = (cartonNum) => {
      data.tableData.map((item, index) => {
        if (item.cartonNum == cartonNum) {
          data.tableData.splice(index, 1)
        }
      })
    }
    //根据所选仓区获取当前柜号
    const search = () => {
      if (data.formParam.cabinetNum) {
        data.formParam.cabinetNum = ''
      }
      let msg = {
        purposeWarehouseId: data.formParam.purposeWarehouseId,
        transferWarehouseId: data.transferWarehouseInfo.id,
        transportMode: data.purposeWarehouseInfo.shippingScheduleTransportation
      }
      api.warehouse.getCabinetNumList(msg).then((res) => {
        if (res.code == 200) {
          data.cabinetNumList = res.data.cabinetNums;
          data.newCabinetNums = res.data.newCabinetNums;
        } else {
          vue.$message.warning(res.msg)
          data.cabinetNumList = []
        }
      });
      // api.warehouse.selectCabinetNum(msg).then(res => {
      //   if (res.code == 200) {
      //     console.log(res)
      //     data.cabinetNumList = res.data
      //   } else {
      //     vue.$message.warning(res.msg)
      //     data.cabinetNumList = []
      //   }
      // })
    }
    //添加柜号
    const add = () => {
      if (!data.addShow || !data.formParam.purposeWarehouseId) return
      if (data.newCabinetNums) {
        data.cabinetNumList.push(data.newCabinetNums);
        data.formParam.cabinetNum = data.newCabinetNums;
        vue.$message.success(`新增柜号${data.newCabinetNums}成功`);
      } else {
        vue.$message.warning(`新增柜号失败`);
      }
      data.addShow = false;
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
    //closed 关闭弹框
    const closedPop = () => {
      data.dialogVisible = false;
      data.purposeWarehouseInfo = {}
      data.transferWarehouseInfo = {}
      data.tableData = [];
      data.formParam = {};
      data.newCabinetNums = ''
      data.addShow = true;
    };

    //确定调拨
    const submit = () => {
      if (data.tableData.length) {
        vue.$refs.searchFormRef.validate((valid) => {
          if (valid) {
            data.submitActive = true;
            let vo = {
              abnormalId: data.purposeWarehouseInfo.id,
              boxNums: [],
              cabinetNum: data.purposeWarehouseInfo.cabinetNum,
              newCabinetNum: data.formParam.cabinetNum,
              purposeWarehouse: "",
              purposeWarehouseId: data.formParam.purposeWarehouseId,
              transferWarehouse: data.transferWarehouseInfo.name,
              transferWarehouseId: data.transferWarehouseInfo.id,
              transportMode: data.purposeWarehouseInfo.shippingScheduleTransportation,
              serialNum: []
            }
            data.tableData.map(item => {
              vo.boxNums.push(item.cartonNum)
              vo.serialNum.push(item.serialNum)
            })
            api.warehouse.abnormalTransfer(vo).then(res => {
              if (res.code == 200) {
                data.submitActive = false;
                console.log(res)
                getTableData()
                getFirstTable()
                closedPop()
              } else {
                vue.$message.warning(res.msg)
                data.submitActive = false;
              }
            }).catch(e => {
              data.submitActive = false;
            })
          }
        })

      } else {
        vue.$message.warning('当前列表无可调拨数据！')
      }


    };

    return {
      ...refData,
      closed,
      openLog,
      tableTypeComputed,
      submit,
      closedPop,
      deleteRow,
      search,
      add
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

  .delete {
    color: #53a8ff;
    cursor: pointer;
  }

  .table-box {
    min-height: 350px;
    margin-top: 50px;
  }

  .paging {
    margin-top: 50px;
    height: 50px;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>