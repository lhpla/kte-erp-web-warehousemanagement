<template>
  <div id="SearchPanel">
    <el-form :inline="true" ref="formRef" :model="searchForm" label-width="100px">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="包装员: " class="SearchPanel-form-item" prop="packer">
          <el-select v-model="searchForm.packer" filterable placeholder="请选择" @change="search" clearable>
            <el-option v-for="(item, index) in pickerList" :key="index" :value="item.id" :label="item.realName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拣货员: " class="SearchPanel-form-item" prop="picker">
          <el-select v-model="searchForm.picker" filterable @change="search" placeholder="请选择" clearable>
            <el-option v-for="(item, index) in pickerList" :key="index" :value="item.id" :label="item.realName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="包材代码: " class="SearchPanel-form-item" prop="packingNumber">
          <div style="display: flex;">
            <el-input placeholder="请输入" v-model="searchForm.packingNumber" @keyup.enter="search" clearable></el-input>
          </div>
        </el-form-item>
        <el-form-item label="拣货单号: " class="SearchPanel-form-item" prop="pickingOrderNo">
          <div style="display: flex;">
            <el-input placeholder="请输入" v-model="searchForm.pickingOrderNo" @keyup.enter="search" clearable></el-input>
            <el-button style="margin-left: 8px;" size="small" type="text">扫描拣货单的拣货条码</el-button>
          </div>
        </el-form-item>
        <el-form-item label="sku: " class="SearchPanel-form-item" prop="sku">
          <div style="display: flex;">
            <el-input placeholder="请输入" v-model="searchForm.sku" @keyup.enter="search" clearable></el-input>
            <el-button style="margin-left: 8px;" size="small" type="text">扫描产品上的产品条码</el-button>
          </div>
        </el-form-item>
      </div>
      <br v-if="!searchShow" />
      <div class="footer-button">
        <el-form-item class="SearchPanel-form-item">
          <el-button type="text" size="small" class="open" @click="searchShow = !searchShow" v-if="showSearchBtn">
            {{ searchShow ? "合并" : "展开" }}
            <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </el-button>
          <el-button size="small" type="primary" @click="search">搜 索</el-button>
          <el-button size="small" type="primary" @click="reset">重 置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, onMounted, reactive, ref, toRefs, watch } from "vue";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";

export default defineComponent({
  props: {
    tableData: {
      type: Array,
      required: true
    },
    // 扫描总数
    productTotal: {
      type: Number,
      default: 0
    },
    // 点击搜索次数
    count: {
      type: Number,
      default: 0
    },
    pickingOrderNo: {
      type: String
    },
    // 当前拣货单已扫描
    scannedNum: {
      type: Number,
      default: 0
    },
    // 当前sku已扫描
    scanningNum: {
      type: Number,
      default: 0
    },
    // 是否完成配货
    isComplete: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const data = reactive({
      searchForm: {
        //  包装员
        packer: "",
        // 拣货员
        picker: "",
        // 包材代码
        packingNumber: "",
        // 拣货单号
        pickingOrderNo: vue.$route.query.pickingOrderNo,
        sku: ""
      },
      searchShow: false,
      // 包装员和拣货员
      pickerList: [],
      sCount: 0
    });

    const formRef = ref();

    const search = () => {
      if (!data.searchForm.pickingOrderNo) {
        vue.$message.error("请先输入或扫描拣货单号");
        return;
      }
      if (!data.searchForm.sku) {
        vue.$message.error("请先输入或扫描sku");
        return;
      }
      packagLabeling();
    };
    const reset = () => {
      formRef.value.resetFields();
    };

    // 获取拣货员
    const getAllPickingUser = () => {
      api.straightOutbound.findPacker().then(res => {
        data.pickerList = res.data;
      });
    };

    // 打包贴标
    const packagLabeling = () => {
      ctx.emit("update:pickingOrderNo", data.searchForm.pickingOrderNo);
      ctx.emit("update:isComplete", true);
      api.straightOutbound
        .packagLabeling({
          pickingOrderNo: data.searchForm.pickingOrderNo,
          sku: data.searchForm.sku,
          size: 10,
          current: 1,
          distributorId: data.searchForm.picker
        })
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.scanningNum === res.data.data.quantity) {
              vue.$message.warning("已扫描最大数量");
              return;
            }
            if (props.tableData.length === 0) {
              data.sCount++;
              res.data.data.sCount = data.sCount;
              props.tableData.push(res.data.data);
              ctx.emit("update:notScanningNum", res.data.data.productTotal - res.data.data.scannedNum - data.sCount);
              ctx.emit("update:scannedNum", res.data.data.scannedNum + 1);
              ctx.emit("update:productTotal", res.data.data.productTotal);
              ctx.emit("update:count", data.sCount);
              ctx.emit("update:scanningNum", res.data.data.scanningNum);
              ctx.emit("update:tableData", [...props.tableData]);
            } else {
              // 不同拣货单
              if (!props.tableData.some(i => i.pickingOrderNo === data.searchForm.pickingOrderNo)) {
                if (data.sCount > res.data.data.quantity - res.data.data.scanningNum) {
                  vue.$message.warning("已扫描最大数量");
                  return;
                }
                data.sCount = 0;
                data.sCount++;
                res.data.data.sCount = data.sCount;
                ctx.emit("update:notScanningNum", res.data.data.productTotal - res.data.data.scanningNum - data.sCount);
                ctx.emit("update:scannedNum", res.data.data.scannedNum + 1);
                ctx.emit("update:tableData", [res.data.data]);
                ctx.emit("update:scanningNum", res.data.data.scanningNum);
                ctx.emit("update:productTotal", res.data.data.productTotal);
                ctx.emit("update:count", data.sCount);
              } else {
                let scanned = 0;
                // 相同拣货单且不同sku
                if (props.tableData.every(item => item.sku !== data.searchForm.sku)) {
                  data.sCount = 0;
                  data.sCount++;
                  if (data.sCount > res.data.data.quantity - res.data.data.scanningNum) {
                    vue.$message.warning("已扫描最大数量");
                    return;
                  }

                  res.data.data.sCount = data.sCount;
                  props.tableData.push(res.data.data);
                  ctx.emit("update:tableData", [...props.tableData]);
                } else {
                  data.sCount++;
                  if (data.sCount > res.data.data.quantity - res.data.data.scanningNum) {
                    vue.$message.warning("已扫描最大数量");
                    return;
                  }
                  props.tableData.map(item => {
                    if (item.sku === data.searchForm.sku) item.sCount = data.sCount;
                  });
                  ctx.emit("update:tableData", [...props.tableData]);
                }
                let count = 0;
                props.tableData.map(item => {
                  count += item.sCount;
                  scanned += item.sCount;
                });
                ctx.emit("update:scannedNum", scanned + res.data.data.scannedNum);
                ctx.emit("update:notScanningNum", res.data.data.productTotal - scanned - res.data.data.scannedNum);
                ctx.emit("update:productTotal", res.data.data.productTotal);
                ctx.emit("update:count", count);
                ctx.emit("update:scanningNum", res.data.data.scanningNum);
              }
            }
          } else {
            vue.$message.error(res.data.msg);
          }
        });
    };

    onMounted(() => {
      getAllPickingUser();
      // packagLabeling();
    });

    watch(
      () => props.count,
      val => {
        if (val === 0) data.sCount = 0;
      }
    );

    return {
      ...toRefs(data),
      showSearchBtn,
      formRef,
      search,
      reset,
      getAllPickingUser,
      packagLabeling
    };
  }
});
</script>

<style lang="scss" scoped>
#SearchPanel {
  .collapseClass {
    height: auto;
    overflow: auto;
    transition: all 1s;
  }
  .text {
    color: #606266;
  }
  .form-content {
    height: 40px;
    overflow: hidden;
    transition: all 0.5s !important;
  }
  .collapseClass {
    height: auto;
    overflow: auto;
    transition: all 1s;
  }
  .footer-button {
    display: flex;
    justify-content: flex-end;
    width: 99%;
  }
  // :deep(.el-form-item__label) {
  //   font-size: 12px !important;
  // }
  // :deep(.el-form-item__content) {
  //   font-size: 12px !important;
  // }
}
</style>

<style></style>
