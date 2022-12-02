/*
    数据请求入口
*/
import login from "./login";
import system from "./system";
import develop from "./develop";
import provider from "./provider";
import product from "./product";
import uploadImg from "./uploadImg";
import userOperation from "./userOperation";
import purchaseOder from "./purchaseOder";
import financial from "./financial";
import resources from "./resources";
import replenishment from "./replenishment";
import warehouse from "./warehouse";
import systemNew from "./systemNew";
import assest from "./order/assest";
import logistics from "./order/logistics";
import orderList from "./order/orderList";
import serviceProvider from "./order/serviceProvider";
import buyersBlacklist from "./order/buyersBlacklist";
import freeTrade from "./document/freeTrade";
import seaTransportation from "./document/seaTransportation";
import railTransport from "./document/railTransport";
import straightOutbound from "./order/straightOutbound";
import documentList from "./document/documentList"
import abnormal from "./abnormal"
import warehouseManagement from "./warehouseManagement"
import requisitionManagement from "./transfers/requisitionManagement"
import inventory from "./inventory/inventory"
import fba from "./fba"

export default {
  login,
  system,
  develop,
  provider,
  product,
  uploadImg,
  userOperation,
  purchaseOder,
  resources,
  financial,
  replenishment,
  warehouse,
  systemNew,
  assest,
  logistics,
  orderList,
  serviceProvider,
  buyersBlacklist,
  documentList,
  freeTrade,
  seaTransportation,
  railTransport,
  straightOutbound,
  abnormal,
  warehouseManagement,
  requisitionManagement,
  inventory,
  fba
};
