<!-- 质检  打印 -->
<template>
  <div id="QualityInspectionPrint">
    <el-dialog title="打印" v-model="dialogVisible" width="90%" :close-on-click-modal="false" :before-close="handleClose"
      top="10vh" :close-on-press-escape="false">
      <div style="max-height: 55vh">
        <el-form :model="formItem" ref="tableFormRef" :inline="true" label-width="120px" class="demo-ruleForm formItem">
          <div>
            <el-form-item label="SKU:">
              {{ formItem.sku ? formItem.sku : "-" }}
            </el-form-item>
            <el-form-item label="拍照:">
              <span v-show="formItem.photoStatus !== ''" :class="formItem.photoStatus ? 'color-red' : ''">
                {{ formItem.photoStatus ? "是" : "否" }}
              </span>
              <span v-show="formItem.photoStatus === ''">-</span>
            </el-form-item>
            <el-form-item label="中转仓:">
              {{ formItem.warehouseName ? formItem.warehouseName : "-" }}
            </el-form-item>
            <!-- <el-form-item label="条码规则:" prop="barcodeRules">
              <el-select v-model="formItem.barcodeRules" filterable clearable placeholder="请选择">
                <el-option label="4PX" value="4PX"></el-option>
                <el-option label="谷仓" value="谷仓"></el-option>
              </el-select>
            </el-form-item> -->
          </div>
        </el-form>

        <el-collapse v-model="activeNames" v-show="formItem && formItem.result">
          <span v-for="(list, index) of formItem.result" :key="index">
            <el-collapse-item v-show="
              formItem.warehouseInfoVos && formItem.warehouseInfoVos[index]
            " :name="index + 1">
              <template #title>
                <div class="collapse_title">
                  <span class="left">
                    <span @click.stop="
                      updateCabinetNumClick(list, formItem.warehouseId)
                    " v-show="!list.rowIsAlter">修改柜号</span>
                  </span>
                  <span class="right">
                    <el-select v-model="list.headerAttribute" style="width:100px;margin-right: 10px;" filterable
                      clearable placeholder="请选择">
                      <el-option label="4PX" value="3"></el-option>
                      <el-option label="谷仓" value="1"></el-option>
                      <el-option label="无" value="6"></el-option>
                    </el-select>
                    {{
                    `${list.warehouse}：${list.receiptNum}`
                    }}
                  </span>
                </div>
              </template>
              <el-table :data="list.boxList" border stripe @selection-change="handleSelectionChange($event, list)"
                style="width: 100%" :header-cell-style="{
                  background: '#fafafa',
                  color: '#2d2f30',
                  fontWeight: 'bold',
                  fontSize: '12px',
                }">
                <el-table-column type="selection" width="55" :selectable="checkSelectable" />
                <el-table-column label="柜号" prop="cabinetNum"></el-table-column>
                <el-table-column label="柜子属性" prop="cabinetAttribute ">
                  <template #default="{ row }">
                    {{row.cabinetAttribute ?row.cabinetAttribute:'-'}}
                  </template>
                </el-table-column>
                <el-table-column label="箱号">
                  <template #default="{ row, $index }">
                    <el-form :model="row" :rules="cartonNumRules" :ref="`cartonNumForm${$index}${activeNames[index]}`">
                      <el-form-item label="" v-show="$index >= 0" prop="cartonNum">
                        <el-input clearable v-model.trim="row.cartonNum" @blur="cartonNumChange(row, $index)"
                          style="width: 90px"
                          :disabled="!row.isAlter || row.casesStatus == 'stuffing' || row.casesStatus == 'out_storage' || row.casesStatus == 'freeze'">
                        </el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="状态" prop="casesStatus">
                  <template #default="{ row, $index }">
                    {{ tableTypeComputed(casesStatusList, row.casesStatus) }}
                  </template>
                </el-table-column>
                <el-table-column label="尺寸（长x宽x高）cm" min-width="210">
                  <template #default="{ row, $index }">
                    <el-form :model="row" :rules="attrRules" :ref="`attrForm${$index}${activeNames[index]}`">
                      <div style="display: flex">
                        <el-form-item label="" v-show="$index >= 0" prop="length">
                          <el-input clearable v-model.trim="row.length" style="width: 90px"
                            @blur="blurVerifyPrintData(row)"
                            :disabled="!row.isAlter || row.casesStatus == 'stuffing' || row.casesStatus == 'out_storage' || row.casesStatus == 'freeze'">
                          </el-input>
                        </el-form-item>
                        &nbsp;&nbsp;
                        <el-form-item label="" v-show="$index >= 0" prop="width">
                          <el-input clearable v-model.trim="row.width" style="width: 90px"
                            @blur="blurVerifyPrintData(row)"
                            :disabled="!row.isAlter || row.casesStatus == 'stuffing' || row.casesStatus == 'out_storage' || row.casesStatus == 'freeze'">
                          </el-input>
                        </el-form-item>
                        &nbsp;&nbsp;
                        <el-form-item label="" v-show="$index >= 0" prop="height">
                          <el-input clearable v-model.trim="row.height" style="width: 90px"
                            @blur="blurVerifyPrintData(row)"
                            :disabled="!row.isAlter || row.casesStatus == 'stuffing' || row.casesStatus == 'out_storage' || row.casesStatus == 'freeze'">
                          </el-input>
                        </el-form-item>
                      </div>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="仓区" prop="warehouse"></el-table-column>
                <el-table-column label="运输方式" prop="transportMode"></el-table-column>
                <el-table-column label="装箱数量">
                  <template #default="{ row, $index }">
                    <el-form :model="row" :rules="encasementNumRules"
                      :ref="`ncasementNumForm${$index}${activeNames[index]}`">
                      <el-form-item style="position: relative" label="" v-show="$index >= 0" prop="encasementNum">
                        <el-input clearable v-model="row.encasementNum" @blur="changeCasementNum(row, $index)"
                          style="width: 90px"
                          :disabled="!row.isAlter || row.casesStatus == 'stuffing' || row.casesStatus == 'out_storage' || row.casesStatus == 'freeze'">
                        </el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>

                <el-table-column label="操作" align="center" min-width="100px">
                  <template #default="{ row, $index }">
                    <el-button size="small" type="primary" text
                      v-show="row.isAlter && row.casesStatus == 'not_listed' || row.isAlter && row.casesStatus == 'has_been_on'"
                      @click.prevent="deleteRow($index, list.boxList, row)">
                      删除
                    </el-button>
                    <el-button size="small" type="primary" text
                      v-show="row.isAlter && row.casesStatus == 'not_listed' || row.isAlter && row.casesStatus == 'has_been_on'"
                      @click="copyRow(row, list.boxList)">
                      新增
                    </el-button>
                    <el-button size="small" type="primary" text @click="printCartonNum(row)">
                      打印箱号
                    </el-button>
                    <el-dropdown class="margin-left">
                      <el-button type="primary" text size="small">
                        打印条码
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item @click="printClick(row,'4px')">4PX</el-dropdown-item>
                          <el-dropdown-item @click="printClick(row,'谷仓')">谷仓</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </span>
        </el-collapse>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="handleClose" :disabled="btnFlag" :loading="btnFlag">取 消</el-button>
          <el-button type="primary" size="small" :disabled="btnFlag" :loading="btnFlag" @click="allSubmit">保 存
          </el-button>
          <el-button type="primary" size="small" :disabled="btnFlag" :loading="btnFlag" @click="printAllCartonNum">
            打印所有箱号
          </el-button>
          <el-button type="primary" size="small" :disabled="btnFlag" :loading="btnFlag" @click="printSkuAllClick">
            打印所有SKU
          </el-button>
          <el-button size="small" type="primary" :disabled="btnFlag" :loading="btnFlag" @click="BatchModify">批量修改尺寸
          </el-button>
        </span>
      </template>
    </el-dialog>
    <BatchModifySize :formItem="formItem" ref="BatchModifySizeRef" />
    <UpdateCabinetNum ref="UpdateCabinetNumRef" @handleCabinetNum="handleCabinetNum"></UpdateCabinetNum>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  ref,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  nextTick,
  provide,
  watch,
  computed
} from "vue";
import { getLodop } from "@/utils/LodopFuncs";
import BatchModifySize from "./BatchModifySize.vue";
import UpdateCabinetNum from "./UpdateCabinetNum.vue";
import { localGet } from '@/utils/util'
export default {
  name: "QualityInspectionPrint",
  components: { BatchModifySize, UpdateCabinetNum },
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      selectList: [],
      casesStatusList: [],//箱子状态
      formItem: {
        boxInfoVoList: [],
        warehouseInfoVos: [],
      },
      cartonNumRules: {
        cartonNum: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      encasementNumRules: {
        encasementNum: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              let ret = /^\+?[1-9]\d*$/;
              if (!ret.test(value)) {
                callback(new Error("格式错误"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      attrRules: {
        length: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,
            message: "格式错误",
            trigger: "blur",
          },
        ],
        width: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,
            message: "格式错误",
            trigger: "blur",
          },
        ],
        height: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,
            message: "格式错误",
            trigger: "blur",
          },
        ],
      },
      info: {},
      btnFlag: false,
      activeNames: [1],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const refData = toRefs(data);
    const tableFormRef = ref(null);
    //批量修改尺寸
    const BatchModify = () => {
      vue.$refs.BatchModifySizeRef.openDialog();
    };
    //修改柜号
    const updateCabinetNumClick = (list, transferWarehouseId) => {
      if (list.selectList && list.selectList.length) {
        vue.$refs.UpdateCabinetNumRef.openDialog(list, transferWarehouseId);
      } else {
        vue.$message.warning(`请在${list.warehouse}勾选`)
      }
    };
    //修改回显柜号、柜号属性
    const handleCabinetNum = (cabinetNum, warehouse, resData) => {
      let index = ref(0)
      if (data.formItem.result.length) {
        data.formItem.result.map((item) => {
          if (item.warehouse == warehouse) {
            item.selectList.map((value) => {
              item.boxList.map(val => {
                if (val.cabinetNum == value.cabinetNum && val.cartonNum == value.cartonNum) {
                  val.cabinetNum = cabinetNum;
                  val.cartonNum = resData.boxNumList[index.value]
                  val.cabinetAttribute = resData.cabinetAttribute
                  index.value++
                }
              })
            });
          }
        });
      }
    };
    //批量修改尺寸后返回修改后的值
    const returnData = (list) => {
      data.formItem.result.map((warehouseInfo) => {
        list.forEach((warehouseList) => {
          if (warehouseInfo.warehouse == warehouseList.warehouse) {
            warehouseInfo.boxList.map((row) => {
              warehouseList.boxList.forEach((e) => {
                if (
                  e.cabinetNum == row.cabinetNum &&
                  e.encasementNum == row.encasementNum
                ) {
                  if (row.isAlter) {
                    if (row.casesStatus != 'stuffing' || row.casesStatus != 'out_storage') {
                      row.length = e.length ? e.length : row.length;
                      row.width = e.width ? e.width : row.width;
                      row.height = e.height ? e.height : row.height;
                    }
                  }
                }
              });
            });
          }
        });
      });
    };
    provide("returnData", returnData);
    // 获取信息
    const getMsg = (msg) => {
      data.info = msg;
      data.activeNames = 1;
      data.formItem = {
        boxInfoVoList: [],
        warehouseInfoVos: [],
      };
      getWarehouseQualityDetail(data.info);
      data.casesStatusList = localGet("purchaseDict").warehouse_cases_status ? localGet("purchaseDict").warehouse_cases_status : []
      data.dialogVisible = true;
    };
    // 获取信息
    const getWarehouseQualityDetail = (msg) => {
      api.warehouse.warehouseQualityDetail(msg).then((res) => {
        if (res.code == 200) {
          data.formItem = res.data;
          // data.formItem.barcodeRules = data.formItem.barcodeRules
          //   ? data.formItem.encasementNum
          //   : "谷仓";
          data.formItem.boxInfoVoList.map((item) => {
            item.length = item.length > 0 ? Number(item.length) : "";
            item.width = item.width > 0 ? Number(item.width) : "";
            item.height = item.height > 0 ? Number(item.height) : "";
            item.encasementNum =
              item.encasementNum > 0 ? Number(item.encasementNum) : 1;
          });
          let arr = data.formItem.boxInfoVoList;

          let map = {};
          let dest = [];
          for (let i = 0; i < arr.length; i++) {
            let ai = arr[i];
            if (!map[ai.warehouse]) {
              let receiptNum = 0;
              let headerAttribute = 6;
              for (let item of data.formItem.warehouseInfoVos) {
                if (ai.warehouse == item.warehouse) {
                  receiptNum = item.receiptNum;
                  headerAttribute = item.headerAttribute;
                  break;
                }
              }
              dest.push({
                warehouse: ai.warehouse,
                receiptNum: receiptNum,
                boxList: [ai],
                headerAttribute: headerAttribute
              });
              map[ai.warehouse] = ai;
            } else {
              for (let j = 0; j < dest.length; j++) {
                let dj = dest[j];
                if (dj.warehouse == ai.warehouse) {
                  dj.boxList.push(ai);
                  break;
                }
              }
            }
          }
          dest.map(item => {
            item.rowIsAlter = item.boxList.every(ev => {
              return ev.isAlter === false;
            })
            item.boxList.map(ite => {
              ite.isEdit = true;
            })
          })
          data.formItem.result = dest;
        } else {
          vue.$message.warning(res.msg);
        }
      });
    };

    // 箱号 失去焦点
    const cartonNumChange = (row, index) => {
      if (row.serialNum && row.cartonNum) {
        api.warehouse
          .warehouseQuality({
            boxNumber: row.cartonNum,
            serialNum: row.serialNum,
            cabinetNum: row.cabinetNum,
          })
          .then((res) => {
            if (res.code == 200) {
              if (!res.data.verifyFlag) {
                data.formItem.boxInfoVoList[index].cartonNum = res.data.boxNum;
                vue.$message({
                  type: "warning",
                  message: "箱号与仓区不匹配，请重新输入",
                });
              } else {
                blurVerifyPrintData(row)
              }
            }
          });
      }
    };

    // 装箱数量计算
    const changeCasementNum = (row, index) => {
      var total = 0;
      for (let name of data.formItem.warehouseInfoVos) {
        if (
          `${name.warehouse}(${name.transportMode})` ==
          `${row.warehouse}(${row.transportMode})`
        ) {
          total = Number(name.receiptNum);
        }
      }
      var num = 0;
      for (let box of data.formItem.boxInfoVoList) {
        if (
          `${box.warehouse}(${box.transportMode})` ==
          `${row.warehouse}(${row.transportMode})`
        ) {
          num += Number(box.encasementNum);
        }
      }
      blurVerifyPrintData(row)
    };

    // 删除
    const deleteRow = (index, list, row) => {
      if (list.length > 1) {
        vue
          .$confirm("确认删除？")
          .then((_) => {
            let vo = {
              cabinetNum: row.cabinetNum,
              casesNum: row.cartonNum,
              caseNumAndCabinetNum: []
            }
            list.map(ite => {
              let obj = {
                cabinetNum: '',
                casesNum: '',
              }
              obj.cabinetNum = ite.cabinetNum
              obj.casesNum = ite.cartonNum
              vo.caseNumAndCabinetNum.push(obj)
            })
            api.warehouse.deleteWarehouseCases(vo).then(res => {
              console.log(res)
              if (res.code == 200) {
                list.splice(index, 1);
                vue.$message.success(res.msg);
              } else {
                vue.$message.warning(res.msg);
              }
            }).catch(e => { })
          })
          .catch((_) => {
            vue.$message({
              type: "info",
              message: "已取消修改",
            });
          });
      } else {
        vue.$message.warning("不能删除全部数据，至少保留一条！");
      }
    };
    //选择柜号
    const handleSelectionChange = (val, list) => {
      list.selectList = val
    }
    // 复制
    const copyRow = (row, list) => {
      let vo = {
        cabinetNum: row.cabinetNum,
        casesNum: '',
        caseNumAndCabinetNum: []
      }
      api.warehouse.saveWarehouseCases(vo).then(res => {
        if (res.code == 200) {
          vue.$message.success(res.msg)
          //新增操作-----
          let info = {
            cartonNum: res.data.casesNum,
            encasementNum: "",
            height: res.data.height,
            length: res.data.length,
            width: res.data.width,
            warehouse: res.data.purposeWarehouse,
            serialNum: "",
            cabinetNum: res.data.cabinetNum,
            warehouseId: res.data.purposeWarehouseId,
            transportMode: row.transportMode,
            isAlter: true,
            casesStatus: 'has_been_on',
            cabinetAttribute: '正常'
          };
          list.push(info);
        } else {
          vue.$message.warning(res.msg)
        }
      }).catch(e => { })
    };

    // 关闭
    const handleClose = () => {
      data.dialogVisible = false;
      data.activeNames = 1;
      if (tableFormRef.value) {
        tableFormRef.value.clearValidate();
        tableFormRef.value.resetFields();
      }
    };
    // 保存
    const allSubmit = () => {
      if (data.formItem.boxInfoVoList.length < 1) {
        vue.$message.warning("暂无数据");
        return;
      }
      data.activeNames = Array.isArray(data.activeNames)
        ? data.activeNames
        : [data.activeNames];
      const validateMethods = [];
      data.activeNames.map((_, i) => {
        data.formItem.result[i].boxList.map((_, index) => {
          nextTick(() => {
            if (
              vue.$refs &&
              vue.$refs[`cartonNumForm${index}${data.activeNames[i]}`]
            ) {
              validateMethods.push(
                vue.$refs[
                  `cartonNumForm${index}${data.activeNames[i]}`
                ][0].validate()
              );
            }
            if (
              vue.$refs &&
              vue.$refs[`attrForm${index}${data.activeNames[i]}`]
            ) {
              validateMethods.push(
                vue.$refs[
                  `attrForm${index}${data.activeNames[i]}`
                ][0].validate()
              );
            }
            if (
              vue.$refs &&
              vue.$refs[`ncasementNumForm${index}${data.activeNames[i]}`]
            ) {
              validateMethods.push(
                vue.$refs[
                  `ncasementNumForm${index}${data.activeNames[i]}`
                ][0].validate()
              );
            }
          });
        });
      });

      nextTick(() => {
        Promise.all(validateMethods)
          .then((res) => {
            let msg = JSON.parse(JSON.stringify(data.formItem));
            delete msg.result;
            msg.boxInfoVoList = [];
            for (let list of data.formItem.result) {
              msg.boxInfoVoList = msg.boxInfoVoList.concat(list.boxList);
            }
            if (!msg.boxInfoVoList.every(i => {
              return i.isEdit
            })) {
              let errMsg = '';
              for (let i = 0; i <= msg.boxInfoVoList.length - 1; i++) {
                if (!msg.boxInfoVoList[i].isEdit) {
                  errMsg += msg.boxInfoVoList[i].warehouse + '中' + msg.boxInfoVoList[i].cabinetNum + '中的箱子' + msg.boxInfoVoList[i].cartonNum + '<br/>'
                }
              }
              vue.$alert(errMsg + '以上数据校验失败，请确认后重新提交', '提交失败', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确认',
              }).then(() => {
                return false
              });
            } else {
              data.btnFlag = true;
              api.warehouse
                .checkAndSaveBoxInfo(msg)
                .then((res) => {
                  if (res.code == 200) {
                    vue.$message.success({
                      message: res.msg,
                      type: "success",
                    });
                    handleClose();
                    data.btnFlag = false;
                  } else {
                    vue
                      .$confirm(res.msg, "操作提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        buttonSize: "small"
                      })
                      .then(() => {
                        api.warehouse
                          .saveBoxInfo(msg)
                          .then((res) => {
                            if (res.code == 200) {
                              vue.$message.success({
                                message: res.msg,
                                type: "success",
                              });
                              handleClose();
                              data.btnFlag = false;
                            } else {
                              vue.$message.warning({
                                message: res.msg,
                                type: "warning",
                              });
                              data.btnFlag = false;
                            }
                          })
                          .catch((e) => {
                            data.btnFlag = false;
                          });
                      })
                      .catch(() => {
                        vue.$message({
                          type: "info",
                          message: "已取消",
                        });
                        data.btnFlag = false;
                      });
                  }
                })
                .catch((e) => {
                  data.btnFlag = false;
                });
            }

          })
          .catch((err) => {
            if (err) {
              vue.$message.error("表单填写有误,请检查");
            }
          });
      });
    };
    //打印条码
    const printClick = (row, type) => {
      let LODOP = getLodop();
      if (row.encasementNum > 0) {
        if (typeof LODOP == "string") {
          vue.$message.warning({
            dangerouslyUseHTMLString: true,
            message: LODOP,
          });
          return;
        }
        if (type == '4px') { //4px
          if (data.formItem.skuId && data.formItem.customerCode) {
            vue.$printFn(
              LODOP,
              [{
                sku: data.formItem.sku,
                num: row.encasementNum,
                productEname: data.formItem.productEname,
                skuId: data.formItem.skuId,
                customerCode: data.formItem.customerCode + '-' + data.formItem.sku
              }],
              "quartet"
            );
          } else {
            vue.$message.warning('递四方仓区没有对应SKU信息，异常SKU:' + data.formItem.sku)
          }
        } else {//谷仓
          vue.$printFn(
            LODOP,
            {
              sku: "200-" + data.formItem.sku,
              num: row.encasementNum,
              productEname: data.formItem.productEname,
            },
            "sku"
          );
        }


      } else {
        vue.$message.warning({
          message: "装箱数量不能小于1",
          type: "warning",
        });
      }
    };
    //单条打印
    const printCartonNum = (row) => {
      let LODOP = getLodop();
      if (row.cartonNum) {
        if (typeof LODOP == "string") {
          vue.$message.warning({
            dangerouslyUseHTMLString: true,
            message: LODOP,
          });
          return;
        }
        let datas = {
          cartonNum: row.cartonNum,
          encasementNum: row.encasementNum,
          num: 1,
          sku: "200-" + data.formItem.sku,
          warehouse:
            data.formItem.warehouseName.indexOf("TS") != -1
              ? row.warehouse + "-TS"
              : row.warehouse,
          cabinetNum: row.cabinetNum,
          drawback: data.formItem.drawback ? "是" : "-",
          isPhoto: data.formItem.photoStatus ? "【拍照】" : "",
        };
        vue.$printFn(LODOP, datas, "cartonNum");
      } else {
        vue.$message.warning({
          message: "箱号不能为空",
          type: "warning",
        });
      }
    };

    //打印全部箱号
    const printAllCartonNum = () => {
      if (data.formItem.boxInfoVoList.length < 1) {
        vue.$message.warning("暂无数据");
        return;
      }
      tableFormRef.value.validate((valid) => {
        if (valid) {
          data.btnFlag = true;
          let LODOP = getLodop();
          if (typeof LODOP == "string") {
            vue.$message.warning({
              dangerouslyUseHTMLString: true,
              message: LODOP,
            });
            return;
          }
          let arr = [];
          for (let list of data.formItem.result) {
            arr = arr.concat(list.boxList);
          }
          let datas = [];
          for (let item of arr) {
            let obj = {
              cartonNum: item.cartonNum,
              encasementNum: item.encasementNum,
              num: 1,
              sku: "200-" + data.formItem.sku,
              warehouse:
                data.formItem.warehouseName.indexOf("TS") != -1
                  ? item.warehouse + "-TS"
                  : item.warehouse,
              cabinetNum: item.cabinetNum,
              drawback: data.formItem.drawback ? "是" : "-",
              isPhoto: data.formItem.photoStatus ? "【拍照】" : "",
            };
            datas.push(obj);
          }
          vue.$printFn(LODOP, datas, "cartonNum");
          data.btnFlag = false;
        }
      });
    };

    //打印所有sku
    const printSkuAllClick = () => {
      if (data.formItem.boxInfoVoList.length < 1) {
        vue.$message.warning("暂无数据");
        return;
      }
      data.btnFlag = true;
      let LODOP = getLodop();
      if (typeof LODOP == "string") {
        vue.$message.warning({
          dangerouslyUseHTMLString: true,
          message: LODOP,
        });
        return;
      }
      let num4 = 0;//4px
      let num1 = 0;//谷仓
      for (let item of data.formItem.result) {
        if (item.headerAttribute == 3) {
          num4 += Number(item.receiptNum);
        } else if (item.headerAttribute == 1) {
          num1 += Number(item.receiptNum);
        }
      }
      nextTick(() => {
        if (num1 < 1 && num4 < 1) {
          data.btnFlag = false;
          return vue.$message.warning('请选择打印标签的类型！')
        }
        //谷仓
        if (num1 > 0) {
          vue.$printFn(
            LODOP,
            {
              sku: "200-" + data.formItem.sku,
              num: Number(num1),
              productEname: data.formItem.productEname,
            },
            "sku"
          );
        }
        //4px
        if (num4 > 0) {
          if (data.formItem.skuId && data.formItem.customerCode) {
            vue.$printFn(
              LODOP,
              [{
                sku: data.formItem.sku,
                num: Number(num4),
                productEname: data.formItem.productEname,
                skuId: data.formItem.skuId,
                customerCode: data.formItem.customerCode + '-' + data.formItem.sku
              }],
              "quartet"
            );
          } else {
            vue.$message.warning('递四方仓区没有对应SKU信息，异常SKU:' + data.formItem.sku)
          }
        }
        data.btnFlag = false;
      })
    };

    //当前箱子已经发起发货计划后禁止选择
    const checkSelectable = (row) => {
      return row.isAlter && row.casesStatus == 'not_listed' || row.isAlter && row.casesStatus == 'has_been_on'
    }

    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (list, dizKey) {
        if (list.length > 1 && dizKey !== -1) {
          for (let item of list) {
            if (dizKey == item.dizKey) {
              return item.value;
            }
          }
        }
      };
    });

    //校验打印数据
    const blurVerifyPrintData = (row) => {
      let vo = {
        cabinetNum: row.cabinetNum,
        cartonNum: row.cartonNum,
        casesStatus: row.casesStatus,
        encasementNum: row.encasementNum,
        height: row.height,
        width: row.width,
        length: row.length,
        warehouseId: row.warehouseId,
        serialNum: row.serialNum,
        cabinetAttribute: row.cabinetAttribute
      };
      api.warehouse.verifyPrintData(vo).then(res => {
        if (res.code == 200) {
          row.isEdit = true;
        } else {
          row.isEdit = false;
          vue.$message.warning(res.msg + ',请重新修改')
        }
      }).catch(() => { })
    };

    return {
      ...refData,
      handleClose,
      getMsg,
      allSubmit,
      tableFormRef,
      deleteRow,
      copyRow,
      printClick,
      printCartonNum,
      changeCasementNum,
      cartonNumChange,
      printAllCartonNum,
      printSkuAllClick,
      BatchModify,
      returnData,
      updateCabinetNumClick,
      handleCabinetNum,
      handleSelectionChange,
      checkSelectable,
      tableTypeComputed,
      blurVerifyPrintData,

    };
  },
};
</script>

<style scoped lang="scss">
#QualityInspectionPrint {

  .formItem {
    .el-form-item {
      width: 23%;

      .el-select,
      .el-input {
        width: 140px;
      }
    }
  }

  .el-dialog__footer {
    margin-top: 20px !important;
  }

  .collapse_title {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .left {
      color: #409eff;
    }

    .right {
      padding-right: 20px;
      color: #606266 !important;
    }
  }

  .el-table {
    margin-bottom: 0 !important;

    .cell {
      height: 100%;
    }
  }

  .color-red {
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
