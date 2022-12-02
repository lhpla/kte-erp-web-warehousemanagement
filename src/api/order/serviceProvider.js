import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost,
} from "../request";
const PORT1 = "/kte-order";

// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
//服务商管理接口定义

//获取通过服务商获取运输方式
function getAllByProvider(params) {
  return get(PORT1 + '/logisticsManage/getAllByProvider', params)
}

export default {
  getAllByProvider,
}
