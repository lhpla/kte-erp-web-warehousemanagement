<!--添加库位  AddLocation-->
<template>
  <div id="AddLocation">
    <el-dialog v-model="dialogVisible" :title="`${dialogType == 'add' ? '添加库位' : '编辑库位'}`" width="50%"
      :close-on-click-modal="false" @close="close" :close-on-press-escape="false">
      <div>
        <el-form :model="ruleForm" ref="ruleFormRef" label-width="120px"  :inline="true" :rules="rules">
          <div class="AddLocation_list">
            <div class="AddLocation_item">
              <el-form-item label="仓库:" prop="warehouseId" class="form_item">
                <el-select v-model="ruleForm.warehouseId"  filterable clearable placeholder="请选择仓库"
                  @change="warehouseChange">
                  <el-option v-for="item in transitWarehouseList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="仓库代码:" prop="warehouseCode" class="form_itemm">
                <el-input v-model="ruleForm.warehouseCode" style="width: 193px;" maxlength="100" clearable
                  placeholder="请选择仓库" :disabled="true">
                </el-input>
              </el-form-item>
            </div>
            <div class="AddLocation_item">
              <el-form-item label="库位编码:" prop="storageLocation" class="form_item">
                <el-input v-model="ruleForm.storageLocation" style="width: 193px;" maxlength="100" clearable>
                </el-input>
              </el-form-item>
              <el-form-item label="状态:" prop="state" class="Sform_item">
                <el-select v-model="ruleForm.state" filterable clearable placeholder="请选择">
                  <el-option label="禁用" :value="false"></el-option>
                  <el-option label="启用" :value="true"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="AddLocation_item">
              <el-form-item label="临时库" prop="temporaryLocation" class="form_item">
                <el-radio-group v-model="ruleForm.temporaryLocation">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="AddLocation_item">
              <el-form-item label="描述:" prop="describe" class="form_item">
                <el-input v-model="ruleForm.describe" type="textarea" maxlength="500" style="width: 193px;" clearable>
                </el-input>
              </el-form-item>
            </div>
          </div>

        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close" :loading="btnLoading" size="small">取消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="btnLoading" size="small">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick, inject } from 'vue';
export default {
  name: 'AddLocation',
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      btnLoading: false,
      dialogType: 'add',
      id: '',
      rules: {
        warehouseCode: [{ required: true, message: '未填写', trigger: 'change' }],
        warehouseId: [{ required: true, message: '未填写', trigger: 'change' },],
        storageLocation: [{ required: true, message: '未填写', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            let ret = /^[0-9a-zA-Z-]+$/;
            if (!ret.test(value)) {
              callback(new Error("库位格式错误，库位只能填写字母，数字，-"));
            } else {
              callback();
            }
          },
          trigger: "blur",
        }],
        state: [{ required: true, message: '未填写', trigger: 'change' }],
        temporaryLocation: [{ required: true, message: '未填写', trigger: 'change' }],
      },
      ruleForm: {
        warehouseCode: '',//仓库代码
        warehouseId: '',//仓库
        storageLocation: '',//库位编码
        state: '',//状态
        temporaryLocation: false,//临时库
        describe: ''//描述
      },
      transitWarehouseList: [],
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { })
    onMounted(() => { })
    const ruleFormRef = ref()
    const getTableData = inject('getTableData')
    //关闭弹窗
    const close = () => {
      data.id = ''
      data.ruleForm = {
        warehouseCode: '',//仓库代码
        warehouseId: '',//仓库
        storageLocation: '',//库位编码
        state: '',//状态
        temporaryLocation: false,//临时库
        describe: ''//描述
      }
      ruleFormRef.value.clearValidate();
      data.dialogVisible = false
    }
    //打开弹窗
    const openDialog = (row) => {
      data.dialogType = row ? 'edit' : 'add'
      nextTick(() => {
        if (ruleFormRef.value) {
          ruleFormRef.value.clearValidate();
        }

      })
      // 中转仓
      api.system.getWareHouseList({ type: 1 }).then(res => {
        if (res.code == 200) {
          data.transitWarehouseList = res.data;
        }
      });
      if (data.dialogType == 'edit') {
        data.id = row.id
        getMsg(row.id)
      }
      data.dialogVisible = true
    }
    //获取库位信息
    const getMsg = (id) => {
      api.warehouseManagement.getWarehouseTemporaryLocationDetail({ id: id }).then(res => {
        if (res.code == 200) {
          for (let i in data.ruleForm) {
            data.ruleForm[i] = res.data[i]
          }
        }
      });
    }
    //通过仓库名称获取仓库代码
    const warehouseChange = (vo) => {
      if (vo) {
        data.btnLoading = true
        api.warehouseManagement.getDetail({ id: vo }).then(res => {
          if (res.code == 200) {
            data.ruleForm.warehouseCode = res.data.code
          } else {
            data.ruleForm.warehouseId = ''
            data.ruleForm.warehouseCode = ''
          }
          data.btnLoading = false
        }).catch(() => {
          data.ruleForm.warehouseId = ''
          data.ruleForm.warehouseCode = ''
          data.btnLoading = false
        })
      } else {
        data.ruleForm.warehouseId = ''
        data.ruleForm.warehouseCode = ''
      }
    }
    //添加、编辑库位
    const onSubmit = () => {
      ruleFormRef.value.validate((valid) => {
        if (valid) {
          let info = JSON.parse(JSON.stringify(data.ruleForm))
          data.btnLoading = true
          if (data.dialogType == 'edit') {//编辑
            info = Object.assign(info, { id: data.id })
            api.warehouseManagement.updateLocation(info).then(res => {
              if (res.code == 200) {
                vue.$message.success(res.msg)
                getTableData()
                close()
              } else {
                vue.$message.warning(res.msg)
              }
              data.btnLoading = false
            }).catch(() => {
              data.btnLoading = false
            })
          } else {//新增
            api.warehouseManagement.saveLocation(info).then(res => {
              if (res.code == 200) {
                vue.$message.success(res.msg)
                getTableData()
                close()
              } else {
                vue.$message.warning(res.msg)
              }
              data.btnLoading = false
            }).catch(() => {
              data.btnLoading = false
            })
          }

        }
      })
    }
    const refData = toRefs(data);
    return {
      ...refData,
      close,
      openDialog,
      onSubmit,
      ruleFormRef,
      warehouseChange
    }
  }
};
</script>
<style scoped lang='scss'>
#AddLocation {
  .AddLocation_list {
    .AddLocation_item {
      display: flex;

      .form_item {
        width: 50%;
      }
    }
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>