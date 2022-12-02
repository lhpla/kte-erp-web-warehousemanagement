<!-- 打印FBA标签 --> 
<template>
  <div id='FbaPrintPop'>
    <el-dialog title="打印FBA标签" v-model="data.dialogFormVisible" width="50%" :close-on-click-modal="false"
      @close="handleClose" destroy-on-close :close-on-press-escape="false">
      <el-form :model="data.form" ref="formRef" :rules="data.tableRules"  label-width="120px">
        <el-form-item label="SKU:" prop="sku" :rules="data.tableRules.sku" v-if="data.flag">
          <el-select v-model="data.form.sku" clearable placeholder="请选择">
            <el-option v-for="(item, index) of data.list" :key="index" :label="item.sku" :value="item.sku"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打印数量:" prop="num" :rules="data.tableRules.num">
          <el-input v-model="data.form.num" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose" size="small">取 消
          </el-button>
          <el-button @click="print" type="primary" size="small">打 印
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, reactive } from 'vue';
import { getLodop } from "@/utils/LodopFuncs";
const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
const data = reactive({
  dialogFormVisible: false,
  list: [],
  form: {
    sku: '',
    num: 1,
  },
  tableRules: {
    num: [{ required: true, message: "未填写", trigger: "blur" },
    { pattern: /^\+?[1-9]\d*$/, message: "格式错误" },],
    sku: [{ required: true, message: '请选择', trigger: "change" }]
  },
  flag: true
})
//打开弹窗
const openPop = (list, flag) => {
  data.list = list
  data.flag = flag
  data.form.num = 1
  data.form.sku = ''
  data.dialogFormVisible = true
}
const formRef = ref(null)
//打印
const print = () => {
  formRef.value.validate(valid => {
    if (valid) {
      let msg = []
      if (data.flag) {
        msg = data.list.map(item => {
          if (item.sku == data.form.sku) {
            return item
          }
        })
      } else {
        msg = data.list
      }
      let obj = {
        tag: msg[0].fnSku,
        num: data.form.num,
        productEname: msg[0].proName,
        type: msg[0].situation
      }
      let LODOP = getLodop();
      if (typeof LODOP == "string") {
        vue.$message.warning({
          dangerouslyUseHTMLString: true,
          message: LODOP,
        });
        return;
      }
      //标签
      vue.$printFn(
        LODOP,
        [obj],
        "fbaTag"
      );
      handleClose()
    }
  })
}

//关闭弹窗
const handleClose = () => {
  data.list = []
  data.dialogFormVisible = false
}
defineExpose({ openPop })
</script>
<style scoped lang='scss'>
#FbaPrintPop {
  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>