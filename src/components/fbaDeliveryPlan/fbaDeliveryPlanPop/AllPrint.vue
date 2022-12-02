<!-- 打印FBA标签 --> 
<template>
    <div id='AllPrint'>
      <el-dialog title="打印全部FBA标签" v-model="data.dialogFormVisible" width="50%" :close-on-click-modal="false"
        @close="handleClose" destroy-on-close :close-on-press-escape="false">
        <div class="table-box">
           <div class="table-header">
            <div>打印内容：</div>
            <div>总数量:  {{ data.num }}</div>
           </div>
        </div>
          <el-table :data="data.list" border 
        :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }">
        <el-table-column type="index" align="center" label="NO." min-width="40"></el-table-column>
      <el-table-column label="SKU" prop="fnSku"></el-table-column>
      <el-table-column label="产品名称" prop="proName"></el-table-column>
        <el-table-column label="数量" prop="shipNum" align="center">
          <template #default="{ row, $index }">
            <el-form :model="row" :rules="data.tableRules" :ref="`nums${$index}`">
              <el-form-item prop="shipNum" :rules="data.tableRules.num">
                <el-input  maxlength="4" v-model.trim="row.shipNum" placeholder="请输入" @change="numChange" />
              </el-form-item>
            </el-form>
          </template>
        </el-table-column></el-table>
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
    num: 0,
    tableRules: {
        num: [{ required: true, message: "未填写", trigger: "blur" },
        { pattern: /^\+?[1-9]\d*$/, message: "格式错误" },],
    },
})
//打开弹窗
const openPop = (list) => {
    data.list = list
    data.num = 0
    data.list.map(item => {
        data.num = Number(data.num) + Number(item.shipNum)
    })
    data.dialogFormVisible = true
}


//打印
const print = () => {
    const validateMethods = [];
    data.list.forEach((item, index) => {
        if (vue.$refs[`nums${index}`]) {
            validateMethods.push(vue.$refs[`nums${index}`].validate());
        }
    });
    Promise.all(validateMethods)
        .then(() => {
            let msg = []
            data.list.map(item => {
                msg.push({
                    tag: item.fnSku,
                    num: item.shipNum,
                    productEname: item.proName,
                    type: item.situation
                })
            })
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
                msg,
                "fbaTag"
            );
            handleClose()
        })
}

//关闭弹窗
const handleClose = () => {
    data.list = []
    data.dialogFormVisible = false
}

//切换数量  重新计算总数量
const numChange = () => {
    data.num = 0
    data.list.map(item => {
        data.num = Number(data.num) + Number(item.shipNum)
    })
}
defineExpose({ openPop })
</script>
<style scoped lang='scss'>
#AllPrint {
    .table-header {
        display: flex;
        justify-content: space-between;
        line-height: 25px;
        font-weight: bold;

        div {
            font-size: 15px;
        }
    }

    :deep(.el-dialog__header) {
        margin-right: 0;
    }
}
</style>