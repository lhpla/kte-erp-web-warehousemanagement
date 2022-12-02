<!-- 封箱弹窗 -->

  <template>
  <div id="SealingPop">
    <el-dialog v-model="dialogVisible" width="50%" title="确认封箱" :close-on-click-modal="false" :before-close="handleClose" :close-on-press-escape="false">
      <el-form ref="custForm" size="mini" label-width="200px" :model="custOrder" :rules="rule" class="demo-form-inline" :inline="true">
        <el-form-item label="库位:" prop="lcCode">
          <el-select v-model="custOrder.lcCode" size="mini" class="width-240" filterable clearable placeholder="发货仓库">
            <el-option v-for="item in locationList" :key="item.ltCode" :label="item.ltCode" :value="item.lcId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注意：">
          <div class="color-red">同步易仓，传对应SKU库位，请业务人员选择易仓库位</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose" :loading="submitActive" :disabled="submitActive" size="mini">取 消</el-button>
          <el-button type="primary" @click="submit" :loading="submitActive" :disabled="submitActive" size="mini">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>


<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
export default {
  name: "SealingPop",
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      submitActive: false,
      custOrder: {
        lcCode: "",
      },
      rule: {
        lcCode: [{ required: true, message: "请选择", trigger: "change" }],
      },
      serialNum: "",
      locationList: [], //库位
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    const custForm = ref(null);
    //打开封箱弹窗
    const getMsg = (serialNum, warehouseId, foreignWarehouseId, transportMode) => {
      data.serialNum = serialNum;
      data.dialogVisible = true;
      data.locationList = [];
      getLocationList(warehouseId, foreignWarehouseId, transportMode);
    };
    //根据国内仓获取库位
    const getLocationList = (warehouseId, foreignWarehouseId, transportMode) => {
      api.warehouse.getLocationList({ warehouseId: warehouseId, foreignWarehouseId: foreignWarehouseId, transportMode: transportMode }).then(res => {
        if (res.code == 200) {
          data.locationList = res.data;
        }
      });
    };
    const getTableData = inject("getTableData");
    // 封箱
    const submit = () => {
      custForm.value.validate(valid => {
        if (valid) {
          data.submitActive = true;
          api.warehouse
            .sealWarehouseCases({ serialNum: data.serialNum, lcCode: data.custOrder.lcCode })
            .then(res => {
              if (res.code == 200) {
                vue.$message({
                  type: "success",
                  message: res.msg,
                });
                data.submitActive = false;
                getTableData();
                handleClose();
              } else {
                vue.$message({
                  type: "warning",
                  message: res.msg,
                });
                data.submitActive = false;
              }
            })
            .catch(() => {
              data.submitActive = false;
            });
        }
      });
    };
    //关闭弹窗
    const handleClose = () => {
      if (custForm.value) {
        custForm.value.clearValidate();
        custForm.value.resetFields();
      }
      data.dialogVisible = false;
    };
    return {
      ...refData,
      submit,
      custForm,
      handleClose,
      getMsg,
      getTableData,
    };
  },
};
</script>
<style scoped lang='scss'></style>