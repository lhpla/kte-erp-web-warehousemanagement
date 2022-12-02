import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "../request";
const PORT1 = "/kte-document";


//编辑装箱清单信息
function editPackingList(param) {
  return put(PORT1 + '/doc-sea/editPackingList', param, true)
}

//编辑装箱清单商品信息
function updateDetail(query, param) {
  return put(PORT1 + '/doc-sea/updateDetail/' + query, param, true)
}


export default {
  editPackingList,
  updateDetail
}
