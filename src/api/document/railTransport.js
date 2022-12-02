import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "../request";
const PORT1 = "/kte-document";
/**
 * 单证铁运接口
 */

//铁运编辑随车资料
function railEditFollowCar(param) {
  return post(PORT1 + '/kte-document/doc-rail/editFollowCar', param, true)
}

//铁运编辑随车资料商品信息
function railEditFollowCarDetail(param) {
  return post(PORT1 + '/kte-document/doc-rail/editFollowCarDetail', param, true)
}

//铁运编辑整柜申报要素
function railEditCabinetDeclareEssential(param) {
  return post(PORT1 + '/kte-document/doc-rail/editCabinetDeclareEssential', param, true)
}

//铁运编辑整柜申报要素商品信息
function railEditCabinetDeclareEssentialDetail(param) {
  return post(PORT1 + '/kte-document/doc-rail/editCabinetDeclareEssentialDetail', param, true)
}

export default {
  railEditFollowCar,
  railEditFollowCarDetail,
  railEditCabinetDeclareEssential,
  railEditCabinetDeclareEssentialDetail,


}
