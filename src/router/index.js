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
    parentTit: '????????????',
    title: '??????',
    key: 'signFor',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/signForList/list',
  name: 'signForList',
  component: SignForList,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '????????????',
    key: 'signForList',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/qualityInspection/list',
  name: 'qualityInspection',
  component: QualityInspection,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '??????',
    key: 'qualityInspection',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/straightHairQuality/list',
  name: 'straightHairQuality',
  component: StraightHairQuality,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '????????????',
    key: 'straightHairQuality',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/qualityInspectionList/list',
  name: 'qualityInspectionList',
  component: QualityInspectionList,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '????????????',
    key: 'qualityInspectionList',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/sealingList/list',
  name: 'sealingList',
  component: SealingList,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '????????????',
    key: 'sealingList',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/abnormalWarehousing/list',
  name: 'abnormalWarehousing',
  component: AbnormalWarehousing,
  meta: {
    requiresAuth: true,
    parentTit: '??????',
    title: '????????????',
    key: 'abnormalWarehousing',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/warehouseAreaManagement/list',
  name: 'warehouseAreaManagement',
  component: WarehouseAreaManagement,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '????????????',
    key: 'warehouseAreaManagement',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/locationManagement/list',
  name: 'locationManagement',
  component: LocationManagement,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '????????????',
    key: 'locationManagement',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/transfersList/list',
  name: 'transfersList',
  component: TransfersList,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '??????',
    key: 'transfersList',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/inventoryList/list',
  name: 'inventoryList',
  component: InventoryList,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '??????',
    key: 'inventoryList',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/inventoryFlowList/list',
  name: 'inventoryFlowList',
  component: InventoryFlowList,
  meta: {
    requiresAuth: true,
    parentTit: "????????????",
    title: "????????????",
    key: "inventoryFlowList"
  },
},
{
  path: '/warehouseManagement/order/deliveryPlan/list',
  name: 'deliveryPlan',
  component: DeliveryPlan,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '????????????',
    key: 'deliveryPlan',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/reviewDeliveryPlan/list',
  name: 'reviewDeliveryPlan',
  component: ReviewDeliveryPlan,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '????????????',
    key: 'reviewDeliveryPlan',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/outArkAbnormal/list',
  name: 'outArkAbnormal',
  component: OutArkAbnormal,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '??????????????????',
    key: 'outArkAbnormal',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/straightOutbound/offOrder',
  name: 'offOrder',
  component: OffOrder,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '????????????',
    key: 'offOrder',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/straightOutbound/distributionOrder',
  name: 'distributionOrder',
  component: DistributionOrder,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '??????',
    key: 'distributionOrder',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/straightOutbound/offList',
  name: 'offList',
  component: OffList,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '?????????',
    key: 'offList',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/straightOutbound/packagingLabeling',
  name: 'packagingLabeling',
  component: PackagingLabeling,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '????????????',
    key: 'packagingLabeling',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/straightOutbound/orderShipment',
  name: 'orderShipment',
  component: OrderShipment,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '????????????',
    key: 'orderShipment',
  },
},
{
  path: '/warehouseManagement/warehouseManagement/straightOutbound/shipmentList',
  name: 'shipmentList',
  component: ShipmentList,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '????????????',
    key: 'shipmentList',
  },
},
{
  path: '/warehouseManagement/document/documentList/list',
  name: 'documentList',
  component: DocumentList,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '????????????',
    key: 'documentList',
  },
},
{
  path: '/warehouseManagement/document/documentBillList/list',
  name: 'documentBillList',
  component: DocumentBillList,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '??????????????????',
    key: 'documentBillList',
  },
},
{
  path: '/warehouseManagement/document/documentPaymentPlan/list',
  name: 'documentPaymentPlan',
  component: DocumentPaymentPlan,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '??????????????????',
    key: 'documentPaymentPlan',
  },
},
{
  path: '/warehouseManagement/document/billUploadList/list',
  name: 'billUploadList',
  component: BillUploadList,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '????????????',
    key: 'billUploadList',
  },
},
{
  path: '/warehouseManagement/transferDocManagement/list',
  name: 'transferDocManagement',
  component: TransferDocManagement,
  meta: {
    requiresAuth: true,
    parentTit: "????????????",
    title: "???????????????",
    key: "transferDocManagement"
  },
},
{
  path: '/warehouseManagement/warehouseManagement/allocatingAbnormal/list',
  name: 'allocatingAbnormal',
  component: AllocatingAbnormal,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: '????????????',
    key: 'allocatingAbnormal',
  },
},
{
  path: "/warehouseManagement/warehouseManagement/warehouseConfiguration/list",
  name: "warehouseConfiguration",
  component: WarehouseConfiguration,
  meta: {
    requiresAuth: true,
    parentTit: "????????????",
    title: "???????????????",
    key: "warehouseConfiguration"
  }
},
{
  path: "/warehouseManagement/warehouseManagement/inventoryManagement/list",
  name: "inventoryManagement",
  component: InventoryManagement,
  meta: {
    requiresAuth: true,
    parentTit: "????????????",
    title: "????????????",
    key: "inventoryManagement"
  }
},
{
  path: '/warehouseManagement/firstLegManagement/fbaDeliveryPlan/list',
  name: 'fbaDeliveryPlan',
  component: FbaDeliveryPlan,
  meta: {
    requiresAuth: true,
    parentTit: '????????????',
    title: 'FBA????????????',
    key: 'fbaDeliveryPlan',
  },
},
  // {
  //   path: "/warehouseManagement/inventoryFlowList/list",
  //   name: "inventoryFlowList",
  //   component: () => import( /* webpackChunkName: "inventoryFlowList" */ "@/views/inventoryFlowList/"),
  //   meta: {
  //     requiresAuth: true,
  //     parentTit: "????????????",
  //     title: "????????????",
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