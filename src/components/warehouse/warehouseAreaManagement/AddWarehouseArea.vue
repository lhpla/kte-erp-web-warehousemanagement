<!-- 新增仓库 -->
<template>
  <div id="AddWarehouseArea">
    <el-dialog :title="title" v-model="dialogVisible" width="75%" :close-on-click-modal="false" @close="handleClose"
      :close-on-press-escape="false">
      <el-form :model="formItem" ref="formRef" :rules="ruleForm" :inline="true" label-width="130px"
        class="demo-ruleForm">
        <div class="flex">
          <el-form-item label="仓库代码:" prop="code">
            <el-input v-model.trim="formItem.code" class="inputWidth" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="国家地区:" prop="districtId">
            <el-select filterable clearable v-model="formItem.districtId" placeholder="请选择">
              <el-option v-for="item in countryList" :key="item.id" :label="item.cnName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库名称:" prop="name">
            <el-input v-model="formItem.name" class="inputWidth" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </div>

        <div class="flex">
          <el-form-item label="状态:" prop="status">
            <el-select v-model="formItem.status" filterable clearable placeholder="请选择">
              <el-option label="禁用" :value="false"></el-option>
              <el-option label="启用" :value="true"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否需要头程:" prop="isFirstVessel">
            <el-select v-model="formItem.isFirstVessel" filterable clearable placeholder="请选择"
              @change="isHeaderAttribute">
              <el-option label="否" :value="false"></el-option>
              <el-option label="是" :value="true"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人:" prop="contacter">
            <el-input v-model="formItem.contacter" class="inputWidth" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </div>

        <div class="flex">
          <el-form-item label="电话:" prop="phoneNo">
            <el-input v-model.trim="formItem.phoneNo" class="inputWidth" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="邮编:" prop="postcode">
            <el-input v-model.trim="formItem.postcode" class="inputWidth" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="仓库类型:" prop="type">
            <el-select v-model="formItem.type" filterable clearable placeholder="请选择">
              <el-option label="国外仓" :value="0"></el-option>
              <el-option label="国内仓" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="flex">
          <el-form-item label="是否直发:" prop="isDirect" v-if="formItem.type == 1">
            <el-select v-model="formItem.isDirect" filterable clearable placeholder="请选择">
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="绑定中转仓:" prop="tranWarehouseIds" v-if="formItem.type == 0">
            <el-select v-model="formItem.tranWarehouseIds" multiple filterable clearable placeholder="请选择">
              <el-option v-for="item in tranWarehouseList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="头程属性:" prop="headerAttribute" v-if="formItem.isFirstVessel">
            <el-select v-model="formItem.headerAttribute" filterable clearable placeholder="请选择">
              <el-option v-for="item in headerAttributeList" :key="item.dizKey" :label="item.value"
                :value="item.dizKey"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="柜号代码:" prop="cabinetCode" v-if="
            (formItem.type == 1 && formItem.isDirect === false) ||
            formItem.type == 0
          ">
            <el-input v-model.trim="formItem.cabinetCode" @focus="cabinetCodeRules" placeholder="请输入" class="inputWidth"
              clearable></el-input>
          </el-form-item>
          <el-form-item label="免审体积:" prop="notAuditVolume" v-if="formItem.type == 1">
            <el-input v-model.trim="formItem.notAuditVolume" class="inputWidth" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </div>

        <div class="textarea">
          <el-form-item label="收货地址:" prop="streetAddress">
            <el-input v-model="formItem.streetAddress" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入" clearable></el-input>
          </el-form-item>

          <!-- <el-form-item label="库容:">
            <el-input v-model.trim="formItem.orderCode" placeholder="请输入" clearable></el-input>
          </el-form-item> -->
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="handleClose" :disabled="isDisabled" :loading="isDisabled">取 消</el-button>
          <el-button type="primary" :disabled="isDisabled" :loading="isDisabled" size="small" @click="allSubmit">保 存
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
  computed,
} from "vue";
import { localGet } from "@/utils/util";
export default {
  name: "AddWarehouseArea",
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      isDisabled: false,
      title: "新增",
      formItem: {
        tranWarehouseIds: [],
        AddWarehouseArea: 3
      },
      countryList: [], // 国家列表
      tranWarehouseList: [], // 国内仓列表
      headerAttributeList: [], //头程属性
      ruleForm: {
        phoneNo: [
          { required: false, message: "请输入手机号码", trigger: "blur" },
          {
            validator: function (rule, value, callback) {
              if (value) {
                if (/^1/.test(value)) {
                  if (/^1\d{10}$/.test(value)) {
                    callback();
                  } else {
                    callback(new Error("请输入11位的手机号"));
                  }
                } else if (/^0/.test(value)) {
                  if (/^0\d{2,4}-?\d{6,9}$/.test(value)) {
                    callback();
                  } else {
                    callback(new Error("请用0xxx-xxxxxxx格式"));
                  }
                } else {
                  callback(new Error("输入11位号码或0xxx-xxxxxxx格式"));
                }
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
        code: [{ required: true, message: "请输入", trigger: "blur" }],
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        districtId: [{ required: true, message: "请选择", trigger: "change" }],
        type: [{ required: true, message: "请选择", trigger: "change" }],
        status: [{ required: true, message: "请选择", trigger: "change" }],
        isDirect: [{ required: true, message: "请选择", trigger: "change" }],
        headerAttribute: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        isFirstVessel: [
          { required: true, message: "请选择是否需要头程", trigger: "change" },
        ],
        cabinetCode: [{ required: true, message: "请输入", trigger: "blur" }],
        notAuditVolume: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
      },
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      data.headerAttributeList = localGet("purchaseDict").header_attribute
        ? localGet("purchaseDict").header_attribute
        : [];
    });
    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (list, dizKey) {
        if (list.length > 1 && dizKey !== -1) {
          for (let item of list) {
            if (dizKey == item.dizKey) {
              return item.value;
            }
          }
        }
      };
    });
    const refData = toRefs(data);
    const formRef = ref(null);
    const isHeaderAttribute = (bool) => {
      if (bool) {
        data.ruleForm.headerAttribute = [
          { required: true, message: "请选择", trigger: "change" },
        ];
      } else {
        data.ruleForm.headerAttribute = [
          { required: false, message: "请选择", trigger: "change" },
        ];
      }
    };
    // 获取信息
    const getMsg = (id) => {
      data.dialogVisible = true;
      // 国内仓列表
      api.system.getWareHouseList({ type: 1 }).then((res) => {
        data.tranWarehouseList = res.data;
      });

      if (id) {
        data.title = "修改";
        api.warehouse.wareHouseGetDetail({ id: id }).then((res) => {
          if (res.code == 200) {
            data.formItem = res.data;
            data.formItem.headerAttribute =
              data.formItem.headerAttribute == -1
                ? ""
                : data.formItem.headerAttribute;
            data.formItem.cabinetCode =
              data.formItem.cabinetCode == -1 ? "" : data.formItem.cabinetCode;
            data.formItem.notAuditVolume =
              data.formItem.notAuditVolume == -1
                ? "3"
                : data.formItem.notAuditVolume;
            if (data.formItem.isFirstVessel) {
              data.ruleForm.headerAttribute = [
                { required: true, message: "请选择", trigger: "change" },
              ];
            } else {
              data.ruleForm.headerAttribute = [
                { required: false, message: "请选择", trigger: "change" },
              ];
            }
          } else {
            vue.$message.warning(res.msg);
          }
        });
      } else {
        data.title = "新增";
        data.formItem = {};
      }
      getDataList();
    };
    // 获取基础信息
    const getDataList = () => {
      api.warehouse.getCountryList().then((res) => {
        if (res.code == 200) {
          data.countryList = res.data;
        }
      });
    };
    // 关闭
    const handleClose = () => {
      data.dialogVisible = false;
      data.isDisabled = false;
      if (formRef.value) {
        formRef.value.clearValidate();
        formRef.value.resetFields();
      }
      data.formItem = {};
    };
    const getTableData = inject("getTableData");
    //柜号代码验证规则
    const cabinetCodeRules = () => {
      if (data.formItem.type == 1 && data.formItem.isDirect === false) {
        data.ruleForm.cabinetCode = [
          { required: true, message: "请输入", trigger: "blur" },
          {
            validator: function (rule, value, callback) {
              if (value) {
                if (!/^[A-Z]{1,1}$/.test(value)) {
                  callback(new Error("请输入柜号代码"));
                } else {
                  callback();
                }
              } else {
                callback(new Error("请输入柜号代码"));
              }
            },
          },
        ];
      } else if (data.formItem.type == 0) {
        data.ruleForm.cabinetCode = [
          { required: true, message: "请输入", trigger: "blur" },
          {
            validator: function (rule, value, callback) {
              if (value) {
                console.log(/^[A-Z]{1,1}$/.test(value));
                if (!/^[A-Z]{2,2}$/.test(value)) {
                  callback(new Error("请输入正确柜号代码"));
                } else {
                  callback();
                }
              } else {
                callback(new Error("请输入正确柜号代码"));
              }
            },
          },
        ];
      }
    };
    // 保存
    const allSubmit = () => {
      cabinetCodeRules();
      formRef.value.validate((valid) => {
        if (valid) {
          data.formItem.name = data.formItem.name
            ? data.formItem.name.trim()
            : "";
          data.formItem.contacter = data.formItem.contacter
            ? data.formItem.contacter.trim()
            : "";
          data.formItem.streetAddress = data.formItem.streetAddress
            ? data.formItem.streetAddress.trim()
            : "";
          data.formItem.tranWarehouseIds =
            data.formItem.type == 1 ? [] : data.formItem.tranWarehouseIds;
          data.formItem.tranWarehouse =
            data.formItem.type == 1 ? "" : data.formItem.tranWarehouse;
          data.formItem.headerAttribute = data.formItem.isFirstVessel
            ? data.formItem.headerAttribute
            : "";
          data.formItem.isDirect =
            data.formItem.type == 1 ? data.formItem.isDirect : false;
          data.isDisabled = true;
          api.warehouse
            .wareHouseSubmit(data.formItem)
            .then((res) => {
              if (res.code == 200) {
                vue.$message.success({
                  message: res.msg,
                  type: "success",
                });
                handleClose();
                getTableData();
                data.isDisabled = false;
              } else {
                data.isDisabled = false;
                vue.$message.warning({
                  message: res.msg,
                  type: "warning",
                });
              }
            })
            .catch((e) => {
              data.isDisabled = false;
            });
        }
      });
    };

    return {
      ...refData,
      getMsg,
      handleClose,
      getDataList,
      formRef,
      allSubmit,
      getTableData,
      tableTypeComputed,
      isHeaderAttribute,
      cabinetCodeRules,
    };
  },
};
</script>
<style scoped lang="scss">
#AddWarehouseArea {
  .demo-ruleForm {
    .flex {
      width: 100%;
    }

    .el-form-item {
      width: 32%;
    }
  }

  .inputWidth {
    width: 168px;
  }

  :deep(.textarea .el-form-item) {
    width: 100% !important;
  }

  :deep(.textarea .el-form-item__content) {
    width: 20% !important;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
