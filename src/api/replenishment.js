import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "./request";

const PORT1 = "/kte-purchase";

// 补货策略  replenishment

// 导入补货策略数据 (大表)
function importReplenishmentStrategyExcel(param) {
  return post(PORT1 + "/replenishment/importReplenishmentStrategyExcel", param, false, true);
}

// 导入临时补货数据
function importTemporaryReplenishExcel(param) {
  return post(PORT1 + "/replenishment/importTemporaryReplenishExcel", param, false, true);
}

// 导入海外仓库数据 (动销)
function importOverseasWarehouseDataExcel(param) {
  return post(PORT1 + "/replenishment/importOverseasWarehouseDataExcel", param, false, true);
}

export default {
  importReplenishmentStrategyExcel,
  importTemporaryReplenishExcel,
  importOverseasWarehouseDataExcel,
};
