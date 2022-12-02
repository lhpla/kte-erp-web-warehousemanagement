import {
  get,
  post,
  DELETE,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "./request";
const PORT1 = "/kte-product";
const PORT2 = "/kte-user";

// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)

// 获取开发状态信息
function getProDevStatus() {
  return get(PORT1 + "/proManager/getProDevStatus");
}

//获取下载队列
function getDownloadQueue(param) {
  return get(PORT1 + "/download/getDownloadQueue", param);
}

//平台类目批量导入
function pcBatchImport(params) {
  return post(PORT1 + "/platformCategory/batchImport", params, false, true);
}

//批量更新平台类目
function pcBatchUpdate(param) {
  return post(PORT1 + "/platformCategory/batchUpdate", param, false, true);
}

//批量更新spu属性
function spuPropertyBatchUpdate(param) {
  return post(PORT1 + "/spuProperty/batchUpdate", param, false, true);
}

//批量导入spu属性
function spuPropertyBatchImport(param) {
  return post(PORT1 + "/spuProperty/batchImport", param, false, true);
}

//批量更新系统品类
function categoryBatchUpdate(param) {
  return post(PORT1 + "/category/batchUpdate", param, false, true);
}

//批量导入系统品类
function categoryBatchImport(param) {
  return post(PORT1 + "/category/batchImport", param, false, true);
}

//导入品类对照表
function importCategoryMapping(param) {
  return post(PORT1 + "/category-mapping/importCategoryMapping", param, false, true);
}

export default {
  getProDevStatus,
  getDownloadQueue,
  pcBatchImport,
  pcBatchUpdate,
  categoryBatchUpdate,
  categoryBatchImport,
  spuPropertyBatchUpdate,
  spuPropertyBatchImport,
  importCategoryMapping,
};
