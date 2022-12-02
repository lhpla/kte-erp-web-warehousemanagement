<!--封箱列表导出数据列表 -->
<template>
  <div id="SealingExportDataList">
    <el-dialog
      v-model="dialogVisible"
      width="50%"
      title="导出柜号数据"
      :close-on-click-modal="false"
      :before-close="handleClose"
      destroy-on-close
      :close-on-press-escape="false"
    >
      <el-form
        size="mini"
        label-width="100px"
        :model="formData"
        :rules="rules"
        ref="ruleForm"
        class="demo-form-inline"
      >
        <el-form-item label="柜号:" prop="cabinetNum">
          <el-input
            v-model.trim="formData.cabinetNum"
            style="width: 200px"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="创建时间:" prop="createTime">
          <el-date-picker
            v-model="formData.createTime"
            @change="createDateBlur(formData.createTime)"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="是否封箱:" prop="status">
          <el-select
            v-model="formData.status"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option label="全部" value="0"></el-option>
            <el-option
              v-for="item in warehouse_cases_status"
              :key="item.dizKey"
              :label="item.value"
              :value="item.dizKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓区:" class="SearchPanel-form-item">
          <el-select
            filterable
            clearable
            v-model="formData.purposeWarehouseId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in purposeWarehouseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="handleClose"
            :loading="submitActive"
            :disabled="submitActive"
            size="mini"
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="submit"
            :loading="submitActive"
            :disabled="submitActive"
            size="mini"
            >确 定</el-button
          >
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
} from "vue";
import { localGet, parseTime, download } from "@/utils/util";
export default {
  name: "SealingExportDataList",
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      purposeWarehouseList: [], // 仓区
      formData: {
        createTime: [],
        cabinetNum: "",
        status: "",
        purposeWarehouseId: "",
      },
      submitActive: false,
      warehouse_cases_status: [], //封箱字典
      rules: {
        cabinetNum: [
          { required: false, message: "请输入", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              let ret = /^([0-9]*)$/;
              if (!ret.test(value)) {
                callback(new Error("请输入数字"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        createTime: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
      },
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    const ruleForm = ref(null);
    //打开弹窗
    const getMsg = () => {
      data.warehouse_cases_status = localGet("purchaseDict")
        .warehouse_cases_status
        ? localGet("purchaseDict").warehouse_cases_status
        : [];
      data.dialogVisible = true;
      // 仓区
      api.system.getWareHouseList({ type: 0 }).then((res) => {
        if (res.code == 200) {
          data.purposeWarehouseList = res.data;
        }
      });
    };
    //关闭弹窗
    const handleClose = () => {
      ruleForm.value.resetFields();
      data.formData = {
        createTime: [],
        cabinetNum: "",
        status: "",
        purposeWarehouseId: "",
      };
      data.dialogVisible = false;
    };
    //导出
    const submit = () => {
      ruleForm.value.validate((valid) => {
        if (valid) {
          let msg = {
            cabinetNum: data.formData.cabinetNum,
            endTime: data.formData.endTime,
            startTime: data.formData.startTime,
            status: "",
            purposeWarehouseId: data.formData.purposeWarehouseId
              ? data.formData.purposeWarehouseId
              : null,
          };
          if (data.formData.status == 0) {
            let arr = [];
            for (let item of data.warehouse_cases_status) {
              arr.push(item.dizKey);
            }
            msg.status = arr;
          } else {
            msg.status = [data.formData.status];
          }
          //导出
          api.warehouse.casesInfoExcelExport(msg).then((res) => {
            let tempName = "封箱数据";
            let fileType = ".xlsx";
            const blob = new Blob([res], {
              // type: "application/msword;charset=UTF-8",
            });
            if ("msSaveOrOpenBlob" in navigator) {
              window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
              return;
            }
            const blobUrl = window.URL.createObjectURL(blob);
            download(blobUrl, tempName, fileType);
            handleClose();
          });
        }
      });
    };

    //创建时间事件
    const createDateBlur = (e) => {
      if (e) {
        data.formData.startTime = parseTime(e[0]);
        data.formData.endTime = parseTime(e[1]);
      } else {
        data.formData.startTime = "";
        data.formData.endTime = "";
      }
    };

    return {
      ...refData,
      handleClose,
      submit,
      getMsg,
      createDateBlur,
      ruleForm,
    };
  },
};
</script>
<style scoped lang="scss"></style>
