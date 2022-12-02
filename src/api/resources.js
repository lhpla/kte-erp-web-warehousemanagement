import {
  get,
  post,
  remove,
  put
} from "./request";
const PORT1 = "/kte-publish";

// 刊登模块->接口

// 原片列表/分页/搜索
function pagePublishList(data) {
  return get(PORT1 + "/publishDocument/pagePublishPrimaryList", data);
}

export default {
  pagePublishList,
};
