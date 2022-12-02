<!-- 调拨异常详情 -->
<template>
  <div id="AllocatingAbnormalInfo">
    <el-dialog title="调拨异常详情" width="55%" v-model="infoDialog" :close-on-click-modal="false" destroy-on-close :close-on-press-escape="false">
      <vxe-table align="center" :data="infotable" border
        :header-row-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px', }"
        style="width: 100%" max-height="400" ref="table" :loading="loading">
        <vxe-column field="sku" title="SKU"></vxe-column>
        <!--待确认，调拨仓为直发仓 -->
        <vxe-column v-if="type == true && status == 0" field="startLocation" title="调拨库位">
          <template #default="scope">
            {{ scope.row.startLocation ? scope.row.startLocation : '-' }}
          </template>
        </vxe-column>
        <vxe-column v-if="!(type == true && status == 0)" field="startCabinetNum" title="调拨柜号">
          <template #default="scope">
            {{ scope.row.startCabinetNum ? scope.row.startCabinetNum : '-' }}
          </template>
        </vxe-column>
        <vxe-column v-if="!(type == true && status == 0)" field="startCartonNum" title="调拨箱号">
          <template #default="scope">
            {{ scope.row.startCartonNum ? scope.row.startCartonNum : '-' }}
          </template>
        </vxe-column>
        <vxe-column field="transferNum" title="调拨数量">
          <template #default="scope">
            {{ scope.row.transferNum !== '' ? scope.row.transferNum : '-' }}
          </template>
        </vxe-column>
        <vxe-column field="abnormalNum" title="异常数量">
          <template #default="scope">
            {{ scope.row.abnormalNum !== '' ? scope.row.abnormalNum : '-' }}
          </template>
        </vxe-column>
        <!--已确认  调拨仓为直发-->
        <vxe-column v-if="type === true && status == 1" field="endLocation" title="退回库位">
          <template #default="scope">
            {{ scope.row.endLocation ? scope.row.endLocation : '-' }}
          </template>
        </vxe-column>
        <!--已确认，调拨仓为中转 -->
        <vxe-column v-if="type === false && status == 1" field="endCabinetNum" title="退回柜号">
          <template #default="scope">
            {{ scope.row.endCabinetNum ? scope.row.endCabinetNum : '-' }}
          </template>
        </vxe-column>
        <vxe-column v-if="type === false && status == 1" field="startCartonNum" title="退回箱号">
          <template #default="scope">
            {{ scope.row.endCartonNum ? scope.row.endCartonNum : '-' }}
          </template>
        </vxe-column>
        <vxe-column v-if="type === false && status == 1" field="name7" title="箱子尺寸(CM)">
          <template #default="scope">
            {{ `${scope.row.length}*${scope.row.width}*${scope.row.height}` }}
          </template>
        </vxe-column>
      </vxe-table>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from 'vue';
export default {
  name: 'allocatingAbnormalInfo',
  setup(prop, ctx) {
    const data = reactive({
      infoDialog: false,
      infotable: [],
      type: true,
      status: 0,
      loading: false,
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { })
    onMounted(() => { })
    const refData = toRefs(data);
    // 打开loading
    const checkStorageDialog = (row) => {
      data.type = row.isDirect;
      data.status = row.status;
      data.infoDialog = true;
      getInfo(row.transferCode);
    };
    //获取详情
    const getInfo = (id) => {
      data.loading = true;
      api.requisitionManagement.getTransferAbnormalDetail({ transferCode: id }).then((res) => {
        if (res.code == 200) {
          data.infotable = res.data;
          data.loading = false;
        } else {
          data.loading = false;
          vue.$message.warning(res.msg);
        }
      })
    }
    return {
      ...refData,
      checkStorageDialog,
    }
  }
};
</script>
<style scoped lang='scss'>
#AllocatingAbnormalInfo {
  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>