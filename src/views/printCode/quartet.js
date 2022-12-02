import {
  checkName
} from '@/utils/util'

let quartet = (LODOP, json) => {
  //质检 打印
  return new Promise((resolve) => {
    let printName = checkName('70*30')
    LODOP.PRINT_INIT(json.sku);
    LODOP.SET_PRINT_MODE('WINDOW_DEFPRINTER', printName)
    LODOP.SET_PRINT_COPIES(Number(json.num))
    // LODOP.ADD_PRINT_RECT("0mm", "0mm", "70.01mm", "30.01mm", 0, 1);//边框
    LODOP.SET_PRINT_PAGESIZE(1, "70mm", "30mm", json.skuId);
    LODOP.ADD_PRINT_BARCODE("2.46mm", "2.65mm", "65mm", "10.58mm", "128A", json.skuId);
    // LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_HTM("14.1mm", "2.65mm", "60mm", "5.29mm", "<div> Name：<strong  style='font-size:12px;font-weight:bolder'>" + json.productEname + "</strong></div>");
    LODOP.ADD_PRINT_HTM("24.32mm", "42.6mm", "26.48mm", "5.29mm", "<div> <strong  style='font-size:13px;font-weight:bolder'>Made in China</strong></div>");
    LODOP.ADD_PRINT_HTM("20.11mm", "2.65mm", "60.01mm", "5.29mm", "<div> <strong  style='font-size:12px;'>" + json.customerCode + "</strong></div>");
    // LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    // LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    resolve(json);
  });
};

export default quartet