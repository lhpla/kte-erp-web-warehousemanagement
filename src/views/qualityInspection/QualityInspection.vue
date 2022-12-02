<!-- 质检 -->
<template>
  <div id="QualityInspection">
    <div>
      <div class="logisticsNum">
        <span class="title">搜索物流单号：</span>
        <el-input v-model.trim="searchForm.logisticsNum" clearable @keyup.enter="sendkeybtn"></el-input>
      </div>
      <div class="tab-box">
        <el-tabs v-model="activeName" type="border-card" v-show="tabList && tabList.length">
          <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.orderCode" :name="item.orderCode">
            <h2>物流单明细</h2>
            <el-divider />
            <div class="formItem">
              <el-form :model="item" :inline="true" label-width="130px" class="demo-ruleForm">
                <div>
                  <el-form-item label=" PO单:" style="width:275px;">
                    {{ item.orderCode ? item.orderCode : "-" }}
                  </el-form-item>
                  <el-form-item label="供应商:">
                    {{ item.supplierName ? item.supplierName : "-" }}
                  </el-form-item>

                  <el-form-item label="采购员:">
                    {{ item.buyer ? item.buyer : "-" }}
                  </el-form-item>
                  <el-form-item label="质检:">
                    <span v-show="item.isCheck !== ''">
                      {{ item.isCheck ? "是" : "否" }}
                    </span>
                    <span v-show="item.isCheck === ''">-</span>
                  </el-form-item>
                  <el-form-item label="中转仓库:">
                    {{ item.warehouseName ? item.warehouseName : "-" }}
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label="收货状态:" style="width:275px;">
                    <!-- {{ item.qualityStatus ? tableTypeComputed(quality_inspection_status, item.qualityStatus) : "-" }} -->
                    <span v-show="item.qualityStatus && item.qualityStatus == 'quality_no'">未收货</span>
                    <span v-show="item.qualityStatus && item.qualityStatus == 'quality_ing'">收货中</span>
                    <span v-show="item.qualityStatus && item.qualityStatus == 'quality_over'">已收货</span>
                    <!-- <span v-show="item.qualityStatus == ''">-</span> -->
                  </el-form-item>
                  <el-form-item label="签收状态:">
                    <span :class="item.status == 'notReceipt' ? 'redText' : ''">
                      {{ item.status ? tableTypeComputed(receipt_status, item.status) : "-" }}
                    </span>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label="物流号:">
                    <el-tag v-for="tag in item.logisticsList" @click="sendkeybtn($event, item.orderCode, tag)"
                      :effect="activeTag == tag ? 'dark' : ''" class="tags-class">{{ tag }}</el-tag>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label="对仓备注:">
                    <span class="skuRemarks">{{ item.warehouseRemarks ? item.warehouseRemarks : "-" }}</span>
                  </el-form-item>
                </div>
              </el-form>
            </div>
            <h2>物流单明细</h2>
            <el-divider />
            <QualityInspectionTable ref="QualityInspectionTable" :resData="item" :sendKeyUpFlag="sendKeyUpFlag"
              v-model:activeTag="activeTag" :logisticsNumCope="logisticsNumCope">
            </QualityInspectionTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
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
  computed,
  provide,
  nextTick,
} from "vue";
import { localGet } from "@/utils/util";
import QualityInspectionTable from "@/components/warehouse/qualityInspection/QualityInspectionTable.vue";
import authorButtons from "@/compositionApi/authorButtons";
export default {
  name: "qualityInspection",
  components: { QualityInspectionTable },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      searchForm: {
        logisticsNum: "",
      },
      tabList: [],
      purchaseDict: [], // 字典数组
      receipt_status: [],
      sendKeyUpFlag: 1,
      activeName: "",
      activeTag: '',
      quality_inspection_status: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      data.purchaseDict = localGet("purchaseDict")
        ? localGet("purchaseDict")
        : [];
      data.receipt_status = data.purchaseDict.receipt_status
        ? data.purchaseDict.receipt_status
        : [];
      data.quality_inspection_status = data.purchaseDict.quality_inspection_status
        ? data.purchaseDict.quality_inspection_status
        : []
    });
    const logisticsNumCope = ref('')
    const refData = toRefs(data);
    const search = (logisticsNum) => {
      logisticsNumCope.value = logisticsNum
      if (logisticsNum) {
        api.warehouse.warehouseQualitySearch(logisticsNum).then((res) => {
          if (res.code == 200) {
            if (vue.$refs.QualityInspectionTable && vue.$refs.QualityInspectionTable[0]) {
              vue.$refs.QualityInspectionTable[0].clearSelectList()
            }
            if (!res.data.isDirect) {
              // res.data.currentLogisticsNum = res.data.currentLogisticsNum ? res.data.currentLogisticsNum.split(",") : [];
              res.data.vo.forEach((i) => {
                i.currentLogisticsNum = i.currentLogisticsNum
                  ? i.currentLogisticsNum.split(",")
                  : [];
              });
              data.tabList = res.data.vo || [];
              data.tabList.map(item => {
                item.warehouseProductVos.map(vo => {
                  vo.isExpansion = false;
                });
              });
              if (data.tabList.length) {
                data.activeName = data.tabList[0].orderCode;
              } else {
                data.activeName = "";
              }
            } else {
              vue.$message.warning(
                "该物流单号对应采购单是直发采购，请移至直发质检！"
              );
            }
          } else {
            data.tabList = [];
            vue.$message.warning({
              message: res.msg,
              type: "warning",
            });
          }
        });
      }
    };
    provide("refreshSeach", search);
    // 键盘事件
    const sendkeybtn = (e, orderCode, tag) => {
      const info = {};
      info.logisticsNum = tag ? tag : data.searchForm.logisticsNum;
      info.orderCode = orderCode
      info.sku = null;
      search(info);
      data.sendKeyUpFlag++;
      data.activeTag = info.logisticsNum;
    };
    provide("sendkeybtn", sendkeybtn);
    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (list, dizKey) {
        if (list.length > 1 && dizKey !== -1) {
          for (let item of list) {
            if (dizKey == item.dizKey) {
              return item.value;
            }
          }
        }
      };
    });
    return {
      ...refData,
      search,
      tableTypeComputed,
      sendkeybtn,
      buttonAuthor,
      logisticsNumCope
    };
  },
};
</script>
<style scoped lang="scss">
#QualityInspection {
  .skuRemarks {
    word-break: break-all;
    word-wrap: break-word;
  }

  .logisticsNum {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 20px;
    // margin-top: 15px;
    margin-bottom: 10px;

    .title {
      // width: 130px;
    }

    .el-input {
      width: 300px;
      margin-right: 20px;
    }
  }

  .tab-box {
    // padding: 0 30px;
  }

  .el-divider--horizontal {
    margin: 10px 0 20px 0;
  }

  .formItem {
    margin: 20px 0 10px 0;
    // border-bottom: 1px solid #eee;
  }

  .tags-class {
    margin: 0 3px;
    cursor: pointer;
  }

  .redText {
    color: red;
  }
}
</style>
