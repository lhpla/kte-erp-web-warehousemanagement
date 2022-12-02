import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "./request";
const PORT1 = "/kte-product";

// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)

// 供应商列表
function getSupplierListAll() {
  return get(PORT1 + "/supplier/getAllSupplier");
}

// 获取开发状态信息
function getProDevStatus() {
  return get(PORT1 + "/proManager/getProDevStatus");
}

export default {
  getSupplierListAll,
  getProDevStatus
};
