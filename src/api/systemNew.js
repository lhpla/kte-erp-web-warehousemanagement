import { get, post, remove, put, downLoadFile, downLoadFilePost } from "./request";

const PORT1 = "/kte-system";
//systemNew
//根据平台获取店铺信息
function getShopList(param) {
  return get(PORT1 + "/sysshop/getShopList", param);
}

// 导入店铺注册公司
function importExcelCompany(param) {
  return post(PORT1 + "/registerCompany/importExcelCompany", param, false, true);
}

// 导入公司列表
function importExcelCompanyList(param) {
  return post(PORT1 + "/company-management/importCompanyManagement", param, false, true);
}

//导入财务数据信息
function importFinancialData(param) {
  return post(PORT1 + "/registerCompany/importFinancialData", param, false, true);
}

//获取国家数列表
function getCountryList() {
  return get(PORT1 + "/country/list");
}

//导入信用卡数据
function importCdcard(params) {
  return post(PORT1 + "/syscdcard/importCdcard", params, false, true);
}

//导入收款账号信息
function importPro(params) {
  return post(PORT1 + "/sysreceiveaccount/importPro", params, false, true);
}

//导入店铺信息
function importShopInfo(params) {
  return post(PORT1 + "/sysshop/importShopInfo", params, false, true);
}

export default {
  getCountryList,
  importCdcard,
  importExcelCompany,
  importPro,
  importShopInfo,
  getShopList,
  importFinancialData,
  importExcelCompanyList,
};
