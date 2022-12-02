<!--国内仓配置 绑定用户 -->
<template>
    <div id="BindUser">
        <el-dialog :title="tranWarehouseInfo.tranWarehouseName + '-绑定用户'" width="90%" v-model="logVisible"
            :close-on-click-modal="false" :before-close="handleClose" destroy-on-close :close-on-press-escape="false">
            <div>
                <el-form :inline="true" label-width="80px" :model="searchForm"
                    class="demo-form-inline el-from" ref="BindUserSearchRef">
                    <el-form-item label="用户账号:">
                        <el-input v-model.trim="searchForm.account" placeholder="请输入" clearable @keyup.enter="search"
                            maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="用户姓名:">
                        <el-input v-model.trim="searchForm.realName" placeholder="请输入" clearable @keyup.enter="search"
                            maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="所属角色:">
                        <el-cascader v-model="searchForm.roleName" :options="roleList" :show-all-levels="false"
                            @change="search" filterable :props="propsPost" placeholder="请选择" clearable></el-cascader>
                    </el-form-item>
                    <el-form-item label="所属小组:">
                        <el-select v-model="searchForm.teamName" clearable filterable placeholder="请选择"
                            @change="search">
                            <el-option v-for="item in teamList" :key="item.id" :label="item.teamName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="search">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tableBox">
                <div class="tableBoxTitleBtn">
                    <el-button type="primary" size="small" @click="bindNewWarehouse" :disabled="btnFlag"
                        v-loading="btnFlag">绑定到仓库</el-button>
                </div>
                <vxe-table v-loading="tableLoading" :data="tableData" :column-config="{ resizable: true }"
                    :expand-config="{ showIcon: false }" :row-config="{ isHover: true, height: 90 }" border
                    ref="UserWarehouseXTable" style="width: 100%" :header-row-style="{
                        background: '#fafafa',
                        color: '#2d2f30',
                        fontWeight: 'bold',
                        fontSize: '12px',
                    }" @checkbox-change="handleSelectionChange" @checkbox-all="selectAllChangeEvent" max-height="600">
                    <vxe-column type="checkbox" width="40" align="center" fixed="left"></vxe-column>
                    <vxe-column type="seq" width="60"></vxe-column>
                    <vxe-column field="account" title="用户账号"></vxe-column>
                    <vxe-column field="realName" title="用户姓名"></vxe-column>
                    <vxe-column field="roleName" title="所属角色"></vxe-column>
                    <vxe-column field="teamName" title="所属小组"></vxe-column>
                </vxe-table>
            </div>
            <el-pagination class="pagination" background @size-change="handleSizeChangeLog"
                @current-change="handleCurrentChangeLog" :current-page="UserPages.current"
                :page-sizes="[10, 25, 50, 100]" :page-size="UserPages.size"
                layout="total, sizes, prev, pager, next, jumper" :total="UserPages.total">
            </el-pagination>
        </el-dialog>
    </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from 'vue';
export default {
    name: 'BindUser',
    props: {
        tranWarehouseInfo: {
            type: Object,
            default: {
                tranWarehouseName: '',
                tranWarehouseId: ''
            }
        },
    },
    setup(prop, ctx) {
        const data = reactive({
            logVisible: false,
            tableLoading: false,
            btnFlag: false,
            searchForm: {
                account: '',
                realName: '',
                roleName: [],
                teamName: '',
            },
            roleList: [],
            teamList: [],
            tableData: [],
            UserPages: {
                current: 1,
                size: 10,
                total: 0,
            },
            tranWarehouseId: '',
            propsPost: {
                expandTrigger: "hover",
                value: "id",
                label: "roleName",
                checkStrictly: true
            },
            selectList: [],
        })
        const { ctx: vueDev, proxy: vue } = getCurrentInstance();
        const api = vue.$http;
        const getUserWarehouseData = inject('getUserWarehouseData');
        onBeforeMount(() => { })
        onMounted(() => {
            //获取所有小组
            api.system.getAllTeams().then((res) => {
                console.log(res)
                if (res.code === 200) {
                    data.teamList = res.data;
                }
            });
            api.system.getUserRoles().then(res => {
                console.log(res)
                if (res.code === 200) {
                    data.roleList = res.data
                }
            })
        })

        //关闭弹框
        const handleClose = () => {
            data.searchForm = {
                account: '',
                realName: '',
                roleName: [],
                teamName: '',
            };
            data.UserPages = {
                current: 1,
                size: 10,
                total: 0,
            };
            data.selectList = [];
            data.logVisible = false;
        };

        //打开
        const openBindUserLog = (e) => {
            data.logVisible = true;
            if (e.tranWarehouseId) {
                data.tranWarehouseId = e.tranWarehouseId
            }
            search()
        };

        //搜索
        const search = () => {
            console.log(data.searchForm)
            let e = JSON.parse(JSON.stringify(data.searchForm))
            // data.searchParam.sku = data.searchParam.sku.replace(/；/gi, ';').replace(/\s+/g, ';').trim()
            let searchForm = {
                account: '',
                realName: '',
                roleId: '',
                teamId: '',
            }
            searchForm.account = e.account.replace(/，/gi, ',').trim();
            searchForm.realName = e.realName.replace(/，/gi, ',').trim();
            searchForm.roleId = Array.isArray(e.roleName) && e.roleName.length > 0 ? e.roleName.pop() : '';
            searchForm.teamId = e.teamName;
            let vo = Object.assign(searchForm, data.UserPages, { tranWarehouseId: data.tranWarehouseId })
            data.tableLoading = true;
            api.system.selectUserByQuery(vo).then(res => {
                if (res.code == 200) {
                    data.tableLoading = false;
                    data.tableData = res.data.records;
                    data.UserPages.current = res.data.current;
                    data.UserPages.size = res.data.size;
                    data.UserPages.total = res.data.total;
                } else {
                    data.tableLoading = false;
                    vue.$message.warning(res.msg)
                }
            }).catch(e => {
                data.tableLoading = false;
            })
        }

        // 选中的表格数据
        const handleSelectionChange = ({ $table }) => {
            data.selectList = $table.getCheckboxRecords();
        };

        // 选中的表格数据
        const selectAllChangeEvent = ({ $table }) => {
            data.selectList = $table.getCheckboxRecords();
        };

        // 日志每页条数发生改变
        const handleSizeChangeLog = val => {
            data.UserPages.size = val;
            search()
        };
        // 日志当前页发生改变
        const handleCurrentChangeLog = val => {
            data.UserPages.current = val;
            search()
        };
        //绑定新仓库
        const bindNewWarehouse = () => {
            if (data.selectList.length) {
                let vo = {
                    tranWarehouseId: data.tranWarehouseId,
                    receivingUserId: []
                };
                data.selectList.map(item => {
                    vo.receivingUserId.push(item.id)
                })
                data.btnFlag = true;
                api.system.saveReceivingUser(vo).then(res => {
                    if (res.code == 200) {
                        data.btnFlag = false;
                        vue.$message.success(res.msg);
                        handleClose();
                        let dto = {
                            tranWarehouseId: vue.$props.tranWarehouseInfo.tranWarehouseId,
                            tranWarehouseName: vue.$props.tranWarehouseInfo.tranWarehouseName
                        }
                        getUserWarehouseData(dto);
                    } else {
                        data.btnFlag = false;
                        vue.$message.warning(res.msg);
                    }
                }).catch(e => {
                    data.btnFlag = false;
                })
            } else {
                vue.$message.warning('请选择要绑定的用户数据！')
            }
        };

        const refData = toRefs(data);
        return {
            ...refData,
            openBindUserLog,
            search,
            handleSizeChangeLog,
            handleCurrentChangeLog,
            handleSelectionChange,
            selectAllChangeEvent,
            bindNewWarehouse,
            getUserWarehouseData,
            handleClose,

        }
    }
};
</script>
<style scoped lang='scss'>
#BindUser {
    position: relative;

    .tableBox {
        min-height: 150px;
        margin-bottom: 40px;

        .tableBoxTitleBtn {
            display: flex;
            justify-content: flex-end;
            margin: 5px 10px;
        }
    }

    .pagination {
        position: absolute;
        bottom: 0;
        right: 10px;
    }

    :deep(.el-dialog__header) {
        margin-right: 0;
    }
}
</style>