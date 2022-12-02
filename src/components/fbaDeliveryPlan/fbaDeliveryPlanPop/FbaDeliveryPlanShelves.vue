<!--  FBA装箱计划  上架FbaDeliveryPlanShelves-->
<template>
  <div id="FbaDeliveryPlanShelves">
    <el-dialog title="海外上架" v-model="dialogFormVisible" width="80%" :close-on-click-modal="false" @close="handleClose"
      destroy-on-close :close-on-press-escape="false">
      <el-form :model="form" :inline="true" ref="formRef" :rules="tableRules" label-width="120px">
        <div class="header">
          <div>
            <el-form-item label="shipment ID:" prop="shipmentId">
              {{form.shipmentId}}
            </el-form-item>
            <el-form-item label="货件追踪号:" prop="goodsTrackNum">
              {{form.goodsTrackNum}}
            </el-form-item>
            <el-form-item label="FBA建单日期:" prop="fbaCreateDate">
              {{form.fbaCreateDate}}
            </el-form-item>
          </div>
          <div>
            <el-form-item label="海外上架时间:" prop="overseasShelfTime">
              <el-date-picker v-model="form.overseasShelfTime" type="datetime" placeholder="选择日期时间" :disabled="isShow">
              </el-date-picker>
            </el-form-item>

          </div>
        </div>
        <el-table :data="form.confirms" border style="width: 100%"
          :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }">
          <el-table-column label="SKU" prop="sku">
          </el-table-column>
          <el-table-column label="M SKU" prop="fbaSku">
          </el-table-column>
          <el-table-column label="商品名称" prop="proName">
          </el-table-column>
          <el-table-column label="FNSKU" prop="fnSku"></el-table-column>
          <el-table-column label="发货数量" prop="shipNum"></el-table-column>

          <el-table-column label="上架数量">
            <template #default="{ row, $index }">
              <el-form-item v-if="$index >= 0" :prop="`confirms.${$index}.numberOfShelves`"
                :rules="tableRules.numberOfShelves">
                <el-input v-model.trim="row.numberOfShelves" placeholder="上架数量" :disabled="isShow">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="onShelfRemarks">
            <template #default="{ row, $index }">
              <el-form-item v-if="$index >= 0" :prop="`confirms.${$index}.onShelfRemarks`"
                :rules="tableRules.photoType">
                <el-input v-model="row.onShelfRemarks" type="textarea" maxlength="30" show-word-limit :rows="2"
                  placeholder="备注" :disabled="isShow">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <span class="dialog-footer" v-if="!isShow">
          <el-button @click="handleClose" size="small" :disabled="btnLoading" :loading="btnLoading">取消</el-button>
          <el-button type="primary" @click="saveInfo" size="small" :disabled="btnLoading" :loading="btnLoading">保存
          </el-button>
          <el-button type="primary" @click="submit" size="small" :disabled="btnLoading" :loading="btnLoading">确认上架
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, inject } from 'vue';
import { parseTime } from '@/utils/util'
const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
const btnLoading = ref(false)
const dialogFormVisible = ref(false)
const form = ref({
  // time: new Date(),
  overseasShelfTime: '',
  shipmentId: '',
  confirms: []
})
const tableRules = ref({
  numberOfShelves: [
    { required: true, message: "请输入", trigger: "blur" },
    { pattern: /^\+?[1-9]\d*$/, message: "请输入大于0的正整数", }
  ],
  overseasShelfTime: [{ required: true, message: "请输入", trigger: "change" }]
})
const formRef = ref(null)
const isShow = ref(false)
//获取信息
const getMsg = (id, v) => {
  if (v) {
    isShow.value = true
  }
  dialogFormVisible.value = true
  api.fba.listingQuery({ id: id }).then(res => {
    if (res.code == 200) {
      form.value = res.data
      form.value.overseasShelfTime = form.value.overseasShelfTime ? form.value.overseasShelfTime : parseTime(new Date())
    } else {
      vue.$message.warning(res.msg)
    }
  })
}
//取消
const handleClose = () => {
  isShow.value = false
  form.value = {
    overseasShelfTime: '',
    shipmentId: '',
    confirms: []
  }
  if (formRef.value) {
    formRef.value.resetFields();
    formRef.value.clearValidate();
  }
  dialogFormVisible.value = false
}
const getTableData = inject("getTableData");
//保存
const saveInfo = () => {
  btnLoading.value = true
  form.value.overseasShelfTime = form.value.overseasShelfTime ? parseTime(form.value.overseasShelfTime) : form.value.overseasShelfTime
  api.fba.saveListingInformation(form.value).then(res => {
    if (res.code == 200) {
      vue.$message.success(res.msg)
      getTableData()
      handleClose()
      btnLoading.value = false
    } else {
      btnLoading.value = false
      vue.$message.warning(res.msg)
    }
  }).catch(() => {
    btnLoading.value = false
  })
}
//确认上架
const submit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      btnLoading.value = true
      form.value.overseasShelfTime = parseTime(form.value.overseasShelfTime)
      api.fba.confirmListing(form.value).then(res => {
        if (res.code == 200) {
          vue.$message.success(res.msg)
          btnLoading.value = false
          getTableData()
          handleClose()
        } else {
          btnLoading.value = false
          vue.$message.warning(res.msg)
        }
      }).catch(() => {
        btnLoading.value = false
      })
    }
  }
  )
}
defineExpose({ getMsg })
</script>


<style scoped lang='scss'>
#FbaDeliveryPlanShelves {
  .header {
    display: flex;
    justify-content: space-between;
  }

  :deep(.el-input__inner) {
    margin-left: 20px;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>