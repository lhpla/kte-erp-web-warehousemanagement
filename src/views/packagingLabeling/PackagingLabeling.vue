<template>
  <!-- 打包贴标 -->
  <div>
    <PackagingLabelingSearch
      v-model:tableData="tableData"
      v-model:productTotal="productTotal"
      v-model:count="count"
      v-model:pickingOrderNo="pickingOrderNo"
      v-model:scannedNum="scannedNum"
      v-model:scanningNum="scanningNum"
      v-model:notScanningNum="notScanningNum"
      v-model:isComplete="isComplete"
    ></PackagingLabelingSearch>
    <PackagingLabelingTable
      v-model:productTotal="productTotal"
      v-model:tableData="tableData"
      v-model:count="count"
      v-model:isComplete="isComplete"
      :pickingOrderNo="pickingOrderNo"
      :scannedNumber="scannedNum"
      :scanningNum="scanningNum"
      :notScanningNum="notScanningNum"
    ></PackagingLabelingTable>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import PackagingLabelingSearch from "@/components/warehouse/packagingLabelingSearch/PackagingLabelingSearch.vue";
import PackagingLabelingTable from "@/components/warehouse/packagingLabelingTable/PackagingLabelingTable.vue";

export default defineComponent({
  name: "packagingLabeling",
  components: {
    PackagingLabelingSearch,
    PackagingLabelingTable
  },
  setup() {
    const tableData = ref([]);
    // 产品总数
    const productTotal = ref(0);
    // 已扫描数量
    const count = ref(0);
    const pickingOrderNo = ref("");
    const scannedNum = ref(0);
    const scanningNum = ref(0);
    const notScanningNum = ref(0);
    const isComplete = ref(false);
    return {
      tableData,
      productTotal,
      count,
      pickingOrderNo,
      scannedNum,
      scanningNum,
      notScanningNum,
      isComplete
    };
  }
});
</script>

<style lang="scss" scoped></style>
