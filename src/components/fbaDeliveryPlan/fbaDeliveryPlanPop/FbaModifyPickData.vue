<!-- 修改拣货数据 弹窗 -->
<template>
  <div id="FbaModifyPickData">
    <el-dialog title="拣货数据" v-model="dialogFormVisible" width="80%" :close-on-click-modal="false" @close="handleClose"
      destroy-on-close :close-on-press-escape="false">
      <div style="margin-bottom: 20px;">
        <el-button type="primary" size="small" @click="addList">增加拣货数据</el-button>
      </div>
      <el-form :model="form" ref="formRef" :rules="tableRules" >
        <el-table :data="form.tableData" border style="width: 100%"
          :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }">
          <el-table-column label="柜号" prop="cabinetNum" min-width="110">
            <template #default="{ row, $index }">
              <el-form-item v-if="$index >= 0" :prop="`tableData.${$index}.cabinetNum`" :rules="tableRules.cabinetNum">
                <el-input v-model.trim="row.cabinetNum">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="箱号" prop="cartonNum" min-width="110">
            <template #default="{ row, $index }">
              <el-form-item v-if="$index >= 0" :prop="`tableData.${$index}.cartonNum`" :rules="tableRules.cartonNum">
                <el-input v-model.trim="row.cartonNum">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku">
            <template #default="{ row, $index }">
              <el-form-item v-if="$index >= 0" :prop="`tableData.${$index}.sku`" :rules="tableRules.sku">
                <el-select v-model="row.sku"  clearable placeholder="请选择">
                  <el-option :label="i.sku" :value="i.sku" v-for=" i in skuList" :key="i.sku"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="实际取货数" prop="actualPickingQuantity" min-width="110">
            <template #default="{ row, $index }">
              <el-form-item v-if="$index >= 0" :prop="`tableData.${$index}.actualPickingQuantity`"
                :rules="tableRules.actualPickingQuantity">
                <el-input v-model.trim="row.actualPickingQuantity">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark">
            <template #default="{ row, $index }">
              <el-form-item v-if="$index >= 0" :prop="`tableData.${$index}.remark`" :rules="tableRules.photoType">
                <el-input v-model="row.remark" type="textarea" maxlength="20" show-word-limit :rows="2"
                  placeholder="备注">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="70px">
            <template #default="scope">
              <el-button size="small" type="primary" text @click="deleteList(scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose" size="small">取消</el-button>
          <el-button type="primary" @click="submit" size="small">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from 'vue';
const dialogFormVisible = ref(false)
const form = ref({
  tableData: [{
    sku: '',
    cabinetNum: '',
    actualPickingQuantity: '',
    remark: '',
  }]
})
const tableRules = ref(
  {
    cabinetNum: [{ required: true, message: "请输入", trigger: "blur" },
    { pattern: /^[A-Za-z0-9]+$/, message: "英文字母和数字", trigger: "blur" }],
    cartonNum: [{ required: true, message: "请输入", trigger: "blur" },
    { pattern: /^[0-9]*$/, message: "请输入数字", trigger: "blur" }],
    sku: [{ required: true, message: "请选择", trigger: "change" }],
    actualPickingQuantity: [{ required: true, message: "请输入", trigger: "blur" },
    { pattern: /^(0|[1-9]\d*)$/, message: "请输入整数", trigger: "blur" }],
  }
)
const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
const formRef = ref(null)
const skuList = ref([])
const shipId = ref('')
//获取信息
const getMsg = (list, id) => {
  shipId.value = id
  skuList.value = list
  dialogFormVisible.value = true
}
//取消
const handleClose = () => {
  dialogFormVisible.value = false
  if (formRef.value) {
    formRef.value.resetFields();
  }
}
//提交
const submit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      form.value.tableData.map(item => {
        item.shipId = shipId.value
      })
      api.fba.updateOrSavePicking(form.value.tableData).then(res => {
        if (res.code == 200) {
          vue.$message.success(res.msg)
          handleClose()
        } else {
          vue.$message.warning(res.msg)
        }
      })
    }
  }
  )
}
//新增数据
const addList = () => {
  form.value.tableData.push({
    sku: '',
    cabinetNum: '',
    actualPickingQuantity: '',
    remark: '',
  })
}
//删除数据
const deleteList = index => {
  form.value.tableData.splice(index, 1)
}
defineExpose({ getMsg })
</script>
<style scoped lang='scss'>
#FbaModifyPickData {
  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>