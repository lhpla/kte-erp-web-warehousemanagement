import {
    get,
    post,
    remove,
    put,
    downLoadFile,
    downLoadFilePost
} from "../request";
const PORT1 = "/kte-warehouse";

//盘点列表
function getSelectList(params) {
    return post(PORT1 + '/warehouseCheck/selectList', params, true);
}

//盘点列表详情
function checkListDetails(params) {
    return post(PORT1 + '/warehouseCheck/checkListDetails', params, true)
}

//导入
function checkDataExcelImport(params) {
    return post(PORT1 + '/warehouseCheck/checkDataExcelImport', params, false, true)
}

//盘点失败数据导出
function checkDataExcelFailExport(params) {
    return downLoadFile(PORT1 + '/warehouseCheck/checkDataExcelFailExport', params)
}

//盘点单作废
function checkNumberOutOfDate(params) {
    return post(PORT1 + '/warehouseCheck/checkNumberOutOfDate', params, true)
}

//盘点数据导出
function checkDataExcelExport(params) {
    return post(PORT1 + '/warehouseCheck/checkDataExcelExport', params, true)
}

//盘点结果导出
function checkResultExcelExport(params) {
    return post(PORT1 + '/warehouseCheck/checkResultExcelExport', params, true)
}

//盘点仓库审核
function checkWarehouseAudit(params) {
    return post(PORT1 + '/warehouseCheck/checkWarehouseAudit', params, true)
}

//人员列表
function selectUserList() {
    return get(PORT1 + '/warehouseCheck/selectUserList')
}

//盘点日志列表
function getLogList(params) {
    return post(PORT1 + '/warehouseCheck/getLogList', params, true)
}

//生成盘点单号
function generateCheckNumber(param) {
    return post(PORT1 + '/warehouseCheck/generateCheckNumber', param, true)
}

//根据中转id返回对应的仓区信息
function selectWarehouseByTraId(param) {
    return get(PORT1 + '/warehouseCheck/selectWarehouseByTraId', param)
}

//打印箱标（已完成中转仓盘点单打印盘盈和盘亏箱标）
function getBoxLabel(param) {
    return get(PORT1 + '/warehouseCheck/getBoxLabel', param)
}

export default {
    getSelectList,
    checkListDetails,
    checkDataExcelImport,
    checkNumberOutOfDate,
    checkDataExcelExport,
    checkResultExcelExport,
    checkWarehouseAudit,
    selectUserList,
    getLogList,
    checkDataExcelFailExport,
    generateCheckNumber,
    selectWarehouseByTraId,
    getBoxLabel
}