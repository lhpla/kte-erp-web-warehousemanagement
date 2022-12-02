import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "./request";
const PORT1 = "/kte-user";
const PORT2 = "/kte-system";
// ！  关于用户的操作  userOperation
// 获取采购负责人
function getHeadOfPurchasing() {
  return get(PORT1 + "/getHeadOfPurchasing");
}

// 通过岗位名称获取用户
function getUserPostName(param) {
  return get(PORT1 + "/getUserPostName", param);
}

export default {
  getHeadOfPurchasing,
  getUserPostName,
};
