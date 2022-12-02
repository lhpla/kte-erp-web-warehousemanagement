const Mock = require('mockjs')

const Random = Mock.Random

const typeList = {
  string: '@cword(3,6)',
  number: '@integer(1, 9999)',
  boolean: '@boolean',
  name: '@cname',
  address: '@county(true)',
  date: '@date',
  time: '@time',
  datetime: '@datetime',
  img: '@image',
  text: '@cparagraph(1)',
  id: Random.string('number', 16),
}

let mockFiles = require.context('./', false, /\.js$/)
const modules = {}

mockFiles.keys().forEach((key) => {
  if (key !== './index.js') {
    const name = key
      .split('./')
      .filter((item) => item !== '')
      .map((item) => item.replace('.js', ''))
    const value = mockFiles(key).default || mockFiles(key)
    Object.keys(value).map((k) => {
      if (k !== 'url') {
        if (Array.isArray(value[k])) {
          if (typeof value[k][0] === 'string' || typeof value[k][0] === 'number') {
            value[`${k}|1`] = value[k]
            delete value[k]
          } else {
            Object.keys(typeList).map((t) => {
              value[k].map((i) => {
                Object.keys(i).map((o) => {
                  if (i[o] === t) {
                    i[o] = typeList[t]
                  }
                })
              })
            })
          }
        } else if (typeof value[k] === 'object') {
          const v = value[k]
          Object.keys(v).map((i) => {
            Object.keys(typeList).map((t) => {
              if (t === v[i]) {
                v[i] = typeList[t]
              }
            })
          })
        } else {
          Object.keys(typeList).map((t) => {
            if (t === value[k]) {
              value[k] = typeList[t]
            }
          })
        }
      }
    })
    modules[name] = value
  }
})

const mockList = []
Object.keys(modules).map((m) => {
  mockList.push(modules[m])
})

mockList.map((item) => {
  const res = { ...item }
  delete res.url
  delete res.method
  const url = `${process.env.VUE_APP_SERVER_URL}${item.url}`
  Mock.mock(url, item.method, {
    code: 200,
    msg: '获取成功',
    success: true,
    data: {
      total: 100,
      size: 10,
      current: 1,
      'records|100': [{ ...res }],
    },
  })
})
