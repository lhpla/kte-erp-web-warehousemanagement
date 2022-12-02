<!-- 打印SKU修改打印数量  -->
<template>
    <div id="SealingSkuNumEdit">
        <el-dialog title="打印条码" v-model="dialogVisible" width="50%" :close-on-click-modal="false"
            :before-close="dialogClose" :close-on-press-escape="false">
            <el-form :model="formItem" ref="formRef" :rules="formRule">
                <el-table :data="formItem.sku" border style="width: 100%"
                    :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }">
                    <el-table-column label="SKU" prop="sku"></el-table-column>
                    <el-table-column label="打印数量" prop="num">
                        <template #default="{ row, $index }">
                            <el-form-item label="" v-if="$index >= 0" :prop="`sku.${$index}.num`" :rules="formRule.num">
                                <el-input clearable v-model.trim="row.num" style="width: 200px"
                                    @change="numChange(row)">
                                </el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button size="small" :loading="btnFlag" :disabled="btnFlag" @click="dialogClose">取 消</el-button>
                    <el-button type="primary" size="small" :loading="btnFlag" :disabled="btnFlag" @click="print">打 印
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from 'vue';
import { getLodop } from '@/utils/LodopFuncs'
export default {
    name: 'SealingSkuNumEdit',
    setup(prop, ctx) {
        const data = reactive({
            dialogVisible: false,
            btnFlag: false,
            formItem: {
                sku: []
            },
            formRule: {
                num: [{ required: true, message: "请输入", trigger: "blur" },
                {
                    validator: (rule, value, callback) => {
                        let ret = /^\+?[1-9]\d*$/;
                        if (!ret.test(value)) {
                            callback(new Error("请输入大于0的正整数"));
                        } else {
                            callback();
                        }
                    },
                    trigger: "blur"
                }
                ]
            },
            headerAttribute: ''
        })
        const { ctx: vueDev, proxy: vue } = getCurrentInstance();
        const api = vue.$http;
        onBeforeMount(() => { })
        onMounted(() => { })
        const refData = toRefs(data);
        const formRef = ref(null)
        //打开弹窗 获取基础信息
        const getMsg = (datas, headerAttribute) => {
            data.dialogVisible = true
            data.formItem = datas
            data.headerAttribute = headerAttribute
        }

        //打印
        const print = () => {
            formRef.value.validate(valid => {
                if (valid) {
                    data.btnFlag = true
                    let LODOP = getLodop()
                    if (typeof LODOP == 'string') {
                        vue.$message.warning({
                            dangerouslyUseHTMLString: true,
                            message: LODOP,
                        })
                        return
                    }
                    if (data.headerAttribute == '4px') {//4px
                        vue.$printFn(LODOP, data.formItem.sku, 'quartet')
                    } else {//谷仓
                        vue.$printFn(LODOP, data.formItem, 'sku')
                    }

                    data.btnFlag = false
                    dialogClose()
                }
            })

        }

        //打印数量变化
        const numChange = row => {
            if (row.num > row.encasementNum) {
                vue.$message.warning('打印数量不可大于采购数量！')
                row.num = row.encasementNum
            }
        }

        //关闭弹窗
        const dialogClose = () => {

            if (formRef.value) {
                formRef.value.resetFields();
                formRef.value.clearValidate();
            }

            data.dialogVisible = false
            data.formItem.tableData = []
        }
        return {
            ...refData,
            getMsg,
            print,
            formRef,
            dialogClose,
            numChange
        }
    }
};
</script>
<style scoped lang='scss'>

</style>