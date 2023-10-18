<template>
  <div class="box">
    <div class="forms">
      <div class="tips">
        <span class="login-btn" ref="loginBtn">login</span>
      </div>
      <div class="login" @click="loginBtnClick" ref="login">
        <q-form @submit="login">

          <div class="form-title">
            <h3>
              <q-avatar>
                <q-img fit="cover"
                       src="@/assets/logo.svg"></q-img>
              </q-avatar>
              Jill-Admin Login v0.0.1 青春版
            </h3>
          </div>
          <div class="form q-gutter-md">
            <div class="username ">
              <q-input outlined dense debounce="500" lazy-rules placeholder="用户名：" hide-bottom-space bg-color="white"
                       square
                       v-model.trim="loginData.username" class="ipts">
              </q-input>
              <!--            <input type="text" class="ipts">-->
            </div>
            <div class="password ">
              <q-input
                  outlined :type="isPwd ? 'password' : 'text'" dense bg-color="white" placeholder="密码：" debounce="500"
                  hide-bottom-spacelazy-rules square
                  v-model.trim="loginData.password">
                <template v-slot:append>
                  <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>

            <q-input v-show="false" outlined dense debounce="500" placeholder="验证码：" bg-color="white" lazy-rules
                     hide-bottom-space
                     square
                     v-model.trim="loginData.captcha">
              <template v-slot:after>
                <img :src="verificationImg" @click="captcha">
              </template>
            </q-input>
            <div class="other-select">
              <div class="rem-pwd">
                <input type="checkbox" id="check">
                <label for="check" class="rem-pwd-tips">remember password</label>
              </div>
              <span class="fogot-pwd-btn" ref="fogotPwd" @click="fogotPwdBtnClick">忘记密码</span>
            </div>
            <q-btn dense unelevated label="登 录" size="17px" color="black"
                   class=" full-width no-border-radius q-pa-none btn"
                   type="submit" :loading="loading">
              <template v-slot:loading>
                <q-spinner-ios class="on-left"/>
                登录...
              </template>
            </q-btn>
            <div class="other-login">
              <span>Other login methods</span>
              <div class="login-img">
                <img src="@/assets/css/login/QQ.png" alt="">
                <img src="@/assets/css/login/wechat-fill.png" alt="">
              </div>
            </div>
          </div>


          <q-inner-loading :showing="loading">
            <q-spinner-gears size="50px" color="primary"/>
          </q-inner-loading>
        </q-form>
      </div>
    </div>

  </div>

</template>

<script>
import Cookie from "@/boot/cookie";
import {useNotify} from "@/boot/useNotify";
import '@/assets/css/login/index'

export default {
  components: {},
  data() {
    return {
      activeTab: 'login',
      loginData: {
        username: 'admin',
        password: '123456',
        timestamp: null,
        loginType: 'DEFAULT'
      },
      registerData: {
        username: '',
        password: '',
        email: '',
      },
      autoLogin: true,
      isPwd: true,
      loading: false,
      verificationImg: 'null',
      dragging: false,
      startX: 0,
      thumbPosition: '0px',
      message: 'Slide to verify',
    };
  },
  mounted() {
    this.captcha();
  },
  methods: {
    login() {
      // Cookie.setCookies(Cookie.TOKENNAME, "dasffsd");
      // this.$store.commit('setToken', "fasdfasdf")
      // this.$router.push('/home');
      //
      // return
      this.loading = true;
      this.$store.dispatch('user/loginActions', this.loginData).then(res => {
        if (res.flag) {
          this.$axios.get('/sysUser/me', {params: {token: res.data}}).then(res => {
            console.log("me=>", res)
            Cookie.setCookies(Cookie.USERINFO, res.data, true, 7)

            this.$axios.get("/sysUser/menulist", {params: {userId: res.data.userId}}).then(res_3 => {
              if (res_3.flag) {
                Cookie.setLocalKeyValue(Cookie.MENULIST, res_3.data)
                useNotify().infoNotify(res.message)
                // this.$router.push('/home');
                this.$router.push('/loading');
              }

            }).catch(error => {
              console.log("menulist-error=>", error)
            })
          }).catch(err => {
            console.log("me-err=>", err)
          })
        }
      }).catch(err => {
        console.log('login-err', err)
      }).finally(() => {
        this.loading = false;
      })


    },
    register() {
      // 在此处编写注册逻辑
      console.log('Register Data:', this.registerData);
      // 根据实际需求进行注册操作，例如发送注册请求等
    },
    captcha() {
      this.loginData.timestamp = new Date().getTime();
      this.$axios.get("/sysUser/captcha", {
        params: {
          timestamp: this.loginData.timestamp
        }
      }).then(res => {
        if (res.flag) {
          this.verificationImg = 'data:image/png;base64,' + res.data
        } else {
          this.$q.notify({
            color: 'white',
            textColor: 'red',
            message: '请求错误',
            position: 'center',
            timeout: 2000,
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    loginBtnClick() {
      this.$refs.login.style.opacity = '1'
      this.$refs.login.style.animation = 'into 1s ease'
      this.$refs.login.style.zIndex = '10'
      this.$refs.fogotPwd.style.opacity = '0'
      this.$refs.fogotPwd.style.zIndex = '-1'
      this.$refs.fogotPwd.style.animation = 'none'
      this.$refs.loginBtn.style.borderBottom = '4px solid rgb(249, 177, 122)'
      this.$refs.loginBtn.style.color = '#fff'
    },
    fogotPwdBtnClick() {
      this.$refs.login.style.opacity = '0'
      this.$refs.login.style.zIndex = '-1'
      this.$refs.login.style.animation = 'none'
      this.$refs.fogotPwd.style.opacity = '1'
      this.$refs.fogotPwd.style.zIndex = '10'
      this.$refs.fogotPwd.style.animation = 'into 1s ease'
    },
  },

};
</script>

<style scoped lang="scss">
@import "@/assets/css/login/style";
@import "@/assets/css/login/style.css";

</style>
