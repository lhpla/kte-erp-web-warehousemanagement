<!-- 国内仓库配置 -->
<template>
    <div id="warehouseConfiguration">
        <DomesticWarehouse :tableLoading="tableLoading"></DomesticWarehouse>
        <RightWarehouseCom ref="RightWarehouseCom" :tableLoading="tableLoading" :pages="pages"
            :tranWarehouseInfo="tranWarehouseInfo" :userTableData="userTableData">
        </RightWarehouseCom>
    </div>
</template>

<script>
import DomesticWarehouse from '@/components/warehouse/warehouseConfiguration/DomesticWarehouse.vue'
import RightWarehouseCom from '@/components/warehouse/warehouseConfiguration/RightWarehouseCom.vue'
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, provide, nextTick } from 'vue';
export default {
    name: 'warehouseConfiguration',
    components: {
        DomesticWarehouse,
        RightWarehouseCom
    },
    setup(prop, ctx) {
        const data = reactive({
            userTableData: [],
            tableLoading: false,
            pages: {
                current: 1,
                pageNum: 1,
                size: 10,
                total: 0,
            },
            tranWarehouseInfo: {
                tranWarehouseName: '',
                tranWarehouseId: ''
            },

        })
        const { ctx: vueDev, proxy: vue } = getCurrentInstance();
        const api = vue.$http;
        onBeforeMount(() => { })
        onMounted(() => { })

        //获取用户仓库数据
        const getUserWarehouseData = (e) => {
            data.tranWarehouseInfo.tranWarehouseName = e.tranWarehouseName;
            data.tranWarehouseInfo.tranWarehouseId = e.tranWarehouseId;
            data.pages.size = e.size ? e.size : data.pages.size;
            data.pages.current = e.current ? e.current : data.pages.current;
            let vo = {
                tranWarehouseId: e.tranWarehouseId,
                current: data.pages.current,
                size: data.pages.size,
            }
            data.tableLoading = true;
            api.system.getUserRepository(vo).then(res => {
                if (res.code == 200) {
                    data.userTableData = res.data.records;
                    data.pages.current = res.data.current;
                    data.pages.size = res.data.size;
                    data.pages.total = res.data.total;
                    data.pages.pageNum = res.data.current;
                    data.tableLoading = false;
                    //更新数据 同步更新选中的数据list
                    nextTick(() => {
                        vue.$refs.RightWarehouseCom.removeSelected()
                    })
                } else {
                    data.tableLoading = false;
                    vue.$message.warning(res.msg)
                }
            }).catch(e => {
                data.tableLoading = false;
            })
        };

        provide("getUserWarehouseData", getUserWarehouseData)

        const refData = toRefs(data);
        return {
            ...refData,
            getUserWarehouseData,
        }
    }
};
</script>
<style scoped lang='scss'>
#warehouseConfiguration {
    display: flex;
    justify-content: space-around;

    #DomesticWarehouse {
        min-width: 260px;
        flex: 0.1;
        border: 1px solid #D7D7D7;
        border-radius: 3px;
    }

    #RightWarehouseCom {
        flex: 0.85;
        border: 1px solid #D7D7D7;
        border-radius: 3px;

    }

}
</style>