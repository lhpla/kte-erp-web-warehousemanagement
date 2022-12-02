import {
  checkName
} from '@/utils/util'
let imgPrint = (LODOP, json) => {
  //箱号 打印
  return new Promise((resolve) => {
    let printName = checkName('100*100')
    LODOP.PRINT_INIT("打印dhl标签" + json.expressid);
    LODOP.SET_PRINT_MODE('WINDOW_DEFPRINTER', printName)
    // LODOP.SET_PRINT_PAGESIZE(2, "100mm", "100mm", "syeub" + json.orderid);
    LODOP.ADD_PRINT_IMAGE(0, 0, "100mm", "100mm", "<img src='" + json.url + "'/>");
    LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
    resolve(json);
  });

  //A000120211013160001
};

export default imgPrint