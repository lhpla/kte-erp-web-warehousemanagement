<!-- TransferToTransfer 确认入库-中转调中转 -->
<template>
  <div id="TransferToTransfer">
    <el-dialog title="调拨单-入库" v-model="dialogVisible" width="95%" :close-on-click-modal="false" @close="closed"
      destroy-on-close :close-on-press-escape="false">
      <div class="TransferToTransfer_title">
        <span>调拨仓：{{ resInfo.startTransferWarehouse }}-{{ resInfo.startPurposeWarehouse
        }}-{{ resInfo.startTransportMode }} </span>
        <span>目的仓：{{ resInfo.endTransferWarehouse }}-{{ resInfo.endPurposeWarehouse }}-{{ resInfo.endTransportMode
        }}</span>
        <!-- <span>运输方式：{{海运}}</span> -->
      </div>
      <div class="TransferToTransfer_operation">
        <el-button type="primary" @click="changeCabinetNum" size="small" :disabled="btnLoading" :loading="btnLoading">
          <span>修改柜号</span>
          <el-tooltip class="item" effect="light" content="修改当前页被勾选的箱子柜号" placement="bottom">
            <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
          </el-tooltip>
        </el-button>
        <el-button type="primary" @click="changeAllCabinetNum" size="small" :disabled="btnLoading"
          :loading="btnLoading">
          <span>整单修改柜号</span>
          <el-tooltip class="item" effect="light" content="修改该调拨单所有入库箱子的柜号" placement="bottom">
            <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
          </el-tooltip>
        </el-button>
        <el-button type="primary" @click="changeAll" size="small" :disabled="btnLoading" :loading="btnLoading">
          <span>整单修改尺寸</span>
          <el-tooltip class="item" effect="light" content="修改调拨单所有入库箱子的尺寸" placement="bottom">
            <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
          </el-tooltip>
        </el-button>
      </div>

      <vxe-table :data="tableData" max-height="400" border @checkbox-all="selectChangeEvent"
        @checkbox-change="selectChangeEvent" :loading="tableLoading" :column-config="{ resizable: true }"
        row-class-name="className" cell-class-name="className">
        <vxe-column type="checkbox" width="50" align="center"></vxe-column>
        <vxe-column type="seq" title="NO." align="center" width="50"></vxe-column>
        <vxe-column field="sku" title="SKU" align="center">
          <template #default="{ row }">
            <span :class="{ red: row.redMsg }">{{ row.sku ? row.sku : '-' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="transferNum" title="调拨数量（PCS）" align="center" width="100">
          <template #default="{ row }">
            {{ row.transferNum ? row.transferNum : row.transferNum == 0 ? 0 : '-' }}
          </template>
        </vxe-column>
        <vxe-column field="startCabinetNum" title="调拨柜号" align="center" width="60">
          <template #default="{ row }">
            {{ row.startCabinetNum ? row.startCabinetNum : '-' }}
          </template>
        </vxe-column>
        <vxe-column field="startCartonNum" title="调拨箱号" align="center" width="60">
          <template #default="{ row }">
            {{ row.startCartonNum ? row.startCartonNum : '-' }}
          </template>
        </vxe-column>
        <vxe-column field="endCabinetNum" title="入库柜号" align="center">
          <template #default="{ row }">
            <div class="input_box">
              <span v-for="item in row.confirmDataVos" :key="item.id">
                <el-form :model="item" :rules="rules" :ref="`endCabinetNum_${item.id}`" style="display: flex;"
                  @submit.native.prevent>
                  <el-form-item prop="endCabinetNum">
                    <el-input v-model="item.endCabinetNum" clearable :disabled="true"
                      @clear="inputBlur(item.endCabinetNum, row, item.id, 'endCabinetNum')"
                      @blur="inputBlur(item.endCabinetNum, row, item.id, 'endCabinetNum')"></el-input>
                  </el-form-item>
                </el-form>
              </span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="endCartonNum" title="入库箱号" align="center">
          <template #header="{ row }">
            <span>入库箱号</span>
            <el-tooltip class="item" effect="light" content="当前为预箱号，确认入库后在详情中查看正式箱号" placement="bottom">
              <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
            </el-tooltip>
          </template>
          <template #default="{ row }">
            <div class="input_box">
              <span v-for="item in row.confirmDataVos" :key="item.id">
                <el-form :model="item" :rules="rules" :ref="`endCartonNum_${item.id}`" style="display: flex;"
                  @submit.native.prevent>
                  <el-form-item prop="endCartonNum">
                    <el-input v-model="item.endCartonNum" clearable
                      @clear="inputBlur(item.endCartonNum, row, item.id, 'endCartonNum')"
                      @blur="inputBlur(item.endCartonNum, row, item.id, 'endCartonNum')">
                    </el-input>
                  </el-form-item>
                </el-form>
              </span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="singleCartonCount" align="center">
          <template #header="{ row }">
            <span>单箱数量（PCS）</span>
            <el-tooltip class="item" effect="light" content="实收数量大于调拨数量可联系调拨仓补充建单" placement="bottom">
              <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
            </el-tooltip>
          </template>
          <template #default="{ row }">
            <div class="input_box">
              <span v-for="item in row.confirmDataVos" :key="item.id">
                <el-form :model="item" :rules="rules" :ref="`singleCartonCount_${item.id}`" style="display: flex;"
                  @submit.native.prevent>
                  <el-form-item prop="singleCartonCount">
                    <el-input v-model="item.singleCartonCount" clearable
                      @clear="inputBlur(item.singleCartonCount, row, item.id, 'singleCartonCount')"
                      @blur="inputBlur(item.singleCartonCount, row, item.id, 'singleCartonCount')">
                    </el-input>
                  </el-form-item>
                </el-form>
              </span>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="尺寸（cm）" align="center" width="300px">
          <template #default="{ row }">
            <div class="input_box">
              <span v-for="item in row.confirmDataVos" :key="item.id" style="display: flex;">
                <!-- 调拨柜号_调拨箱号_index -->
                <el-form :model="item" :rules="rules" :ref="`size_${item.id}`" style="display: flex;"
                  @submit.native.prevent>
                  <el-form-item prop="length">
                    <span> 长 </span><span>
                      <el-input v-model="item.length" style="width: 60px;"
                        @blur="inputBlur(item.length, row, item.id, 'length')"></el-input>
                    </span>
                  </el-form-item>
                  <el-form-item prop="width">
                    <span style="margin-left: 5px;"> 宽 </span><span>
                      <el-input v-model="item.width" style="width: 60px;"
                        @blur="inputBlur(item.width, row, item.id, 'width')"></el-input>
                    </span>
                  </el-form-item>
                  <el-form-item prop="height">
                    <span style="margin-left: 5px;"> 高 </span><span>
                      <el-input v-model="item.height" style="width: 60px;"
                        @blur="inputBlur(item.height, row, item.id, 'height')"></el-input>
                    </span>
                  </el-form-item>
                </el-form>
              </span>
            </div>
          </template>
        </vxe-column>
        <vxe-column align="center" width="80">
          <template #header="{ row }">
            <span>操作</span>
            <el-tooltip class="item" effect="light" content="可增加箱子或删除箱子" placement="bottom">
              <i class="el-icon-warning-outline" style="margin-left: 5px;"></i>
            </el-tooltip>
          </template>
          <template #default="{ row, rowIndex }">
            <div class="input_box">
              <span v-for="(item, i) in row.confirmDataVos" :key="item.id">
                <el-button @click="addRow(rowIndex)" size="small" type="primary" text v-if="i == 0">增 加</el-button>
                <el-button @click="delRow(rowIndex, item.id)" size="small" type="primary" text v-if="i != 0"
                  style="color:red ;">
                  删 除</el-button>
              </span>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
      <template #footer>
        <div class="paging">
          <div>
            <!-- 分页 -->
            <el-pagination background @size-change="handleSizeChangeFir" @current-change="handleCurrentChangeFir"
              :current-page="dataInfo.current" :page-sizes="[10, 25, 50, 100]" :page-size="dataInfo.size"
              layout="total, sizes, prev, pager, next, jumper" :total="dataInfo.total">
            </el-pagination>
          </div>

        </div>
        <span class="dialog-footer">
          <el-button @click="closed" size="small" :disabled="btnLoading" :loading="btnLoading">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="btnLoading" :loading="btnLoading" size="small">确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改柜号 -->
    <UpdateCabinetNum ref="UpdateCabinetNumRef"></UpdateCabinetNum>
    <!-- 整单修改尺寸 -->
    <ChangeAll ref="ChangeAllRef"></ChangeAll>
    <!-- 整单修改柜号 -->
    <BatchUpdateCabinetNum ref="BatchUpdateCabinetNumRef"></BatchUpdateCabinetNum>
    <AbnormalDialog ref="AbnormalDialogRef" @closed="closed"></AbnormalDialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, provide, nextTick, inject } from 'vue';
import UpdateCabinetNum from "./UpdateCabinetNum.vue"
import ChangeAll from "./ChangeAll.vue"
import BatchUpdateCabinetNum from './BatchUpdateCabinetNum.vue';
import AbnormalDialog from './AbnormalDialog.vue';
export default {
  name: 'TransferToTransfer',
  components: { UpdateCabinetNum, ChangeAll, BatchUpdateCabinetNum, AbnormalDialog },
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      transferCode: '',
      resInfo: {},
      tableData: [],
      initTableData: [],//原始数据
      btnLoading: false,
      tableLoading: false,
      selectList: [],
      changeList: [],//存放的被修改后的行数据
      dataInfo: {
        total: 0,
        size: 10,
        current: 1,
      },
      tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      },
      rules: {
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
        singleCartonCount: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              let ret = /^([0]|[1-9]\d*)$/;
              if (!ret.test(value)) {
                callback(new Error("非负整数"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          }
        ],
        endCartonNum: [
          { required: true, message: "请输入", trigger: "blur" },
          { pattern: /^[1-9][0-9]{0,5}$/, message: "格式错误", trigger: "blur" },
        ]
      },
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { })
    onMounted(() => { })
    //关闭弹窗
    const closed = () => {
      // vue.$refs.formRef.clearValidate()
      data.changeList = []
      data.transferCode = ''
      data.initTableData = []
      data.tableData = []
      data.selectList = []
      data.dialogVisible = false
      data.dataInfo = {
        total: 0,
        size: 10,
        current: 1,
      }
      data.tableInfo = {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      }
    }
    //重新获取数据时，需判断changeList中是否存在已被修改的数据，若存在，则将此条行数据替换为changeList中的数据
    const handleNewList = (NewTableData) => {
      console.log('data.changeList', data.changeList);
      data.tableData.map(NewTableRow => {
        const vo = data.changeList.find(changeRow => NewTableRow.key === changeRow.key)
        console.log('vo', vo);
        if (vo) {
          NewTableRow.confirmDataVos = JSON.parse(JSON.stringify(vo.confirmDataVos))//需确认是全部替换还是编辑的属性值全部替换
        }
      })
      console.log(data.tableData);
    }
    //获取数据
    const getMsg = (current) => {
      data.tableLoading = true;
      const info = ref({
        transferCode: data.transferCode,
        current: current ? current : 1,
        size: data.tableInfo.size,
      })
      api.requisitionManagement.getTransfeToTransfe(info.value).then(res => {
        if (res.code == 200) {
          data.dataInfo.total = res.data.total;
          data.dataInfo.size = res.data.size;
          data.dataInfo.current = res.data.current;
          data.tableInfo.size = res.data.size;
          data.tableInfo.current = res.data.current;
          data.tableData = res.data.records
          data.initTableData = JSON.parse(JSON.stringify(data.tableData))
          handleNewList(data.tableData)
        } else {
          vue.$message.warning(res.msg)
        }
        data.tableLoading = false;
      }).catch(() => {
        data.tableLoading = false;
      })
    };

    provide('getMsg', getMsg)
    //打开弹窗
    const openDialog = (row) => {
      data.transferCode = row.transferCode
      data.resInfo = row
      getMsg()
      data.dialogVisible = true
    }
    //保存当前数据
    const saveConfirm = (fun) => {
      if (data.changeList.length) {
        data.btnLoading = true;
        const confirmDataVos = ref([])
        data.changeList.map(v => {
          confirmDataVos.value.push(...v.confirmDataVos)
        })
        const info = {
          transferCode: data.transferCode,
          confirmDataVos: confirmDataVos.value
        }
        api.requisitionManagement.saveConfirm(info).then(res => {
          if (res.code == 200) {
            fun()
          } else {
            vue.$message.warning(res.msg)
          }
          data.btnLoading = false;
        }).catch(() => {
          data.btnLoading = false;
        })
      } else {
        fun()
      }
    }
    //修改柜号
    const changeCabinetNum = () => {
      if (data.selectList.length) {
        validateMethod(() => {
          saveConfirm(() => {
            vue.$refs.UpdateCabinetNumRef.openDialog(data.selectList, data.resInfo, data.transferCode);
          })
        })
      } else {
        vue.$message.warning(`请选择需修改柜号的数据`)
      }
    }
    const getTableData = inject("getTableData");
    //勾选事件
    const selectChangeEvent = (vo) => {
      data.selectList = vo.records
    }
    //整单修改柜号
    const changeAllCabinetNum = () => {
      validateMethod(() => {
        saveConfirm(() => {
          vue.$refs.BatchUpdateCabinetNumRef.openDialog(data.resInfo, data.transferCode);
        })
      })
    }
    //整单修改尺寸
    const changeAll = () => {
      validateMethod(() => {
        saveConfirm(() => {
          vue.$refs.ChangeAllRef.openDialog(data.transferCode);
        })
      })

    }
    //增加删除时，判断是否需要存入changeList中
    const handleAddOrDel = (rowIndex) => {
      handleRed(data.tableData[rowIndex])
      let changeRowIndex = data.changeList.findIndex(v => v.key == data.tableData[rowIndex].key)
      if (changeRowIndex == -1) {
        data.changeList.push(data.tableData[rowIndex])
      }
      console.log(data.changeList, '增加删除');
    }
    //添加某行数据某个箱子
    const addRow = (rowIndex) => {
      data.tableLoading = true;
      api.requisitionManagement.saveTransfeToTransfe({ id: data.tableData[rowIndex].confirmDataVos[0].id }).then(res => {
        if (res.code == 200) {
          let info = res.data
          info.singleCartonCount = info.singleCartonCount == -1 ? 0 : info.singleCartonCount
          data.tableData[rowIndex].confirmDataVos.push(info)
          data.changeList.map(changeRow => {
            if (changeRow.key === data.tableData[rowIndex].key) {
              const isItem = changeRow.confirmDataVos.find(v => v.id === info.id)
              if (!isItem) {
                changeRow.confirmDataVos.push(info)
              }
            }
          })
          console.log(data.tableData);
          handleAddOrDel(rowIndex)

        } else {
          vue.$message.warning(res.msg)
        }
        data.tableLoading = false;
      }).catch(() => {
        data.tableLoading = false;
      })
    }
    //删除某行数据某个箱子
    const delRow = (rowIndex, id) => {
      data.tableLoading = true;
      api.requisitionManagement.delTransfeToTransfe({ infoId: id, transferCode: data.transferCode }).then(res => {
        if (res.code == 200) {
          data.tableData[rowIndex].confirmDataVos.map((item, index) => {
            if (item.id == id) {
              data.tableData[rowIndex].confirmDataVos.splice(index, 1)
            }
          })
          handleAddOrDel(rowIndex)
        } else {
          vue.$message.warning(res.msg)
        }
        data.tableLoading = false;
      }).catch(() => {
        data.tableLoading = false;
      })
    }
    //input失去焦点后将该条数据与原始数据initTableData对比，若不相同则将其存放入修改数据changeList中（存放时需判断该条数据是否已存在,若存在，需更新值()；不存在，需放入）；若相同，不做处理
    //val:当前值；row:当前行数据；itemIndex:当前数据的index值；field：属性名
    const inputBlur = (val, row, id, field) => {
      //判断sku是否需要显红
      handleRed(row)

      let initRow = data.initTableData.find(v => v.key == row.key)
      if (initRow) {
        initRow.confirmDataVos.forEach(initItem => {
          if (initItem.id == id && initItem[field] != val) {
            let changeIndex = data.changeList.findIndex(v => v.key == row.key)
            if (changeIndex == -1) {
              data.changeList.push(row)
            } else {//可不用手动更新。因为值是双向绑定的
              data.changeList[changeIndex].confirmDataVos.map(changeItem => {
                if (changeItem.id == id) {
                  changeItem[field] = val
                }
              })
            }
          }
        })
      }
      console.log('失去焦点', data.changeList, 111);
    }
    //判断sku是否需要显红
    const handleRed = (row) => {
      let sub = ref(0)
      for (let j in row.confirmDataVos) {
        if (row.confirmDataVos[j].singleCartonCount) {
          sub.value = Number(row.confirmDataVos[j].singleCartonCount) + Number(sub.value)
        }
      }
      if (sub.value > row.transferNum) {
        row.redMsg = true
      } else {
        row.redMsg = false
      }
    }
    const validateMethods = ref([]);
    //点击统一处理按钮、翻页时都需做验证,successMethods成功后调用的方法
    const validateMethod = (successMethods) => {
      validateMethods.value = []
      data.tableData.forEach((row) => {
        row.confirmDataVos.forEach(item => {
          if (vue.$refs[`size_${item.id}`] && vue.$refs[`size_${item.id}`][0]) {
            validateMethods.value.push(
              vue.$refs[`size_${item.id}`][0].validate()
            );
          }
          if (vue.$refs[`singleCartonCount_${item.id}`] && vue.$refs[`singleCartonCount_${item.id}`][0]) {
            validateMethods.value.push(
              vue.$refs[`singleCartonCount_${item.id}`][0].validate()
            );
          }
          if (vue.$refs[`endCartonNum_${item.id}`] && vue.$refs[`endCartonNum_${item.id}`][0]) {
            validateMethods.value.push(
              vue.$refs[`endCartonNum_${item.id}`][0].validate()
            );
          }
          if (vue.$refs[`endCabinetNum_${item.id}`] && vue.$refs[`endCabinetNum_${item.id}`][0]) {
            validateMethods.value.push(
              vue.$refs[`endCabinetNum_${item.id}`][0].validate()
            );
          }
        })
      })
      Promise.all(validateMethods.value)
        .then(() => {//xx,xx调拨箱子的入库数量大于调拨数量，请检查装箱数量 xx,xx调拨箱子的入库数量小于调拨数量，是否继续入库
          const list = ref([])
          for (let i in data.tableData) {
            handleRed(data.tableData[i])
          }
          const isRed = data.tableData.find(row => row.redMsg === true)
          if (!isRed) {
            successMethods()
          } else {
            vue.$message.warning("入库数量不能大于装箱数量，红字已标识错误数据，请检查");
          }
        }).catch(() => {
          vue.$message.error("表单填写有误,请检查");
        })
    }
    //确定<!-- 调拨柜号_调拨箱号_index -->
    const onSubmit = () => {
      validateMethod(() => {
        data.btnLoading = true;
        const confirmDataVos = ref([])
        data.changeList.map(v => {
          confirmDataVos.value.push(...v.confirmDataVos)
        })
        const info = {
          transferCode: data.transferCode,
          confirmDataVos: confirmDataVos.value,
          flag: true
        }
        api.requisitionManagement.submitConfirm(info).then(res => {
          if (res.code == 200) {
            vue.$message.success(res.msg)
            getTableData();
            closed()
          } else if (res.code == 400) {
            nextTick(() => {
              vue.$refs.AbnormalDialogRef.openAbnormalDialog(res.data, data.transferCode)
            })
          } else {
            vue.$message.warning(res.msg)
          }
          data.btnLoading = false;
        }).catch(() => {
          data.btnLoading = false;
        })
      })
    }
    //handleCurrentChange  当前页发生变化
    const handleCurrentChangeFir = (val) => {
      validateMethod(() => {
        data.tableInfo.current = val;
        getMsg(data.tableInfo.current)
      })
    };

    //handleSizeChange 每页多少条发生了变化
    const handleSizeChangeFir = (val) => {
      data.tableInfo.size = val;
      getMsg()
    }
    const refData = toRefs(data);
    return {
      ...refData,
      closed,
      openDialog,
      onSubmit,
      addRow,
      delRow,
      changeCabinetNum,
      changeAllCabinetNum,
      changeAll,
      handleCurrentChangeFir,
      handleSizeChangeFir,
      selectChangeEvent,
      inputBlur
      // handleCabinetNum
    }
  }
};
</script>
<style  lang='scss'>
#TransferToTransfer {
  .TransferToTransfer_title {
    margin-bottom: 20px;

    span {
      font-size: 16px;
      margin-right: 30px;
    }
  }

  .TransferToTransfer_operation {
    margin-bottom: 20px;
  }

  .el-pagination {
    position: static;
  }

  .paging {
    margin: 20px 0;
    height: 50px;
    display: flex;
    justify-content: flex-end;
  }


  .input_box {
    display: flex;
    flex-direction: column;

    >span {
      border-top: 1px solid #eee;
      padding: 10px 15px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    >span:nth-child(1) {
      border-top: 0
    }
  }

  .red {
    color: red;
  }

  .className {
    max-height: none !important;
    padding: 0;
  }

  ::v-deep .vxe-body--column {
    // display: flex;
    padding: 0;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }
}
</style>
