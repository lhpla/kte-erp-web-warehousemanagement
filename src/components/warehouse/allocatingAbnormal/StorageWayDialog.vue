
<!--StorageWayDialog  调拨异常入库-->
<template>
    <div id="StorageWayDialog">
        <el-dialog title="调拨异常-确认退回SKU" :width="type === true ? width1 : width2" v-model="logVisible"
            :close-on-click-modal="false" @close="closed" destroy-on-close  :close-on-press-escape="false">
            <el-form ref="custForm" :model="formData" :rules="rule" :validate-on-rule-change="false">
                <vxe-table align="center" :data="formData.storageTableData" :loading="tableLoading" border :header-row-style="{
                    background: '#fafafa',
                    color: '#2d2f30',
                    fontWeight: 'bold',
                    fontSize: '12px',
                }" style="width: 100%" maxa-height="400px" ref="table">
                    <vxe-column field="sku" title="SKU"></vxe-column>
                    <vxe-column v-if="type == true" field="startLocation" title="调拨库位">
                        <template #default="scope">{{ scope.row.startLocation ? scope.row.startLocation : "-" }}</template>
                    </vxe-column>
                    <vxe-column v-if="type == false" field="startCabinetNum" title="调拨柜号">
                        <template
                            #default="scope">{{ scope.row.startCabinetNum? scope.row.startCabinetNum : "-" }}</template>
                    </vxe-column>
                    <vxe-column v-if="type == false" field="startCartonNum" title="调拨箱号">
                        <template
                            #default="scope">{{ scope.row.startCartonNum? scope.row.startCartonNum : "-" }}</template>
                    </vxe-column>
                    <vxe-column field="transferNum" title="调拨数量"></vxe-column>
                    <vxe-column field="abnormalNum" title="异常数量"></vxe-column>
                    <vxe-column v-if="type == true" field="endLocation" title="入库库位">
                        <!-- 选中框 -->
                        <template #default="scope">
                            <el-form-item :prop="`storageTableData.${scope.rowIndex}.endLocation`"
                                :rules="rule.endLocation">
                                <el-select :loading="listLoading" @click="locationList(scope.row.sku)" 
                                    v-model="scope.row.endLocation"  placeholder="请选择" size="small">
                                    <el-option v-for="(item, index) in locationLists" :key="index"
                                        :label="item.storageLocation" :value="item.storageLocation" />
                                </el-select>
                            </el-form-item>
                        </template>
                    </vxe-column>
                    <vxe-column v-if="type == false" field="endCabinetNum" title="入柜柜号">
                        <template #default="scope">{{ scope.row.endCabinetNum? scope.row.endCabinetNum : "-" }}</template>
                    </vxe-column>
                    <vxe-column v-if="type == false"  field="endCartonNum" title="入库箱号">
                        <template #default="scope">
                            <el-form-item :prop="`storageTableData.${scope.rowIndex}.endCartonNum`"
                                :rules="rule.endCartonNum">
                                <el-input   v-model="scope.row.endCartonNum" />
                            </el-form-item>
                        </template>
                    </vxe-column>
                    <vxe-column v-if="type == false" field="name7" title="箱子尺寸（CM）" min-width="300">
                        <template #default="scope">
                            <div style="display: flex; justify-content: center;">
                                <el-form-item :prop="`storageTableData.${scope.rowIndex}.length`" :rules="rule.length">
                                    长
                                    <el-input  v-model="scope.row.length" style="width: 85px;margin:0 10px;"
                                        maxlength="3" />
                                </el-form-item>
                                <el-form-item :prop="`storageTableData.${scope.rowIndex}.width`" :rules="rule.width">
                                    宽
                                    <el-input v-model="scope.row.width" style="width: 85px;margin:0 10px;"
                                        maxlength="3" />
                                </el-form-item>
                                <el-form-item :prop="`storageTableData.${scope.rowIndex}.height`" :rules="rule.height">
                                    高
                                    <el-input  v-model="scope.row.height" style="width: 85px;margin:0 10px;"
                                        maxlength="3" />
                                </el-form-item>
                            </div>
                        </template>
                    </vxe-column>
                    <vxe-column field="intoWarehouseNum" title="入库数量" min-width="70"></vxe-column>
                </vxe-table>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button size="small" @click="logVisible = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="commit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, nextTick, computed, } from "vue";
export default {
    name: "storageWayDialog",
    setup(prop, ctx) {
        const data = reactive({
            width1: "75%",
            width2: "85%",
            type: true,
            tableLoading: true,
            listLoading: true,
            formData: {
                //调拨仓库数据
                storageTableData: [],
            },
            locationLists: [],//库位下拉列表
            warehouseId: "",//库位ID
            id: "",
        });
        const { ctx: vueDev, proxy: vue } = getCurrentInstance();
        const api = vue.$http;
        onBeforeMount(() => {
        });
        onMounted(() => {
        });
        const refData = toRefs(data);
        let logVisible = ref(false);
        //入库校验
        const checkEndLocation = (rule, value, callback) => {
            if (value == "" || value == undefined) {
                callback(new Error('请输入入库库位'));
            } else {
                callback();
            }
        }
        //箱号校验
        const checkCaseNumber = (rule, value, callback) => {
            let reg = /^[1-9][0-9]{0,5}$/;
            if (value == "") {
                callback(new Error('请输入入库箱号'));
            } else {
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error('输入格式错误'));
                }
            }
        }
        //箱子尺寸校验        
        const checkBoxSize = (rule, value, callback) => {
            let reg = /^\+?[1-9]\d*$/;
            if (value == "") {
                callback(new Error('请输入箱子尺寸'));
            } else {
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error('输入格式错误'));
                }
            }
        }
        const rule = reactive({
            endLocation: [{ validator: checkEndLocation, required: true, trigger: "change" }],
            endCartonNum: [{ validator: checkCaseNumber, required: true, trigger: "blur", }],
            length: [{ validator: checkBoxSize, required: true, trigger: "blur", }],
            width: [{ validator: checkBoxSize, required: true, trigger: "blur", }],
            height: [{ validator: checkBoxSize, required: true, trigger: "blur", }],
        })
        const getTableList = inject("getTableList");
        // 打开loading
        const checkStorageDialog = (e, id) => {
            data.type = e.isDirect;
            data.warehouseId = id;
            data.id = e.id;
            checkStorage(e.id);
            logVisible.value = true;
            nextTick(() => {
                vue.$refs.custForm.clearValidate();
            })
        };
        // 查看调拨异常入库数据
        const checkStorage = (id) => {
            data.formData.storageTableData = [];
            data.tableLoading = true;
            //type为true时 为直发
            if (data.type) {
                api.requisitionManagement.getTransferStraightHairDetail({ id: id }).then(res => {
                    if (res.code == 200) {
                        res.data.map(item => {
                            if (!(item.endLocation)) {
                                item.endLocation = item.startLocation;
                            }
                        })
                        data.formData.storageTableData = res.data;
                        data.tableLoading = false;
                    } else {
                        data.tableLoading = false;
                        vue.$message.warning(res.msg);
                    }
                }).catch(err => {
                    data.tableLoading = false;
                })
            } else {
                api.requisitionManagement.getTransferTransitDetail({ id: id }).then(res => {
                    if (res.code == 200) {
                        res.data.map(item => {
                            item.height = item.height === -1 ? 0 : item.height;
                            item.width = item.width === -1 ? 0 : item.width;
                            item.length = item.length === -1 ? 0 : item.length;
                        })
                        data.formData.storageTableData = res.data;
                        data.tableLoading = false;
                    } else {
                        data.tableLoading = false;
                        vue.$message.warning(res.msg);
                    }
                }).catch(err => {
                    data.tableLoading = false;
                })
            }
        };
        //获取库位列表
        const locationList = (sku) => {
            data.listLoading = true;
            let obj = {
                sku: sku,
                warehouseId: data.warehouseId,
            }
            api.warehouse.getLocationDetail(obj).then((res) => {
                if (res.code == 200) {
                    data.locationLists = res.data;
                    data.listLoading = false;
                } else {
                    vue.$message({
                        type: "warning",
                        message: res.msg,
                    });
                    data.listLoading = false;
                }
            })
        }

        // closed 关闭弹框回调
        const closed = () => {
            logVisible.value = false;
            nextTick(() => {
                vue.$refs.custForm.clearValidate();
            })
        };
        //确认
        const commit = () => {
            vue.$refs.custForm.validate(valid => {
                if (valid) {
                    let info = {};
                    info.id = data.id;
                    data.formData.storageTableData.forEach(item => {
                        delete item._X_ROW_KEY;
                    })
                    info.infos = data.formData.storageTableData;
                    if (data.type) {
                        api.requisitionManagement.confirmWarehousingFromStraightHair(info).then(res => {
                            if (res.code == 200) {
                                data.formData.storageTableData == res.data;
                                getTableList();
                                closed();
                                vue.$message.success(res.msg);
                            } else {
                                vue.$message.warning(res.msg);
                            }
                        })
                    } else {
                        api.requisitionManagement.confirmWarehousingFromTransit(info).then(res => {
                            if (res.code == 200) {
                                data.formData.storageTableData == res.data;
                                getTableList();
                                closed();
                                vue.$message.success(res.msg);
                            } else {
                                vue.$message.warning(res.msg);
                            }
                        })
                    }
                }
            })
        }
        return {
            ...refData,
            checkStorageDialog,
            checkStorage,
            locationList,
            closed,
            commit,
            rule,
            logVisible,
        };
    },
};
</script>
<style scoped lang='scss'>
#StorageWayDialog {
    :deep(.el-dialog__header) {
        margin-right: 0;
    }
}
</style>



