<!-- 自定义港口 -->
<template>
  <div id="CustomPort">
    <el-dialog :title="title" width="60%" v-model="visible" :close-on-click-modal="false" @close="closed" :close-on-press-escape="false"
      <div class="form">
        <template v-for="(item, listIndex) in portList" :key="item.index">
          <el-form :model="item" label-width="120px"  class="form-item" :ref="`portListRef${item.index}`">
            <el-form-item prop="port" :rules="[
              { required: true, message: '请输入', trigger: 'blur' },
              { max: 10, message: '长度不超过10字符', trigger: 'blur' },
            ]">
              <el-input v-model="item.port" clearable class="input-with-input" maxlength="100">
                <template #append>
                  <el-button @click="deletePort(listIndex)" ><el-icon><ElDelete /></el-icon></el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </template>
        <div style="margin-left: 5%">
          <el-button size="small" type="primary" @click="addPort" :loading="btnFlag" :disabled="btnFlag">添加港口</el-button>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="closed" :loading="btnFlag" :disabled="btnFlag">取 消</el-button>
          <el-button size="small" type="primary" @click="onSubmit" :loading="btnFlag" :disabled="btnFlag">确 定</el-button>
        </span>
      </template>
    </el-dialog>
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
  watch,
  inject,
} from "vue";

export default {
  name: "CustomPort",
  props: ["objectiveList", "DepartureList"],

  setup(prop, ctx) {
    const data = reactive({
      visible: false,
      title: "目的港口-自定义",
      btnFlag: false,
      ruleForm: {},
      portList: [],
      copePortList: [],
      objectiveList: [],
      DepartureList: [],
      startOrEnd: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    watch(
      () => prop.objectiveList,
      (newVal) => {
        data.objectiveList = newVal;
      },
      {
        deep: true,
        immediate: true,
      }
    );
    watch(
      () => prop.DepartureList,
      (newVal) => {
        data.DepartureList = newVal;
      },
      {
        deep: true,
        immediate: true,
      }
    );
    const refRuleForm = ref();
    //打开弹窗
    const openDialog = (title) => {
      data.title = title;
      if (data.title == "起运港口-自定义") {
        data.portList = JSON.parse(JSON.stringify(data.DepartureList));
        data.startOrEnd = true;
      } else {
        data.portList = JSON.parse(JSON.stringify(data.objectiveList));
        data.startOrEnd = false;
      }
      data.copePortList = JSON.parse(JSON.stringify(data.portList));
      data.portList.map((item, index) => {
        item.index = index;
        // data.ruleForm[`${item.index}__port`] = item.port;
      });

      data.visible = true;
    };
    // 关闭弹窗
    const closed = () => {
      data.visible = false;
    };

    // 添加港口
    const addPort = () => {
      if (data.portList.length == 0) {
        data.portList.push({
          port: "",
          index: 0,
        });
      } else {
        data.portList.push({
          port: "",
          index: data.portList[data.portList.length - 1].index + 1,
        });
      }
    };
    // 删除港口
    const deletePort = (index) => {
      data.portList.splice(index, 1);
    };

    const getPortList = inject("getPortList");
    // customizePort
    const onSubmit = () => {
      const validateMethods = [];
      data.portList.forEach((item) => {
        if (vue.$refs[`portListRef${item.index}`]) {
          validateMethods.push(
            vue.$refs[`portListRef${item.index}`][0].validate()
          );
        }
      });

      Promise.all(validateMethods)
        .then((res) => {
          data.btnFlag = true;
          const ports = ref([]);
          let obj = {};
          for (let item in data.portList) {
            let itemPort = data.portList[item].port;
            if (!obj[itemPort]) {
              obj[itemPort] = {
                count: 0,
              };
            } else {
              obj[itemPort].count++;
            }
            if (data.portList[item].id) {
              ports.value.push({
                port: data.portList[item].port,
                portId: data.portList[item].id,
                startOrEnd: data.startOrEnd,
              });
            } else {
              if (data.copePortList.length == 0) {
                ports.value.push({
                  port: data.portList[item].port,
                  startOrEnd: data.startOrEnd,
                });
              } else {
                data.copePortList.forEach((ite, index) => {
                  if (data.portList[item].port == ite.port && ite.id) {
                    ports.value.push({
                      port: data.portList[item].port,
                      portId: ite.id,
                      startOrEnd: data.startOrEnd,
                    });
                  } else if (index == data.copePortList.length - 1) {
                    ports.value.push({
                      port: data.portList[item].port,
                      startOrEnd: data.startOrEnd,
                    });
                  }
                });
              }
            }
          }
          let keys = Object.values(obj);
          for (let i in keys) {
            if (keys[i].count > 0) {
              vue.$message.warning("存在相同港口，请检查");
              data.btnFlag = false;
              return;
            }
          }
          const info = {
            ports: ports.value,
            type: data.startOrEnd,
          };
          api.warehouse
            .customizePort(info)
            .then((res) => {
              if (res.code == 200) {
                vue.$message.success({
                  message: res.msg,
                  type: "success",
                });
                closed();
                getPortList(data.startOrEnd);
                data.btnFlag = false;
              }
            })
            .catch((err) => {
              data.btnFlag = false;
              // vue.$message.error(err);
            });
        })
        .catch((err) => {
          if (err) {
            vue.$message.error("表单填写有误,请检查");
          }
        });
    };
    const refData = toRefs(data);

    return {
      ...refData,
      closed,
      onSubmit,
      refRuleForm,
      openDialog,
      addPort,
      deletePort,
    };
  },
};
</script>
<style scoped lang="scss">
#CustomPort {
  :deep(.el-dialog__header) {
    margin-right: 0;
  }

  .input-with-input {
    background-color: var(--el-fill-color-blank);
  }

  .form {
    display: flex;
    flex-wrap: wrap;

    ::v-deep .el-form-item__content {
      margin-left: 0 !important;
    }

    .form-item {
      margin-left: 5%;
      width: 20%;
    }
  }
}
</style>
