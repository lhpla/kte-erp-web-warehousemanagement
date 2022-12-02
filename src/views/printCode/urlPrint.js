import {
  checkName
} from '@/utils/util'
let urlPrint = (LODOP, json) => {
  //箱唛 打印
  return new Promise((resolve) => {
    let printName = checkName('100*100')
    LODOP.PRINT_INIT('url');
    LODOP.SET_PRINT_MODE('WINDOW_DEFPRINTER', printName)
    LODOP.SET_PRINT_PAGESIZE(1, "100mm", "100mm", '入库清单');
    LODOP.ADD_PRINT_PDF(0, 0, "100%", "100%", json);
    LODOP.SET_PRINT_MODE("FULL_HEIGHT_FOR_OVERFLOW", true)
    resolve(json);
  });
};

export default urlPrint