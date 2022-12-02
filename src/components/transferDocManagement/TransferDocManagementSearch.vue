<!-- TransferDocManagementSearch 调拨单管理搜索-->
<template>
  <div id="SearchPanel">
    <el-form :model="ruleForm" ref="ruleFormRef" label-width="70px" :inline="true">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="调拨仓: " prop="transitWarehouse" class="SearchPanel-form-item">
          <el-select v-model="ruleForm.startTransferWarehouseId" filterable clearable placeholder="中转仓库"
            class="size-width" @change="search">
            <el-option v-for="item in transitWarehouseList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="ruleForm.startPurposeWarehouseId" filterable clearable placeholder="仓区" @change="search">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目的仓: " prop="transitWarehouse" class="SearchPanel-form-item">
          <el-select v-model="ruleForm.endTransferWarehouseId" filterable clearable placeholder="中转仓库"
            class="size-width" @change="search">
            <el-option v-for="item in transitWarehouseList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="ruleForm.endPurposeWarehouseId" filterable clearable placeholder="仓区" @change="search">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SKU: " prop="sku" class="SearchPanel-form-item">
          <el-input v-model="ruleForm.sku" placeholder="以英文逗号隔开，双击批量" maxlength="100" @keyup.enter="search" clearable
            @dblclick="openInput(ruleForm.sku)">
          </el-input>
        </el-form-item>
        <el-form-item label="单号: " prop="sku" class="SearchPanel-form-item">
          <el-select v-model="orderCodeType" filterable placeholder="请选择" class="size-width select_input">
            <el-option v-for="item in orderList" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
          <el-input v-model="orderCodeTypeValue" style="width: 190px" clearable @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="操作员: " prop="sku" class="SearchPanel-form-item">
          <el-select v-model="orderCodeType1" filterable placeholder="请选择" class="size-width select_input">
            <el-option v-for="item in operatorList" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
          <el-input v-model="orderCodeTypeValue1" style="width: 190px" clearable @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="日期:" class="SearchPanel-form-item" style="margin-bottom: 1px !important;">
          <div class="flex">
            <el-select v-model="orderCodeType3" filterable placeholder="请选择" class="size-width select_input">
              <el-option v-for="item in dateList" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <el-date-picker v-model="orderCodeTypeValue3" @change="dateBlur" type="datetimerange" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" :disabled="orderCodeType3 == ''"></el-date-picker>
          </div>
        </el-form-item>
      </div>
      <el-form-item label="状态: " class="SearchPanel-form-item" style="margin-top: 15px">
        <el-checkbox-group v-model="ruleForm.status" @change="changeClick(ruleForm.status, 'status', stateList.length)">
          <el-checkbox-button label="0">全部</el-checkbox-button>
          <el-checkbox-button v-for="(item,index) of stateList" :label="item.dizKey" :key="index">{{ item.value }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <div class="footer-button">
      <el-button type="primary" text class="open" @click="searchShow = !searchShow" v-if="showSearchBtn">
        {{ searchShow ? "合并" : "展开" }}
        <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
      </el-button>
      <el-button type="primary" size="small" @click="search">搜 索</el-button>
      <el-button type="primary" size="small" @click="reset">重 置</el-button>
    </div>
  </div>

</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, watch, nextTick } from 'vue';
import { localGet, parseTime } from "@/utils/util";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";
import authorButtons from "@/compositionApi/authorButtons";
export default {
  name: 'TransferDocManagementSearch',
  props: ["searchMsg"],
  setup(prop, ctx) {
    const data = reactive({
      //中转仓库列表
      transitWarehouseList: [],
      //仓区
      warehouseAreaList: [],
      //状态列表
      stateList: [],
      searchShow: false,
      showMessage: false,
      ruleForm: {
        startTransferWarehouseId: '',
        startPurposeWarehouseId: '',
        endTransferWarehouseId: '',
        endPurposeWarehouseId: '',
        sku: '',
        transferCode: '',
        trackingNum: '',
        orderCode: '',
        outWarehouseUserName: '',
        intoWarehouseUserName: '',
        createUserName: '',
        createTimeStart: '',
        createTimeEnd: '',
        endTimeStart: '',
        outWarehouseTimeStart: '',
        outWarehouseTimeEnd: '',
        status: ['0']
      },
      startTime: '',
      endTime: '',
      orderCodeType: 'transferCode',
      orderCodeType1: 'createUserName',
      orderCodeType3: 'create_time',
      orderCodeType4: '',
      orderCodeTypeValue: '',
      orderCodeTypeValue1: '',
      orderCodeTypeValue3: '',
      orderCodeTypeValue4: '',
      orderList: [
        { value: "调拨单", key: "transferCode" },
        { value: "PO单", key: "orderCode" },
        { value: "跟踪号", key: "trackingNum" },
      ],
      operatorList: [
        { value: "创建人", key: "createUserName" },
        { value: "入库员", key: "intoWarehouseUserName" },
        { value: "出库员", key: "outWarehouseUserName" },
      ],
      dateList: [
        { key: "create_time", value: "创建时间" },
        { key: "update_time", value: "出库时间" },
        { key: "time", value: "完结时间" },
      ],
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const { showSearchBtn } = useShowSearchBtn();
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const temp = ref('');
    onBeforeMount(() => { })
    onMounted(() => {
      // data.stateList =
      //   localGet("purchaseDict") && localGet("purchaseDict").cabinet_status ? localGet("purchaseDict").cabinet_status : [];
      // // 中转仓
      // console.log(data.stateList)
      data.stateList = [{ value: '待出库', dizKey: 1 }, { value: '已出库', dizKey: 2 }, { value: ' 入库中', dizKey: 3 }, { value: '已完结', dizKey: 4 }, { value: '已作废', dizKey: 5 }]
      // api.system.getWareHouseList({ type: 1 }).then(res => {
      //   if (res.code == 200) {
      //     data.transitWarehouseList = res.data;
      //   }
      // });
      // // 仓区
      // api.system.getWareHouseList({ type: 0 }).then(res => {
      //   if (res.code == 200) {
      //     data.warehouseAreaList = res.data;
      //   }
      // });
      // 中转仓
      api.system.getWareHouseList({ type: 1 }).then(res => {
        if (res.code == 200) {
          data.transitWarehouseList = res.data;
        }
      });
      // 仓区
      api.develop.getDirectAndOverseasWarehouse({ type: 0 }).then(res => {
        if (res.code == 200) {
          data.warehouseAreaList = res.data;
        }
      });
    })
    const getTableData = inject("getTableData");
    const ruleFormRef = ref()
    const openInput = (info) => {
      temp.value = info;
      data.showMessage = true;
      vue
        .$prompt("可输入多个，以英文分号、逗号、空格或者回车隔开", "批量查询", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValue: info,
          inputType: "textarea",
          inputValidator: (value) => {
            if (value && value?.length > 500) {
              return "输入字符不能大于500 ";
            }
          },
        })
        .then(({ value }) => {
          data.ruleForm.sku = temp.value
            .trim()
            .replaceAll("\n", ",")
            .replaceAll(" ", ",")
            .replaceAll(";", ",")
            .replaceAll("，", ",")
            .replaceAll("；", ",");
          data.ruleForm.sku = data.ruleForm.sku
            .split(",")
            .filter((item) => item !== "")
            .join(",");
          data.showMessage = false;
          temp.value = "";

        })
        .catch(() => {
          temp.value = "";
          data.showMessage = false;
        });
    };
    const search = () => {
      let msg = JSON.parse(JSON.stringify(data.ruleForm));
      if (data.orderCodeType) {
        msg[data.orderCodeType] = data.orderCodeTypeValue
      } else {
        msg.transferCode = ''
        msg.trackingNum = ''
        msg.orderCode = ''
      }
      if (data.orderCodeType1) {
        msg[data.orderCodeType1] = data.orderCodeTypeValue1
      } else {
        msg.createUserName = ''
        msg.intoWarehouseUserName = ''
        msg.outWarehouseUserName = ''
      }
      if (data.orderCodeType3) {
        if (data.orderCodeType3 == 'create_time') {
          msg.createTimeStart = data.startTime
          msg.createTimeEnd = data.endTime
        }
        if (data.orderCodeType3 == 'update_time') {
          msg.outWarehouseTimeStart = data.startTime
          msg.outWarehouseTimeEnd = data.endTime
        }
        if (data.orderCodeType3 == 'time') {
          msg.endTimeEnd = data.endTime
          msg.endTimeStart = data.startTime
        }
      }
      msg.status = msg.status.join(',');
      msg.status = msg.status == 0 ? '' : msg.status;
      console.log(vue)
      getTableData(msg, true);
    }
    const handleInputREnter = (e) => {
      const index = e.srcElement.selectionStart;
      return index;
    };
    watch(
      () => data.showMessage,
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
            });
            textarea.addEventListener('input', () => {
              temp.value = textarea.value;
            })
          });
        }
      }
    );
    // 多选改变
    const changeClick = (arr, name, length) => {
      if (arr.length > 0) {
        if (arr.length == length && arr[0] !== "0") {
          data.ruleForm[name] = ["0"];
        } else if (arr[0] == "0") {
          let findResult = arr.indexOf("0");
          if (findResult !== -1) {
            data.ruleForm[name].splice(findResult, 1);
          }
        } else {
          let findResult = arr.indexOf("0");
          if (findResult !== -1) {
            data.ruleForm[name] = ["0"];
          }
        }
      } else {
        data.ruleForm[name] = ["0"];
      }
      search()
    };
    // 日期修改
    const dateBlur = (e) => {
      if (data.orderCodeType3) {
        if (e) {
          data.startTime = parseTime(e[0])
          data.endTime = parseTime(e[1])
        } else {
          data.startTime = "";
          data.endTime = "";
        }
        search()
      } else {
        data.orderCodeTypeValue3 = null;
        vue.$message({
          type: "warning",
          message: "请选择时间类型",
        });
      }
    }
    //重置
    const reset = () => {
      ruleFormRef.value.resetFields();
      const keys = Object.entries(data.ruleForm)
      for (let i in keys) {
        if (keys[i][0] == 'state') {
          data.ruleForm[keys[i][0]] = ["0"]
        } else {
          data.ruleForm[keys[i][0]] = ""
        }
      }
      data.orderCodeType = 'transferCode'
      data.orderCodeType1 = 'createUserName'
      data.orderCodeType3 = 'create_time'
      data.orderCodeTypeValue = ''
      data.orderCodeTypeValue1 = ''
      data.orderCodeTypeValue3 = ''
      data.startTime = ''
      data.endTime = ''
      data.ruleForm.status = ['0']
      search();
    };
    const refData = toRefs(data);
    return {
      ...refData,
      search,
      ruleFormRef,
      reset,
      showSearchBtn,
      dateBlur,
      changeClick,
      openInput,
    }
  }
}

</script>
<style scoped lang='scss'>
#SearchPanel {
  .footer-button {
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;
  }

  .size-width {
    margin-right: 5px;
  }

  .select_input {
    width: 120px;
  }
}

.form-content {
  height: 35px;
  overflow: hidden;
  transition: all 0.5s !important;
  flex: 0.95;
}

.collapseClass {
  height: auto;
  overflow: auto;
  transition: all 1s;
}

:deep(.el-form-item) {
  margin-right: 0px;
}
</style>
