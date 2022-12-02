<!-- 单证资料维护 -->
<template>
  <div id="DataMaintenance">
    <el-dialog title="资料维护" width="70%" v-model="maintenanceVisible" :close-on-click-modal="false" @close="closeFile"
      destroy-on-close :close-on-press-escape="false">
      <el-tabs v-model="activeName">
        <el-tab-pane label="报关资料" name="declare">
          <div v-if="formData.declare">
            <div class="padding">
              仅支持上传jpg、png、pdf格式文件，单个文件不能超过5M，限制上传5份。
            </div>
            <div>
              <div v-for="(item, index) of formData.declare" :key="index">
                <div class="flex">
                  <div class="doc-title">
                    {{ item.company }}
                  </div>
                  <div class="doc-title">
                    <el-button type="primary"  size="small" :loading="btnFlag" :disabled="btnFlag"
                      v-if="item.audit !== 'auditing' && item.audit !== 'audit_pass' && item.declareFalg"
                      @click="save(item)">保存
                    </el-button>
                    <el-button type="primary"  size="small" v-if="item.audit == 'auditing'">审核中
                    </el-button>
                    <el-button v-if="item.audit == 'audit_not_pass'" type="primary"  size="small" :loading="btnFlag"
                      @click="auditWaring(item, 'pop')"> 审核失败
                    </el-button>
                    <el-button type="primary"  size="small" :loading="btnFlag"
                      v-if="item.audit !== 'auditing' && item.audit !== 'audit_not_pass' && item.audit !== 'audit_pass'"
                      :disabled="btnFlag || item.audit == 'auditing' || item.audit == 'audit_pass'"
                      @click="submitAudit(item)"> 提交审核</el-button>
                    <el-button type="primary"  size="small" v-if="item.audit == 'audit_pass'"> 审核成功
                    </el-button>
                  </div>
                </div>
                <div class="as-around">
                  <div class="as-margin-top">
                    <DocmentFileUpload @pushFile="pushFile($event, item.id, 'baseFile', 'declare', index)"
                      @removeFileBook="removeFileBook($event, item.id, 'baseFile', 'declare', index)"
                      :ref="item.id + 'baseFileUpload'" title="报关底单" :audit="item.audit">
                    </DocmentFileUpload>
                  </div>
                  <div class="as-margin-top">
                    <DocmentFileUpload @pushFile="pushFile($event, item.id, 'ladingFile', 'declare', index)"
                      @removeFileBook="removeFileBook($event, item.id, 'ladingFile', 'declare', index)"
                      :ref="item.id + 'ladingFileUpload'" title="提单" :audit="item.audit">
                    </DocmentFileUpload>
                  </div>
                  <div class="as-margin-top">
                    <DocmentFileUpload @pushFile="pushFile($event, item.id, 'otherFile', 'declare', index)"
                      @removeFileBook="removeFileBook($event, item.id, 'otherFile', 'declare', index)"
                      :ref="item.id + 'otherFileUpload'" title="其他资料" :audit="item.audit">
                    </DocmentFileUpload>
                  </div>
                </div>
                <el-divider></el-divider>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="清关资料" name="clearance">
          <div v-if="formData.clearance">
            <div>
              实际清关发票仅支持上传EXCELI格式文件限制上传1份、税金底单仅支持上传pdf格式限制上传10份。
            </div>
            <span v-for="(item, index) of formData.clearance" :key="index">
              <div class="flex">
                <div class="doc-title">清关资料：</div>
                <div class="doc-title">
                  <el-button type="primary"  size="small" v-if="clearanceFalg" :loading="btnFlag" :disabled="btnFlag"
                    @click="saveClearance(item)">
                    保存</el-button>
                </div>
              </div>
              <div class="as-margin-top as-around">
                <DocmentPdfUpload @pushFile="pushFileClearance($event, 'actualInvoiceFile', 'clearance')"
                  @removeFileBook="removeFileBookClearance($event, 'actualInvoiceFile', 'clearance')"
                  ref="actualInvoiceFileUpload" :isPdf="false" :limit="1" title="实际清关发票">
                </DocmentPdfUpload>
                <DocmentPdfUpload @pushFile="pushFileClearance($event, 'taxBaseFile', 'clearance')"
                  @removeFileBook="removeFileBookClearance($event, 'taxBaseFile', 'clearance')" ref="taxBaseFileUpload"
                  :isPdf="true" :limit="10" title="税金底单">
                </DocmentPdfUpload>
              </div>
            </span>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog title="审核结果" v-model="dialogVisible" width="40%" destroy-on-close :close-on-press-escape="false">
      <div class="flex-pop">
        <div class="left-label">
          审核失败：
        </div>
        <div class="left-auditRemark">
          <p>{{ auditRemarkItem.auditRemark }}</p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="auditWaring(auditRemarkItem, 'save')"  size="small">重新提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick } from "vue";
import DocmentFileUpload from "./DocmentFileUpload.vue";
import DocmentPdfUpload from "./DocmentPdfUpload.vue";
export default {
  name: "DataMaintenance",
  components: { DocmentFileUpload, DocmentPdfUpload },
  setup(prop, ctx) {
    const data = reactive({
      maintenanceVisible: false,
      formData: {
        shippingId: '',
        declare: [],
        clearance: [],
      },
      btnFlag: false,
      activeName: 'declare',
      clearanceFalg: false,//清关按钮显示与隐藏
      auditRemarkItem: {},
      dialogVisible: false
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const refData = toRefs(data);
    const getMsg = row => {
      data.clearanceFalg = false
      data.maintenanceVisible = true;
      data.formData.shippingId = row.shippingId
      getFile(data.formData.shippingId)
    };

    //获取文件详情
    const getFile = (shippingId) => {
      api.documentList.getFile({ shippingId: shippingId }).then(res => {
        if (res.code == 200) {
          data.formData = res.data
          for (let item of data.formData.declare) {
            item.declareFalg = false
            let name = item.id + 'otherFileUpload'
            let name1 = item.id + 'baseFileUpload'
            let name2 = item.id + 'ladingFileUpload'
            nextTick(() => {
              if (vue.$refs[name] && item.otherFile.length > 0) {
                vue.$refs[name][0].getFileList(item.otherFile);
              }
              if (vue.$refs[name1] && item.baseFile.length > 0) {
                vue.$refs[name1][0].getFileList(item.baseFile);
              }
              if (vue.$refs[name2] && item.ladingFile.length > 0) {
                vue.$refs[name2][0].getFileList(item.ladingFile);
              }
            });
          }
          for (let item of data.formData.clearance) {
            nextTick(() => {
              if (vue.$refs.actualInvoiceFileUpload && item.actualInvoiceFile.length > 0) {
                vue.$refs.actualInvoiceFileUpload[0].getFileList(item.actualInvoiceFile);
              }
              if (vue.$refs.taxBaseFileUpload && item.taxBaseFile.length > 0) {
                vue.$refs.taxBaseFileUpload[0].getFileList(item.taxBaseFile);
              }
            });
          }
        }
      })
    }

    // 文件上传
    const pushFile = (e, id, fileName, fatherObj, index) => {
      if (e && e.length > 0) {
        let arr = [];
        e.map((item) => {
          let msg = JSON.parse(JSON.stringify(item))
          arr.push(msg);
        });
        for (let ite of data.formData[fatherObj]) {
          if (id == ite.id) {
            ite.declareFalg = true
            data.formData[fatherObj][index][fileName] = arr
          }
        }
      }
    };
    //清关文件上传
    const pushFileClearance = (e, fileName, fatherObj) => {
      if (e && e.length > 0) {
        let arr = [];
        e.map((item) => {
          let msg = JSON.parse(JSON.stringify(item))
          arr.push(msg);
        });
        for (let ite of data.formData[fatherObj]) {
          data.clearanceFalg = true
          data.formData[fatherObj][0][fileName] = arr
        }
      }
    }
    //清关删除文件
    const removeFileBookClearance = (e, fileName, fatherObj) => {
      data.clearanceFalg = true
      if (e && e.length > 0) {
        let arr = [];
        e.map((item) => {
          let msg = JSON.parse(JSON.stringify(item))
          arr.push(msg);
        });
        for (let ite of data.formData[fatherObj]) {

          data.formData[fatherObj][0][fileName] = arr
        }
      } else {

        data.formData[fatherObj][0][fileName] = []
      }
    }


    // 文件删除
    const removeFileBook = (e, id, fileName, fatherObj, index) => {
      if (e && e.length > 0) {
        let arr = [];
        e.map((item) => {
          let msg = JSON.parse(JSON.stringify(item))
          arr.push(msg);
        });
        for (let ite of data.formData[fatherObj]) {
          if (id == ite.id) {
            ite.declareFalg = true
            data.formData[fatherObj][index][fileName] = arr
          }
        }
      } else {
        data.formData[fatherObj][index][fileName] = []
        data.formData[fatherObj][index].declareFalg = true
      }
    };

    //保存报关信息
    const save = item => {
      data.btnFlag = true
      api.documentList.saveFile(item).then(res => {
        if (res.code == 200) {
          data.btnFlag = false
          vue.$message.success(res.msg)
          item.declareFalg = false
          // closeFile()

        } else {
          data.btnFlag = false
          vue.$message.warning(res.msg)
        }
      }).catch(() => {
        data.btnFlag = false
      })

    }

    //保存清关信息
    const saveClearance = item => {
      data.btnFlag = true
      api.documentList.saveClearanceFile(item).then(res => {
        if (res.code == 200) {
          data.btnFlag = false
          data.clearanceFalg = false
          vue.$message.success(res.msg)
          // closeFile()
        } else {
          data.btnFlag = false
          vue.$message.warning(res.msg)
        }
      }).catch(() => {
        data.btnFlag = false
      })

    }

    //提交审核
    const submitAudit = item => {
      if (item.otherFile.length > 0 && item.baseFile.length > 0 && item.ladingFile.length > 0) {
        data.btnFlag = true
        api.documentList.submitAudit({ id: item.id }).then(res => {
          if (res.code == 200) {
            data.btnFlag = false
            vue.$message.success(res.msg)
            getFile(data.formData.shippingId)
          } else {
            data.btnFlag = false
            vue.$message.warning(res.msg)
          }
        }).catch(() => {
          data.btnFlag = false
        })
      } else {
        vue.$message.warning('请检查文件是否都已上传！')
      }

    }

    //审核失败
    const auditWaring = (item, type) => {
      if (type == 'pop') {
        data.auditRemarkItem = item
        data.dialogVisible = true
      } else if (type == 'save') {
        submitAudit(item)
        data.dialogVisible = false
        data.auditRemarkItem = {}
      }
    }

    //关闭弹窗
    const closeFile = () => {
      data.formData = {
        shippingId: '',
        declare: [],
        clearance: [],
      }
      data.activeName = 'declare'
      for (let item of data.formData.declare) {
        let name = item.id + 'otherFileUpload'
        let name1 = item.id + 'baseFileUpload'
        let name2 = item.id + 'ladingFileUpload'
        nextTick(() => {
          if (vue.$refs[name] && vue.$refs[name].length > 0) {
            vue.$refs[name][0].removeBefore();
          }
          if (vue.$refs[name1] && vue.$refs[name1].length > 0) {
            vue.$refs[name1][0].removeBefore();
          }
          if (vue.$refs[name2] && vue.$refs[name2].length > 0) {
            vue.$refs[name2][0].removeBefore();
          }
        });
      }

      nextTick(() => {
        console.log('vue.$refs.actualInvoiceFileUpload', vue.$refs.actualInvoiceFileUpload)
        if (vue.$refs.actualInvoiceFileUpload && vue.$refs.actualInvoiceFileUpload.length > 0) {
          vue.$refs.actualInvoiceFileUpload[0].removeBefore();
        }
        if (vue.$refs.taxBaseFileUpload && vue.$refs.taxBaseFileUpload.length > 0) {
          vue.$refs.taxBaseFileUpload[0].removeBefore();
        }
      });
      data.maintenanceVisible = false;

    };

    return {
      ...refData,
      getMsg,
      pushFile,
      removeFileBook,
      pushFileClearance,
      removeFileBookClearance,
      closeFile,
      save,
      submitAudit,
      saveClearance,
      auditWaring
    };
  },
};
</script>
<style scoped lang='scss'>
#DataMaintenance {
  .padding {
    padding: 10px 0
  }

  .doc-title {
    font-size: 15px;
    font-weight: bold;
    line-height: 30px;
  }

  .as-around {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .flex {
    display: flex;
    justify-content: space-between;
    padding: 10px 0
  }

  .as-margin-top {
    margin-top: 10px;
  }


  .flex-pop {
    display: flex;
    width: 100%;

    .left-label {
      font-size: 15px;
      width: 120px
    }

    .left-auditRemark {
      width: 100%;
      line-height: 20px
    }
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
  }


}
</style>