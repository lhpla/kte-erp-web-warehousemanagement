import {
  get,
  post,
  remove,
  put
} from "./request";
const PORT1 = "/kte-auth";

// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)

// 用户登录接口
function userLogin(params) {
  return post(PORT1 + "/oauth/token", params, false);
}

export default {
  userLogin,
};
