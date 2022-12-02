<!-- 签收表格 -->
<template>
  <div id="SignForListTable">
    <el-table v-loading="tableLoading" :data="tableData" height="calc(100vh - 230px)" border style="width: 100%"
      :header-cell-style="{
        background: '#fafafa',
        color: '#2d2f30',
        fontWeight: 'bold',
        fontSize: '12px',
      }">
      <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
      <el-table-column label="物流号" prop="logisticsNum">
        <template #default="scope">
          {{ scope.row.logisticsNum ? scope.row.logisticsNum : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="PO号" prop="orderCode">
        <template #default="scope">
          {{ scope.row.orderCode ? scope.row.orderCode : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="签收批次号" prop="receiptBatchNum">
        <template #default="scope">
          {{ scope.row.receiptBatchNum ? scope.row.receiptBatchNum : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="签收箱数" prop="casesNum">
        <template #default="scope">
          {{ scope.row.casesNum ? scope.row.casesNum : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="质检" prop="isCheck">
        <template #default="scope">
          <span>
            {{ scope.row.isCheck ? '是' : '否' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="采购员" prop="buyer">
        <template #default="scope">
          {{ scope.row.buyer ? scope.row.buyer : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="签收员" prop="signerName">
        <template #default="scope">
          {{ scope.row.signerName ? scope.row.signerName : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="操作" align="center" min-width="70px">
        <template #default="scope">
          <el-button size="small" type="primary" text v-if="buttonAuthor.view" @click="openView(scope.row)">
            查看
          </el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <SignForListDetail ref="SignForListDetail"></SignForListDetail>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from 'vue'
import authorButtons from '@/compositionApi/authorButtons'
import SignForListDetail from './SignForListDetail.vue'
export default {
  name: 'SignForListTable',
  props: ['tableData', 'tableLoading'],
  components: { SignForListDetail },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons()
    const buttonAuthor = BUTTONS.value
    const data = reactive({})
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    onBeforeMount(() => { })
    onMounted(() => { })
    const refData = toRefs(data)
    // 查看
    const openView = (row) => {
      let msg = {
        isQuality: false,
        logisticsNum: row.logisticsNum,
        orderCode: row.orderCode,
      }
      vue.$refs.SignForListDetail.getMsg(msg)
    }
    return {
      ...refData,
      buttonAuthor,
      openView,
    }
  },
}
</script>
<style scoped lang="scss">

</style>
