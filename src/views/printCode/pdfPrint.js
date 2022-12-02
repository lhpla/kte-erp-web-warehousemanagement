import {
  checkName
} from '@/utils/util'
let pdfPrint = (LODOP, json) => {
  //箱唛 打印
  return new Promise((resolve) => {
    let printName = checkName('100*100')
    LODOP.PRINT_INIT('pdf');
    LODOP.SET_PRINT_MODE('WINDOW_DEFPRINTER', printName)
    LODOP.SET_PRINT_PAGESIZE(1, "100mm", "100mm", '箱唛');
    LODOP.ADD_PRINT_PDF("0mm", "0mm", ' 100mm', '100mm', json)
    // LODOP.ADD_PRINT_IMAGE("0mm", "0mm", ' 100mm', '100mm', 'data:image/jpg;base64,' + json)
    resolve(json);
  });
};

export default pdfPrint