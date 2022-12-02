<!--国内仓配置 -- 用户仓库 -->
<template>
    <div id="UserWarehouse">
        <div class="btnBox">
            <el-button type="primary" size="small" @click="removeUser" v-show="buttonAuthor.removeUser"
                :disabled="btnFlag" v-loading="btnFlag">移除用户</el-button>
            <el-button type="primary" size="small" @click="bindUser" v-show="buttonAuthor.bindUser" :disabled="btnFlag"
                v-loading="btnFlag">绑定用户</el-button>
            <el-button type="primary" size="small" @click="bindingLog" v-show="buttonAuthor.log" :disabled="btnFlag"
                v-loading="btnFlag">绑定日志</el-button>
        </div>
        <div class="tableBox">
            <vxe-table v-loading="tableLoading" :data="userTableData" :column-config="{ resizable: true }"
                :expand-config="{ showIcon: false }" :row-config="{ isHover: true, height: 90 }" border
                ref="UserWarehouseXTable" style="width: 100%" :header-row-style="{
                    background: '#fafafa',
                    color: '#2d2f30',
                    fontWeight: 'bold',
                    fontSize: '12px',
                }" @checkbox-change="handleSelectionChange" @checkbox-all="selectAllChangeEvent"
                :maxHeight="tableMaxHeight">
                <!--:tooltip-config="{ showAll: true, contentMethod }" :sort-config="tableSort"  :style="{ paddingBottom: searchShow ? '50px' : 0 }" -->
                <vxe-column type="checkbox" width="40" align="center" fixed="left"></vxe-column>
                <vxe-column type="seq" width="60"></vxe-column>
                <vxe-column field="account" title="用户账号" show-overflow></vxe-column>
                <vxe-column field="realName" title="用户姓名" show-overflow></vxe-column>
                <vxe-column field="roleName" title="所属角色" show-overflow></vxe-column>
                <vxe-column field="deptName" title="所属部门" show-overflow></vxe-column>
                <vxe-column field="teamName" title="所属小组" show-overflow></vxe-column>
                <vxe-column title="操作">
                    <template #default="scope">
                        <span>
                            <el-button type="primary" text  @click="removeRow(scope.row)" :disabled="btnFlag"
                                v-loading="btnFlag">移 除</el-button>
                        </span>
                    </template>
                </vxe-column>
            </vxe-table>
            <el-pagination class="pagination" background @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :current-page="pages.current" :page-sizes="[10, 25, 50, 100]"
                :page-size="pages.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
            </el-pagination>
        </div>
        <!-- 绑定日志  -->
        <UserWarehouseLog ref="UserWarehouseLogRef" :tranWarehouseName="tranWarehouseInfo.tranWarehouseName">
        </UserWarehouseLog>
        <!-- 绑定用户 -->
        <BindUser ref="BindUserRef" :tranWarehouseInfo="tranWarehouseInfo" :pages="pages"></BindUser>
    </div>
</template>

<script>
import authorButtons from "@/compositionApi/authorButtons";
import UserWarehouseLog from "./UserWarehouseLog.vue"
import BindUser from "./BindUser.vue"
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, watch, nextTick } from 'vue';
export default {
    name: 'UserWarehouse',
    components: {
        UserWarehouseLog,
        BindUser
    },
    props: {
        tableLoading: {
            type: Boolean,
            default: false
        },
        tranWarehouseInfo: {
            type: Object,
            default: {
                tranWarehouseName: '',
                tranWarehouseId: ''
            }
        },
        userTableData: {
            type: Array,
            default: []
        },
        pages: {
            type: Object,
            default: {
                current: 1,
                pageNum: 1,
                size: 10,
                total: 0,
            }
        },
    },
    setup(prop, ctx) {
        const data = reactive({
            selectList: [],
            searchMsg: {},
            btnFlag: false,
            tableMaxHeight: ''
        })
        const { ctx: vueDev, proxy: vue } = getCurrentInstance();
        const api = vue.$http;
        const getUserWarehouseData = inject('getUserWarehouseData');
        const { BUTTONS } = authorButtons();
        const buttonAuthor = BUTTONS.value;
        onBeforeMount(() => { })
        onMounted(() => {
            data.tableMaxHeight = document.getElementById('DomesticWarehouse').scrollHeight - 200
            console.log(document.getElementById('DomesticWarehouse').scrollHeight - 200)
        })

        //移除用户
        const removeUser = () => {
            if (data.selectList.length) {
                let userIds = [];
                data.selectList.map(item => {
                    userIds.push(item.id)
                })
                removeUserFn(userIds)
            } else {
                vue.$message.warning('请选择要移除的用户数据！')
            }

        };

        //移除用户方法 
        const removeUserFn = (e) => {
            vue.$confirm("此操作将移除选择的用户, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                buttonSize: "small"
            })
                .then(() => {
                    vue.$config
                    data.btnFlag = true;
                    api.system.deleteReceivingUser({ receivingUserId: e, tranWarehouseId: vue.$props.tranWarehouseInfo.tranWarehouseId }).then(res => {
                        if (res.code == 200) {
                            data.btnFlag = false;
                            vue.$message.success(res.msg)
                            let vo = {
                                tranWarehouseId: vue.$props.tranWarehouseInfo.tranWarehouseId,
                                tranWarehouseName: vue.$props.tranWarehouseInfo.tranWarehouseName
                            }
                            getUserWarehouseData(vo)
                        } else {
                            data.btnFlag = false;
                            vue.$message.warning(res.msg)
                        }
                    }).catch(e => {
                        data.btnFlag = false;
                    })
                })
        };

        //绑定用户
        const bindUser = () => {
            vue.$refs.BindUserRef.openBindUserLog({ tranWarehouseId: vue.$props.tranWarehouseInfo.tranWarehouseId })
        };

        //绑定日志
        const bindingLog = () => {
            if (vue.$props.tranWarehouseInfo.tranWarehouseId) {
                let obj = {
                    servers: "system",
                    dataApi: "userRepositoryLogSelectAllLog",
                    tranWarehouseId: vue.$props.tranWarehouseInfo.tranWarehouseId,
                };
                vue.$refs.UserWarehouseLogRef.checkLogDialog(obj)
            }
        };

        //移除行
        const removeRow = (e) => {
            console.log(e)
            removeUserFn([e.id])
        };

        // 选中的表格数据
        const handleSelectionChange = ({ $table }) => {
            data.selectList = $table.getCheckboxRecords();
        };

        // 选中的表格数据
        const selectAllChangeEvent = ({ $table }) => {
            data.selectList = $table.getCheckboxRecords();
        };

        const handleSizeChange = (val) => {
            let vo = {
                tranWarehouseId: vue.$props.tranWarehouseInfo.tranWarehouseId,
                size: val,
                tranWarehouseName: vue.$props.tranWarehouseInfo.tranWarehouseName
            }
            getUserWarehouseData(vo)
        };

        const handleCurrentChange = (val) => {
            let vo = {
                tranWarehouseId: vue.$props.tranWarehouseInfo.tranWarehouseId,
                current: val,
                tranWarehouseName: vue.$props.tranWarehouseInfo.tranWarehouseName
            }
            getUserWarehouseData(vo)
        };

        //更新当前表格数据 选择项更新
        const updateUserData = () => {
            nextTick(() => {
                data.selectList = [];
                // vue.$refs.UserWarehouseXTable.clearSelection()
            })
        };

        const refData = toRefs(data);
        return {
            ...refData,
            removeUser,
            bindUser,
            bindingLog,
            removeRow,
            handleSelectionChange,
            selectAllChangeEvent,
            handleSizeChange,
            handleCurrentChange,
            removeUserFn,
            buttonAuthor,
            getUserWarehouseData,
            updateUserData
        }
    }
};
</script>
<style scoped lang='scss'>
#UserWarehouse {
    .UserWarehouseTitle {
        font-size: 18px;
        padding: 5px;

        .titleIcon {
            font-size: 18px;
        }
    }

    .btnBox {
        margin-bottom: 15px;
        height: 30px;
        display: flex;
        justify-content: flex-end;
        padding: 5px;
    }

    .tableBox {
        padding: 5px;
        padding-bottom: 70px;
        min-height: 150px;
        position: relative;

        .pagination {
            position: absolute;
        }
    }
}
</style>