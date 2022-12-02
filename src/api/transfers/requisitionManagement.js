import {
    get,
    post,
    remove,
    put,
    downLoadFile,
    downLoadFilePost
} from "../request";

//requisitionManagement

const PORT1 = "/kte-warehouse";


// 打印调拨单
function printDialList(params) {
    return get(PORT1 + '/transferOrder/printDialList', params);
}

//打印汇总单
function printGatherList(params) {
    return get(PORT1 + '/transferOrder/printGatherList', params)
}

//打印汇入库明细
function printWarehousingDetail(params) {
    return get(PORT1 + '/transferOrder/printWarehousingDetail', params)
}
//获取调拨单列表
function getTransferOrderList(params) {
    return get(PORT1 + '/transferOrder/pre/confirm/in', params)
}


//调拨异常列表
function getAbnormalWarehousing(param) {
    return post(PORT1 + "/warehouseTransferAbnormal/list", param, true);
}
/** 获取调拨单管理列表
 * **/
export const AJAX_getAllotList = (msg) => {
    return post(PORT1 + '/transferOrder/list', msg, true)
}

//调拨异常详情
function getTransferAbnormalDetail(param) {
    return get(PORT1 + "/warehouseTransferAbnormal/getTransferAbnormalDetail", param);
}

//调拨异常直发确认入库
function confirmWarehousingFromStraightHair(param) {
    return post(PORT1 + '/warehouseTransferAbnormal/confirmWarehousingFromStraightHair', param, true);
}

//调拨异常中转确认入库
function confirmWarehousingFromTransit(param) {
    return post(PORT1 + '/warehouseTransferAbnormal/confirmWarehousingFromTransit', param, true);
}

//确认入库获取调拨仓为直发仓详情
function getTransferStraightHairDetail(param) {
    return get(PORT1 + '/warehouseTransferAbnormal/getTransferStraightHairDetail', param);
}

//确认入库获取调拨仓为中转仓详情
function getTransferTransitDetail(param) {
    return get(PORT1 + '/warehouseTransferAbnormal/getTransferTransitDetail', param)
}

/** 获取调拨单管理列表详情
 * **/
export const AJAX_getAllotList_detail = (msg) => {
    return get(PORT1 + '/transferOrder/getDetail', msg)
}

//打印箱标
function printBoxLabel(params) {
    return post(PORT1 + '/transferOrder/printBoxLabel', params, true)
}
//打印调拨异常箱标
function printUnusualBoxLabel(params) {
    return post(PORT1 + '/warehouseTransferAbnormal/printUnusualBoxLabel', params, true)
}

/** 作废调拨单
 * **/
export const AJAX_getAllotList_invalid = (msg) => {
    return get(PORT1 + '/transferOrder/invalid', msg)
}

/** 登记跟踪号
 * **/
export const AJAX_getAllotList_registrationTrackingNumber = (msg) => {
    return post(PORT1 + '/transferOrder/registrationTrackingNumber', msg, true)
}

/** 查看日志
 * **/
export const AJAX_getAllotList_log = (msg) => {
    return get(PORT1 + '/transferOrder/log', msg)
}
/** 确认出库
 * **/
export const AJAX_getAllotList_confirmOutOfStock = (msg) => {
    return post(PORT1 + '/transferOrder/confirmOutOfStock', msg, true)
}

//确认入库中转调中转确认入库分页回显
function getTransfeToTransfe(param) {
    return get(PORT1 + '/transferOrder/getTransfer-Transfer', param)
}

//中转调中转确认入库新增
function saveTransfeToTransfe(param) {
    return get(PORT1 + '/transferOrder/saveTransfer-Transfer', param)
}

//中转调中转确认入库删除
function delTransfeToTransfe(param) {
    return get(PORT1 + '/transferOrder/pre/confirm/in/dtt2/del', param)
}

//修改柜号
function updateCabinetNum(param) {
    return post(PORT1 + '/transferOrder/updateCabinetNum', param, true)
}
//提交直发调中转第一步数据
function submitFirstStep(params) {
    return post(PORT1 + '/transferOrder/pre/confirm/in/dtt2', params, true)
}

//获取直发调中转第二步数据
function getSecondStepData(params) {
    return get(PORT1 + '/transferOrder/pre/confirm/in/dtt2/list', params)
}

//获取库位
function getLocationDetail(params) {
    return get(PORT1 + '/warehouseTemporaryLocation/getLocationDetail', params)
}

//入库中转调直发数据
function transferTransferDirectHairWarehousing(params) {
    return post(PORT1 + '/transferOrder/transferTransferDirectHairWarehousing', params, true)
}

//确认入库-直发调中转第二步暂存
function saveConfirm(params) {
    return post(PORT1 + '/transferOrder/pre/confirm/in/dtt2/save', params, true)
}
//整单修改尺寸
function WholeSizeUpdate(params) {
    return post(PORT1 + '/transferOrder/WholeSizeUpdate', params, true)
}
//获取整单修改尺寸详情
function getWholeSizeDetail(params) {
    return post(PORT1 + '/transferOrder/getWholeSizeDetail', params, true)
}
//确认入库-直发调中转第二步确认入库
function submitConfirm(params) {
    return post(PORT1 + '/transferOrder/pre/confirm/in/dtt2/submit', params, true)
}
//确认入库中转-调中转异常生成
function submitConfirmAbnormal(params) {
    return post(PORT1 + '/transferOrder/pre/confirm/in/dtt2/submit/abnormal', params, true)
}
//整单修改柜号
function batchUpdateAllCabinetNumber(params) {
    return get(PORT1 + '/transferOrder/batchUpdateAllCabinetNumber', params)
}
//导出
function exportTransferOrder(param) {
    return downLoadFilePost(PORT1 + '/transferOrder/exportTransferOrder', param)
}
export default {
    printDialList,
    printGatherList,
    printWarehousingDetail,
    getAbnormalWarehousing,
    getTransferAbnormalDetail,
    confirmWarehousingFromStraightHair,
    confirmWarehousingFromTransit,
    getTransferStraightHairDetail,
    getTransferTransitDetail,
    printBoxLabel,
    getTransferOrderList,
    submitFirstStep,
    getSecondStepData,
    getLocationDetail,
    getTransfeToTransfe,
    printUnusualBoxLabel,
    getTransferOrderList,
    saveTransfeToTransfe,
    delTransfeToTransfe,
    updateCabinetNum,
    transferTransferDirectHairWarehousing,
    saveConfirm,
    WholeSizeUpdate,
    getWholeSizeDetail,
    submitConfirm,
    batchUpdateAllCabinetNumber,
    submitConfirmAbnormal,
    exportTransferOrder
}


