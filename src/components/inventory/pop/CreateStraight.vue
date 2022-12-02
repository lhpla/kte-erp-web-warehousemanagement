<!-- 创建直发盘点单  CreateStraight-->
<template>
    <div id='CreateStraight'>
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
                <el-form-item label="盘点维度:" prop="checkDimensions">
                    <el-radio-group v-model="data.ruleForm.checkDimensions" v-for="item in data.check_dimensions_pur"
                        :key="item.dizKey">
                        <el-radio :label="item.dizKey" class="margin-right"> {{ item.value }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer ">
                    <el-button @click="closed" size="small">取 消
                    </el-button>
                    <el-button type="primary" @click="onSubmit('/inventory/createStraightInventory')" size="small">确 认
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
        transferWarehouseId: ''
    },
    //仓库列表
    warehouseList: [],
    rules: {
        checkDimensions: [{ required: true, message: "请选择", trigger: "change" },],
        transferWarehouseId: [{ required: true, trigger: "change", message: "请选择" }],
    },
    //直发维度
    check_dimensions_pur: []
});
onMounted(() => {
    //中转维度
    data.check_dimensions_pur = localGet("purchaseDict").check_dimensions_pur
        ? localGet("purchaseDict").check_dimensions_pur
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
            api.inventory.generateCheckNumber({ checkDimensions: data.ruleForm.checkDimensions, transferWarehouseId: data.ruleForm.transferWarehouseId, type: false }).then(res => {
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

// 弹窗控制
const checkDialog = () => {
    data.addVisible = true;
    // 仓库
    api.system.getDirectWarehouse().then(res => {
        if (res.code == 200) {
            data.warehouseList = res.data;
        }
    });
};
defineExpose({ checkDialog });
</script>

<style scoped lang='scss'>
#CreateStraight {
    .margin-right {
        margin-right: 10px
    }

    :deep(.el-dialog__header) {
        margin-right: 0;
    }
}
</style>