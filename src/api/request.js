import axios from 'axios'
import { localGet, localRemove } from '../utils/util'
import { message } from '../utils/resetMessage'
import router from '../router/index'
import { ElMessage } from 'element-plus'
let isToken = true

axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL

// 设置超时时间（30s）
axios.defaults.timeout = 60000*2
// 跨域时候允许携带凭证
// axios.defaults.withCredentials = true;

/*
    设置请求传递数据得格式(看服务器要求什么格式)
    x-www-form-urlencoded
*/
// 默认 post 请求，使用 application/json 形式
// application/x-www-form-urlencoded
// application/json
// multipart/form-data
// text/xml
// axios.defaults.headers.post["Content-Type"] = "application/json";
// 对 post请求做格式设置
// axios.defaults.transformRequest = data => qs.stringify(data);

/*
    请求拦截器
    客户端发送请求 -> [请求拦截器] -> 服务器
    token校验(JWT) : 接受服务器返回的token,存储到vuex/本地储存当中

*/
axios.interceptors.request.use(
  (config) => {
    // console.log(config);
    // 携带上token
    const token = localGet('Kte-token')
    // 登录时不传token，防止过期情况
    if (config.url.indexOf('/kte-auth/oauth/token') === -1) {
      token && (config.headers['Kte-Auth'] = token)
    }
    // 必传（当前默认）
    config.headers.Authorization = 'Basic c2FiZXI6c2FiZXJfc2VjcmV0'
    // 必传（当前默认）
    config.headers['Tenant-Id'] = '000000'
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const request = (url, params, method, isJson = false, isFromData = false, onProgress) => {
  return new Promise((resolve, reject) => {
    if (method == 'post' || method == 'put') {
      axios({
        method: method,
        url: url,
        data: params,
        // 格式的转化
        transformRequest: [
          function (data) {
            let ret = ''
            if (isJson === true) {
              ret = JSON.stringify(data)
            } else if (isFromData === true) {
              ret = data
            } else {
              for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
              }
            }
            return ret
          },
        ],
        headers: {
          'Content-Type':
            isJson === true
              ? 'application/json'
              : isFromData === true
                ? 'multipart/form-data'
                : 'application/x-www-form-urlencoded',
        },
        onUploadProgress: progressEvent => {
          let progress = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
          if (onProgress && typeof onProgress === 'function') {
            onProgress(progress)
          }
        }
      })
        .then((res) => {
          if (res && res.data) {
            if (res.status === 200) {
              resolve(res.data)
            } else {
              reject(res.data)
            }
          } else {
            // 非200返回res(undefined)用于判断
            reject(res)
          }
        })
        .catch((error) => {
          reject(error)
        })
    } else if (method == 'get' || method == 'delete') {
      axios({
        method: method,
        url: url,
        params: params,
        // 格式的转化
        transformRequest: [
          function (data) {
            let ret = ''
            if (isJson === true) {
              ret = JSON.stringify(data)
            } else {
              for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
              }
            }
            return ret
          },
        ],
        headers: {
          'Content-Type':
            isJson === true
              ? 'application/json'
              : isFromData === true
                ? 'multipart/form-data'
                : 'application/x-www-form-urlencoded',
        },
      })
        .then((res) => {
          if (res && res.data) {
            if (res.status === 200) {
              resolve(res.data)
            } else {
              reject(res.data)
            }
          } else {
            // 非200返回res(undefined)用于判断
            reject(res)
          }
        })
        .catch((error) => {
          reject(error)
        })
    }
  })
}

// 给实例添加一个setToken方法，用于登录后将最新token动态添加到header，同时将token保存在localStorage中
axios.setToken = (token) => {
  axios.defaults.headers['Kte-Auth'] = token
  window.localStorage.setItem('Kte-token', token)
}

let isRefreshing = false // 定义一个是否正在刷新token的标记
let retryRequests = [] // 定义一个空数组，承载请求队列
/*
  响应拦截器
  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
*/
// axios.defaults.validateStatus = status => {
// 自定义响应成功得HTTP状态码
//     return /^(2|3)\d{2}$/.test(status);
// }
axios.interceptors.response.use(
  (response) => {
    // console.log(response);
    return response
  },
  (error) => {
    const { response } = error
    // 错误提示
    // if (response
    // 服务器返回结果.data.error_description) {
    //   message.error(response.data.error_description);
    // }
    if (response) {
      switch (response.status) {
        case 400:
          response.data.error_description
            ? message.error(response.data.error_description)
            : response.data.msg
              ? message.error(response.data.msg)
              : message.error('请求失败！请您稍后重试')

          break
        case 401: // 当前用户需要验证(一般是授权或者未登录)
          // 无状态刷新token
          // const config = response.config;
          // if (!isRefreshing) {
          //   isRefreshing = true; // 状态更新
          //   let refreshToken = localGet("userInfo");
          //   let formLabel = {
          //     grant_type: "refresh_token",
          //     refresh_token: refreshToken.refresh_token
          //   };
          //   return request("/kte-auth/oauth/token", formLabel, "post", false)
          //     .then(res => {
          //       console.log(res);
          //       let token = res.token_type + " " + res.access_token;
          //       axios.setToken(token);
          //       config.headers["Kte-Auth"] = token;
          //       retryRequests.forEach(cb => cb(token));
          //       retryRequests = [];
          //       return axios(config);
          //     })
          //     .finally(() => {
          //       isRefreshing = false;
          //     });
          // } else {
          //   return new Promise(resolve => {
          //     // 将resolve放进队列，用一个函数形式来保存，等token刷新后调用执行
          //     retryRequests.push(token => {
          //       config.headers["Kte-Auth"] = token;
          //       resolve(axios(config));
          //     });
          //   });
          // }
          if (isToken) {
            isToken = false
            message.error('登录失效！请您重新登录')
            localRemove('Kte-token')
            setTimeout(() => {
              window.location.pathname = '/login'
            }, 300)
          } else {
            isToken = true
          }

          break
        case 403: // 服务器已接收请求,但是拒绝执行它(一般是token过期)
          localRemove('Kte-token')
          break
        case 404: // 请求失败,请求所希望看到得资源未被在服务器上发现
          message.error('请求失败！请您稍后重试')
          break
        case 405: // 请求失败,请求所希望看到得资源未被在服务器上发现
          message.error('请求方式错误！请您稍后重试')
          break
        case 500:
          message.error(response.data.msg)
          break
        case 502:
          message.error('网络错误！')
          break
        case 503:
          message.error('服务不可用！')
          break
        case 504:
          message.error('网关超时！')
          break
      }
    } else {
      // 服务器结果都没有返回(可能服务器错误可能客户端断网)
      // 无网络时error无response
      message.error('请求超时，请检查网络连接！')
      if (!window.navigator.onLine) {
        // 断网处理:可以跳转到断网页面
        return
      }
      isToken = true
      return Promise.reject(error)
    }
  }
)

// 创建下载实例
const downLoad = axios.create({
  // 请求超时时间
  timeout: 60000,
  responseType: 'blob',
})

downLoad.setToken = (token) => {
  downLoad.defaults.headers['Kte-Auth'] = token
  window.localStorage.setItem('Kte-token', token)
}

let isRefreshingDownLoad = false // 定义一个是否正在刷新token的标记
let retryRequestsDownLoad = [] // 定义一个空数组，承载请求队列

downLoad.interceptors.request.use(
  (config) => {
    // console.log(config);
    // 携带上token
    const token = localGet('Kte-token')
    // 登录时不传token，防止过期情况
    if (config.url.indexOf('/kte-auth/oauth/token') === -1) {
      token && (config.headers['Kte-Auth'] = token)
    }
    // 必传（当前默认）
    config.headers.Authorization = 'Basic c2FiZXI6c2FiZXJfc2VjcmV0'
    // 必传（当前默认）
    config.headers['Tenant-Id'] = '000000'
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
downLoad.interceptors.response.use(
  (res) => {
    console.log(res)
    return res
  },
  (error) => {
    const { response } = error
    // 错误提示
    // if (response.data.error_description) {
    //   message.error(response.data.error_description);
    // }
    if (response) {
      // 服务器返回结果
      switch (response.status) {
        case 400:
          if (response.data.type == 'application/json') {
            let reader = new FileReader()
            reader.onload = function (event) {
              let content = reader.result
              let messages = JSON.parse(content).msg // 错误信息
              message.error(messages)
            }
            reader.readAsText(response.data)
            return false
          }

          response.data.error_description
            ? message.error(response.data.error_description)
            : response.data.msg
              ? message.error(response.data.msg)
              : message.error('请求失败！请您稍后重试')

          break
        case 401: // 当前用户需要验证(一般是授权或者未登录)
          // 无状态刷新token
          // const config = response.config;
          // if (!isRefreshingDownLoad) {
          //   isRefreshingDownLoad = true; // 状态更新
          //   let refreshToken = localGet("userInfo");
          //   let formLabel = {
          //     grant_type: "refresh_token",
          //     refresh_token: refreshToken.refresh_token
          //   };
          //   return request("/kte-auth/oauth/token", formLabel, "post", false)
          //     .then(res => {
          //       console.log(res);
          //       let token = res.token_type + " " + res.access_token;
          //       downLoad.setToken(token);
          //       config.headers["Kte-Auth"] = token;
          //       retryRequestsDownLoad.forEach(cb => cb(token));
          //       retryRequestsDownLoad = [];
          //       return downLoad(config);
          //     })
          //     .finally(() => {
          //       isRefreshingDownLoad = false;
          //     });
          // } else {
          //   return new Promise(resolve => {
          //     // 将resolve放进队列，用一个函数形式来保存，等token刷新后调用执行
          //     retryRequestsDownLoad.push(token => {
          //       config.headers["Kte-Auth"] = token;
          //       resolve(downLoad(config));
          //     });
          //   });
          // }
          console.error('当前用户需要验证')
          message.error('登录失效！请您重新登录')
          localRemove('Kte-token')
          router.replace({
            path: '/login',
          })
          break
        case 403: // 服务器已接收请求,但是拒绝执行它(一般是token过期)
          localRemove('Kte-token')
          break
        case 404: // 请求失败,请求所希望看到得资源未被在服务器上发现
          message.error('请求失败！请您稍后重试')
          break
        case 405: // 请求失败,请求所希望看到得资源未被在服务器上发现
          message.error('请求方式错误！请您稍后重试')
          break
        case 500:
          message.error(response.data.msg)
          break
        case 502:
          message.error('网络错误！')
          break
        case 503:
          message.error('服务不可用！')
          break
        case 504:
          message.error('网关超时！')
          break
      }
    } else {
      // 服务器结果都没有返回(可能服务器错误可能客户端断网)
      // 无网络时error无response
      message.error('请求超时，请检查网络连接！')
      if (!window.navigator.onLine) {
        // 断网处理:可以跳转到断网页面
        return
      }
      return Promise.reject(error)
    }
  }
)

/**
 * 封装下载方法
 * @param url
 * @param params
 * @returns {Promise}
 */

export function downLoadFile(url, params) {
  return new Promise((resolve, reject) => {
    downLoad
      .get(url, {
        params: params,
      })
      .then((res) => {
        // console.log(res);
        if (res && res.data) {
          if (res.status === 200) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        } else {
          // 非200返回res(undefined)用于判断
          reject(res)
        }
      })
  })
}

/**
 * 封装下载方法 post
 * @param url
 * @param params
 * @returns {Promise}
 */

export function downLoadFilePost(url, param) {
  // ElMessage.success('正在下载，请稍后')
  return new Promise((resolve, reject) => {
    downLoad
      .post(url, param, {
        'Content-Type': 'application/json',
      })
      .then((res) => {
        if (res && res.data) {
          if (res.status === 200) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        } else {
          // 非200返回res(undefined)用于判断
          reject(res)
        }
      })
  })
}

/**
 * 封装get方法
 * @param url
 * @param params
 * @param isJson
 * @returns {Promise}
 */

export function get(url, params, isJson, isFromData) {
  return request(url, params, 'get', isJson, isFromData)
}

/**
 * 封装delete方法
 * @param url
 * @param params
 * @param isJson
 * @returns {Promise}
 */

export function remove(url, params, isJson, isFromData) {
  return request(url, params, 'delete', isJson, isFromData)
}

/**
 * 封装post请求
 * @param url
 * @param params
 * @param isJson
 * @returns {Promise}
 */
export function post(url, params, isJson, isFromData, onProgress) {
  return request(url, params, 'post', isJson, isFromData, onProgress)
}

/**
 * 封装put请求
 * @param url
 * @param params
 * @param isJson
 * @returns {Promise}
 */
export function put(url, params, isJson, isFromData) {
  return request(url, params, 'put', isJson, isFromData)
}

/**
 * 封装并发请求
 * @param request
 * @returns {Promise}
 */

export function all(...request) {
  let reqName = []
  request.forEach((v, k) => {
    reqName[k] = 'req' + k
  })
  return new Promise((resolve, reject) => {
    axios.all(...request).then(
      axios.spread(function (...reqName) {
        // 两个请求现在都执行完成
        resolve()
      })
    )
  })
}

/**
 * 封装下载zip方法
 * @param url
 * @param params
 * @returns {Promise}
 */

export function downLoadFileZip(url, params) {
  return new Promise((resolve, reject) => {
    downLoad.post(url, params).then((res) => {
      // console.log(res);
      if (res && res.data) {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      } else {
        // 非200返回res(undefined)用于判断
        reject(res)
      }
    })
  })
}
