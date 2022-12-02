import './public-path'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from '@/api/index.js'
// 导入重置样式表
import '@/assets/css/reset.css'
// 导入font-awesome图标
import 'font-awesome/css/font-awesome.css'
import ElementPlus from 'element-plus'
// 导入element样式
import 'element-plus/dist/index.css'
// 导入element自定义样式
import '@/assets/css/element.css'
// 导入公用css样式表
import '@/assets/css/common.css'

// element中文版
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import Pagination from './components/pagination/Pagination.vue'
import AllDownDialog from './components/allDownDialog/AllDownDialog.vue'
import UploadImage from './components/uploadFile/UploadImage.vue'
import UploadFile from './components/uploadFile/UploadFile.vue'
import LogDialog from './components/logDialog/LogDialog.vue'
import PublishLogDialog from './components/logDialog/publishLogDialog.vue'
import PurchaseLogDialog from './components/logDialog/PurchaseLogDialog.vue'
import ContractDownload from './components/contract/ContractDownload.vue'
import SupplierPublic from './components/supplier/SupplierPublic.vue'
import DownloadListTable from './components/download/DownloadListTable.vue'
import dialogDrag from '@/utils/drag.js'
if (process.env.NODE_ENV === 'local' && process.env.VUE_APP_MOCK === 'true') {
  require('./mock')
}

//表格插件
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import printFn from './views/printCode/printLableFn.js'

const app = createApp(App)
app.config.globalProperties.$printFn = printFn
app.config.globalProperties.$http = api

if (window.__MICRO_APP_ENVIRONMENT__) {
  router.push(window.rawWindow.location.pathname)
}

// 分页组件
app.component('Pagination', Pagination)
// 批量添加
app.component('AllDownDialog', AllDownDialog)
// 日志
app.component('LogDialog', LogDialog)
// 刊登日志
app.component('PublishLogDialog', PublishLogDialog)
// 图片上传
app.component('UploadImage', UploadImage)
// 采购合同下载
app.component('ContractDownload', ContractDownload)
// 文件上传
app.component('UploadFile', UploadFile)
// 采购日志
app.component('PurchaseLogDialog', PurchaseLogDialog)
// 供应商
app.component('SupplierPublic', SupplierPublic)
//下载队列
app.component('DownloadListTable', DownloadListTable)

import {
  Search,
  View,
  Pointer,
  CircleCheck,
  Printer,
  Remove,
  CirclePlus,
  UploadFilled,
  Delete,
  ArrowDown,
} from '@element-plus/icons-vue'

const iconList = [Search, View, Pointer, CircleCheck, Printer, Remove, CirclePlus, UploadFilled, Delete, ArrowDown]
iconList.map((item) => {
  app.component(`El${item.name}`, item)
})

app
  .use(ElementPlus, {
    locale: zhCn,
  })
  .use(store)
  .use(VXETable)
  .use(dialogDrag)
  .use(router)
  .mount('#app')
