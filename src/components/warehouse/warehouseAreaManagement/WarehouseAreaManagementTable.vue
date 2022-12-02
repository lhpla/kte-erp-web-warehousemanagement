<!-- 仓区管理 表格 -->
<template>
  <div id="WarehouseAreaManagementTable">
    <div class="table-box">
      <div class="table-header">
        <el-button type="primary" size="small" @click="addWare" v-if="buttonAuthor.add">添加仓库</el-button>
      </div>
    </div>
    <el-table v-loading="tableLoading" height="calc(100vh - 310px)" :data="tableData" border style="width: 100%"
      :header-cell-style="{
        background: '#fafafa',
        color: '#2d2f30',
        fontWeight: 'bold',
        fontSize: '12px',
      }">
      <el-table-column type="index" width="50" align="center" label="NO."></el-table-column>
      <el-table-column label="仓库代码" prop="code"></el-table-column>
      <el-table-column label="仓库名称" prop="name"></el-table-column>
      <el-table-column label="类型" prop="type">
        <template #default="scope">
          <div>
            {{ scope.row.type == 0 ? "国外仓" : "国内仓" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="头程属性" prop="headerAttribute">
        <template #default="scope">
          <div>
            {{
            scope.row.headerAttribute
            ? tableTypeComputed(
            headerAttributeList,
            scope.row.headerAttribute
            )
            : "-"
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="地区" prop="district"></el-table-column>
      <el-table-column label="状态" prop="status">
        <template #default="scope">
          <div>
            {{ scope.row.status ? "启用" : "禁用" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="日期" prop="createTime"></el-table-column>
      <el-table-column label="操作" align="center" min-width="70px">
        <template #default="scope">
          <div class="oper">
            <el-button  type="primary" text  @click="addWare(scope.row)" v-if="buttonAuthor.edit">编辑
          </el-button>
          <el-button  type="primary" text 
            v-if="scope.row.status && buttonAuthor.abandoned" @click="handleDown(scope.row)">
            禁用
          </el-button>
          <el-button  type="primary" text 
            v-if="!scope.row.status && buttonAuthor.abandoned" @click="handleDown(scope.row)">
            启用
          </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <AddWarehouseArea ref="AddWarehouseArea"></AddWarehouseArea>
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
import AddWarehouseArea from "./AddWarehouseArea.vue";
import authorButtons from "@/compositionApi/authorButtons";
export default {
  name: "WarehouseAreaManagementTable",
  props: ["tableData", "tableLoading"],
  components: { AddWarehouseArea },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      headerAttributeList: [],
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
    // 添加 编辑
    const addWare = (row) => {
      vue.$refs.AddWarehouseArea.getMsg(row.id);
    };
    const getTableData = inject("getTableData");
    // 禁用
    const handleDown = (row) => {
      vue
        .$confirm("此操作将更改该仓库状态, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          buttonSize: "small"
        })
        .then(() => {
          // 禁用
          api.warehouse
            .wareHouseDisable({ wareHouseId: row.id, status: !row.status })
            .then((res) => {
              if (res.code == 200) {
                vue.$message({
                  type: "success",
                  message: "修改成功!",
                });
                getTableData();
              } else {
                vue.$message({
                  type: "warning",
                  message: res.msg,
                });
              }
            });
        })
        .catch(() => {
          vue.$message({
            type: "info",
            message: "已取消修改",
          });
        });
    };
    return {
      ...refData,
      addWare,
      handleDown,
      getTableData,
      buttonAuthor,
      tableTypeComputed,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
