<!-- 柜号查看详情 一级详情弹框 FirstDetailsPop -->
<template>
  <div id="FirstDetailsPop">
    <el-dialog title="详情" v-model="dialogVisible" width="90%" :close-on-click-modal="false" @close="closed"
      destroy-on-close :close-on-press-escape="false">
      <div>
        <div class="titles">
          <div class="title-item">柜号：{{ detail.cabinetNums && detail.cabinetNums.length ?
              detail.cabinetNums.join(',') : "-"
          }}</div>
          <div class="title-item">SKU总种类：{{ detail.skuKind }}</div>
          <div class="title-item">SKU总数：{{ detail.skuNum }}</div>
          <div class="title-item">箱数：{{ detail.boxNum }}</div>
          <div class="title-item">总体积：{{ detail.totalVolume }}m³</div>
        </div>
        <div style="margin-top: 20px">
          <div>
            <span>SKU：</span>
            <el-input  style="width: 200px" v-model="sku" clearable placeholder="请输入" @keyup.enter="search"
              maxlength="500"></el-input>
            <span style="margin-left: 20px;">箱号：</span>
            <el-input  style="width: 200px" v-model="cartonNum" clearable placeholder="请输入"
              @keyup.enter="search" maxlength="500"></el-input>
            <el-button type="primary" style="margin-left: 20px" size="small" @click="search">搜 索</el-button>

          </div>
          <div style="margin-top: 20px;">
            <el-button type="primary" size="small" @click="printBoxLabel">打印箱标
            </el-button>
            <el-button type="primary" size="small" @click="cabinetExcelExport">导出柜号数据
            </el-button>
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
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
            <el-table-column align="center" label="中转仓库" prop="transferWarehouse"></el-table-column>
            <el-table-column align="center" label="仓区" prop="purposeWarehouse"></el-table-column>
            <el-table-column align="center" label="SKU" prop="sku"></el-table-column>
            <el-table-column align="center" label="箱号" prop="cartonNum"></el-table-column>
            <el-table-column align="center" label="序列号" prop="serialNum"></el-table-column>
            <el-table-column align="center" label="长(cm)" prop="length"></el-table-column>
            <el-table-column align="center" label="宽(cm)" prop="width"></el-table-column>
            <el-table-column align="center" label="高(cm)" prop="height"></el-table-column>
            <el-table-column align="center" label="体积（m³）" prop="totalVolume"></el-table-column>
            <el-table-column align="center" label="重量（kg）" prop="weight"></el-table-column>
            <el-table-column align="center" label="数量(个)" prop="encasementNum"></el-table-column>
          </el-table>
        </div>
        <div class="paging">
          <!-- 分页 -->
          <el-pagination class="" background @size-change="handleSizeChangeFir" @current-change="handleCurrentChangeFir"
            :current-page="dataInfo.current" :page-sizes="[10, 20, 50, 100]" :page-size="dataInfo.size"
            layout="total, sizes, prev, pager, next, jumper" :total="dataInfo.total"
            style="position: absolute;bottom: 0!important;">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
    <!-- 图片弹框 -->
    <!-- <PreviewImageLog ref="PreviewImageLog"></PreviewImageLog> -->
    <!-- 查看出柜数据 -->
    <CheckOutData ref="CheckOutData"></CheckOutData>
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
} from "vue";
// import PreviewImageLog from "./PreviewImageLog.vue";
import CheckOutData from "./CheckOutData.vue";
import { getLodop } from "@/utils/LodopFuncs";
import { download } from "@/utils/util";
export default {
  name: "FirstDetailsPop",
  components: {
    // PreviewImageLog, 
    CheckOutData
  },
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      btnFlag: false,
      tableLoading: false,
      tableData: [],
      selectList: [],
      //搜索条件
      sku: "",
      cartonNum: "",
      //柜号
      cabinetNum: "",
      dataInfo: {
        total: 0,
        size: 10,
        current: 1,
      },
      secondTitle: "",
      detail: {},
      serviceProviderList: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
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
    //表格选择
    const handleSelectionChange = (val) => {
      data.selectList = val
    }
    //openLog 打开弹框
    const openLog = (e) => {
      data.dialogVisible = true;
      data.cabinetNum = e.cabinetNum
      getFirstTable();
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
    const getFirstTable = (current) => {
      data.tableData = []
      data.tableLoading = true;
      let msg = {
        cabinetNum: data.cabinetNum,
        size: data.dataInfo.size,
        current: 1,
        sku: data.sku,
        cartonNum: data.cartonNum
      };
      msg.current = current ? current : msg.current
      api.warehouse
        .viewCabinetNumberListDetails(msg)
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

    //closed 关闭弹框
    const closed = () => {
      data.dialogVisible = false;
      data.sku = "";
      data.cartonNum = "";
      data.detail = {};
      data.tableData = [];
    };
    //Print 打印
    const print = (row) => {
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
          cabinetNum: row.cabinetNum,
          madeInChina: true,
          cartonNum: row.cartonNum,
        })
        .then((res) => {
          if (res.code == 200) {
            vue.$printFn(LODOP, res.data, "pdf");
          } else {
            vue.$message.warning(res.msg);
          }
        });
    };
    //openPreviewImage 图片弹框
    // const openPreviewImage = () => {
    //   vue.$refs.PreviewImageLog.openLog(data.detail.cabinetPhoto);
    // };

    //handleCurrentChange  当前页发生变化
    const handleCurrentChangeFir = (val) => {
      data.dataInfo.current = val;
      getFirstTable(val);
    };

    //handleSizeChange 每页多少条发生了变化
    const handleSizeChangeFir = (val) => {
      data.dataInfo.size = val;
      getFirstTable();
    };

    //search 搜索
    const search = () => {
      getFirstTable();
    };

    //导出柜号数据
    const cabinetExcelExport = () => {
      api.warehouse
        .cabinetExcelExport({ cabinetNum: data.cabinetNum })
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

    //查看出柜数据
    // const checkOut = () => {
    //   vue.$refs.CheckOutData.getMsg(data.detail.cabinetNum);
    // };

    const refData = toRefs(data);
    return {
      ...refData,
      closed,
      openLog,
      handleCurrentChangeFir,
      handleSizeChangeFir,
      search,
      // openPreviewImage,
      tableTypeComputed,
      cabinetExcelExport,
      // checkOut,
      print,
      printBoxLabel,
      handleSelectionChange
    };
  },
};
</script>
<style scoped lang="scss">
#FirstDetailsPop {
  position: relative;

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
    min-height: 350px;
    margin-top: 30px;
  }

  ::v-deep .el-dialog {
    margin-top: 10vh !important;
  }

  .paging {
    // margin-top: 50px;
    position: static;
    bottom: 0;
    height: 50px;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
