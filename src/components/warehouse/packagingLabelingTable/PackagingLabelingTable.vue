<template>
  <div>
    <div class="action">
      <div style="display: flex;">
        <div class="text">未扫描：{{ notScanNum }}</div>
        <div class="text">已扫描：{{ scannedNum }}</div>
      </div>
      <div style="display: flex;">
        <!-- <el-button type="primary" size="mini" @click="tips">打印欧代标签</el-button>
        <el-button type="primary" size="mini" @click="tips" style="margin: 0 10px;">标记异常</el-button> -->
        <el-button type="primary" size="small" @click="handleComplete">完成配货</el-button>
      </div>
    </div>
    <div class="table">
      <vxe-table border ref="table" :data="tableData" @checkbox-all="selectAllChangeEvent" @checkbox-change="selectChangeEvent">
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column field="sku" title="SKU" show-overflow></vxe-column>
        <vxe-column field="proCname" title="产品名称" show-overflow></vxe-column>
        <vxe-column field="quantity" title="数量" show-overflow></vxe-column>
        <vxe-column field="locationNum" title="库位" show-overflow></vxe-column>
        <vxe-column field="sCount" title="扫描数量" show-overflow>
          <template #default="{row}">
            <span>{{ row.sCount + row.scanningNum }}</span>
          </template>
        </vxe-column>
      </vxe-table>
    </div>

    <el-dialog title="完成配货" v-model="visible" width="30%" :close-on-press-escape="false">
      <div style="display: flex;">
        <div style="margin-right: 12px;">
          <i class="el-icon-warning-outline icon"></i>
        </div>
        <div>
          <div class="title">点击完成配货</div>
          <br />
          <div class="sub-title">确定该操作吗?</div>
        </div>
      </div>
      <template #footer>
        <el-divider></el-divider>
        <el-button type="primary" size="small" @click="distribution">确定</el-button>
        <el-button size="small" @click="visible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs, ref, computed } from "vue";

export default defineComponent({
  props: {
    tableData: {
      type: Array,
      required: true
    },
    productTotal: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    pickingOrderNo: {
      type: String
    },
    scannedNumber: {
      type: Number,
      default: 0
    },
    scanningNum: {
      type: Number,
      default: 0
    },
    isComplete: {
      type: Boolean,
      default: false
    },
    notScanningNum: {
      type: Number,
      default: 0
    }
  },
  setup(props, ctx) {
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;

    const data = reactive({
      ids: [],
      visible: false
    });
    // 未扫描
    const notScanNum = computed(() => (props.isComplete ? props.notScanningNum : 0));
    // 已扫描
    const scannedNum = computed(() => (props.isComplete ? props.scannedNumber : 0));

    const selectAllChangeEvent = ({ checked }) => {
      if (checked) {
        props.tableData.map(item => {
          data.ids.push(item);
        });
      } else {
        data.ids = [];
      }
    };
    const selectChangeEvent = ({ checked, row }) => {
      row.checked = checked;
      if (row.checked) data.ids.push(row);
    };

    const handleComplete = () => {
      if (!data.ids.length) {
        vue.$message.error("请先选择配货数据");
        return;
      }
      data.visible = true;
    };

    // 完成配货
    const distribution = () => {
      let list = [];
      data.ids.map(item => {
        let obj = {
          scanningNum: item.sCount + item.scanningNum,
          sku: item.sku
        };
        list.push(obj);
      });
      if (list.length !== props.tableData.length) {
        vue.$message.warning("请将扫描的数据一起配货");
        return;
      }
      api.straightOutbound
        .completeProduct({
          notScanningNum: notScanNum.value,
          pickingOrderNo: props.pickingOrderNo,
          scanningNum: scannedNum.value,
          list
        })
        .then(res => {
          if (res.code === 200) {
            vue.$message.success(res.msg);
            ctx.emit("update:tableData", []);
            ctx.emit("update:count", 0);
            ctx.emit("update:isComplete", false);
          } else {
            vue.$message.error(res.msg);
          }
          data.ids = [];
          list = [];
          data.visible = false;
        })
        .catch(err => {
          console.log(err);
        });
    };

    const tips = () => {
      vue.$message.warning("功能正在开发中，敬请期待");
    };

    return {
      ...toRefs(data),
      tips,
      distribution,
      handleComplete,
      selectAllChangeEvent,
      selectChangeEvent,
      notScanNum,
      scannedNum
    };
  }
});
</script>

<style lang="scss" scoped>
.action {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  .text {
    color: #606266;
    font-size: 14px;
    &:last-child {
      margin-left: 18px;
    }
  }
}
.table {
  margin-top: 12px;
}
.title {
  font-size: 18px;
  font-weight: 700;
}
.sub-title {
  color: #999;
  font-size: 16px;
}
.icon {
  font-size: 30px;
  color: #e6a23c;
}
</style>
