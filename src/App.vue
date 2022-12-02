<template>
  <el-config-provider :locale="locale">
    <router-view v-slot="{ Component }">
      <keep-alive :include="Component1">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </el-config-provider>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { localGet } from './utils/util'

const router = useRouter()
const Component1 = ref([])
const locale = ref(zhCn)

if (window.__MICRO_APP_ENVIRONMENT__) {
  window.microApp.addDataListener((data) => {
    // 当基座下发跳转指令时进行跳转
    router.push(data.index)
    Component1.value = data.tabList.map((item) => {
      if (!item.code) item.code = 'home'
      return item.code
    })
  })
}

if (!localGet('Kte-token')) router.push('/login')
</script>

<style lang="scss">
#draftSubmitAuditPop,
#purchaseAuditPop,
#purchaseOrderOpenPop,
#TransferExamineLog,
#financialAuditPop {
  .el-collapse-item__header {
    display: flex;
    height: auto !important;
    line-height: normal !important;
    width: 100%;

    .id_content {
      margin-top: 10px;
      width: 97%;
    }
  }

  .el-collapse-item__content {
    padding-bottom: 0;
  }
}

#ConfirmDelivery {
  .el-upload {
    width: 300px !important;
    height: auto !important;
    display: block;
    line-height: 1 !important;
    text-align: left !important;
  }
}

#BatchModifySize,
#TransitOrderCode,
#TransferToStraight,
#UpdateCabinetNum,
#UpdateDialog1,
#ConfirmDelivery,
#SignForListTable,
#TransferToTransfer,
#AbnormalLog,
#WarehouseHandling,
#SealingListDetail,
#QualityInspectionLisDetail,
#QualityInspectionPrint {
  .el-dialog__header {
    margin-right: 0 !important;
  }
}

#AbnormalWarehousingTable,
#QualityInspectionCargo,
#SignForTable {

  //展开图标
  .el-table__expand-icon>.el-icon {
    position: relative !important;
    left: 0 !important;
    top: 0 !important;
    margin-left: 0 !important;
    margin-top: 0 !important;
  }
}

#MergeSku {
  .nameData {
    .form_item2 {
      .el-form-item__content {
        width: 100% !important;
      }
    }
  }
}

#NewUploadFile {
  .uploadFileBox {
    width: 300px;

    .upload-demo {
      .el-upload {
        height: 30px !important;
        line-height: 30px !important;
      }

      .el-upload--text {
        height: 30px !important;
        line-height: 30px !important;
      }
    }
  }
}

#TransferToTransfer,
#StepFirst {
  .vxe-cell {
    padding: 0 !important;
    max-height: none !important;
  }
}

#RoleRightsRightsSet {
  .el-overlay {
    .el-dialog {
      margin-top: 10vh !important;

      .el-dialog__body {
        height: 60vh !important;
        overflow-y: auto;
      }
    }
  }
}

#ViewGeneratePlanLog,
#FirstDetailsPop,
#AbnormalDetail,
#ComeOutPop {
  position: relative;

  .el-pagination {
    position: absolute !important;
    bottom: 80px !important;
  }
}

#StraightAudit,
#TransitAudit {
  position: relative;

  .el-pagination {
    position: absolute !important;
    bottom: 50px !important;
  }
}

#StraightAudit,
#TransitAudit {
  .el-dialog {
    margin-top: 4vh !important;

    .el-dialog__body {
      height: 60vh !important;
      overflow-y: auto;
    }
  }
}

#DownloadListTable,
#PurchaseDownListTable {
  position: relative;

  .el-pagination {
    position: absolute !important;
    bottom: 10px !important;
  }
}

#ModifyPurchaseList {
  .el-affix {
    width: 100% !important;
  }
}

#TransferEdit {
  .el-affix {
    width: 100% !important;
  }
}

#purchaseOrderOpenPop {
  .el-table .warning-row {
    background: rgb(220, 220, 220);
  }
}

#TransportManagementLog {
  .TransportManagementLog-long-input {
    .el-form-item__content {
      width: 85%;
    }
  }
}

#ViewGeneratePlanLog {
  .serachSku {
    .el-input {
      .el-input__inner {
        height: 28px !important;
        line-height: 28px !important;
      }
    }
  }
}

#AddCabinetPop {
  .el-dialog {
    margin-top: 5vh !important;

    .el-dialog__body {
      height: 60vh !important;
      overflow-y: auto;
    }
  }
}

/* 开发流程操作栏的按钮间距 */
.development-process-operation-bar {
  .el-button {
    margin-left: 10px;
  }
}

#develop-product-dialog .el_dialog_image,
#commentPopup .el_dialog_image,
#UploadImage .el_dialog_image,
#Abnormal .el_dialog_image,
#UploadFilePurchase .el_dialog_image {
  .el-dialog__header {
    background-color: #fff !important;
  }
}

.expand-wrapper {
  padding: 10px 20px;
}

// .vxe-table {
//   height: 600px !important;
// }

.PlatformCategoryTable {
  width: 300px !important;
  max-height: 90px !important;
  overflow-y: scroll;
}

.PlatformCategoryTable::-webkit-scrollbar {
  width: 5px;
}

.PlatformCategoryTable::-webkit-scrollbar-track {
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.PlatformCategoryTable::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}

.PlatformCategoryTable::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(255, 0, 0, 0.4);
}

// .PlatformCategoryTable .auditInstructions {
//   text-align: center !important;
// }
// .vxe-body--row.row--checked {
//   background: #fff !important;
// }

#CategoryComparisonLeft {
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    color: rgb(117, 185, 255) !important;
    background: #fff !important;
  }
}

.autocompleteClass {
  .el-autocomplete-suggestion {
    width: 100% !important;
  }

  .el-scrollbar {
    overflow: auto !important;
  }
}

#QualityInspectionPrint {
  .el-dialog__body {
    max-height: 75vh !important;
    overflow: auto !important;
  }
}

#ReviewDeliveryPlanTable,
#FbaDeliveryPlanTable,
#WarehouseAreaManagementTable,
#InventoryManagementTable,
#SealingListTable,
#AllocatingAbnormalTable,
#OffListTable {
  .oper {
    .el-button+.el-button {
      margin-left: 0 !important;
    }
  }
}
</style>
