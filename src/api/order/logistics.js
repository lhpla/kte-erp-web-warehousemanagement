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
//物流管理接口定义

//获取所有运输方式 （带渠道和渠道id） /kte-order
function getAllLogisticsManageAndId(params) {
  return get(PORT1 + '/logisticsManage/getAllLogisticsManage', params)
}

//获取所有海外服务商 /kte-order
function getAllOverseasProvdier(params) {
  return get(PORT1 + '/provider/getAllOverseasProvdier', params)
}

//获取直发仓库下运输方式及数据 /kte-order
function shippingMethods(params) {
  return get(PORT1 + '/pickingOrder/warehouse', params)
}

//获取通过服务商获取运输方式
function getAllByProvider(params) {
  return get(PORT1 + '/logisticsManage/getAllByProvider', params)
}


export default {
  getAllLogisticsManageAndId,
  getAllOverseasProvdier,
  shippingMethods,
  getAllByProvider
}
