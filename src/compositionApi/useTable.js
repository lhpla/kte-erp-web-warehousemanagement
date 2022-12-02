import { ref, watch } from 'vue'

export const useTable = (service, params = {}, pagination = {}, immediate = true) => {
  const current = ref(pagination.current || 1)
  const size = ref(pagination.size || 10)
  const total = ref(0)
  const list = ref([])
  const err = ref()
  const tableProps = ref({
    pagination: {
      total: 0,
      hidden: false,
      limit: size.value,
      page: current.value,
    },
    tableData: [],
    loading: true,
  })

  const refresh = (search = {}) => {
    service({
      current: current.value,
      size: size.value,
      ...search,
      ...params,
    })
      .then((res) => {
        list.value = res.data.records
        total.value = res.data.total
      })
      .catch((e) => {
        err.value = e
      })
  }
  if (immediate) {
    refresh()
  } else {
    tableProps.value.loading = false
  }

  watch(
    () => [total.value, list.value],
    (val) => {
      if (val[0] <= 0) {
        tableProps.value.pagination.hidden = true
      }
      tableProps.value.pagination.total = val[0]
      tableProps.value.tableData = val[1]
      tableProps.value.loading = false
    }
  )

  const sizeChange = (val) => {
    size.value = val
    tableProps.value.pagination.limit = val
    refresh()
  }
  const currentChange = (val) => {
    current.value = val
    tableProps.value.pagination.page = val
    refresh()
  }

  return {
    getTableData: refresh,
    tableProps: tableProps.value,
    sizeChange,
    currentChange,
  }
}
