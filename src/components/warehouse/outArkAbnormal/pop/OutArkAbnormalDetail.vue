<!-- OutArkAbnormalDetail 出柜异常列表数据详情 -->
<template>
  <div id="OutArkAbnormalDetail">
    <el-dialog :title="'查看（' + title + '）'" v-model="dialogVisible" width="80%" :close-on-click-modal="false" @close="closed" :close-on-press-escape="false">
      <el-table
        :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
        :data="DetailTableData"
        tooltip-effect="dark"
        element-loading-text="加载中"
        v-loading="loading"
        border
      >
        <el-table-column label="#" type="index" align="center" width="100"></el-table-column>
        <el-table-column prop="sku" label="SKU"></el-table-column>
        <el-table-column prop="cartonNum" label="箱号"></el-table-column>
        <el-table-column prop="num" label="数量"></el-table-column>
        <el-table-column label="尺寸" prop="length">
          <template #default="scope">
            <span v-if="scope.row.length && scope.row.width && scope.row.height">{{ scope.row.length + "*" + scope.row.width + "*" + scope.row.height }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量（KG）"></el-table-column>
        <el-table-column prop="abnormalStatus" label="状态">
          <template #default="scope">
            <span>{{ scope.row.abnormalStatus ? tableTypeComputed(cabinet_abnormal_status, scope.row.abnormalStatus) : "-" }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="log-pagination"
        background
        @size-change="handleSizeChangeLog"
        @current-change="handleCurrentChangeLog"
        :current-page="pageLog.current"
        :page-sizes="[10, 25, 50, 100]"
        :page-size="pageLog.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageLog.total"
      ></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, computed } from "vue";
import { localGet } from "../../../../utils/util";
export default {
  name: "OutArkAbnormalDetail",
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      DetailTableData: [],
      loading: false,
      pageLog: {
        current: 1,
        size: 10,
        total: 0,
      },
      title: "",
      cabinet_abnormal_status: [], //状态字典
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});

    //openDetailLog 打开弹框
    const openDetailLog = e => {
      data.cabinet_abnormal_status = localGet("purchaseDict").cabinet_abnormal_status ? localGet("purchaseDict").cabinet_abnormal_status : [];
      data.dialogVisible = true;
      data.loading = true;
      data.title = e.transferWarehouse + "至" + e.purposeWarehouse + "" + e.cabinetNum + "柜";
      let msg = {
        abnormalId: e.abnormalId,
        id: e.id,
        current: data.pageLog.current,
        size: data.pageLog.size,
      };
      api.warehouse
        .warehouseAbnormalCases(msg)
        .then(res => {
          if (res.code == 200) {
            data.pageLog.current = res.data.current;
            data.pageLog.size = res.data.size;
            data.pageLog.total = res.data.total;
            data.DetailTableData = res.data.records;
            data.loading = false;
          } else {
            data.loading = false;
          }
        })
        .catch(err => {
          data.loading = false;
        });
    };

    //每页条数发生改变
    const handleSizeChangeLog = val => {
      data.pageLog.size = val;
      // openDetailLog();
    };
    // 当前页发生改变
    const handleCurrentChangeLog = val => {
      data.pageLog.current = val;
      // openDetailLog();
    };

    const closed = () => {
      data.dialogVisible = false;
      data.title = "";
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

    const refData = toRefs(data);
    return {
      ...refData,
      openDetailLog,
      handleCurrentChangeLog,
      handleSizeChangeLog,
      closed,
      tableTypeComputed,
    };
  },
};
</script>
<style scoped lang='scss'>
#OutArkAbnormalDetail {
  .log-pagination {
    display: flex;
    justify-content: flex-end;
    position: static;
    bottom: 0;
    right: 0;
    background: #fff;
    border: none;
    border-radius: 50px;
    margin: -40px 0 10px 0;
  }
}
</style>