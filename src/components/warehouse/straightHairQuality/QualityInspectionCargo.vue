<!-- 直发质检收货签收弹窗 -->
<template>
  <div id="QualityInspectionCargo">
    <el-dialog :title="'PO单：' + info.orderCode" v-model="dialogVisible" :close-on-click-modal="false" width="90%"
      :before-close="handleClose" :close-on-press-escape="false">
      <el-form :model="formItem" ref="tableFormRef" :inline="true" label-width="100px" class="demo-ruleForm formItem">
        <div class="label_item">
          <el-form-item label="SKU:">
            {{ formItem.sku ? formItem.sku : "-" }}
          </el-form-item>
          <el-form-item label="质检:">
            <span v-show="formItem.qualityTest !== ''">
              {{ formItem.qualityTest ? "是" : "否" }}
            </span>
            <span v-show="formItem.qualityTest === ''">-</span>
          </el-form-item>
          <el-form-item label="拍照:">
            <span v-show="formItem.isPhotograph !== ''">
              {{ formItem.isPhotograph ? "是" : "否" }}
            </span>
            <span v-show="formItem.isPhotograph === ''">-</span>
          </el-form-item>
          <el-form-item label="采购员:">
            {{ formItem.buyer ? formItem.buyer : "-" }}
          </el-form-item>
        </div>
        <div class="label_item">
          <el-form-item label="签收人:">
            {{ formItem.signerName ? formItem.signerName : "-" }}
          </el-form-item>

          <el-form-item label="采购数量:">
            {{ formItem.skuNumber ? formItem.skuNumber : "0" }}
          </el-form-item>
          <el-form-item label="收货总数量:" prop="receiptQuantity">
            <el-input v-model="formItem.receiptQuantity" clearable disabled placeholder="收货总数量"></el-input>
          </el-form-item>
          <el-form-item label="可收货数量:">
            {{ formItem.number ? formItem.number : "0" }}<el-tooltip class="item" effect="light"
              content="对应物流号可收货的SKU数量">
              <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
            </el-tooltip>
          </el-form-item>
        </div>

        <div v-show="formItem.qualityTest == true">
          <div>
            <el-form-item label="包含电池:">
              <span v-show="formItem.isCell && formItem.isCell !== ''">
                {{ formItem.isCell ? "是" : "否" }}
              </span>
              <span v-show="formItem.isCell === ''">-</span>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="质检标准:" class="imageUrl">
              <span v-show="formItem.warehouseQualityTestInfoVos && formItem.warehouseQualityTestInfoVos.length > 0">
                <span v-for="item in formItem.warehouseQualityTestInfoVos" :key="item.testProgram">
                  <div>{{ item.testProgram + " : " + item.testExplain }}</div>
                </span>
              </span>
              <span
                v-show="formItem.warehouseQualityTestInfoVos && formItem.warehouseQualityTestInfoVos.length <= 0">-</span>
            </el-form-item>
          </div>

          <div>
            <el-form-item label="上传图片:" prop="qualityImageUrl" class="imageUrl">
              <UploadImage ref="UploadImage1" @clickFu="receive"></UploadImage>
            </el-form-item>
          </div>
        </div>
        <el-table :data="formItem.productWarehouseDtoList" border style="width: 100%" default-expand-all
          :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }">
          <el-table-column type="expand">
            <template #default="scope">
              <div style="color: red; margin-bottom: 15px">请正确填写“收货入库数量”，如填写错误会直接影响库存，无法追溯原因</div>
              <el-table :id="`abnormalVos${scope.$index == 0 ? scope.$index : scope.$index - 1}`"
                :data="scope.row.abnormalVos" border style="width: 100%"
                :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }">
                <el-table-column label="异常数量">
                  <template #default="{ row }">
                    <el-form-item label="">
                      <el-input clearable v-model="row.abnormalNum" @blur="numChange(row.abnormalNum)"
                        style="width: 90px"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="异常类型">
                  <template #default="{ row }">
                    <el-form-item label="">
                      <el-select v-model="row.abnormalType" filterable clearable placeholder="请选择"
                        @change="abnormalTypeChange(row, scope.row.abnormalVos)">
                        <el-option v-for="item in abnormal_new_type" :key="item.dizKey" :label="item.value"
                          :value="item.dizKey"></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="异常描述" prop="abnormalContext">
                  <template #default="{ row }">
                    <el-form-item label="" prop="abnormalContext">
                      <el-input clearable type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容"
                        v-model="row.abnormalContext" style="width: 200px"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="异常图片" prop="abnormalImg" width="130px">
                  <template #default="{ row, $index }">
                    <UploadImage class="UploadImage" v-if="row.abnormalImgList && !row.abnormalImgList.length"
                      ref="UploadImageRef" @clickFu="abnormalReceive($event, $index, scope.$index)"></UploadImage>
                    <span v-show="row.abnormalImgList && row.abnormalImgList.length">
                      <i class="el-icon-circle-close filebadge" type="primary"
                        @click="removeImg($index, scope.$index)"></i>
                      <el-image @click="viewAbnormalPicture(row.abnormalImgList[0].url)"
                        :src="row.abnormalImgList[0] ? row.abnormalImgList[0].url : ''"
                        style="width: 70px; height: 70px; object-fit: contain">
                      </el-image>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="{ $index }">
                    <el-button size="small" type="primary" text
                      @click="addList(scope.row.abnormalVos, $index, scope.$index)">新 增
                    </el-button>
                    <el-button v-show="$index > 0" size="small" type="primary" text
                      @click="delList(scope.row.abnormalVos, $index, scope.$index)">删 除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="transferWarehouse" label="中转仓"></el-table-column>
          <el-table-column label="仓区" prop="warehouse"></el-table-column>
          <el-table-column label="运输方式" prop="transportMode"></el-table-column>
          <el-table-column label="采购单数量" prop="purSkuNum" v-show="!isSecondary"></el-table-column>
          <el-table-column label="异常数量" v-show="isSecondary">
            <template #default>
              {{ abnormalNum }}
            </template>
          </el-table-column>
          <el-table-column label="可收货数量" prop="num">
            <template #header>
              <div style="display: flex; align-items:center">
                <span>可收货数量</span>
                <el-tooltip class="item" effect="light" content="对应物流号可收货的SKU数量">
                  <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              {{ row.num }}
            </template>
          </el-table-column>
          <el-table-column label="收货入库数量">
            <template #default="{ row, $index }">
              <el-form-item label="">
                <el-input clearable v-model="row.receiptNum" @blur="changeReceiptNum(row.receiptNum, row.num, $index)"
                  style="width: 90px"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="装箱数">
            <template #default="{ row }">
              <el-form-item label="">
                <el-input clearable v-model="row.boxNum" style="width: 90px"
                  @change="boxNumChange(row.receiptNum, row.boxNum, row)"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="库位">
            <template #default="{ row, $index }">
              <el-form-item label="">
                <el-select v-model="row.warehouseLocation" class="width-240" filterable clearable>
                  <el-option v-for="item in row.locationList" :key="item.storageLocation" :label="item.storageLocation"
                    :value="item.storageLocation"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="handleClose">取 消</el-button>
          <el-button type="primary" size="small" :disabled="btnFlag" :loading="btnFlag" @click="submit">保 存</el-button>
        </span>
      </template>
    </el-dialog>
    <QualityInspectionMore ref="QualityInspectionMore"></QualityInspectionMore>
    <!-- 异常图片预览 -->
    <el-dialog v-model="isAbnormalPictures" :close-on-click-modal="false" @click="closeAbnormalPicture" destroy-on-close
      :close-on-press-escape="false">
      <div style="width: 100%; height: 100%">
        <el-image style="width: 100%; height: 100%" :src="abnormalPicture" fit="contain" alt=""></el-image>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick, computed, inject } from "vue";
import QualityInspectionMore from "../qualityInspection/QualityInspectionMore.vue";
import { localGet } from "@/utils/util";
import { message } from "@/utils/resetMessage";
export default {
  name: "QualityInspectionCargo",
  props: {
    activeTag: {
      type: String,
      default: ""
    }
  },
  components: { QualityInspectionMore },
  setup(prop, ctx) {
    const data = reactive({
      isAbnormalPictures: false,
      abnormalPicture: "",
      dialogVisible: false,
      formItem: {
        imageUrl: "",
        productWarehouseDtoList: [],
      },
      info: {},
      btnFlag: false,
      purchaseAbnormalListVo: "",
      abnormal_new_type: [], // 异常类型
      purchaseAbnormalListVomsg: {
        total: 0,
      },
      flag: true,
      fatIndex: 0,
      index: 0,
      isSecondary: false, //是否二次收货
      abnormalNum: "", //异常二次入库 异常数量
      abnormalId: "", //异常二次入库 异常id
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const UploadImage1 = ref(null);
    const UploadImageRef = ref(null)
    const refData = toRefs(data);

    // 获取信息
    const getMsg = (row, msg) => {
      data.isSecondary = msg.isSecondary;
      data.abnormalNum = msg.abnormalNum && msg.abnormalNum != 0 ? msg.abnormalNum : 0;
      data.abnormalId = msg.abnormalId ? msg.abnormalId : 0;
      let obj = {
        logisticsNum: msg.logisticsNum[0],
        orderCode: msg.orderCode,
        sku: row.sku,
        productId: row.id,
        abnormalId: msg.abnormalId ? msg.abnormalId : "",
      };

      api.warehouse.getQualityProductInfo(obj).then(res => {
        if (res.code == 200) {
          data.dialogVisible = true;
          data.formItem = res.data;
          data.formItem.productWarehouseDtoList.map((item, index) => {
            item.receiptNum = "";
            item.boxNum = "";
            item.locationList = [];
            item.transferWarehouseId = data.formItem.warehouseId;
            item.transferWarehouse = data.formItem.warehouseName;
            item.abnormalVos = [
              {
                abnormalContext: "",
                abnormalImg: [],
                abnormalImgList: [],
                abnormalNum: 0,
                abnormalType: "",
              },
            ];
          });
          if (data.formItem.qualityTest == true) {
            nextTick(() => {
              let msg = {
                imgLimit: 9,
                fileList: [],
                pathName: "warehouseManagement/qualityInspection/img",
                isUpdate: true,
              };
              UploadImage1.value.getImgMsg(msg);
            });
          }

          data.formItem.productWarehouseDtoList.map((item, index) => {
            if (item.warehouseId) {
              api.warehouse.getLocationDetail({ warehouseId: item.warehouseId, sku: data.formItem.sku }).then(res => {
                if (res.code == 200) {
                  data.formItem.productWarehouseDtoList[index].locationList = res.data;
                  if (res.data.length) {
                    res.data.map(i => {
                      if (i.isRecommendedLocation && i.isRecommendedLocation === true) {
                        data.formItem.productWarehouseDtoList[index].warehouseLocation = i.storageLocation
                      }
                    })
                  }
                }
              })
            }
          })
        } else {
          vue.$message.warning({
            message: res.msg,
            type: "warning",
          });
        }
      });
      data.purchaseAbnormalListVomsg = {
        total: 0,
      };
      data.purchaseAbnormalListVo = "";
      data.info = msg;
      data.abnormal_new_type = localGet("purchaseDict") && localGet("purchaseDict").abnormal_new_type ? localGet("purchaseDict").abnormal_new_type : [];
    };

    // 获取图片url
    const receive = e => {
      if (e.name) {
        let arr = [e.name];
        if (data.formItem.qualityImageUrl && data.formItem.qualityImageUrl.length > 0) {
          data.formItem.qualityImageUrl = [...data.formItem.qualityImageUrl].concat(arr);
        } else {
          data.formItem.qualityImageUrl = arr;
        }
      }
    };

    const tableFormRef = ref(null);
    const sendkeybtn = inject("sendkeybtn");

    //校验数据
    const checkNumRulse = () => {
      for (let item of data.formItem.productWarehouseDtoList) {
        if (item.receiptNum) {
          //校验收货数量
          let ret = /^([0-9]*)$/;
          if (!ret.test(item.receiptNum)) {
            message.warning("请输入收货数量");
            data.flag = false;
            return;
          } else {
            if (item.boxNum || item.boxNum == 0) {
              //校验箱号
              boxNumChange(item.receiptNum, item.boxNum, item);
            } else {
              message.warning("请输入装箱数");
              data.flag = false;
              return;
            }
            for (let ite of item.abnormalVos) {
              // 校验异常数量
              numChange(ite.abnormalNum);
              //校验异常类型
              abnormalTypeChange(ite, item.abnormalVos);
            }
          }
        } else {
          message.warning("请输入收货数量");
          data.flag = false;
          return;
        }
      }
    };

    // 保存
    const submit = () => {
      checkNumRulse();
      if (data.flag) {
        data.btnFlag = true;
        for (let item of data.formItem.productWarehouseDtoList) {
          item.purposeWarehouse = item.warehouse;
          item.purposeWarehouseId = item.warehouseId;
          // let num = 0;
          for (let ite of item.abnormalVos) {
            if (ite.abnormalNum == "") {
              ite.abnormalNum = "0";
            }
            //   num += Number(ite.abnormalNum);
            // }
            // num += Number(item.receiptNum);
            // if (!data.isSecondary) {
            //   if (num < item.num) {
            //     message.warning("请检查输入数据是否正确");
            //     data.flag = false;
            //     data.btnFlag = false;
            //     return;
            //   }
            // } else {
            //   if (num < data.abnormalNum) {
            //     message.warning("请检查输入数据是否正确");
            //     data.flag = false;
            //     data.btnFlag = false;
            //     return;
            //   }
          }

          //如果存在少货异常  进行异常数量总和+收货数量 = 采购数量/上次异常数量
          let num = item.receiptNum ? Number(item.receiptNum) : 0;
          if (item.abnormalVos.some(itemK => {
            return itemK.abnormalType == 'less_goods'
          })) {
            for (let ite of item.abnormalVos) {
              num += Number(ite.abnormalNum);
            }
            console.log(num);
            if (data.isSecondary) {
              if (num != data.abnormalNum) {
                data.flag = false;
                data.btnFlag = false;
                vue.$message.warning("请检查数量是否填写正确");
                return;
              }
            } else {
              if (num != item.purSkuNum) {
                data.flag = false;
                data.btnFlag = false;
                vue.$message.warning("请检查数量是否填写正确");
                return;
              }
            }
          }

          if (item.receiptNum === "") {
            vue.$message.warning("请填写收货数量！");
            data.flag = false;
            data.btnFlag = false;
            return;
          }
          if (item.boxNum === "") {
            vue.$message.warning("请填写装箱数量！");
            data.flag = false;
            data.btnFlag = false;
            return;
          }
          if (item.warehouseLocation === "" || item.warehouseLocation === undefined) {
            vue.$message.warning("请填写库位");
            data.flag = false;
            data.btnFlag = false;
            return;
          }
        }
        let msg = {
          buyerId: data.formItem.buyerId,
          orderCode: data.info.orderCode,
          productId: data.info.productId,
          productWarehouseVos: data.formItem.productWarehouseDtoList,
          qualifiedQuantity: data.formItem.receiptQuantity ? data.formItem.receiptQuantity : 0,
          qualityImageUrl: data.formItem.qualityImageUrl && data.formItem.qualityImageUrl.length > 0 ? data.formItem.qualityImageUrl : [],
          receiptQuantity: data.formItem.receiptQuantity ? data.formItem.receiptQuantity : 0,
          sku: data.formItem.sku,
          unqualifiedQuantity: data.purchaseAbnormalListVomsg.total ? Number(data.purchaseAbnormalListVomsg.total) : 0,
          warehouseName: data.formItem.warehouseName,
          warehouseId: data.formItem.warehouseId,
          number: Number(data.formItem.number),
          logisticsNum: data.info.logisticsNum[0],
          qualityTest: data.formItem.qualityTest,
          isDirect: data.formItem.isDirect,
          abnormalJudgment: false,
          abnormalId: "",
        };

        if (data.isSecondary) {
          msg.abnormalJudgment = true;
          msg.abnormalId = data.abnormalId;
        }
        api.warehouse
          .saveQuality(msg)
          .then(res => {
            if (res.code == 200) {
              vue.$message.success({
                message: res.msg,
                type: "success",
              });
              handleClose();
              sendkeybtn('', '', vue.$props.activeTag);
              data.btnFlag = false;
            } else {
              vue.$message.warning({
                message: res.msg,
                type: "warning",
              });
              data.btnFlag = false;
            }
          })
          .catch(() => {
            data.btnFlag = false;
          });
      }
    };
    // 关闭弹窗
    const handleClose = () => {
      data.dialogVisible = false;
      tableFormRef.value.clearValidate();
      tableFormRef.value.resetFields();
    };
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

    // 收货数量
    const changeReceiptNum = (num, total, index) => {
      //正常收货验证字段
      if (!data.isSecondary) {
        index = index == 0 ? index : (index = 1);
        if (num || num == 0) {
          let ret = /^([0-9]*)$/;
          if (!ret.test(num)) {
            message.warning("收货数量为正整数");
          } else {
            // if (num > total) {
            //   message.warning("请输入正确收货数量");
            //   data.formItem.productWarehouseDtoList[index].receiptNum = total;
            // }
            data.formItem.receiptQuantity = 0;
            for (let item of data.formItem.productWarehouseDtoList) {
              data.formItem.receiptQuantity += Number(item.receiptNum);
            }
            if (num == 0) {
              data.formItem.productWarehouseDtoList[index].boxNum = 0;
            }
          }
        } else {
          message.warning("请输入");
        }
      } else {
        //异常二次入库验证 字段
        if (num || num == 0) {
          let ret = /^([0-9]*)$/;
          if (!ret.test(num)) {
            message.warning("收货数量为正整数");
          } else {
            // if (num > data.abnormalNum) {
            //   message.warning("请输入正确收货数量");
            //   data.formItem.productWarehouseDtoList[index].receiptNum = data.abnormalNum;
            // }
            data.formItem.receiptQuantity = 0;
            for (let item of data.formItem.productWarehouseDtoList) {
              data.formItem.receiptQuantity += Number(item.receiptNum);
            }
            if (num == 0) {
              data.formItem.productWarehouseDtoList[index].boxNum = 0;
            }
          }
        } else {
          message.warning("请输入");
        }
      }
    };

    //校验装箱数量不能大于收货数量
    const boxNumChange = (receiptNum, boxNum, row) => {
      if (boxNum && receiptNum > 0) {
        let ret = /^\+?[1-9]\d*$/;
        if (!ret.test(boxNum)) {
          message.warning("装箱数量为正整数");
          data.flag = false;
          return;
        } else {
          if (Number(boxNum) > Number(receiptNum)) {
            message.warning("装箱数量不能大于收货数量");
            row.boxNum = "";
            data.flag = false;
            return;
          } else {
            data.flag = true;
          }
        }
      } else if (boxNum && receiptNum == 0) {
        let ret = /^([0-9]*)$/;
        if (!ret.test(boxNum)) {
          message.warning("装箱为正整数");
          data.flag = false;
          return;
        } else {
          if (Number(boxNum) > Number(receiptNum)) {
            message.warning("装箱数量不能大于收货数量");
            row.boxNum = "";
            data.flag = false;
            return;
          } else {
            data.flag = true;
          }
        }
      } else {
        data.flag = false;
        return;
      }
    };

    //判断数据是否正确
    const numChange = abnormalNum => {
      if (abnormalNum || abnormalNum == 0) {
        let ret = /^([0-9]*)$/;
        if (!ret.test(abnormalNum)) {
          message.warning("异常数量为正整数");
          data.flag = false;
          return;
        } else {
          data.flag = true;
        }
      } else {
        message.warning("请输入异常数量");
        data.flag = false;
        return;
      }
    };

    //类型判断是否选择
    const abnormalTypeChange = (rows, list) => {
      if (rows.abnormalNum > 0 && !rows.abnormalType) {
        message.warning("请选择异常类型");
        data.flag = false;
        return;
      } else {
        data.flag = true;
        let num = 0;
        for (let item of list) {
          if (item.abnormalType == rows.abnormalType) {
            num++;
            if (num > 1) {
              item.abnormalType = "";
              message.warning("异常类型不可重复！");
              data.flag = false;
              return;
            } else {
              data.flag = true;
            }
          }
        }
      }
    };

    //新增异常
    const addList = (list, i, k) => {
      if (list.length < 3) {
        list.push({ abnormalContext: "", abnormalImg: [], abnormalImgList: [], abnormalNum: 0, abnormalType: "" });
      } else {
        vue.$message.warning("最多只能添加三条异常，多货异常与少货异常不能共存！");
      }
    };

    //删除异常
    const delList = (list, index, fatIndex) => {
      list.splice(index, 1);
    };

    // 获取图片url
    const abnormalReceive = (e, i, k) => {
      data.formItem.productWarehouseDtoList[k].abnormalVos[i].abnormalImgList.push({ url: e.link });
      data.formItem.productWarehouseDtoList[k].abnormalVos[i].abnormalImg.push(e.link);
    };

    //删除异常图片
    const removeImg = (i, k) => {
      data.formItem.productWarehouseDtoList[k].abnormalVos[i].abnormalImgList = [];
    };

    //预览异常图片
    const viewAbnormalPicture = e => {
      data.isAbnormalPictures = true;
      data.abnormalPicture = e;
    };

    //关闭预览异常图片
    const closeAbnormalPicture = () => {
      data.isAbnormalPictures = false;
      data.abnormalPicture = "";
    };

    return {
      ...refData,
      getMsg,
      handleClose,
      receive,
      UploadImage1,
      submit,
      tableTypeComputed,
      tableFormRef,
      changeReceiptNum,
      sendkeybtn,
      boxNumChange,
      numChange,
      abnormalTypeChange,
      addList,
      delList,
      abnormalReceive,
      removeImg,
      viewAbnormalPicture,
      closeAbnormalPicture,
      UploadImageRef
    };
  },
};
</script>
<style scoped lang="scss">
#QualityInspectionCargo {
  .formItem {
    .label_item {
      display: flex;

      .el-form-item {
        width: 24%;
      }
    }
  }

  .formItem {
    .el-form-item {
      // width: 24%;

      .el-select,
      .el-input {
        width: 100px !important;
      }
    }

    .imageUrl {
      width: 100%;
    }

    .filebadge {
      position: relative;
      right: -75px;
      color: rgb(64 158 255);
      font-size: 18px;
      top: -50px;
      z-index: 10;
    }
  }

  .tags-class {
    margin-bottom: 10px;
  }

  .el-table {
    margin-bottom: 0px !important;
  }
}
</style>
