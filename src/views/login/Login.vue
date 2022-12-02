<!--登录页面-->
<template>
  <div class="login-container">
    <div class="login-headBox">
      <div class="login-head">
        <div class="login-logo"></div>
      </div>
    </div>
    <div class="login-box">
      <div class="login-bg">
        <div class="login-logBox">
          <div class="login-all">
            <div class="box-top">康特恩ERP管理系统</div>
            <div class="box-input">
              <el-form :model="formLabel" :rules="rules" ref="userLoginForm">
                <el-form-item prop="username">
                  <el-input v-model.trim="formLabel.username" placeholder="账户" prefix-icon="el-icon-user"
                    @keyup.enter="submitForm"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input :type="flag ? 'text' : 'password'" v-model.trim="formLabel.password" placeholder="密码"
                    @keyup.enter="submitForm">
                    <template #prefix>
                      <i name="prefix" :class="flag ? 'el-icon-unlock' : 'el-icon-lock'" @click="flag = !flag"></i>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="loginActive" @click="submitForm">登录</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  ref,
} from 'vue'
import { ElMessage } from 'element-plus'
import { localSet, localRemove, localGet } from '../../utils/util'
import { useStore } from 'vuex'
import md5 from 'js-md5'

export default {
  name: 'Login',
  setup(props, ctx) {
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    // 获取用户表单DOM
    const userLoginForm = ref(null)
    const data = reactive({
      // 登录按钮状态
      loginActive: false,
      // 自适应宽度
      screenWidth: '',
      flag: false,
      // 用户信息
      formLabel: {
        username: 'admin',
        password: '123456',
        grant_type: 'password',
        scope: 'all',
      },
      // 用户信息校验
      rules: {
        username: [
          { required: 'true', message: '账户不能为空', trigger: 'blur' },
        ],
        password: [
          { required: 'true', message: '密码不能为空', trigger: 'blur' },
        ],
      },
    })
    onBeforeMount(() => { })
    onMounted(() => {
      // console.log(vue.$store);
      window.onresize = () => {
        return (() => {
          data.screenWidth = document.body.clientWidth
        })()
      }
    })
    // 用户登录
    const submitForm = () => {
      let printSet = localGet('printSet') ? localGet('printSet') : []
      localStorage.clear()
      localSet("printSet", printSet)
      userLoginForm.value.validate((valid) => {
        if (valid) {
          data.loginActive = true
          let password = md5(data.formLabel.password)
          let formLabel = {
            username: data.formLabel.username,
            password: password,
            grant_type: 'password',
            scope: 'all',
          }
          api.login
            .userLogin(formLabel)
            .then((res) => {
              let token = res.token_type + ' ' + res.access_token
              if (token) {
                let startTime = Date.now()
                let endTime = startTime + 1000 * 60 * 60 * 8
                localSet('Kte-token', token)
                localSet('userInfo', res)
                localSet('endtime', endTime)
                ElMessage.success('登录成功！')
                data.loginActive = false
                api.system.getBtnFromMenu().then((res) => {
                  if (res.data) {
                    localSet('authorButton', res.data)
                    vue.$router.push('/')
                  }
                })
              }
            })
            .catch((error) => {
              data.loginActive = false
            })
        }
      })
    }
    const refData = toRefs(data)

    return {
      ...refData,
      submitForm,
      userLoginForm,
    }
  },
}
</script>
<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100%;
}

.login-headBox {
  width: 100%;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
  // background: red;
}

.login-head {
  // width: 1400px;
  // min-width: 1440px;
  width: 100%;
  padding: 10px 0 0px 0;
  height: 100%;
  // background: #378ae0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.login-logo {
  background: url('../../assets/images/logo-big02.png') no-repeat;
  width: 250px;
  height: 100px;
}

.login-box {
  width: 100%;
  margin: auto;
}

.login-bg {
  background: url('../../assets/images/bg.png');
  // width: 1920px;
  height: 560px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-logBox {
  width: 55%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.login-all {
  width: 348px;
  height: 356px;
  background-color: #fff;
  padding: 0 30px;
  box-sizing: border-box;
}

.box-top {
  color: #666;
  font-size: 16px;
  margin: 25px 0 10px 0;
  line-height: 55px;
}

.el-input {
  margin: 0px auto 0;
}

.el-button--primary {
  height: 48px;
  width: 100%;
  margin: 10px auto 25px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #378ae0;
}
</style>
