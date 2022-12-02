<!-- 删除箱唛 -->
<template>
  <div id="DeleteCarton">
    <el-dialog title="柜子-删除箱唛" width="800px" v-model="visible" :close-on-click-modal="false" @close="closed"
      destroy-on-close :close-on-press-escape="false">
      <div>
        <el-form ref="formRef" :inline="true" :model="ruleForm" label-width="100px">
          <el-form-item label="批量选择：">
            <el-row :gutter="20">
              <el-col :span="10">
                <el-input-number v-model="ruleForm.start" :controls="false" :min="1"></el-input-number>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="10">
                <el-input-number v-model="ruleForm.end" :controls="false" :min="1"></el-input-number>
              </el-col>
              <el-col :span="2">箱</el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" size="small">确定</el-button>
          </el-form-item>
        </el-form>
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="(item, index) of list" :label="item" :key="index"><span
              style="width: 50px;display: inline-block;">{{ item
              }}</span></el-checkbox>
        </el-checkbox-group>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="closed" :loading="btnFlag" :disabled="btnFlag">取 消</el-button>
          <el-button size="small" type="primary" @click="delData" :loading="btnFlag" :disabled="btnFlag">删 除
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;

const visible = ref(false)
const btnFlag = ref(false)
const ruleForm = ref({
  start: undefined,
  end: undefined,
})
const checkList = ref([])
const list = ref([])
const rowData = ref({})
//打开弹窗
const openDialog = (row) => {
  rowData.value = row
  getBoxMark(rowData.value.cabinetNum)
  visible.value = true;
}
// 关闭弹窗
const closed = () => {
  checkList.value = []
  ruleForm.value = {
    start: undefined,
    end: undefined,
  }
  rowData.value = {}
  list.value = []
  visible.value = false;
};
//获取箱唛数据
const getBoxMark = (cabinetNum) => {
  api.warehouse.getBoxMark({ cabinetNum }).then((res) => {
    if (res.code == 200) {
      list.value = res.data
    } else {
      vue.$message.warning(res.msg)
    }
  })
}
//确定
const onSubmit = () => {
  if (ruleForm.value.start && ruleForm.value.end) {
    if (ruleForm.value.start > ruleForm.value.end) {
      vue.$message.warning('起始箱不可大于结束箱！')
      return false
    }
    checkList.value = []
    for (let num = ruleForm.value.start; num <= ruleForm.value.end; num++) {
      for (let item of list.value) {
        if (item == num) {
          checkList.value.push(item)
        }
      }
    }
    console.log(checkList.value);
  } else {
    vue.$message.warning('请输入箱子的区间！')
  }
}
//删除
const delData = () => {
  if (checkList.value.length) {
    btnFlag.value = true
    const info = {
      cartonNum: checkList.value,
      rvCode: rowData.value.enterWarehouseCode
    }
    api.warehouse.delBox(info).then((res) => {
      if (res.code == 200) {
        closed()
        vue.$message.success(res.msg)
      } else {
        vue.$message.warning(res.msg)
      }
      btnFlag.value = false
    }).catch(() => {
      btnFlag.value = false
    })
  } else {
    vue.$message.warning('请选择要删除的仓区')
  }
}
defineExpose({ openDialog })
</script>

<style scoped lang='scss'>
#DeleteCarton {
  .line {
    margin: 0 10px
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>