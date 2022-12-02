<!-- 创建中转盘点单  CreateTransit-->
<template>
    <div id='CreateTransit'>
        <el-dialog title="创建盘点" width="50%" v-model="data.addVisible" :close-on-click-modal="false" @close="closed"
            :close-on-press-escape="false" destroy-on-close>
            <el-form ref="ruleRef" label-width="130px" :model="data.ruleForm" :rules="data.rules"
                class="demo-form-inline el-from form">
                <el-form-item label="仓库:" prop="transferWarehouseId">
                    <el-select v-model="data.ruleForm.transferWarehouseId" filterable placeholder="请选择" clearable>
                        <el-option v-for="item in data.warehouseList" :key="item.id" :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="盘点维度:" prop="radio">
                    <el-radio-group v-model="data.ruleForm.checkDimensions" v-for="item in data.check_dimensions_tra"
                        :key="item.dizKey">
                        <el-radio :label="item.dizKey" class="margin-right"> {{ item.value }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="data.ruleForm.checkDimensions == 'warehouse_area'" label="仓区:"
                    prop="purposeWarehouseId">
                    <el-select v-model="data.ruleForm.purposeWarehouseId" @focus="selectWarehouseByTraId" filterable
                        placeholder="请选择" clearable>
                        <el-option v-for="item in data.warehouseAreaList" :key="item.id" :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer ">
                    <el-button @click="closed" size="small">取 消
                    </el-button>
                    <el-button type="primary" @click="onSubmit('/inventory/createTransitInventory')" size="small">确 认
                    </el-button>
                </div>

            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import {
    defineComponent,
    reactive,
    toRefs,
    onMounted,
    getCurrentInstance,
    ref,
    inject
} from "vue";
import { localGet } from "@/utils/util";
const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
const data = reactive({
    addVisible: false,
    ruleForm: {
        checkDimensions: '',
        transferWarehouseId: '',
        purposeWarehouseId: ''
    },
    //仓库列表
    warehouseList: [],
    // 仓区
    warehouseAreaList: [],
    rules: {
        checkDimensions: [{ required: true, message: "请选择", trigger: "change" },],
        transferWarehouseId: [{ required: true, trigger: "change", message: "请选择" }],
        purposeWarehouseId: [{ required: true, trigger: "change", message: "请选择" }],
    },
    //中转维度
    check_dimensions_tra: []

});
onMounted(() => {
    //中转维度
    data.check_dimensions_tra = localGet("purchaseDict").check_dimensions_tra
        ? localGet("purchaseDict").check_dimensions_tra
        : [];
});
//关闭
const closed = () => {
    ruleRef._value.resetFields()
    ruleRef._value.clearValidate()
    data.addVisible = false
}
const ruleRef = ref(null)
//确定
const onSubmit = (path) => {
    ruleRef._value.validate(valid => {
        if (valid) {
            let msg = {
                checkDimensions: data.ruleForm.checkDimensions,
                transferWarehouseId: data.ruleForm.transferWarehouseId,

                type: true
            }
            if (data.ruleForm.checkDimensions == 'warehouse_area') {
                msg.purposeWarehouseId = data.ruleForm.purposeWarehouseId
            }
            api.inventory.generateCheckNumber(msg).then(res => {
                if (res.code == 200) {
                    let query = res.data
                    let { href } = vue.$router.resolve({
                        path,
                        query: query,
                    });
                    closed()
                    window.open(href);
                } else {
                    vue.$message.warning(res.msg)
                }
            })
        }
    })
}

//获取仓区 中转盘点 获取非直发属性的国内仓
const selectWarehouseByTraId = () => {
    data.warehouseAreaList = []
    if (data.ruleForm.transferWarehouseId) {
        api.inventory.selectWarehouseByTraId({ id: data.ruleForm.transferWarehouseId }).then(res => {
            if (res.code == 200) {
                data.warehouseAreaList = res.data;
            } else {
                vue.$message.warning(res.msg);
            }
        });
    } else {
        vue.$message.warning('请先选择仓库！')
    }
}

// 弹窗控制
const checkDialog = () => {
    data.addVisible = true;
    // 仓库
    api.warehouse.selectTransitWarehouse().then(res => {
        if (res.code == 200) {
            data.warehouseList = res.data;
        } else {
            vue.$message.warning(res.msg);
        }
    })
};
defineExpose({ checkDialog });
</script>

<style scoped lang='scss'>
#CreateTransit {
    .margin-right {
        margin-right: 10px
    }

    :deep(.el-dialog__header) {
        margin-right: 0;
    }
}
</style>