<!-- FBA装箱计划 装箱 -->
<template>
  <div id="FbaDeliveryPlanPacking">
    <el-dialog title="装箱" v-model="dialogFormVisible" width="90%" :close-on-click-modal="false" @close="handleClose"
      destroy-on-close :close-on-press-escape="false">
      <div style="margin-bottom: 20px;">
        <el-button type="primary" size="small" @click="addList">增加箱号号段</el-button>
        <el-button type="primary" size="small" @click="updateData">修改拣货数据</el-button>
      </div>
      <el-form :model="ruleForm" :rules="tableRules" ref="ruleFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="运输方式：" prop="fbaShippingMethod">
          <el-radio-group v-model="ruleForm.fbaShippingMethod">
            <el-radio v-for="item in fba_ship_transport_method" :label="item.dizKey">{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border v-loading="btnLoading"
        :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }">
        <el-table-column label="装箱号段" min-width="140" align="center">
          <template #default="{ row, $index }">
            <el-form :model="row" :rules="tableRules" :ref="`CasesNum_${$index}`">
              <div class="flex">
                <el-form-item prop="startBoxNum" :rules="[{
                   ...tableRules.startBoxNum[0],
                 row:row
                }]">
                  <el-input v-model.trim="row.startBoxNum" style="width:75px" />
                </el-form-item>
                <span style="margin:0 5px;line-height:43px">
                  至
                </span>
                <el-form-item prop="endBoxNum" :rules="[{
                   ...tableRules.endBoxNum[0],
                 row:row
                }]">
                  <el-input v-model.trim="row.endBoxNum" style="width:75px" />
                </el-form-item>
              </div>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="SKU" prop="sku" align="center">
          <template #default="{ row, $index }">
            <el-form :model="row" :rules="tableRules" :ref="`sku_${$index}`">
              <el-form-item prop="sku" :rules="tableRules.sku">
                <el-select v-model="row.sku" clearable placeholder="请选择" @change="skuChoose(row)">
                  <el-option :label="i.sku" :value="i.sku" v-for=" i in skuList" :key="i.sku"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="中转仓库" prop="transferWarehouse" align="center">
          <template #default="{ row, $index }">
            <el-form :model="row" :rules="tableRules" :ref="`transferWarehouse_${$index}`">
              <el-form-item prop="transferWarehouse" :rules="tableRules.transferWarehouse">
                <el-select v-model="row.transferWarehouse" clearable placeholder="请选择" :disabled="!row.sku">
                  <el-option :label="i" :value="i" v-for=" i in row.transferWarehouses" :key="i">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="singleBoxNum" align="center">
          <template #header>
            <div>
              <div>单箱数量</div>
              <div style="color: #999;">(pcs/箱)</div>
            </div>
          </template>
          <template #default="{ row, $index }">
            <el-form :model="row" :rules="tableRules" :ref="`singleBoxNum_${$index}`">
              <el-form-item prop="singleBoxNum">
                <el-input v-model.trim="row.singleBoxNum" placeholder="请输入" />
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column min-width="200" align="center">
          <template #header>
            <div>
              <div>单箱尺寸</div>
              <div style="color: #999;">(长*高*宽cm)</div>
            </div>
          </template>
          <template #default="{ row, $index }">
            <div class="flex">
              <span>
                <el-form :model="row" :rules="tableRules" :ref="`size_${$index}`" style="display: flex;"
                  @submit.native.prevent>
                  <el-form-item prop="length">
                    <span> 长 </span><span>
                      <el-input v-model="row.length" style="width: 60px"></el-input>
                    </span>
                  </el-form-item>
                  <el-form-item prop="width">
                    <span style="margin-left: 5px"> 宽 </span><span>
                      <el-input v-model="row.width" style="width: 60px"></el-input>
                    </span>
                  </el-form-item>
                  <el-form-item prop="height">
                    <span style="margin-left: 5px"> 高 </span><span>
                      <el-input v-model="row.height" style="width: 60px"></el-input>
                    </span>
                  </el-form-item>
                </el-form>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <div align="center">
              <div>单箱重量</div>
              <div style="color: #999;">(kg)</div>
            </div>
          </template>
          <template #default="{ row, $index }">
            <div style="padding: 10px 0;">
              <el-form :model="row" :rules="tableRules" :ref="`weight_${$index}`">
                <el-form-item prop="weight">
                  <el-input v-model.trim="row.weight" placeholder="请输入"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否内电" align="center">
          <template #default="{ row, $index }">
            <el-form :model="row" :rules="tableRules" :ref="`isInternalPower_${$index}`">
              <el-form-item prop="isInternalPower">
                <el-select v-model="row.isInternalPower" clearable placeholder="请选择">
                  <el-option label="否" :value="false"></el-option>
                  <el-option label="是" :value="true"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="是否带磁" align="center">
          <template #default="{ row, $index }">
            <el-form :model="row" :rules="tableRules" :ref="`isMagnetic_${$index}`">
              <el-form-item prop="isMagnetic">
                <el-select v-model="row.isMagnetic" clearable placeholder="请选择">
                  <el-option label="否" :value="false"></el-option>
                  <el-option label="是" :value="true"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80px">
          <template #default="scope">
            <el-button size="small" type="primary" text @click="deleteList(scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose" size="small" :disabled="btnLoading" :loading="btnLoading">取消
          </el-button>
          <el-button type="primary" @click="submit" size="small" :disabled="btnLoading" :loading="btnLoading">
            提交</el-button>
        </span>
      </template>
    </el-dialog>
    <FbaModifyPickData ref="FbaModifyPickDataRef"></FbaModifyPickData>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, inject } from 'vue';
import { localGet } from "@/utils/util";
import FbaModifyPickData from "./FbaModifyPickData.vue"
const dialogFormVisible = ref(false)
const ruleForm = ref({
  fbaShippingMethod: 'sea_freight'
})
//表格数据
const tableData = ref([])
//sku数据
const skuList = ref([])
const tableRules = ref({
  fbaShippingMethod: [{ required: true, message: '请选择', trigger: 'change' }],
  sku: [{ required: true, message: '请选择', trigger: 'change' }],
  transferWarehouse: [{ required: true, message: '请选择', trigger: 'change' }],
  singleBoxNum: [
    { required: true, message: '请输入', trigger: 'blur' },
    {
      pattern: /^[1-9]{1}\d{0,9}$/,
      message: "大于0整数，不超过10位",
      trigger: "blur",
    }
  ],
  length: [
    { required: true, message: "请输入", trigger: "blur" },
    {
      pattern: /^([1-9]|[1-9]\d|1\d{2}|200)$/,
      message: "1-200整数",
      trigger: "blur",
    },
  ],
  width: [
    { required: true, message: "请输入", trigger: "blur" },
    {
      pattern: /^([1-9]|[1-9]\d|1\d{2}|200)$/,
      message: "1-200整数",
      trigger: "blur",
    },
  ],
  height: [
    { required: true, message: "请输入", trigger: "blur" },
    {
      pattern: /^([1-9]|[1-9]\d|1\d{2}|200)$/,
      message: "1-200整数",
      trigger: "blur",
    },
  ],
  weight: [
    { required: true, message: "请输入", trigger: "blur" },
    {
      pattern: /^([1-9]{1}\d{0,4})(\.\d{1,4})?$/,
      message: "1-99999，可保留四位小数",
      trigger: "blur",
    },
  ],
  startBoxNum: [
    {
      validator: (rule, value, callback) => {
        let reg = /^[1-9]{1}\d{0,4}$/;
        if (!reg.test(value)) {
          callback(new Error("1-99999整数"));
        } else if (rule.row && rule.row.endBoxNum && Number(rule.row.endBoxNum) < Number(rule.row.startBoxNum)) {
          callback(new Error("小于尾数"))
        } else {
          callback();
        }
      },
      trigger: "blur",
    }
  ],
  endBoxNum: [
    {
      validator: (rule, value, callback) => {
        let reg = /^[1-9]{1}\d{0,4}$/;
        if (!reg.test(value)) {
          callback(new Error("1-99999整数"));
        } else if (rule.row && rule.row.startBoxNum && Number(rule.row.endBoxNum) < Number(rule.row.startBoxNum)) {
          callback(new Error("大于起始数"))
        } else {
          callback();
        }
      },
      trigger: "blur",
    }

  ]
})
const btnLoading = ref(false)
const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
const formRef = ref(null)
const fba_ship_transport_method = ref([])
const shipId = ref('')
//获取信息
const getMsg = (row) => {
  shipId.value = row.id
  fba_ship_transport_method.value =
    localGet("purchaseDict") && localGet("purchaseDict").fba_ship_transport_method ? localGet("purchaseDict").fba_ship_transport_method : [];
  getSkuMsg(shipId.value)
  logisticsRejectedPackingEcho(shipId.value)
  dialogFormVisible.value = true
}
//获取sku数据
const getSkuMsg = (shipId) => {
  api.fba.getFbaShipBoxById({ shipId }).then((res) => {
    if (res.code == 200) {
      skuList.value = res.data
    } else {
      vue.$message.warning(res.msg)
    }
  })
}
//获取装箱列表数据
const logisticsRejectedPackingEcho = (shipId) => {
  api.fba.logisticsRejectedPackingEcho({ shipId }).then((res) => {
    if (res.code == 200) {
      ruleForm.value.fbaShippingMethod = res.data.fbaShippingMethod ? res.data.fbaShippingMethod : ruleForm.value.fbaShippingMethod
      tableData.value = res.data.boxVo
      if (tableData.value.length) {
        const keysArr = Object.keys(tableData.value[0])
        tableData.value.map(item => {
          keysArr.map(key => {
            item[key] = item[key] == -1 ? '' : item[key]
          })
        })
      }
    } else {
      vue.$message.warning(res.msg)
    }
  })
}
//选择Sku
const skuChoose = (row) => {
  if (row.sku) {
    const itemData = skuList.value.find(item => item.sku == row.sku)
    row.transferWarehouses = itemData.transferWarehouses
    row.transferWarehouse = ''
  } else {
    row.transferWarehouses = []
    row.transferWarehouse = ''
  }
}
//取消
const handleClose = () => {
  dialogFormVisible.value = false
  ruleForm.value = {
    fbaShippingMethod: 'sea_freight'
  }
  tableData.value = []
  skuList.value = []
}
const getTableData = inject("getTableData");
//提交
const submit = () => {
  if (!tableData.value.length) {
    vue.$message.warning('请填写装箱数据')
    return false
  }

  const validateMethods = [];
  tableData.value.forEach((row, index) => {
    if (vue.$refs[`CasesNum_${index}`]) {
      validateMethods.push(vue.$refs[`CasesNum_${index}`].validate());
    }
    if (vue.$refs[`size_${index}`]) {
      validateMethods.push(vue.$refs[`size_${index}`].validate());
    }
    if (vue.$refs[`singleBoxNum_${index}`]) {
      validateMethods.push(vue.$refs[`singleBoxNum_${index}`].validate());
    }
    if (vue.$refs[`sku_${index}`]) {
      validateMethods.push(vue.$refs[`sku_${index}`].validate());
    }
    if (vue.$refs[`weight_${index}`]) {
      validateMethods.push(vue.$refs[`weight_${index}`].validate());
    }
    if (vue.$refs[`transferWarehouse_${index}`]) {
      validateMethods.push(vue.$refs[`transferWarehouse_${index}`].validate());
    }
  });
  Promise.all(validateMethods)
    .then(() => {
      let arr = ref(JSON.parse(JSON.stringify(tableData.value)))
      //对箱号进行排序
      arr.value.sort(function (a, b) { return a.startBoxNum - b.startBoxNum });
      if (arr.value[0].startBoxNum != 1) {
        vue.$message.warning('箱号段需从1开始')
        return false
      }
      for (let i = 0; i < arr.value.length - 1; i++) {
        if (Number(arr.value[i].endBoxNum) != Number(arr.value[i + 1].startBoxNum) - 1) {//前一项尾数!=后一项起始数-1,(判断是否连号)
          if (arr.value[i].startBoxNum == arr.value[i + 1].startBoxNum) {//未连号，起始点相同
            if (arr.value[i].endBoxNum != arr.value[i + 1].endBoxNum) {//未连号，起始点相同,尾数不同
              vue.$message.warning(`不同箱号段不能存在包含关系，请检查填写的装箱箱号，错误数据：【装箱箱号：${arr.value[i].startBoxNum}-${arr.value[i].endBoxNum} 号】【装箱箱号：${arr.value[i + 1].startBoxNum}-${arr.value[i + 1].endBoxNum}号】`)
              return false
            } else {//未连号，起始点相同,尾数相同
              if (arr.value[i].sku == arr.value[i + 1].sku) {//未连号，起始点相同,尾数相同,sku相同
                vue.$message.warning(`相同sku箱号段不能存在包含关系，请检查填写的装箱箱号，错误数据：【装箱箱号：${arr.value[i].startBoxNum}-${arr.value[i].endBoxNum} 号】【装箱箱号：${arr.value[i + 1].startBoxNum}-${arr.value[i + 1].endBoxNum}号】`)
                return false
              }
            }
          } else {//未连号，起始点不同（断号）
            if (arr.value[i].endBoxNum < arr.value[i + 1].startBoxNum) {//未连号，起始点不同,前一项尾数<后一项起始数（断号）
              vue.$message.warning(`装箱箱号存在断号，未使用箱号：【装箱箱号：${Number(arr.value[i].endBoxNum) + 1}-${arr.value[i + 1].startBoxNum - 1} 号】`)
              return false
            } else {//未连号，起始点不同,前一项尾数>=后一项起始数（存在包含）
              vue.$message.warning(`不同箱号段不能存在包含关系，请检查填写的装箱箱号，错误数据：【装箱箱号：${arr.value[i].startBoxNum}-${arr.value[i].endBoxNum} 号】【装箱箱号：${arr.value[i + 1].startBoxNum}-${arr.value[i + 1].endBoxNum}号】`)
              return false
            }

          }
        }

      }
      console.log(arr.value, 5555555555);
      const info = {
        boxVo: tableData.value,
        fbaShippingMethod: ruleForm.value.fbaShippingMethod,
        shipId: shipId.value
      };
      btnLoading.value = true;
      api.fba.submitBoxManipulate(info).then((res) => {
        if (res.code == 200) {
          vue.$message.success(res.msg);
          getTableData()
          handleClose();
        } else {
          vue.$message.warning(res.msg);
        }
        btnLoading.value = false;
      }).catch(() => {
        btnLoading.value = false;
      });
    })
    .catch(() => {
      vue.$message.error("表单填写有误,请检查");
      btnLoading.value = false;
    });
}
//新增数据
const addList = () => {
  tableData.value.push({
    endBoxNum: '',
    sku: '',
    transferWarehouses: [],
    transferWarehouse: '',
    startBoxNum: '',
    isInternalPower: false,
    isMagnetic: false,
  })
}
//删除数据
const deleteList = index => {
  tableData.value.splice(index, 1)
}

//修改拣货数据
const updateData = () => {
  vue.$refs.FbaModifyPickDataRef.getMsg(skuList.value, shipId.value)
}
defineExpose({ getMsg })
</script>
<style scoped lang='scss'>
#FbaDeliveryPlanPacking {
  .flex {
    display: flex;
    justify-content: center;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>