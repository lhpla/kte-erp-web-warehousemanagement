import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "../request";
const PORT1 = "/kte-document";

//自贸通信息
function getFreeTradeInfo(param) {
  return get(PORT1 + '/free-trade/info', param)
}

//自贸通下载
function getFreeTradeSource(param) {
  return get(PORT1 + '/free-trade/source', param)
}

//自贸通编辑
function updataFreeTradeInfo(param) {
  return put(PORT1 + '/free-trade', param, true)
}

//自贸通保存
function saveFreeTrade(param) {
  return post(PORT1 + '/free-trade/save', param, true)
}

//自贸通审批
function approveFreeTrade(param) {
  return put(PORT1 + '/free-trade/approve', param)
}


export default {
  getFreeTradeInfo,
  getFreeTradeSource,
  updataFreeTradeInfo,
  saveFreeTrade,
  approveFreeTrade
}
