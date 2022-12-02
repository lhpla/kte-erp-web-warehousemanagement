<!-- 修改箱号 -->
<template>
  <div id="SealingTransfers">
    <el-dialog title="修改箱号" v-model="updateVisible" width="50%" :close-on-click-modal="false" :before-close="editClose" :close-on-press-escape="false">
      <el-form :model="editForm" ref="editRef" :rules="formRule" label-width="120px" class="demo-ruleForm transfersRef">
        <div>
          <el-form-item label="柜号:" prop="cabinetNum">
            <div>{{ editForm.cabinetNum }}</div>
          </el-form-item>
          <el-form-item label="箱号:" prop="cartonNum">
            <el-input v-model.trim="editForm.cartonNum" style="width: 200px" clearable></el-input>
          </el-form-item>
          <div class="flex">
            <el-form-item label="箱号尺寸(CM):"></el-form-item>
            <div class="flex">
              <el-form-item label="长" prop="length" label-width="50px">
                <el-input v-model.trim="editForm.length" style="width: 100px" clearable></el-input>
              </el-form-item>
              <el-form-item label="宽" prop="width" label-width="50px">
                <el-input v-model.trim="editForm.width" style="width: 100px" clearable></el-input>
              </el-form-item>
              <el-form-item label="高" prop="height" label-width="50px">
                <el-input v-model.trim="editForm.height" style="width: 100px" clearable></el-input>
              </el-form-item>
            </div>
          </div>
          <el-form-item>
            <div class="color-red">
              修改箱号只能完成当前柜号修改，如果当前箱号所有SKU
              进行修改箱号，该箱号将进行清除，下次收获自动补充该箱号
            </div>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" :loading="btnFlag" :disabled="btnFlag" @click="editClose">取 消</el-button>
          <el-button type="primary" size="small" :loading="btnFlag" :disabled="btnFlag" @click="saveSubmit">确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  ref,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  inject,
} from "vue";
export default {
  name: "SealingEditCartonNum",
  setup(prop, ctx) {
    const data = reactive({
      updateVisible: false,
      editForm: {},
      btnFlag: false,
      formRule: {
        length: [
          { required: true, message: "请输入", trigger: "blur" },
          { pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/, message: "格式错误" },
        ],
        width: [
          { required: true, message: "请输入", trigger: "blur" },
          { max: 8, message: "长度不超过8字符", trigger: "blur" },
          { pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/, message: "格式错误" },
        ],
        height: [
          { required: true, message: "请输入", trigger: "blur" },
          { pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/, message: "格式错误" },
        ],
        cartonNum: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const editRef = ref(null);
    const refData = toRefs(data);
    const getTableData = inject("getTableData");
    const dialogClose = inject("dialogClose");
    //获取详情
    const getMsg = (serialNum, skus, skuIdList) => {
      data.updateVisible = true;
      api.warehouse.getDetailVo({ serialNum: serialNum }).then((res) => {
        if (res.code == 200) {
          data.editForm = res.data;
          data.editForm.skus = skus;
          data.editForm.skuIdList = skuIdList;
        } else {
          vue.$message.warning(res.msg);
        }
      });
    };

    //关闭
    const editClose = () => {
      data.updateVisible = false;
      if (editRef.value) {
        editRef.value.resetFields();
        editRef.value.clearValidate();
      }
    };

    //确定
    const saveSubmit = () => {
      editRef.value.validate((valid) => {
        if (valid) {
          api.warehouse.updateCartonNum(data.editForm).then((res) => {
            if (res.code == 200) {
              vue.$message.success(res.msg);
              editClose();
              dialogClose();
              getTableData();
            } else {
              vue.$message.warning(res.msg);
            }
          });
        }
      });
    };
    return {
      ...refData,
      editClose,
      saveSubmit,
      getMsg,
      editRef,
      getTableData,
      dialogClose,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
