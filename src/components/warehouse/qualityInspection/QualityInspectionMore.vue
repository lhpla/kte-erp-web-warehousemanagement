<!-- 质检  更多  展示 -->
<template>
  <div id="QualityInspectionMore">
    <el-dialog title="更多" v-model="dialogVisible" width="50%" :close-on-click-modal="false" :before-close="handleClose" :close-on-press-escape="false">
      <div v-show="purchaseAbnormalListVo && purchaseAbnormalListVo.length < 1">暂无数据</div>
      <div v-show="purchaseAbnormalListVo && purchaseAbnormalListVo.length >= 1">
        <span v-for="(item, index) in purchaseAbnormalListVo" :key="index">
          <div>
            <el-tag class="tags-class">
              {{ tableTypeComputed(warehouse_abnormal_type, item.abnormalType) }}
            </el-tag>
          </div>
          <div v-show="!text" class="text">
            {{ item.context }}
          </div>
          <div v-show="text" class="tags-class">
            <span v-for="(url, ind) of item.imageUrl" :key="ind">
              <span v-show="url">
                <el-popover placement="right" trigger="hover" width="250">
                  <template #reference>
                    <el-image style="width: 100px; height: 90px" fit="contain" :src="url"></el-image>
                  </template>
                  <el-image :src="url" style="width: 400px; height: 300px" fit="contain"></el-image>
                </el-popover>
              </span>
            </span>
          </div>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, computed } from "vue";
import { localGet } from "@/utils/util";
export default {
  name: "QualityInspectionMore",
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      purchaseAbnormalListVo: [],
      text: "",
      warehouse_abnormal_type: [], // 异常类型
    });

    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const refData = toRefs(data);
    // 获取信息
    const getMsg = (text, purchaseAbnormalListVo) => {
      data.warehouse_abnormal_type = localGet("purchaseDict") && localGet("purchaseDict").warehouse_abnormal_type ? localGet("purchaseDict").warehouse_abnormal_type : [];
      data.dialogVisible = true;
      data.text = text == "img";
      data.purchaseAbnormalListVo = purchaseAbnormalListVo;
    };

    // 关闭
    const handleClose = () => {
      data.dialogVisible = false;
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
    return {
      ...refData,
      handleClose,
      getMsg,
      tableTypeComputed,
    };
  },
};
</script>
<style scoped lang='scss'>
#QualityInspectionMore {
  .tags-class {
    margin-bottom: 10px;
  }

  .text {
    line-height: 40px;
    margin-bottom: 10px;
  }
}
</style>
