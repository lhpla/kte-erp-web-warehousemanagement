import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "../request";
const PORT1 = "/kte-order";

// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)

//订单公共部分请求

//获取所有服务商
function getAllProvdier() {
  return get(PORT1 + '/provider/getAllProvdier')
}
//获取所有直发服务商
function getServiceProvider() {
  return get(PORT1 + '/pickingOrder/getServiceProvider')
}

//获取所有直发运输方式
function getLogisticsName() {
  return get(PORT1 + '/pickingOrder/getLogisticsName')
}


export default {
  getAllProvdier,
  getServiceProvider,
  getLogisticsName
}
