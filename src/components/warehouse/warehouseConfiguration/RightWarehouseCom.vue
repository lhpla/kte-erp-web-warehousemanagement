<!-- 国内仓配置 -- 右侧组件 -->
<template>
    <div id="RightWarehouseCom">
        <!-- @tab-click="handleClick" -->
        <el-tabs v-model="activeName" class="demo-tabs" type="border-card">
            <el-tab-pane name="first">
                <template #label>
                    <span class="custom-tabs-label UserWarehouseTitle">
                        <i class="el-icon-user titleIcon"></i>
                        <span>用户仓库</span>
                    </span>
                </template>
                <UserWarehouse :tableLoading="tableLoading" :pages="pages" :tranWarehouseInfo="tranWarehouseInfo"
                    :userTableData="userTableData" ref="UserWarehouse">
                </UserWarehouse>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick } from 'vue';
import UserWarehouse from './pop/UserWarehouse.vue'

export default {
    name: 'RightWarehouseCom',
    components: { UserWarehouse },
    props: {
        tableLoading: {
            type: Boolean,
            default: false
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
        }
    },
    setup(prop, ctx) {
        const data = reactive({
            activeName: "first"
        })
        const { ctx: vueDev, proxy: vue } = getCurrentInstance();
        const api = vue.$http;
        onBeforeMount(() => { })
        onMounted(() => { })

        // const handleClick = () => {};

        //更新数据 同步更新选中的数据list
        const removeSelected = () => {
            nextTick(() => {
                vue.$refs.UserWarehouse.updateUserData();

            })
        }

        const refData = toRefs(data);
        return {
            ...refData,
            removeSelected,
            // handleClick,
        }
    }
};
</script>
<style scoped lang='scss'>
#RightWarehouseCom {
    height: 80vh !important;
}
</style>