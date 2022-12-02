import {
  get,
  post,
  remove,
  put
} from "./request";
const PORT1 = "/kte-warehouse";
const PORT2 = "/kte-purchase";


// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)

//获取仓库异常列表（新）
function newWarehouseAbnormalList(params) {
  return post(PORT1 + '/warehouseAbnormal/warehouseAbnormalList', params, true)
}

//获取异常详情（新）
function getNewAbnormalDetail(param) {
  return post(PORT1 + '/warehouseAbnormal/abnormalDetail', param, true)
}

//根据采购单号获取异常数据 
function abnormalByPurchaseOrderCode(param) {
  return post(PORT1 + '/warehouseAbnormal/abnormalByPurchaseOrderCode', param, true)
}

//根据处理方式获取异常详情
function getAbnormalDetailOfProcessType(param) {
  return post(PORT1 + '/warehouseAbnormal/getAbnormalDetailOfProcessType', param, true)
}

//异常处理
function abnormalDispose(param) {
  return post(PORT1 + '/warehouseAbnormal/abnormalDispose', param, true)
}

//异常日志
function warehouseAbnormalLog(param) {
  return post(PORT1 + '/warehouseAbnormalLog/selectList', param, true)
}

//获取异常流程状态 
function getAbnormalStatus(param) {
  return get(PORT1 + '/warehouseAbnormal/getAbnormalStatus', param)
}

export default {
  newWarehouseAbnormalList,
  getNewAbnormalDetail,
  abnormalByPurchaseOrderCode,
  getAbnormalDetailOfProcessType,
  abnormalDispose,
  warehouseAbnormalLog,
  getAbnormalStatus
};