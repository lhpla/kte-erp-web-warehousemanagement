<!--国内仓配置 -- 国内仓库 -->
<template>
    <div id="DomesticWarehouse">
        <div class="DomesticWarehouseTitle"><i class="el-icon-s-grid titleIcon"></i> 国内仓库</div>
        <div class="tableLoadingClass" v-loading="tableLoading">
            <div class="itemWarehouse" :class="activeWarehouseId == item.tranWarehouseId ? 'hoverItem' : ''"
                v-for="item in tableData" :key="item.id" @click="activeItem(item)">
                <i class="el-icon-folder itemIcon"></i> {{ item.tranWarehouseName }}
            </div>
            <div class="itemWarehouse" v-show="!tableData.length" style="text-align: center">暂无数据</div>
        </div>

    </div>
</template>

<script>
import authorButtons from "@/compositionApi/authorButtons";
import { debounce } from '@/utils/util'
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from 'vue';
export default {
    name: 'DomesticWarehouse',
    props: {
        tableLoading: {
            type: Boolean,
            default: false
        }
    },
    setup(prop, ctx) {
        const data = reactive({
            tableData: [],
            activeWarehouseId: '',
        })
        const { ctx: vueDev, proxy: vue } = getCurrentInstance();
        const api = vue.$http;
        const { BUTTONS } = authorButtons();
        const buttonAuthor = BUTTONS.value;
        const getUserWarehouseData = inject("getUserWarehouseData");
        onBeforeMount(() => { })
        onMounted(() => {
            //获取国内仓库 如果有数据默认使用第一条数据进行请求相应仓库中的用户数据
            // if (buttonAuthor.leftDataDetails) {
            api.system.selectTranWarehouse().then(res => {
                if (res.code == 200) {
                    console.log(res)
                    data.tableData = res.data
                    if (data.tableData.length) {
                        data.activeWarehouseId = data.tableData[0].tranWarehouseId
                        activeItem({ tranWarehouseId: data.activeWarehouseId, tranWarehouseName: data.tableData[0].tranWarehouseName })
                    }
                } else {
                    vue.$message.warning(res.msg)
                }
            }).catch(e => { })
            // } else {
            //     vue.$message.warning('暂无浏览国内仓库列表权限，请联系管理员处理！')
            // }
        })


        //选中当前仓库
        const activeItem = debounce(function (e) {
            data.activeWarehouseId = e.tranWarehouseId;
            getUserWarehouseData({ tranWarehouseId: data.activeWarehouseId, tranWarehouseName: e.tranWarehouseName })
        }, 300)

        const refData = toRefs(data);
        return {
            ...refData,
            activeItem,
            getUserWarehouseData,
            buttonAuthor,
        }
    }
};
</script>
<style scoped lang='scss'>
#DomesticWarehouse {
    height: 80vh;

    .DomesticWarehouseTitle {
        color: #7F7F7F;
        font-size: 18px;
        padding: 5px;
        margin-bottom: 15px;
        height: 30px;
        line-height: 30px;

        .titleIcon {
            font-size: 18px;
        }

        border-bottom: 1px solid #D7D7D7;
    }


    .tableLoadingClass {
        height: calc(80vh - 60px);
        overflow-y: auto;

        .itemWarehouse {
            font-size: 14px;
            padding: 3px 8px;
            margin: 0 10px;
            height: 30px;
            line-height: 30px;
            color: #666666;

            .itemIcon {
                font-size: 14px;
            }
        }

        .hoverItem {
            background-color: #F5F7FA !important;
        }

        .itemWarehouse:hover {
            background-color: #F5F7FA;
            cursor: pointer;
        }
    }


}
</style>