<!--库位管理表格 LocationManagementTable -->
<template>
  <div id="LocationManagementTable">
    <div class="operation">
      <el-button type="primary" size="small" @click="edit()" v-if="buttonAuthor.add">添加</el-button>
    </div>
    <div>
      <vxe-table border show-header-overflow show-overflow :row-config="{ isHover: true }" :data="tableData"
        :column-config="{ resizable: true }">
        <vxe-column type="seq" title="NO." width="60" align="center"></vxe-column>
        <vxe-column field="storageLocation" title="库位" align="center">
          <template #default="scope">
            {{ scope.row.storageLocation ? scope.row.storageLocation : '-' }}
          </template>
        </vxe-column>
        <vxe-column field="warehouseName" title="仓库名称" align="center">
          <template #default="scope">
            {{ scope.row.warehouseName ? scope.row.warehouseName : '-' }}
          </template>
        </vxe-column>
        <vxe-column field="warehouseCode" title="仓库代码" align="center">
          <template #default="scope">
            {{ scope.row.warehouseCode ? scope.row.warehouseCode : '-' }}
          </template>
        </vxe-column>
        <vxe-column field="state" title="状态" width="100" align="center">
          <template #default="scope">
            {{ scope.row.state ? '启用' : '禁用' }}
          </template>
        </vxe-column>
        <vxe-column field="temporaryLocation" title="临时库位" width="80" align="center">
          <template #default="scope">
            {{ scope.row.temporaryLocation ? '是' : '否' }}
          </template>
        </vxe-column>
        <vxe-column field="updateTime" title="更新时间" align="center">
          <template #default="scope">
            {{ scope.row.updateTime ? scope.row.updateTime : '-' }}
          </template>
        </vxe-column>
        <vxe-column field="address" title="操作" align="center">
          <template #default="scope">
            <span v-if="buttonAuthor.edit">
              <el-button type="primary" text @click="edit(scope.row)">编 辑</el-button>
            </span>
            <span v-if="buttonAuthor.enable">
              <el-button type="primary" text @click="enable(scope.row, true)" v-if="!scope.row.state">启 用</el-button>
            </span>
            <span v-if="buttonAuthor.abandoned">
              <el-button type="primary" text @click="enable(scope.row, false)" v-if="scope.row.state">禁 用</el-button>
            </span>
            <span v-if="buttonAuthor.log">
              <el-button type="primary" text @click="journal(scope.row.id)">日 志</el-button>
            </span>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <!-- 编辑、添加库位 -->
    <AddLocation ref="AddLocationRef"></AddLocation>
    <!-- 日志 -->
    <newLogDialog ref="newLogDialogRef">
      <template #column>
        <el-table-column label="#" type="index" align="center" width="100"></el-table-column>
        <el-table-column prop="createUserName" label="操作人" width="110"></el-table-column>
        <el-table-column prop="logContent" label="操作内容"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" width="180"></el-table-column>
      </template>
    </newLogDialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick, inject } from 'vue';
import AddLocation from './AddLocation.vue';
import newLogDialog from "@/components/logDialog/newLogDialog.vue";
import authorButtons from "@/compositionApi/authorButtons";
import { ElMessageBox } from 'element-plus'
export default {
  name: "LocationManagementTable",
  props: {
    tableLoading: {
      type: Boolean,
      default: false,
    },
    tableData: {
      type: Array,
    },
  },
  components: { newLogDialog, AddLocation },
  setup(prop, ctx) {
    const data = reactive({
      logContent: 'logContent'
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    onBeforeMount(() => { });
    onMounted(() => { });
    const getTableData = inject('getTableData')
    //添加、编辑库位
    const edit = (row) => {
      vue.$refs.AddLocationRef.openDialog(row)
    };
    //禁用、启用
    const enable = (row, isEnble) => {
      let info = JSON.parse(JSON.stringify(row))
      info.state = isEnble
      ElMessageBox.confirm(
        `确认该库位状态为${isEnble ? '"启用"' : '"禁用"'}, 是否继续?`,
        `${isEnble ? '启用' : '禁用'}`,
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          buttonSize: "small"
        }
      )
        .then(() => {
          api.warehouseManagement.disableLocation(info).then(res => {
            if (res.code == 200) {
              getTableData()
              vue.$message.success(res.msg)
            }
          })
        })
        .catch(() => { })
    }
    //journal 日志
    const journal = (id) => {
      let msg = {
        servers: "warehouseManagement",
        dataApi: "selectLocationLog",
        params: { temporaryLocationId: id }
      };

      nextTick(() => {
        vue.$refs.newLogDialogRef.checkLogDialog(msg);
      });
    };
    const refData = toRefs(data);
    return {
      ...refData,
      enable,
      edit,
      journal,
      buttonAuthor
    };
  },
};
</script>
<style scoped lang='scss'>
#LocationManagementTable {
  margin-bottom: 55px;

  .operation {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    background: #f5f5f5
  }

  .button {
    margin-right: 5px;
  }
}
</style>