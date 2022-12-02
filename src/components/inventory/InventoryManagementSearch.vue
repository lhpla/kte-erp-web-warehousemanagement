<!-- 盘点管理搜索 InventoryManagementSearch -->
<template>
    <div id="SearchPanel">
        <el-form :inline="true" ref="searchFormDataRef" label-width="80px" :model="data.searchFormData"
            class="demo-form-inline el-from">
            <el-form-item label="仓库:" prop="transferWarehouseId" class="SearchPanel-form-item">
                <el-select v-model="data.searchFormData.transferWarehouseId" filterable placeholder="请选择" clearable
                    @change="search">
                    <el-option v-for="item in data.warehouseList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="盘点单号:" prop="checkNumber" class="SearchPanel-form-item">
                <el-input v-model="data.searchFormData.checkNumber" placeholder="双击批量搜索" maxlength="100"
                    @keyup.enter="search" clearable
                    @dblclick="openInput(data.searchFormData.checkNumber, 'checkNumber')">
                </el-input>
            </el-form-item>
            <el-form-item label="人员:" class="SearchPanel-form-item">
                <div class="flex">
                    <el-select v-model="data.searchFormData.userType" filterable clearable placeholder="请选择"
                        class="size-width">
                        <el-option v-for="item in data.userType" :key="item.key" :label="item.value" :value="item.key">
                        </el-option>
                    </el-select>
                    <el-select filterable clearable v-model="data.searchFormData.userId" placeholder="请选择"
                        @change="search">
                        <el-option v-for="item in data.userList" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </div>
            </el-form-item>

            <el-form-item label="日期:" class="SearchPanel-form-item">
                <div class="flex">
                    <el-select class="size-width" style="width:150px" v-model="data.searchFormData.timeType" filterable
                        clearable placeholder="请选择">
                        <el-option v-for="item in data.dateList" :key="item.key" :label="item.value" :value="item.key">
                        </el-option>
                    </el-select>
                    <el-date-picker v-model="data.searchFormData.dateTime"
                        @change="dateBlur(data.searchFormData.dateTime)" type="datetimerange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </el-form-item>

            <el-form-item label="盘点状态:" class="SearchPanel-form-item">
                <el-checkbox-group v-model="data.searchFormData.status" @change="
                    changeClick(
                        data.searchFormData.status,
                        'status',
                        data.warehouse_check_status.length
                    )
                ">
                    <el-checkbox-button label="0">全部</el-checkbox-button>
                    <el-checkbox-button v-for="item in data.warehouse_check_status" :label="item.dizKey"
                        :key="item.dizKey">
                        {{ item.value }}
                    </el-checkbox-button>
                </el-checkbox-group>
            </el-form-item>
            <div class="footer-button">
                <el-form-item>
                    <el-button type="primary" size="small" @click="search">搜 索
                    </el-button>
                    <el-button type="primary" size="small" @click="reset">重 置</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, watch, nextTick } from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import { parseTime, localGet } from "@/utils/util";
const { BUTTONS } = authorButtons();
const buttonAuthor = BUTTONS.value;
const data = reactive({
    //仓库列表
    warehouseList: [],
    //仓区列表
    warehouseAreaList: [],
    // 盘点状态
    warehouse_check_status: [],
    //搜索表单
    searchFormData: {
        userType: "create_user",
        transferWarehouseId: "",
        timeType: "create_time",
        startTime: "",
        endTime: "",
        checkNumber: '',
        dateTime: '',
        status: ["0"],
    },
    time: "",
    dateList: [
        { key: "create_time", value: "创建时间" },
        { key: "update_time", value: "更新时间" },
    ],
    userType: [
        { key: "create_user", value: "创建人员" },
        { key: "update_user", value: "更新人员" },
    ],
    showMessage: false,
});
onBeforeMount(() => { });
onMounted(() => {
    getDictList();
});
const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
const getTableData = inject("getTableData");
const getDictList = () => {
    // 仓库
    api.system.getWareHouseList({ type: 1 }).then(res => {
        if (res.code == 200) {
            data.warehouseList = res.data;
        }
    });
    // 仓区
    api.system.getWareHouseList({ type: 0 }).then(res => {
        if (res.code == 200) {
            data.warehouseAreaList = res.data;
        }
    });
    //获取仓储人员
    api.inventory.selectUserList().then((res) => {
        if (res.code == 200) {
            data.userList = res.data;
        }
    });
    //盘点状态
    data.warehouse_check_status = localGet("purchaseDict").warehouse_check_status
        ? localGet("purchaseDict").warehouse_check_status
        : [];
};
//搜索
const search = () => {
    data.searchFormData.scroll = 0;
    let msg = JSON.parse(JSON.stringify(data.searchFormData))
    msg.status = msg.status[0] == '0' ? null : msg.status
    getTableData(msg);
};
//重置表单
const reset = () => {
    data.searchFormData = {
        userType: "create_user",
        transferWarehouseId: "",
        timeType: "create_time",
        startTime: "",
        endTime: "",
        checkNumber: '',
        dateTime: '',
        status: ["0"],
    }
    search()
}
// 日期修改
const dateBlur = (e) => {
    if (data.searchFormData.timeType) {
        if (e) {
            data.searchFormData.startTime = parseTime(e[0]);
            data.searchFormData.endTime = parseTime(e[1]);
        } else {
            data.searchFormData.startTime = "";
            data.searchFormData.endTime = "";
        }
        search()
    } else {
        data.searchFormData.dateTime = null;
        vue.$message({
            type: "warning",
            message: "请选择时间类型",
        });
    }

};
const temp = ref("");
//批量搜索
const openInput = (info, name) => {
    data.showMessage = true;
    vue
        .$prompt("可输入多个，以英文分号、逗号、空格或者回车隔开", "批量查询", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputValue: info,
            inputType: "textarea",
            inputValidator: (value) => {
                if (value && value.length > 500) {
                    return "输入字符不能大于500 ";
                }
            },
        })
        .then(({ value }) => {
            data.searchFormData[name] = temp.value
                .trim()
                .replaceAll("\n", ";")
                .replaceAll(" ", ";")
                .replaceAll(",", ";")
                .replaceAll("，", ";")
                .replaceAll("；", ";");
            data.searchFormData[name] = data.searchFormData[name]
                .split(";")
                .filter((item) => item !== "")
                .join(";");
            data.showMessage = false;
            temp.value = "";
            search()
        })
        .catch(() => {
            temp.value = "";
            data.showMessage = false;
        });
};
watch(
    () => data.showMessage,
    (val) => {
        if (val) {
            nextTick(() => {
                let textarea = document.getElementsByTagName("textarea")[0];
                textarea.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        const index = handleInputREnter(e);
                        textarea.value = textarea.value.substring(0, index) + "\n" + textarea.value.substring(index);
                    }
                    temp.value = textarea.value;
                });
                textarea.addEventListener("input", () => {
                    temp.value = textarea.value;
                });
            });
        }
    }
);
const handleInputREnter = (e) => {
    const index = e.srcElement.selectionStart;
    return index;
};
// 多选改变
const changeClick = (arr, name, length) => {
    if (arr.length > 0) {
        if (arr.length == length && arr[0] !== "0") {
            data.searchFormData[name] = ["0"];
        } else if (arr[0] == "0") {
            let findResult = arr.indexOf("0");
            if (findResult !== -1) {
                data.searchFormData[name].splice(findResult, 1);
            }
        } else {
            let findResult = arr.indexOf("0");
            if (findResult !== -1) {
                data.searchFormData[name] = ["0"];
            }
        }
    } else {
        data.searchFormData[name] = ["0"];
    }
    search()
};
</script>
<style scoped lang='scss'>
#SearchPanel {
    margin: 0;
    .size-width {
        width: 35%;
        margin-right: 10px;
    }

    .el-form-item {
        margin-bottom: 5px !important;
    }

    .form-content {
        height: 30px;
        overflow: hidden;
        transition: all 0.5s !important;
    }

    .collapseClass {
        height: auto;
        overflow: auto;
        transition: all 1s;
    }

    .footer-button {
        display: flex;
        justify-content: flex-end;
    }
}
</style>