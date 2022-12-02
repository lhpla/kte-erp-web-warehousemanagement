import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "../request";
const PORT1 = "/kte-document";
const PORT2 = "/kte-warehouse";
const PORT3 = "/kte-user";

// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)


//获取单证列表
function getSelectList(param) {
  return post(PORT1 + '/document/selectList', param, true);
}

//获取分配单证人员
function getUserPostName() {
  return get(PORT3 + '/getDocUser')
}

//分配单证人员
function distribute(param) {
  return post(PORT1 + '/document/distribute', param, true)
}

//单证确认发送
function confirmSendDoc(param) {
  return get(PORT2 + '/cabinet/confirmSendDoc', param)
}

//单证列表发送
function confirmSendDocNew(param) {
  return get(PORT1 + '/document/confirmSendDoc', param)
}

//单证日志
function selectDocLog(param) {
  return post(PORT1 + '/document/getLogList', param, true)
}

//单证限价审核
function docPriceAudit(param) {
  return get(PORT1 + '/document/docPriceAudit', param)
}

//获取单证限价金额
function getDocPrice(param) {
  return get(PORT1 + '/document/getDocPrice', param)
}


//单证资料-报关
function getApplydetail(param) {
  return get(PORT1 + '/document/apply-detail', param)
}

//轻工-天纺-环贸通达信息 /kte-document/document/info
function documentInfo(params) {
  return get(PORT1 + '/document/info', params)
}

//单证资料-报关资料-更新
function updateDeclareMaterial(param) {
  return get(PORT1 + '/document/updateDeclareMaterial', param)
}

//单证-报关资料下载
function downloadDeclareMaterial(param) {
  return downLoadFilePost(PORT1 + '/document/downloadDeclareMaterial', param)
}

//单证资料-报关资料-获取更新转态
function getUpdateStatus(param) {
  return get(PORT1 + '/document/getUpdateStatus', param)
}

//单证资料-清关资料
function detail(param) {
  return get(PORT1 + '/document/clear-detail', param)
}

//单证资料-清关资料-获取清关资料详情数据
function getClearanceInfo(param) {
  return get(PORT1 + '/clearance/getClearanceInfo', param)
}

//单证资料-清关资料-清关合并
function mergeDetail(param) {
  return post(PORT1 + '/clearance/mergeDetail', param, true);
}

//单证资料-清关资料-发起审批
function approve(param) {
  return put(PORT1 + '/clearance/approve', param);
}

//单证资料-清关资料-编辑进港数量信息
function editInPortNum(param) {
  return put(PORT1 + '/clearance/editInPortNum', param, true);
}
//单证资料-清关资料-编辑空运快递信息
function editAirInfo(param) {
  return post(PORT1 + '/docAir/saveAirInfo', param, true);
}
//单证资料-清关资料-编辑空运快递产品信息
function updateAirDetail(param, id) {
  return put(PORT1 + `/docAir/updateDetail/${id}`, param, true);
}

//获取资料信息
function getFile(param) {
  return get(PORT1 + '/file-maintain/getFile', param)
}

//保存资料信息
function saveFile(param) {
  return post(PORT1 + '/file-maintain/saveDeclareFile', param, true)
}

//保存清关资料信息
function saveClearanceFile(param) {
  return post(PORT1 + '/file-maintain/saveClearanceFile', param, true)
}

//提交财务审核
function submitAudit(param) {
  return get(PORT1 + '/file-maintain/submitAudit', param)
}

//单证-获取存单资料
function getDocumentPath(param) {
  return get(PORT1 + '/document/getDocumentPath', param)
}

//单证-存单资料保存
function saveDocumentPath(param) {
  return get(PORT1 + '/document/saveDocumentPath', param)
}

//单证-下载存单资料
function downloadDocumentPath(param) {
  return get(PORT1 + '/document/downloadDocumentPath', param)
}

export default {
  getSelectList,
  getUserPostName,
  distribute,
  confirmSendDoc,
  selectDocLog,
  docPriceAudit,
  getDocPrice,
  getApplydetail,
  documentInfo,
  updateDeclareMaterial,
  downloadDeclareMaterial,
  getUpdateStatus,
  detail,
  getClearanceInfo,
  mergeDetail,
  approve,
  editInPortNum,
  editAirInfo,
  updateAirDetail,
  getFile,
  saveFile,
  submitAudit,
  getDocumentPath,
  saveDocumentPath,
  downloadDocumentPath,
  saveClearanceFile,
  confirmSendDocNew
}
