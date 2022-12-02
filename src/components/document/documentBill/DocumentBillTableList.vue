<!-- DocumentBillTableList 单证账单列表表格 -->
<template>
  <div id="DocumentBillTableList">
    <div class="table-box">
      <div class="table-header">
        <el-button type="primary" size="mini" @click="generatePaymentPlan">生成付款计划</el-button>
      </div>
    </div>
    <el-table
      height="calc(100vh - 310px)"
      :data="tableData"
      v-loading="tableLoading"
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="index" align="center" label="#" min-width="40"></el-table-column>
      <el-table-column label="头程单号" prop=""></el-table-column>
      <el-table-column label="柜号" prop="">
        <template #default="scope">{{ scope }}12</template>
      </el-table-column>
      <el-table-column label="服务商" prop="">
        <template #default="scope">{{ scope }}谷仓</template>
      </el-table-column>
      <el-table-column label="中转仓" prop="">
        <template #default="scope">{{ scope }}中转仓:宁波</template>
      </el-table-column>
      <el-table-column label="目的仓" prop="">
        <template #default="scope">{{ scope }}目的仓:美西</template>
      </el-table-column>
      <el-table-column label="资料发送时间" prop="">
        <template #default="scope">{{ scope }}2021.10.19 10:22:21</template>
      </el-table-column>
      <el-table-column label="税金" prop="">
        <template #default="scope">
          <div>预估:230.00 EUR{{ scope }}</div>
          <div>实际:230.00 EUR{{ scope }}</div>
        </template>
      </el-table-column>
      <el-table-column label="运费" prop="">
        <template #default="scope">
          <div>预估:230.00 EUR{{ scope }}</div>
          <div>实际:230.00 EUR{{ scope }}</div>
          <div>预估:230.00 EUR{{ scope }}</div>
        </template>
      </el-table-column>
      <el-table-column label="其他费用" prop="">
        <template #default="scope">
          <div>批次1:222.00 USD{{ scope }}</div>
          <div>批次2:222.00 USD{{ scope }}</div>
          <div>批次3:222.00 USD{{ scope }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="90" prop="">
        <template #default="scope">
          <div>税金:已上传{{ scope }}</div>
          <div>运费:状态详情</div>
          <div>其他:状态详情</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120" align="center">
        <template #default="scope">
          <el-button size="mini" icon="el-icon-user" type="text" @click="selectDocLog(scope.row)">日志</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
import authorButtons from "@/compositionApi/authorButtons";
// import { download, localGet } from "@/utils/util";

export default {
  name: "DocumentBillTableList",
  props: ["tableData", "tableLoading"],
  components: {},
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      selectList: [], //被选中list
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});

    // 日志
    const selectDocLog = e => {};

    // 生成付款计划
    const generatePaymentPlan = () => {
      let flag = data.selectList.every(item => {
        return item.status == "驳回" || item.status == "已上传";
      });
      if (flag) {
        //进行付款计划生成
      } else {
        vue.$message.warning("仅已上传或驳回状态可生成付款计划！");
      }
    };

    // 列表选中list
    const handleSelectionChange = val => {
      data.selectList = val;
    };

    const refData = toRefs(data);
    return {
      ...refData,
      buttonAuthor,
      selectDocLog,
      generatePaymentPlan,
      handleSelectionChange,
    };
  },
};
</script>
<style scoped lang='scss'>
#DocumentBillTableList {
}
</style>
