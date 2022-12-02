import {
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  nextTick
} from "vue";
import {
  localSet
} from "../utils/util";
import {
  useStore
} from "vuex";

const changeRoute = () => {
  const {
    ctx: vueDev,
    proxy: vue
  } = getCurrentInstance();
  const api = vue.$http;
  onBeforeMount(() => {});
  onMounted(() => {});
  const store = useStore();
  // 根据传入路径 获取其最上级菜单id  用于除菜单栏跳转页面所有本站内部跳转
  // path   跳转路径
  //querys  携带参数
  //target  是否新窗口打开
  const getModuleID = (url, path, querys = {}, target = "_self") => {
    if (path && path != "") {
      api.system
        .getMenuByPath({
          path: path
        })
        .then(res => {
          console.log('path', res);
          if (res.code == 200 && res.data.status) {
            // 存入传入path 相对应的id
            store.commit("aside/changeActiveNum", res.data.menuId);
            store.commit("tabMenu/setTabMenuValue", res.data.menuId);
            localSet("tabMenuValue", res.data.menuId);
            localSet("menuActive", {
              topMenuId: res.data.topMenuId
            });
            nextTick(() => {
              let query = {
                fId: res.data.topMenuId
              };
              if (querys.orderCode) {
                query.orderCode = querys.orderCode;
                delete query.fId;
              }

              const {
                href
              } = vue.$router.resolve({
                path: url + path,
                query: Object.assign(query, querys ? querys : {})
              });
              window.open(href, target);
            });
          } else {
            vue.$message({
              type: "warning",
              message: "暂无权限访问该页面!"
            });
          }
        });
    } else {
      vue.$message({
        type: "error",
        message: "传入参数错误"
      });
    }
  };

  return {
    getModuleID
  };
};

export default changeRoute;