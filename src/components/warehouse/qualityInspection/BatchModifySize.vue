<!-- 质检  批量修改尺寸 -->
<template>
  <div id="BatchModifySize">
    <el-dialog :title="`SKU：${formItemCope.sku ? formItemCope.sku : '-'}`" v-model="dialogVisibleBatch" width="40%"
      :close-on-click-modal="false" :before-close="handleClose" :close-on-press-escape="false">
      <div style="max-height:50vh">
        <el-collapse v-model="activeNames" v-if="formItemCope && formItemCope.result" class="el-collapse ">
          <template v-for="(list, index) of formItemCope.result" :key="index">
            <el-collapse-item v-if="formItemCope.warehouseInfoVos && formItemCope.warehouseInfoVos[index]"
              :title="`${list.warehouse}：${list.receiptNum}`" :name="index + 1">
              <el-table :data="list.boxList" border stripe style="width: 100%"
                :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }">
                <el-table-column label="柜号" prop="cabinetNum" width="100px"></el-table-column>
                <el-table-column label="装箱数量" prop="encasementNum" width="100px"></el-table-column>
                <el-table-column label="尺寸（长x宽x高）cm" min-width="210">
                  <template #default="{ row, $index }">
                    <el-form :model="row" :rules="attrRules" :ref="`attrForm${$index}${activeNames[index]}`">
                      <div style="display: flex;">
                        <el-form-item label="" v-if="$index >= 0" prop="length">
                          <el-input clearable v-model.trim="row.length" style="width: 90px"></el-input>
                        </el-form-item>
                        &nbsp;&nbsp;
                        <el-form-item label="" v-if="$index >= 0" prop="width">
                          <el-input clearable v-model.trim="row.width" style="width: 90px"></el-input>
                        </el-form-item>
                        &nbsp;&nbsp;
                        <el-form-item label="" v-if="$index >= 0" prop="height">
                          <el-input clearable v-model.trim="row.height" style="width: 90px"></el-input>
                        </el-form-item>
                      </div>
                    </el-form>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </template>
        </el-collapse>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="handleClose" :disabled="btnLoading" :loading="btnLoading">取 消</el-button>
          <el-button type="primary" size="small" :disabled="btnLoading" :loading="btnLoading" @click="submit">确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, watch } from "vue";
import { deepClone } from "../../../utils/util";
export default {
  name: "BatchModifySize",
  props: ["formItem"],
  setup(prop, ctx) {
    const data = reactive({
      dialogVisibleBatch: false,
      activeNames: [1],
      btnLoading: false,
      formItemCope: {},
      attrRules: {
        length: [
          { required: true, message: "请输入", trigger: "blur" },
          { pattern: /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/, message: "格式错误", trigger: "blur" }
        ],
        width: [
          { required: true, message: "请输入", trigger: "blur" },
          { pattern: /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/, message: "格式错误", trigger: "blur" }
        ],
        height: [
          { required: true, message: "请输入", trigger: "blur" },
          { pattern: /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/, message: "格式错误", trigger: "blur" }
        ]
      }
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    // watch(
    //   () => prop.formItem,
    //   val => {
    //     ctx.emit("update:formItem", val);
    //   },
    //   {
    //     deep: true
    //   }
    // );
    const allMergeList = ref([]);
    //打开批量修改弹窗
    const openDialog = () => {
      data.btnLoading = true;
      data.formItemCope = deepClone(prop.formItem);
      data.formItemCope.result.map(warehouseInfo => {
        const mergeList = [];
        warehouseInfo.boxList = warehouseInfo.boxList.filter(itemF => {
          return itemF.isAlter;
        })
        warehouseInfo.boxList = warehouseInfo.boxList.filter(itemF => {
          return itemF.casesStatus != 'freeze';
        })
        warehouseInfo.boxList = warehouseInfo.boxList.filter(itemF => {
          return itemF.casesStatus != 'out_storage';
        })
        warehouseInfo.boxList = warehouseInfo.boxList.filter(itemF => {
          return itemF.casesStatus != 'stuffing';
        })
        warehouseInfo.boxList.map(row => {
          if (mergeList.length > 0) {
            const flag = ref(true);
            mergeList.map((e, index) => {
              if (e.cabinetNum == row.cabinetNum && e.encasementNum == row.encasementNum) {
                flag.value = false;
              } else if (index == mergeList.length - 1 && flag.value) {
                row.length = "";
                row.width = "";
                row.height = "";
                mergeList.push(row);
              }
            });
          } else {
            row.length = "";
            row.width = "";
            row.height = "";
            mergeList.push(row);
          }
        });
        // allMergeList.value.push(mergeList);
        allMergeList.value.push({
          boxList: mergeList,
          receiptNum: warehouseInfo.receiptNum,
          warehouse: warehouseInfo.warehouse
        });
      });
      data.formItemCope.result = allMergeList.value;
      console.log(data.formItemCope.result, 'data.formItemCope.result');
      data.btnLoading = false;
      data.dialogVisibleBatch = true;
    };
    const returnData = inject("returnData");
    //关闭批量修改弹窗
    const handleClose = () => {
      data.dialogVisibleBatch = false;
      allMergeList.value = [];
      data.formItemCope = {};
      data.activeNames = [1];
    };
    //确认修改尺寸
    const submit = () => {
      // data.activeNames = Array.isArray(data.activeNames) ? data.activeNames : [data.activeNames];
      // const validateMethods = [];
      // data.activeNames.map((_, i) => {
      //   data.formItemCope.result[i].boxList.map((_, index) => {
      //     if (vue.$refs[`attrForm${index}${data.activeNames[i]}`]) {
      //       validateMethods.push(vue.$refs[`attrForm${index}${data.activeNames[i]}`].validate());
      //     }
      //   });
      //   Promise.all(validateMethods)
      //     .then(() => {
      //       returnData(allMergeList.value);
      //       handleClose();
      //     })
      //     .catch(err => {
      //       if (err) {
      //         vue.$message.error("表单填写有误,请检查");
      //       }
      //     });
      // });
      returnData(allMergeList.value);
      handleClose();
    };
    const refData = toRefs(data);
    return {
      ...refData,
      openDialog,
      submit,
      handleClose
    };
  }
};
</script>
<style scoped lang="scss">
#BatchModifySize {
  .el-collapse {
    border-top: 0;
  }
}
</style>
