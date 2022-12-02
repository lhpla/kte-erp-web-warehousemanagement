import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "./request";
const PORT2 = "/kte-system";

// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)

//获取计价信息目的仓（海外仓和直发仓） 
function getDirectAndOverseasWarehouse() {
  return get(PORT2 + '/wareHouse/getDirectAndOverseasWarehouse')
}

export default {
  getDirectAndOverseasWarehouse
};
