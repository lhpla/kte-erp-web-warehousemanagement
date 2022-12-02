import { checkName } from '@/utils/util'

let cartonNum = (LODOP, json) => {
  //箱号 打印
  return new Promise((resolve) => {
    let printName = checkName('100*100')
    LODOP.PRINT_INIT(json.cartonNum)
    LODOP.SET_PRINT_MODE('WINDOW_DEFPRINTER', printName)
    LODOP.SET_PRINT_COPIES(Number(json.num)) //打印数量
    LODOP.SET_PRINT_PAGESIZE(1, '100mm', '100mm', json.cartonNum)
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, '2')
    // LODOP.ADD_PRINT_SHAPE(4, "0mm", "0mm", "100mm", "30mm", 0, 1, "#333333");
    LODOP.ADD_PRINT_RECT('0mm', '0mm', '100.01mm', '30mm', 0, 1)
    LODOP.ADD_PRINT_RECT('0mm', '0mm', '100mm', '100mm', 0, 1) //边框
    LODOP.SET_PRINT_STYLEA(0, 'Horient', 2)
    LODOP.SET_PRINT_STYLEA(0, 'Vorient', 2)
    LODOP.SET_PRINT_STYLEA(0, 'ScalX', 0.0)
    LODOP.SET_PRINT_STYLEA(0, 'ScalY', 0.0)
    LODOP.ADD_PRINT_HTM('3mm', '1mm', '99mm', '15mm', "<div> <strong style='font-size:43px;font-weight:bolder;'> " + json.warehouse + '</strong></div>')
    LODOP.ADD_PRINT_HTM('20mm', '3mm', '38mm', '8mm', "<div><strong style='font-size:27px;font-weight:bolder;'>" + json.time + '</strong></div>')
    LODOP.ADD_PRINT_HTM('20mm', '45mm', '53mm', '8mm', "<div><strong style='font-size:27px;font-weight:bolder;'>柜号:" + json.cabinetNum + '</strong></div>')
    LODOP.ADD_PRINT_HTM('35mm', '4mm', '85mm', '26mm', "<div> <strong  style='font-size:30px;font-weight:bolder'>" + json.isPhoto + 'SKU : <div>' + json.sku + '</div></strong></div>')
    LODOP.ADD_PRINT_BARCODE('70mm', '4mm', '50mm', '20mm', '128A', json.cabinetNum + '-' + json.cartonNum)
    LODOP.SET_PRINT_STYLEA(0, 'ShowBarText', 0)
    LODOP.ADD_PRINT_HTM('65mm', '60mm', '35mm', '8mm', "</script><div ><strong style='font-size:23px;font-weight:bolder;'>箱号:<span style='font-size:30px'>" + json.cartonNum + '</span></strong></div>')
    LODOP.ADD_PRINT_HTM('75mm', '60mm', '35mm', '8mm', "<div> <strong  style='font-size:23px;font-weight:bolder'>数量:<span style='font-size:30px'>" + json.encasementNum + '</span></strong></div>')
    LODOP.ADD_PRINT_HTM('85mm', '60mm', '35mm', '8mm', "<div> <strong  style='font-size:23px;font-weight:bolder'>退税:<span style='font-size:30px'>" + json.drawback + '</span></strong></div>')
    // LODOP.SET_PRINTER_INDEX('Argox CP-2140M PPLB')
    resolve(json)
  })
}

export default cartonNum
