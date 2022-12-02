import { reactive, toRefs, onBeforeMount, onMounted, getCurrentInstance, ref, computed } from 'vue'
import { parseTime, backTableTop } from '../utils/util'
import { ElMessage } from 'element-plus'

const tablePage = () => {
  const { ctx: vueDev, proxy: vue } = getCurrentInstance()
  const api = vue.$http
  // 表格数据
  const tableData = ref([])
  // 请求地址
  const dataApi = ref(null)
  // 微服务模块
  const dataService = ref(null)
  // 表格loading
  const loading = ref(false)
  // 搜索是否展开
  const searchShow = ref(false)
  // 查询参数
  const searchParam = ref({})
  // 是否点击了搜索，解决未点击搜索情况下输入筛选条件然后点击下一页实际筛选了
  const hasSearched = ref(false)
  // 分页数据
  const pageable = ref({
    // 当前页数
    current: 1,
    // 每页显示条数
    size: 10,
    // 总条数
    total: 0,
    // 总页数
    totalPages: 0,
    // 排序方式（以什么排序，升序还是降序）
    sort: 'id,desc',
  })
  // 总参数（查询加分页）
  const totalParam = ref({})
  // 分页查询数据
  const pageParam = computed({
    get: () => {
      return {
        current: pageable.value.current,
        size: pageable.value.size,
      }
    },
    set: (newVal) => {
      console.log(newVal)
      // pageable.value.size = newVal.size ? newVal.size : pageable.value.size;
    },
  })

  onBeforeMount(() => {})
  onMounted(() => {})
  // 表格头部样式
  const rowClass = () => {
    return 'background:#fafafa;color:#2d2f30;font-weight:bold;font-size:12px'
  }

  // 更新查询参数
  const updatedTotalParam = () => {
    totalParam.value = {}
    // 如果没有点击过搜索，就不带参数查询
    if (!hasSearched.value) {
      Object.assign(totalParam.value, pageParam.value)
      return
    }
    console.log(22)
    // 选择时间范围
    searchParam.value.createTime ? (searchParam.value.startTime = parseTime(searchParam.value.createTime[0])) : ''
    searchParam.value.createTime ? (searchParam.value.endTime = parseTime(searchParam.value.createTime[1])) : ''
    // 产品分类
    searchParam.value.productClassificationId instanceof Array
      ? (searchParam.value.productClassificationId = searchParam.value.productClassificationId.pop())
      : ''
    // 主营品类
    searchParam.value.mainType instanceof Array ? (searchParam.value.mainType = searchParam.value.mainType.pop()) : ''
    let nowSearchParam = {}
    for (let key in searchParam.value) {
      if (searchParam.value.hasOwnProperty(key) && (searchParam.value[key] || searchParam.value[key] === false)) {
        nowSearchParam[key] = searchParam.value[key]
      }
    }
    Object.assign(totalParam.value, pageParam.value, nowSearchParam)
  }

  // 获取表格数据列表
  const getTableList = (params) => {
    loading.value = true
    // 请求数据
    delete totalParam.value.createTime
    Object.assign(totalParam.value, params)
    api[dataService.value]
      [dataApi.value](totalParam.value)
      .then((res) => {
        loading.value = false
        if (res.data && res.code == 200) {
          tableData.value = res.data.records || res.data
        } else if (dataApi._value == 'getDictList') {
          // 如果是获取字典，数据格式不一样
          tableData.value = res.data[0].children
        } else {
          tableData.value = res.data
        }
        pageable.value.total = res.data.total
        pageable.value.current = res.data.current
        pageable.value.size = res.data.size
      })
      .catch((error) => {
        loading.value = false
      })
    return tableData.value
  }

  // 搜索
  const search = () => {
    pageable.value.current = 1
    hasSearched.value = true
    updatedTotalParam()
    getTableList()
  }
  // 重置查询
  const reset = () => {
    pageable.value.current = 1
    hasSearched.value = true
    updatedTotalParam()
    searchParam.value = {}
    totalParam.value = {}
    getTableList()
  }
  // 每页条数发生改变
  const handleSizeChange = (val) => {
    pageParam.value.size = val
    updatedTotalParam()
    getTableList()
  }
  // 当前页发生改变
  const handleCurrentChange = (val) => {
    pageParam.value.current = val
    updatedTotalParam()
    getTableList()
  }

  // 接收数据流生成blob，创建链接，下载模板，现在支持xls、zip,图片回头再试
  const downloadTemplate = (url, tempName, param = '', fileType = '.xlsx') => {
    // ElMessage.success('正在下载，请稍后')
    let copyParam = JSON.parse(JSON.stringify(param))
    copyParam.createTime ? (copyParam.startTime = parseTime(copyParam.createTime[0])) : ''
    copyParam.createTime ? (copyParam.endTime = parseTime(copyParam.createTime[1])) : ''
    delete copyParam.createTime
    api[dataService.value][url](copyParam).then((res) => {
      // 这个地方的type,经测试不传也没事，因为zip文件不知道type是什么
      const blob = new Blob([res], {
        type: 'application/vnd.ms-excel;charset=UTF-8',
      })
      // const blob = new Blob([res]);
      // 兼容edge不支持createObjectURL方法
      if ('msSaveOrOpenBlob' in navigator) {
        window.navigator.msSaveOrOpenBlob(blob, tempName + fileType)
        return
      }
      const blobUrl = window.URL.createObjectURL(blob)
      download(blobUrl, tempName, fileType)
    })
  }

  // 由生成的链接下载模板
  const download = (blobUrl, tempName, fileType) => {
    const a = document.createElement('a')
    a.style.display = 'none'
    a.download = `${tempName}${fileType}`
    a.href = blobUrl
    document.body.appendChild(a)
    a.click()
    // 去除下载对url的影响
    document.body.removeChild(a)
    window.URL.revokeObjectURL(blobUrl)
  }
  return {
    dataApi,
    tableData,
    loading,
    searchShow,
    pageable,
    totalParam,
    searchParam,
    rowClass,
    search,
    reset,
    handleSizeChange,
    handleCurrentChange,
    getTableList,
    updatedTotalParam,
    dataService,
    downloadTemplate,
    download,
  }
}

export default tablePage
