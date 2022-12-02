<!-- 查看出柜数据 -->
<template>
  <div id="CheckOutData">
    <el-dialog :title="'柜号' + cabinetNum" v-model="dialogVisible" width="90%" :close-on-click-modal="false" @close="closed" :close-on-press-escape="false">
      <div>
        <div class="table-title">
          <span>总箱数：{{ totalCases }}</span>
          <span>已装箱:{{ boxedNum }}</span>
          <span>未装箱：{{ unBoxedNum }}</span>
          <span>其他柜号箱：{{ otherBoxedNum }}</span>
        </div>
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          border
          style="width: 100%"
          :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
        >
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
        </el-table>
        <div class="paging">
          <!-- 分页 -->
          <el-pagination
            class="log-pagination"
            background
            @size-change="handleSizeChangeFir"
            @current-change="handleCurrentChangeFir"
            :current-page="dataInfo.current"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="dataInfo.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dataInfo.total"
          ></el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
export default {
  name: "CheckOutData",
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      boxedNum: 0, //已装箱
      otherBoxedNum: 0, //其他柜号箱
      totalCases: 0, //总箱数
      unBoxedNum: 0, //未装箱
      tableLoading: false,
      tableData: [],
      dataInfo: {
        total: 0,
        size: 10,
        current: 1
      },
      tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10 // 每页10条
      },
      btnFlag: false,
      cabinetNum: ""
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;

    onBeforeMount(() => { });
    onMounted(() => { });

    //closed 关闭弹框
    const closed = () => {
      data.dialogVisible = false;
      data.tableInfo = {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10 // 每页10条
      };
      data.boxedNum = 0;
      data.otherBoxedNum = 0;
      data.totalCases = 0;
      data.unBoxedNum = 0;
      data.tableData = [];
    };

    //openLog 打开弹框
    const getMsg = cabinetNum => {
      data.cabinetNum = cabinetNum;
      data.tableData = [];
      data.tableInfo = {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10 // 每页10条
      };
      data.boxedNum = 0;
      data.otherBoxedNum = 0;
      data.totalCases = 0;
      data.unBoxedNum = 0;
      data.dialogVisible = true;
      //查询列表数据
      selectOutCabinetList({
        size: data.tableInfo.size,
        cabinetNum: data.cabinetNum
      });
    };

    //输入箱号
    const boxNumEnter = () => {
      data.tableInfo = {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10 // 每页10条
      };
      selectOutCabinetList({
        cabinetNum: data.cabinetNum,
        current: data.tableInfo.current,
        size: data.tableInfo.size
      });
    };

    //出柜列表
    const selectOutCabinetList = msg => {
      data.tableLoading = true;
      api.warehouse
        .selectOutCabinetList(msg)
        .then(res => {
          if (res.code == 200) {
            data.boxedNum = res.data.boxedNum;
            data.otherBoxedNum = res.data.otherBoxedNum;
            data.totalCases = res.data.totalCases;
            data.unBoxedNum = res.data.unBoxedNum;
            data.dataInfo.total = res.data.voIPage.total;
            data.dataInfo.size = res.data.voIPage.size;
            data.dataInfo.current = res.data.voIPage.current;
            data.tableData = res.data.voIPage.records;
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

    //handleCurrentChange  当前页发生变化
    const handleCurrentChangeFir = val => {
      data.tableInfo.current = val;
      selectOutCabinetList({
        cabinetNum: data.cabinetNum,
        current: data.tableInfo.current,
        size: data.tableInfo.size
      });
    };

    //handleSizeChange 每页多少条发生了变化
    const handleSizeChangeFir = val => {
      data.tableInfo.size = val;
      selectOutCabinetList({
        cabinetNum: data.cabinetNum,
        current: data.tableInfo.current,
        size: data.tableInfo.size
      });
    };

    const refData = toRefs(data);
    return {
      ...refData,
      getMsg,
      closed,
      handleCurrentChangeFir,
      handleSizeChangeFir,
      selectOutCabinetList,
      boxNumEnter
    };
  }
};
</script>
<style scoped lang="scss">
#CheckOutData {
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

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
