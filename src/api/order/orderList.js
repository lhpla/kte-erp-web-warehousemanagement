import { get, post, remove, put, downLoadFile, downLoadFilePost } from "../request";
const PORT1 = "/kte-order";

// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)

//采购单列表方法
//新增订单信息
function addOrderInfo(param) {
  return post(PORT1 + "/order/addOrderInfo", param, true);
}

//获取发货仓库
function getDeliveryWarehouse() {
  return get(PORT1 + "/logisticsManage/getWarehouse");
}

//根据条件获取订单下架分页列表
function getOffOrderList(param) {
  return post(PORT1 + "/directShipment/getShelvesList", param);
}

//根据条件获取下架单分页列表
function gettakeOffList(param) {
  return post(PORT1 + "/directShipment/takeOffList", param);
}

//根据条件获取出货列表分页列表
function getShipmentList(param) {
  return post(PORT1 + "/pickingOrder/shipment/list", param);
}

//根据条件获取订单下架操作
function batchPutDown(param) {
  return post(PORT1 + "/directShipment/batchPutDown", param, true);
}

//获取所有拣货员
function getAllPickingUser() {
  return get(PORT1 + "/directShipment/getAllPickingUser");
}

//获取所有打包员
function getfindPacker() {
  return get(PORT1 + "/pickingOrder/findPacker");
}

//获取下架单日志
function getOffLog(param) {
  return get(PORT1 + "/directShipment/getPickingLogInfo", param);
}

//根据拣货单号获取拣货信息
function getPickingInfoByNo(param) {
  return get(PORT1 + "/directShipment/getPickingInfoByNo", param);
}

// 导出下架单数据
function exportoffListDate(params) {
  return post(PORT1 + "/directShipment/exportPickingExcel", params, true);
}

//订单号与运单号互查
function getOrderLogistics(param) {
  return post(PORT1 + "/pickingOrder/orderIdToWaybillId", param, true);
}

//订单出货
function shipment(param) {
  return put(PORT1 + "/pickingOrder/shipment", param, true);
}

//获取下架单下载队列
function getOffDownloadQueue(param) {
  return post(PORT1 + "/directShipment/getDownloadQueue", param, true);
}

export default {
  addOrderInfo,
  getDeliveryWarehouse,
  getOffOrderList,
  batchPutDown,
  getAllPickingUser,
  exportoffListDate,
  getOffLog,
  gettakeOffList,
  getPickingInfoByNo,
  getOrderLogistics,
  shipment,
  getShipmentList,
  getfindPacker,
  getOffDownloadQueue,
}
