import { get, post, downLoadFile, downLoadFilePost } from "../request";

const PORT = "/kte-order/pickingOrder";

// 打包贴标
function packagLabeling(params) {
  return post(PORT + "/packagLabeling", params, true);
}

// 完成配货
function completeProduct(params) {
  return post(PORT + "/product/complete", params, true);
}

// 获取拣货员
function findPacker() {
  return get(PORT + "/findUser");
}

export default {
  packagLabeling,
  completeProduct,
  findPacker
};
