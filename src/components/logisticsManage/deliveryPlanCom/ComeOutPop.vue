<!-- ComeOutPop 出柜弹框 -->
<template>
  <div id="ComeOutPop">
    <el-dialog title="发货计划-出柜" v-model="dialogVisible" width="90%" :close-on-click-modal="false" @close="closed"
      :close-on-press-escape="false">
      <div>
        <div class="display">
          <div style="display: flex;">
            <el-form :inline="true" ref="overseasCabinetNumForm" label-width="100px" :model="ruleForm" :rules="rules"
              class="demo-form-inline el-from " hide-required-asterisk @submit.native.prevent>
              <el-form-item label="录入海柜号" prop="overseasCabinetNum" v-if="shippingTransport == 4">
                <el-input v-model.trim="ruleForm.overseasCabinetNum" placeholder="请输入" clearable maxlength="100">
                </el-input>
              </el-form-item>
              <el-form-item label="录入车牌号" prop="numberPlate" v-if="shippingTransport == 1 || shippingTransport == 2">
                <el-input v-model.trim="ruleForm.numberPlate" placeholder="请输入" clearable maxlength="100">
                </el-input>
              </el-form-item>
            </el-form>
            <el-form :inline="true" ref="scanCabinetNumTopForm" label-width="130px" :model="ruleForm"
              :rules="scanCabinetNumRules" class="demo-form-inline el-from " hide-required-asterisk
              @submit.native.prevent>
              <el-form-item label="请录入条形码:" prop="scanCode">
                <el-input v-model.trim="ruleForm.scanCode" @keyup.enter="boxNumEnter" placeholder="请输入" clearable
                  maxlength="100"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-button size="small" type="primary" @click="importFile" :disabled="btnFlag" class="btn_class">导入装柜数据
            </el-button>
            <!-- <el-button size="small" type="primary" @click="uploadFile" :disabled="btnFlag" class="btn_class">上传文件
            </el-button> -->
          </div>
        </div>
        <div class="table-title">
          <span>发货柜号：{{ shipCabinetNums ? shipCabinetNums : "-" }}</span>
          <span>总箱数：{{ totalCases }}</span>
          <span>已装箱：{{ boxedNum }}</span>
          <span>未装箱：{{ unBoxedNum }}</span>
          <span>其他柜号箱：{{ otherBoxedNum }}</span>
        </div>
        <el-button size="small" type="primary" :disabled="btnFlag" @click="removePackCabinetCases('batch')"
          style="margin-bottom: 10px;">
          批量删除
        </el-button>
        <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%"
          @selection-change="handleSelectionChange" :header-cell-style="{
            background: '#fafafa',
            color: '#2d2f30',
            fontWeight: 'bold',
            fontSize: '12px',
          }">
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
          <el-table-column label="柜号" prop="cabinetNum"></el-table-column>
          <el-table-column label="中转仓库" prop="transferWarehouse"></el-table-column>
          <el-table-column label="仓区" prop="purposeWarehouse"></el-table-column>
          <el-table-column label="SKU" prop="skus"></el-table-column>
          <el-table-column label="数量" prop="encasementNum"></el-table-column>
          <el-table-column label="序列号" prop="serialNum"></el-table-column>
          <el-table-column label="箱号" prop="cartonNum"></el-table-column>
          <el-table-column label="状态" prop="status">
            <template #default="scope">
              {{ tableTypeComputed(warehouseCasesStatusList, scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="70px">
            <template #default="scope">
              <el-button size="small" type="primary" text :disabled="btnFlag"
                @click="removePackCabinetCases('one', scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="paging">
          <!-- 分页 -->
          <el-pagination class="log-pagination" background @size-change="handleSizeChangeFir"
            @current-change="handleCurrentChangeFir" :current-page="dataInfo.current" :page-sizes="[10, 25, 50, 100]"
            :page-size="dataInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="dataInfo.total">
          </el-pagination>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="closed">取 消</el-button>
          <!-- <el-button size="small" type="primary" @click="onSubmit" :disabled="btnFlag">确 定</el-button> -->
          <el-button size="small" type="primary" @click="onSubmit" :disabled="btnFlag">确认出柜</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- <el-dialog title="上传文件" v-model="fileVisible" width="90%" :close-on-click-modal="false" @close="closedDialog">
      <div class="UploadVideos">
        <span>上传视频：</span>
        <UploadVideos ref="UploadVideosRef" @clickV="upVideo" :fileList="filsForm.videos" :imgLimit="videosLimit"
          :sizeLimit="5"></UploadVideos>
      </div>
      <div class="UploadVideos">
        <span>上传图片：</span>
        <UploadImages ref="UploadImages" @clickFu="receive" @clickRI="removeImg" :fileList="filsForm.pictures"
          :imgLimit="imgLimit"></UploadImages>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="closedDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="onSubmitFile" :disabled="btnFlag">提 交</el-button>
        </span>
      </template>
    </el-dialog> -->
    <MarkLess ref="MarkLessRef" @checkLess="checkLess"></MarkLess>
    <AllDown ref="AllDownRef" title="装柜-导入装柜数据"></AllDown>
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
  nextTick,
  inject,
  provide,
  computed

} from "vue";
// import UploadVideos from "@/components/uploadFile/UploadVideos.vue";
// import UploadImages from "@/components/uploadFile/UploadImages.vue";
import MarkLess from "./MarkLess.vue";
import AllDown from "./AllDown.vue"
import { localGet } from '@/utils/util'
export default {
  name: "ComeOutPop",
  components: { MarkLess, AllDown },
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      fileVisible: false,
      videosLimit: 4,
      imgLimit: 9,
      filsForm: {
        pictures: [],
        videos: [],
      },
      selectList: [],
      ruleForm: {
        scanCode: "", //条形码
        overseasCabinetNum: "", //海外柜
        numberPlate: "",
        cabinetNum: "", //柜号
        shippingId: ""
      },
      scanCabinetNumRules: { scanCode: [{ required: true, message: '条形码不能为空', trigger: 'blur' }] },
      rules: {
        overseasCabinetNum: [
          { required: true, message: '该运输方式海柜号不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let reg = /^[A-Z]{4}\d{7}$/;
              if (!reg.test(value)) {
                callback(new Error("海柜号格式为4位英文大写字母、7位数字"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        numberPlate: [{ required: true, message: '该运输方式车牌号不能为空', trigger: 'blur' }]
      },
      boxedNum: 0, //已装箱
      otherBoxedNum: 0, //其他柜号箱
      totalCases: 0, //总箱数
      unBoxedNum: 0, //未装箱
      shipCabinetNums: "",//发货柜号
      shippingTransport: "",//运输方式
      tableLoading: false,
      tableData: [],
      dataInfo: {
        total: 0,
        size: 10,
        current: 1,
      },
      tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      },
      btnFlag: false,
      warehouseCasesStatusList: []
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;

    onBeforeMount(() => { });
    onMounted(() => { });
    // const UploadVideosRef = ref();
    //导入装柜数据
    const importFile = () => {
      let info = {
        title: "装柜数据导入模板",
        temp: "warehouseOutCabinetExcel",
        import: "importWarehouseOutCabinetExcel",
        fail: "downloadFailedImport",
        servers: "warehouse",
        updateData: {
          current: data.tableInfo.current,
          cabinetNum: data.ruleForm.cabinetNum,
          shippingId: data.ruleForm.shippingId,
          overseasCabinetNum: data.ruleForm.overseasCabinetNum,
          size: data.tableInfo.size,
        },
        shippingId: data.ruleForm.shippingId
      };
      nextTick(() => {
        vue.$refs.AllDownRef.checkDialog(true, info)
      })
    }
    vue.$store.commit("setUploadFlag", true);
    //checkbox变化
    const handleSelectionChange = (val) => {
      data.selectList = val
    }
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
    //closed 关闭弹框
    const closed = () => {
      data.dialogVisible = false;
      data.ruleForm = {
        scanCode: "",
        overseasCabinetNum: "",
        numberPlate: "",
        cabinetNum: "",
      };
      data.tableInfo = {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      };
      data.boxedNum = 0;
      data.otherBoxedNum = 0;
      data.totalCases = 0;
      data.shipCabinetNums = ""
      data.unBoxedNum = 0;
      data.tableData = [];
      vue.$refs.scanCabinetNumTopForm.clearValidate();
      vue.$refs.overseasCabinetNumForm.clearValidate();
    };
    provide('closedDialog', closed)
    //openLog 打开弹框
    const openLog = (row) => {
      data.ruleForm = {
        scanCode: "",
        overseasCabinetNum: "",
        numberPlate: "",
        cabinetNum: "",
        shippingId: ""
      };
      data.warehouseCasesStatusList = localGet("purchaseDict")
        .warehouse_cases_status
        ? localGet("purchaseDict").warehouse_cases_status
        : [];
      data.tableData = [];
      data.tableInfo = {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      };
      data.boxedNum = 0;
      data.otherBoxedNum = 0;
      data.totalCases = 0;
      data.shipCabinetNums = ""
      data.unBoxedNum = 0;
      data.shippingTransport = row.shippingTransport
      data.ruleForm.cabinetNum = row.cabinetNum;
      data.ruleForm.shippingId = row.shippingId;
      data.dialogVisible = true;
      //查询列表数据
      getOutCabinetList({
        scanCode: data.ruleForm.scanCode,
        cabinetNum: data.ruleForm.cabinetNum,
        current: data.tableInfo.current,
        overseasCabinetNum: data.ruleForm.overseasCabinetNum,
        size: data.tableInfo.size,
        shippingId: data.ruleForm.shippingId
      });
      // getPathWarehouseShipping()
    };

    //删除已出柜箱子
    const removePackCabinetCases = (flag, row) => {
      let info = ref([])
      if (flag == 'batch') {
        if (data.selectList.length) {
          data.selectList.map(vo => {
            info.value.push(vo.serialNum)
          })
        } else {
          vue.$message.warning('请选择数据')
          return false
        }
      } else {
        info.value = [row.serialNum]
      }
      api.warehouse
        .removePackCabinetCases(info.value)
        .then((res) => {
          if (res.code == 200) {
            getOutCabinetList({
              current: data.tableInfo.current,
              cabinetNum: data.ruleForm.cabinetNum,
              shippingId: data.ruleForm.shippingId,
              overseasCabinetNum: data.ruleForm.overseasCabinetNum,
              size: data.tableInfo.size,
            });
          } else {
            vue.$message.warning(res.msg);
          }
        });
    };
    //输入箱号
    const boxNumEnter = () => {
      vue.$refs.scanCabinetNumTopForm.validate(f => {
        if (f) {
          data.tableInfo = {
            // 要传给后台的数据
            current: 1, // 当前页为 1
            size: 10, // 每页10条
          };
          getOutCabinetList({
            scanCode: data.ruleForm.scanCode,
            cabinetNum: data.ruleForm.cabinetNum,
            shippingId: data.ruleForm.shippingId,
            current: data.tableInfo.current,
            overseasCabinetNum: data.ruleForm.overseasCabinetNum,
            size: data.tableInfo.size,
          });
        }
      })

    };

    //出柜列表
    const getOutCabinetList = (msg) => {
      data.tableLoading = true;
      api.warehouse
        .getOutCabinetList(msg)
        .then((res) => {
          if (res.code == 200) {
            data.boxedNum = res.data.boxedNum;
            data.otherBoxedNum = res.data.otherBoxedNum;
            data.totalCases = res.data.totalCases;
            data.shipCabinetNums = res.data.shipCabinetNums.join(',');
            data.unBoxedNum = res.data.unBoxedNum;
            data.dataInfo.total = res.data.voIPage.total;
            data.dataInfo.size = res.data.voIPage.size;
            data.dataInfo.current = res.data.voIPage.current;
            data.tableData = res.data.voIPage.records;
            data.ruleForm.overseasCabinetNum = res.data.overseasCabinetNum
              ? res.data.overseasCabinetNum
              : "";
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
    provide('getDataList', getOutCabinetList)
    const getTableData = inject("getTableData");
    //onSubmit 确定
    const onSubmit = () => {
      // if (
      //   data.filsForm.pictures.length <= 0 ||
      //   data.filsForm.videos.length <= 0
      // ) {
      //   vue.$message.warning("图片和视频最少各上传一个!");
      //   return;
      // }
      vue.$refs.overseasCabinetNumForm.validate(valid => {
        if (valid) {
          let msg = {
            overseasCabinetNum: data.ruleForm.overseasCabinetNum,
            numberPlate: data.ruleForm.numberPlate,
            shipCabinetNums: data.shipCabinetNums.split(','),
            shippingId: data.ruleForm.shippingId,
            totalCases: data.totalCases,
            boxedNum: data.boxedNum,
            unBoxedNum: data.unBoxedNum,
            otherBoxedNum: data.otherBoxedNum,
            current: 1,
            size: 10
          };
          checkLess(msg)
        }
      })
    };
    //减货列表
    const checkLess = (msg) => {
      data.btnFlag = true
      api.warehouse.checkLess(msg).then((res) => {
        if (res.code == 200) {
          getTableData()
          if (res.data.records.length) {
            vue.$refs.MarkLessRef.getMsg(res.data, msg, data.shippingTransport, data.ruleForm.numberPlate)
          } else {
            vue.$message.success(res.msg)
            closed();
          }
        } else {
          vue.$message.warning(res.msg);
        }
        data.btnFlag = false
      }).catch(() => {
        data.btnFlag = false
      })
    }
    //handleCurrentChange  当前页发生变化
    const handleCurrentChangeFir = (val) => {
      data.tableInfo.current = val;
      getOutCabinetList({
        cabinetNum: data.ruleForm.cabinetNum,
        shippingId: data.ruleForm.shippingId,
        current: data.tableInfo.current,
        overseasCabinetNum: data.ruleForm.overseasCabinetNum,
        size: data.tableInfo.size,
      });
    };

    //handleSizeChange 每页多少条发生了变化
    const handleSizeChangeFir = (val) => {
      data.tableInfo.size = val;
      getOutCabinetList({
        cabinetNum: data.ruleForm.cabinetNum,
        shippingId: data.ruleForm.shippingId,
        current: data.tableInfo.current,
        overseasCabinetNum: data.ruleForm.overseasCabinetNum,
        size: data.tableInfo.size,
      });
    };

    const refData = toRefs(data);
    return {
      ...refData,
      openLog,
      closed,
      onSubmit,
      handleCurrentChangeFir,
      handleSizeChangeFir,
      getOutCabinetList,
      removePackCabinetCases,
      boxNumEnter,
      getTableData,
      // uploadFile,
      // UploadVideosRef,
      // closedDialog,
      // upVideo,
      // receive,
      // removeImg,
      // onSubmitFile,
      tableTypeComputed,
      checkLess,
      importFile,
      handleSelectionChange
    };
  },
};
</script>
<style scoped lang="scss">
#ComeOutPop {
  .btn_class {
    position: relative;
    top: -8px;
  }

  .table-title {
    span {
      margin-right: 15px;
      font-size: 15px;
      line-height: 50px;
      font-weight: bold;
    }
  }

  .paging {
    margin-top: 50px;
    height: 50px;
  }

  .display {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }



  .UploadVideos {
    display: flex;

    >span {
      width: 100px;
      font-size: 14px;
    }
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
