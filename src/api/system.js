import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "./request";
const PORT2 = "/kte-system";
const PORT3 = "/kte-product";
const PORT4 = "/kte-user";

// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)

// 国家数据
function getCountriesList() {
  return get(PORT2 + "/country/list");
}

// 获取展示按钮数据
function getBtnFromMenu() {
  return get(PORT2 + "/menu/web-buttons");
}

// 获取所有字典
function getDictList(params) {
  return get(PORT2 + "/dict/list", params);
}

// 获取汇率列表
function getExchangeList() {
  return get(PORT2 + "/rate/selectAll");
}

// 仓库列表
function getWareHouseList(param) {
  return get(PORT2 + "/wareHouse/list", param);
}

// 直发仓库列表
function getDirectWarehouse(param) {
  return get(PORT2 + "/wareHouse/getDirectWarehouse", param);
}

//获取所有品类
function getAllCategoryList(param) {
  return get(PORT3 + "/category/getAllCategoryList", param);
}

//获取所有国内仓列表
function selectTranWarehouse(param) {
  return get(PORT2 + '/userRepository/selectTranWarehouse', param)
}

//中转仓id获取已绑定国内仓的用户信息
function getUserRepository(param) {
  return post(PORT2 + '/userRepository/getUserRepository', param, true)
}

// 用户角色权限列表
function getUserRoles(params) {
  return get(PORT2 + "/role/list", params);
}

//获取所有小组
function getAllTeams(param) {
  return get(PORT4 + '/kteTeamController/getAllTeamList', param)
}

//获取对应国内仓库下的用户列表
function selectUserByQuery(param) {
  return post(PORT2 + '/userRepository/selectUserByQuery', param, true)
}

// 获取国内仓配置列表 绑定日志
function userRepositoryLogSelectAllLog(param) {
  return post(PORT2 + '/userRepositoryLog/selectAllLog', param, true)
}

//国内仓配置列表 绑定仓库
function saveReceivingUser(param) {
  return post(PORT2 + '/userRepository/saveReceivingUser', param, true)
}

//国内仓配置列表 移除仓库绑定用户
function deleteReceivingUser(param) {
  return post(PORT2 + '/userRepository/deleteReceivingUser', param, true)
}

// 根据path获取顶级菜单ID  /kte-system
function getMenuByPath(param) {
  return get(PORT2 + '/menu/getMenu-byPath', param)
}


export default {
  getDictList,
  getExchangeList,
  getWareHouseList,
  getBtnFromMenu,
  getCountriesList,
  getAllCategoryList,
  getDirectWarehouse,
  selectTranWarehouse,
  getUserRepository,
  getUserRoles,
  getAllTeams,
  selectUserByQuery,
  userRepositoryLogSelectAllLog,
  saveReceivingUser,
  deleteReceivingUser,
  getMenuByPath

};