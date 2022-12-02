import {
  get,
  post,
  remove,
  put,
  downLoadFileZip
} from "./request";
const PORT1 = "/kte-resource";

// 上传文件（视频/图片/音频等）
function uploadImgAllFun(param, onProgress) {
  return post(PORT1 + "/oss/endpoint/put-file", param, false, true, onProgress);
}

export default {
  uploadImgAllFun,
};
