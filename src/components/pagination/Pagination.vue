<!-- 分页组件 -->
<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination :background="background" v-model:current-page="page" v-model:page-size="limit"
      :page-sizes="pageSizes" :layout="layout" :total="total" :pager-count="pagerCount" v-bind="$attrs"
      @size-change="handleSizeChange" @current-change="handleCurrentChange">
      <span class="pageSizeInput">
        <el-input style="height: 28px" class="pageSizeBorder" type="number" @blur="handlePageSize"
          v-model.number="limits" @keyup.enter="handlePageSize"></el-input>
        条/页
      </span>
    </el-pagination>
  </div>
</template>

<script>
import { reactive, toRefs, computed, getCurrentInstance } from 'vue'
export default {
  name: 'Pagination',
  props: {
    hidden: {
      // 控制 分页是否出现，这里一般设置total小于等于0的时候，将分页组件隐藏。
      type: Boolean,
      default: false,
    },
    total: {
      // 数据总条数
      required: true,
      type: Number,
    },
    page: {
      // 当前页
      type: Number,
      default: 1,
    },
    limit: {
      // 每页显示条目个数， 限制 每页多少条数据
      type: Number,
      default: 10,
    },
    pageSizes: {
      // 每页显示个数选择器的选项设置,下拉选择框的选项值
      type: Array,
      default() {
        return [10, 40, 50, 80, 100]
      },
    },
    layout: {
      // 组件布局
      type: String,
      default: 'total, prev, pager,sizes, next, jumper,slot',
    },
    background: {
      // 是否为分页按钮添加背景色，默认有背景，数字在蓝色的小框内的样式
      type: Boolean,
      default: true,
    },
    pagerCount: {
      // 页码按钮的数量， 默认显示7个数，当总页数超过该值时会折叠,注意这里：它必须是 大于等于 5 且小于等于 21 的奇数
      type: Number,
      default: 7,
    },
  },

  setup(prop, ctx) {
    const data = reactive({
      limits: 10,
      flag: false,
    })
    const { ctx: vueDev, proxy: vue, parent } = getCurrentInstance()
    const pageSize = computed({
      get: () => {
        return limit
      },
      set: (val) => { },
    })

    //条数触发校验
    const handlePageSize = () => {
      data.flag = true
      let regN = /^[a-zA-Z0-9_]{0,}$/
      if (!regN.test(data.limits)) {
        data.flag = false
        return vue.$message.warning('请输入大于0,小于500的正整数,不可输入符号')
      }
      let reg = /^\+?[1-9]\d*$/
      if (!reg.test(data.limits)) {
        data.flag = false
        return vue.$message.warning('请输入大于0,小于500的正整数,不可输入符号')
      }
      if (data.limits > 500) {
        data.flag = false
        return vue.$message.warning('请输入大于0,小于500的正整数,不可输入符号')
      }
      if (data.flag) {
        if (parent.ctx.myPages && parent.ctx.myPages.pageSize) {
          parent.ctx.myPages.pageSize = data.limits
        } else if (parent.ctx.myPages && parent.ctx.myPages.size) {
          parent.ctx.myPages.size = data.limits
        }

        vue.$emit('handleSizeChange', data.limits)
      }
    }
    const handleSizeChange = (val) => {
      data.limits = val
      vue.$emit('handleSizeChange', val)
    }
    const handleCurrentChange = (val) => {
      if (val == 'Infinity') {
        vue.$emit('handleCurrentChange', 1)
      } else {
        vue.$emit('handleCurrentChange', val)
      }
    }

    const refData = toRefs(data)
    return {
      ...refData,
      handleSizeChange,
      handleCurrentChange,
      pageSize,
      handlePageSize,
    }
  },
}
</script>
<style lang="scss" scoped>
.pagination-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;

  .refresh_icon {
    width: 32px;
    color: #409eff;
    margin: 8px 0 0 15px;
    cursor: pointer;
    font-weight: 600;
    font-size: 18px;
  }

  :deep(.el-input__suffix) {
    margin-right: 10px;
  }

  .pageSizeInput {
    // width: 80px;
    color: #606266;
    font-weight: 400;

    :deep(.el-input__inner) {
      height: 28px;
      padding: 0 3px;
    }

    :deep(.el-input) {
      width: 50px;
      line-height: 28px;
      margin-left: 8px;
    }
  }
}

.isFixed {
  position: static !important;
  //display: flex;
  //justify-content: flex-end;
  bottom: 0;
  right: 0;
  //width: 50%;
  //max-width: 80%;
  border: none;
  background: #fff;
  border-radius: 50px;
  /* margin: 60px 40px; */
  //margin: 15px 15px;
  z-index: 1100;
  //padding: 5px 20px
}

// .hidden {
//   display: none;
// }
</style>
