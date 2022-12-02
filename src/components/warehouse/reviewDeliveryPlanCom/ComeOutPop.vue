<!-- ComeOutPop 出柜弹框 -->
<template>
  <div id="ComeOutPop">
    <el-dialog title="出柜" v-model="dialogVisible" width="90%" :close-on-click-modal="false" @close="closed" :close-on-press-escape="false">
      <div>
        <div class="display">
          <el-form :inline="true" size="mini" label-width="130px" :model="ruleForm"
            class="demo-form-inline el-from form">
            <el-form-item label="海柜号：">
              <el-input v-model.trim="ruleForm.overseasCabinetNum" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="请录入条形码:">
              <el-input v-model.trim="ruleForm.scanCabinetNum" :disabled="!ruleForm.overseasCabinetNum"
                @keyup.enter="boxNumEnter" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-form>
          <el-button size="mini" type="primary" @click="uploadFile" :disabled="btnFlag">上传文件</el-button>
        </div>

        <div class="table-title">
          <span>总箱数：{{ totalCases }}</span>
          <span>已装箱:{{ boxedNum }}</span>
          <span>未装箱：{{ unBoxedNum }}</span>
          <span>其他柜号箱：{{ otherBoxedNum }}</span>
        </div>
        <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%" :header-cell-style="{
          background: '#fafafa',
          color: '#2d2f30',
          fontWeight: 'bold',
          fontSize: '12px',
        }">
          <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
          <el-table-column label="中转仓库" prop="transferWarehouse"></el-table-column>
          <el-table-column label="仓区" prop="purposeWarehouse"></el-table-column>
          <el-table-column label="序列号" prop="serialNum"></el-table-column>
          <el-table-column label="箱号" prop="cartonNum"></el-table-column>
          <el-table-column label="状态" prop="status">
            <template #default="scope">
              <span v-if="scope.row.status == 'already_sealing'">已装箱</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="70px">
            <template #default="scope">
              <el-button size="mini" type="text" @click="removePackCabinetCases(scope.row)">删除
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
          <el-button size="mini" @click="closed">取 消</el-button>
          <!-- <el-button size="mini" type="primary" @click="onSubmit" :disabled="btnFlag">确 定</el-button> -->
          <el-button size="mini" type="primary" @click="onSubmit" :disabled="btnFlag">确认出柜</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="上传文件" v-model="fileVisible" width="90%" :close-on-click-modal="false" @close="closedDialog" :close-on-press-escape="false">
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
          <el-button size="mini" @click="closedDialog">取 消</el-button>
          <el-button size="mini" type="primary" @click="onSubmitFile" :disabled="btnFlag">提 交</el-button>
        </span>
      </template>
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
  nextTick,
  inject,
  provide,
} from "vue";
import UploadVideos from "@/components/uploadFile/UploadVideos.vue";
import UploadImages from "@/components/uploadFile/UploadImages.vue";
export default {
  name: "ComeOutPop",
  components: { UploadVideos, UploadImages },
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
      ruleForm: {
        scanCabinetNum: "", //条形码
        overseasCabinetNum: "", //海外柜
        cabinetNum: "", //柜号
      },
      boxedNum: 0, //已装箱
      otherBoxedNum: 0, //其他柜号箱
      totalCases: 0, //总箱数
      unBoxedNum: 0, //未装箱
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
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;

    onBeforeMount(() => { });
    onMounted(() => { });
    const UploadVideosRef = ref();
    vue.$store.commit("setUploadFlag", true);
    //上传文件
    const uploadFile = () => {
      data.filsForm = {
        pictures: [],
        videos: [],
      };
      data.fileVisible = true;
      api.warehouse
        .getPath({ cabinetNum: data.ruleForm.cabinetNum })
        .then((res) => {
          if (res.code == 200) {
            data.fileVisible = true;
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
          } else {
            vue.$message.warning(res.msg);
          }
        });
    };
    //关闭上传文件弹窗
    const closedDialog = () => {
      data.fileVisible = false;
    };
    // 删除视频
    const removeVideoParent = (i) => {
      data.filsForm.videos.splice(i, 1);
    };

    provide("removeVideoParent", removeVideoParent);
    // upVideo 获取视频url
    const upVideo = (e) => {
      data.filsForm.videos.push(e);
    };
    // receive  获取图片url
    const receive = (e) => {
      data.filsForm.pictures.push(e);
    };
    // 删除图片
    const removeImg = (i) => {
      data.filsForm.pictures.splice(i, 1);
    };
    //submit提交"
    const onSubmitFile = () => {
      if (
        data.filsForm.pictures.length <= 0 ||
        data.filsForm.videos.length <= 0
      ) {
        vue.$message.warning("图片和视频最少各上传一个!");
        return;
      }
      const cabinetPhoto = [];
      data.filsForm.pictures.forEach((item) => {
        cabinetPhoto.push(item.picturePath);
      });
      const videoPath = [];
      data.filsForm.videos.forEach((item) => {
        videoPath.push(item.videoPath);
      });
      const info = reactive({
        cabinetNum: data.ruleForm.cabinetNum,
        cabinetPhoto: cabinetPhoto.join(","),
        videoPath: videoPath.join(","),
      });
      api.warehouse.submit(info).then((res) => {
        if (res.code == 200) {
          vue.$message.success(res.msg);
          data.fileVisible = false;
        } else {
          vue.$message.warning(res.msg);
        }
      });
    };

    //closed 关闭弹框
    const closed = () => {
      data.dialogVisible = false;
      data.ruleForm = {
        scanCabinetNum: "",
        overseasCabinetNum: "",
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
      data.unBoxedNum = 0;
      data.tableData = [];
    };

    //openLog 打开弹框
    const openLog = (row) => {
      data.ruleForm = {
        scanCabinetNum: "",
        overseasCabinetNum: "",
        cabinetNum: "",
      };
      data.tableData = [];
      data.tableInfo = {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      };
      data.boxedNum = 0;
      data.otherBoxedNum = 0;
      data.totalCases = 0;
      data.unBoxedNum = 0;
      data.ruleForm.cabinetNum = row.cabinetNum;
      data.dialogVisible = true;
      //查询列表数据
      getOutCabinetList({
        scanCabinetNum: data.ruleForm.scanCabinetNum,
        cabinetNum: data.ruleForm.cabinetNum,
        current: data.tableInfo.current,
        overseasCabinetNum: data.ruleForm.overseasCabinetNum,
        size: data.tableInfo.size,
      });
    };

    //删除已出柜箱子
    const removePackCabinetCases = (row) => {
      api.warehouse
        .removePackCabinetCases({ serialNum: row.serialNum })
        .then((res) => {
          if (res.code == 200) {
            vue.$message.success(res.msg);
            getOutCabinetList({
              current: data.tableInfo.current,
              cabinetNum: data.ruleForm.cabinetNum,
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
      data.tableInfo = {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      };
      getOutCabinetList({
        scanCabinetNum: data.ruleForm.scanCabinetNum,
        cabinetNum: data.ruleForm.cabinetNum,
        current: data.tableInfo.current,
        overseasCabinetNum: data.ruleForm.overseasCabinetNum,
        size: data.tableInfo.size,
      });
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
    const getTableList = inject("getTableList");
    //onSubmit 确定
    const onSubmit = () => {
      if (
        data.filsForm.pictures.length <= 0 ||
        data.filsForm.videos.length <= 0
      ) {
        vue.$message.warning("图片和视频最少各上传一个!");
        return;
      }
      let msg = {
        cabinetNum: data.ruleForm.cabinetNum,
        cases: data.tableData,
        casesNum: data.totalCases,
        otherCasesNum: data.otherBoxedNum,
        overseasCabinetNum: data.ruleForm.overseasCabinetNum,
        unboxed: data.unBoxedNum,
      };
      api.warehouse.outCabinet(msg).then((res) => {
        if (res.code == 200) {
          closed();
          getTableList({ current: 1, size: 10, type: 2 });
          vue.$message.success(res.msg);
        } else {
          vue.$message.warning(res.msg);
        }
      });
    };

    //handleCurrentChange  当前页发生变化
    const handleCurrentChangeFir = (val) => {
      data.tableInfo.current = val;
      getOutCabinetList({
        cabinetNum: data.ruleForm.cabinetNum,
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
      getTableList,
      uploadFile,
      UploadVideosRef,
      closedDialog,
      upVideo,
      receive,
      removeImg,
      onSubmitFile,
    };
  },
};
</script>
<style scoped lang="scss">
#ComeOutPop {
  .table-title {
    span {
      margin-left: 15px;
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

  .form {
    position: relative;
    left: -45px;
  }

  .UploadVideos {
    display: flex;

    >span {
      width: 100px;
      font-size: 14px;
    }
  }
}
</style>
