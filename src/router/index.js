import {
  createRouter,
  createWebHistory
} from 'vue-router'
import SignFor from '../views/signFor/SignFor.vue'
import SignForList from '../views/signForList/SignForList.vue'
import QualityInspection from '../views/qualityInspection/QualityInspection.vue'
import StraightHairQuality from '../views/straightHairQuality/StraightHairQuality.vue'
import QualityInspectionList from '../views/qualityInspectionList/QualityInspectionList.vue'
import SealingList from '../views/sealingList/SealingList.vue'
import AbnormalWarehousing from '../views/abnormalWarehousing/AbnormalWarehousing.vue'
import WarehouseAreaManagement from '../views/warehouseAreaManagement/WarehouseAreaManagement.vue'
import LocationManagement from '../views/locationManagement/LocationManagement.vue'
import TransfersList from '../views/transfersList/TransfersList.vue'
import InventoryList from '../views/inventoryList/InventoryList.vue'
import DeliveryPlan from '../views/deliveryPlan/DeliveryPlan.vue'
import ReviewDeliveryPlan from '../views/reviewDeliveryPlan/ReviewDeliveryPlan.vue'
import OutArkAbnormal from '../views/outArkAbnormal/OutArkAbnormal.vue'
import OffOrder from '../views/offOrder/OffOrder.vue'
import DistributionOrder from '../views/distributionOrder/DistributionOrder.vue'
import OffList from '../views/offList/OffList.vue'
import PackagingLabeling from '../views/packagingLabeling/PackagingLabeling.vue'
import OrderShipment from '../views/orderShipment/OrderShipment.vue'
import ShipmentList from '../views/shipmentList/ShipmentList.vue'
import DocumentList from '../views/documentList/DocumentList.vue'
import DocumentBillList from '../views/documentBillList/DocumentBillList.vue'
import DocumentPaymentPlan from '../views/documentPaymentPlan/DocumentPaymentPlan.vue'
import BillUploadList from '../views/billUploadList/BillUploadList.vue'
import InventoryFlowList from '../views/inventoryFlowList/inventoryFlowList.vue'
import WarehouseConfiguration from '../views/warehouseConfiguration/WarehouseConfiguration.vue'
import TransferDocManagement from '../views/transferDocManagement/TransferDocManagement.vue'
import AllocatingAbnormal from "../views/allocatingAbnormal/AllocatingAbnormal.vue";
import InventoryManagement from '../views/inventory/InventoryManagement.vue'
import FbaDeliveryPlan from '../views/fbaDeliveryPlan/FbaDeliveryPlan.vue'

const routes = [{
  path: '/',
  redirect: '/warehouseManagement/warehouseManagement/signFor/list',
},
{
  path: '/login',
  name: 'login',
  component: () => import('../views/login/Login.vue'),
},
{
  path: '/warehouseManagement/warehouseManagement/signFor/list',
  name: 'signFor',
  component: SignFor,
  meta: {
    requiresAuth: true,
    parentTit: '仓库管理',
    title: '签收',
    key: 'signFor',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/signForList/list',
  name: 'signForList',
  component: SignForList,
  meta: {
    requiresAuth: true,
    parentTit: '仓库管理',
    title: '签收列表',
    key: 'signForList',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/qualityInspection/list',
  name: 'qualityInspection',
  component: QualityInspection,
  meta: {
    requiresAuth: true,
    parentTit: '仓库管理',
    title: '质检',
    key: 'qualityInspection',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/straightHairQuality/list',
  name: 'straightHairQuality',
  component: StraightHairQuality,
  meta: {
    requiresAuth: true,
    parentTit: '仓库管理',
    title: '直发质检',
    key: 'straightHairQuality',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/qualityInspectionList/list',
  name: 'qualityInspectionList',
  component: QualityInspectionList,
  meta: {
    requiresAuth: true,
    parentTit: '仓库管理',
    title: '质检列表',
    key: 'qualityInspectionList',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/sealingList/list',
  name: 'sealingList',
  component: SealingList,
  meta: {
    requiresAuth: true,
    parentTit: '仓库管理',
    title: '封箱列表',
    key: 'sealingList',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/abnormalWarehousing/list',
  name: 'abnormalWarehousing',
  component: AbnormalWarehousing,
  meta: {
    requiresAuth: true,
    parentTit: '仓储',
    title: '仓储异常',
    key: 'abnormalWarehousing',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/warehouseAreaManagement/list',
  name: 'warehouseAreaManagement',
  component: WarehouseAreaManagement,
  meta: {
    requiresAuth: true,
    parentTit: '仓库管理',
    title: '仓区管理',
    key: 'warehouseAreaManagement',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/locationManagement/list',
  name: 'locationManagement',
  component: LocationManagement,
  meta: {
    requiresAuth: true,
    parentTit: '仓库管理',
    title: '库位管理',
    key: 'locationManagement',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/transfersList/list',
  name: 'transfersList',
  component: TransfersList,
  meta: {
    requiresAuth: true,
    parentTit: '仓库管理',
    title: '调拨',
    key: 'transfersList',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/inventoryList/list',
  name: 'inventoryList',
  component: InventoryList,
  meta: {
    requiresAuth: true,
    parentTit: '仓库管理',
    title: '库存',
    key: 'inventoryList',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/inventoryFlowList/list',
  name: 'inventoryFlowList',
  component: InventoryFlowList,
  meta: {
    requiresAuth: true,
    parentTit: "仓库管理",
    title: "库存流水",
    key: "inventoryFlowList"
  },
},
{
  path: '/warehouseManagement/order/deliveryPlan/list',
  name: 'deliveryPlan',
  component: DeliveryPlan,
  meta: {
    requiresAuth: true,
    parentTit: '物流管理',
    title: '发货计划',
    key: 'deliveryPlan',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/reviewDeliveryPlan/list',
  name: 'reviewDeliveryPlan',
  component: ReviewDeliveryPlan,
  meta: {
    requiresAuth: true,
    parentTit: '仓库管理',
    title: '柜号列表',
    key: 'reviewDeliveryPlan',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/outArkAbnormal/list',
  name: 'outArkAbnormal',
  component: OutArkAbnormal,
  meta: {
    requiresAuth: true,
    parentTit: '仓库管理',
    title: '出柜异常列表',
    key: 'outArkAbnormal',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/straightOutbound/offOrder',
  name: 'offOrder',
  component: OffOrder,
  meta: {
    requiresAuth: true,
    parentTit: '直发出库',
    title: '订单下架',
    key: 'offOrder',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/straightOutbound/distributionOrder',
  name: 'distributionOrder',
  component: DistributionOrder,
  meta: {
    requiresAuth: true,
    parentTit: '直发出库',
    title: '配单',
    key: 'distributionOrder',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/straightOutbound/offList',
  name: 'offList',
  component: OffList,
  meta: {
    requiresAuth: true,
    parentTit: '直发出库',
    title: '下架单',
    key: 'offList',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/straightOutbound/packagingLabeling',
  name: 'packagingLabeling',
  component: PackagingLabeling,
  meta: {
    requiresAuth: true,
    parentTit: '直发出库',
    title: '打包贴标',
    key: 'packagingLabeling',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/straightOutbound/orderShipment',
  name: 'orderShipment',
  component: OrderShipment,
  meta: {
    requiresAuth: true,
    parentTit: '直发出库',
    title: '订单出货',
    key: 'orderShipment',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/straightOutbound/shipmentList',
  name: 'shipmentList',
  component: ShipmentList,
  meta: {
    requiresAuth: true,
    parentTit: '直发出库',
    title: '出货列表',
    key: 'shipmentList',
  },
},
{
  path: '/warehouseManagement/document/documentList/list',
  name: 'documentList',
  component: DocumentList,
  meta: {
    requiresAuth: true,
    parentTit: '单证管理',
    title: '单证列表',
    key: 'documentList',
  },
},
{
  path: '/warehouseManagement/document/documentBillList/list',
  name: 'documentBillList',
  component: DocumentBillList,
  meta: {
    requiresAuth: true,
    parentTit: '单证管理',
    title: '单证账单列表',
    key: 'documentBillList',
  },
},
{
  path: '/warehouseManagement/document/documentPaymentPlan/list',
  name: 'documentPaymentPlan',
  component: DocumentPaymentPlan,
  meta: {
    requiresAuth: true,
    parentTit: '单证管理',
    title: '付款计划列表',
    key: 'documentPaymentPlan',
  },
},
{
  path: '/warehouseManagement/document/billUploadList/list',
  name: 'billUploadList',
  component: BillUploadList,
  meta: {
    requiresAuth: true,
    parentTit: '单证管理',
    title: '账单上传',
    key: 'billUploadList',
  },
},
{
  path: '/warehouseManagement/transferDocManagement/list',
  name: 'transferDocManagement',
  component: TransferDocManagement,
  meta: {
    requiresAuth: true,
    parentTit: "仓库管理",
    title: "调拨单管理",
    key: "transferDocManagement"
  },
},
{
  path: '/warehouseManagement/warehouseManagement/allocatingAbnormal/list',
  name: 'allocatingAbnormal',
  component: AllocatingAbnormal,
  meta: {
    requiresAuth: true,
    parentTit: '仓库管理',
    title: '调拨异常',
    key: 'allocatingAbnormal',
  },
},
{
  path: "/warehouseManagement/warehouseManagement/warehouseConfiguration/list",
  name: "warehouseConfiguration",
  component: WarehouseConfiguration,
  meta: {
    requiresAuth: true,
    parentTit: "仓库管理",
    title: "国内仓配置",
    key: "warehouseConfiguration"
  }
},
{
  path: "/warehouseManagement/warehouseManagement/inventoryManagement/list",
  name: "inventoryManagement",
  component: InventoryManagement,
  meta: {
    requiresAuth: true,
    parentTit: "仓库管理",
    title: "盘点管理",
    key: "inventoryManagement"
  }
},
{
  path: '/warehouseManagement/firstLegManagement/fbaDeliveryPlan/list',
  name: 'fbaDeliveryPlan',
  component: FbaDeliveryPlan,
  meta: {
    requiresAuth: true,
    parentTit: '头程管理',
    title: 'FBA仓储发货',
    key: 'fbaDeliveryPlan',
  },
},
  // {
  //   path: "/warehouseManagement/inventoryFlowList/list",
  //   name: "inventoryFlowList",
  //   component: () => import( /* webpackChunkName: "inventoryFlowList" */ "@/views/inventoryFlowList/"),
  //   meta: {
  //     requiresAuth: true,
  //     parentTit: "仓库管理",
  //     title: "库存流水",
  //     key: "inventoryFlowList"
  //   }
  // },
]

const router = createRouter({
  history: createWebHistory(
    window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL
  ),
  routes,
})

export default router