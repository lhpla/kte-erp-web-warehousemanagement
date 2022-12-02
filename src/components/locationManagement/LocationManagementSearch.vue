<!-- 库位管理搜素 LocationManagementSearch-->
<template>
  <div id="LocationManagementSearch">
    <div>
      <el-form :model="ruleForm" ref="ruleFormRef" label-width="100px"  :inline="true">
        <el-form-item label="仓库代码:" prop="warehouseCode">
          <el-input v-model="ruleForm.warehouseCode" placeholder="支持模糊查询" maxlength="100" @keyup.enter="search"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="仓库名称:" prop="warehousName">
          <el-input v-model="ruleForm.warehousName" placeholder="支持模糊查询" maxlength="100" @keyup.enter="search"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="state">
          <el-select v-model="ruleForm.state"  filterable clearable placeholder="请选择" @change="search">
            <el-option label="全部" :value="0"></el-option>
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库位:" prop="storageLocation">
          <el-input v-model="ruleForm.storageLocation" placeholder="支持模糊查询" maxlength="100" @keyup.enter="search"
            clearable>
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="footer-button">
      <!-- <el-button type="text" size="mini" class="open" @click="searchShow = !searchShow" v-if="showSearchBtn">
        {{ searchShow ? "合并" : "展开" }}
        <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
      </el-button> -->
      <el-button type="primary" size="small"  @click="search">搜 索</el-button>
      <el-button type="primary" size="small"  @click="reset">重 置</el-button>
    </div>
  </div>

</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from 'vue';
// import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";
import authorButtons from "@/compositionApi/authorButtons";
export default {
  name: 'LocationManagementSearch',
  props: ["searchMsg"],
  setup(prop, ctx) {
    const data = reactive({
      searchShow: false,
      ruleForm: {
        warehouseCode: '',
        warehousName: '',
        state: '',
        storageLocation: ''
      }
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    // const { showSearchBtn } = useShowSearchBtn();
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    onBeforeMount(() => { })
    onMounted(() => { })
    const getTableData = inject("getTableData");
    const ruleFormRef = ref()
    const search = () => {
      let vo = {
        state: data.ruleForm.state === 0 ? '' : data.ruleForm.state,
        storageLocation: data.ruleForm.storageLocation,
        warehousName: data.ruleForm.warehousName,
        warehouseCode: data.ruleForm.warehouseCode,
        size: prop.searchMsg.size,
        current: 1,
      };
      getTableData(vo);
    }
    //重置
    const reset = () => {
      ruleFormRef.value.resetFields();
      const keys = Object.entries(data.ruleForm)
      for (let i in keys) {
        // if (keys[i][0] == 'shippingEnterCodeStatus') {
        //   data.searchParam[keys[i][0]] = ["0"]
        // } else {
        //   data.searchParam[keys[i][0]] = ""
        // }
        data.ruleForm[keys[i][0]] = ""
      }
      search();
    };
    const refData = toRefs(data);
    return {
      ...refData,
      search,
      ruleFormRef,
      reset,
      // showSearchBtn
    }
  }
};
</script>
<style scoped lang='scss'>
#LocationManagementSearch {
  .footer-button {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 10px;
  }
}
</style>