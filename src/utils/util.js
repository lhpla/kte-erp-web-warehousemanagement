import {
  ElMessage
} from "element-plus";

// import store from "vuex";
// import router from "../router/index";

/**
 * 节流函数
 * @param fn 事件触发的操作
 * @param mustDelay 间隔多少毫秒需要触发一次事件
 */
export function throttle(fn, mustDelay) {
  let timer;
  let start = 0;
  return function () {
    const now = new Date().getTime();
    const self = this;
    const args = arguments;
    if (now > start + mustDelay) {
      fn.apply(self, args);
      start = now;
    }
  };
}

/**
 * 防抖函数
 * @param fn 事件触发的操作
 * @param delay 多少毫秒内连续触发事件，不会执行
 * @returns {Function}
 */
export function debounce(fn, delay) {
  let timer = null;
  return function () {
    const self = this;
    const args = arguments;
    timer && clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(self, args);
    }, delay);
  };
}

/**
 * 比较两个对象是否相等
 * @param obj1 对象一
 * @param obj2 对象二
 * @returns {Boolean}
 */
export function compareJsonObj(obj1, obj2) {
  let result = true;
  if (!isJsonObj(obj1) || !isJsonObj(obj2)) return false;
  for (let key in obj1) {
    if ((obj1[key] && !obj2[key]) || (!obj1[key] && obj2[key]) || (obj1[key] && obj2[key] && obj1[key].toString() !== obj2[key].toString())) {
      result = false;
      break;
    }
  }
  return result;
  // 判断一个对象是否是 json 对象
  function isJsonObj(data) {
    return data && Object.prototype.toString.call(data) === "[object Object]";
  }
}

/**
 * 获取localStorage
 * @param key Storage名称
 * @returns {String}
 */
export function localGet(key) {
  const value = window.localStorage.getItem(key);
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch (error) {
    return value;
  }
}

/**
 * 存储localStorage
 * @param key Storage名称
 * @param value Storage值
 */
export function localSet(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * 清除localStorage
 * @param key Storage名称
 */
export function localRemove(key) {
  window.localStorage.removeItem(key);
}

/**
 * 时间转换
 * @param time 时间
 * @param cFormat 格式
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

// 时间加减
export function dateAddDays(dateStr, dayCount) {
  var tempDate = new Date(dateStr.replace(/-/g, "/")); // 把日期字符串转换成日期格式
  var resultDate = new Date((tempDate / 1000 + 86400 * dayCount) * 1000); // 增加n天后的日期
  let year = resultDate.getFullYear();
  let month = resultDate.getMonth() + 1 < 10 ? "0" + (resultDate.getMonth() + 1) : resultDate.getMonth() + 1;
  let day = resultDate.getDate() < 10 ? "0" + resultDate.getDate() : resultDate.getDate();
  let hour = resultDate.getHours() < 10 ? "0" + resultDate.getHours() : resultDate.getHours();
  let min = resultDate.getMinutes() < 10 ? "0" + resultDate.getMinutes() : resultDate.getMinutes();
  let second = resultDate.getSeconds() < 10 ? "0" + resultDate.getSeconds() : resultDate.getSeconds();
  var resultDateStr = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + second; // 将日期转化为字符串格式
  return resultDateStr;
}

// 匹配父级ID
export function getFathersById(id, data, prop = "id") {
  // prop = prop ? prop : "id"
  var arrRes = [];
  const rev = (data, nodeId) => {
    for (var i = 0, length = data.length; i < length; i++) {
      const node = data[i];
      if (node[prop] === nodeId) {
        arrRes.unshift(node[prop]);
        return true;
      } else {
        if (node.children && node.children.length) {
          if (rev(node.children, nodeId)) {
            arrRes.unshift(node[prop]);
            return true;
          }
        }
      }
    }
    return false;
  };
  rev(data, id);
  return arrRes;
}

// 遍历数组
export function matterTree(item, data) {
  for (var i = 0; i < data.length; i++) {
    if (item.id == data[i].id) {
      data[i] = item;
    } else {
      if (data[i].children && data[i].children.length > 0) {
        matterTree(item, data[i].children);
      }
    }
  }
  return data;
}

/***
 * 解析zip文件流
 * */

export function handelExport(res) {
  const aLink = document.createElement("a");
  var blob = new Blob([res], {
    type: "application/zip"
  }); // 这里是告之是zip类型的文件)
  var patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
  var contentDisposition = decodeURI("attachment; filename=kte.zip");
  var result = patt.exec(contentDisposition);
  var fileName = result[1];
  fileName = fileName.replace(/\"/g, "");
  aLink.href = URL.createObjectURL(blob);
  aLink.setAttribute("download", fileName); // 设置下载文件名称
  document.body.appendChild(aLink);
  aLink.click();
}

/**
 * 复制文本
 * text -> 传入要复制得文本（字符）
 * */

export function documentCopy(text) {
  if (text && text != "") {
    let url = text;
    let oInput = document.createElement("textarea");
    oInput.value = url;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象;
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.remove();
    ElMessage.success("复制成功！");
  } else {
    ElMessage.error("暂无可复制对象！");
  }
}

// 验证链接是否合法
export function judgeIsUrl(url) {
  let sRegex = /(http|https):\/\/([\w.]+\/?)\S*/gi;
  var re = new RegExp(sRegex);
  if (re.test(url)) {
    return true;
  }
  return false;
}

/*
 *情况 ：表格翻页发生改变将表格滚动高度置顶
 *参数 ：pid--> 表格文件中的最外层dom上的 id
 *说明 ：function中的 #table 是要进行dom操作的表格id
 */

export function backTableTop(pid, height) {
  if (document.querySelector(`${pid} .el-table .el-table__body-wrapper`)) {
    document.querySelector(`${pid} .el-table .el-table__body-wrapper`).scrollTop = height || 0;
  }
}

// 由生成的链接下载模板
export function download(blobUrl, tempName, fileType) {
  const a = document.createElement("a");
  a.style.display = "none";
  a.download = `${tempName}${fileType}`;
  a.href = blobUrl;
  document.body.appendChild(a);
  a.click();
  // 去除下载对url的影响
  document.body.removeChild(a);
  window.URL.revokeObjectURL(blobUrl);
}

/**
 * 计算两个日期相隔天数
 * @param strDate 开始时间(new Date())
 * @param endDate 结算时间(new Date(2022-2-1))
 */
export function dayDif(strDate, endDate) {
  return Math.ceil(Math.abs(strDate.getTime() - endDate.getTime()) / 86400000);
}
/**
 * 扁平并去重数组
 * @param arr 传入数组[1,2,[2,3,[3,4]]] => [1,2,3,4]
 */
export function flatSet(arr) {
  let result = [];
  arr.map(i => {
    Array.isArray(i) ? (result = [...result, ...flatSet(i)]) : result.push(i);
  });
  return [...new Set(result)];
}
/**
 * 设置树形数据禁用属性
 * @param arr 传入树形数组
 */
export function setDisabled(arr) {
  let disabledList = ["首页", "主页"];
  arr.forEach(i => {
    if (
      disabledList.some(item => {
        return item == i.title;
      })
    ) {
      i.disabled = true;
      if (i.hasChildren) setDisabled(i.children);
    }
  });
  return arr;
}

/**
 * 图片压缩
 * @param file file
 * **/
export function imgShrink(file) {
  return new Promise(function (resolve, reject) {
    let imgResult = "";
    var width = 70; //图像大小
    var height = 70; //图像大小
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      let img = new Image();
      img.src = this.result;
      let quality = 1, //图像质量 取值0-1 值越小，所绘制出的图像越模糊
        canvas = document.createElement("canvas"),
        drawer = canvas.getContext("2d");
      img.onload = function () {
        canvas.width = width;
        canvas.height = height;
        drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
        // 返回base64
        imgResult = canvas.toDataURL("image/png", quality);
        resolve(imgResult);
      };
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
}
/**
 * 深拷贝
 * @param target 拷贝对象
 * **/
export function deepClone(target) {
  let result
  if (typeof target === 'object') { // 如果当前需要深拷贝的是一个对象
    if (Array.isArray(target)) { // 如果是一个数组
      result = [] // 将result赋值为一个数组，并且执行遍历
      for (let i in target) {
        result.push(deepClone(target[i])) // 递归克隆数组中的每一项
      }
    } else if (target === null) {
      result = null // 判断如果当前的值是null，直接赋值为null
    } else if (target.constructor === RegExp) {
      result = target // 判断如果当前的值是一个RegExp对象，直接赋值
    } else {
      result = {} // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      for (let i in target) {
        result[i] = deepClone(target[i])
      }
    }
  } else {
    result = target // 如果不是对象，就是基本数据类型，直接赋值
  }
  return result // 返回最终结果
}

export function checkName(size) {
  for (let item of localGet('printSet')) {
    if (item.size == size) {
      if (item.name) {
        return item.name
      } else {
        ElMessage.warning('请到系统模块配置' + size + '的打印机！')
      }
      break
    }
  }
}