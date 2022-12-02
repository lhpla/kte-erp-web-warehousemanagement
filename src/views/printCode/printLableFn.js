import {
  ElMessage
} from 'element-plus'
import {
  parseTime,
  localGet,
  checkName
} from '@/utils/util'
import qualityprint from './qualityprint'
import cycleprint from './cycleprint'
import cartonNum from './cartonNum'
import imgPrint from './imgPrint.js'
import pdfPrint from './pdfPrint'
import quartet from './quartet'
import fbaTag from './fbaTag'
import urlPrint from './urlPrint'

/*****
 * 打印注释
 * 先检查 是不是在线的面单 是 === 配置在downPicPrint  （再去看智能打印 增加一个配货单 checklistPrint.js增加配置）
 *
 */
function PrintLable(LODOP, data, type, smart, view) {
  this.LODOP = LODOP
  // 判断是否安装
  if (typeof LODOP === 'string') {
    ElMessage({
      dangerouslyUseHTMLString: true,
      message: LODOP,
    })
  } else {
    if (!localGet('printSet') || localGet('printSet').length < 1) {
      ElMessage.warning('请到系统模块配置打印机！')
      return
    }
    this.qualityprint = qualityprint
    this.cycleprint = cycleprint
    this.cartonNum = cartonNum
    this.imgPrint = imgPrint
    this.pdfPrint = pdfPrint
    this.quartet = quartet
    this.fbaTag = fbaTag
    this.urlPrint = urlPrint
    if (type == 'sku') {
      let printName = checkName('70*30')
      if (!printName) {
        return
      }
      if (typeof data.sku === 'string') {
        if (data.productEname.length > 21) {
          data.productEname = data.productEname.substring(0, 21) + '...'
        }
        //将字母转为小写
        data.productEname = data.productEname.toLowerCase()
        LODOP.SET_PRINT_COPIES(Number(data.num))
        // LODOP.PRINT_DESIGN(); //编辑
        // LODOP.PREVIEW(); //预览
        this.qualityprint(LODOP, data)
        LODOP.PRINT() //打印
        return this
      } else {
        if (data.sku.length > 0) {
          for (let item of data.sku) {
            if (item.productEname.length > 21) {
              item.productEname = item.productEname.substring(0, 21) + '...'
            }
            //将字母转为小写
            item.productEname = item.productEname.toLowerCase()
            LODOP.SET_PRINT_COPIES(Number(data.num)) //打印数量
            // LODOP.PREVIEW(); //预览
            this.cycleprint(LODOP, {
              sku: item.sku,
              productEname: item.productEname,
              num: item.num,
            })
            // LODOP.PRINT_DESIGN(); //编辑
            LODOP.PRINT() //打印
          }
          return this
        }
      }
    } else if (type == 'cartonNum') {
      let printName = checkName('100*100')
      if (!printName) {
        return
      }
      if (Array.isArray(data)) {
        if (data.length > 0) {
          for (let item of data) {
            item.time = parseTime(new Date(), '{y}/{m}/{d}')
            LODOP.SET_PRINT_COPIES(Number(item.num)) //打印数量
            // LODOP.PREVIEW(); //预览
            this.cartonNum(LODOP, item)
            // LODOP.PRINT_DESIGN(); //编辑
            LODOP.PRINT() //打印
          }
          return this
        }
      } else {
        data.time = parseTime(new Date(), '{y}/{m}/{d}')
        // LODOP.PRINT_DESIGN(); //编辑
        // LODOP.PREVIEW(); //预览
        LODOP.SET_PRINT_COPIES(Number(data.num)) //打印数量
        this.cartonNum(LODOP, data)
        LODOP.PRINT() //打印
        return this
      }
    } else if (type == 'img') {
      let printName = checkName('100*100')
      if (!printName) {
        return
      }
      this.imgPrint(LODOP, data)
      // LODOP.PRINT_DESIGN(); //编辑
      // LODOP.PREVIEW(); //预览
      LODOP.SET_PRINT_COPIES(Number(data.num)) //打印数量
      LODOP.PRINT() //打印
      return this
    } else if (type == 'pdf') {
      let printName = checkName('100*100')
      if (!printName) {
        return
      }
      if (data.length > 0) {
        for (let item of data) {
          this.pdfPrint(LODOP, item)
          LODOP.SET_PRINT_COPIES(1) //打印数量
          // LODOP.PRINT_DESIGN(); //编辑
          // LODOP.PREVIEW(); //预览
          LODOP.PRINT() //打印
        }
        return this
      } else {
        this.pdfPrint(LODOP, data)
        LODOP.SET_PRINT_COPIES(1) //打印数量
        // LODOP.PRINT_DESIGN(); //编辑
        // LODOP.PREVIEW(); //预览
        LODOP.PRINT() //打印
        return this
      }
    } else if (type == 'quartet') {  //递四方标签
      let printName = checkName('70*30')
      if (!printName) {
        return
      }
      if (data.length > 0) {
        for (let item of data) {
          if (item.productEname.length > 21) {
            item.productEname = item.productEname.substring(0, 21) + '...'
          }
          //将字母转为小写
          item.productEname = item.productEname.toLowerCase()
          this.quartet(LODOP, item)
          // LODOP.SET_PRINT_COPIES(1) //打印数量
          LODOP.PRINT() //打印
        }
        return this
      }
    } else if (type == 'fbaTag') {
      //fba标签
      let printName = checkName('70*30')
      if (!printName) { return }
      if (data.length > 0) {
        for (let item of data) {
          if (item.productEname.length > 21) {
            item.productEname = item.productEname.substring(0, 21) + '...'
          }
          this.fbaTag(LODOP, item)
          // LODOP.SET_PRINT_COPIES(item.num) //打印数量
          LODOP.SET_PRINT_COPIES(item.num) //打印数量
          // LODOP.PRINT_DESIGN(); //编辑
          // LODOP.PREVIEW(); //预览
          LODOP.PRINT() //打印
        }
        return this
      }
    } else if (type == 'urlPrint') {
      let printName = checkName('100*100')
      if (!printName) {
        return
      }
      this.urlPrint(LODOP, data)
      LODOP.SET_PRINT_COPIES(1) //打印数量
      // LODOP.PRINT_DESIGN(); //编辑
      // LODOP.PREVIEW(); //预览
      LODOP.PRINT() //打印
      return this
    }

  }
}

const printFn = (LODOP, data, type, PREVIEW) => {
  if (!data) {
    return ElMessage.error('无信息')
  }
  new PrintLable(LODOP, data, type, 1, true)
}
export default printFn
