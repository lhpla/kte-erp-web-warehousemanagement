import {
  get,
  post,
  remove,
  put,
  downLoadFile
} from "../request";

const PORT1 = "/kte-order/buyerBlackList";

//逻辑删除黑名单
function removeBlackList(param) {
  return post(PORT1 + "/removeBlackList", param)
}

export default {
  removeBlackList,
}

