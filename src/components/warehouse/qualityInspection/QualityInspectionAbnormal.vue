<!-- 质检异常 -->
<template>
  <div id="QualityInspectionAbnormal">
    <el-dialog title="反馈异常" v-model="dialogVisible" width="50%" :close-on-click-modal="false" :before-close="handleClose" :close-on-press-escape="false">
      <div v-for="(item, index) in productWarehouseDtoList" :key="index" class="form-border">
        <el-form :model="item" size="mini" :rules="rules" :ref="item.purchaseForm" label-width="140px" class="demo-ruleForm">
          <el-form-item label="异常数量:" prop="number">
            <el-input size="mini" v-model="item.number" clearable type="number"></el-input>
          </el-form-item>
          <el-form-item label="异常类型:" prop="abnormalType">
            <el-radio-group v-model="item.abnormalType">
              <el-radio-button v-for="items in warehouse_abnormal_type" :key="items.dizKey" :label="items.dizKey">{{ items.value }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="异常描述:" prop="context">
            <el-input size="mini" clearable type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容" v-model="item.context"></el-input>
          </el-form-item>
          <el-form-item label="异常图片:" prop="imageUrl" @click="changeImgIndex(index)">
            <UploadImage :ref="item.uploadImage" @clickFu="receive"></UploadImage>
          </el-form-item>
          <el-form-item class="del" v-if="index > 0">
            <el-button type="text" icon="el-icon-delete" size="mini" @click="del(item, index)">删 除</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" @click="handleClose">取 消</el-button>
          <el-button type="primary" size="mini" v-if="productWarehouseDtoList.length < 3" :disabled="btnFlag" :loading="btnFlag" @click="addAbnormal">新 增</el-button>
          <el-button type="primary" size="mini" :disabled="btnFlag" :loading="btnFlag" @click="allSubmit">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick, inject } from "vue";
import { localGet, localSet } from "@/utils/util";
export default {
  name: "QualityInspectionAbnormal",
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      productWarehouseDtoList: [
        {
          purchaseForm: "purchaseForm1",
          uploadImage: "uploadImage1",
        },
      ],
      imgIndex: 0,
      rules: {
        number: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              let ret = /^\+?[1-9]\d*$/;
              if (!ret.test(value)) {
                callback(new Error("请输入大于0的正整数"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        abnormalType: [{ required: true, message: "请选择", trigger: "change" }],
      },
      warehouse_abnormal_type: [], // 异常类型
      btnFlag: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    // 获取信息
    const getMsg = purchaseAbnormalListVo => {
      data.dialogVisible = true;
      data.warehouse_abnormal_type = localGet("purchaseDict") && localGet("purchaseDict").warehouse_abnormal_type ? localGet("purchaseDict").warehouse_abnormal_type : [];
      if (purchaseAbnormalListVo) {
        let purchaseAbnormalListVo1 = JSON.stringify(purchaseAbnormalListVo);
        purchaseAbnormalListVo1 = JSON.parse(purchaseAbnormalListVo1);
        data.productWarehouseDtoList = purchaseAbnormalListVo;
        for (let item of data.productWarehouseDtoList) {
          let file = {
            imgLimit: 9,
            fileList: [],
            pathName: "warehouseManagement/qualityInspection/img",
            isUpdate: true,
          };
          if (item.imageUrl && item.imageUrl.length > 0) {
            file.fileList = [];
            for (let pUrl of item.imageUrl) {
              let obj = {
                url: pUrl,
              };
              file.fileList.push(obj);
            }
            nextTick(() => {
              vue.$refs[item.uploadImage].getImgMsg(file);
            });
          } else {
            let file1 = {
              imgLimit: 9,
              fileList: [],
              pathName: "warehouseManagement/qualityInspection/img",
              isUpdate: true,
            };
            nextTick(() => {
              vue.$refs[item.uploadImage].getImgMsg(file1);
            });
          }
        }
      } else {
        nextTick(() => {
          let msg = {
            imgLimit: 9,
            fileList: [],
            pathName: "warehouseManagement/qualityInspection/img",
            isUpdate: true,
          };
          vue.$refs["uploadImage" + data.productWarehouseDtoList.length].getImgMsg(msg);
        });
      }
    };
    // 获取图片需要放置的位置
    const changeImgIndex = (index, name) => {
      data.imgIndex = index;
    };
    // 获取图片url
    const receive = e => {
      if (e.link) {
        let arr = [e.link];
        if (data.productWarehouseDtoList[data.imgIndex].imageUrl && data.productWarehouseDtoList[data.imgIndex].imageUrl.length > 0) {
          data.productWarehouseDtoList[data.imgIndex].imageUrl = [...data.productWarehouseDtoList[data.imgIndex].imageUrl].concat(arr);
        } else {
          data.productWarehouseDtoList[data.imgIndex].imageUrl = arr;
        }
      }
    };

    // 增加反馈
    const addAbnormal = () => {
      data.btnFlag = true;
      data.productWarehouseDtoList.push({
        purchaseForm: "purchaseForm" + (data.productWarehouseDtoList.length + 1),
        uploadImage: "uploadImage" + (data.productWarehouseDtoList.length + 1),
      });
      nextTick(() => {
        let msg = {
          imgLimit: 9,
          fileList: [],
          pathName: "warehouseManagement/qualityInspection/img",
          isUpdate: true,
        };
        nextTick(() => {
          vue.$refs["uploadImage" + data.productWarehouseDtoList.length].getImgMsg(msg);
        });
      });
      data.btnFlag = false;
    };

    // 删除反馈
    const del = (row, index) => {
      data.productWarehouseDtoList.map(item => {
        if (item.purchaseForm == row.purchaseForm && item.uploadImage == row.uploadImage) {
          data.productWarehouseDtoList.splice(index, 1);
        }
      });
    };

    // 验证全部表单
    const checkForm = arrName => {
      return new Promise((resolve, reject) => {
        vue.$refs[arrName].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
    };
    // 点击保存
    const allSubmit = () => {
      let list = [];
      Promise.all(list)
        .then(res => {
          let purchaseAbnormalListVomsg = {
            total: 0,
            purchaseabnormalType: [],
          };
          data.productWarehouseDtoList.map(item => {
            purchaseAbnormalListVomsg.total += Number(item.number);
            if (item.abnormalType !== "") {
              purchaseAbnormalListVomsg.purchaseabnormalType.push(item.abnormalType);
            }
          });
          let arr = purchaseAbnormalListVomsg.purchaseabnormalType;
          let flag = Array.from(new Set(purchaseAbnormalListVomsg.purchaseabnormalType)).length != arr.length;
          if (!flag) {
            vue.$parent.purchaseAbnormalListVo = data.productWarehouseDtoList;
            vue.$parent.purchaseAbnormalListVomsg = purchaseAbnormalListVomsg;
            handleClose();
          } else {
            vue.$message.warning("异常类型不能相同，请重新选择！");
          }
          // purchaseAbnormalListVomsg.purchaseabnormalType = new Set(purchaseAbnormalListVomsg.purchaseabnormalType);
          // purchaseAbnormalListVomsg.purchaseabnormalType = Array.from(purchaseAbnormalListVomsg.purchaseabnormalType);
          return;
        })
        .catch(err => {
          vue.$message.warning({
            message: "请填写正确数据信息",
            type: "warning",
          });
        });
    };

    // 关闭
    const handleClose = () => {
      for (let item of data.productWarehouseDtoList) {
        if (vue.$refs[item.purchaseForm]) {
          vue.$refs[item.purchaseForm].clearValidate();
          //   vue.$refs[item.purchaseForm].resetFields();
        }
        if (vue.$refs[item.uploadImage]) {
          vue.$refs[item.uploadImage].removeBefore();
        }
      }
      data.dialogVisible = false;
      data.productWarehouseDtoList = [
        {
          purchaseForm: "purchaseForm1",
          uploadImage: "uploadImage1",
        },
      ];
    };
    return {
      ...refData,
      getMsg,
      handleClose,
      receive,
      changeImgIndex,
      addAbnormal,
      allSubmit,
      del,
    };
  },
};
</script>
<style scoped lang='scss'>
#QualityInspectionAbnormal {
  .form-border {
    border-bottom: 1px solid #eee;
    padding-top: 20px;
  }
  .del {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
