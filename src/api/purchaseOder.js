import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "./request";
const PORT1 = "/kte-purchase";

// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)

// 采购单模块   ·

// 获取付款明细
function getSelectPaymentDetail(param) {
  return get(PORT1 + "/audit/selectPaymentDetail", param);
}

//导入修改采购单产品信息
function importUpdateOrderProduct(params) {
  return post(PORT1 + "/purchase/importUpdateOrderProduct", params, false, true);
}

//获取采购模块下载队列数据
function getDownloadQueue(params) {
  return post(PORT1 + '/purchaseOm/getDownloadQueue', params, true)
}


export default {
  getSelectPaymentDetail,
  importUpdateOrderProduct,
  getDownloadQueue,
};
