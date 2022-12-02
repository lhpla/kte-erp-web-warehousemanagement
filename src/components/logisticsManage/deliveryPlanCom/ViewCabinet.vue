<!-- ViewCabinet 查看柜子 -->
<template>
  <div id="ViewCabinet">
    <el-dialog title="柜子-查看" v-model="dialogVisible" width="90%" :close-on-click-modal="false" @close="closed" :close-on-press-escape="false">
      <div>
        <div class="display">
          <div class="titles">
            <div class="title-item">柜号：{{ detail.cabinetNums && detail.cabinetNums.length ?
                detail.cabinetNums.join(',') : "-"
            }}</div>
            <div class="title-item">SKU总种类：{{ detail.skuKind ? detail.skuKind : "-" }}</div>
            <div class="title-item">SKU总数：{{ detail.skuNum ? detail.skuNum : "-" }}</div>
            <div class="title-item">箱数：{{ detail.boxNum ? detail.boxNum : "-" }}</div>
            <div class="title-item">
              总体积：{{ detail.totalVolume ? detail.totalVolume : "-" }} m³
            </div>
          </div>
        </div>
        <div class="buttonStyle">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="SKU:">
              <el-input v-model="formInline.sku"  maxlength="100" @keyup.enter="search" />
            </el-form-item>
            <el-form-item label="箱号：">
              <el-input v-model="formInline.cartonNum"  maxlength="100" @keyup.enter="search" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search" size="small">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-button type="primary" size="small" @click="cabinetExcelExport">导出柜号数据
          </el-button>
          <el-button size="small" @click="printBoxLabel" :loading="btnFlag" :disabled="btnFlag" type="primary">
            <span>打印箱标</span>
            <el-tooltip content="康特恩入库箱标" placement="bottom" effect="light">
              <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
            </el-tooltip>
          </el-button>
          <el-button size="small" @click="print" :loading="btnFlag" :disabled="btnFlag||detail.headerAttribute==3" type="primary">
            <span>打印箱唛</span>
            <el-tooltip content="谷仓箱唛" placement="bottom" effect="light">
              <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
            </el-tooltip>
          </el-button>
        </div>
        <div class="table-box">
          <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%"
            @selection-change="handleSelectionChange" :header-cell-style="{
              background: '#fafafa',
              color: '#2d2f30',
              fontWeight: 'bold',
              fontSize: '12px',
            }">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
            <el-table-column align="center" label="中转仓库" prop="transferWarehouse"></el-table-column>
            <el-table-column align="center" label="仓区" prop="purposeWarehouse"></el-table-column>
            <el-table-column align="center" label="SKU" prop="sku"></el-table-column>
            <el-table-column align="center" label="SKU申报名称" prop="declareCname"></el-table-column>
            <el-table-column align="center" label="PO号" prop="orderCode"></el-table-column>
            <el-table-column align="center" label="箱号" prop="cartonNum"></el-table-column>
            <el-table-column align="center" label="长（cm）" prop="length"></el-table-column>
            <el-table-column align="center" label="宽（cm）" prop="width"></el-table-column>
            <el-table-column align="center" label="高（cm）" prop="height"></el-table-column>
            <!-- <el-table-column align="center" label="尺寸">
              <template #default="scope">
                <span>{{
                    `${Number(scope.row.length).toFixed(2)}x${Number(
                      scope.row.width
                    ).toFixed(2)}x${Number(scope.row.height).toFixed(2)}`
                }}</span>
              </template>
            </el-table-column> -->
            <el-table-column align="center" label="体积(m³)" prop="totalVolume"></el-table-column>
            <el-table-column align="center" label="重量(kg)">
              <template #default="scope">
                <span>{{ Number(scope.row.weight).toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="发货数量（个）" prop="encasementNum"></el-table-column>
            <el-table-column align="center" label="海外上架数量（个）" prop="barnShelfNumStr">
              <template #header>
                <div style="display: flex; align-items:center;justify-content: center;">
                  <span>海外上架数量（个）</span>
                  <el-tooltip class="item" effect="light" content="海外仓未上架的入库单没有数据信息">
                    <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="差异值（个）" prop="differenceValue">
              <template #header>
                <div style="display: flex; align-items:center;justify-content: center;">
                  <span>差异值（个）</span>
                  <el-tooltip class="item" effect="light" content="海外仓未上架的入库单没有数据信息">
                    <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="paging">
          <!-- 分页 -->
          <el-pagination class="" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="dataInfo.current" :page-sizes="[10, 25, 50, 100]" :page-size="dataInfo.size"
            style="position: absolute; " layout="total, sizes, prev, pager, next, jumper" :total="dataInfo.total">
          </el-pagination>
        </div>
      </div>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="closed" :loading="btnFlag" :disabled="btnFlag">取 消</el-button>
          <el-button size="small" type="primary" @click="onSubmit" :loading="btnFlag" :disabled="btnFlag">确 定</el-button>
        </span>
      </template> -->
    </el-dialog>
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
  nextTick,
} from "vue";
import { localGet, download } from "@/utils/util";
import { getLodop } from "@/utils/LodopFuncs";
export default {
  name: "ViewCabinet",
  setup(prop, ctx) {
    const data = reactive({
      btnFlag: false,
      dialogVisible: false,
      tableData: [],
      tableLoading: false,
      dataInfo: {
        total: 5,
        size: 10,
        current: 1,
      },
      sku: "",
      detail: {},
      formInline: {
        sku: "",
        cartonNum: ""
      },
      currentRow: {},
      cabinetNum: "",
      shippingId: "",
      serviceProviderList: [],
      selectList: []
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });

    //openLog 打开弹框
    const openLog = (e) => {
      data.currentRow = e;
      data.sku = "";
      data.dialogVisible = true;
      data.cabinetNum = e.cabinetNum;
      data.shippingId = e.shippingId;
      getDetails();
    };
    //获取详情api
    const getDetails = (current) => {
      data.tableLoading = true;
      data.tableData = []
      let msg = {
        cabinetNum: data.currentRow.cabinetNum,
        shippingId: data.currentRow.shippingId,
        size: data.dataInfo.size,
        current: 1,
        sku: data.formInline.sku,
        cartonNum: data.formInline.cartonNum,
      };
      msg.current = current ? current : msg.current
      api.warehouse
        .viewShippingCabinetNumberListDetails(msg)
        .then((res) => {
          if (res.code == 200) {
            data.tableData = res.data.caseSkuDetailsVo.records;
            data.dataInfo.total = res.data.caseSkuDetailsVo.total;
            data.dataInfo.size = res.data.caseSkuDetailsVo.size;
            data.dataInfo.current = res.data.caseSkuDetailsVo.current;
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
    const closed = () => {
      data.dialogVisible = false;
      data.detail = {};
      data.tableData = []
      data.currentRow = {};
      data.formInline = {
        sku: "",
        cartonNum: ""
      }
    };
    const handleSelectionChange = (val) => {
      data.selectList = val
    }
    //搜索SKU
    const search = () => {
      getDetails();
    };

    //handleCurrentChange  当前页发生变化
    const handleCurrentChange = (val) => {
      data.dataInfo.current = val;
      getDetails(val);
    };

    //handleSizeChange 每页多少条发生了变化
    const handleSizeChange = (val) => {
      data.dataInfo.size = val;
      getDetails();
    };
    //导出柜号数据
    const cabinetExcelExport = () => {
      api.warehouse
        .cabinetExcelExport({ cabinetNum: data.currentRow.cabinetNum })
        .then((res) => {
          let tempName = "柜号数据";
          let fileType = ".xlsx";
          const blob = new Blob([res], {
            // type: "application/msword;charset=UTF-8",
          });
          if ("msSaveOrOpenBlob" in navigator) {
            window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
            return;
          }
          const blobUrl = window.URL.createObjectURL(blob);
          download(blobUrl, tempName, fileType);
        });
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
          cabinetNum: data.currentRow.cabinetNum,
          cartonNum: cartonNum,
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
          let obj = {
            cartonNum: item.cartonNum,
            encasementNum: item.encasementNum,
            num: 1,
            sku: "200-" + item.sku,
            warehouse:
              item.transferWarehouse.indexOf("TS") != -1
                ? item.purposeWarehouse + "-TS"
                : item.purposeWarehouse,
            cabinetNum: item.cabinetNum,
            drawback: item.isDrawback ? "是" : "-",
            isPhoto: item.isPhotograph ? "【拍照】" : "",
          };
          datas.push(obj);
        }
        vue.$printFn(LODOP, datas, "cartonNum");
      }
    }

    const refData = toRefs(data);
    return {
      ...refData,
      closed,
      openLog,
      handleCurrentChange,
      handleSizeChange,
      getDetails,
      search,
      tableTypeComputed,
      handleSelectionChange,
      printBoxLabel,
      print,
      cabinetExcelExport
    };
  },
};
</script>
<style scoped lang="scss">
#ViewCabinet {
  .display {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .buttonStyle {
    margin-top: 30px;
  }

  .titles {
    display: flex;

    .title-item {
      margin-right: 50px;
      font-size: 24px;
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

  .serachSku {
    height: 28px;
    display: flex;
    align-items: center;
    margin-top: 20px;

    .el-input {
      width: 200px !important;
      margin: 0 10px;

      .el-input__inner {
        height: 28px !important;
      }
    }
  }

  .log-pagination {
    // position: relative !important;
    // width: 420px;
    // left: calc(100% - 500px);
  }

  .table-box {
    min-height: 350px;
    margin-top: 50px;
  }

  .paging {
    margin-top: 50px;
    position: relative;
    height: 50px;
    display: flex;
    justify-content: flex-end;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
