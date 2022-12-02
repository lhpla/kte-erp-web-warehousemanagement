import {
  checkName
} from '@/utils/util'

let qualityprint = (LODOP, json) => {
  //质检 打印
  return new Promise((resolve) => {
    let printName = checkName('70*30')
    LODOP.PRINT_INIT(json.sku);
    LODOP.SET_PRINT_MODE('WINDOW_DEFPRINTER', printName)
    LODOP.SET_PRINT_COPIES(Number(json.num))
    // LODOP.ADD_PRINT_RECT("0mm", "0mm", "70.01mm", "30.01mm", 0, 1);//边框
    LODOP.SET_PRINT_PAGESIZE(1, "70mm", "30mm", json.sku);
    LODOP.ADD_PRINT_BARCODE("5.1mm", "0.5mm", "69mm", "10.58mm", "128A", json.sku);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_HTM("17mm", "2.65mm", "45mm", "5.29mm", "<div> <strong  style='font-size:12px;font-weight:bolder'>" + json.productEname + "</strong></div>");
    LODOP.ADD_PRINT_HTM("23mm", "2.65mm", "45mm", "5.29mm", "<div> <strong  style='font-size:13px;font-weight:bolder'>Made in China</strong></div>");
    LODOP.ADD_PRINT_BARCODE("16mm", "51.86mm", "15mm", "15mm", "QRCode", json.sku);
    LODOP.ADD_PRINT_HTM("0.79mm", "2.65mm", "60mm", "5.29mm", "<div style='text-align:center'> <strong  style='font-size:12px;'>" + json.sku + "</strong></div>");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    resolve(json);
  });
};

export default qualityprint