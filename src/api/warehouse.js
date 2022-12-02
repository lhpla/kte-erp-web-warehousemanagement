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

// 仓储 warehouse

// 签收列表（质检列表）
function getReceiptList(param) {
  return post(PORT1 + "/warehouseReceipt/getReceiptList", param, true);
}

// 签收查看-质检查看
function warehouseReceiptDetail(param) {
  return get(PORT1 + "/warehouseReceipt/detail", param);
}

// 搜索  仓库签收
function warehouseReceiptSearch(param) {
  return post(PORT1 + "/warehouseReceipt/search", param, true);
}

// 仓库  签收确认
function warehouseReceiptConfirm(param) {
  return post(PORT1 + "/warehouseReceipt/confirm", param, true);
}

// 获取质检产品信息
function getQualityProductInfo(param) {
  return get(PORT1 + "/warehouseQuality/getQualityProductInfo", param);
}

// 质检搜索
function warehouseQualitySearch(param) {
  return post(PORT1 + "/warehouseQuality/search", param, true);
}

// 质检 打印条码
function warehouseQualityDetail(params) {
  return get(PORT1 + "/warehouseQuality/detail", params);
}

// 保存柜号箱号信息
function saveBoxInfo(param) {
  return post(PORT1 + "/warehouseQuality/saveBoxInfo", param, true);
}

//校验并保存柜号箱号信息
function checkAndSaveBoxInfo(param) {
  return post(PORT1 + "/warehouseQuality/checkAndSaveBoxInfo", param, true)
}

// 保存质检信息
function saveQuality(param) {
  return post(PORT1 + "/warehouseQuality/saveQuality", param, true);
}

// 库存列表
function repertoryList(param) {
  return post(PORT1 + "/warehouseInventory/repertoryList", param, true);
}

// 库存日志列表
function warehouseLogList(param) {
  return post(PORT1 + "/warehouseLog/logList", param);
}

// 箱货列表
function getWarehouseCases(param) {
  return post(PORT1 + "/warehouseCases/selectList", param, true);
}

// 封箱
function sealWarehouseCases(param) {
  return get(PORT1 + "/warehouseCases/sealWarehouseCases", param);
}

// 箱货详情
function warehouseCasesDetail(param) {
  return get(PORT1 + "/warehouseCases/warehouseCasesDetail", param);
}

// 修改箱货尺寸
function updateSize(param) {
  return post(PORT1 + "/warehouseCases/updateSize", param);
}

// 查看异常详情
function checkAbnormalMessages(param) {
  return post(PORT1 + "/abnormal/checkAbnormalMessages", param, true);
}

// 回复异常
function replyMessage(param) {
  return post(PORT1 + "/abnormal/replyMessage", param, true);
}

// 仓库分页列表
function getWareHousePage(param) {
  return post(PORT2 + "/wareHouse/wareHousePage", param, true);
}

// 仓库新增或修改
function wareHouseSubmit(param) {
  return post(PORT2 + "/wareHouse/submit", param, true);
}

// 仓库禁用
function wareHouseDisable(param) {
  return get(PORT2 + "/wareHouse/status", param);
}

// 国家数据列表
function getCountryList() {
  return get(PORT2 + "/country/list");
}

// 仓储异常 结束异常  /kte-warehouse/abnormal/endMessage
function endMessage(param) {
  return post(PORT1 + "/abnormal/endMessage", param, true);
}

// 校验修改箱号是否符合对应仓区
function warehouseQuality(param) {
  return get(PORT1 + "/warehouseQuality/verifyBox", param);
}

///kte-warehouse/abnormal/processingMethod  设置处理方式
function processingMethod(param) {
  return post(PORT1 + "/abnormal/processingMethod", param, true);
}

//保存调拨
function saveTransfer(param) {
  return post(PORT1 + "/warehouseTransfer/saveTransfer", param, true)
}

//调拨记录列表
function getTransferList(param) {
  return post(PORT1 + "/warehouseTransfer/transferList", param, true)
}

//查看调拨详情
function getTransferSelectOne(param) {
  return get(PORT1 + "/warehouseTransfer/detail", param)
}

//确认调拨
function confirmTransfer(param) {
  return post(PORT1 + "/warehouseTransfer/confirmTransfer", param, true)
}

//处理调拨
function processTransfer(param) {
  return post(PORT1 + "/warehouseTransfer/processTransfer", param)
}

//驳回调拨
function refusalTransfer(param) {
  return post(PORT1 + "/warehouseTransfer/refusalTransfer", param)
}

//物流柜列表 /kte-warehouse
function cabinetSelectList(params) {
  return post(PORT1 + '/cabinet/selectList', params, true)
}

//物流柜详情  /kte-warehouse
function selectSkuOfCasesList(params) {
  return post(PORT1 + '/cabinet/selectSkuOfCasesList', params, true)
}
//出柜异常处理调拨列表  /kte-warehouse
function warehouseAbnormalCasesSku(params) {
  return post(PORT1 + '/cabinetAbnormal/warehouseAbnormalCasesSku', params, true)
}
//出柜异常处理获取柜号下拉框  /kte-warehouse
function selectCabinetNum(params) {
  return post(PORT1 + '/cabinetAbnormal/selectCabinetNum', params, true)
}
//调拨处理  /kte-warehouse
function abnormalTransfer(params) {
  return post(PORT1 + '/cabinet/abnormalTransfer', params, true)
}
//异常箱子详情  /kte-warehouse
function abnormalCasesDetail(params) {
  return get(PORT1 + '/cabinetAbnormal/abnormalCasesDetail', params)
}

//出柜 出柜列表
function getOutCabinetList(params) {
  return post(PORT1 + '/cabinet/getOutCabinetList', params, true)
}

// //生成发货计划 /kte-warehouse
// function shippingSchedule(params) {
//   return post(PORT1 + '/cabinet/shippingSchedule', params, true)
// }

//发货计划驳回 /kte-warehouse/cabinet/reject
function cabinetReject(params) {
  return post(PORT1 + '/cabinet/reject', params, true)
}

//查看日志 /kte-warehouse
function selectCabinetLog(params) {
  return get(PORT1 + '/cabinet/selectCabinetLog', params)
}

//发货计划物流 /kte-warehouse
function cabinetLogistics(params) {
  return post(PORT1 + '/cabinet/logistics', params, true)
}

//获取目的和起运港口 /kte-warehouse
function cabinetPortList(params) {
  return get(PORT1 + '/cabinet/portList', params, true);
}

//发起计划 /kte-warehouse
function startSchedule(params) {
  return get(PORT1 + '/cabinet/startSchedule', params)
}

//根据国内仓获取库位
function getLocationList(params) {
  return get(PORT1 + '/location/list', params)
}

//出柜子信息
function cabinetExcelExport(param) {
  return downLoadFile(PORT1 + '/cabinet/cabinetExcelExport', param)
}

//出柜异常列表
function getCabinetAbnormal(params) {
  return post(PORT1 + '/cabinetAbnormal/selectList', params, true)
}

//删除已出柜箱子
function removePackCabinetCases(param) {
  return post(PORT1 + '/cabinet/removePackCabinetCases', param, true)
}

//确认出柜
function outCabinet(param) {
  return post(PORT1 + '/cabinet/outCabinet', param, true)
}

//打印谷仓箱唛
function printReceivingBox(param) {
  return post(PORT1 + '/cabinetAbnormal/receivingBox', param, true)
}


//出柜异常列表详情数据
function warehouseAbnormalCases(param) {
  return post(PORT1 + '/cabinetAbnormal/warehouseAbnormalCases', param, true)
}

//获取出柜异常列表日志
function getAbnormalLog(param) {
  return post(PORT1 + '/cabinet/getAbnormalLog', param, true)
}

//发货计划列表详情
function getShipmentDetailList(param) {
  return post(PORT1 + '/cabinet/shipmentDetail', param, true)
}

//查询物流
function getSelectLogistics(param) {
  return get(PORT1 + '/cabinet/selectLogistics', param)
}

//手动谷仓入库
function manualGoodGrn(param) {
  return get(PORT1 + '/cabinet/manualGoodGrn', param)
}

//批量封箱
function batchSealWarehouseCases(param) {
  return post(PORT1 + '/warehouseCases/batchSealWarehouseCases', param, true)
}

//获取箱子详情
function getDetailVo(param) {
  return get(PORT1 + '/warehouseCases/getDetailVo', param)
}

//修改箱号
function updateCartonNum(param) {
  return post(PORT1 + '/warehouseCases/updateCartonNum', param, true)
}

//查询已出柜的数据列表
function selectOutCabinetList(param) {
  return post(PORT1 + '/cabinet/selectOutCabinetList', param, true)
}

//获取仓区管理列表详情
function wareHouseGetDetail(param) {
  return get(PORT2 + '/wareHouse/getDetail', param)
}

//导出箱子
function exportCases(param) {
  return downLoadFilePost(PORT1 + '/warehouseCases/exportCases', param, true)
}

//产品异常列表
function abnormalProductList(params) {
  return post(PORT1 + '/warehouseAbnormal/abnormalProductList', params, true)
}

//财务异常列表
function financeAbnormalAuditList(params) {
  return post(PORT1 + '/warehouseAbnormal/financeAbnormalAuditList', params, true)
}

//获取异常详情（新）
function getNewAbnormalDetail(param) {
  return post(PORT1 + '/warehouseAbnormal/abnormalDetail', param, true)
}

//根据采购单号获取异常数据
function abnormalByPurchaseOrderCode(param) {
  return post(PORT1 + '/warehouseAbnormal/abnormalByPurchaseOrderCode', param, true)
}

//供应商抵扣记录
function supplierDeduction(param) {
  return get('/kte-product/supplierDeduction/list', param)
}
//异常处理
function abnormalDispose(param) {
  return post(PORT1 + '/warehouseAbnormal/abnormalDispose', param, true)
}
//异常处理
function checkSkue(param) {
  return post('/kte-purchase/replenishment/checkSku', param, true)
}

//获取质检异常详情
function getQualityAbnormalDetail(param) {
  return post(PORT1 + '/warehouseAbnormal/getQualityAbnormalDetail', param, true)
}

//获取仓库人员列表
function getUsersOfWarehouse(param) {
  return get(PORT3 + '/getUsersOfWarehouse', param)
}

//获取库存流水
function getInventoryFlow(param) {
  return post(PORT1 + '/inventorySerial/serialList', param, true)
}
//撤回计划
function withdrawalPlan(param) {
  return post(PORT1 + `/cabinet/withdrawalPlan?cabinetNum=${param}`)
}

//获取质检异常详情
function customizePort(param) {
  return post(PORT1 + '/cabinet/customizePort', param, true)
}

//获取图片视频路径
function getPath(param) {
  return get(PORT1 + '/cabinet/getPath', param)
}

//提交视频文件
function submit(param) {
  return post(PORT1 + '/cabinet/submit', param, true)
}
//导出
function casesInfoExcelExport(param) {
  return post(PORT1 + '/cabinet/casesInfoExcelExport', param, true)
}

//获取不同流程所有异常数量 
function getAbnormalNumberOfProcesses(param) {
  return get(PORT1 + '/warehouseAbnormal/getAbnormalNumberOfProcesses')
}
//获取柜号下拉
function getCabinetNumList(param) {
  return get(PORT1 + '/cabinet/getCabinetNumList', param)
}
//获取柜号下拉
function getCasesLogByCasesIdList(param) {
  return post(PORT1 + '/warehouseCases/getCasesLogByCasesIdList', param, true)
}
//获取修改柜号后的箱号
function getCabinetCasesNumList(param) {
  return get(PORT1 + '/cabinet/getCabinetCasesNumList', param)
}
//添加发起计划获取柜号列表
function getCabinetByInitiatePlan(param) {
  return post(PORT1 + '/cabinet/getCabinetByInitiatePlan', param, true)
}
//发货计划列表
function warehouseShipping(param) {
  return post(PORT1 + '/warehouseShipping/selectList', param, true)
}
//发货计划详情
function shippingScheduleDetail(param) {
  return get(PORT1 + '/warehouseShipping/shippingScheduleDetail', param)
}
//确认发起发货计划
function confirmInitiationOfShippingPlan(param) {
  return post(PORT1 + '/warehouseShipping/confirmInitiationOfShippingPlan', param, true)
}
//发货计划驳回
function reject(params) {
  return post(PORT1 + '/warehouseShipping/reject', params, true)
}
//发货计划撤回计划
function withdrawalPlanN(params) {
  return post(PORT1 + '/warehouseShipping/withdrawalPlan', params, true)
}
//审核撤回的发货计划
function auditShipping(params) {
  return post(PORT1 + '/warehouseShipping/auditShipping', params, true)
}
// //柜子物流
// function logistics(params) {
//   return post(PORT1 + '/warehouseShipping/logistics', params, true)
// }
//生成发货计划
function shippingScheduleN(params) {
  return post(PORT1 + '/warehouseShipping/shippingSchedule', params, true)
}
//查询物流
function selectLogistics(param) {
  return get(PORT1 + '/warehouseShipping/selectLogistics', param)
}
//标记发货计划
function markShippingSchedule(param) {
  return post(PORT1 + '/warehouseShipping/markShippingSchedule', param, true)
}
//查询撤回或驳回原因
function selectReason(param) {
  return post(PORT1 + '/warehouseShipping/selectReason', param)
}
//减货列表
function checkLess(param) {
  return post(PORT1 + '/warehouseShipping/checkLess', param, true)
}
//查看发货计划日志
function selectShippingLog(param) {
  return get(PORT1 + '/warehouseShipping/selectShippingLog', param)
}

//获取路径
function getPathWarehouseShipping(param) {
  return get(PORT1 + '/warehouseShipping/getPath', param)
}

//上传柜子图片和视频
function uploadPhotoAndVideo(param) {
  return post(PORT1 + '/warehouseShipping/uploadPhotoAndVideo', param, true)
}
//出柜异常详情
function warehouseAbnormalDetail(param) {
  return post(PORT1 + '/cabinetAbnormal/warehouseAbnormalDetail', param, true)
}
//标记
function mark(param) {
  return post(PORT1 + '/warehouseShipping/mark', param)
}
//确认出柜
function outCabinetN(param) {
  return post(PORT1 + '/warehouseShipping/outCabinet', param, true)
}
//发货计划详情
function shippingDetails(param) {
  return post(PORT1 + '/warehouseShipping/shippingDetails', param, true)
}
//发货计划列表详情
function viewShippingDetailsCabinetNumberListDetails(param) {
  return post(PORT1 + '/warehouseShipping/viewShippingDetailsCabinetNumberListDetails', param, true)
}
//发货计划下拉查看详情
function viewShippingCabinetNumberListDetails(param) {
  return post(PORT1 + '/warehouseShipping/viewShippingCabinetNumberListDetails', param, true)
}
//出柜列表查看
function viewCabinetNumberListDetails(param) {
  return post(PORT1 + '/warehouseShipping/viewCabinetNumberListDetails', param, true)
}
//查询生成按钮发货计划数据
function selectGenerate(param) {
  return get(PORT1 + '/warehouseShipping/selectGenerate', param)
}

//质检打印删除接口
function deleteWarehouseCases(param) {
  return post(PORT1 + '/warehouseQuality/deleteWarehouseCases', param, true)
}

//质检打印新增保存接口
function saveWarehouseCases(param) {
  return post(PORT1 + '/warehouseQuality/saveWarehouseCases', param, true)
}

// 导出柜子异常明细
function exportCabinetAbnormal(param) {
  return downLoadFilePost(PORT1 + '/cabinetAbnormal/exportCabinetAbnormal', param)
}
//查询中转仓库(仓库属性为非直发的国内仓库)
function selectTransitWarehouse(param) {
  return get(PORT1 + '/warehouseShipping/selectTransitWarehouse', param)
}
//查询仓区(仓库属性为非直发的国内仓库)
function selectPurposeWarehouse(param) {
  return get(PORT1 + '/warehouseShipping/selectPurposeWarehouse', param)
}

// 获取库位 
function getLocationDetail(param) {
  return get(PORT1 + '/warehouseTemporaryLocation/getLocationDetail', param)
}

//获取分配单证人员
function distribute(param) {
  return get(PORT3 + '/getDocUser', param)
}

//提交分配单证人员
function submitDistribute(param) {
  return post(PORT1 + '/warehouseShipping/distribute', param, true)
}
//装柜数据导入模板
function warehouseOutCabinetExcel(param) {
  return downLoadFile(PORT1 + '/warehouseShipping/warehouseOutCabinetExcel', param, true)
}
//装柜数据下载失败数据
function downloadFailedImport(param) {
  return downLoadFile(PORT1 + '/warehouseShipping/downloadFailedImport', param, true)
}
//导入装柜数据
function importWarehouseOutCabinetExcel(param) {
  return post(PORT1 + '/warehouseShipping/importWarehouseOutCabinetExcel', param, false, true)
}
//导出发货计划
function downloadShipping(param) {
  return post(PORT1 + '/warehouseShipping/downloadShipping', param, true)
}
//下载队列
function getDownloadQueue(param) {
  return post(PORT1 + '/warehouseShipping/getDownloadQueue', param, true)
}
//设置入库单备注
function saveEnterCodeRemark(param) {
  return post(PORT1 + '/cabinet/saveEnterCodeRemark', param, true)
}

//校验质检打印数据
function verifyPrintData(param) {
  return post(PORT1 + "/warehouseQuality/verifyPrintData", param, true)
}
//封箱列表获取柜号下拉 
function getCabinetNumListForCasesList(param) {
  return post(PORT1 + '/cabinet/getCabinetNumListForCasesList', param, true)
}
//封箱列表批量修改柜号 
function batchUpdateCabinet(param) {
  return post(PORT1 + '/warehouseCases/batchUpdateCabinet', param, true)
}

//导入发货计划 
function importShipping(param) {
  return post(PORT1 + '/warehouseShipping/importShipping', param, false, true)
}

//导出发货计划模板
function warehouseShippingExcel() {
  return downLoadFile(PORT1 + '/warehouseShipping/warehouseShippingExcel')
}

// 导出库存流水
function exportSerial(param) {
  return downLoadFilePost(PORT1 + '/inventorySerial/exportSerial', param)
}
//打印入库清单
function printInventoryListPdf(param) {
  return get(PORT1 + '/warehouseShipping/printInventoryListPdf', param)
}

//发货计划校验类型
function checkShippingType(param) {
  return post(PORT1 + '/warehouseShipping/checkShippingType', param, true)
}
//查询可删除的箱唛
function getBoxMark(param) {
  return get(PORT1 + '/cabinet/getBoxMark', param)
}
//谷仓删除箱唛运维接口
function delBox(param) {
  return post(PORT1 + '/cabinet/delBox', param, true)
}
//导出库存数据
function exportInventoryData(param) {
  return post(PORT1 + '/warehouseInventory/exportInventoryData', param, true)
}
//修改SKU包装尺寸和毛重
function updateSkuSizeAndWeight(param) {
  return post(PORT1 + '/warehouseQuality/updateSkuSizeAndWeight', param, true)
}
//校验是否可批量修改箱子尺寸
function updateCasesSizeVerify(param) {
  return post(PORT1 + '/warehouseCases/updateCasesSizeVerify', param, true)
}
//批量修改箱子尺寸
function updateCasesSize(param) {
  return post(PORT1 + '/warehouseCases/updateCasesSize', param, true)
}
//库存明细导出
function exportInventoryDetail(param) {
  return post(PORT1 + '/warehouseInventory/exportInventoryDetail', param, true)
}
//获取在途采购单
function getTransitOrderCode(param) {
  return post(PORT1 + '/warehouseInventory/getTransitOrderCode', param, true)
}
export default {
  getReceiptList,
  getWarehouseCases,
  warehouseReceiptDetail,
  warehouseReceiptSearch,
  warehouseReceiptConfirm,
  getQualityProductInfo,
  saveQuality,
  repertoryList,
  sealWarehouseCases,
  warehouseCasesDetail,
  updateSize,
  checkAbnormalMessages,
  replyMessage,
  warehouseQualitySearch,
  warehouseLogList,
  getWareHousePage,
  wareHouseSubmit,
  wareHouseDisable,
  getCountryList,
  warehouseQualityDetail,
  saveBoxInfo,
  checkAndSaveBoxInfo,
  endMessage,
  warehouseQuality,
  processingMethod,
  saveTransfer,
  getTransferList,
  getTransferSelectOne,
  confirmTransfer,
  processTransfer,
  refusalTransfer,
  cabinetSelectList,
  selectSkuOfCasesList,
  getOutCabinetList,
  // shippingSchedule,
  cabinetReject,
  selectCabinetLog,
  cabinetLogistics,
  cabinetPortList,
  startSchedule,
  getLocationList,
  cabinetExcelExport,
  getCabinetAbnormal,
  removePackCabinetCases,
  outCabinet,
  printReceivingBox,
  warehouseAbnormalCases,
  getAbnormalLog,
  warehouseAbnormalCasesSku,
  selectCabinetNum,
  abnormalTransfer,
  abnormalCasesDetail,
  getShipmentDetailList,
  getSelectLogistics,
  manualGoodGrn,
  batchSealWarehouseCases,
  getDetailVo,
  updateCartonNum,
  selectOutCabinetList,
  wareHouseGetDetail,
  exportCases,
  abnormalProductList,
  financeAbnormalAuditList,
  abnormalByPurchaseOrderCode,
  getNewAbnormalDetail,
  abnormalDispose,
  supplierDeduction,
  checkSkue,
  getQualityAbnormalDetail,
  getUsersOfWarehouse,
  getInventoryFlow,
  withdrawalPlan,
  customizePort,
  getPath,
  submit,
  casesInfoExcelExport,
  getAbnormalNumberOfProcesses,
  getCabinetNumList,
  getCasesLogByCasesIdList,
  getCabinetCasesNumList,
  getCabinetByInitiatePlan,
  warehouseShipping,
  shippingScheduleDetail,
  confirmInitiationOfShippingPlan,
  reject,
  withdrawalPlanN,
  auditShipping,
  // logistics,
  selectLogistics,
  shippingScheduleN,
  markShippingSchedule,
  selectReason,
  selectShippingLog,
  checkLess,
  getPathWarehouseShipping,
  uploadPhotoAndVideo,
  warehouseAbnormalDetail,
  mark,
  outCabinetN,
  shippingDetails,
  viewShippingDetailsCabinetNumberListDetails,
  viewShippingCabinetNumberListDetails,
  viewCabinetNumberListDetails,
  selectGenerate,
  deleteWarehouseCases,
  saveWarehouseCases,
  exportCabinetAbnormal,
  selectTransitWarehouse,
  selectPurposeWarehouse,
  getLocationDetail,
  distribute,
  submitDistribute,
  warehouseOutCabinetExcel,
  importWarehouseOutCabinetExcel,
  downloadFailedImport,
  downloadShipping,
  getDownloadQueue,
  submitDistribute,
  saveEnterCodeRemark,
  verifyPrintData,
  getCabinetNumListForCasesList,
  batchUpdateCabinet,
  importShipping,
  warehouseShippingExcel,
  exportSerial,
  printInventoryListPdf,
  checkShippingType,
  delBox,
  getBoxMark,
  exportInventoryData,
  updateSkuSizeAndWeight,
  updateCasesSizeVerify,
  updateCasesSize,
  exportInventoryDetail,
  getTransitOrderCode
}