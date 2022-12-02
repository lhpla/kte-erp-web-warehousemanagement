<!-- ViewGeneratePlanLog 发货计划详情 -->
<template>
  <div id="ViewGeneratePlanLog">
    <el-dialog title="发货计划-查看" v-model="dialogVisible" width="90%" :close-on-click-modal="false" @close="closed"
      :close-on-press-escape="false">
      <div>
        <div class="display">
          <div class="titles">
            <div class="title-item" v-if="detail.shippingScheduleTransportation == 4">海柜号：{{ detail.overseasCabinetNum ?
                detail.overseasCabinetNum : "-"
            }}</div>
            <div class="title-item"
              v-if="detail.shippingScheduleTransportation == 1 || detail.shippingScheduleTransportation == 2">车牌号：{{
                  detail.numberPlate ?
                    detail.numberPlate : "-"
              }}</div>
            <div class="title-item">发货柜号：{{ detail.cabinetNums && detail.cabinetNums.length ?
                detail.cabinetNums.join(',')
                : "-"
            }}</div>
            <div class="title-item">总箱数：{{ detail.totalCasesNum != "" ? detail.totalCasesNum : "-" }}</div>
          </div>
          <!-- <el-button size="small" type="primary" @click="uploadFile" :disabled="btnFlag">出柜文件</el-button> -->
        </div>

        <div class="tags">
          <div class="tags-item">
            运输方式：
            <span>{{ detail.shippingScheduleTransportation ?
                tableTypeComputed(typeOfShippingList, detail.shippingScheduleTransportation) : "-"
            }}</span>
          </div>
          <div class="tags-item">
            起运港口：
            <span>{{ detail.startPort ? detail.startPort : "-" }}</span>
          </div>
          <div class="tags-item" v-if="detail.shippingScheduleTransportation == 4">
            目的港口：
            <span>{{ detail.endPort ? detail.endPort : "-" }}</span>
          </div>
          <div class="tags-item" v-if="detail.shippingScheduleTransportation == 4">
            清关港口：
            <span>{{ detail.clearancePort ? detail.clearancePort : "-" }}</span>
          </div>
          <div class="tags-item">
            预计运费：
            <span>{{ detail.freight ? detail.freight : '-' }}&nbsp;
              {{ detail.freight ? detail.freightCurrey : "" }}</span>
          </div>
          <div class="tags-item">
            预计税金：
            <span> {{ detail.estimateTaxAmount ? detail.estimateTaxAmount : "-" }}&nbsp;
              {{ detail.estimateTaxAmount ? detail.estimateCurrey : "" }}</span>
          </div>
        </div>
        <div class="table-box">
          <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%" :header-cell-style="{
            background: '#fafafa',
            color: '#2d2f30',
            fontWeight: 'bold',
            fontSize: '12px',
          }">
            <!-- @selection-change="handleSelectionChange" -->
            <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
            <el-table-column align="center" label="柜号" prop="cabinetNum"></el-table-column>
            <el-table-column align="center" label="中转仓库" prop="transferWarehouse"></el-table-column>
            <el-table-column align="center" label="仓区" prop="purposeWarehouse"></el-table-column>
            <el-table-column align="center" label="SKU" prop="sku"></el-table-column>
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
            <el-table-column align="center" label="体积（m³）" prop="totalVolume">
              <template #default="scope">
                <span>{{ scope.row.totalVolume ? scope.row.totalVolume : "-" }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="重量（kg）">
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
          <el-pagination class="log-pagination" background @size-change="handleSizeChange"
            @current-change="handleCurrentChange" :current-page="dataInfo.current" :page-sizes="[10, 25, 50, 100]"
            :page-size="dataInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="dataInfo.total">
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
    <FileDialog ref="FileDialogRef"></FileDialog>
    <!-- 图片弹框 -->
    <PreviewImageLog ref="PreviewImageLog"></PreviewImageLog>
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
import PreviewImageLog from "./PreviewImageLog.vue";
import FileDialog from "./FileDialog.vue";
import { localGet } from "@/utils/util";
export default {
  name: "ViewGeneratePlanLog",
  components: { PreviewImageLog, FileDialog },
  setup(prop, ctx) {
    const data = reactive({
      btnFlag: false,
      dialogVisible: false,
      tableData: [],

      filsForm: {
        pictures: [],
        videos: [],
      },
      tableLoading: false,
      dataInfo: {
        total: 5,
        size: 10,
        current: 1,
      },
      sku: "",
      detail: {},
      shippingId: "",
      typeOfShippingList: [],
      serviceProviderList: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      data.typeOfShippingList = localGet("purchaseDict")
        .seceiving_shipping
        ? localGet("purchaseDict").seceiving_shipping
        : [];
      data.serviceProviderList = localGet("purchaseDict")
        .logistics_service
        ? localGet("purchaseDict").logistics_service
        : [];
    });

    //openLog 打开弹框
    const openLog = (e) => {
      data.shippingId = e.shippingId
      getDetails();
      data.dialogVisible = true;
    };
    //上传文件
    const uploadFile = () => {
      data.filsForm = {
        pictures: [],
        videos: [],
      };
      api.warehouse
        .getPathWarehouseShipping({ shippingId: data.shippingId })
        .then((res) => {
          if (res.code == 200) {
            nextTick(() => {
              if (res.data.cabinetPhoto) {
                const pictures = res.data.cabinetPhoto.split(",");
                pictures.forEach((item) => {
                  data.filsForm.pictures.push({ picturePath: item });
                });
              } else {
                data.filsForm.pictures = [];
              }
              if (res.data.videoPath) {
                const videos = res.data.videoPath.split(",");
                videos.forEach((item) => {
                  data.filsForm.videos.push({ videoPath: item });
                });
              } else {
                data.filsForm.pictures = [];
              }
              console.log("data.filsForm", data.filsForm);
            });
            vue.$refs.FileDialogRef.openDialog(data.filsForm);
          } else {
            vue.$message.warning(res.msg);
          }
        });
    }
    //获取详情api
    const getDetails = (current) => {
      data.tableLoading = true;
      data.tableData = []
      let msg = {
        shippingId: data.shippingId,
        size: data.dataInfo.size,
        current: 1,
      }
      msg.current = current ? current : msg.current
      api.warehouse
        .viewShippingDetailsCabinetNumberListDetails(msg)
        .then((res) => {
          if (res.code == 200) {
            data.detail = res.data;
            if (res.data.caseSkuDetailsVo.records) {
              data.tableData = res.data.caseSkuDetailsVo.records;
              data.tableData.map(item => {
                item.totalVolume = item.totalVolume == -1 ? "" : item.totalVolume
                // item.differenceValue = item.differenceValue == -1 ? "" : item.differenceValue
              })
              data.dataInfo.total = res.data.caseSkuDetailsVo.total;
              data.dataInfo.size = res.data.caseSkuDetailsVo.size;
              data.dataInfo.current = res.data.caseSkuDetailsVo.current;
            }
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

    //openPreviewImage 图片弹框
    const openPreviewImage = () => {
      vue.$refs.PreviewImageLog.openLog();
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
      data.filsForm = {
        pictures: [],
        videos: [],
      }
    };

    //搜索SKU
    const searchSku = () => {
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

    const refData = toRefs(data);
    return {
      ...refData,
      closed,
      openLog,
      handleCurrentChange,
      handleSizeChange,
      openPreviewImage,
      getDetails,
      searchSku,
      tableTypeComputed,
      uploadFile,
    };
  },
};
</script>
<style scoped lang="scss">
#ViewGeneratePlanLog {
  .display {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .titles {
    display: flex;

    .title-item {
      margin-right: 50px;
      font-size: 20px;
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
