import {
    get,
    post,
    remove,
    put,
    downLoadFile,
    downLoadFilePost
} from "./request";
const PORT1 = "/kte-warehouse";
const PORT2 = "/kte-system";
const PORT3 = "/kte-user";
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)

// fba

// FBA 发货计划列表
function warehouseFbaShipList(param) {
    return post(PORT1 + "/warehouseFbaShip/warehouseFbaShipList", param, true);
}
// FBA SKU列表
function warehouseFbaSkuList(param) {
    return get(PORT1 + "/warehouseFbaShip/warehouseFbaSkuList", param);
}
// FBA 删除
function deleteFbaShip(param) {
    return get(PORT1 + "/warehouseFbaShip/deleteFbaShip", param);
}
// FBA 驳回
function fbaRefusal(param) {
    return get(PORT1 + "/warehouseFbaShip/fbaRefusal", param);
}
//批量导出箱唛
function exportBoxMarkPdf(param) {
    return downLoadFilePost(PORT1 + "/warehouseFbaShip/exportBoxMarkPdf", param)
}
//上传箱唛
function importBoxMarkPdf(param) {
    return post(PORT1 + '/warehouseFbaShip/importBoxMarkPdf', param, true)
}
//完成贴唛
function stickMark(param) {
    return post(PORT1 + '/warehouseFbaShip/stickMark', param, true)
}
//查看物流
function logistics(param) {
    return get(PORT1 + '/warehouseFbaShip/logistics', param)
}
//FBA日志动态
function fbaLogList(param) {
    return post(PORT1 + '/warehouseFbaShip/fbaLogList', param, true)
}
//打印FBA标签
function printFbaLabel(param) {
    return get(PORT1 + "/warehouseFbaShip/printFbaLabel", param)
}
//打印FBA拣货明细  
function printFbaPickingList(param) {
    return post(PORT1 + "/warehouseFbaShip/printFbaPickingList", param, true)
}

//导出FBA发货计划  
function exportFbaShipExcel(param) {
    return downLoadFilePost(PORT1 + '/warehouseFbaShip/exportExcel', param)
}

//确认出库
function confirmOutOfStock(param) {
    return post(PORT1 + '/warehouseFbaShip/confirmOutOfStock', param, true)
}

//保存上架信息
function saveListingInformation(param) {
    return post(PORT1 + '/warehouseFbaShip/saveListingInformation', param, true)
}

//上架查询
function listingQuery(param) {
    return get(PORT1 + '/warehouseFbaShip/listingQuery', param)
}

//确认上架
function confirmListing(param) {
    return post(PORT1 + '/warehouseFbaShip/confirmListing', param, true)
}
//查询
function getFbaShipBoxById(param) {
    return get(PORT1 + '/warehouseFbaShip/getFbaShipBoxById', param)
}
//保存
function submitBoxManipulate(param) {
    return post(PORT1 + '/warehouseFbaShip/submitBoxManipulate', param, true)
}
//修改拣货数据
function updateOrSavePicking(param) {
    return post(PORT1 + '/warehouseFbaShip/updateOrSavePicking', param, true)
}
//提货安排
function selectPickUpGoods(param) {
    return get(PORT1 + '/warehouseFbaShip/selectPickUpGoods', param)
}
//装箱列表数据
function logisticsRejectedPackingEcho(param) {
    return get(PORT1 + '/warehouseFbaShip/logisticsRejectedPackingEcho', param)
}
//获取fba计划状态个数
function getNumOfDifferentStates(param) {
    return get(PORT1 + '/warehouseFbaShip/getNumOfDifferentStates', param)
}
export default {
    warehouseFbaShipList,
    warehouseFbaSkuList,
    deleteFbaShip,
    fbaRefusal,
    exportBoxMarkPdf,
    importBoxMarkPdf,
    stickMark,
    logistics,
    fbaLogList,
    printFbaLabel,
    printFbaPickingList,
    exportFbaShipExcel,
    confirmOutOfStock,
    saveListingInformation,
    listingQuery,
    confirmListing,
    getFbaShipBoxById,
    submitBoxManipulate,
    updateOrSavePicking,
    selectPickUpGoods,
    logisticsRejectedPackingEcho,
    getNumOfDifferentStates
}
