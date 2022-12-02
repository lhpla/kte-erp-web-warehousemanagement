<!-- 单证搜索 -->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" ref="searchParamRef" label-width="100px" :model="searchParam"
      class="demo-form-inline el-from">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="发货计划ID :" prop="shippingId" class="SearchPanel-form-item">
          <el-input v-model.trim="searchParam.shippingId" clearable placeholder="请输入" @keyup.enter="search">
          </el-input>
        </el-form-item>
        <el-form-item label="海柜号 :" prop="overseasCabinetNum" class="SearchPanel-form-item">
          <el-input v-model.trim="searchParam.overseasCabinetNum" clearable placeholder="请输入" @keyup.enter="search">
          </el-input>
        </el-form-item>
        <el-form-item label="中转仓库 :" prop="transferWarehouseId" class="SearchPanel-form-item">
          <el-select v-model="searchParam.transferWarehouseId" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item in wareHouseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓区 :" prop="purposeWarehouseId" class="SearchPanel-form-item">
          <el-select v-model="searchParam.purposeWarehouseId" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item in warehouseAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="柜号 :" prop="cabinetNum" class="SearchPanel-form-item">
          <el-input v-model.trim="searchParam.cabinetNum" clearable placeholder="请输入" @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item label="物流服务商 :" prop="provider" v-if="buttonAuthor.isAdministrator" class="SearchPanel-form-item">
          <el-select v-model="searchParam.provider" filterable clearable placeholder="请选择服务商" @change="search">
            <el-option v-for="item in logistics_service" :key="item.dizKey" :label="item.value" :value="item.dizKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单证员 :" prop="docUserId" v-if="buttonAuthor.isAdministrator" class="SearchPanel-form-item">
          <el-select v-model="searchParam.docUserId" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item in documentUserList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出库状态 :" prop="outboundStatus" class="SearchPanel-form-item">
          <el-select v-model="searchParam.outboundStatus" filterable clearable placeholder="请选择" @change="search">
            <el-option label="已出库" :value="true"></el-option>
            <el-option label="待出库" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配状态 :" prop="docDistributeStatus" v-if="buttonAuthor.isAdministrator"
          class="SearchPanel-form-item">
          <el-select v-model="searchParam.docDistributeStatus" filterable clearable placeholder="请选择" @change="search">
            <el-option label="已分配" value="true"></el-option>
            <el-option label="待分配" value="false"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="单证状态 :" prop="docStatus" class="SearchPanel-form-item">
          <el-select v-model="searchParam.docStatus"   filterable clearable placeholder="请选择"
            @change="search">
            <el-option label="已发送" value="true"></el-option>
            <el-option label="处理中" value="false"></el-option>
          </el-select> 
        </el-form-item>-->
        <el-form-item label="单证状态 :" prop="docStatus" class="SearchPanel-form-item">
          <el-select v-model="searchParam.docStatus" filterable clearable placeholder="请选择" @change="search">
            <el-option v-for="item of doc_doc_status" :key="item.dizKey" :label="item.value" :value="item.dizKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库号 :" prop="enterWarehouseCode" class="SearchPanel-form-item">
          <el-input v-model.trim="searchParam.enterWarehouseCode" clearable placeholder="请输入" @keyup.enter="search">
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="发送日期 :" prop="endTime" class="SearchPanel-form-item">
          <el-date-picker v-model="searchParam.time" @change="dateBlur(searchParam.time)" type="datetimerange"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="时间:" class="SearchPanel-form-item">
          <div class="flex">
            <el-select v-model="searchParam.timeType" filterable clearable placeholder="请选择" class="size-width"
              @change="search">
              <el-option v-for="item in dateList" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <el-date-picker v-model="searchParam.dateTime" @change="dateBlur(searchParam.dateTime)" type="datetimerange"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </div>
        </el-form-item>
      </div>

      <div class="footer-button">
        <el-form-item>
          <el-button type="primary" text class="open" @click="searchShow = !searchShow" v-if="showSearchBtn">
            {{ searchShow ? "合并" : "展开" }}
            <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </el-button>
          <el-button type="primary" size="small" @click="reset">重 置</el-button>
          <el-button type="primary" size="small" @click="search">搜 索</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import { localGet, parseTime } from "@/utils/util";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";
export default {
  name: "DocumentSearch",
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      searchShow: false,
      searchParam: {
        shippingId: '',
        overseasCabinetNum: '',
        transferWarehouseId: '',
        purposeWarehouseId: '',
        cabinetNum: '',
        provider: '',
        docUserId: '',
        outboundStatus: "",
        docDistributeStatus: '',
        docStatus: '',
        // docAuditStatus: '',
        dateTime: '',
        timeType: "",
        enterWarehouseCode: ''
      },
      dateList: [
        { key: "generate_ship_time", value: "生成时间" },
        { key: "out_warehouse_time", value: "出库时间" },
        { key: "doc_send_time", value: "发送时间" },
      ],
      wareHouseList: [],
      //仓区
      warehouseAreaList: [],
      logistics_service: [], //服务商列表
      documentUserList: [], //单证人员列表
      doc_doc_status: [], //单证状态
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => {
      getDictList();
    });
    const refData = toRefs(data);
    const getDictList = () => {
      data.doc_doc_status = localGet("purchaseDict") && localGet("purchaseDict").doc_doc_status ? localGet("purchaseDict").doc_doc_status : [];
      //服务商列表
      data.logistics_service = localGet("purchaseDict") && localGet("purchaseDict").logistics_service ? localGet("purchaseDict").logistics_service : [];
      // 中转仓
      api.system.getWareHouseList({ type: 1 }).then(res => {
        if (res.code == 200) {
          data.wareHouseList = res.data;
        }
      });
      // 仓区
      api.system.getWareHouseList({ type: 0 }).then(res => {
        if (res.code == 200) {
          data.warehouseAreaList = res.data;
        }
      });
      //单证人员
      api.documentList.getUserPostName().then(res => {
        if (res.code == 200) {
          data.documentUserList = res.data;
        }
      });
    };
    const getTableData = inject("getTableData");
    const search = () => {
      getTableData(data.searchParam);
    };


    // 日期修改
    const dateBlur = (e) => {
      if (data.searchParam.timeType) {
        if (e) {
          data.searchParam.startTime = parseTime(e[0]);
          data.searchParam.endTime = parseTime(e[1]);
        } else {
          data.searchParam.startTime = "";
          data.searchParam.endTime = "";
        }
        search()
      } else {
        data.searchParam.dateTime = null;
        vue.$message({
          type: "warning",
          message: "请选择时间类型",
        });
      }

    };

    //重置
    const reset = () => {
      data.searchParam = {
        shippingId: '',
        overseasCabinetNum: '',
        transferWarehouseId: '',
        purposeWarehouseId: '',
        cabinetNum: '',
        provider: '',
        docUserId: '',
        outboundStatus: "",
        docDistributeStatus: '',
        docStatus: '',
        // docAuditStatus: '',
        dateTime: '',
        timeType: "",
        enterWarehouseCode: ''
      }
      search()
    }
    return {
      ...refData,
      search,
      buttonAuthor,
      getTableData,
      dateBlur,
      showSearchBtn,
      reset
    };
  },
};
</script>
<style scoped lang='scss'>
#SearchPanel {
  margin: 0;

  .size-width {
    width: 20%;
    margin-right: 10px;
  }

  .el-form-item {
    margin-bottom: 5px !important;
  }

  .form-content {
    height: 35px;
    overflow: hidden;
    transition: all 0.5s !important;
  }

  .collapseClass {
    height: auto;
    overflow: auto;
    transition: all 1s;
  }

  .footer-button {
    display: flex;
    justify-content: flex-end;
    margin-top: 5px;
  }
}
</style>
