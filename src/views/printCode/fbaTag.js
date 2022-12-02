import {
    checkName
} from '@/utils/util'

let fbaTag = (LODOP, json) => {
    //质检 打印
    return new Promise((resolve) => {
        let printName = checkName('70*30')
        LODOP.PRINT_INIT(json.tag);
        LODOP.SET_PRINT_MODE('WINDOW_DEFPRINTER', json.tag)
        LODOP.SET_PRINT_COPIES(Number(json.num))
        //   LODOP.ADD_PRINT_RECT("0mm", "0mm", "70.01mm", "30.01mm", 0, 1);//边框
        LODOP.SET_PRINT_PAGESIZE(1, "70mm", "30mm", json.tag);
        LODOP.ADD_PRINT_BARCODE("3.2mm", "6.35mm", "57mm", "13mm", "128A", json.tag);
        LODOP.SET_PRINT_STYLEA(0, "AlignJustify", 2); //条码文字居中展示 不填充
        LODOP.ADD_PRINT_HTM("16mm", "6.35mm", "57mm", "5.29mm", "<div> <strong  style='font-size:16px;font-weight:bolder'>" + json.productEname + "</strong></div>");
        LODOP.ADD_PRINT_HTM("22mm", "6.35mm", "12mm", "5.29mm", "<div> <strong  style='font-size:16px;'>New</strong></div>");
        LODOP.ADD_PRINT_HTM("22mm", "37mm", "26.48mm", "5.29mm", "<div> <strong  style='font-size:14px;font-weight:bolder'>Made in China</strong></div>");
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
        resolve(json);
    });
};

export default fbaTag