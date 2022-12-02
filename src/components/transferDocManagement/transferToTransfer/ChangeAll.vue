<!-- 整单修改尺寸 ChangeAll -->
<template>
  <div id="ChangeAll">
    <el-dialog v-model="UpdateDialogVisible" title="调拨入库-批量修改尺寸" width="60%" @close="handleClose" destroy-on-close :close-on-press-escape="false">
      <el-form ref="ruleFormRef" :model="ruleForm" label-width="80px" :inline="true" @submit.native.prevent>
        <el-form-item prop="sku" label="SKU: " @dblclick="openInput(ruleForm.sku, 'sku')">
          <el-input v-model="ruleForm.sku"  clearable placeholder="双击批量查询" @keyup.enter="search"
            maxlength="500"></el-input>
        </el-form-item>
        <el-form-item prop="singleCartonCount" label="单箱数量: ">
          <el-input v-model="ruleForm.singleCartonCount"  clearable placeholder="双击批量查询"
            @dblclick="openInput(ruleForm.singleCartonCount, 'singleCartonCount')" @keyup.enter="search"
            maxlength="500">
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="search" size="small">搜 索</el-button>
      </el-form>
      <vxe-table :data="tableData" border :loading="tableLoading" show-overflow :column-config="{ resizable: true }">
        <vxe-column field="sku" title="SKU" align="center" width="200px">
          <template #default="{ row }">
            {{ row.sku ? row.sku : '-' }}
          </template>
        </vxe-column>
        <vxe-column field="singleCartonCount" align="center" title="单箱数量" width="200px">
          <template #default="{ row }">
            <el-input v-model="row.singleCartonCount" clearable :disabled="true" style="width: 180px;">
            </el-input>
          </template>
        </vxe-column>
        <vxe-column title="尺寸（长x宽x高）cm" align="center">
          <template #default="{ row }">
            <div class="input_box">
              <span>
                <el-form :model="row" :rules="rules" :ref="`size_${row.index}`"
                  style="display: flex; padding-left: 10px;">
                  <el-form-item prop="length">
                    <span> 长 </span><span>
                      <el-input v-model="row.length" style="width: 60px;"></el-input>
                    </span>
                  </el-form-item>
                  <el-form-item prop="width">
                    <span style="margin-left: 5px;"> 宽 </span><span>
                      <el-input v-model="row.width" style="width: 60px;"></el-input>
                    </span>
                  </el-form-item>
                  <el-form-item prop="height">
                    <span style="margin-left: 5px;"> 高 </span><span>
                      <el-input v-model="row.height" style="width: 60px;"></el-input>
                    </span>
                  </el-form-item>
                </el-form>
              </span>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose" size="small" :disabled="btnLoading" :loading="btnLoading">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="btnLoading" :loading="btnLoading" size="small">确 认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, watch, nextTick } from "vue";
export default {
  name: "ChangeAll",
  setup(prop, ctx) {
    const data = reactive({
      UpdateDialogVisible: false,
      ruleForm: {
        sku: "",
        singleCartonCount: ""
      },
      tableData: [],
      rules: {
        length: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,
            message: "格式错误",
            trigger: "blur",
          },
        ],
        width: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,
            message: "格式错误",
            trigger: "blur",
          },
        ],
        height: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,
            message: "格式错误",
            trigger: "blur",
          },
        ],
      },
      tableLoading: false,
      btnLoading: false,
      transferCode: ''
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const ruleFormRef = ref();
    const getMsg = inject('getMsg')
    //打开弹窗
    const openDialog = (transferCode) => {
      data.transferCode = transferCode
      getList()
      data.UpdateDialogVisible = true;
    };
    //获取数据
    const getList = () => {
      const singleCartonCount = data.ruleForm.singleCartonCount ? data.ruleForm.singleCartonCount.split(',') : []
      const sku = data.ruleForm.sku ? data.ruleForm.sku.split(',') : []
      const info = {
        transferCode: data.transferCode,
        singleCartonCount: singleCartonCount,
        sku: sku
      }
      data.tableLoading = true
      api.requisitionManagement.getWholeSizeDetail(info).then((res) => {
        if (res.code == 200) {
          data.tableData = res.data
          data.tableData.map((item, index) => {
            item.index = index
          })
        } else {
          vue.$message.warning(res.msg)
        }
        data.tableLoading = false
      }).catch(() => {
        data.tableLoading = false
      })

    }
    // 搜索
    const search = () => {
      getList()
    }
    //关闭弹窗
    const handleClose = () => {
      data.ruleForm = {
        sku: "",
        singleCartonCount: ""
      }
      data.UpdateDialogVisible = false;
    };
    //批量修改尺寸
    const onSubmit = () => {
      const validateMethods = [];
      data.tableData.forEach((row) => {
        if (vue.$refs[`size_${row.index}`]) {
          validateMethods.push(
            vue.$refs[`size_${row.index}`].validate()
          );
        }
      });
      Promise.all(validateMethods)
        .then(() => {
          const info = {
            skuInfo: data.tableData,
            transferCode: data.transferCode
          }
          data.btnLoading = true
          api.requisitionManagement.WholeSizeUpdate(info).then((res) => {
            if (res.code == 200) {
              getMsg()
              vue.$message.success(res.msg)
              handleClose();
            } else {
              vue.$message.warning(res.msg)
            }
            data.btnLoading = false
          })
        }).catch(() => {
          vue.$message.error("表单填写有误,请检查");
          data.btnLoading = false
        })
    }
    const showMessage = ref(false)
    const temp = ref("");
    //批量搜索
    const openInput = (info, name) => {
      showMessage.value = true;
      vue
        .$prompt("可输入多个，以英文分号、逗号、空格或者回车隔开", "批量查询", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValue: info,
          inputType: "textarea",
          inputValidator: (value) => {
            if (value && value.length > 500) {
              return "输入字符不能大于500 ";
            }
          },
        })
        .then(({ value }) => {
          data.ruleForm[name] = temp.value
            .trim()
            .replaceAll("\n", ",")
            .replaceAll(" ", ",")
            .replaceAll(";", ",")
            .replaceAll("，", ",")
            .replaceAll("；", ",");
          data.ruleForm[name] = data.ruleForm[name]
            .split(",")
            .filter((item) => item !== "")
            .join(",");
          showMessage.value = false;
          temp.value = "";
        })
        .catch(() => {
          temp.value = "";
          showMessage.value = false;
        });
    };
    watch(
      () => showMessage.value,
      (val) => {
        if (val) {
          nextTick(() => {
            let textarea = document.getElementsByTagName("textarea")[0];
            textarea.addEventListener("keydown", (e) => {
              if (e.key === "Enter") {
                const index = handleInputREnter(e);
                textarea.value = textarea.value.substring(0, index) + "\n" + textarea.value.substring(index);
              }
              temp.value = textarea.value;
              console.log(temp.value, 45646);
            });
            textarea.addEventListener('input', () => {
              temp.value = textarea.value;
            })
          });
        }
      }
    );
    const handleInputREnter = (e) => {
      const index = e.srcElement.selectionStart;
      return index;
    };
    const refData = toRefs(data);
    return {
      ...refData,
      openDialog,
      handleClose,
      onSubmit,
      ruleFormRef,
      search,
      openInput
    };
  },
};
</script>
<style scoped lang="scss">
#ChangeAll {
  .input_box {
    display: flex;
    justify-content: center;
  }

  .add {
    color: #409eff;
    cursor: pointer;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
