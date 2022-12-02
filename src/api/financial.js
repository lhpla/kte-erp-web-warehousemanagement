import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "./request";

const PORT1 = "/kte-purchase";

// 财务模块   financial
// 获取合同下载详情
function getContractDownDetail(param) {
  return get(PORT1 + "/orderInfo/getContractDownDetail", param);
}

// 合同下载
function downloadContract(param) {
  return downLoadFile(PORT1 + "/orderInfo/downloadContract", param);
}

//更新合同号
function modifyContract(param) {
  return get(PORT1 + '/orderInfo/modifyContract', param)
}

export default {
  getContractDownDetail,
  downloadContract,
  modifyContract,
}
