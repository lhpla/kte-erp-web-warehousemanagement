<!-- 订单出货弹框 -->
<template>
  <div>
    <el-dialog v-model="dialogVisible" width="50%" title="复核产品" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-table :data="productData" border style="width: 100%" :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }">
        <el-table-column prop="pricturePath" align="center" label="图片" min-width="150">
          <template #default="scope">
            <el-popover placement="right" trigger="hover" width="250" v-if="scope.row.pricturePath">
              <template #reference>
                <el-image style="width: 180px; height: 95px" fit="contain" :src="scope.row.pricturePath"></el-image>
              </template>
              <el-image :src="scope.row.pricturePath" style="width: 400px; height: 300px" fit="contain"></el-image>
            </el-popover>
            <div v-else>暂无图片</div>
          </template>
        </el-table-column>
        <el-table-column label="SKU" prop="sku">
          <template #default="scope">
            <div>{{ scope.row.sku }}</div>
          </template>
        </el-table-column>
        <el-table-column label="产品数量" prop="quantity"></el-table-column>
        <el-table-column prop="quantity" label="已扫描数"></el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="submit" :disabled="submitActive"  @keyup.enter="submit" :loading="submitActive" size="mini">确 定</el-button>
          <el-button @click="closed" size="mini">取 消</el-button>
          
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
export default {
  name: "ProductDetail",
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      productData: [],
      inventoryData: [],
      inventoryVisible: false,
      submitActive: false
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    //打开弹窗
    const getMsg = row => {
      console.log('row',row);
      data.productData = row.list
      data.dialogVisible = true;
      data.inventoryVisible = false;
    };
    // 订单出货提交
    const submit = () => {
      data.dialogVisible = false;
      data.productData = []
    }
    const closed = () => {
        data.dialogVisible = false
        data.productData = []
    };
    return {
      ...refData,
      getMsg,
      submit,
      closed
    };
  },
};
</script>
<style scoped lang='scss'>

</style>