<!-- 供应商公共 -->
<template>
  <div id="SupplierPublic">
    <el-popover placement="bottom" :width="400" ref="supplierComRef" trigger="click" @show="showClick">
      <template #reference>
        <el-input clearable v-loading="loading" element-loading-spinner="el-icon-loading" v-model.trim="supplierName"
          placeholder="请选择" @input="changeSupplierName" @change="changeSupplierName">
        </el-input>
      </template>
      <div class="virtual" @scroll="scroll" :style="{ height: 200 + 'px' }" v-if="visiablelist.length">
        <div class="list" :style="{ height: dataLength * itemHeight + 'px' }">
          <ul v-loading="labelLoading" :style="{ 'margin-top': `${scrollTop}px` }">
            <li v-for="item in visiablelist" :key="item.id"
              :class="supplierName == item.supplierName ? 'activeClass' : ''" :style="{ height: itemHeight + 'px' }"
              @click="Select(item)">
              {{ item.supplierName }}
            </li>
          </ul>
        </div>
      </div>
      <div v-else>无匹配数据</div>
    </el-popover>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  computed,
  onMounted,
  getCurrentInstance,
  onActivated,
  watch,
  nextTick,
} from "vue";
import { debounce } from "../../utils/util";
export default {
  name: "SupplierPublic",
  props: {},
  setup(props, ctx) {
    const itemHeight = 40;
    const data = reactive({
      loading: true,
      labelLoading: false,
      scrollTop: 0,
      startIndex: 0,
      endIndex: 10,
      supplierList: [],
      dataLength: 0,
      supplierName: "",
      supplierList1: [],
    });

    const getName = (e) => {
      data.supplierName = e;
    };

    const { ctx: vueDev, proxy: vue } = getCurrentInstance();

    const api = vue.$http;

    function scroll(e) {
      console.log(e.target.scrollTop);
      let scrollTop = e.target.scrollTop;
      data.scrollTop = e.target.scrollTop;
      data.startIndex = Math.floor(scrollTop / itemHeight);
      data.endIndex = data.startIndex + 10;
    }
    const reastValue = () => {
      data.supplierName = "";
    };
    const getSupplier = () => {
      // 获取供应商列表
      api.provider
        .getSupplierListAll()
        .then((res) => {
          if (res.code == 200) {
            data.supplierList = res.data;
            data.supplierList1 = res.data;
            data.dataLength = res.data.length;
            data.loading = false;
          } else {
            data.loading = false;
          }
        })
        .catch((err) => {
          data.loading = false;
        });
    };
    //当前选中赋值
    const Select = (e) => {
      console.log(vue.$refs.supplierComRef);
      if (e) {
        data.supplierName = e.supplierName;
        //选择后关闭弹框
        nextTick(() => {
          vue.$refs.supplierComRef.hide();
        });
        vue.$emit("handChange", e.id, e.supplierName);
      } else {
        data.supplierName = "";
      }
    };
    onMounted(() => {
      getSupplier();
    });
    //供应商切换
    const changeName = flag => {
      let supplierList1 = data.supplierList1;
      data.scrollTop = 0;
      let e = data.supplierName;
      if (e && e != "") {
        let dupplierArr = [];
        data.labelLoading = true;
        supplierList1.map((item, index) => {
          if (item.supplierName.indexOf(e) !== -1) {
            if (item.supplierName == e) {
              vue.$emit("handChange", item.id, item.supplierName);
            }
            dupplierArr.push(item);
          }
          data.labelLoading = false;
        });

        data.supplierList = dupplierArr;
        data.dataLength = data.supplierList.length;
        data.startIndex = 0;
        data.endIndex = 10;
        if (data.dataLength == 0) {
          data.supplierName = ""
          changeName(true)
          vue.$message.warning('输入正确的供应商!')
        } else {
          if (document.querySelector(".virtual .list") != null) {
            nextTick(() => {
              console.log(document.querySelector(".virtual .list"));
              document.querySelector(".virtual .list").style.height = 210 + "px";
              document.querySelector(".virtual .list").scrollTop = 0;
              document.querySelector(".virtual .list").style.height =
                data.dataLength * 40 + "px";
            });
          }
        }
      } else {
        data.startIndex = 0;
        data.endIndex = 10;
        data.labelLoading = false;
        data.supplierList = data.supplierList1;
        data.dataLength = data.supplierList.length;
        if (!flag) {
          vue.$emit("handChange", "");
        }
        if (document.querySelector(".virtual .list") != null) {
          nextTick(() => {
            document.querySelector(".virtual .list").style.height = 210 + "px";
            document.querySelector(".virtual .list").scrollTop = 0;
            document.querySelector(".virtual .list").style.height =
              data.dataLength * 40 + "px";
          });
        }
      }
    };
    const visiablelist = computed(() => {
      return data.supplierList.slice(data.startIndex, data.endIndex);
    });

    const showClick = () => {
      if (document.querySelector(".virtual .list") != null) {
        nextTick(() => {
          document.querySelector(".virtual .list").style.height = 210 + "px";
          document.querySelector(".virtual .list").scrollTop = 0;
          document.querySelector(".virtual .list").style.height =
            data.dataLength * 40 + "px";
        });
      }
    };

    //
    const changeSupplierName = debounce(changeName, 500);

    return {
      ...toRefs(data),
      scroll,
      visiablelist,
      itemHeight,
      Select,
      changeName,
      getName,
      changeSupplierName,
      getSupplier,
      reastValue,
      showClick,
    };
  },
};
</script>
<style scoped lang="scss">
.virtual {
  overflow: auto;
  width: 100%;

  .list {
    overflow: hidden;
    background: transparent;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        line-height: 40px;
        padding-left: 10px;
      }

      .activeClass {
        color: #fff;
        background: #409eff;
      }
    }
  }
}

.virtual::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  /**/
}

.virtual::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}

.virtual::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 10px;
}

.virtual::-webkit-scrollbar-thumb:hover {
  background: #333;
}

.virtual::-webkit-scrollbar-corner {
  background: #179a16;
}
</style>
