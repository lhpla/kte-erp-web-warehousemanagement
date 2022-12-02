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

// 仓储 warehouse 仓库管理 warehouseManagement

// 库位列表
function warehouseTemporaryLocation(param) {
  return post(PORT1 + "/warehouseTemporaryLocation/list", param, true);
}
// 查看库位详情
function getWarehouseTemporaryLocationDetail(param) {
  return get(PORT1 + "/warehouseTemporaryLocation/detail", param);
}
// 新增库位
function saveLocation(param) {
  return post(PORT1 + "/warehouseTemporaryLocation/saveLocation", param, true);
}
// 编辑库位
function updateLocation(param) {
  return post(PORT1 + "/warehouseTemporaryLocation/updateLocation", param, true);
}
// 通过仓库名称获取仓库代码
function getDetail(param) {
  return get(PORT2 + "/wareHouse/getDetail", param);
}
// 禁用或者启用库位
function disableLocation(param) {
  return post(PORT1 + "/warehouseTemporaryLocation/disableLocation", param, true);
}
// 查看仓库库位日志
function selectLocationLog(param) {
  return post(PORT1 + "/warehouseTemporaryLocation/selectLocationLog", param);
}

//查询物流商
function selectLogisticsProvider(param) {
  return get(PORT1 + '/warehouseShipping/selectLogisticsProvider', param)
}
// 查看调拨单管理日志 todo 记得导出
function allotListLog_API(param) {
  return post(PORT1 + "/warehouseTemporaryLocation/selectLocationLog", param);
}
//查询物流商（多传个状态）
function selectLogisticsProviderListInfo(param) {
  return post(PORT1 + '/warehouseShipping/selectLogisticsProviderListInfo', param, true)
}
//查询买单仓
function selectBuyPosition(param) {
  return get(PORT1 + '/cabinetAbnormal/selectBuyPosition', param)
}
export default {
  warehouseTemporaryLocation,
  getWarehouseTemporaryLocationDetail,
  updateLocation,
  saveLocation,
  getDetail,
  disableLocation,
  selectLocationLog,
  selectLogisticsProvider,
  allotListLog_API,
  selectLogisticsProviderListInfo,
  selectBuyPosition
}
